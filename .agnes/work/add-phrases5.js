const fs = require('fs');

// First, add any remaining phrases to dict
const lpFile = 'D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx';
let lp = fs.readFileSync(lpFile, 'utf8');
const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });

const add = [
  ["Ngày", "Date", "日期"],
  ["Không có bản ghi", "No records", "无记录"],
  ["Đang trong ca", "On shift", "在岗"],
  ["Ra ca", "Check out", "下班"],
  ["Đúng giờ", "On time", "准时"],
  ["Về sớm", "Early leave", "早退"],
  ["Lễ", "Holiday", "节日"],
  ["Ngoại tuần", "Off-duty", "外勤"],
  ["Chưa đánh giá", "Not rated", "未评估"],
  ["Chờ duyệt", "Pending approval", "待审批"],
  ["Đã duyệt", "Approved", "已审批"],
  ["Tháng trước", "Previous month", "上个月"],
  ["Tháng sau", "Next month", "下个月"],
  ["Xem hôm nay", "View today", "查看今天"],
  ["Xem tất cả", "View all", "查看全部"],
  ["Tìm mã hoặc tên nhân viên...", "Search code or employee name...", "搜索代码或员工姓名…"],
  ["Không xác định được người duyệt (chưa liên kết nhân viên).", "Cannot determine the approver (employee not linked).", "无法确定审批人（未关联员工）。"],
];
const toAdd = add.filter(([vi]) => !existing.has(vi));
if (toAdd.length) {
  const nl = lp.includes('\r\n') ? '\r\n' : '\n';
  const block = toAdd.map(([vi, en, zh]) => `    "${vi}": ["${en}", "${zh}"],`).join(nl);
  const start = lp.indexOf('const phrases = {');
  let close = lp.indexOf('\n};', start);
  if (close === -1) close = lp.indexOf('\n};\n', start);
  const at = close + 1;
  lp = lp.substring(0, at) + block + nl + lp.substring(at);
  fs.writeFileSync(lpFile, lp, 'utf8');
  console.log('Added ' + toAdd.length + ' more phrases');
}
