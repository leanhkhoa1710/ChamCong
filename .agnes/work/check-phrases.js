const fs = require('fs');

// How admin version uses locale/language
const a = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/admin/hr/pages/ReportsPage.jsx', 'utf8').split('\n');
console.log('=== ADMIN: lines using locale/language (not the import/def) ===');
a.forEach((l, i) => {
  const t = l.trim();
  if ((/locale/.test(t) || /\blanguage\b/.test(t)) && !/import|const \{ language \}|const locale =/.test(t) && i > 68) {
    console.log((i + 1) + ': ' + t.substring(0, 120));
  }
});

// What phrases already exist in the dict
const lp = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx', 'utf8');
const keys = [];
lp.split('\n').forEach((l) => {
  const m = l.match(/^\s*"(.+?)"\s*:\s*\[\s*"(.*)"\s*,\s*"(.*)"\s*\],?\s*$/);
  if (m) keys.push(m[1]);
});
console.log('\n=== Total phrases in dict: ' + keys.length + ' ===');

// Check which report-related strings are MISSING from the dict
const needed = [
  'All report types', 'Tất cả loại báo cáo',
  'All months', 'Tất cả tháng',
  'All departments', 'Tất cả phòng ban',
  'All statuses', 'Tất cả trạng thái',
  'All deadlines', 'Mọi hạn nộp',
  '1. Tổng quan', 'Tổng quan', '2. Kết quả thực hiện', 'Kết quả thực hiện',
  '3. Khó khăn / vấn đề', 'Khó khăn / vấn đề', '4. Kiến nghị / đề xuất', 'Kiến nghị / đề xuất',
  'Tổng báo cáo', 'Chờ tôi duyệt', 'Chờ gửi cấp trên', 'Cấp trên yêu cầu', 'Hoàn tất', 'Cần xử lý', 'Quá hạn',
  '📥 1. Báo cáo cấp dưới gửi đến tôi', '📤 2. Báo cáo gửi cấp trên', '📌 3. Yêu cầu / phản hồi từ cấp trên', '📋 4. Tất cả báo cáo', '🕐 Hoạt động gần đây',
  'Tải xuống', 'Không có nội dung.', 'Chi tiết báo cáo', 'Mã BC', 'Trạng thái',
];
console.log('\n=== MISSING from dict (need to add) ===');
needed.forEach((n) => {
  const isKey = keys.includes(n);
  // also check if present as EN or ZH value
  const asValue = keys.some((k) => {
    const m = lp.match(new RegExp('"' + k + '"\\s*:\\s*\\[\\s*"(' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')"'));
    return m;
  });
  if (!isKey) console.log('  MISSING: ' + n + (asValue ? ' (exists as a value only)' : ''));
});
