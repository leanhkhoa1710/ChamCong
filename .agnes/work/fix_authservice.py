import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\M.Services\Services\Account\AuthService.cs"
with io.open(p, "r", encoding="utf-8") as f:
    s = f.read()

# 1) ActivateAsync: tự bổ sung user cho employee nếu mã bị cấp khi chưa có user
old1 = """            if (userId == null)
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
            }"""

new1 = """            if (userId == null)
            {
                Employee employee = await _dbContext.Set<Employee>()
                    .FirstOrDefaultAsync(x =>
                        x.Id == activationCode.EmployeeId &&
                        !x.DeletedTime.HasValue)
                    ?? throw new ErrorException(
                        StatusCodes.Status404NotFound,
                        ResponseCodeConstants.NOT_FOUND,
                        "Employee not found.");

                // Mã có thể được cấp trước khi hệ thống "đảm bảo tài khoản":
                // tự tạo user cho nhân viên (username = Mã NV) rồi tiếp tục.
                if (employee.UserId == null)
                {
                    await EnsureUserForAsync(employee, "Hactv");
                    await _dbContext.SaveChangesAsync();
                }

                userId = employee.UserId;
            }

            if (userId == null)
            {
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "No user account linked to this activation code.");
            }"""

if old1 in s:
    s = s.replace(old1, new1)
    print("OK: ActivateAsync patched")
else:
    print("NOT FOUND: ActivateAsync block")

# 2) CreateActivationCodeAsync: đảm bảo employee có user trước khi cấp mã
old2 = """            ActivationCode entity = model.ToEntity();
            entity.EmployeeId = employee.Id;
            entity.UserId = employee.UserId;
            entity.Code = model.Code.Trim();
            entity.CreatedBy = "System";
            entity.CreatedTime = CoreHelper.SystemTimeNow;

            await _dbContext.Set<ActivationCode>().AddAsync(entity);
            await _dbContext.SaveChangesAsync();"""

new2 = """            // Đảm bảo nhân viên có tài khoản đăng nhập (ApplicationUser)
            // trước khi cấp mã - tránh mã không gắn được user.
            if (employee.UserId == null)
            {
                await EnsureUserForAsync(employee, "Hactv");
                await _dbContext.SaveChangesAsync();
            }

            ActivationCode entity = model.ToEntity();
            entity.EmployeeId = employee.Id;
            entity.UserId = employee.UserId;
            entity.Code = model.Code.Trim();
            entity.CreatedBy = "System";
            entity.CreatedTime = CoreHelper.SystemTimeNow;

            await _dbContext.Set<ActivationCode>().AddAsync(entity);
            await _dbContext.SaveChangesAsync();"""

if old2 in s:
    s = s.replace(old2, new2)
    print("OK: CreateActivationCodeAsync patched")
else:
    print("NOT FOUND: CreateActivationCode block")

# 3) Thêm helper EnsureUserForAsync vào region Private
old3 = """        #region Private

        // Chính sách mật khẩu: tối thiểu 10 ký tự, có chữ hoa, chữ thường,"""

new3 = """        #region Private

        // Đảm bảo nhân viên có tài khoản ApplicationUser (tạo mới nếu thiếu).
        // - Username: Mã NV (VD: NV-003) nếu còn trống, nếu trùng thì thêm hậu tố.
        // - Role: Employee (nếu tồn tại).
        // - Email: lấy từ hồ sơ nhân viên.
        // - Mật khẩu tạm: không đặt — nhân viên sẽ tự đặt qua kích hoạt
        //   (hoặc admin đặt riêng).
        private async Task EnsureUserForAsync(Employee employee, string passwordSuffix = "Hactv")
        {
            if (employee.UserId != null) return;

            string baseName = !string.IsNullOrWhiteSpace(employee.EmployeeCode)
                ? employee.EmployeeCode
                : "NV-" + Guid.NewGuid().ToString("N")[..8].ToUpper();

            // Trùng username? thêm hậu tố số duy nhất
            string candidate = baseName;
            int i = 1;
            while (await _userManager.FindByNameAsync(candidate) != null)
            {
                candidate = baseName + "-" + i++;
            }

            string email = !string.IsNullOrWhiteSpace(employee.Email)
                ? employee.Email.Trim()
                : $"{candidate.ToLowerInvariant()}@local";

            // Trùng email? thêm hậu tố số để luôn tạo được
            string finalEmail = email;
            int j = 1;
            while (await _userManager.FindByEmailAsync(finalEmail) != null)
            {
                finalEmail = email.Contains("@")
                    ? email.Replace("@", $"-{j}@")
                    : email + "-" + j;
                j++;
            }

            ApplicationUser user = new()
            {
                UserName = candidate,
                Email = finalEmail,
                EmailConfirmed = false,
                CreatedBy = "System"
            };

            IdentityResult result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                throw new ErrorException(
                    StatusCodes.Status500InternalServerError,
                    "CREATE_USER_FAILED",
                    result.Errors.FirstOrDefault()?.Description
                    ?? "Failed to create user account");
            }

            if (await _roleManager.RoleExistsAsync("Employee"))
            {
                await _userManager.AddToRoleAsync(user, "Employee");
            }

            employee.UserId = user.Id;
        }

        // Chính sách mật khẩu: tối thiểu 10 ký tự, có chữ hoa, chữ thường,"""

if old3 in s:
    s = s.replace(old3, new3)
    print("OK: EnsureUserForAsync helper added")
else:
    print("NOT FOUND: Private region anchor")

with io.open(p, "w", encoding="utf-8", newline="") as f:
    f.write(s)
print("DONE")
