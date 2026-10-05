const fs = require('fs');

// ============================================================
// 1. Change admin HrSidebar to point to /admin/employees/*
// ============================================================
const f1 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/hr/layout/HrSidebar.jsx';
let c1 = fs.readFileSync(f1, 'utf8');

// Replace "/employees" paths with "/admin/employees"
c1 = c1.replace('to: "/employees"', 'to: "/admin/employees"');
c1 = c1.replace('to: "/employees/attendance-history"', 'to: "/admin/employees/attendance-history"');
c1 = c1.replace('to: "/employees/statistics"', 'to: "/admin/employees/statistics"');
c1 = c1.replace('to: "/employees/leaves"', 'to: "/admin/employees/leaves"');
c1 = c1.replace('to: "/employees/handover"', 'to: "/admin/employees/handover"');
c1 = c1.replace('to: "/employees/reports"', 'to: "/admin/employees/reports"');
c1 = c1.replace('to: "/employees/accounts"', 'to: "/admin/employees/accounts"');
c1 = c1.replace('to: "/employees/promotions"', 'to: "/admin/employees/promotions"');
c1 = c1.replace('end={item.to === "/employees"}', 'end={item.to === "/admin/employees"}');

fs.writeFileSync(f1, c1, 'utf8');
console.log('Admin HrSidebar updated:');
c1 = fs.readFileSync(f1, 'utf8').split('\n');
c1.forEach((l, i) => { if (/to:/.test(l)) console.log('  ' + (i + 1) + ': ' + l.trim()); });

// ============================================================
// 2. Add /admin/employees/* routes to App.jsx
// ============================================================
const appFile = 'D:/Monica/M-ChamCong/ChamCong/src/App.jsx';
let app = fs.readFileSync(appFile, 'utf8');
const nl = app.includes('\r\n') ? '\r\n' : '\n';

// Add import for AdminPromotionsPage if not present
if (!app.includes('AdminPromotionsPage')) {
  const anchor = 'import AdminHrPage from "./modules/admin/hr/pages/HrPage";';
  if (app.includes(anchor)) {
    app = app.replace(anchor, anchor + nl + 'import AdminPromotionsPage from "./modules/admin/hr/pages/PromotionsPage";');
    console.log('Added AdminPromotionsPage import');
  }
}

// Define routes: [subPath, component, extraProps]
const routeDefs = [
  ['attendance-history', 'AdminAttendanceHistoryPage', ''],
  ['statistics', 'AdminStatisticsPage', ''],
  ['leaves', 'AdminLeaveAdminPage', ''],
  ['handover', 'HandoverPage', ' reviewMode'],
  ['reports', 'AdminReportPage', ''],
  ['accounts', 'AdminAccountIssuancePage', ''],
  ['promotions', 'AdminPromotionsPage', ''],
  ['contracts', 'AdminContractPage', ''],
];

// Build the route JSX lines
const newRoutes = routeDefs.map(([sub, comp, extra]) =>
  '                <Route path="/admin/employees/' + sub + '" element={guarded("/admin/employees/' + sub + '", <' + comp + extra + ' />)} /'
).join(nl);

// Insert before /admin route
const adminRoute = '<Route path="/admin" element={guarded("/admin", <AdminHomepage />)} />';
if (app.includes(adminRoute)) {
  app = app.replace(adminRoute, newRoutes + nl + adminRoute);
  console.log('\nAdded ' + routeDefs.length + ' /admin/employees/* routes');
}

fs.writeFileSync(appFile, app, 'utf8');
console.log('Done.');
