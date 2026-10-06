const fs = require('fs');
const path = require('path');

// ============================================================
// STEP 1: Add new phrases to LanguageProvider.jsx
// ============================================================
const lpFile = 'D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx';
let lp = fs.readFileSync(lpFile, 'utf8');

const newPhrases = [
  ["Tất cả loại báo cáo", "All report types", "所有报告类型"],
  ["Tất cả tháng", "All months", "所有月份"],
  ["Tất cả phòng ban", "All departments", "所有部门"],
  ["Tất cả trạng thái", "All statuses", "所有状态"],
  ["Mọi hạn nộp", "All deadlines", "所有截止日期"],
  ["Quá hạn", "Overdue", "已逾期"],
  ["Chưa quá hạn", "Not overdue", "未逾期"],
  ["Tổng báo cáo", "Total reports", "报告总数"],
  ["Chờ tôi duyệt", "Pending my review", "待我审批"],
  ["Chờ gửi cấp trên", "Pending upper approval", "待上级审批"],
  ["Cấp trên yêu cầu", "Upper request", "上级要求"],
  ["Hoàn tất", "Completed", "已完成"],
  ["Cần xử lý", "Needs action", "需处理"],
  ["Tất cả báo cáo", "All reports", "所有报告"],
  ["Hoạt động gần đây", "Recent activity", "近期活动"],
  ["1. Tổng quan", "1. Overview", "1. 概述"],
  ["2. Kết quả thực hiện", "2. Results", "2. 执行结果"],
  ["3. Khó khăn / vấn đề", "3. Difficulties / Issues", "3. 困难/问题"],
  ["4. Kiến nghị / đề xuất", "4. Recommendations / Proposals", "4. 建议/提案"],
  ["Tổng quan", "Overview", "概述"],
  ["Kết quả thực hiện", "Results", "执行结果"],
  ["Khó khăn / vấn đề", "Difficulties / Issues", "困难/问题"],
  ["Kiến nghị / đề xuất", "Recommendations / Proposals", "建议/提案"],
  ["Chưa có nội dung.", "No content yet.", "暂无内容。"],
  ["File đính kèm", "Attached files", "附件"],
  ["Phiên bản", "Version", "版本"],
  ["Không có file đính kèm.", "No attached files.", "无附件。"],
  ["Luồng xử lý", "Processing flow", "处理流程"],
  ["Lịch sử", "History", "历史"],
  ["Chưa có lịch sử xử lý.", "No processing history.", "无处理历史。"],
  ["Yêu cầu từ cấp trên", "Upper management request", "上级要求"],
  ["Nhận xét", "Review", "评审"],
  ["Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối.", "Approve and forward the report to upper management, request revisions, or reject.", "审批并转呈上级，要求修改或拒绝。"],
  ["Từ chối", "Reject", "拒绝"],
  ["Yêu cầu sửa", "Request revision", "要求修改"],
  ["Duyệt & gửi cấp trên", "Approve & forward", "审批并转呈"],
  ["Gửi cấp trên", "Forward to upper", "转呈上级"],
  ["Phản hồi cấp trên", "Respond to upper", "回复上级"],
  ["Yêu cầu bổ sung", "Request additional info", "要求补充"],
  ["Cấp trên đã duyệt", "Upper approved", "上级已批准"],
  ["Phản hồi", "Respond", "回复"],
  ["Chuyển cấp dưới xử lý", "Transfer to subordinate", "转交下属处理"],
  ["Đánh dấu hoàn tất", "Mark as complete", "标记完成"],
  ["Xem", "View", "查看"],
  ["Tải xuống", "Download", "下载"],
  ["Chi tiết báo cáo", "Report details", "报告详情"],
  ["Người gửi", "Sender", "发送人"],
  ["Bộ phận", "Department", "部门"],
  ["Phòng ban", "Department", "部门"],
  ["Ngày gửi", "Sent date", "发送日期"],
  ["Deadline", "Deadline", "截止日期"],
  ["Mã NV:", "Employee code:", "工号:"],
  ["Bộ phận:", "Department:", "部门:"],
  ["Chọn cấp trên nhận báo cáo", "Select upper manager to receive report", "选择接收报告的上级"],
  ["Không tìm thấy cấp trên trong hồ sơ nhân sự", "No upper manager found in personnel records", "人事档案中未找到上级"],
  ["Chưa có bộ phận", "No department", "未分配部门"],
  ["Nội dung báo cáo", "Report content", "报告内容"],
  ["Hạn xử lý", "Processing deadline", "处理截止日期"],
  ["Ghi chú (không bắt buộc)", "Note (optional)", "备注（可选）"],
  ["Hủy", "Cancel", "取消"],
  ["Xác nhận", "Confirm", "确认"],
  ["Đang lưu…", "Saving…", "保存中…"],
  ["📥 1. Báo cáo cấp dưới gửi đến tôi", "📥 1. Reports from subordinates", "📥 1. 下属提交的报告"],
  ["📤 2. Báo cáo gửi cấp trên", "📤 2. Reports forwarded to upper", "📤 2. 转呈上级的报告"],
  ["📌 3. Yêu cầu / phản hồi từ cấp trên", "📌 3. Requests / responses from upper", "📌 3. 上级要求/回复"],
  ["📋 4. Tất cả báo cáo", "📋 4. All reports", "📋 4. 所有报告"],
  ["🕐 Hoạt động gần đây", "🕐 Recent activity", "🕐 近期活动"],
  ["Chưa có hoạt động.", "No recent activity.", "无近期活动。"],
  ["Không có báo cáo phù hợp.", "No matching reports.", "无匹配报告。"],
  ["Đang tải báo cáo file…", "Loading file reports…", "加载文件报告…"],
  ["Quản lý mở báo cáo", "Manager opened report", "经理打开报告"],
  ["Mã BC", "Report code", "报告编号"],
  ["Tên báo cáo", "Report name", "报告名称"],
  ["Người nhận", "Recipient", "接收人"],
  ["Nội dung yêu cầu", "Request details", "要求内容"],
  ["Cấp hiện tại", "Current level", "当前层级"],
  ["Trạng thái", "Status", "状态"],
  ["Thao tác", "Actions", "操作"],
  ["Duyệt & gửi", "Approve & forward", "审批并转呈"],
  ["Cấp trên duyệt", "Upper approves", "上级批准"],
  ["Ghi nhận yêu cầu", "Acknowledge request", "确认要求"],
  ["Chuyển cấp dưới", "Transfer down", "转交下级"],
  ["Quản lý", "Manager", "经理"],
  ["Cấp trên", "Upper management", "上级"],
  ["Quản lý từ chối", "Manager rejected", "经理拒绝"],
  ["Quản lý yêu cầu sửa", "Manager requested revision", "经理要求修改"],
  ["Nhân viên gửi báo cáo", "Employee submitted report", "员工提交报告"],
  ["Nhân viên nhập lại báo cáo cũ", "Employee re-entered previous report", "员工重新填写旧报告"],
  ["Hệ thống chuyển báo cáo đến quản lý", "System forwarded report to manager", "系统将报告转呈经理"],
  ["Chờ nhân viên bổ sung", "Awaiting employee follow-up", "等待员工补充"],
  ["Cấp trên đang duyệt", "Upper reviewing", "上级审批中"],
  ["Duyệt & gửi", "Approve & forward", "审批并转呈"],
  ["Hiển thị", "Showing", "显示"],
  ["trong", "of", "共"],
  ["báo cáo", "reports", "份报告"],
  ["🔍 Tìm mã báo cáo / tên báo cáo / người gửi...", "🔍 Search report code / report name / sender...", "🔍 搜索报告编号 / 报告名称 / 发送人..."],
  ["Quản lý báo cáo", "Report management", "报告管理"],
  ["Báo cáo file nhân viên gửi", "Employee file reports", "员工文件报告"],
];

// Build the phrases lines to insert
const phraseLines = newPhrases.map(([vi, en, zh]) =>
  `    "${vi}": ["${en}", "${zh}"],`
).join('\n');

// Insert before the closing of the phrases dict
// The dict ends with a line containing only "};". Find the LAST "};\n" that closes the phrases object
// Looking at the file, the dict starts at line 6 with `const phrases = {`
// and ends around line 923 with `};`
// We need to insert before that closing `};`

// Find the pattern: last occurrence of "\n};\n" in the file (the one that closes phrases)
// Actually the dict might not be the last "};". Let me search for the specific pattern
// The dict has entries like `    "text": ["en", "zh"],`
// So I'll insert before the first "};\n" after the "const phrases = {" line

const phrasesStart = lp.indexOf('const phrases = {');
if (phrasesStart === -1) {
  console.log('ERROR: cannot find "const phrases = {" in LanguageProvider.jsx');
  process.exit(1);
}

// Find the matching closing "};\n" - it's the one at column 0 (no indent) after the dict
// The dict entries are indented with 4 spaces, so the closing is "\n};\n" at column 0
let searchFrom = phrasesStart;
let closeIdx = lp.indexOf('\n};\n', searchFrom);
if (closeIdx === -1) {
  // try without trailing newline
  closeIdx = lp.indexOf('\n};', searchFrom);
}
if (closeIdx === -1) {
  console.log('ERROR: cannot find closing of phrases dict');
  process.exit(1);
}

// Insert new phrases before the closing "};\n"
// The insertion point is at closeIdx + 1 (start of the line with "};")
// We want to insert after the last entry line and before "};\n"
// The last entry ends with ",\n" then "};\n"
// So insert at closeIdx + 1 (the position of "};" line start)
const insertPoint = closeIdx + 1; // position of "};\n"
const useCRLF = lp.includes('\r\n');
const nl = useCRLF ? '\r\n' : '\n';
const phraseLinesCRLF = newPhrases.map(([vi, en, zh]) =>
  `    "${vi}": ["${en}", "${zh}"],`
).join(nl);

lp = lp.substring(0, insertPoint) + phraseLinesCRLF + nl + lp.substring(insertPoint);
fs.writeFileSync(lpFile, lp, 'utf8');
console.log('OK: added ' + newPhrases.length + ' new phrases to LanguageProvider.jsx');

// ============================================================
// STEP 2: Modify ReportsPage.jsx to use i18n
// ============================================================
const rpFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/ReportsPage.jsx';
let rp = fs.readFileSync(rpFile, 'utf8');
const rpCRLF = rp.includes('\r\n');
const rnl = rpCRLF ? '\r\n' : '\n';

// 2a: Add i18n import after existing imports (after line 5: import "../reports.css";)
rp = rp.replace(
  'import "../reports.css";',
  'import "../reports.css";\nimport { translate, useLanguage } from "../../../../services/i18n/LanguageProvider";'
);

// 2b: In the STATUS object, wrap label strings with L()
// The STATUS is defined before the component, so L() won't be available.
// Need to convert STATUS labels to be translatable at render time.
// Strategy: Keep STATUS with Vietnamese keys, and add a translateStatus function that uses L()

// 2c: Add L helper inside the main component
// Find "export default function ReportsPage() {"
rp = rp.replace(
  'export default function ReportsPage() {',
  'export default function ReportsPage() { ' + rnl +
  '    const { language } = useLanguage();' + rnl +
  '    const L = (text) => translate(text, language);'
);

// 2d: Replace specific hardcoded strings with L()
// Process in order (longer strings first to avoid partial matches)

// Dropdown option labels
rp = rp.replace('"Tất cả loại báo cáo"', 'L("Tất cả loại báo cáo")');
rp = rp.replace('"Tất cả tháng"', 'L("Tất cả tháng")');
rp = rp.replace('"Tất cả phòng ban"', 'L("Tất cả phòng ban")');
rp = rp.replace('"Tất cả trạng thái"', 'L("Tất cả trạng thái")');
rp = rp.replace('"Mọi hạn nộp"', 'L("Mọi hạn nộp")');
rp = rp.replace('"Quá hạn"', 'L("Quá hạn")');
rp = rp.replace('"Chưa quá hạn"', 'L("Chưa quá hạn")');

// KPI labels
rp = rp.replace('label="Tổng báo cáo"', 'label={L("Tổng báo cáo")}');
rp = rp.replace('label="Chờ tôi duyệt"', 'label={L("Chờ tôi duyệt")}');
rp = rp.replace('label="Chờ gửi cấp trên"', 'label={L("Chờ gửi cấp trên")}');
rp = rp.replace('label="Cấp trên yêu cầu"', 'label={L("Cấp trên yêu cầu")}');
rp = rp.replace('label="Hoàn tất"', 'label={L("Hoàn tất")}');
rp = rp.replace('label="Cần xử lý"', 'label={L("Cần xử lý")}');
rp = rp.replace('label="Quá hạn"', 'label={L("Quá hạn")}');

// ReportSection titles
rp = rp.replace('title="📥 1. Báo cáo cấp dưới gửi đến tôi"', 'title={L("📥 1. Báo cáo cấp dưới gửi đến tôi")}');
rp = rp.replace('title="📤 2. Báo cáo gửi cấp trên"', 'title={L("📤 2. Báo cáo gửi cấp trên")}');
rp = rp.replace('title="📌 3. Yêu cầu / phản hồi từ cấp trên"', 'title={L("📌 3. Yêu cầu / phản hồi từ cấp trên")}');
rp = rp.replace('title="📋 4. Tất cả báo cáo"', 'title={L("📋 4. Tất cả báo cáo")}');
rp = rp.replace('title="🕐 Hoạt động gần đây"', 'title={L("🕐 Hoạt động gần đây")}');

// Modal section headers
rp = rp.replace('<h2 id="report-detail-title">Chi tiết báo cáo</h2>', '<h2 id="report-detail-title">{L("Chi tiết báo cáo")}</h2>');
rp = rp.replace('<h4>Nội dung báo cáo</h4>', '<h4>{L("Nội dung báo cáo")}</h4>');
rp = rp.replace('<h4>File đính kèm</h4>', '<h4>{L("File đính kèm")}</h4>');
rp = rp.replace('<h4>Luồng xử lý</h4>', '<h4>{L("Luồng xử lý")}</h4>');
rp = rp.replace('<h4>Lịch sử</h4>', '<h4>{L("Lịch sử")}</h4>');
rp = rp.replace('<h4>Nhận xét</h4>', '<h4>{L("Nhận xét")}</h4>');
rp = rp.replace('<h4>Phản hồi cấp trên</h4>', '<h4>{L("Phản hồi cấp trên")}</h4>');

// Content block labels in modal
rp = rp.replace('["1. Tổng quan"', '{L("1. Tổng quan")}');
rp = rp.replace('["2. Kết quả thực hiện"', '{L("2. Kết quả thực hiện")}');
rp = rp.replace('["3. Khó khăn / vấn đề"', '{L("3. Khó khăn / vấn đề")}');
rp = rp.replace('["4. Kiến nghị / đề xuất"', '{L("4. Kiến nghị / đề xuất")}');

// "Chưa có nội dung."
rp = rp.replace('"Chưa có nội dung."', 'L("Chưa có nội dung.")');

// STATUS object: need to make it use L()
// The STATUS is defined outside the component, so we can't use L() directly.
// Instead, replace the STATUS lookup in JSX:
// {STATUS[r.status]?.[0] || "—"}  → keep as is (STATUS[status][0] is the Vietnamese label)
// But wrap the display: {L(STATUS[r.status]?.[0] || "—")}
// Actually the simplest: keep STATUS as-is (Vietnamese keys), and wrap the display with L()

// In ReportTable:
rp = rp.replace('{STATUS[r.status]?.[0] || "—"}', '{L(STATUS[r.status]?.[0] || "—")}');
// In ReportModal:
rp = rp.replace('{STATUS[report.status]?.[0]}', '{L(STATUS[report.status]?.[0])}');

// "Không có file đính kèm."
rp = rp.replace('"Không có file đính kèm."', 'L("Không có file đính kèm.")');
// "Chưa có lịch sử xử lý."
rp = rp.replace('"Chưa có lịch sử xử lý."', 'L("Chưa có lịch sử xử lý.")');
// "Chưa có hoạt động."
rp = rp.replace('"Chưa có hoạt động."', 'L("Chưa có hoạt động.")');
// "Không có báo cáo phù hợp."
rp = rp.replace('"Không có báo cáo phù hợp."', 'L("Không có báo cáo phù hợp.")');
// "Đang tải báo cáo file…"
rp = rp.replace('"Đang tải báo cáo file…"', 'L("Đang tải báo cáo file…")');

// Modal description
rp = rp.replace('"Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối."', '{L("Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối.")}');
// Wait, it's in JSX as plain text not a string literal
// Let me check: <p>Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối.</p>
rp = rp.replace('<p>Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối.</p>',
  '<p>{L("Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối.")}</p>');

// Buttons: "Tải xuống", "Xem"
rp = rp.replace('>Xem</button>', '>{L("Xem")}</button>');
rp = rp.replace('>Tải xuống</button>', '>{L("Tải xuống")}</button>');

// "Nhân viên gửi" / "Quản lý duyệt" / "Cấp trên" / "Hoàn tất" in steps
rp = rp.replace('const steps = ["Nhân viên gửi", "Quản lý duyệt", "Cấp trên", "Hoàn tất"];',
  'const steps = [L("Nhân viên gửi"), L("Quản lý duyệt"), L("Cấp trên"), L("Hoàn tất")];');

// "Quản lý mở báo cáo" in open()
rp = rp.replace('actionName: "Quản lý mở báo cáo"', 'actionName: L("Quản lý mở báo cáo")');

// Report code section header
rp = rp.replace('span className="hr-file-report-code"', 'span className="hr-file-report-code"');
// Actually no need to change that

// "Yêu cầu từ cấp trên · hạn"
rp = rp.replace('Yêu cầu từ cấp trên · hạn ', '{L("Yêu cầu từ cấp trên")} · {L("Hạn xử lý")} ');
// Actually the original is: <strong>Yêu cầu từ cấp trên · hạn {date(report.upperRequestDeadline)}</strong>
// Let me handle this differently
rp = rp.replace('<strong>Yêu cầu từ cấp trên · hạn {date(report.upperRequestDeadline)}</strong>',
  '<strong>{L("Yêu cầu từ cấp trên")} · {L("Hạn xử lý")} {date(report.upperRequestDeadline)}</strong>');

// "Chưa có nội dung." in ActionDialog
rp = rp.replace('"Chưa có nội dung."', 'L("Chưa có nội dung.")');

// ActionDialog config titles
rp = rp.replace('forward: ["Duyệt và gửi cấp trên"', 'forward: [L("Duyệt và gửi cấp trên")');
rp = rp.replace('"Người nhận tiếp theo"', 'L("Người nhận tiếp theo")');
rp = rp.replace('"Ghi chú gửi cấp trên"', 'L("Ghi chú gửi cấp trên")');
rp = rp.replace('revision: ["Yêu cầu nhân viên chỉnh sửa"', 'revision: [L("Yêu cầu nhân viên chỉnh sửa")');
rp = rp.replace('"Nhận xét / nội dung cần bổ sung"', 'L("Nhận xét / nội dung cần bổ sung")');
rp = rp.replace('reject: ["Từ chối báo cáo"', 'reject: [L("Từ chối báo cáo")');
rp = rp.replace('"Lý do từ chối"', 'L("Lý do từ chối")');
rp = rp.replace('"upper-request": ["Yêu cầu từ cấp trên"', '"upper-request": [L("Yêu cầu từ cấp trên")');
rp = rp.replace('"Nội dung yêu cầu bổ sung"', 'L("Nội dung yêu cầu bổ sung")');
rp = rp.replace('"upper-approved": ["Cấp trên đã duyệt"', '"upper-approved": [L("Cấp trên đã duyệt")');
rp = rp.replace('"Ghi chú"', 'L("Ghi chú")');
rp = rp.replace('reply: ["Phản hồi cấp trên"', 'reply: [L("Phản hồi cấp trên")');
rp = rp.replace('"Nội dung phản hồi"', 'L("Nội dung phản hồi")');
rp = rp.replace('transfer: ["Chuyển yêu cầu cho cấp dưới"', 'transfer: [L("Chuyển yêu cầu cho cấp dưới")');
rp = rp.replace('"Nội dung cần nhân viên xử lý"', 'L("Nội dung cần nhân viên xử lý")');

// "Hủy" and "Xác nhận" buttons in dialog footer
rp = rp.replace('>Hủy</button>', '>{L("Hủy")}</button>');
rp = rp.replace('{busy ? "Đang lưu…" : "Xác nhận"}', '{busy ? L("Đang lưu…") : L("Xác nhận")}');

// "Ghi chú (không bắt buộc)"
rp = rp.replace('"Ghi chú (không bắt buộc)"', 'L("Ghi chú (không bắt buộc)")');

// "Hạn xử lý" label
rp = rp.replace('<label>Hạn xử lý<input', '<label>{L("Hạn xử lý")}<input');

// "Người nhận tiếp theo"
rp = rp.replace('<label>Người nhận tiếp theo<select', '<label>{L("Người nhận tiếp theo")}<select');

// "Mã NV:" / "Bộ phận:" in recipient card
rp = rp.replace('Mã NV: ', '{L("Mã NV:")} ');
rp = rp.replace('Bộ phận: ', '{L("Bộ phận:")} ');

// "Chưa có bộ phận"
rp = rp.replace('"Chưa có bộ phận"', 'L("Chưa có bộ phận")');

// "Chọn cấp trên nhận báo cáo"
rp = rp.replace('"Chọn cấp trên nhận báo cáo"', 'L("Chọn cấp trên nhận báo cáo")');
// "Không tìm thấy cấp trên trong hồ sơ nhân sự"
rp = rp.replace('"Không tìm thấy cấp trên trong hồ sơ nhân sự"', 'L("Không tìm thấy cấp trên trong hồ sơ nhân sự")');

// Pagination
rp = rp.replace('Hiển thị {reports.length ? (page - 1) * 20 + 1 : 0}–{Math.min(page * 20, reports.length)} trong {reports.length} báo cáo',
  '{L("Hiển thị")} {reports.length ? (page - 1) * 20 + 1 : 0}–{Math.min(page * 20, reports.length)} {L("trong")} {reports.length} {L("báo cáo")}');

// "Không tải được báo cáo file."
rp = rp.replace('"Không tải được báo cáo file."', 'L("Không tải được báo cáo file.")');

// "Không cập nhật được luồng xử lý."
rp = rp.replace('"Không cập nhật được luồng xử lý."', 'L("Không cập nhật được luồng xử lý.")');

// "Không thể hoàn tất báo cáo."
rp = rp.replace('"Không thể hoàn tất báo cáo."', 'L("Không thể hoàn tất báo cáo.")');

// "Không tải được file."
rp = rp.replace('"Không tải được file."', 'L("Không tải được file.")');

// HrAppLayout title and subtitle
rp = rp.replace('title="Quản lý báo cáo"', 'title={L("Quản lý báo cáo")}');
// The subtitle uses template literal, need to handle it
// subtitle={`Báo cáo file nhân viên gửi · ${monthLabel}`}
// monthLabel is computed: new Date(...).toLocaleDateString("vi-VN", ...) or "Tất cả tháng"
rp = rp.replace('subtitle={`Báo cáo file nhân viên gửi · ${monthLabel}`}',
  'subtitle={`${L("Báo cáo file nhân viên gửi")} · ${L(monthLabel)}`}'.replace('$', '$'));
// Hmm, this is getting complex. Let me use a different approach for the subtitle

// Actually the subtitle line is:
// <HrAppLayout title="Quản lý báo cáo" subtitle={`Báo cáo file nhân viên gửi · ${monthLabel}`}>
// I need to change to:
// <HrAppLayout title={L("Quản lý báo cáo")} subtitle={`${L("Báo cáo file nhân viên gửi")} · ${L(monthLabel)}`}>

// Already did title above. Now the subtitle:
rp = rp.replace('subtitle={`Báo cáo file nhân viên gửi · ${monthLabel}`}',
  'subtitle={`${L("Báo cáo file nhân viên gửi")} · ${L(monthLabel)}`}');

// "tháng" in monthLabel
rp = rp.replace(': "Tất cả tháng"', ': L("Tất cả tháng")');

// monthLabel computation: 
// const monthLabel = filters.period ? new Date(`${filters.period}-01`).toLocaleDateString("vi-VN", { month: "long", year: "numeric" }) : "Tất cả tháng";
// Change to use localeForLanguage
// But we need to import localeForLanguage too
rp = rp.replace('import { translate, useLanguage } from',
  'import { localeForLanguage, translate, useLanguage } from');
// And use localeForLanguage in monthLabel
rp = rp.replace(
  'const monthLabel = filters.period ? new Date(`${filters.period}-01`).toLocaleDateString("vi-VN", { month: "long", year: "numeric" }) : "Tất cả tháng";',
  'const monthLabel = filters.period ? new Date(`${filters.period}-01`).toLocaleDateString(localeForLanguage(language), { month: "long", year: "numeric" }) : L("Tất cả tháng");'
);
// And the option labels in the month filter:
// {new Date(`${month}-01`).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}
rp = rp.replace(
  '{new Date(`${month}-01`).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}',
  '{new Date(`${month}-01`).toLocaleDateString(localeForLanguage(language), { month: "2-digit", year: "numeric" })}'
);

// "Nhân viên gửi" and other step labels need L() but they're inside the component scope already.
// The steps array is in ReportModal which is a separate function. Need to pass L or language.
// Simplest: pass L as prop to ReportModal, or define L inside ReportModal too.
// Since ReportModal is a standalone function, I need to either:
// a) Pass L as a prop
// b) Define L inside ReportModal
// Let me add L inside each sub-component

// Actually, let me take a simpler approach: define a module-level helper that doesn't need useLanguage
// The translate() function already takes language as parameter.
// I can create a module-level L that gets the language from the context...
// No, that's not how React works.

// Simplest: add useLanguage + L to each sub-component that needs it

// ReportModal needs L for:
// - steps array
// - "Chi tiết báo cáo", "Nội dung báo cáo", "File đính kèm", "Luồng xử lý", "Lịch sử"
// - "Tải xuống", "Xem"
// - "Yêu cầu từ cấp trên", "Hạn xử lý"
// - "Nhận xét", description text, buttons
// - "Chưa có nội dung.", "Không có file đính kèm.", etc.

// Let me add L to ReportModal
rp = rp.replace(
  'function ReportModal({ report, close, openDialog, complete, download, isUpperRecipient }) {',
  'function ReportModal({ report, close, openDialog, complete, download, isUpperRecipient }) {' + rnl +
  '    const { language } = useLanguage();' + rnl +
  '    const L = (text) => translate(text, language);'
);

// Add L to ActionDialog
rp = rp.replace(
  'function ActionDialog({ type, report, comment, setComment, recipient, setRecipient, employees, currentEmployeeId, deadline, setDeadline, close, submit, busy, error }) {',
  'function ActionDialog({ type, report, comment, setComment, recipient, setRecipient, employees, currentEmployeeId, deadline, setDeadline, close, submit, busy, error }) {' + rnl +
  '    const { language } = useLanguage();' + rnl +
  '    const L = (text) => translate(text, language);'
);

// Add L to ReportTable
rp = rp.replace(
  'function ReportTable({ reports, columns, open, onAction, complete, isUpperRecipient = () => false }) {',
  'function ReportTable({ reports, columns, open, onAction, complete, isUpperRecipient = () => false }) {' + rnl +
  '    const { language } = useLanguage();' + rnl +
  '    const L = (text) => translate(text, language);'
);

// Now wrap table column headers and row actions with L()
// Column headers
rp = rp.replace('<th>Mã BC</th>', '<th>{L("Mã BC")}</th>');
rp = rp.replace('<th>Tên báo cáo</th>', '<th>{L("Tên báo cáo")}</th>');
rp = rp.replace('columns === "outbound" ? "Bộ phận" : "Phòng ban"', 'columns === "outbound" ? L("Bộ phận") : L("Phòng ban")');
rp = rp.replace('<th>Người gửi</th>', '<th>{L("Người gửi")}</th>');
rp = rp.replace('<th>Người nhận</th>', '<th>{L("Người nhận")}</th>');
rp = rp.replace('<th>Ngày gửi</th>', '<th>{L("Ngày gửi")}</th>');
rp = rp.replace('<th>Nội dung yêu cầu</th>', '<th>{L("Nội dung yêu cầu")}</th>');
rp = rp.replace('<th>Hạn xử lý</th>', '<th>{L("Hạn xử lý")}</th>');
rp = rp.replace('<th>Cấp hiện tại</th>', '<th>{L("Cấp hiện tại")}</th>');
rp = rp.replace('<th>Deadline</th>', '<th>{L("Deadline")}</th>');
rp = rp.replace('<th>Trạng thái</th>', '<th>{L("Trạng thái")}</th>');
rp = rp.replace('<th>Thao tác</th>', '<th>{L("Thao tác")}</th>');

// Row actions
rp = rp.replace('>Xem</button>', '>{L("Xem")}</button>');
rp = rp.replace('>Duyệt & gửi</button>', '>{L("Duyệt & gửi")}</button>');
rp = rp.replace('>Yêu cầu sửa</button>', '>{L("Yêu cầu sửa")}</button>');
rp = rp.replace('>Từ chối</button>', '>{L("Từ chối")}</button>');
rp = rp.replace('>Gửi cấp trên</button>', '>{L("Gửi cấp trên")}</button>');
rp = rp.replace('>Cấp trên duyệt</button>', '>{L("Cấp trên duyệt")}</button>');
rp = rp.replace('>Ghi nhận yêu cầu</button>', '>{L("Ghi nhận yêu cầu")}</button>');
rp = rp.replace('>Phản hồi</button>', '>{L("Phản hồi")}</button>');
rp = rp.replace('>Chuyển cấp dưới</button>', '>{L("Chuyển cấp dưới")}</button>');
rp = rp.replace('>Hoàn tất</button>', '>{L("Hoàn tất")}</button>');
rp = rp.replace('>Tải xuống</button>', '>{L("Tải xuống")}</button>');

// "Cấp trên" and "Quản lý" in status display
rp = rp.replace('{r.status >= S.sent ? "Cấp trên" : "Quản lý"}',
  '{r.status >= S.sent ? L("Cấp trên") : L("Quản lý")}');

// "Phiên bản" 
rp = rp.replace(`\`Phiên bản \${file.version} · \``,
  `\`${L("Phiên bản")} \${file.version} · \``);

// "Đã duyệt và gửi báo cáo lên cấp trên." etc. in success messages
rp = rp.replace('"Đã duyệt và gửi báo cáo lên cấp trên."', 'L("Đã duyệt và gửi báo cáo lên cấp trên.")');
rp = rp.replace('"Đã gửi yêu cầu chỉnh sửa cho nhân viên."', 'L("Đã gửi yêu cầu chỉnh sửa cho nhân viên.")');
rp = rp.replace('"Đã từ chối báo cáo."', 'L("Đã từ chối báo cáo.")');

// Additional phrases that may be needed
const morePhrases = [
  ["Đã duyệt và gửi báo cáo lên cấp trên.", "Report approved and forwarded to upper management.", "报告已审批并转呈上级。"],
  ["Đã gửi yêu cầu chỉnh sửa cho nhân viên.", "Revision request sent to employee.", "已发送修改要求给员工。"],
  ["Đã từ chối báo cáo.", "Report rejected.", "报告已拒绝。"],
  ["Không tải được báo cáo file.", "Failed to load file reports.", "加载文件报告失败。"],
  ["Không cập nhật được luồng xử lý.", "Failed to update processing flow.", "更新处理流程失败。"],
  ["Không thể hoàn tất báo cáo.", "Cannot complete the report.", "无法完成报告。"],
  ["Không tải được file.", "Failed to download file.", "下载文件失败。"],
  ["Báo cáo file nhân viên gửi", "Employee file reports", "员工文件报告"],
  ["Nhân viên gửi", "Employee submitted", "员工提交"],
  ["Quản lý duyệt", "Manager approved", "经理审批"],
  ["Người nhận tiếp theo", "Next recipient", "下一接收人"],
  ["Ghi chú gửi cấp trên", "Note for upper management", "给上级的备注"],
  ["Yêu cầu nhân viên chỉnh sửa", "Request employee revision", "要求员工修改"],
  ["Nhận xét / nội dung cần bổ sung", "Review / content to supplement", "评审/需补充内容"],
  ["Từ chối báo cáo", "Reject report", "拒绝报告"],
  ["Lý do từ chối", "Rejection reason", "拒绝原因"],
  ["Nội dung yêu cầu bổ sung", "Additional request content", "补充要求内容"],
  ["Ghi chú", "Note", "备注"],
  ["Nội dung phản hồi", "Response content", "回复内容"],
  ["Chuyển yêu cầu cho cấp dưới", "Transfer request to subordinate", "转交下属处理"],
  ["Nội dung cần nhân viên xử lý", "Content for employee to handle", "员工需处理内容"],
];

// Add these to LanguageProvider too
const morePhraseLines = morePhrases.map(([vi, en, zh]) =>
  `    "${vi}": ["${en}", "${zh}"],`
).join('\n');

// Re-read LanguageProvider to insert more phrases
lp = fs.readFileSync(lpFile, 'utf8');
const phrasesStart2 = lp.indexOf('const phrases = {');
let closeIdx2 = lp.indexOf('\n};\n', phrasesStart2);
if (closeIdx2 === -1) closeIdx2 = lp.indexOf('\n};', phrasesStart2);
const insertPoint2 = closeIdx2 + 1;
const useCRLF2 = lp.includes('\r\n');
const nl2 = useCRLF2 ? '\r\n' : '\n';
lp = lp.substring(0, insertPoint2) + morePhraseLines + nl2 + lp.substring(insertPoint2);
fs.writeFileSync(lpFile, lp, 'utf8');
console.log('OK: added ' + morePhrases.length + ' more phrases to LanguageProvider.jsx');

// Write modified ReportsPage
fs.writeFileSync(rpFile, rp, 'utf8');
console.log('OK: modified ReportsPage.jsx with i18n');
console.log('Total replacements done in ReportsPage.jsx');
