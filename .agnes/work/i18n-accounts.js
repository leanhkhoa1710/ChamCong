const fs = require('fs');

// ============================================================
// PART 1: add missing account-issuance phrases to i18n dict (idempotent)
// ============================================================
const lpFile = 'D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx';
let lp = fs.readFileSync(lpFile, 'utf8');
const lpNL = lp.includes('\r\n') ? '\r\n' : '\n';

const addPhrases = [
  ["Cấp tài khoản", "Account issuance", "账户发放"],
  ["Xác minh hồ sơ và cấp mã kích hoạt cho nhân viên", "Verify profiles and issue activation codes to employees", "核实档案并向员工发放激活码"],
  ["Tổng hồ sơ", "Total profiles", "档案总数"],
  ["Đang làm", "Working", "在职"],
  ["Đã có tài khoản", "Has account", "已有账户"],
  ["Chưa có", "None", "无"],
  ["Không hợp lệ", "Invalid", "无效"],
  ["Trùng mã", "Duplicate code", "代码重复"],
  ["Sẵn sàng cấp", "Ready to issue", "可发放"],
  ["Đang chọn", "Selected", "已选择"],
  ["Tìm mã, họ tên, email...", "Search code, name, email...", "搜索代码、姓名、邮箱…"],
  ["Tìm nhân viên", "Search employee", "搜索员工"],
  ["Xuất Excel", "Export Excel", "导出 Excel"],
  ["Cấp mã", "Issue code", "发放代码"],
  ["Chọn", "Select", "选择"],
  ["Mã", "Code", "代码"],
  ["Họ tên", "Name", "姓名"],
  ["Mã kích hoạt", "Activation code", "激活码"],
  ["Không tìm thấy nhân viên phù hợp.", "No matching employee found.", "未找到匹配员工。"],
  ["Không có nhân viên đang làm.", "No working employees.", "无在职员工。"],
  ["Chọn nhân viên hợp lệ chưa có tài khoản.", "Select valid employees without an account.", "选择尚未开通账户的有效员工。"],
  ["Đã cấp", "Issued", "已发放"],
  ["mã kích hoạt (hạn 1 ngày).", "activation code(s) (valid 1 day).", "激活码（1天有效）。"],
  ["Vui lòng xác nhận đã kiểm tra thông tin nhân sự.", "Please confirm the personnel information has been verified.", "请确认已核对人事信息。"],
  ["Mã kích hoạt không đúng, đã dùng hoặc hết hạn.", "Activation code is incorrect, already used, or expired.", "激活码不正确、已使用或已过期。"],
  ["Đã xác minh thông tin và mã kích hoạt cho", "Verified information and activation code for", "已核实信息及激活码："],
  ["Nhân viên dùng mã này để đặt hoặc đặt lại mật khẩu.", "The employee uses this code to set or reset their password.", "员工使用此码设置或重置密码。"],
  ["Không xác minh được mã kích hoạt.", "Could not verify the activation code.", "无法验证激活码。"],
  ["Xác minh mã kích hoạt", "Verify activation code", "验证激活码"],
  ["Kiểm tra thông tin nhân sự trước khi xác nhận tài khoản", "Check personnel information before confirming the account", "确认账户前请核对人事信息"],
  ["Đóng", "Close", "关闭"],
  ["Thông tin nhân sự", "Personnel information", "人事信息"],
  ["Mã nhân viên:", "Employee code:", "工号："],
  ["● Chưa kích hoạt", "● Not activated", "● 未激活"],
  ["Họ và tên", "Full name", "姓名"],
  ["CCCD / căn cước", "CCCD / ID card", "身份证/证件"],
  ["Ngày sinh", "Date of birth", "出生日期"],
  ["Giới tính", "Gender", "性别"],
  ["Số điện thoại", "Phone number", "电话号码"],
  ["Chức vụ", "Position", "职位"],
  ["Chi nhánh", "Branch", "分公司"],
  ["Ngày vào làm", "Start date", "入职日期"],
  ["Người quản lý", "Manager", "经理"],
  ["Chưa cập nhật", "Not set", "未设置"],
  ["Nhập mã kích hoạt", "Enter activation code", "输入激活码"],
  ["Mã còn hạn đến", "Code valid until", "代码有效期至"],
  ["Tôi xác nhận đã kiểm tra đúng thông tin nhân sự.", "I confirm the personnel information is correct.", "我确认人事信息无误。"],
  ["Sau khi xác minh, nhân viên sẽ dùng mã này để tự đặt mật khẩu và hoàn tất kích hoạt tài khoản.", "After verification, the employee will use this code to set a password and complete account activation.", "验证后，员工将使用此码自行设置密码并完成账户激活。"],
  ["Đang xác minh…", "Verifying…", "验证中…"],
  ["✓ Xác minh & kích hoạt", "✓ Verify & activate", "✓ 验证并激活"],
  ["Nam", "Male", "男"],
  ["Nữ", "Female", "女"],
  ["Đã kích hoạt", "Activated", "已激活"],
  ["Mã hết hạn", "Code expired", "代码已过期"],
  ["Email không hợp lệ", "Invalid email", "邮箱无效"],
];

const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });
const toAdd = addPhrases.filter(([vi]) => !existing.has(vi));
if (toAdd.length) {
  const block = toAdd.map(([vi, en, zh]) => `    "${vi}": ["${en}", "${zh}"],`).join(lpNL);
  const start = lp.indexOf('const phrases = {');
  let close = lp.indexOf('\n};', start);
  if (close === -1) close = lp.indexOf('\n};\n', start);
  const at = close + 1;
  lp = lp.substring(0, at) + block + lpNL + lp.substring(at);
  fs.writeFileSync(lpFile, lp, 'utf8');
  console.log('PART1: added ' + toAdd.length + ' new phrases (' + (addPhrases.length - toAdd.length) + ' existed)');
} else console.log('PART1: all present');

// ============================================================
// PART 2: wire i18n into both AccountIssuancePage files
// ============================================================
const files = [
  'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx',
  'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/accounts/pages/AccountIssuancePage.jsx',
];

const wraps = [
  // i18n import
  ['import "../account-issuance.css";',
   'import "../account-issuance.css";\nimport { localeForLanguage, translate, useLanguage } from "../../../../services/i18n/LanguageProvider";'],
  // L / locale / d helpers (inside component, before load; load does NOT use L -> no dep warning)
  ['    const load = useCallback(async () => {',
   '    const { language } = useLanguage();\n    const locale = localeForLanguage(language);\n    const L = (text) => translate(text, language);\n    const d = (value) => value ? new Date(value).toLocaleDateString(locale) : "—";\n\n    const load = useCallback(async () => {'],
  // layout title / subtitle
  ['title="Cấp tài khoản" subtitle="Xác minh hồ sơ và cấp mã kích hoạt cho nhân viên"',
   'title={L("Cấp tài khoản")} subtitle={L("Xác minh hồ sơ và cấp mã kích hoạt cho nhân viên")}'],
  // toolbar
  ['placeholder="Tìm mã, họ tên, email..."', 'placeholder={L("Tìm mã, họ tên, email...")}'],
  ['aria-label="Tìm nhân viên"', 'aria-label={L("Tìm nhân viên")}'],
  ['>Xuất Excel ({unlinked.length})</button>', '>{L("Xuất Excel")} ({unlinked.length})</button>'],
  ['>Cấp mã ({selected.size})</button>', '>{L("Cấp mã")} ({selected.size})</button>'],
  // table headers
  ['<th>Chọn</th>', '<th>{L("Chọn")}</th>'],
  ['<th>Mã</th>', '<th>{L("Mã")}</th>'],
  ['<th>Họ tên</th>', '<th>{L("Họ tên")}</th>'],
  ['<th>Trạng thái</th>', '<th>{L("Trạng thái")}</th>'],
  ['<th>Email</th>', '<th>{L("Email")}</th>'],
  ['<th>Mã kích hoạt</th>', '<th>{L("Mã kích hoạt")}</th>'],
  // kpi label
  ['<span className="account-kpi-label">{label}</span>', '<span className="account-kpi-label">{L(label)}</span>'],
  // status badge
  ['{state.label}</span>', '{L(state.label)}</span>'],
  // empty rows
  ['{search ? "Không tìm thấy nhân viên phù hợp." : "Không có nhân viên đang làm."}',
   '{search ? L("Không tìm thấy nhân viên phù hợp.") : L("Không có nhân viên đang làm.")}'],
  // loading
  ['<div className="att-loading">Đang tải...</div>', '<div className="att-loading">{L("Đang tải...")}</div>'],
  // handler messages (plain async fns, L in scope, no dep issue)
  ['if (!ids.length) { setError("Chọn nhân viên hợp lệ chưa có tài khoản."); return; }',
   'if (!ids.length) { setError(L("Chọn nhân viên hợp lệ chưa có tài khoản.")); return; }'],
  ['setIssued(`Đã cấp ${success}/${ids.length} mã kích hoạt (hạn 1 ngày).`)',
   'setIssued(`${L("Đã cấp")} ${success}/${ids.length} ${L("mã kích hoạt (hạn 1 ngày).")}`)'],
  ['if (!confirmed) { setError("Vui lòng xác nhận đã kiểm tra thông tin nhân sự."); return; }',
   'if (!confirmed) { setError(L("Vui lòng xác nhận đã kiểm tra thông tin nhân sự.")); return; }'],
  ['if (!code) { setError("Mã kích hoạt không đúng, đã dùng hoặc hết hạn."); return; }',
   'if (!code) { setError(L("Mã kích hoạt không đúng, đã dùng hoặc hết hạn.")); return; }'],
  ['setIssued(`Đã xác minh thông tin và mã kích hoạt cho ${verificationEmployee.fullName}. Nhân viên dùng mã này để đặt hoặc đặt lại mật khẩu.`)',
   'setIssued(`${L("Đã xác minh thông tin và mã kích hoạt cho")} ${verificationEmployee.fullName} ${L("Nhân viên dùng mã này để đặt hoặc đặt lại mật khẩu.")}`)'],
  ['catch (err) { setError(err.response?.data?.message || "Không xác minh được mã kích hoạt.") }',
   'catch (err) { setError(err.response?.data?.message || L("Không xác minh được mã kích hoạt.")) }'],
  // modal header
  ['<h2>Xác minh mã kích hoạt</h2>', '<h2>{L("Xác minh mã kích hoạt")}</h2>'],
  ['<p>Kiểm tra thông tin nhân sự trước khi xác nhận tài khoản</p>', '<p>{L("Kiểm tra thông tin nhân sự trước khi xác nhận tài khoản")}</p>'],
  ['aria-label="Đóng"', 'aria-label={L("Đóng")}'],
  ['<h3>Thông tin nhân sự</h3>', '<h3>{L("Thông tin nhân sự")}</h3>'],
  ['<i>● Chưa kích hoạt</i>', '<i>{L("● Chưa kích hoạt")}</i>'],
  ['<span>Mã nhân viên: {verificationEmployee.employeeCode}</span>', '<span>{L("Mã nhân viên:")}{verificationEmployee.employeeCode}</span>'],
  // profile grid: labels via L(label); gender value L(); in-modal dates -> d(); inline "Chưa cập nhật" fallbacks
  ['<small>{label}</small>', '<small>{L(label)}</small>'],
  ['gender(verificationEmployee.gender)', 'L(gender(verificationEmployee.gender))'],
  ['date(verificationEmployee.birthDate)', 'd(verificationEmployee.birthDate)'],
  ['date(verificationEmployee.startDate)', 'd(verificationEmployee.startDate)'],
  ['verificationEmployee.phoneNumber || "Chưa cập nhật"', 'verificationEmployee.phoneNumber || L("Chưa cập nhật")'],
  ['verificationEmployee.email || "Chưa cập nhật"', 'verificationEmployee.email || L("Chưa cập nhật")'],
  ['verificationEmployee.positionName || "Chưa cập nhật"', 'verificationEmployee.positionName || L("Chưa cập nhật")'],
  ['verificationEmployee.departmentName || "Chưa cập nhật"', 'verificationEmployee.departmentName || L("Chưa cập nhật")'],
  ['verificationEmployee.branchName || "Chưa cập nhật"', 'verificationEmployee.branchName || L("Chưa cập nhật")'],
  ['verificationEmployee.managerName || "Chưa cập nhật"', 'verificationEmployee.managerName || L("Chưa cập nhật")'],
  // activation code form
  ['<h3>Xác minh mã kích hoạt</h3>', '<h3>{L("Xác minh mã kích hoạt")}</h3>'],
  ['<label>Mã kích hoạt<input', '<label>{L("Mã kích hoạt")}<input'],
  ['placeholder="Nhập mã kích hoạt"', 'placeholder={L("Nhập mã kích hoạt")}'],
  ['<small>Mã còn hạn đến {date(activeCodeFor(verificationEmployee.id)?.expiresAt)}.</small>',
   '<small>{L("Mã còn hạn đến")} {d(activeCodeFor(verificationEmployee.id)?.expiresAt)}.</small>'],
  ['<label className="account-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => { setConfirmed(event.target.checked); setError(""); }} />Tôi xác nhận đã kiểm tra đúng thông tin nhân sự.</label>',
   '<label className="account-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => { setConfirmed(event.target.checked); setError(""); }} />{L("Tôi xác nhận đã kiểm tra đúng thông tin nhân sự.")}</label>'],
  ['<p className="account-activation-note">Sau khi xác minh, nhân viên sẽ dùng mã này để tự đặt mật khẩu và hoàn tất kích hoạt tài khoản.</p>',
   '<p className="account-activation-note">{L("Sau khi xác minh, nhân viên sẽ dùng mã này để tự đặt mật khẩu và hoàn tất kích hoạt tài khoản.")}</p>'],
  ['>Hủy</button>', '>{L("Hủy")}</button>'],
  ['{busy ? "Đang xác minh…" : "✓ Xác minh & kích hoạt"}', '{busy ? L("Đang xác minh…") : L("✓ Xác minh & kích hoạt")}'],
];

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  let applied = 0, missing = [];
  for (const [find, repl] of wraps) {
    if (c.includes(find)) { c = c.split(find).join(repl); applied++; }
    else missing.push(find.substring(0, 45));
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log('\n' + file.split('/').slice(-2).join('/') + ': ' + applied + ' applied, ' + missing.length + ' not-found');
  if (missing.length) missing.forEach((m) => console.log('   - ' + m));
}
