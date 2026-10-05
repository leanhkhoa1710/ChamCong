const fs = require('fs');
const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx', 'utf8').split('\n');
// Show CSV block and the two buttons
function show(a, b) { for (let i = a - 1; i < b; i++) if (c[i] !== undefined) console.log((i + 1) + ': ' + JSON.stringify(c[i])); }
show(155, 175);
console.log('--- buttons ---');
show(295, 300);
show(348, 355);
