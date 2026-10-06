const fs = require('fs');
const path = require('path');
function find(dir, re, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!/bin|obj|node_modules|dist|\.git/.test(e.name)) find(p, re, out);
    } else if (re.test(e.name)) out.push(p);
  }
  return out;
}
// Find User entity
const userCs = find('D:/Monica/M-ChamCong', /User\.cs$/).filter(p => !p.includes('ModelView') && !p.includes('node_modules'));
userCs.forEach((p) => {
  console.log('=== ' + p);
  const c = fs.readFileSync(p, 'utf8');
  c.split('\n').forEach((l, i) => { if (/public|IsActive|Lock|Disabled|Block|bool/i.test(l)) console.log((i + 1) + ': ' + l.trim()); });
});
// Find IUserService
const svc = find('D:/Monica/M-ChamCong', /IUserService\.cs$/);
svc.forEach((p) => {
  console.log('\n=== ' + p);
  fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => console.log((i + 1) + ': ' + l.trim()));
});
