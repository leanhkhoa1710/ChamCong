const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/hr/pages/HrPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let applied = 0, missing = [];
const w = (find, repl) => { if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push(find.substring(0, 50)); };

// 1. i18n import
w('import "../hr.css";', 'import "../hr.css";' + nl + 'import { localeForLanguage, translate, useLanguage } from "../../../../services/i18n/LanguageProvider";');

// 2. L helper in component
w('    const [importReport, setImportReport] = useState(null);',
  '    const [importReport, setImportReport] = useState(null);' + nl +
  '    const { language } = useLanguage();' + nl +
  '    const locale = localeForLanguage(language);' + nl +
  '    const L = (text) => translate(text, language);');

// 3. formatDate uses "vi-VN" -> locale (module-scope function, can't use L - leave as is)
// 4. archiveEmployee / restoreEmployee confirm/alert
w('if (!window.confirm(`Lưu trữ ${employee.fullName} và chuyển hồ sơ sang danh sách Đã nghỉ việc?`)) return;',
  'if (!window.confirm(`${L("Lưu trữ")} ${employee.fullName} ${L("và chuyển hồ sơ sang danh sách Đã nghỉ việc?")}`)) return;');
w('window.alert(error.response?.data?.message || error.message || "Không thể lưu trữ nhân viên.")',
  'window.alert(error.response?.data?.message || error.message || L("Không thể lưu trữ nhân viên."))');
w('if (!window.confirm(`Khôi phục hồ sơ ${employee.fullName} về danh sách nhân viên?`)) return;',
  'if (!window.confirm(`${L("Khôi phục hồ sơ")} ${employee.fullName} ${L("về danh sách nhân viên?")}`)) return;');
w('window.alert(error.response?.data?.message || error.message || "Không thể khôi phục nhân viên.")',
  'window.alert(error.response?.data?.message || error.message || L("Không thể khôi phục nhân viên."))');

// 5. onImportFile - status labels
w('status: "Không đọc được"', 'status: L("Không đọc được")');
w('status: "Thiếu cột"', 'status: L("Thiếu cột")');

// 6. reportRows statuses
w('status: duplicateReasons.length ? "Đã tồn tại — bỏ qua" : "Cần chỉnh sửa"',
  'status: duplicateReasons.length ? L("Đã tồn tại — bỏ qua") : L("Cần chỉnh sửa")');
w('status: "Đã thêm, cần kiểm tra"', 'status: L("Đã thêm, cần kiểm tra")');
w('status: "Đã thêm thành công"', 'status: L("Đã thêm thành công")');
w('status: "Không thêm được"', 'status: L("Không thêm được")');

// 7. loading
w('<div className="att-loading">Đang tải...</div>', '<div className="att-loading">{L("Đang tải...")}</div>');

// 8. Toolbar buttons
w('title="Nhập danh sách nhân viên từ tệp Excel hoặc CSV"', 'title={L("Nhập danh sách nhân viên từ tệp Excel hoặc CSV")}');
w('⬆ Nhập Excel', '{L("⬆ Nhập Excel")}');
w('⬇ Tải mẫu', '{L("⬇ Tải mẫu")}');
w('⬇ Xuất danh sách', '{L("⬇ Xuất danh sách")}');
w('+ Thêm nhân viên', '{L("+ Thêm nhân viên")}');

// 9. Modal section titles
w('title: "1. Danh tính"', 'title: L("1. Danh tính")');
w('title: "2. Giấy tờ pháp lý"', 'title: L("2. Giấy tờ pháp lý")');
w('title: "3. Địa chỉ liên hệ"', 'title: L("3. Địa chỉ liên hệ")');
w('title: "4. Điều kiện làm việc"', 'title: L("4. Điều kiện làm việc")');
w('title: "5. Hợp đồng"', 'title: L("5. Hợp đồng")');
w('title: "6. Lương & chế độ"', 'title: L("6. Lương & chế độ")');
w('title: "7. Bảo hiểm & thuế"', 'title: L("7. Bảo hiểm & thuế")');
w('title: "8. Thanh toán"', 'title: L("8. Thanh toán")');
w('title: "Ghi chú"', 'title: L("Ghi chú")');

// 10. Modal buttons
w('>Đóng</button>', '>{L("Đóng")}</button>');
w('aria-label="Đóng"', 'aria-label={L("Đóng")}');

// 11. Import report modal
w('<h3 id="hr-import-report-title">Kết quả nhập nhân viên</h3>', '<h3 id="hr-import-report-title">{L("Kết quả nhập nhân viên")}</h3>');
w('<p className="hr-import-empty">Tất cả dòng hợp lệ đã được nhập.</p>', '<p className="hr-import-empty">{L("Tất cả dòng hợp lệ đã được nhập.")}</p>');

// 12. "Sửa hồ sơ" button
w('Sửa hồ sơ', '{L("Sửa hồ sơ")}');

fs.writeFileSync(f, c, 'utf8');
console.log('HrPage: ' + applied + ' applied, ' + missing.length + ' missing');
missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
