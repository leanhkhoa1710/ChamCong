const fs = require('fs');
const base = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/';
const files = ['work/AdminWorkPage.jsx', 'block-account/AdminBlockAccountPage.jsx'];
for (const rel of files) {
  const f = base + rel;
  let c = fs.readFileSync(f, 'utf8');
  const before = c;
  c = c.replace('../../layout/AdminAppLayout', '../layout/AdminAppLayout');
  c = c.replace('../../api/adminApi', '../api/adminApi');
  fs.writeFileSync(f, c, 'utf8');
  console.log(rel + ' changed=' + (c !== before));
  fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => {
    if (/AdminAppLayout|adminApi|axiosClient/.test(l)) console.log('  ' + (i + 1) + ': ' + l.trim());
  });
}
