const fs = require('fs');
const base = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/';
const files = [
  'attendance/pages/AdminAttendanceHistoryPage.jsx',
  'attendance/pages/AdminStatisticsPage.jsx',
  'leaves/pages/LeaveAdminPage.jsx',
  'accounts/pages/AccountIssuancePage.jsx',
  'hr/pages/PromotionsPage.jsx',
  'hr/pages/ReportsPage.jsx',
  'contracts/pages/AdminContractPage.jsx',
];
for (const f of files) {
  const c = fs.readFileSync(base + f, 'utf8');
  // find component signature (props)
  const sigMatch = c.match(/(const\s+\w+\s*=\s*\(\{[^}]*\}|export default function \w+\s*\([^)]*\)|function \w+\s*\([^)]*\))\s*=>/s);
  const sig = sigMatch ? sigMatch[1] : '(see below)';
  // find which layout is chosen
  const layoutLines = c.split('\n').filter((l) => /PageLayout|HrAppLayout|AdminAppLayout|AppLayout/.test(l) && /(const PageLayout|= .*Layout|<PageLayout|render|return)/.test(l));
  const renderLine = c.split('\n').find((l) => l.includes('<PageLayout') || l.includes('return <HrAppLayout') || l.includes('return <AdminAppLayout') || l.includes('return <AppLayout'));
  console.log('=== ' + f);
  console.log('   SIG: ' + sig.replace(/\s+/g, ' ').substring(0, 90));
  layoutLines.slice(0, 3).forEach((l) => console.log('   ' + l.trim().substring(0, 90)));
  if (renderLine) console.log('   RENDER: ' + renderLine.trim().substring(0, 60));
  console.log('');
}
