const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/HrPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let applied = 0, missing = [];
const w = (find, repl) => { if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push(find.substring(0, 45)); };

// 1. module-level activeLocale cache + use it in formatDate/formatMoney
w('const formatDate = (value) => value ? new Date(value).toLocaleDateString("vi-VN") : "—";',
  'let activeLocale = "vi-VN";\nconst formatDate = (value) => value ? new Date(value).toLocaleDateString(activeLocale) : "—";');
w('const formatMoney = (value) => value != null && value !== "" ? `${Number(value).toLocaleString("vi-VN")} ₫` : "—";',
  'const formatMoney = (value) => value != null && value !== "" ? `${Number(value).toLocaleString(activeLocale)} ₫` : "—";');

// 2. import localeForLanguage back (it was removed)
w('import { translate, useLanguage } from "../../../../services/i18n/LanguageProvider";',
  'import { localeForLanguage, translate, useLanguage } from "../../../../services/i18n/LanguageProvider";');

// 3. refresh cache synchronously in component (right after L definition)
w('    const L = (text) => translate(text, language);',
  '    const L = (text) => translate(text, language);' + nl +
  '    activeLocale = localeForLanguage(language);');

fs.writeFileSync(f, c, 'utf8');
console.log('HrPage dates: ' + applied + ' applied, ' + missing.length + ' missing');
missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
