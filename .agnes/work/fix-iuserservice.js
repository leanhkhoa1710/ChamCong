const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/M.Contract.Serivces/Interface/Account/IUserService.cs';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
if (!c.includes('BlockUserAsync')) {
  c = c.replace(
    '        Task SoftDeleteAsync(Guid id);' + nl + '        Task DeleteAsync(Guid id);',
    '        Task SoftDeleteAsync(Guid id);' + nl + '        Task DeleteAsync(Guid id);' + nl + '        Task BlockUserAsync(Guid userId);' + nl + '        Task UnblockUserAsync(Guid userId);'
  );
  fs.writeFileSync(f, c, 'utf8');
  console.log('IUserService: Block/Unblock added');
} else {
  console.log('IUserService: already present');
}
