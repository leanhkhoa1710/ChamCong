const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const before = c;
c = c.replace('<th>{L(L("Trạng thái"))}</th>', '<th>{L("Trạng thái")}</th>');
// Also dedupe any remaining L(L()
let g = 0;
while (c.includes('L(L(') && g < 20) { c = c.replace('L(L(', 'L('); g++; }
fs.writeFileSync(f, c, 'utf8');
console.log('changed:', c !== before, '| deduped:', g, '| remaining L(L(:', (c.match(/L\(L\(/g) || []).length);
