const fs = require('fs');
const root = 'D:/Monica/M-ChamCong/ChamCong/src';
function grep(rel, pat) {
  const c = fs.readFileSync(root + '/' + rel, 'utf8').split('\n');
  const rx = new RegExp(pat, 'g');
  c.forEach((l, i) => { rx.lastIndex = 0; if (rx.test(l)) console.log(rel + ':' + (i + 1) + ': ' + l.trim()); });
}
console.log('=== Header.jsx useLanguage/language/setLanguage ===');
grep('components/layout/Header.jsx', 'useLanguage|\\blanguage\\b|\\bsetLanguage\\b');
console.log('=== admin AccountIssuancePage renewAccount ===');
grep('modules/admin/accounts/pages/AccountIssuancePage.jsx', 'renewAccount');
console.log('=== employees AccountIssuancePage renewAccount ===');
grep('modules/employees/accounts/pages/AccountIssuancePage.jsx', 'renewAccount');
console.log('=== admin ReportsPage useRef ===');
grep('modules/admin/hr/pages/ReportsPage.jsx', 'useRef');
console.log('=== employees ReportsPage useRef ===');
grep('modules/employees/hr/pages/ReportsPage.jsx', 'useRef');
console.log('=== useHrFilters salaries/insurance ===');
grep('modules/employees/hr/hooks/useHrFilters.js', 'salaries|insurance');
console.log('=== HrPage(admin) L170 context ===');
grep('modules/admin/hr/pages/HrPage.jsx', 'no-useless|[/\\\\.-]');
console.log('=== EmployeeListPage hrMode ===');
grep('modules/employees/EmployeeListPage.jsx', 'hrMode');
console.log('=== EmployeeAttendanceHistoryPage hrMode ===');
grep('modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx', 'hrMode');
console.log('=== EmployeeStatisticsPage hrMode ===');
grep('modules/employees/attendance/pages/EmployeeStatisticsPage.jsx', 'hrMode');
