const fs = require('fs');
const viRe = /[\u00E0-\u00FA\u1EA0-\u1EF9\u0111]/;
const files = [
  'employees/attendance/components/AttendanceFormModal.jsx',
  'employees/attendance/components/AttendanceDetailModal.jsx',
  'employees/attendance/components/AttendanceHistoryModal.jsx',
];
for (const rel of files) {
  const p = 'D:/Monica/M-ChamCong/ChamCong/src/modules/' + rel;
  if (!fs.existsSync(p)) { console.log('MISSING: ' + rel); continue; }
  const c = fs.readFileSync(p, 'utf8').split('\n');
  console.log('\n========== ' + rel + ' (' + c.length + ' lines)');
  c.forEach((l, i) => {
    const t = l.trim();
    if (viRe.test(t) && t && !/^\s*\/\//.test(l) && !/translate\(|useLanguage|import/.test(t)) {
      console.log((i + 1) + ': ' + t.substring(0, 120));
    }
  });
}
