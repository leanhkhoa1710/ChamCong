const fs = require('fs');
const path = require('path');
function find(dir, re, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!/bin|obj|node_modules|dist|\.git/.test(e.name)) find(p, re, out); }
    else if (re.test(e.name)) out.push(p);
  }
  return out;
}
const resp = find('D:/Monica/M-ChamCong', /UserResponseModelView\.cs$/);
resp.forEach((p) => {
  console.log('=== ' + p);
  fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (l.trim()) console.log((i + 1) + ': ' + l.trim()); });
});
