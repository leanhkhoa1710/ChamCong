const fs = require('fs');
const path = require('path');
const root = 'D:/Monica/M-ChamCong/ChamCong/src';

function fixCRLF(rel, pairs) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { console.log('MISSING: ' + rel); return; }
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  const useCRLF = c.includes('\r\n');
  const nl = useCRLF ? '\r\n' : '\n';

  for (const pair of pairs) {
    const find = pair[0].split('\n').join(nl);
    const repl = (pair[1] || '').split('\n').join(nl);
    const global = pair[2] || false;

    if (global) {
      const parts = c.split(find);
      if (parts.length < 2) {
        console.log('  WARN(global): not found in ' + rel + ': ' + JSON.stringify(pair[0].substring(0, 80)));
        continue;
      }
      c = parts.join(repl);
    } else {
      if (!c.includes(find)) {
        console.log('  WARN: not found in ' + rel + ': ' + JSON.stringify(pair[0].substring(0, 80)));
        continue;
      }
      c = c.replace(find, repl);
    }
  }

  if (c !== orig) {
    fs.writeFileSync(file, c, 'utf8');
    console.log('OK: ' + rel + ' (CRLF=' + useCRLF + ')');
  } else {
    console.log('NO CHANGE: ' + rel);
  }
}

// 1. Header.jsx — remove unused useLanguage import + destructure
fixCRLF('components/layout/Header.jsx', [
  ['import { useLanguage } from "../../services/i18n/LanguageProvider";', ''],
  ['const { language, setLanguage } = useLanguage();', ''],
]);

// 2. AdminContractPage.jsx — eslint-disable for exhaustive-deps
fixCRLF('modules/admin/contracts/pages/AdminContractPage.jsx', [
  [
    '    useEffect(() => {\n        load();\n    }, []);',
    '    // eslint-disable-next-line react-hooks/exhaustive-deps\n    useEffect(() => {\n        load();\n    }, []);'
  ],
]);

// 3. EmployeeListPage.jsx — remove unused hrMode
fixCRLF('modules/employees/EmployeeListPage.jsx', [
  [
    '    pendingOf,\n    emptyText,\n    hrMode = false,\n}) => {',
    '    pendingOf,\n    emptyText,\n}) => {'
  ],
]);

// 4. useHrFilters.js — remove unused salaries/insurance lines
fixCRLF('modules/employees/hr/hooks/useHrFilters.js', [
  [
    'const salaries = data.salaries.filter((item) => item.employeeId === e.id);\n            const insurance = data.insurance.filter((item) => item.employeeId === e.id);\n',
    ''
  ],
]);
