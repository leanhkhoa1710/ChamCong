const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/hr/layout/HrSidebar.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let ok = 0;
if (c.includes('    { to: "/admin/employees/reports", label: "Báo cáo" },' + nl)) {
  c = c.replace('    { to: "/admin/employees/reports", label: "Báo cáo" },' + nl, '');
  ok++;
}
if (c.includes('    { to: "/admin/employees/accounts", label: "Cấp tài khoản" },' + nl)) {
  c = c.replace('    { to: "/admin/employees/accounts", label: "Cấp tài khoản" },' + nl, '');
  ok++;
}
fs.writeFileSync(f, c, 'utf8');
console.log('Removed ' + ok + '/2 items');
fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (/to:/.test(l)) console.log('  ' + (i + 1) + ': ' + l.trim()); });
