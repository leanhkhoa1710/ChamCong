const fs = require('fs');
const path = require('path');
const root = 'D:/Monica/M-ChamCong/ChamCong/src';

let totalChanged = 0;

function fixFile(rel, pairs) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { console.log('  MISSING: ' + rel); return; }
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  for (const pair of pairs) {
    const find = pair[0];
    const repl = pair[1] || '';
    const global = pair[2] || false;
    if (global) {
      const parts = c.split(find);
      if (parts.length < 2) {
        console.log('  WARN: not found (global) in ' + rel + ': ' + JSON.stringify(find.substring(0, 60)));
        continue;
      }
      c = parts.join(repl);
    } else {
      if (!c.includes(find)) {
        console.log('  WARN: not found in ' + rel + ': ' + JSON.stringify(find.substring(0, 60)));
        continue;
      }
      c = c.replace(find, repl);
    }
  }
  if (c !== orig) {
    fs.writeFileSync(file, c, 'utf8');
    console.log('  OK: ' + rel);
    totalChanged++;
  } else {
    console.log('  NO CHANGE: ' + rel);
  }
}

function removeFn(rel, fnName) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { console.log('  MISSING: ' + rel); return; }
  let c = fs.readFileSync(file, 'utf8');
  const startStr = '    const ' + fnName + ' = async (employee) => {';
  const si = c.indexOf(startStr);
  if (si === -1) { console.log('  WARN: ' + fnName + ' start not found in ' + rel); return; }
  const endStr = '    };';
  const ei = c.indexOf(endStr, si + startStr.length);
  if (ei === -1) { console.log('  WARN: ' + fnName + ' end not found in ' + rel); return; }
  c = c.substring(0, si) + c.substring(ei + endStr.length + 1);
  fs.writeFileSync(file, c, 'utf8');
  console.log('  OK: removed ' + fnName + ' from ' + rel);
  totalChanged++;
}

// ============================================================
// 1. Header.jsx — remove unused useLanguage
// ============================================================
fixFile('components/layout/Header.jsx', [
  ['import { useLanguage } from "../../services/i18n/LanguageProvider";\n', ''],
  ['    const { language, setLanguage } = useLanguage();\n', ''],
]);

// ============================================================
// 2. Admin AccountIssuancePage.jsx — eslint-disable + remove renewAccount
// ============================================================
fixFile('modules/admin/accounts/pages/AccountIssuancePage.jsx', [
  [
    'const xmlEscape = (value) =>',
    '// eslint-disable-next-line no-control-regex\n' +
    'const xmlEscape = (value) =>'
  ],
]);
removeFn('modules/admin/accounts/pages/AccountIssuancePage.jsx', 'renewAccount');

// ============================================================
// 3. Employees AccountIssuancePage.jsx — eslint-disable + remove hrMode + remove renewAccount
// ============================================================
fixFile('modules/employees/accounts/pages/AccountIssuancePage.jsx', [
  [
    'const xmlEscape = (value) =>',
    '// eslint-disable-next-line no-control-regex\n' +
    'const xmlEscape = (value) =>'
  ],
  [
    'const AccountIssuancePage = ({ hrMode = false }) => {',
    'const AccountIssuancePage = () => {'
  ],
]);
removeFn('modules/employees/accounts/pages/AccountIssuancePage.jsx', 'renewAccount');

// ============================================================
// 4. AdminContractPage.jsx — eslint-disable for exhaustive-deps
// ============================================================
fixFile('modules/admin/contracts/pages/AdminContractPage.jsx', [
  [
    '    useEffect(() => {\n        load();\n    }, []);',
    '    // eslint-disable-next-line react-hooks/exhaustive-deps\n' +
    '    useEffect(() => {\n        load();\n    }, []);'
  ],
]);

// ============================================================
// 5. HrPage.jsx (admin) — fix [/.\\-] → [/.-]  (2 occurrences, global)
// ============================================================
// The file contains the regex: /[\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/
// The character class [/.\\-] in the file (6 chars) is being replaced with [/.-] (5 chars)
fixFile('modules/admin/hr/pages/HrPage.jsx', [
  ['[/.\\-]', '[/.-]', true],
]);

// ============================================================
// 6. HrPage.jsx (employees) — same fix
// ============================================================
fixFile('modules/employees/hr/pages/HrPage.jsx', [
  ['[/.\\-]', '[/.-]', true],
]);

// ============================================================
// 7. ReportsPage.jsx (admin) — remove unused useRef import
// ============================================================
fixFile('modules/admin/hr/pages/ReportsPage.jsx', [
  [
    'import { useCallback, useEffect, useMemo, useRef, useState } from "react";',
    'import { useCallback, useEffect, useMemo, useState } from "react";'
  ],
]);

// ============================================================
// 8. ReportsPage.jsx (employees) — remove unused useRef import
// ============================================================
fixFile('modules/employees/hr/pages/ReportsPage.jsx', [
  [
    'import { useCallback, useEffect, useMemo, useRef, useState } from "react";',
    'import { useCallback, useEffect, useMemo, useState } from "react";'
  ],
]);

// ============================================================
// 9. EmployeeListPage.jsx — remove unused hrMode param
// ============================================================
fixFile('modules/employees/EmployeeListPage.jsx', [
  [
    '    pendingOf,\n    emptyText,\n    hrMode = false,\n}) => {',
    '    pendingOf,\n    emptyText,\n}) => {'
  ],
]);

// ============================================================
// 10. EmployeeAttendanceHistoryPage.jsx — remove unused hrMode
// ============================================================
fixFile('modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx', [
  [
    'const EmployeeAttendanceHistoryPage = ({ hrMode = false }) => {',
    'const EmployeeAttendanceHistoryPage = () => {'
  ],
]);

// ============================================================
// 11. EmployeeStatisticsPage.jsx — remove unused hrMode
// ============================================================
fixFile('modules/employees/attendance/pages/EmployeeStatisticsPage.jsx', [
  [
    'const EmployeeStatisticsPage = ({ hrMode = false }) => {',
    'const EmployeeStatisticsPage = () => {'
  ],
]);

// ============================================================
// 12. useHrFilters.js — remove unused salaries/insurance lines
// ============================================================
fixFile('modules/employees/hr/hooks/useHrFilters.js', [
  [
    '            const salaries = data.salaries.filter((item) => item.employeeId === e.id);\n            const insurance = data.insurance.filter((item) => item.employeeId === e.id);\n',
    ''
  ],
]);

console.log('\nTotal files changed: ' + totalChanged);
