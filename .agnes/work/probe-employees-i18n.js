const fs = require('fs');
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/EmployeeListPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeStatisticsPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/contracts/pages/EmployeeContractPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/handover/pages/HandoverPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/ReportsPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/HrPage.jsx',
];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  const hasI18n = /useLanguage/.test(c);
  const hasL = /const L = /.test(c);
  const hasTranslate = /translate/.test(c);
  // count lines with Vietnamese characters inside string literals (rough)
  let viLines = 0;
  lines.forEach((l) => { if (/[ạ-ỹ]|["'][^"']*[ăâđêôơư]|["'][^"']*[áàãảạăắằẳẵắâ]/.test(l) && !/^\s*\/\//.test(l)) viLines++; });
  console.log((hasI18n ? 'i18n' : '----') + (hasL ? ' L' : '  ') + (hasTranslate ? ' tr' : '  ') + ' | VI-lines~' + viLines + ' | ' + f.split('src/modules/')[1]);
}
