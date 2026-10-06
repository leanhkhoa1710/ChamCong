const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/App.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';

const adminRoute = '<Route path="/admin" element={guarded("/admin", <AdminHomepage />)} />';
if (c.includes(adminRoute) && !c.includes('path="/admin/work"')) {
  c = c.replace(adminRoute,
    '<Route path="/admin/work" element={guarded("/admin/work", <AdminWorkPage />)} />' + nl +
    '                <Route path="/admin/block-accounts" element={guarded("/admin/block-accounts", <AdminBlockAccountPage />)} />' + nl +
    '                ' + adminRoute
  );
  fs.writeFileSync(f, c, 'utf8');
  console.log('Routes added: /admin/work + /admin/block-accounts');
} else {
  console.log('Skipped (anchor missing or routes already present)');
}
c = fs.readFileSync(f, 'utf8');
c.split('\n').forEach((l, i) => { if (l.includes('path="/admin/work"') || l.includes('path="/admin/block-accounts"')) console.log((i + 1) + ': ' + l.trim()); });
