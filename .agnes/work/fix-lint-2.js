const fs = require('fs');

// 1. History: add locale to calTitle useMemo deps
const f1 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx';
let c1 = fs.readFileSync(f1, 'utf8');
// The calTitle useMemo deps array
let applied1 = 0;
if (c1.includes('}, [calMonth, selectedDate]);')) {
  c1 = c1.replace('}, [calMonth, selectedDate]);', '}, [calMonth, selectedDate, locale, L]);');
  applied1++;
}
fs.writeFileSync(f1, c1, 'utf8');
console.log('history deps:', applied1);

// 2. Statistics: remove unused locale (or use it). Simplest: remove the locale line.
const f2 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeStatisticsPage.jsx';
let c2 = fs.readFileSync(f2, 'utf8');
let applied2 = 0;
if (c2.includes('    const locale = localeForLanguage(language);\n')) {
  c2 = c2.replace('    const locale = localeForLanguage(language);\n', '');
  applied2++;
}
// Also remove localeForLanguage from import if now unused
if (applied2 && c2.includes('import { localeForLanguage, translate, useLanguage }')) {
  c2 = c2.replace('import { localeForLanguage, translate, useLanguage }', 'import { translate, useLanguage }');
}
fs.writeFileSync(f2, c2, 'utf8');
console.log('statistics locale removed:', applied2);
