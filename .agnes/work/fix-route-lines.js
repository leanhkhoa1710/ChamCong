const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/App.jsx';
let c = fs.readFileSync(f, 'utf8');
let fixed = 0;
// Each broken line ends with ` />)` instead of ` />) }/>` ... actually the pattern is
// `<Route ... />` should be `<Route ... />` with closing `>` after `}`
// Currently: element={guarded("...", <X />)} /
// Expected:  element={guarded("...", <X />)} />
// i.e. add `>` after the `}`
const re = /(\s*)<(Route path="\/admin\/employees\/[a-z-]+" element=\{guarded\([^}]+\}))( \/)(\s*\n)/g;
// Simpler: match each <Route path="/admin/employees/...` line ending with ` /` (space slash, no >)
c = c.replace(/(<Route path="\/admin\/employees\/[a-z-]+" element="\{guarded\("[^"]*", <[A-Za-z]+(?: reviewMode)?" ?\/>\)\}) (\/)(\s*\n)/g,
  (m, pre, slash, newline) => pre + ' />' + newline);

// Count the result
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<Route path="/admin/employees/')) {
    if (!l.trim().endsWith('/>')) {
      // broken - find the line and fix it
      const broken = l.replace(/\s*\/\s*$/, ' />');
      lines[i] = broken;
      fixed++;
    }
  }
});
if (fixed > 0) c = lines.join('\n');
fs.writeFileSync(f, c, 'utf8');
console.log('Fixed ' + fixed + ' broken route lines');
lines.forEach((l, i) => { if (l.includes('<Route path="/admin/employees/')) console.log((i + 1) + ': ' + l.trim()); });
