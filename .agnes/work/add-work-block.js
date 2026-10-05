const fs = require('fs');

// 1. Add blockUser to adminApi
const apiFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/api/adminApi.js';
let api = fs.readFileSync(apiFile, 'utf8');
const nl = api.includes('\r\n') ? '\r\n' : '\n';
if (!api.includes('blockUser')) {
  // Add before the closing "};";" of the object
  // Find the last "}" and insert before it
  const closingIdx = api.lastIndexOf('};');
  api = api.substring(0, closingIdx) + '    blockUser(userId, payload) {' + nl +
    '        return axiosClient.post(`/User/${userId}/block`, payload);' + nl +
    '    },' + nl + '    ' + api.substring(closingIdx);
  fs.writeFileSync(apiFile, api, 'utf8');
  console.log('blockUser added to adminApi');
}

// 2. Add routes to App.jsx
const appFile = 'D:/Monica/M-ChamCong/ChamCong/src/App.jsx';
let app = fs.readFileSync(appFile, 'utf8');
const appNL = app.includes('\r\n') ? '\r\n' : '\n';

// Add imports
if (!app.includes('AdminWorkPage')) {
  app = app.replace(
    'import AdminPromotionsPage from "./modules/admin/hr/pages/PromotionsPage";',
    'import AdminPromotionsPage from "./modules/admin/hr/pages/PromotionsPage";' + appNL +
    'import AdminWorkPage from "./modules/admin/work/AdminWorkPage";' + appNL +
    'import AdminBlockAccountPage from "./modules/admin/block-account/AdminBlockAccountPage";'
  );
  console.log('Imports added');
}

// Add routes before /admin
const adminRoute = '<Route path="/admin" element={guarded("/admin", <AdminHomepage />)} />';
if (app.includes(adminRoute) && !app.includes('/admin/work')) {
  app = app.replace(adminRoute,
    '<Route path="/admin/work" element={guarded("/admin/work", <AdminWorkPage />)} />' + appNL +
    '                <Route path="/admin/block-accounts" element={guarded("/admin/block-accounts", <AdminBlockAccountPage />)} />' + appNL +
    '                ' + adminRoute
  );
  console.log('Routes added');
}

fs.writeFileSync(appFile, app, 'utf8');

// 3. Add to AdminSidebar
const sidebarFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/layout/AdminSidebar.jsx';
let sb = fs.readFileSync(sidebarFile, 'utf8');
const sbNL = sb.includes('\r\n') ? '\r\n' : '\n';
if (!sb.includes('/admin/work')) {
  sb = sb.replace(
    '    { to: "/admin/accounts", label: "Cấp tài khoản" },',
    '    { to: "/admin/work", label: "Công tác" },' + sbNL +
    '    { to: "/admin/block-accounts", label: "Chặn tài khoản" },' + sbNL +
    '    { to: "/admin/accounts", label: "Cấp tài khoản" },'
  );
  fs.writeFileSync(sidebarFile, sb, 'utf8');
  console.log('Sidebar items added');
}

console.log('Done.');
