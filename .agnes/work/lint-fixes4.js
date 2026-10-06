const fs = require('fs');
const path = require('path');
const root = 'D:/Monica/M-ChamCong/ChamCong/src';

function fileContent(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function writeFile(rel, c) {
  fs.writeFileSync(path.join(root, rel), c, 'utf8');
}

// ============================================================
// 1. AdminContractPage.jsx — fix the eslint-disable placement
// ============================================================
let c = fileContent('modules/admin/contracts/pages/AdminContractPage.jsx');

// Remove the broken eslint-disable-next-line comment I added
const oldBlock = '    // eslint-disable-next-line react-hooks/exhaustive-deps\r\n    useEffect(() => {\r\n        load();\r\n    }, []);';
const newBlock = '    /* eslint-disable react-hooks/exhaustive-deps */\r\n    useEffect(() => {\r\n        load();\r\n    }, []);\r\n    /* eslint-enable react-hooks/exhaustive-deps */';

if (c.includes(oldBlock)) {
  c = c.replace(oldBlock, newBlock);
  writeFile('modules/admin/contracts/pages/AdminContractPage.jsx', c);
  console.log('OK: AdminContractPage.jsx — block disable');
} else {
  // Try without CRLF
  const oldBlockLF = '    // eslint-disable-next-line react-hooks/exhaustive-deps\n    useEffect(() => {\n        load();\n    }, []);';
  if (c.includes(oldBlockLF)) {
    c = c.replace(oldBlockLF, newBlock.replace(/\r\n/g, '\n'));
    writeFile('modules/admin/contracts/pages/AdminContractPage.jsx', c);
    console.log('OK: AdminContractPage.jsx — block disable (LF)');
  } else {
    console.log('WARN: AdminContractPage.jsx — pattern not found, dumping lines 68-78:');
    c.split('\n').slice(67, 78).forEach((l, i) => console.log('  ' + (i+68) + ': ' + l));
  }
}

// ============================================================
// 2. Admin AccountIssuancePage.jsx — remove openVerification block
// ============================================================
function removeFnBlock(rel, fnName) {
  let content = fileContent(rel);
  const startMarker = '    const ' + fnName + ' = async (employee) => {';
  const si = content.indexOf(startMarker);
  if (si === -1) { console.log('WARN: ' + fnName + ' not found in ' + rel); return; }
  // Find the matching closing "    };"
  const endMarker = '\r\n    };';
  const endMarkerLF = '\n    };';
  const ei = content.includes(endMarker) ? content.indexOf(endMarker, si) : content.indexOf(endMarkerLF, si);
  if (ei === -1) { console.log('WARN: end not found for ' + fnName + ' in ' + rel); return; }
  // Remove from si to ei+endMarker.length (inclusive)
  const endLen = content.includes(endMarker) ? endMarker.length : endMarkerLF.length;
  content = content.substring(0, si) + content.substring(ei + endLen);
  writeFile(rel, content);
  console.log('OK: removed ' + fnName + ' from ' + rel);
}

removeFnBlock('modules/admin/accounts/pages/AccountIssuancePage.jsx', 'openVerification');
removeFnBlock('modules/employees/accounts/pages/AccountIssuancePage.jsx', 'openVerification');
