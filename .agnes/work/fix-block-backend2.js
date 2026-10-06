const fs = require('fs');

function sub(rel, pairs, label) {
  const f = 'D:/Monica/M-ChamCong/' + rel;
  let c = fs.readFileSync(f, 'utf8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  const norm = (s) => s.split('\n').join(nl);
  let ok = 0;
  for (const [find, repl] of pairs) {
    const F = norm(find);
    const R = norm(repl);
    if (c.includes(F)) { c = c.split(F).join(R); ok++; }
    else console.log('  MISS [' + label + ']: ' + JSON.stringify(find.substring(0, 70)));
  }
  fs.writeFileSync(f, c, 'utf8');
  console.log(label + ': ' + ok + '/' + pairs.length);
}

// 1. IUserService.cs
sub('M.Contract.Serivces/Interface/Account/IUserService.cs', [
  [
`    Task SoftDeleteAsync(Guid id);
    Task DeleteAsync(Guid id);
`,
`    Task SoftDeleteAsync(Guid id);
    Task DeleteAsync(Guid id);
    Task BlockUserAsync(Guid userId);
    Task UnblockUserAsync(Guid userId);
`],
], 'IUserService');

// 2. UserService.cs — insert Block/Unblock before the last closing braces
{
  const rel = 'M.Services/Services/Account/UserService.cs';
  const f = 'D:/Monica/M-ChamCong/' + rel;
  let c = fs.readFileSync(f, 'utf8');
  if (!c.includes('BlockUserAsync')) {
    const nl = c.includes('\r\n') ? '\r\n' : '\n';
    const impl = `
        #region Block / Unblock

        public async Task BlockUserAsync(Guid userId)
        {
            ApplicationUser user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new ErrorException(
                    StatusCodes.Status404NotFound,
                    ResponseCodeConstants.NOT_FOUND,
                    "User not found");

            var lockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
            IdentityResult result = await _userManager.LockOutAsync(user, lockoutEnd);

            if (!result.Succeeded)
            {
                string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.FAILED,
                    errors);
            }

            user.LastUpdatedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
            user.LastUpdatedTime = CoreHelper.SystemTimeNow;
            await _userManager.UpdateAsync(user);
        }

        public async Task UnblockUserAsync(Guid userId)
        {
            ApplicationUser user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new ErrorException(
                    StatusCodes.Status404NotFound,
                    ResponseCodeConstants.NOT_FOUND,
                    "User not found");

            IdentityResult result = await _userManager.UnlockAsync(user);

            if (!result.Succeeded)
            {
                string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.FAILED,
                    errors);
            }

            user.LastUpdatedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
            user.LastUpdatedTime = CoreHelper.SystemTimeNow;
            await _userManager.UpdateAsync(user);
        }

        #endregion
`;
    const implN = impl.split('\n').join(nl);
    // Insert before the final "    }\n}"  (closing class + namespace)
    const lastClassClose = c.lastIndexOf('    }\n');
    if (lastClassClose > 0) {
      c = c.substring(0, lastClassClose) + implN + c.substring(lastClassClose);
    } else {
      const endIdx = c.lastIndexOf('}');
      c = c.substring(0, endIdx) + implN + c.substring(endIdx);
    }
    fs.writeFileSync(f, c, 'utf8');
    console.log('UserService: Block/Unblock implemented');
  } else console.log('UserService: already has Block');
}

// 3. UserMapping.cs — add IsLockedOut
sub('M.Services/Mapping/UserMapping.cs', [
  [
`                HasPassword = !string.IsNullOrEmpty(user.PasswordHash),`,
`                HasPassword = !string.IsNullOrEmpty(user.PasswordHash),
                IsLockedOut = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow,`],
], 'UserMapping');

// 4. adminApi.js — add unblockUser
sub('ChamCong/src/modules/admin/api/adminApi.js', [
  [
`    blockUser(userId, payload) {
        return axiosClient.post(\`/User/\${userId}/block\`, payload);
    },`,
`    blockUser(userId, payload) {
        return axiosClient.post(\`/User/\${userId}/block\`, payload);
    },
    unblockUser(userId) {
        return axiosClient.post(\`/User/\${userId}/unblock\`);
    },`],
], 'adminApi');

console.log('\nBackend + api done.');
