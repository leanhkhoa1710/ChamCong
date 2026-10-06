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
console.log('=== User entity files ===');
find('D:/Monica/M-ChamCong', /\/User\.cs$/).forEach((p) => console.log(p));
console.log('=== UpdateUserModelView / Create files ===');
find('D:/Monica/M-ChamCong', /UserModelView\.cs$/).forEach((p) => console.log(p));
// Dump the User entity fields
const ent = find('D:/Monica/M-ChamCong', /\/User\.cs$/)[0];
if (ent) {
  const c = fs.readFileSync(ent, 'utf8').split('\n');
  console.log('\n=== ' + ent + ' fields ===');
  c.forEach((l, i) => { if (/\bpublic\s+\w/.test(l) || /IsActive|Lock|Disabled|Block|bool/i.test(l)) console.log((i + 1) + ': ' + l.trim()); });
}
