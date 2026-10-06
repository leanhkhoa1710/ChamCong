const fs = require('fs');
const a = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/admin/hr/pages/ReportsPage.jsx', 'utf8');
const b = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/ReportsPage.jsx', 'utf8');
console.log('admin lines:', a.split('\n').length, '| employees lines:', b.split('\n').length, '| identical:', a === b);
const la = a.split('\n'), lb = b.split('\n');
const n = Math.max(la.length, lb.length);
let diffCount = 0;
for (let i = 0; i < n; i++) {
  if (la[i] !== lb[i]) {
    diffCount++;
    if (diffCount <= 30) {
      console.log((i + 1) + ': ADMIN=' + JSON.stringify(la[i] === undefined ? '(end)' : la[i]));
      console.log('      EMP =' + JSON.stringify(lb[i] === undefined ? '(end)' : lb[i]));
    }
  }
}
console.log('total diff lines:', diffCount);

// Find source of "Manager opened report" / "Quản lý mở báo cáo"
console.log('\n=== Search for Manager opened / Quản lý mở ===');
function grepDir(dir, fileFilter, pattern) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist') continue;
    const full = dir + '/' + e.name;
    if (e.isDirectory()) grepDir(full, fileFilter, pattern);
    else if (fileFilter.test(e.name)) {
      const c = fs.readFileSync(full, 'utf8');
      c.split('\n').forEach((l, i) => { if (pattern.test(l)) console.log(full.replace('D:/Monica/M-ChamCong/', '') + ':' + (i + 1) + ': ' + l.trim()); });
    }
  }
}
grepDir('D:/Monica/M-ChamCong/ChamCong/src', /\.jsx?$|\.js$/, /Manager opened|Quản lý mở|opened report/i);
console.log('--- backend ---');
grepDir('D:/Monica/M-ChamCong/M.Services', /\.cs$/, /Manager opened|opened report|ActionName|actionName/i);
