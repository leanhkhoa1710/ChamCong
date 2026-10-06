const fs = require('fs');
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/accounts/pages/AccountIssuancePage.jsx',
];
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;
  // 1) Wrap L in useCallback (stable per language)
  c = c.replace(
    'const L = (text) => translate(text, language);',
    'const L = useCallback((text) => translate(text, language), [language]);'
  );
  // 2) Keep L in the load dependency array (already added by fix-deps)
  fs.writeFileSync(f, c, 'utf8');
  console.log(f.split('/').slice(-2).join('/') + ': ' + (c !== before ? 'L wrapped in useCallback' : 'no change'));
}
