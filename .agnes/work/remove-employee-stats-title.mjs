import fs from 'node:fs';

const file = 'ChamCong/src/modules/employees/attendance/pages/EmployeeStatisticsPage.jsx';
let text = fs.readFileSync(file, 'utf8');
const pattern = /(\r?\n)[ \t]*title="Thống kê công"(\r?\n)[ \t]*subtitle="Tổng hợp ngày công của tất cả nhân viên theo tháng"/;
if (!pattern.test(text)) {
    console.error('Title block not found');
    process.exit(1);
}
text = text.replace(pattern, '');
fs.writeFileSync(file, text, 'utf8');
console.log('Employee statistics title removed');
