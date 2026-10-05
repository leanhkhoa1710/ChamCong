const fs = require('fs');

function apply(rel, pairs, label) {
  const f = 'D:/Monica/M-ChamCong/' + rel;
  let c = fs.readFileSync(f, 'utf8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  let ok = 0;
  for (const [find, repl] of pairs) {
    // Normalize: allow the find string to contain \n that should match \r\n
    const fN = find.split('\n').join(nl);
    const rN = repl.split('\n').join(nl);
    if (c.includes(fN)) { c = c.split(fN).join(rN); ok++; }
    else {
      console.log('  MISS in ' + label + ': ' + JSON.stringify(find.substring(0, 60)));
    }
  }
  fs.writeFileSync(f, c, 'utf8');
  console.log(label + ': ' + ok + '/' + pairs.length + ' applied');
}

// ============================================================
// 1. IUserService.cs — add Block/Unblock
// ============================================================
apply('M.Contract.Serivces/Interface/Account/IUserService.cs', [
  [
    `Task SoftDeleteAsync(Guid id);
    Task DeleteAsync(Guid id);`,
    `Task SoftDeleteAsync(Guid id);
    Task DeleteAsync(Guid id);
    Task BlockUserAsync(Guid userId);
    Task UnblockUserAsync(Guid userId);`
  ],
], 'IUserService');

// ============================================================
// 2. UserService.cs — implement Block/Unblock using UserManager.LockOutAsync
// ============================================================
apply('M.Services/Services/Account/UserService.cs', [
  [
    `        #endregion


    }
}
`,
    `        #endregion


        #region Block / Unblock

        public async Task BlockUserAsync(Guid userId)
        {
            ApplicationUser user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new ErrorException(
                    StatusCodes.Status404NotFound,
                    ResponseCodeConstants.NOT_FOUND,
                    "User not found"
                );

            // Set lockout far in the future (100 years)
            var lockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
            IdentityResult result = await _userManager.LockOutAsync(user, lockoutEnd);

            if (!result.Succeeded)
            {
                string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.FAILED,
                    errors
                );
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
                    "User not found"
                );

            IdentityResult result = await _userManager.UnlockAsync(user);

            if (!result.Succeeded)
            {
                string errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ErrorException(
                    StatusCodes.Status400BadRequest,
                    ResponseCodeConstants.FAILED,
                    errors
                );
            }

            user.LastUpdatedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
            user.LastUpdatedTime = CoreHelper.SystemTimeNow;
            await _userManager.UpdateAsync(user);
        }

        #endregion


    }
}
`
  ],
], 'UserService');

// ============================================================
// 3. UserController.cs — add POST /{id}/block + /{id}/unblock
// ============================================================
apply('M.API/AuthController/UserController.cs', [
  [
    `        /// <summary>
        /// Permanently deletes a user
        /// </summary>
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _userService.DeleteAsync(id);

            return Ok(new BaseResponse<string>(
                statusCode: StatusCodeHelper.OK,
                code: ResponseCodeConstants.SUCCESS,
                data: "User deleted successfully!"
            ));
        }
        #endregion`,
    `        /// <summary>
        /// Permanently deletes a user
        /// </summary>
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _userService.DeleteAsync(id);

            return Ok(new BaseResponse<string>(
                statusCode: StatusCodeHelper.OK,
                code: ResponseCodeConstants.SUCCESS,
                data: "User deleted successfully!"
            ));
        }

        /// <summary>
        /// Blocks a user (they cannot log in)
        /// </summary>
        [HttpPost("{id}/block")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Block(Guid id)
        {
            await _userService.BlockUserAsync(id);

            return Ok(new BaseResponse<string>(
                statusCode: StatusCodeHelper.OK,
                code: ResponseCodeConstants.SUCCESS,
                data: "User blocked successfully!"
            ));
        }

        /// <summary>
        /// Unblocks a user
        /// </summary>
        [HttpPost("{id}/unblock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Unblock(Guid id)
        {
            await _userService.UnblockUserAsync(id);

            return Ok(new BaseResponse<string>(
                statusCode: StatusCodeHelper.OK,
                code: ResponseCodeConstants.SUCCESS,
                data: "User unblocked successfully!"
            ));
        }
        #endregion`
  ],
], 'UserController');

// ============================================================
// 4. UserResponseModelView.cs — add IsLockedOut field
// ============================================================
apply('M.ModelViews/UserModelView/UserResponseModelView.cs', [
  [
    `public bool HasPassword { get; set; }`,
    `public bool HasPassword { get; set; }
        public bool IsLockedOut { get; set; }`
  ],
], 'UserResponseModelView');

console.log('\nAll C# files updated.');
