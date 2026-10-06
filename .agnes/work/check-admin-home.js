const fs = require('fs');
const lp = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx', 'utf8');
const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });
const candidates = [
  "Trang chủ", "Chọn chức năng để quản lý",
  "Giờ Việt Nam · GMT+7",
  "Nhân sự", "Hồ sơ & tuyển mới",
  "Chấm công", "Lịch sử & duyệt công",
  "Thống kê", "Công tác theo tháng",
  "Hợp đồng", "Ký & theo dõi hạn",
  "Nghỉ phép", "Duyệt đơn xin nghỉ",
  "Lương", "Bảng lương tháng",
  "Nghỉ việc", "Lưu trữ nhân viên",
  "Báo cáo", "Tổng hợp công việc",
  "Cấp tài khoản", "Mã kích hoạt",
];
candidates.forEach((c) => console.log((existing.has(c) ? 'EXISTS ' : 'MISSING') + ' ' + c));
