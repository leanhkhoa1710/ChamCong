const fs = require('fs');
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/accounts/pages/AccountIssuancePage.jsx',
];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8').split('\n');
  console.log('\n===== ' + f.split('/').slice(-2).join('/'));
  c.forEach((l, i) => {
    if (/Xuất Excel|Cấp mã|Không xác minh được mã kích hoạt|Không tải được danh sách|chưa có bộ phận|Ban Giám đốc|recipient\s*=\s*useState/.test(l)) {
      console.log((i + 1) + ': ' + l.trim().substring(0, 140));
    }
  });
}
