const fs = require('fs');
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/accounts/pages/AccountIssuancePage.jsx',
];
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  // The load useCallback ends with "    }, []);" followed by "useEffect(() => { load(); }, [load]);"
  // We need to find the specific "}, []);" that belongs to load and change it to "}, [L]);"
  // Use a more specific match: the line before it is the load function body
  const before = c;
  c = c.replace(/    \}, \[\]\);\r?\n    useEffect\(\(\) => \{ load\(\); \}, \[load\]\);/,
    '    }, [L]);\n    useEffect(() => { load(); }, [load]);');
  if (c === before) {
    // Try LF only
    c = c.replace('    }, []);\n    useEffect(() => { load(); }, [load]);',
      '    }, [L]);\n    useEffect(() => { load(); }, [load]);');
  }
  fs.writeFileSync(f, c, 'utf8');
  console.log(f.split('/').slice(-2).join('/') + ': ' + (c !== before ? 'changed' : 'no change'));
}
