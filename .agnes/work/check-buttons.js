const fs = require('fs');
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/accounts/pages/AccountIssuancePage.jsx',
];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8').split('\n');
  console.log('\n===== ' + f.split('/').slice(-2).join('/'));
  c.forEach((l, i) => {
    if (/Xuất Excel|Cấp mã|nhân viên đang làm việc/.test(l)) {
      console.log((i + 1) + ': ' + JSON.stringify(l.trim()));
    }
  });
}
