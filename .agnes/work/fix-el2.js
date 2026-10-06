const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/EmployeeListPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = '\r\n';
let applied = 0, missing = [];

function w(find, repl) {
  if (c.includes(find)) { c = c.split(find).join(repl); applied++; }
  else missing.push(find.substring(0, 50));
}

// Line 55: the alert ternary (with 16 spaces indent)
w('                (fn === reject ? "Từ chối" : "Duyệt") +' + nl +
  '                    " thất bại: " +' + nl,
  '                (fn === reject ? L("Từ chối") : L("Duyệt")) +' + nl +
  '                    L("thất bại:") + " " +' + nl);

// Line 129: the export CSV button (with lots of spaces + standalone text line)
w('                                ⬇ Xuất CSV' + nl +
  '                            </button>',
  '                                {L("⬇ Xuất CSV")}' + nl +
  '                            </button>');

// Line 154: emptyText fallback (with lots of leading spaces + " on a single line)
w('                                                    "Không có dữ liệu."}',
  '                                                    L("Không có dữ liệu.")}');

fs.writeFileSync(f, c, 'utf8');
console.log('fix2: ' + applied + ' applied, ' + missing.length + ' not-found');
missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
