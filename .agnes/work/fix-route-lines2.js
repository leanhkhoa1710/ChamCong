const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/App.jsx';
let c = fs.readFileSync(f, 'utf8');

// Each line that should be: <Route path="..." element={guarded("...", <X />)} />
// But is actually:  <Route path="..." element={guarded("...", <X />)} /
// Fix: replace `)} /` at end of these lines with `)} />`
const routeLines = c.split('\n');
let fixed = 0;
for (let i = 0; i < routeLines.length; i++) {
  const l = routeLines[i];
  // Match lines that start with <Route path="/admin/employees/" and end with `}/` or `} /`
  if (l.trim().startsWith('<Route path="/admin/employees/') && /}\s*\/\s*$/.test(l)) {
    // Replace the trailing `}` + whitespace + `/` with `} />`
    routeLines[i] = l.replace(/}\s*\/\s*$/, '} />');
    fixed++;
  }
}
c = routeLines.join('\n');
fs.writeFileSync(f, c, 'utf8');
console.log('Fixed ' + fixed + ' route lines');
// Verify
c = fs.readFileSync(f, 'utf8').split('\n');
c.forEach((l, i) => { if (l.includes('<Route path="/admin/employees/')) console.log((i + 1) + ': ' + l.trim()); });
