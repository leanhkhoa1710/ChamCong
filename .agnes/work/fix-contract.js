const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let applied = 0, missing = [];
function w(find, repl) {
  if (c.includes(find)) { c = c.split(find).join(repl); applied++; }
  else missing.push(find.substring(0, 50));
}

// 1. i18n import
w('import "../../admin.css";',
  'import "../../admin.css";' + nl + 'import { localeForLanguage, translate, useLanguage } from "../../../services/i18n/LanguageProvider";');

// 2. L + locale inside component (after useState declarations, before PageLayout)
w('    const PageLayout = hrMode ? HrAppLayout : AdminAppLayout;',
  '    const { language } = useLanguage();' + nl +
  '    const locale = localeForLanguage(language);' + nl +
  '    const L = (text) => translate(text, language);' + nl +
  '    const PageLayout = hrMode ? HrAppLayout : AdminAppLayout;');

// 3. layout title/subtitle
w('title="Hợp đồng lao động"', 'title={L("Hợp đồng lao động")}');
w('subtitle="Quản lý hợp đồng: hết hạn · sắp hết hạn · chờ ký · chưa lập · đã ký"',
  'subtitle={L("Quản lý hợp đồng: hết hạn · sắp hết hạn · chờ ký · chưa lập · đã ký")}');

// 4. alerts in submitContract
w('alert("Chọn nhân viên và nhập số hợp đồng.");', 'alert(L("Chọn nhân viên và nhập số hợp đồng."));');
w('alert("Tạo thất bại: " + (err.response?.data?.message || err.message));',
  'alert(L("Tạo thất bại:") + " " + (err.response?.data?.message || err.message));');

// 5. loading
w('<div className="att-loading">Đang tải...</div>', '<div className="att-loading">{L("Đang tải...")}</div>');

// 6. search
w('placeholder="Tìm tên, mã NV..."', 'placeholder={L("Tìm tên, mã NV...")}');
w('aria-label="Tìm nhân viên"', 'aria-label={L("Tìm nhân viên")}');

// 7. select options
w('<option value="">Tất cả trạng thái</option>', '<option value="">{L("Tất cả trạng thái")}</option>');
w('<option value="expired">Hết hạn ({counts.expired})</option>', '<option value="expired">{L("Hết hạn")} ({counts.expired})</option>');
w('<option value="expiring">Sắp hết hạn ({counts.expiring})</option>', '<option value="expiring">{L("Sắp hết hạn")} ({counts.expiring})</option>');
w('<option value="pending">Chờ ký</option>', '<option value="pending">{L("Chờ ký")}</option>');
w('<option value="none">Chưa lập ({counts.none})</option>', '<option value="none">{L("Chưa lập")} ({counts.none})</option>');
w('<option value="signed">Đã ký ({counts.signed})</option>', '<option value="signed">{L("Đã ký")} ({counts.signed})</option>');

// 8. count
w('{filtered.length} hồ sơ', '{filtered.length} {L("hồ sơ")}');

// 9. buttons
w('⟳ Tải lại', '{L("⟳ Tải lại")}');
w('+ Tạo hợp đồng', '{L("+ Tạo hợp đồng")}');

// 10. table headers
w('<th>Nhân viên</th>', '<th>{L("Nhân viên")}</th>');
w('<th>Phòng ban</th>', '<th>{L("Phòng ban")}</th>');
w('<th>Số HĐ</th>', '<th>{L("Số HĐ")}</th>');
w('<th>Loại</th>', '<th>{L("Loại")}</th>');
w('<th>Bắt đầu</th>', '<th>{L("Bắt đầu")}</th>');
w('<th>Hết hạn</th>', '<th>{L("Hết hạn")}</th>');
w('<th>Trạng thái</th>', '<th>{L("Trạng thái")}</th>');

// 11. empty row
w('Không có hợp đồng phù hợp.', '{L("Không có hợp đồng phù hợp.")}');

// 12. contract type inline map (1: Thử việc, 2: Hạn định, 3: Không xác định, 4: Mùa vụ)
w('1: "Thử việc",', '1: L("Thử việc"),');
w('2: "Hạn định",', '2: L("Hạn định"),');
w('3: "Không xác định",', '3: L("Không xác định"),');
w('4: "Mùa vụ",', '4: L("Mùa vụ"),');

// 13. date locale "vi-VN" -> locale (2 occurrences in table)
c = c.split(').toLocaleDateString(' + nl + '                                                                      "vi-VN"').join(').toLocaleDateString(' + nl + '                                                                      locale');
// Simpler: replace the exact vi-VN occurrences that are for startDate/endDate
c = c.replace(/new Date\(\s*c\s*\.startDate\s*\)\.toLocaleDateString\(\s*"vi-VN"/, 'new Date(c.startDate).toLocaleDateString(locale)');
c = c.replace(/new Date\(\s*c\.endDate\s*\)\.toLocaleDateString\(\s*"vi-VN"/, 'new Date(c.endDate).toLocaleDateString(locale)');

// 14. "Không xác định" fallback in endDate cell
w('? "Không xác định"', '? L("Không xác định")');

// 15. status badge label
w('CONTRACT_STATUS[\n                                                                        s\n                                                                    ].label',
  'L(CONTRACT_STATUS[\n                                                                        s\n                                                                    ].label)');
// The actual formatting may differ; do a regex fallback
c = c.replace(/CONTRACT_STATUS\[\s*s\s*\]\.label/g, 'L(CONTRACT_STATUS[s].label)');

// 16. modal
w('<h2>Tạo hợp đồng lao động</h2>', '<h2>{L("Tạo hợp đồng lao động")}</h2>');
w('Nhân viên' + nl + '                                        <select', '{L("Nhân viên")}' + nl + '                                        <select');
// "Nhân viên" label - standalone line
w('label>' + nl + '                                        Nhân viên' + nl + '                                        <select',
  'label>' + nl + '                                        {L("Nhân viên")}' + nl + '                                        <select');
w('— Chọn nhân viên —', '{L("— Chọn nhân viên —")}');
w('Số hợp đồng', '{L("Số hợp đồng")}');
w('Loại hợp đồng', '{L("Loại hợp đồng")}');
w('<option value={1}>Thử việc</option>', '<option value={1}>{L("Thử việc")}</option>');
w('<option value={2}>Hạn định</option>', '<option value={2}>{L("Hạn định")}</option>');
w('Không xác định' + nl + '                                            </option>',
  '{L("Không xác định")}' + nl + '                                            </option>');
w('<option value={4}>Mùa vụ</option>', '<option value={4}>{L("Mùa vụ")}</option>');
w('Ngày bắt đầu', '{L("Ngày bắt đầu")}');
w('Ngày hết hạn', '{L("Ngày hết hạn")}');
w('>Hủy</button>' , '>{L("Hủy")}</button>');
w('Lưu hợp đồng', '{L("Lưu hợp đồng")}');

fs.writeFileSync(f, c, 'utf8');
console.log('AdminContractPage: ' + applied + ' applied, ' + missing.length + ' not-found');
missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
