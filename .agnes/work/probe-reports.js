const fs = require('fs');

// 1. Which component does /employees/reports render?
function grepFile(rel, pattern, label) {
  try {
    const c = fs.readFileSync(rel, 'utf8').split('\n');
    console.log('=== ' + label + ' ===');
    c.forEach((l, i) => { if (new RegExp(pattern, 'i').test(l)) console.log((i + 1) + ': ' + l.trim()); });
  } catch (e) { console.log(label + ': ' + e.message); }
}

// Find the routes file
const srcRoot = 'D:/Monica/M-ChamCong/ChamCong/src';
function findFiles(dir, re, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist') continue;
    const full = dir + '/' + e.name;
    if (e.isDirectory()) findFiles(full, re, out);
    else if (re.test(e.name)) out.push(full);
  }
  return out;
}
const routeFiles = findFiles(srcRoot, /routes\.jsx?$|Routes\.jsx$/i);
routeFiles.forEach((f) => grepFile(f, 'report', f.replace('D:/Monica/M-ChamCong/', '') + ' [report]'));

// 2. Does the employees ReportsPage already reference translate/language anywhere?
console.log('\n=== employees ReportsPage i18n refs ===');
grepFile('D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/ReportsPage.jsx', 'translate|useLanguage|localeForLanguage|const L', 'emp-reports');

// 3. Which report-related phrases ALREADY exist in the dict (as VI key)
const lp = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx', 'utf8');
const existing = new Set();
lp.split('\n').forEach((l) => {
  const m = l.match(/^\s*"(.+?)"\s*:\s*\[/);
  if (m) existing.add(m[1]);
});
const candidates = [
  'Tất cả loại báo cáo', 'Tất cả tháng', 'Tất cả phòng ban', 'Tất cả trạng thái', 'Mọi hạn nộp',
  '1. Tổng quan', 'Tổng quan', '2. Kết quả thực hiện', 'Kết quả thực hiện',
  '3. Khó khăn / vấn đề', 'Khó khăn / vấn đề', '4. Kiến nghị / đề xuất', 'Kiến nghị / đề xuất',
  'Tổng báo cáo', 'Chờ tôi duyệt', 'Chờ gửi cấp trên', 'Cấp trên yêu cầu', 'Hoàn tất', 'Cần xử lý', 'Quá hạn',
  'Tải xuống', 'Chi tiết báo cáo', 'Mã BC', 'Trạng thái', 'Nhờ gửi', 'Người gửi', 'Bộ phận',
  'Nhân viên gửi báo cáo', 'Quản lý mở báo cáo', 'Nhân viên nhập lại báo cáo cũ',
  'Hệ thống chuyển báo cáo đến quản lý', 'Quản lý từ chối', 'Quản lý yêu cầu sửa',
];
console.log('\n=== Phrases ALREADY in dict ===');
candidates.forEach((c2) => { if (existing.has(c2)) console.log('  EXISTS: ' + c2); });
console.log('\n=== Phrases MISSING from dict ===');
candidates.forEach((c2) => { if (!existing.has(c2)) console.log('  MISSING: ' + c2); });
