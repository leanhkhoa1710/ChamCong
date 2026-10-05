const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/accounts/pages/AccountIssuancePage.jsx';
let c = fs.readFileSync(f, 'utf8');
const wraps = [
  ['{`Xuất Excel (${unlinked.length})`}', '{`${L("Xuất Excel")} (${unlinked.length})`}'],
  ['{`Cấp mã (${selected.size})`}', '{`${L("Cấp mã")} (${selected.size})`}'],
];
let applied = 0, missing = [];
for (const [find, repl] of wraps) {
  if (c.includes(find)) { c = c.split(find).join(repl); applied++; }
  else missing.push(find.substring(0, 40));
}
fs.writeFileSync(f, c, 'utf8');
console.log('admin: ' + applied + ' applied, ' + missing.length + ' not-found');
missing.forEach((m) => console.log('   - ' + m));
