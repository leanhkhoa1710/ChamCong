const fs = require('fs');

function patch(rel) {
  const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/' + rel;
  let c = fs.readFileSync(f, 'utf8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  let applied = 0, missing = [];
  const w = (find, repl) => { if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push(find.substring(0, 45)); };

  // Add module-level activeLocale cache before the date/time helpers
  w('const date = (value) => value ? new Date(value).toLocaleDateString("vi-VN") : "—";',
    'let activeLocale = "vi-VN";\nconst date = (value) => value ? new Date(value).toLocaleDateString(activeLocale) : "—";');
  w('const time = (value) => value ? new Date(value).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";',
    'const time = (value) => value ? new Date(value).toLocaleString(activeLocale, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";');

  // In the main component, refresh the cache synchronously each render.
  // Anchor: the L helper line we added earlier.
  w('const L = (text) => translate(text, language);',
    'const L = (text) => translate(text, language);' + nl +
    '    activeLocale = localeForLanguage(language);');

  // Ensure localeForLanguage is imported
  if (!c.includes('localeForLanguage')) {
    w('import { translate, useLanguage }', 'import { localeForLanguage, translate, useLanguage }');
  }

  fs.writeFileSync(f, c, 'utf8');
  console.log(rel + ': ' + applied + ' applied, ' + missing.length + ' missing');
  missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
}

patch('employees/hr/pages/ReportsPage.jsx');
