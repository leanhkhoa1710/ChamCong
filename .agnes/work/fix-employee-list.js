const fs = require('fs');

// ============================================================
// EmployeeListPage.jsx
// ============================================================
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/EmployeeListPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let applied = 0, missing = [];

function wrap(find, repl) {
  global.c = c;
  if (c.includes(find)) { c = c.split(find).join(repl); applied++; }
  else { missing.push(find.substring(0, 40)); }
}

// 1. Add i18n import after the hrUtils import
wrap(
  'import { toCsv, downloadCsv } from "./hr/hrUtils";',
  'import { toCsv, downloadCsv } from "./hr/hrUtils";' + nl +
  'import { localeForLanguage, translate, useLanguage } from "../../../../services/i18n/LanguageProvider";'
);

// 2. Add L + locale + localeL after useState lines
wrap(
  '    const [filterVal, setFilterVal] = useState("");',
  '    const [filterVal, setFilterVal] = useState("");' + nl +
  '    const { language } = useLanguage();' + nl +
  '    const locale = localeForLanguage(language);' + nl +
  '    const L = (text) => translate(text, language);'
);

// 3. Wrap Vietnamese strings
// searchPlaceholder default
wrap('searchPlaceholder = "Tìm theo thông tin...",', 'searchPlaceholder = "Tìm theo thông tin...",');
// The actual usage: placeholder={searchPlaceholder} -> already a variable, just needs to be translatable
// Change the default to use L? No, L is defined in the component body. The default is in the function signature.
// We need to translate it at render time. Change the JSX:
wrap('placeholder={searchPlaceholder}', 'placeholder={L(searchPlaceholder)}');
wrap('aria-label={searchPlaceholder}', 'aria-label={L(searchPlaceholder)}');

// alert messages
wrap(
  '(fn === reject ? "Từ chối" : "Duyệt") +\n                    " thất bại: "',
  '(fn === reject ? L("Từ chối") : L("Duyệt")) +\n                    L("thất bại:") + " " + '
);
// Remove the extra space
c = c.replace('L("thất bại:") + " " + (e.response', 'L("thất bại:") + " " + (e.response');

// loading
wrap('>Đang tải...</div>', '>{L("Đang tải...")}</div>');

// filter option "Tất cả"
wrap('<option value="">Tất cả</option>', '<option value="">{L("Tất cả")}</option>');

// count
wrap('{filtered.length} bản ghi', '{L("bản ghi")} ' + '{filtered.length}');
// Actually the original is: {filtered.length} bản ghi  -> "123 bản ghi"
// Better: {filtered.length} {L("bản ghi")}
c = c.replace('{L("bản ghi")} {filtered.length}', '{filtered.length} {L("bản ghi")}');

// Export CSV button
wrap('>⬇ Xuất CSV</button>', '>{L("⬇ Xuất CSV")}</button>');

// Empty text
wrap('{emptyText ||\n                                                    "Không có dữ liệu."}',
      '{emptyText ||\n                                                    L("Không có dữ liệu.")}');

// Date locale: "vi-VN" -> locale (in cell function, but it's outside the component scope)
// Actually the cell function is defined inside the component, so L/locale are in scope.
// The cell function uses toLocaleDateString("vi-VN") - change to locale
wrap('new Date(v).toLocaleDateString("vi-VN")', 'new Date(v).toLocaleDateString(locale)');

fs.writeFileSync(f, c, 'utf8');
console.log('EmployeeListPage: ' + applied + ' applied, ' + missing.length + ' not-found');
missing.forEach((m) => console.log('   - ' + m));
