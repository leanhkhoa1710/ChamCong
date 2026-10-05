const fs = require('fs');
for (const rel of ['employees/hr/pages/HrPage.jsx', 'employees/hr/pages/ReportsPage.jsx']) {
  const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/' + rel, 'utf8').split('\n');
  console.log('\n===== ' + rel);
  c.forEach((l, i) => { if (/toLocaleDateString\("vi-VN"\)|toLocaleString\("vi-VN"/.test(l)) console.log((i + 1) + ': ' + l.trim().substring(0, 120)); });
}
