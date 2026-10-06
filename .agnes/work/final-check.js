const fs = require('fs');
const files = [
  'employees/EmployeeListPage.jsx',
  'employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx',
  'employees/attendance/pages/EmployeeStatisticsPage.jsx',
  'employees/attendance/components/AttendanceFormModal.jsx',
  'employees/attendance/components/AttendanceDetailModal.jsx',
  'employees/attendance/components/AttendanceHistoryModal.jsx',
  'admin/contracts/pages/AdminContractPage.jsx',
  'employees/hr/pages/HrPage.jsx',
  'handover/pages/HandoverPage.jsx',
  'employees/hr/pages/ReportsPage.jsx',
];
for (const rel of files) {
  const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/' + rel, 'utf8');
  const viLeft = (c.match(/toLocaleDateString\("vi-VN"\)|toLocaleString\("vi-VN"/g) || []).length;
  const double = (c.match(/L\(L\(/g) || []).length;
  const Lcount = (c.match(/\{L\(|L\("/g) || []).length;
  const hasL = c.includes('const L = ');
  console.log(rel.padEnd(50) + '| L()' + (hasL ? 'yes' : 'NO ') +
    '| L-wraps~' + Lcount + '| vi-VN-left:' + viLeft + '| L(L():' + double);
}
