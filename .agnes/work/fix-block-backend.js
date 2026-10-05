const fs = require('fs');

// ============================================================
// 1. IUserService.cs
// ============================================================
const f1 = 'D:/Monica/M-ChamCong/M.Contract.Serivces/Interface/Account/IUserService.cs';
let c1 = fs.readFileSync(f1, 'utf8');
const nl1 = c1.includes('\r\n') ? '\r\n' : '\n';
if (!c1.includes('BlockUserAsync')) {
  c1 = c1.replace(
    '        Task SoftDeleteAsync(Guid id);' + nl1 + '        Task DeleteAsync(Guid id);' + nl1 + nl1 + nl1 + nl1 + nl1 + '    }',
    '        Task SoftDeleteAsync(Guid id);' + nl1 +
    '        Task DeleteAsync(Guid id);' + nl1 +
    '        Task BlockUserAsync(Guid userId);' + nl1 +
    '        Task UnblockUserAsync(Guid userId);' + nl1 +
    nl1 +
    '    }'
  );
  fs.writeFileSync(f1, c1, 'utf8');
  console.log('IUserService: Block/Unblock added');
}

// ============================================================
// 2. UserService.cs — add Block/Unblock implementation
// ============================================================
const f2 = 'D:/Monica/M-ChamCong/M.Services/Services/Account/UserService.cs';
let c2 = fs.readFileSync(f2, 'utf8');
const nl2 = c2.includes('\r\n') ? '\r\n' : '\n';
if (!c2.includes('BlockUserAsync')) {
  const impl = nl2 +
    '        #region Block / Unblock' + nl2 + nl2 +
    '        public async Task BlockUserAsync(Guid userId)' + nl2 +
    '        {' + nl2 +
    '            ApplicationUser user = await _userManager.FindByIdAsync(userId.ToString())' + nl2 +
    '                ?? throw new ErrorException(' + nl2 +
    '                    StatusCodes.Status404NotFound,' + nl2 +
    '                    ResponseCodeConstants.NOT_FOUND,' + nl2 +
    '                    "User not found")' + nl2 +
    ';' + nl2 +
    nl2 +
    '            var lockoutEnd = DateTimeOffset.UtcNow.AddYears(100);' + nl2 +
    '            IdentityResult result = await _userManager.LockOutAsync(user, lockoutEnd);' + nl2 +
    nl2 +
    '            if (!result.Succeeded)' + nl2 +
    '            {' + nl2 +
    '                string errors = string.Join(", ", result.Errors.Select(e => e.Description));' + nl2 +
    '                throw new ErrorException(' + nl2 +
    '                    StatusCodes.Status400BadRequest,' + nl2 +
    '                    ResponseCodeConstants.FAILED,' + nl2 +
    '                    errors);' + nl2 +
    '            }' + nl2 +
    nl2 +
    '            user.LastUpdatedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";' + nl2 +
    '            user.LastUpdatedTime = CoreHelper.SystemTimeNow;' + nl2 +
    '            await _userManager.UpdateAsync(user);' + nl2 +
    '        }' + nl2 + nl2 +
    '        public async Task UnblockUserAsync(Guid userId)' + nl2 +
    '        {' + nl2 +
    '            ApplicationUser user = await _userManager.FindByIdAsync(userId.ToString())' + nl2 +
    '                ?? throw new ErrorException(' + nl2 +
    '                    StatusCodes.Status404NotFound,' + nl2 +
    '                    ResponseCodeConstants.NOT_FOUND,' + nl2 +
    '                    "User not found")' + nl2 +
    ';' + nl2 +
    nl2 +
    '            IdentityResult result = await _userManager.UnlockAsync(user);' + nl2 +
    nl2 +
    '            if (!result.Succeeded)' + nl2 +
    '            {' + nl2 +
    '                string errors = string.Join(", ", result.Errors.Select(e => e.Description));' + nl2 +
    '                throw new ErrorException(' + nl2 +
    '                    StatusCodes.Status400BadRequest,' + nl2 +
    '                    ResponseCodeConstants.FAILED,' + nl2 +
    '                    errors);' + nl2 +
    '            }' + nl2 +
    nl2 +
    '            user.LastUpdatedBy = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";' + nl2 +
    '            user.LastUpdatedTime = CoreHelper.SystemTimeNow;' + nl2 +
    '            await _userManager.UpdateAsync(user);' + nl2 +
    '        }' + nl2 +
    nl2 +
    '        #endregion' + nl2;
  // Insert before the final "    }\n}\n"
  const lastClose = c2.lastIndexOf('    }' + nl2 + '}' + nl2);
  if (lastClose > 0) {
    c2 = c2.substring(0, lastClose) + impl + c2.substring(lastClose);
    fs.writeFileSync(f2, c2, 'utf8');
    console.log('UserService: Block/Unblock implemented');
  } else {
    // fallback: insert before the very last "}"
    const endIdx = c2.lastIndexOf('}');
    c2 = c2.substring(0, endIdx) + impl + c2.substring(endIdx);
    fs.writeFileSync(f2, c2, 'utf8');
    console.log('UserService: Block/Unblock implemented (fallback)');
  }
}

// ============================================================
// 3. UserMapping.cs — add IsLockedOut
// ============================================================
const f3 = 'D:/Monica/M-ChamCong/M.Services/Mapping/UserMapping.cs';
let c3 = fs.readFileSync(f3, 'utf8');
const nl3 = c3.includes('\r\n') ? '\r\n' : '\n';
if (!c3.includes('IsLockedOut')) {
  c3 = c3.replace(
    '                HasPassword = !string.IsNullOrEmpty(user.PasswordHash),',
    '                HasPassword = !string.IsNullOrEmpty(user.PasswordHash),' + nl3 +
    '                IsLockedOut = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow,'
  );
  fs.writeFileSync(f3, c3, 'utf8');
  console.log('UserMapping: IsLockedOut added');
}

// ============================================================
// 4. adminApi.js — add unblockUser
// ============================================================
const f4 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/api/adminApi.js';
let c4 = fs.readFileSync(f4, 'utf8');
const nl4 = c4.includes('\r\n') ? '\r\n' : '\n';
if (!c4.includes('unblockUser')) {
  c4 = c4.replace(
    '    blockUser(userId, payload) {' + nl4 + '        return axiosClient.post(`/User/${userId}/block`, payload);' + nl4 + '    },',
    '    blockUser(userId, payload) {' + nl4 + '        return axiosClient.post(`/User/${userId}/block`, payload);' + nl4 + '    },' + nl4 +
    '    unblockUser(userId) {' + nl4 + '        return axiosClient.post(`/User/${userId}/unblock`);' + nl4 + '    },'
  );
  fs.writeFileSync(f4, c4, 'utf8');
  console.log('adminApi: unblockUser added');
}

// ============================================================
// 5. AdminBlockAccountPage.jsx — use users() API + show blocked state + unblock button
// ============================================================
const f5 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/block-account/AdminBlockAccountPage.jsx';
let c5 = fs.readFileSync(f5, 'utf8');
const nl5 = c5.includes('\r\n') ? '\r\n' : '\n';

// Replace employees() with users() + fetch both employees and users to merge
const oldLoad = '        adminApi.employees().then((res) => {' + nl5 + '            setUsers(res.data.data?.items || []);' + nl5 + '        }).catch(() => {' + nl5 + '            setUsers([]);' + nl5 + '        }).finally(() => setLoading(false));';
const newLoad = '        Promise.all([adminApi.employees(), adminApi.users()]).then(([empRes, usrRes]) => {' + nl5 +
    '            const employees = empRes.data.data?.items || [];'; nl5 +
    '            const users = usrRes.data.data?.items || [];'; nl5 +
    '            const merged = employees.map((e) => {'; nl5 +
    '                const u = users.find((x) => x.id === e.userId);'; nl5 +
    '                return { ...e, isLockedOut: u?.isLockedOut ?? false, userId: u?.id || null };'; nl5 +
    '            });'; nl5 +
    '            setUsers(merged);'; nl5 +
    '        }).catch(() => {'; nl5 +
    '            setUsers([]);'; nl5 +
    '        }).finally(() => setLoading(false));';
if (c5.includes(oldLoad)) {
  c5 = c5.replace(oldLoad, newLoad);
  console.log('AdminBlockAccountPage: load updated to merge users+employees');
} else {
  console.log('AdminBlockAccountPage: load pattern not found');
}

// Replace blockAccount to use userId and add unblockAccount
const oldBlock = '    const blockAccount = async (user) => {';
if (c5.includes(oldBlock)) {
  c5 = c5.replace(
    oldBlock + nl5 + '        if (!window.confirm(`Chặn tài khoản của ${user.fullName} (${user.employeeCode})?`)) return;' + nl5 +
    '        try {' + nl5 +
    '            await adminApi.blockUser(user.id, { reason: blockReason || "Admin chặn tài khoản" });' + nl5 +
    '            alert(`Đã chặn tài khoản của ${user.fullName}.`);' + nl5 +
    '        } catch (err) {' + nl5 +
    '            alert(err.response?.data?.message || err.message);' + nl5 +
    '        }' + nl5 +
    '    };',
    '    const blockAccount = async (user) => {' + nl5 +
    '        if (!window.confirm(`Chặn tài khoản của ${user.fullName} (${user.employeeCode})?`)) return;' + nl5 +
    '        try {' + nl5 +
    '            await adminApi.blockUser(user.userId, {});' + nl5 +
    '            alert(`Đã chặn tài khoản của ${user.fullName}.`);' + nl5 +
    '            load();' + nl5 +
    '        } catch (err) {' + nl5 +
    '            alert(err.response?.data?.message || err.message);' + nl5 +
    '        }' + nl5 +
    '    };' + nl5 + nl5 +
    '    const unblockAccount = async (user) => {' + nl5 +
    '        if (!window.confirm(`Mở chặn tài khoản của ${user.fullName} (${user.employeeCode})?`)) return;' + nl5 +
    '        try {' + nl5 +
    '            await adminApi.unblockUser(user.userId);' + nl5 +
    '            alert(`Đã mở chặn tài khoản của ${user.fullName}.`);' + nl5 +
    '            load();' + nl5 +
    '        } catch (err) {' + nl5 +
    '            alert(err.response?.data?.message || err.message);' + nl5 +
    '        }' + nl5 +
    '    };'
  );
  console.log('AdminBlockAccountPage: block/unblock updated');
}

// Replace the action column to show block/unblock based on state
const oldAction = '                                            <td>' + nl5 +
    '                                                <button' + nl5 +
    '                                                    type="button"' + nl5 +
    '                                                    className="admin-link-btn admin-link-btn--danger"' + nl5 +
    '                                                    onClick={() => blockAccount(u)}' + nl5 +
    '                                                    disabled={u.status !== 2}' + nl5 +
    '                                                >' + nl5 +
    '                                                    Chặn' + nl5 +
    '                                                </button>' + nl5 +
    '                                            </td>';
const newAction = '                                            <td>' + nl5 +
    '                                                {u.isLockedOut ? (' + nl5 +
    '                                                    <button type="button" className="admin-link-btn" onClick={() => unblockAccount(u)}>' + nl5 +
    '                                                        Mở chặn' + nl5 +
    '                                                    </button>' + nl5 +
    '                                                ) : (' + nl5 +
    '                                                    <button type="button" className="admin-link-btn admin-link-btn--danger"' + nl5 +
    '                                                        onClick={() => blockAccount(u)}' + nl5 +
    '                                                        disabled={u.status !== 2 && !u.userId}' + nl5 +
    '                                                    >' + nl5 +
    '                                                        Chặn' + nl5 +
    '                                                    </button>' + nl5 +
    '                                                )}' + nl5 +
    '                                            </td>';
if (c5.includes(oldAction)) {
  c5 = c5.replace(oldAction, newAction);
  console.log('AdminBlockAccountPage: action column updated');
} else {
  console.log('AdminBlockAccountPage: action column pattern not found');
}

// Add "Đã chặn" badge
const oldStatus = '                                                <span className={`att-badge ${u.status === 2 ? "ok" : "warn"}`}>' + nl5 +
    '                                                    {u.status === 2 ? "Đang làm" : "Đã nghỉ"}' + nl5 +
    '                                                </span>';
const newStatus = '                                                <span className={`att-badge ${u.isLockedOut ? "bad" : u.status === 2 ? "ok" : "warn"}`}>' + nl5 +
    '                                                    {u.isLockedOut ? "Đã chặn" : u.status === 2 ? "Đang làm" : "Đã nghỉ"}' + nl5 +
    '                                                </span>';
if (c5.includes(oldStatus)) {
  c5 = c5.replace(oldStatus, newStatus);
  console.log('AdminBlockAccountPage: status badge updated');
}

// Add load() function
if (!c5.includes('const load = () => {')) {
  c5 = c5.replace(
    '    const [blockReason, setBlockReason] = useState("");',
    '    const [blockReason, setBlockReason] = useState("");' + nl5 + nl5 +
    '    const load = () => {' + nl5 +
    '        setLoading(true);' + nl5 +
    '        Promise.all([adminApi.employees(), adminApi.users()]).then(([empRes, usrRes]) => {' + nl5 +
    '            const employees = empRes.data.data?.items || [];'; nl5 +
    '            const users = usrRes.data.data?.items || [];'; nl5 +
    '            const merged = employees.map((e) => {'; nl5 +
    '                const u = users.find((x) => x.id === e.userId);'; nl5 +
    '                return { ...e, isLockedOut: u?.isLockedOut ?? false, userId: u?.id || null };'; nl5 +
    '            });'; nl5 +
    '            setUsers(merged);'; nl5 +
    '        }).catch(() => {'; nl5 +
    '            setUsers([]);'; nl5 +
    '        }).finally(() => setLoading(false));'; nl5 +
    '    };'
  );
  // Also replace the useEffect to use load()
  c5 = c5.replace(
    '    useEffect(() => {' + nl5 + '        adminApi.employees().then((res) => {' + nl5 + '            setUsers(res.data.data?.items || []);' + nl5 + '        }).catch(() => {' + nl5 + '            setUsers([]);' + nl5 + '        }).finally(() => setLoading(false));' + nl5 + '    }, []);',
    '    useEffect(() => { load(); }, []);'
  );
  console.log('AdminBlockAccountPage: load() added');
}

fs.writeFileSync(f5, c5, 'utf8');
console.log('AdminBlockAccountPage: saved');
