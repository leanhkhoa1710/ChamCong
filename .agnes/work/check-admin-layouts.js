const fs = require('fs');
const base = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/';
const files = [
  'attendance/pages/AdminAttendanceHistoryPage.jsx',
  'attendance/pages/AdminStatisticsPage.jsx',
  'leaves/pages/LeaveAdminPage.jsx',
  'accounts/pages/AccountIssuancePage.jsx',
  'hr/pages/PromotionsPage.jsx',
  'hr/pages/ReportsPage.jsx',
  'leaves/pages/PayrollResignedReport.jsx',
];
for (const f of files) {
  const c = fs.readFileSync(base + f, 'utf8');
  const pageLayouts = (c.match(/AdminAppLayout|HrAppLayout|AppLayout/g) || []).filter((v, i, a) => a.indexOf(v) === i);
  const exportDefault = (c.match(/export default\s+(\w+|function)/g) || []).join(' | ');
  console.log(f.padEnd(45) + ' -> ' + (pageLayouts.join(', ') || 'NONE') + '  [' + exportDefault + ']');
}
