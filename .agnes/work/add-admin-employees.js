const fs = require('fs');

// ============================================================
// 1. App.jsx: add import + route for /admin/employees
// ============================================================
const appFile = 'D:/Monica/M-ChamCong/ChamCong/src/App.jsx';
let app = fs.readFileSync(appFile, 'utf8');
const nl = app.includes('\r\n') ? '\r\n' : '\n';
let ok = 0;

// Add import for AdminHrPage (the admin/hr/pages/HrPage.jsx)
const importAnchor = 'import AdminContractPage from "./modules/admin/contracts/pages/AdminContractPage";';
if (!app.includes('AdminHrPage')) {
  if (app.includes(importAnchor)) {
    app = app.replace(importAnchor, importAnchor + nl + 'import AdminHrPage from "./modules/admin/hr/pages/HrPage";');
    ok++;
  }
}

// Add route /admin/employees before /admin
const routeAnchor = '<Route path="/admin" element={guarded("/admin", <AdminHomepage />)} />';
if (app.includes(routeAnchor) && !app.includes('"/admin/employees"')) {
  app = app.replace(
    routeAnchor,
    '<Route\n                    path="/admin/employees"\n                    element={guarded("/admin/employees", <AdminHrPage />)}\n                />' + nl +
    '                ' + routeAnchor
  );
  ok++;
}

fs.writeFileSync(appFile, app, 'utf8');
console.log('App.jsx: ' + ok + ' changes');

// ============================================================
// 2. AdminHomepage.jsx: change Nhân sự tile to /admin/employees
// ============================================================
const homeFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/pages/AdminHomepage.jsx';
let home = fs.readFileSync(homeFile, 'utf8');
if (home.includes('to: "/employees"')) {
  home = home.replace('to: "/employees"', 'to: "/admin/employees"');
  fs.writeFileSync(homeFile, home, 'utf8');
  console.log('AdminHomepage: tile changed to /admin/employees');
} else {
  console.log('AdminHomepage: tile pattern not found');
}
