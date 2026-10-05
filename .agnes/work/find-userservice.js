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
const svc = find('D:/Monica/M-ChamCong', /UserService\.cs$/).filter(p => !/Interface/.test(p));
svc.forEach((p) => {
  console.log('=== ' + p);
  const c = fs.readFileSync(p, 'utf8').split('\n');
  c.forEach((l, i) => { if (/public|private|class|Task|_userManager|UserManager|using M\./i.test(l)) console.log((i + 1) + ': ' + l.trim()); });
});
