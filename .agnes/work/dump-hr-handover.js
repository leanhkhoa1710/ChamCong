const fs = require('fs');
const viRe = /[\u00E0-\u00FA\u1EA0-\u1EF9\u0111]/;
for (const rel of ['employees/hr/pages/HrPage.jsx', 'handover/pages/HandoverPage.jsx']) {
  const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/' + rel, 'utf8').split('\n');
  console.log('\n========== ' + rel + ' (' + c.length + ' lines)');
  c.forEach((l, i) => {
    const t = l.trim();
    // only lines that are JS string literals / JSX text with Vietnamese, not already wrapped in L(...)
    if (viRe.test(t) && t && !/^\s*\/\//.test(l) && !/^\s*\*\//.test(l) && !/^\s*\/\*\*/.test(l) && !/translate\(|phrases/.test(t)) {
      console.log((i + 1) + ': ' + t.substring(0, 130));
    }
  });
}
