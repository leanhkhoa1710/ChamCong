const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/M.Services/Services/Account/UserService.cs';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';

// Replace BlockUserAsync body
const oldBlock = `            var lockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
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
            await _userManager.UpdateAsync(user);`;

const newBlock = `            user.LockoutEnabled = true;
            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);

            user.LastUpdatedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
            user.LastUpdatedTime = CoreHelper.SystemTimeNow;
            await _userManager.UpdateAsync(user);`;

// Replace UnblockUserAsync body
const oldUnblock = `            IdentityResult result = await _userManager.UnlockAsync(user);

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
            await _userManager.UpdateAsync(user);`;

const newUnblock = `            user.LockoutEnabled = false;
            user.LockoutEnd = null;

            user.LastUpdatedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
            user.LastUpdatedTime = CoreHelper.SystemTimeNow;
            await _userManager.UpdateAsync(user);`;

let ok = 0;
if (c.includes(oldBlock.split('\n').join(nl))) { c = c.replace(oldBlock.split('\n').join(nl), newBlock.split('\n').join(nl)); ok++; }
else console.log('Block pattern not found');
if (c.includes(oldUnblock.split('\n').join(nl))) { c = c.replace(oldUnblock.split('\n').join(nl), newUnblock.split('\n').join(nl)); ok++; }
else console.log('Unblock pattern not found');

fs.writeFileSync(f, c, 'utf8');
console.log('Replaced ' + ok + '/2 with direct property assignment');
