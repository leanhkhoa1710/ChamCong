const fs = require('fs');

const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/accounts/pages/AccountIssuancePage.jsx',
];

const wraps = [
  // load catch (with err.message fallback)
  ['setError(err.response?.data?.message || err.message || "Không tải được danh sách tài khoản.")',
   'setError(err.response?.data?.message || err.message || L("Không tải được danh sách tài khoản."))'],
  // verify catch
  ['setError(err.response?.data?.message || "Không xác minh được mã kích hoạt.")',
   'setError(err.response?.data?.message || L("Không xác minh được mã kích hoạt."))'],
  // Excel / issue buttons (both files)
  ['>Xuất Excel ({unlinked.length})</button>', '>{L("Xuất Excel")} ({unlinked.length})</button>'],
  ['>Cấp mã ({selected.size})</button>', '>{L("Cấp mã")} ({selected.size})</button>'],
  // admin-only "nhân viên đang làm việc" muted count
  ['{visibleEmployees.length}/{working.length} nhân viên đang làm việc',
   '{visibleEmployees.length}/{working.length} {L("nhân viên đang làm việc")}'],
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  let applied = 0, missing = [];
  for (const [find, repl] of wraps) {
    if (c.includes(find)) { c = c.split(find).join(repl); applied++; }
    else missing.push(find.substring(0, 50));
  }
  fs.writeFileSync(f, c, 'utf8');
  console.log(f.split('/').slice(-2).join('/') + ': ' + applied + ' applied, ' + missing.length + ' not-found');
  if (missing.length) missing.forEach((m) => console.log('   - ' + m));
}
