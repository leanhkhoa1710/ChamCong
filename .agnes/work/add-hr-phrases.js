const fs = require('fs');
const lpFile = 'D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx';
let lp = fs.readFileSync(lpFile, 'utf8');
const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });

const add = [
  ["Lưu trữ", "Archive", "归档"],
  ["và chuyển hồ sơ sang danh sách Đã nghỉ việc?", "and move the profile to the resigned list?", "并将档案转入已离职名单？"],
  ["Không thể lưu trữ nhân viên.", "Cannot archive the employee.", "无法归档员工。"],
  ["Khôi phục hồ sơ", "Restore profile", "恢复档案"],
  ["về danh sách nhân viên?", "back to the employee list?", "回到员工名单？"],
  ["Không thể khôi phục nhân viên.", "Cannot restore the employee.", "无法恢复员工。"],
  ["Không đọc được", "Unreadable", "无法读取"],
  ["Thiếu cột", "Missing column", "缺少列"],
  ["Đã tồn tại — bỏ qua", "Already exists — skipped", "已存在——跳过"],
  ["Cần chỉnh sửa", "Needs editing", "需编辑"],
  ["Đã thêm, cần kiểm tra", "Added, needs review", "已添加，需检查"],
  ["Đã thêm thành công", "Added successfully", "已成功添加"],
  ["Không thêm được", "Could not add", "无法添加"],
  ["Đang tải...", "Loading...", "加载中…"],
  ["Nhập danh sách nhân viên từ tệp Excel hoặc CSV", "Import employee list from Excel or CSV file", "从 Excel 或 CSV 文件导入员工名单"],
  ["⬆ Nhập Excel", "⬆ Import Excel", "⬆ 导入 Excel"],
  ["⬇ Tải mẫu", "⬇ Download template", "⬇ 下载模板"],
  ["⬇ Xuất danh sách", "⬇ Export list", "⬇ 导出名单"],
  ["+ Thêm nhân viên", "+ Add employee", "+ 添加员工"],
  ["1. Danh tính", "1. Identity", "1. 身份"],
  ["2. Giấy tờ pháp lý", "2. Legal documents", "2. 法律文件"],
  ["3. Địa chỉ liên hệ", "3. Contact address", "3. 联系地址"],
  ["4. Điều kiện làm việc", "4. Working conditions", "4. 工作条件"],
  ["5. Hợp đồng", "5. Contract", "5. 合同"],
  ["6. Lương & chế độ", "6. Salary & benefits", "6. 薪资与福利"],
  ["7. Bảo hiểm & thuế", "7. Insurance & tax", "7. 保险与税务"],
  ["8. Thanh toán", "8. Payment", "8. 支付"],
  ["Ghi chú", "Note", "备注"],
  ["Kết quả nhập nhân viên", "Employee import results", "员工导入结果"],
  ["Tất cả dòng hợp lệ đã được nhập.", "All valid rows have been imported.", "所有有效行已导入。"],
  ["Đóng", "Close", "关闭"],
  ["Sửa hồ sơ", "Edit profile", "编辑档案"],
  ["Đã nghỉ việc", "Resigned", "已离职"],
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
  console.log('Added ' + toAdd.length + ' phrases (' + (add.length - toAdd.length) + ' existed)');
} else console.log('All present');
