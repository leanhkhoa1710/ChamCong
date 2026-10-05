const fs = require('fs');
function dump(rel, pats) {
  const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/' + rel, 'utf8').split('\n');
  console.log('\n===== ' + rel);
  c.forEach((l, i) => {
    if (pats.some((p) => l.includes(p))) console.log((i + 1) + ': ' + JSON.stringify(l));
  });
}
dump('employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx', ['Thêm', 'Duyệt', 'Mã NV']);
dump('employees/attendance/pages/EmployeeStatisticsPage.jsx', ['Thêm bản ghi', 'Chi tiết', 'Sửa']);
