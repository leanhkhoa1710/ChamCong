const fs = require('fs');
const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/employees/EmployeeListPage.jsx', 'utf8').split('\n');
c.forEach((l, i) => {
  if (/Từ chối|Duyệt|Xuất CSV|Không có dữ liệu/.test(l)) {
    console.log((i + 1) + ': ' + JSON.stringify(l));
  }
});
