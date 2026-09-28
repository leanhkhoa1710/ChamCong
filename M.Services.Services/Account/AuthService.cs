using M.Contract.Repositories.Entities;
using M.Contract.Repositories.Entity;
using M.Contract.Services.Interface;
using M.Core.Base;
using M.Core.Utils;
using M.Repositories.Context;
using M.Services.Mappings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ModelViews.ActivationCodeModelView;
using ModelViews.AuthModelView;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using static M.Core.Base.BaseException;

namespace M.Services.Service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly DatabaseContext _dbContext;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            DatabaseContext dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _dbContext = dbContext;
        }

        #region Register

        public async Task RegisterAsync(RegisterModelView model)
        {
            model.Email = model.Email.Trim();
            model.Username = model.Username.Trim();

            if (string.IsNullOrEmpty(model.Username))
                throw new BadRequestException(
                    "INVALID_USERNAME",
                    "Username cannot be empty");

            if (string.IsNullOrEmpty(model.Email) ||
                !MailAddress.TryCreate(model.Email, out _))
                throw new BadRequestException(
                    "INVALID_EMAIL",
                    "Email is not valid");

            if (string.IsNullOrEmpty(model.Password) ||
                model.Password != model.ConfirmPassword)
                throw new BadRequestException(
                    "INVALID_PASSWORD",
                    "Password cannot be empty or does not match");

            ValidatePasswordPolicy(model.Password);

            // Ki?m tra username
            if (await _userManager.FindByNameAsync(model.Username) != null)
                throw new BadRequestException(
                    "DUPLICATE_USERNAME",
                    "Username already exists");

            // Ki?m tra email
            if (await _userManager.FindByEmailAsync(model.Email) != null)
                throw new BadRequestException(
                    "DUPLICATE_EMAIL",
                    "Email already exists");

            ApplicationUser user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                EmailConfirmed = true
            };

            IdentityResult createResult =
                await _userManager.CreateAsync(user, model.Password);

            if (!createResult.Succeeded)
            {
                throw new BadRequestException(
                    "INVALID_INPUT",
                    createResult.Errors.FirstOrDefault()?.Description
                    ?? "Unknown error occurred");
            }

            await _userManager.AddToRoleAsync(user, "User");

            Employee employee = new Employee
            {
                UserId = user.Id,
                EmployeeCode = model.Username,
                GivenName = model.Username,
                FamilyName = string.Empty,
                Email = model.Email,
                BirthDate = null,
                Gender = GenderType.RatherNotSay,
                Status = EmployeeStatus.Probation,
                LaborType = LaborType.FullTime,
                StartDate = DateTime.UtcNow
            };

            await _dbContext.Set<Employee>().AddAsync(employee);
            await _dbContext.SaveChangesAsync();
        }

        #endregion

        #region Login

        public async Task<AuthResponseModelView> LoginAsync(
            LoginModelView loginModelView)
        {
            string login = loginModelView.Username?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(login))
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Username, email, phone number or employee code is required.");
            }

            if (string.IsNullOrWhiteSpace(loginModelView.Password))
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Password is required.");
            }

            // =====================================================
            // Tìm user linh ho?t: Username / Email / Phone
            // Không yêu c?u EmailConfirmed / PhoneNumberConfirmed
            // =====================================================

            ApplicationUser? user = await _userManager.Users
                .FirstOrDefaultAsync(x =>
                    x.UserName == login ||
                    x.Email == login ||
                    x.PhoneNumber == login);

            if (user == null)
            {
                // Fallback: tìm theo Mã nhân viên (Tên ??ng nh?p = Mã nhân viên)
                Employee? employeeByCode = await _dbContext.Set<Employee>()
                    .FirstOrDefaultAsync(x =>
                        x.EmployeeCode == login &&
                        !x.DeletedTime.HasValue &&
                        x.UserId.HasValue);

                if (employeeByCode?.UserId.HasValue == true)
                {
                    user = await _userManager.Users
                        .FirstOrDefaultAsync(x =>
                            x.Id == employeeByCode.UserId.Value);
                }
            }

            if (user == null)
            {
                throw new ErrorException(
                    StatusCodes.Status404NotFound,
                    ResponseCodeConstants.NOT_FOUND,
                    "Account not found.");
            }

            if (user.DeletedTime.HasValue)
            {
                throw new ErrorException(
                    StatusCodes.Status403Forbidden,
                    ResponseCodeConstants.FORBIDDEN,
                    "User account has been deactivated.");
            }

            // =====================================================
            // Ki?m tra tr?ng thái khóa tài kho?n (lockout)
            // =====================================================


            // =====================================================
            // Ki?m tra password (cho phép lockout khi sai)
            // =====================================================

            SignInResult result =
                await _signInManager.PasswordSignInAsync(
                    user,
                    loginModelView.Password,
                    loginModelView.RememberMe,
                    lockoutOnFailure: false);

            if (!result.Succeeded)
            {
                throw new ErrorException(
                    StatusCodes.Status401Unauthorized,
                    ResponseCodeConstants.UNAUTHORIZED,
                    "Username, email/phone/employee code or password is incorrect.");
            }

            // =====================================================
            // L?y Employee (optional - h? tr? tài kho?n admin thu?n)
            // =====================================================

            Employee? employee = await _dbContext.Set<Employee>()
                .FirstOrDefaultAsync(x =>
                    x.UserId == user.Id &&
                    !x.DeletedTime.HasValue);

            // =====================================================
            // Generate JWT
            // =====================================================

            int expireMinutes = int.Parse(
                _configuration["JwtSettings:ExpirationMinutes"]!);

            DateTime expires = DateTime.UtcNow.AddMinutes(expireMinutes);

            string token = GenerateJwtToken(
                await GenerateClaims(user, employee),
                expires);

            return new AuthResponseModelView
            {
                Token = token,
                ExpiredAt = expires,
                UserId = user.Id,
                UserName = user.UserName ?? string.Empty,
                GivenName = employee?.GivenName ?? user.UserName ?? string.Empty,
                FamilyName = employee?.FamilyName,
                EmployeeId = employee?.Id,
                EmployeeCode = employee?.EmployeeCode,
                Roles = (await _userManager.GetRolesAsync(user)).ToList()
            };
        }

        #endregion

        #region Activate (mã kích ho?t)

        public async Task ActivateAsync(ActivateAccountModelView model)
        {
            model.Code = model.Code.Trim();
            model.Password = model.Password.Trim();

            if (string.IsNullOrWhiteSpace(model.Code))
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Activation code is required.");
            }

            if (string.IsNullOrWhiteSpace(model.Password))
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Password is required.");
            }

            if (!string.IsNullOrWhiteSpace(model.ConfirmPassword) &&
                model.Password != model.ConfirmPassword)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Password and confirmation do not match.");
            }

            // Chính sách m?t kh?u: t?i thi?u 10 ký t?, hoa, th??ng, s?, ký t? ??c bi?t
            ValidatePasswordPolicy(model.Password);

            ActivationCode activationCode = await _dbContext.Set<ActivationCode>()
                .FirstOrDefaultAsync(x =>
                    x.Code == model.Code &&
                    !x.DeletedTime.HasValue)
                ?? throw new ErrorException(
                    StatusCodes.Status404NotFound,
                    ResponseCodeConstants.NOT_FOUND,
                    "Activation code not found.");

            if (activationCode.IsUsed || activationCode.UsedAt.HasValue)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Activation code has already been used.");
            }

            if (activationCode.ExpiresAt < DateTime.Now)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Activation code has expired.");
            }

            // Xác ??nh user c?n kích ho?t
            Guid? userId = activationCode.UserId;

            if (userId == null)
            {
                Employee employee = await _dbContext.Set<Employee>()
                    .FirstOrDefaultAsync(x =>
                        x.Id == activationCode.EmployeeId &&
                        !x.DeletedTime.HasValue)
                    ?? throw new ErrorException(
                        StatusCodes.Status404NotFound,
                        ResponseCodeConstants.NOT_FOUND,
                        "Employee not found.");

                userId = employee.UserId;
            }

            if (userId == null)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "No user account linked to this activation code.");
            }

            ApplicationUser user = await _userManager.Users
                .FirstOrDefaultAsync(x => x.Id == userId.Value)
                ?? throw new ErrorException(
                    StatusCodes.Status404NotFound,
                    ResponseCodeConstants.NOT_FOUND,
                    "User account not found.");

            // ??t l?i m?t kh?u: g? m?t kh?u c? (n?u có) r?i ??t m?t kh?u m?i
            if (await _userManager.HasPasswordAsync(user))
            {
                await _userManager.RemovePasswordAsync(user);
            }

            IdentityResult passwordResult =
                await _userManager.AddPasswordAsync(user, model.Password);

            if (!passwordResult.Succeeded)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    passwordResult.Errors.FirstOrDefault()?.Description
                    ?? "Failed to set password.");
            }

            // ?ánh d?u mã ?ã dùng
            activationCode.IsUsed = true;
            activationCode.UsedAt = DateTime.Now;
            activationCode.ActivatedBy = user.UserName;
            activationCode.UserId = userId;
            activationCode.LastUpdatedTime = CoreHelper.SystemTimeNow;

            await _dbContext.SaveChangesAsync();
        }

        public async Task<ActivationCodeResponseModelView>
            CreateActivationCodeAsync(CreateActivationCodeModelView model)
        {
            // Ki?m tra employee t?n t?i
            Employee employee = await _dbContext.Set<Employee>()
                .FirstOrDefaultAsync(x =>
                    x.Id == model.EmployeeId &&
                    !x.DeletedTime.HasValue)
                ?? throw new ErrorException(
                    StatusCodes.Status404NotFound,
                    ResponseCodeConstants.NOT_FOUND,
                    "Employee not found.");

            // Ki?m tra mã trùng
            bool codeExists = await _dbContext.Set<ActivationCode>()
                .AnyAsync(x =>
                    x.Code == model.Code &&
                    !x.DeletedTime.HasValue);

            if (codeExists)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Activation code already exists.");
            }

            ActivationCode entity = model.ToEntity();
            entity.EmployeeId = employee.Id;
            entity.UserId = employee.UserId;
            entity.Code = model.Code.Trim();
            entity.CreatedBy = "System";
            entity.CreatedTime = CoreHelper.SystemTimeNow;

            await _dbContext.Set<ActivationCode>().AddAsync(entity);
            await _dbContext.SaveChangesAsync();

            return entity.ToViewModel();
        }

        #endregion

        #region Change Password

        public async Task ChangePasswordAsync(ChangePasswordModelView model)
        {
            if (model.UserId == Guid.Empty)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "User id is required.");
            }

            if (string.IsNullOrWhiteSpace(model.CurrentPassword) ||
                string.IsNullOrWhiteSpace(model.NewPassword))
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Current and new passwords are required.");
            }

            if (!string.IsNullOrWhiteSpace(model.ConfirmPassword) &&
                model.NewPassword != model.ConfirmPassword)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Password and confirmation do not match.");
            }

            ValidatePasswordPolicy(model.NewPassword);

            ApplicationUser user = await _userManager.Users
                .FirstOrDefaultAsync(x => x.Id == model.UserId)
                ?? throw new ErrorException(
                    StatusCodes.Status404NotFound,
                    ResponseCodeConstants.NOT_FOUND,
                    "User not found.");

            bool currentValid =
                await _userManager.CheckPasswordAsync(user, model.CurrentPassword);

            if (!currentValid)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Current password is incorrect.");
            }

            IdentityResult result = await _userManager.ChangePasswordAsync(
                user, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    result.Errors.FirstOrDefault()?.Description
                    ?? "Failed to change password.");
            }
        }

        #endregion

        #region Private

        // =====================================================
        // Chính sách m?t kh?u theo tài li?u bàn giao (Monica):
        // t?i thi?u 10 ký t?, có ch? HOA, ch? th??ng,
        // ch? s? và ký t? ??c bi?t (@, #, !...)
        // =====================================================
        private void ValidatePasswordPolicy(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new BadRequestException(
                    "INVALID_PASSWORD",
                    "Password cannot be empty");
            }

            if (password.Length < 10)
            {
                throw new BadRequestException(
                    "WEAK_PASSWORD",
                    "Password must be at least 10 characters.");
            }

            bool hasUpper = password.Any(char.IsUpper);
            bool hasLower = password.Any(char.IsLower);
            bool hasDigit = password.Any(char.IsDigit);
            bool hasSpecial = password.Any(c => !char.IsLetterOrDigit(c));

            if (!hasUpper || !hasLower || !hasDigit || !hasSpecial)
            {
                throw new BadRequestException(
                    "WEAK_PASSWORD",
                    "Password must contain uppercase, lowercase, digit and special character.");
            }
        }

        private async Task<List<Claim>> GenerateClaims(
            ApplicationUser user,
            Employee? employee)
        {
            List<Claim> claims = new()
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new(ClaimTypes.Name, user.UserName ?? string.Empty),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (employee != null)
            {
                string fullName = $"{employee.GivenName} {employee.FamilyName}".Trim();

                claims.Add(new Claim("employeeId", employee.Id.ToString()));
                claims.Add(new Claim("employeeCode", employee.EmployeeCode));
                claims.Add(new Claim("fullName", fullName));
                claims.Add(new Claim("givenName", employee.GivenName));
                claims.Add(new Claim("familyName", employee.FamilyName));
                claims.Add(new Claim("gender", employee.Gender.ToString()));
            }

            foreach (string role in await _userManager.GetRolesAsync(user))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        private string GenerateJwtToken(
            IEnumerable<Claim> claims,
            DateTime expires)
        {
            SymmetricSecurityKey key =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        _configuration["JwtSettings:Key"]!));

            SigningCredentials creds =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256);

            JwtSecurityToken token =
                new JwtSecurityToken(
                    issuer: _configuration["JwtSettings:Issuer"],
                    audience: _configuration["JwtSettings:Audience"],
                    claims: claims,
                    expires: expires,
                    signingCredentials: creds);

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }

        #endregion
    }
}
