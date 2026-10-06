const fs = require('fs');
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/EmployeeListPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeStatisticsPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx',
];
// Vietnamese tone letters test
const viRe = /[\u00E0-\u00FA\u1EA0-\u1EF9\u0111]/;
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8').split('\n');
  console.log('\n========== ' + f.split('src/modules/')[1] + ' (' + c.length + ' lines)');
  c.forEach((l, i) => {
    if (viRe.test(l) && !/^\s*\/\//.test(l) && l.trim()) {
      console.log((i + 1) + ': ' + l.trim().substring(0, 150));
    }
  });
}
