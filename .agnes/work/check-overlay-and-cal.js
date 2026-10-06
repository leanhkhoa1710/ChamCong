const fs = require('fs');

// Check if .att-overlay exists
const cssFiles = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/attendance/attendance.css',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/admin.css',
];
for (const f of cssFiles) {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('.att-overlay')) {
    console.log('.att-overlay found in: ' + f);
    c.split('\n').forEach((l, i) => { if (l.includes('.att-overlay')) console.log((i+1) + ': ' + l); });
  }
}

// Check the calendar title line
const f2 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx';
const c2 = fs.readFileSync(f2, 'utf8').split('\n');
c2.forEach((l, i) => { if (l.includes('ngày') || l.includes('calTitle')) console.log(f2.split('src/modules/')[1] + ':' + (i+1) + ': ' + l.trim()); });
