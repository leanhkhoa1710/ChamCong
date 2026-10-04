import fs from 'node:fs';

const file = 'ChamCong/src/modules/handover/pages/HandoverPage.jsx';
let text = fs.readFileSync(file, 'utf8');
const pattern = / *<div>\s*<span className="hv-eyebrow">MARIXA · NHÂN SỰ<\/span>\s*<h1>\{reviewMode \? "Duyệt bàn giao nghỉ việc" : "Bàn giao nghỉ việc"\}<\/h1>\s*<p>\{reviewMode \? "Xem tài sản, tài khoản và tiến độ công việc trước khi duyệt\." : "Gửi thông tin bàn giao để cấp trên kiểm tra trước ngày nghỉ việc\."\}<\/p>\s*<\/div>\n?/;
if (!pattern.test(text)) {
    console.error('Handover header text block not found');
    process.exit(1);
}
text = text.replace(pattern, '');
fs.writeFileSync(file, text, 'utf8');
console.log('Handover header text removed');
