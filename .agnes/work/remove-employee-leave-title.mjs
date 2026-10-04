import fs from 'node:fs';

const file = 'ChamCong/src/modules/employees/leaves/pages/EmployeeLeavePage.jsx';
let text = fs.readFileSync(file, 'utf8');
const pattern = /(\r?\n)[ \t]*title="Nghỉ phép"(\r?\n)[ \t]*subtitle="Duyệt \/ từ chối các đơn xin nghỉ phép"/;
if (!pattern.test(text)) {
    console.error('Title block not found');
    process.exit(1);
}
text = text.replace(pattern, '');
fs.writeFileSync(file, text, 'utf8');
console.log('Employee leave title removed');
