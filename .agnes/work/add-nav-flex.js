const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/admin.css';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
if (!c.includes('.att-sidebar-nav {')) {
  // .att-sidebar-nav might be in attendance.css. Add a rule here to make it flex-grow
  const block = nl +
    '/* Make the HR admin sidebar nav fill the full height so the back link sits at the bottom */' + nl +
    '.att-sidebar .att-sidebar-nav {' + nl +
    '    flex: 1;' + nl +
    '}' + nl;
  c += block;
  fs.writeFileSync(f, c, 'utf8');
  console.log('Added flex:1 to .att-sidebar .att-sidebar-nav');
} else {
  console.log('Rule already present');
}
