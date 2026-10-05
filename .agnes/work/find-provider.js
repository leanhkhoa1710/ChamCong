const fs = require('fs');
function find(dir, re, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist') continue;
    const full = dir + '/' + e.name;
    if (e.isDirectory()) find(full, re, out);
    else if (/\.(jsx?|js)$/.test(e.name)) {
      const c = fs.readFileSync(full, 'utf8');
      c.split('\n').forEach((l, i) => { if (re.test(l)) out.push(full.replace('D:/Monica/M-ChamCong/', '') + ':' + (i + 1) + ': ' + l.trim()); });
    }
  }
  return out;
}
console.log('=== <LanguageProvider> usage ===');
find('D:/Monica/M-ChamCong/ChamCong/src', /<LanguageProvider|LanguageProvider\s*>|LanguageProvider\b/).slice(0, 30).forEach((l) => console.log(l));
