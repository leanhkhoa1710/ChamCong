const fs = require('fs');
const base = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/';
const files = {
  'attendance/pages/AdminAttendanceHistoryPage.jsx': null,
  'attendance/pages/AdminStatisticsPage.jsx': null,
  'leaves/pages/LeaveAdminPage.jsx': null,
  'accounts/pages/AccountIssuancePage.jsx': null,
  'hr/pages/PromotionsPage.jsx': null,
  'hr/pages/ReportsPage.jsx': null,
  'contracts/pages/AdminContractPage.jsx': null,
};
for (const f of Object.keys(files)) {
  const c = fs.readFileSync(base + f, 'utf8');
  const lines = c.split('\n');
  // Find component signature
  lines.forEach((l, i) => {
    if (/^(const|export default function|function)\s+\w+.*=\s*\(.*\)|export default function/.test(l) && /\(/.test(l) && i < 60) {
      // print signature lines
    }
  });
  const sig = lines.find((l) => /const\s+\w+Page|export default function|const\s+\w+\s*=\s*\(\{/ .test(l) || /=\s*\(\{/.test(l));
  const layoutLine = lines.filter((l) => /AppLayout/.test(l) && /(hrMode|selfMode|reviewMode|const PageLayout|=.*Layout)/.test(l));
  console.log('\n===== ' + f);
  console.log('  sig: ' + (sig || '?').trim().substring(0, 80));
  layoutLine.slice(0, 4).forEach((l) => console.log('  ' + l.trim().substring(0, 90)));
}
