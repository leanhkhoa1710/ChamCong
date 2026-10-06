const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx';
let c = fs.readFileSync(f, 'utf8');
let applied = 0, missing = [];
function w(find, repl) { if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push(find.substring(0, 45)); }

// 1. Revert CSV object keys back to plain string literals (L("X") as a key is a syntax error)
w('L("Mã NV"): r.employeeCode', '"Mã NV": r.employeeCode');
w('L("Họ tên"): e?.fullName', '"Họ tên": e?.fullName');
w('L("Ngày"): formatVnDate', '"Ngày": formatVnDate');
w('L("Giờ vào"): formatVnTime', '"Giờ vào": formatVnTime');
w('L("Giờ ra"): formatVnTime', '"Giờ ra": formatVnTime');
w('L("Giờ công"): r.actualHours', '"Giờ công": r.actualHours');
w('L("Trạng thái"): statusLabel', '"Trạng thái": statusLabel');
w('L("Duyệt"): approvalLabel', '"Duyệt": approvalLabel');
w('Object.keys(rowsCsv[0] || { L("Mã NV"): "" })', 'Object.keys(rowsCsv[0] || { "Mã NV": "" })');

// 2. Fix the double-wrap L(L("Duyệt"))
w('{L(L("Duyệt"))}', '{L("Duyệt")}');

fs.writeFileSync(f, c, 'utf8');
console.log('repair history: ' + applied + ' applied, ' + missing.length + ' not-found');
missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
