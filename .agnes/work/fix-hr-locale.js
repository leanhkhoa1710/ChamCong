const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/HrPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
// 1. Remove unused locale declaration
c = c.replace('    const locale = localeForLanguage(language);' + nl, '');
// 2. Remove localeForLanguage from import (now unused)
c = c.replace('import { localeForLanguage, translate, useLanguage } from "../../../../services/i18n/LanguageProvider";',
              'import { translate, useLanguage } from "../../../../services/i18n/LanguageProvider";');
fs.writeFileSync(f, c, 'utf8');
console.log('Fixed HrPage: removed unused locale + localeForLanguage import');
