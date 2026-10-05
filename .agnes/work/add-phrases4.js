const fs = require('fs');

const lpFile = 'D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx';
let lp = fs.readFileSync(lpFile, 'utf8');
const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });

// All phrases needed across the 4 files
const candidates = [
  // EmployeeListPage
  ["Tìm theo thông tin...", "Search by info...", "按信息搜索…"],
  ["Từ chối", "Reject", "拒绝"],
  ["Duyệt", "Approve", "审批"],
  ["thất bại:", "failed:", "失败："],
  ["Đang tải...", "Loading...", "加载中…"],
  ["Tất cả", "All", "全部"],
  ["bản ghi", "records", "条记录"],
  ["⬇ Xuất CSV", "⬇ Export CSV", "⬇ 导出 CSV"],
  ["Không có dữ liệu.", "No data.", "无数据。"],
  // AttendanceHistory
  ["Không xác định được người duyệt (chưa liên kết nhân viên).", "Cannot determine the approver (employee not linked).", "无法确定审批人（未关联员工）。"],
  ["Không thể chỉnh sửa bản ghi chấm công đã được duyệt.", "Cannot edit an already-approved attendance record.", "无法编辑已审批的考勤记录。"],
  ["Quân số", "Workforce", "总人数"],
  ["Đã vào ca", "Checked in", "已上班"],
  ["Đã ra ca", "Checked out", "已下班"],
  ["Vắng mặt", "Absent", "缺席"],
  ["Tháng trước", "Previous month", "上个月"],
  ["Tháng sau", "Next month", "下个月"],
  ["Chưa duyệt", "Not approved", "未审批"],
  ["Đã xử lý", "Processed", "已处理"],
  ["Xem hôm nay", "View today", "查看今天"],
  ["Xem tất cả", "View all", "查看全部"],
  ["Tìm mã hoặc tên nhân viên...", "Search code or employee name...", "搜索代码或员工姓名…"],
  ["Tìm nhân viên", "Search employee", "搜索员工"],
  ["⬇ Xuất file tháng", "⬇ Export monthly file", "⬇ 导出月度文件"],
  ["+ Thêm", "+ Add", "+ 添加"],
  ["Nhân viên", "Employee", "员工"],
  ["Ngày", "Date", "日期"],
  ["Trạng thái", "Status", "状态"],
  ["Giờ vào → ra", "In → out", "上班 → 下班"],
  ["Giờ thực", "Actual hours", "实际工时"],
  ["Ảnh vào ca", "Check-in photo", "上班照片"],
  ["Ảnh ra ca", "Check-out photo", "下班照片"],
  ["Vào ca", "Check in", "上班"],
  ["Không có bản ghi phù hợp.", "No matching records.", "无匹配记录。"],
  ["Sửa", "Edit", "编辑"],
  ["Xem chi tiết", "View details", "查看详情"],
  // Statistics
  ["Có ngày công", "Has workdays", "有工作日"],
  ["Bản ghi", "Records", "记录"],
  ["trong tháng", "in the month", "本月"],
  ["Đi trễ", "Late", "迟到"],
  ["lượt", "times", "次"],
  ["hiện cả người chưa có", "show those without too", "包含未打卡人员"],
  ["+ Thêm bản ghi", "+ Add record", "+ 添加记录"],
  ["Ngày đã làm", "Days worked", "已工作天数"],
  ["Nghỉ phép", "Leave", "请假"],
  ["Tổng giờ", "Total hours", "总工时"],
  ["Không tìm thấy nhân viên phù hợp.", "No matching employee found.", "未找到匹配员工。"],
  ["Chưa có dữ liệu trong tháng này.", "No data this month.", "本月无数据。"],
  ["Chi tiết", "Details", "详情"],
  // Contracts
  ["Hết hạn", "Expired", "已过期"],
  ["Sắp hết hạn", "Expiring soon", "即将到期"],
  ["Chờ ký", "Pending signature", "待签署"],
  ["Chưa lập", "Not created", "未创建"],
  ["Đã ký", "Signed", "已签署"],
  ["Chọn nhân viên và nhập số hợp đồng.", "Select employee and enter contract number.", "请选择员工并填写合同编号。"],
  ["Tạo thất bại:", "Creation failed:", "创建失败："],
  ["Hợp đồng lao động", "Labor contract", "劳动合同"],
  ["Quản lý hợp đồng: hết hạn · sắp hết hạn · chờ ký · chưa lập · đã ký", "Manage contracts: expired · expiring · pending · not created · signed", "管理合同：已过期 · 即将到期 · 待签署 · 未创建 · 已签署"],
  ["Tìm tên, mã NV...", "Search name, employee code...", "搜索姓名、工号…"],
  ["Tất cả trạng thái", "All statuses", "所有状态"],
  ["hồ sơ", "profiles", "份档案"],
  ["⟳ Tải lại", "⟳ Reload", "⟳ 重新加载"],
  ["+ Tạo hợp đồng", "+ Create contract", "+ 创建合同"],
  ["Phòng ban", "Department", "部门"],
  ["Số HĐ", "Contract no.", "合同编号"],
  ["Loại", "Type", "类型"],
  ["Bắt đầu", "Start", "开始"],
  ["Không có hợp đồng phù hợp.", "No matching contracts.", "无匹配合同。"],
  ["Thử việc", "Probation", "试用期"],
  ["Hạn định", "Fixed term", "固定期限"],
  ["Không xác định", "Indefinite", "无固定期限"],
  ["Mùa vụ", "Seasonal", "季节性"],
  ["Tạo hợp đồng lao động", "Create labor contract", "创建劳动合同"],
  ["— Chọn nhân viên —", "— Select employee —", "— 选择员工 —"],
  ["Số hợp đồng", "Contract number", "合同编号"],
  ["Loại hợp đồng", "Contract type", "合同类型"],
  ["Ngày bắt đầu", "Start date", "开始日期"],
  ["Ngày hết hạn", "End date", "结束日期"],
  ["Hủy", "Cancel", "取消"],
  ["Lưu hợp đồng", "Save contract", "保存合同"],
  ["Mã NV", "Employee code", "工号"],
  ["Họ tên", "Full name", "姓名"],
  ["Giờ vào", "Check-in time", "上班时间"],
  ["Giờ ra", "Check-out time", "下班时间"],
  ["Giờ công", "Work hours", "工时"],
  // common already-used
  ["Cấp trên", "Upper management", "上级"],
  ["Quản lý", "Manager", "经理"],
];

const toAdd = candidates.filter(([vi]) => !existing.has(vi));
if (toAdd.length) {
  const nl = lp.includes('\r\n') ? '\r\n' : '\n';
  const block = toAdd.map(([vi, en, zh]) => `    "${vi}": ["${en}", "${zh}"],`).join(nl);
  const start = lp.indexOf('const phrases = {');
  let close = lp.indexOf('\n};', start);
  if (close === -1) close = lp.indexOf('\n};\n', start);
  const at = close + 1;
  lp = lp.substring(0, at) + block + nl + lp.substring(at);
  fs.writeFileSync(lpFile, lp, 'utf8');
  console.log('Added ' + toAdd.length + ' new phrases (' + (candidates.length - toAdd.length) + ' already existed)');
} else {
  console.log('All ' + candidates.length + ' phrases already present');
}
