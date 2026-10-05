const fs = require('fs');
const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/ReportsPage.jsx', 'utf8').split('\n');
// Verify specific wraps the user's screenshots showed
const checks = [
  'Tất cả loại báo cáo', 'Tất cả tháng', 'Quản lý',
  'Tổng quan', 'Kết quả thực hiện', 'Khó khăn', 'Kiến nghị',
  'Manager opened|Quản lý mở báo cáo', 'Tải xuống',
  'Duyệt và chuyển báo cáo', 'Hủy', 'Xác nhận',
];
checks.forEach((p) => {
  c.forEach((l, i) => {
    if (new RegExp(p).test(l) && !l.trim().startsWith('//')) {
      console.log((i + 1) + ': ' + l.trim().substring(0, 110));
    }
  });
  console.log('---');
});
