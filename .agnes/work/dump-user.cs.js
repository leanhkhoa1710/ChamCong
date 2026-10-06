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
// UpdateUserModelView fields
const upd = 'D:/Monica/M-ChamCong/M.ModelViews/UserModelView/UpdateUserModelView.cs';
console.log('=== UpdateUserModelView ===');
fs.readFileSync(upd, 'utf8').split('\n').forEach((l, i) => { if (/public|^\s*\w+\s+\w+/.test(l)) console.log((i + 1) + ': ' + l.trim()); });
// Find User entity (search for "class User" in cs files under M.Core or M.Contract)
console.log('\n=== searching class User ===');
find('D:/Monica/M-ChamCong', /M\.Core|Entities/).length;
const csFiles = find('D:/Monica/M-ChamCong', /\.cs$/);
csFiles.forEach((p) => {
  const c = fs.readFileSync(p, 'utf8');
  if (/class User\b/.test(c) && !p.includes('ModelView')) {
    console.log('CLASS USER at: ' + p);
    c.split('\n').forEach((l, i) => { if (/public\s+\w|IsActive|Lock|Disabled|Block|bool/i.test(l)) console.log('  ' + (i + 1) + ': ' + l.trim()); });
  }
});
