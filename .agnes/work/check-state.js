const fs = require('fs');
const base = 'D:/Monica/M-ChamCong/';
const checks = [
  ['M.Contract.Serivces/Interface/Account/IUserService.cs', 'BlockUserAsync'],
  ['M.Services/Services/Account/UserService.cs', 'BlockUserAsync'],
  ['M.API/AuthController/UserController.cs', '/block'],
  ['M.ModelViews/UserModelView/UserResponseModelView.cs', 'IsLockedOut'],
  ['M.Services/Mapping/UserMapping.cs', 'IsLockedOut'],
  ['ChamCong/src/modules/admin/api/adminApi.js', 'unblockUser'],
];
for (const [rel, needle] of checks) {
  const c = fs.readFileSync(base + rel, 'utf8');
  console.log((c.includes(needle) ? 'HAS ' : 'MISS') + ' ' + needle + '  -> ' + rel);
}
