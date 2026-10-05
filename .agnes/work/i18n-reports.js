const fs = require('fs');

// ============================================================
// PART 1: Add missing report phrases to the i18n dict (idempotent)
// ============================================================
const lpFile = 'D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx';
let lp = fs.readFileSync(lpFile, 'utf8');
const lpCRLF = lp.includes('\r\n');
const lpNL = lpCRLF ? '\r\n' : '\n';

const addPhrases = [
  ["1. Tổng quan", "1. Overview", "1. 概述"],
  ["2. Kết quả thực hiện", "2. Results", "2. 执行结果"],
  ["3. Khó khăn / vấn đề", "3. Difficulties / Issues", "3. 困难/问题"],
  ["4. Kiến nghị / đề xuất", "4. Recommendations / Proposals", "4. 建议/提案"],
  ["Tải xuống", "Download", "下载"],
  ["Nhân viên gửi báo cáo", "Employee submitted report", "员工提交报告"],
  ["Nhân viên nhập lại báo cáo cũ", "Employee re-entered previous report", "员工重新填写旧报告"],
  ["Hệ thống chuyển báo cáo đến quản lý", "System forwarded report to manager", "系统将报告转呈经理"],
  ["Quản lý từ chối", "Manager rejected", "经理拒绝"],
  ["Quản lý yêu cầu sửa", "Manager requested revision", "经理要求修改"],
  ["Người nhận tiếp theo", "Next recipient", "下一接收人"],
  ["Ghi chú gửi cấp trên", "Note for upper management", "给上级的备注"],
  ["Yêu cầu nhân viên chỉnh sửa", "Request employee revision", "要求员工修改"],
  ["Nhận xét / nội dung cần bổ sung", "Review / content to supplement", "评审/需补充内容"],
  ["Từ chối báo cáo", "Reject report", "拒绝报告"],
  ["Lý do từ chối", "Rejection reason", "拒绝原因"],
  ["Nội dung yêu cầu bổ sung", "Additional request content", "补充要求内容"],
  ["Nội dung phản hồi", "Response content", "回复内容"],
  ["Chuyển yêu cầu cho cấp dưới", "Transfer request to subordinate", "转交下属处理"],
  ["Nội dung cần nhân viên xử lý", "Content for employee to handle", "员工需处理内容"],
  ["Chọn cấp trên nhận báo cáo", "Select upper manager to receive report", "选择接收报告的上级"],
  ["Không tìm thấy cấp trên trong hồ sơ nhân sự", "No upper manager found in personnel records", "人事档案中未找到上级"],
  ["Mã NV:", "Employee code:", "工号:"],
  ["Bộ phận:", "Department:", "部门:"],
  ["Chưa có bộ phận", "No department", "未分配部门"],
  ["Hạn xử lý", "Processing deadline", "处理截止日期"],
  ["Ghi chú (không bắt buộc)", "Note (optional)", "备注（可选）"],
  ["Hủy", "Cancel", "取消"],
  ["Xác nhận", "Confirm", "确认"],
  ["Đang lưu…", "Saving…", "保存中…"],
  ["Duyệt & gửi cấp trên", "Approve & forward", "审批并转呈"],
  ["Yêu cầu bổ sung", "Request additional info", "要求补充"],
  ["Cấp trên đã duyệt", "Upper approved", "上级已批准"],
  ["Đánh dấu hoàn tất", "Mark as complete", "标记完成"],
  ["Phản hồi cấp trên", "Respond to upper", "回复上级"],
  ["Chuyển cấp dưới xử lý", "Transfer to subordinate", "转交下属处理"],
  ["Ghi nhận yêu cầu", "Acknowledge request", "确认要求"],
  ["Nhân viên gửi", "Employee submitted", "员工提交"],
  ["Quản lý duyệt", "Manager approved", "经理审批"],
  ["Không có nội dung.", "No content yet.", "暂无内容。"],
  ["Không có file đính kèm.", "No attached files.", "无附件。"],
  ["Không có báo cáo phù hợp.", "No matching reports.", "无匹配报告。"],
  ["Chưa có lịch sử xử lý.", "No processing history.", "无处理历史。"],
  ["Chưa có hoạt động.", "No recent activity.", "无近期活动。"],
  ["Đang tải báo cáo file…", "Loading file reports…", "加载文件报告…"],
  ["Hiển thị", "Showing", "显示"],
  ["trong", "of", "共"],
  ["báo cáo", "reports", "份报告"],
  ["Quản lý báo cáo", "Report management", "报告管理"],
  ["Báo cáo file nhân viên gửi", "Employee file reports", "员工文件报告"],
  ["Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối.", "Approve and forward the report to upper management, request revisions, or reject.", "审批并转呈上级，要求修改或拒绝。"],
  ["Không tải được báo cáo file.", "Failed to load file reports.", "加载文件报告失败。"],
  ["Không cập nhật được luồng xử lý.", "Failed to update processing flow.", "更新处理流程失败。"],
  ["Không thể hoàn tất báo cáo.", "Cannot complete the report.", "无法完成报告。"],
  ["Không tải được file.", "Failed to download file.", "下载文件失败。"],
  ["Đã duyệt và gửi báo cáo lên cấp trên.", "Report approved and forwarded.", "报告已审批并转呈。"],
  ["Đã gửi yêu cầu chỉnh sửa cho nhân viên.", "Revision request sent to employee.", "已发送修改要求给员工。"],
  ["Đã từ chối báo cáo.", "Report rejected.", "报告已拒绝。"],
  ["🔍 Tìm mã báo cáo / tên báo cáo / người gửi...", "🔍 Search report code / name / sender...", "🔍 搜索报告编号/名称/发送人..."],
  ["Tháng", "Month", "月份"],
  ["Loại báo cáo", "Report type", "报告类型"],
  ["Deadline", "Deadline", "截止日期"],
  ["📥 1. Báo cáo cấp dưới gửi đến tôi", "📥 1. Reports from subordinates", "📥 1. 下属提交的报告"],
  ["📤 2. Báo cáo gửi cấp trên", "📤 2. Reports forwarded to upper", "📤 2. 转呈上级的报告"],
  ["📌 3. Yêu cầu / phản hồi từ cấp trên", "📌 3. Requests / responses from upper", "📌 3. 上级要求/回复"],
  ["📋 4. Tất cả báo cáo", "📋 4. All reports", "📋 4. 所有报告"],
  ["🕐 Hoạt động gần đây", "🕐 Recent activity", "🕐 近期活动"],
  ["Tổng báo cáo", "Total reports", "报告总数"],
  ["Chờ tôi duyệt", "Pending my review", "待我审批"],
  ["Chờ gửi cấp trên", "Pending upper approval", "待上级审批"],
  ["Cấp trên yêu cầu", "Upper request", "上级要求"],
  ["Hoàn tất", "Completed", "已完成"],
  ["Cần xử lý", "Needs action", "需处理"],
  ["Quá hạn", "Overdue", "已逾期"],
  ["Chưa quá hạn", "Not overdue", "未逾期"],
  ["Mọi hạn nộp", "All deadlines", "所有截止日期"],
  ["Phòng ban", "Department", "部门"],
  ["Mã BC", "Report code", "报告编号"],
  ["Tên báo cáo", "Report name", "报告名称"],
  ["Xem", "View", "查看"],
  ["Cấp hiện tại", "Current level", "当前层级"],
  ["Ngày gửi", "Sent date", "发送日期"],
  ["Người nhận", "Recipient", "接收人"],
  ["Nội dung yêu cầu", "Request details", "要求内容"],
  ["Tất cả loại báo cáo", "All report types", "所有报告类型"],
  ["Tất cả tháng", "All months", "所有月份"],
  ["Tất cả phòng ban", "All departments", "所有部门"],
  ["Tất cả trạng thái", "All statuses", "所有状态"],
];

// Determine existing keys
const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });

const toAdd = addPhrases.filter(([vi]) => !existing.has(vi));
if (toAdd.length) {
  const block = toAdd.map(([vi, en, zh]) => `    "${vi}": ["${en}", "${zh}"],`).join(lpNL);
  const start = lp.indexOf('const phrases = {');
  let close = lp.indexOf('\n};', start);
  if (close === -1) close = lp.indexOf('\n};\n', start);
  const insertAt = close + 1; // position of the "};\n" line
  lp = lp.substring(0, insertAt) + block + lpNL + lp.substring(insertAt);
  fs.writeFileSync(lpFile, lp, 'utf8');
  console.log('PART1: added ' + toAdd.length + ' new phrases (' + (addPhrases.length - toAdd.length) + ' already existed)');
} else {
  console.log('PART1: all phrases already present, nothing added');
}

// ============================================================
// PART 2: Wire i18n into both ReportsPage files
// ============================================================
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/ReportsPage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/hr/pages/ReportsPage.jsx',
];

// Per-file import handling
function setupImport(c, rel) {
  // employees: no i18n import yet
  if (c.includes('import { localeForLanguage, useLanguage } from') ) {
    // admin: already imports, add translate
    c = c.replace('import { localeForLanguage, useLanguage } from', 'import { localeForLanguage, translate, useLanguage } from');
  } else {
    c = c.replace(
      'import { getAuth } from "../../../../services/auth/auth";',
      'import { getAuth } from "../../../../services/auth/auth";' + '\n' +
      'import { localeForLanguage, translate, useLanguage } from "../../../../services/i18n/LanguageProvider";'
    );
  }
  return c;
}

// Add L + (locale where needed) into the 4 components.
// ReportsPage: admin already has language+locale; employees needs them added.
function addMainHelpers(c) {
  // employees: insert after "const auth = getAuth();"
  if (!c.includes('const locale = localeForLanguage(language);')) {
    c = c.replace(
      '    const auth = getAuth();',
      '    const auth = getAuth();' + '\n' +
      '    const { language } = useLanguage();' + '\n' +
      '    const locale = localeForLanguage(language);' + '\n' +
      '    const L = (text) => translate(text, language);'
    );
  } else {
    // admin: language+locale exist; add L if missing
    if (!c.includes('const L = (text) => translate(text, language);')) {
      c = c.replace(
        '    const locale = localeForLanguage(language);',
        '    const locale = localeForLanguage(language);' + '\n' +
        '    const L = (text) => translate(text, language);'
      );
    }
  }
  return c;
}

function addSubComponentL(c, sig) {
  // Insert L after the function opening brace (first line of body)
  const marker = sig;
  const idx = c.indexOf(marker);
  if (idx === -1) return c;
  const insert = marker + '\n' +
    '    const { language } = useLanguage();' + '\n' +
    '    const L = (text) => translate(text, language);';
  return c.replace(marker, insert);
}

// All targeted display-string wraps (ordered: longer/more-specific first)
const wraps = [
  // Layout + main
  ['title="Quản lý báo cáo"', 'title={L("Quản lý báo cáo")}'],
  ['`Báo cáo file nhân viên gửi · ${monthLabel}`', '`${L("Báo cáo file nhân viên gửi")} · ${L(monthLabel)}`'],
  ['const monthLabel = filters.period ? new Date(`${filters.period}-01`).toLocaleDateString("vi-VN", { month: "long", year: "numeric" }) : "Tất cả tháng";',
   'const monthLabel = filters.period ? new Date(`${filters.period}-01`).toLocaleDateString(locale, { month: "long", year: "numeric" }) : L("Tất cả tháng");'],
  ['{new Date(`${month}-01`).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}',
   '{new Date(`${month}-01`).toLocaleDateString(locale, { month: "2-digit", year: "numeric" })}'],
  ['placeholder="🔍 Tìm mã báo cáo / tên báo cáo / người gửi..."', 'placeholder={L("🔍 Tìm mã báo cáo / tên báo cáo / người gửi...")}'],
  ['<label>Tháng<select', '<label>{L("Tháng")}<select'],
  ['<label>Phòng ban<select', '<label>{L("Phòng ban")}<select'],
  ['<label>Loại báo cáo<select', '<label>{L("Loại báo cáo")}<select'],
  ['<label>Trạng thái<select', '<label>{L("Trạng thái")}<select'],
  ['<label>Deadline<select', '<label>{L("Deadline")}<select'],
  ['<option value="">Tất cả tháng</option>', '<option value="">{L("Tất cả tháng")}</option>'],
  ['<option value="">Tất cả phòng ban</option>', '<option value="">{L("Tất cả phòng ban")}</option>'],
  ['<option value="">Tất cả loại báo cáo</option>', '<option value="">{L("Tất cả loại báo cáo")}</option>'],
  ['<option value="">Tất cả trạng thái</option>', '<option value="">{L("Tất cả trạng thái")}</option>'],
  ['<option value="">Mọi hạn nộp</option>', '<option value="">{L("Mọi hạn nộp")}</option>'],
  ['<option value="true">Quá hạn</option>', '<option value="true">{L("Quá hạn")}</option>'],
  ['<option value="false">Chưa quá hạn</option>', '<option value="false">{L("Chưa quá hạn")}</option>'],
  // KPI labels
  ['label="Tổng báo cáo"', 'label={L("Tổng báo cáo")}'],
  ['label="Chờ tôi duyệt"', 'label={L("Chờ tôi duyệt")}'],
  ['label="Chờ gửi cấp trên"', 'label={L("Chờ gửi cấp trên")}'],
  ['label="Cấp trên yêu cầu"', 'label={L("Cấp trên yêu cầu")}'],
  ['label="Hoàn tất"', 'label={L("Hoàn tất")}'],
  ['label="Cần xử lý"', 'label={L("Cần xử lý")}'],
  ['label="Quá hạn"', 'label={L("Quá hạn")}'],
  // Section titles
  ['title="📥 1. Báo cáo cấp dưới gửi đến tôi"', 'title={L("📥 1. Báo cáo cấp dưới gửi đến tôi")}'],
  ['title="📤 2. Báo cáo gửi cấp trên"', 'title={L("📤 2. Báo cáo gửi cấp trên")}'],
  ['title="📌 3. Yêu cầu / phản hồi từ cấp trên"', 'title={L("📌 3. Yêu cầu / phản hồi từ cấp trên")}'],
  ['title="📋 4. Tất cả báo cáo"', 'title={L("📋 4. Tất cả báo cáo")}'],
  ['title="🕐 Hoạt động gần đây"', 'title={L("🕐 Hoạt động gần đây")}'],
  ['>Đang tải báo cáo file…</div>', '>{L("Đang tải báo cáo file…")}</div>'],
  ['<li>Chưa có hoạt động.</li>', '<li>{L("Chưa có hoạt động.")}</li>'],
  // Pagination
  ['<span>Hiển thị {reports.length ? (page - 1) * 20 + 1 : 0}–{Math.min(page * 20, reports.length)} trong {reports.length} báo cáo</span>',
   '<span>{L("Hiển thị")} {reports.length ? (page - 1) * 20 + 1 : 0}–{Math.min(page * 20, reports.length)} {L("trong")} {reports.length} {L("báo cáo")}</span>'],
  // Table headers
  ['<th>Mã BC</th>', '<th>{L("Mã BC")}</th>'],
  ['<th>Tên báo cáo</th>', '<th>{L("Tên báo cáo")}</th>'],
  ['<th>{columns === "outbound" ? "Bộ phận" : "Phòng ban"}</th>', '<th>{columns === "outbound" ? L("Bộ phận") : L("Phòng ban")}</th>'],
  ['<th>Người gửi</th>', '<th>{L("Người gửi")}</th>'],
  ['<th>Người nhận</th>', '<th>{L("Người nhận")}</th>'],
  ['<th>Ngày gửi</th>', '<th>{L("Ngày gửi")}</th>'],
  ['<th>Nội dung yêu cầu</th>', '<th>{L("Nội dung yêu cầu")}</th>'],
  ['<th>Hạn xử lý</th>', '<th>{L("Hạn xử lý")}</th>'],
  ['<th>Cấp hiện tại</th>', '<th>{L("Cấp hiện tại")}</th>'],
  ['<th>Deadline</th>', '<th>{L("Deadline")}</th>'],
  ['<th>Trạng thái</th>', '<th>{L("Trạng thái")}</th>'],
  ['<th>Thao tác</th>', '<th>{L("Thao tác")}</th>'],
  // Table current level
  ['{r.status >= S.sent ? "Cấp trên" : "Quản lý"}', '{r.status >= S.sent ? L("Cấp trên") : L("Quản lý")}'],
  // Status display
  ['{STATUS[r.status]?.[0] || "—"}', '{L(STATUS[r.status]?.[0]) || "—"}'],
  // Table empty row
  ['<td colSpan="9" className="hr-file-empty">Không có báo cáo phù hợp.</td>', '<td colSpan="9" className="hr-file-empty">{L("Không có báo cáo phù hợp.")}</td>'],
  // Simple text-based button labels (work for both files)
  ['>Xem</button>', '>{L("Xem")}</button>'],
  ['>Tải xuống</button>', '>{L("Tải xuống")}</button>'],
  ['>Duyệt & gửi</button>', '>{L("Duyệt & gửi")}</button>'],
  ['>Yêu cầu sửa</button>', '>{L("Yêu cầu sửa")}</button>'],
  ['>Từ chối</button>', '>{L("Từ chối")}</button>'],
  ['>Gửi cấp trên</button>', '>{L("Gửi cấp trên")}</button>'],
  ['>Cấp trên duyệt</button>', '>{L("Cấp trên duyệt")}</button>'],
  ['>Ghi nhận yêu cầu</button>', '>{L("Ghi nhận yêu cầu")}</button>'],
  ['>Phản hồi</button>', '>{L("Phản hồi")}</button>'],
  ['>Chuyển cấp dưới</button>', '>{L("Chuyển cấp dưới")}</button>'],
  ['>Hoàn tất</button>', '>{L("Hoàn tất")}</button>'],
  ['>Đánh dấu hoàn tất</button>', '>{L("Đánh dấu hoàn tất")}</button>'],
  ['>Yêu cầu bổ sung</button>', '>{L("Yêu cầu bổ sung")}</button>'],
  ['>Cấp trên đã duyệt</button>', '>{L("Cấp trên đã duyệt")}</button>'],
  ['>Chuyển cấp dưới xử lý</button>', '>{L("Chuyển cấp dưới xử lý")}</button>'],
  ['>Duyệt & gửi cấp trên</button>', '>{L("Duyệt & gửi cấp trên")}</button>'],
  ['>Hủy</button>', '>{L("Hủy")}</button>'],
  ['>Xác nhận</button>', '>{L("Xác nhận")}</button>'],
  // Modal header + detail
  ['<h2 id="report-detail-title">Chi tiết báo cáo</h2>', '<h2 id="report-detail-title">{L("Chi tiết báo cáo")}</h2>'],
  ['<span className={`hr-file-status ${STATUS[report.status]?.[1]}`}>{STATUS[report.status]?.[0]}</span>',
   '<span className={`hr-file-status ${STATUS[report.status]?.[1]}`}>{L(STATUS[report.status]?.[0])}</span>'],
  ['<div className="hr-file-detail-grid"><span>Người gửi<strong>', '<div className="hr-file-detail-grid"><span>{L("Người gửi")}<strong>'],
  ['<span>Bộ phận<strong>', '<span>{L("Bộ phận")}<strong>'],
  ['<span>Ngày gửi<strong>', '<span>{L("Ngày gửi")}<strong>'],
  ['<span>Deadline<strong>', '<span>{L("Deadline")}<strong>'],
  // Modal content blocks
  ['<h4>Nội dung báo cáo</h4>', '<h4>{L("Nội dung báo cáo")}</h4>'],
  ['[["1. Tổng quan", report.overview], ["2. Kết quả thực hiện", report.results], ["3. Khó khăn / vấn đề", report.issues], ["4. Kiến nghị / đề xuất", report.recommendations]]',
   '[[L("1. Tổng quan"), report.overview], [L("2. Kết quả thực hiện"), report.results], [L("3. Khó khăn / vấn đề"), report.issues], [L("4. Kiến nghị / đề xuất"), report.recommendations]]'],
  ['<p>{value || "Chưa có nội dung."}</p>', '<p>{value || L("Chưa có nội dung.")}</p>'],
  ['<h4>File đính kèm</h4>', '<h4>{L("File đính kèm")}</h4>'],
  ['file.version ? `Phiên bản ${file.version} · ` : ""', 'file.version ? `${L("Phiên bản")} ${file.version} · ` : ""'],
  ['<button onClick={() => download(file.attachment ? employeeApi.downloadReportAttachment(file.id) : employeeApi.downloadEmployeeReport(file.id), file.name, true)}>Xem</button>',
   '<button onClick={() => download(file.attachment ? employeeApi.downloadReportAttachment(file.id) : employeeApi.downloadEmployeeReport(file.id), file.name, true)}>{L("Xem")}</button>'],
  ['<button onClick={() => download(file.attachment ? employeeApi.downloadReportAttachment(file.id) : employeeApi.downloadEmployeeReport(file.id), file.name)}>Tải xuống</button>',
   '<button onClick={() => download(file.attachment ? employeeApi.downloadReportAttachment(file.id) : employeeApi.downloadEmployeeReport(file.id), file.name)}>{L("Tải xuống")}</button>'],
  ['<p>Không có file đính kèm.</p>', '<p>{L("Không có file đính kèm.")}</p>'],
  ['<h4>Luồng xử lý</h4>', '<h4>{L("Luồng xử lý")}</h4>'],
  ['const steps = ["Nhân viên gửi", "Quản lý duyệt", "Cấp trên", "Hoàn tất"];',
   'const steps = [L("Nhân viên gửi"), L("Quản lý duyệt"), L("Cấp trên"), L("Hoàn tất")];'],
  ['<h4>Lịch sử</h4>', '<h4>{L("Lịch sử")}</h4>'],
  ['● {event.actorName} · {event.actionName} — {time(event.occurredAt)}', '● {event.actorName} · {L(event.actionName)} — {time(event.occurredAt)}'],
  ['<p>Chưa có lịch sử xử lý.</p>', '<p>{L("Chưa có lịch sử xử lý.")}</p>'],
  ['<strong>Yêu cầu từ cấp trên · hạn {date(report.upperRequestDeadline)}</strong>', '<strong>{L("Yêu cầu từ cấp trên")} · {L("Hạn xử lý")} {date(report.upperRequestDeadline)}</strong>'],
  ['<h4>Nhận xét</h4>', '<h4>{L("Nhận xét")}</h4>'],
  ['<p>Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối.</p>', '<p>{L("Duyệt và chuyển báo cáo lên cấp trên, yêu cầu chỉnh sửa hoặc từ chối.")}</p>'],
  // Activities feed actionName
  ['<span>{item.actorName} · {item.actionName} · {item.reportCode}</span>', '<span>{item.actorName} · {L(item.actionName)} · {item.reportCode}</span>'],
  // Modal section action buttons
  ['<button onClick={() => openDialog("reject", report)}>Từ chối</button>', '<button onClick={() => openDialog("reject", report)}>{L("Từ chối")}</button>'],
  ['<button onClick={() => openDialog("revision", report)}>Yêu cầu sửa</button>', '<button onClick={() => openDialog("revision", report)}>{L("Yêu cầu sửa")}</button>'],
  ['<button className="primary" onClick={() => openDialog("forward", report)}>Duyệt & gửi cấp trên</button>', '<button className="primary" onClick={() => openDialog("forward", report)}>{L("Duyệt & gửi cấp trên")}</button>'],
  ['<button className="primary" onClick={() => openDialog("forward", report)}>Gửi cấp trên</button>', '<button className="primary" onClick={() => openDialog("forward", report)}>{L("Gửi cấp trên")}</button>'],
  ['<button onClick={() => openDialog("upper-request", report)}>Yêu cầu bổ sung</button>', '<button onClick={() => openDialog("upper-request", report)}>{L("Yêu cầu bổ sung")}</button>'],
  ['<button className="primary" onClick={() => openDialog("upper-approved", report)}>Cấp trên đã duyệt</button>', '<button className="primary" onClick={() => openDialog("upper-approved", report)}>{L("Cấp trên đã duyệt")}</button>'],
  ['<button onClick={() => openDialog("reply", report)}>Phản hồi</button>', '<button onClick={() => openDialog("reply", report)}>{L("Phản hồi")}</button>'],
  ['<button onClick={() => openDialog("transfer", report)}>Chuyển cấp dưới xử lý</button>', '<button onClick={() => openDialog("transfer", report)}>{L("Chuyển cấp dưới xử lý")}</button>'],
  ['<button className="primary" onClick={() => complete(report)}>Hoàn tất</button>', '<button className="primary" onClick={() => complete(report)}>{L("Hoàn tất")}</button>'],
  ['<button className="primary" onClick={() => complete(report)}>Đánh dấu hoàn tất</button>', '<button className="primary" onClick={() => complete(report)}>{L("Đánh dấu hoàn tất")}</button>'],
  // ActionDialog configs
  ['forward: ["Duyệt và gửi cấp trên", "Người nhận tiếp theo", "Ghi chú gửi cấp trên"],',
   'forward: [L("Duyệt và gửi cấp trên"), L("Người nhận tiếp theo"), L("Ghi chú gửi cấp trên")],'],
  ['revision: ["Yêu cầu nhân viên chỉnh sửa", "Nhận xét / nội dung cần bổ sung", ""],',
   'revision: [L("Yêu cầu nhân viên chỉnh sửa"), L("Nhận xét / nội dung cần bổ sung"), ""],'],
  ['reject: ["Từ chối báo cáo", "Lý do từ chối", ""],',
   'reject: [L("Từ chối báo cáo"), L("Lý do từ chối"), ""],'],
  ['"upper-request": ["Yêu cầu từ cấp trên", "Nội dung yêu cầu bổ sung", ""],',
   '"upper-request": [L("Yêu cầu từ cấp trên"), L("Nội dung yêu cầu bổ sung"), ""],'],
  ['"upper-approved": ["Cấp trên đã duyệt", "Ghi chú", ""],',
   '"upper-approved": [L("Cấp trên đã duyệt"), L("Ghi chú"), ""],'],
  ['reply: ["Phản hồi cấp trên", "Nội dung phản hồi", ""],',
   'reply: [L("Phản hồi cấp trên"), L("Nội dung phản hồi"), ""],'],
  ['transfer: ["Chuyển yêu cầu cho cấp dưới", "Nội dung cần nhân viên xử lý", ""],',
   'transfer: [L("Chuyển yêu cầu cho cấp dưới"), L("Nội dung cần nhân viên xử lý"), ""],'],
  ['<option value="">{recipients.length ? "Chọn cấp trên nhận báo cáo" : "Không tìm thấy cấp trên trong hồ sơ nhân sự"}</option>',
   '<option value="">{recipients.length ? L("Chọn cấp trên nhận báo cáo") : L("Không tìm thấy cấp trên trong hồ sơ nhân sự")}</option>'],
  ['<option key={employee.id} value={employee.id}>{employee.fullName} · {employee.employeeCode} · {employee.departmentName || "Chưa có bộ phận"}</option>',
   '<option key={employee.id} value={employee.id}>{employee.fullName} · {employee.employeeCode} · {employee.departmentName || L("Chưa có bộ phận")}</option>'],
  ['<strong>{selectedRecipient.fullName}</strong><span>Mã NV: {selectedRecipient.employeeCode}</span><span>Bộ phận: {selectedRecipient.departmentName || "Chưa có bộ phận"}</span>',
   '<strong>{selectedRecipient.fullName}</strong><span>{L("Mã NV:")} {selectedRecipient.employeeCode}</span><span>{L("Bộ phận:")} {selectedRecipient.departmentName || L("Chưa có bộ phận")}</span>'],
  ['[["Tổng quan", report.overview], ["Kết quả thực hiện", report.results], ["Khó khăn / vấn đề", report.issues], ["Kiến nghị / đề xuất", report.recommendations]]',
   '[[L("Tổng quan"), report.overview], [L("Kết quả thực hiện"), report.results], [L("Khó khăn / vấn đề"), report.issues], [L("Kiến nghị / đề xuất"), report.recommendations]]'],
  ['<p key={label}><strong>{label}:</strong> {value || "Chưa có nội dung."}</p>', '<p key={label}><strong>{label}:</strong> {value || L("Chưa có nội dung.")}</p>'],
  ['<label>Hạn xử lý<input', '<label>{L("Hạn xử lý")}<input'],
  ['placeholder={placeholder || "Ghi chú (không bắt buộc)"}', 'placeholder={placeholder || L("Ghi chú (không bắt buộc)")}'],
  ['<button type="button" onClick={close}>Hủy</button>', '<button type="button" onClick={close}>{L("Hủy")}</button>'],
  ['{busy ? "Đang lưu…" : "Xác nhận"}', '{busy ? L("Đang lưu…") : L("Xác nhận")}'],
  // Error / success messages (display)
  ['catch (err) { setError(err.response?.data?.message || "Không cập nhật được luồng xử lý.") }', 'catch (err) { setError(err.response?.data?.message || L("Không cập nhật được luồng xử lý.")) }'],
];

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  c = setupImport(c, file);
  c = addMainHelpers(c);
  c = addSubComponentL(c, 'function ReportTable({ reports, columns, open, onAction, complete, isUpperRecipient = () => false }) {');
  c = addSubComponentL(c, 'function ReportModal({ report, close, openDialog, complete, download, isUpperRecipient }) {');
  c = addSubComponentL(c, 'function ActionDialog({ type, report, comment, setComment, recipient, setRecipient, employees, currentEmployeeId, deadline, setDeadline, close, submit, busy, error }) {');

  let applied = 0, missing = 0;
  for (const [find, repl] of wraps) {
    // normalize find to file's newline (our finds are single-line, so fine)
    const f = find;
    if (c.includes(f)) { c = c.split(f).join(repl); applied++; }
    else { missing++; /* console.log('  SKIP: ' + f.substring(0,60)); */ }
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log(file.split('/').slice(-3).join('/') + ': ' + applied + ' wraps applied, ' + missing + ' not found (likely admin variant)');
}

console.log('PART2 done');
