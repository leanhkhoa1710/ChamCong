const fs = require('fs');
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/EmployeeListPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/accounts/pages/AccountIssuancePage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeStatisticsPage.jsx',
];
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/import\s+\{[^}]*\}\s+from\s+"([^"]*i18n\/LanguageProvider[^"]*)"/);
  // compute depth: number of ".." in the path
  const dots = m ? (m[1].match(/\.\.\//g) || []).length : 0;
  console.log(f.split('src/modules/')[1] + ' -> depth ' + dots + ' -> ' + (m ? m[1] : 'NO IMPORT'));
}
