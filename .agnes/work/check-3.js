const fs = require('fs');
const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx', 'utf8').split('\n');
c.forEach((l, i) => {
  if (/Chưa cập nhật|Xác minh & kích hoạt/.test(l)) console.log((i + 1) + ': ' + l.trim().substring(0, 130));
});
