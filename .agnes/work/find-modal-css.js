const fs = require('fs');
const cssFiles = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/attendance/attendance.css',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/admin.css',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/employee.css',
];
for (const f of cssFiles) {
  if (!fs.existsSync(f)) { console.log('MISSING: ' + f); continue; }
  const c = fs.readFileSync(f, 'utf8').split('\n');
  c.forEach((l, i) => {
    if (/att-form-modal|att-form[^-]|att-guide-overlay/.test(l)) {
      console.log(f.split('src/modules/')[1] + ':' + (i + 1) + ': ' + l.trim());
    }
  });
}
