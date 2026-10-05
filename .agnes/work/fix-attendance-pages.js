const fs = require('fs');

function processFile(rel, setupImport, setupComponent, wraps) {
  const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/' + rel;
  let c = fs.readFileSync(f, 'utf8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  let applied = 0, missing = [];
  function w(find, repl) {
    if (c.includes(find)) { c = c.split(find).join(repl); applied++; }
    else missing.push(find.substring(0, 50));
  }
  // Import
  if (setupImport) {
    const [find, repl] = setupImport;
    if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push('import: ' + find.substring(0, 30));
  }
  // Component helpers
  if (setupComponent) {
    const [find, repl] = setupComponent;
    if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push('component: ' + find.substring(0, 30));
  }
  // Wraps
  for (const [find, repl] of wraps) {
    if (c.includes(find)) { c = c.split(find).join(repl); applied++; }
    else missing.push(find.substring(0, 50));
  }
  fs.writeFileSync(f, c, 'utf8');
  console.log(rel + ': ' + applied + ' applied, ' + missing.length + ' not-found');
  missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
}

// ============================================================
// EmployeeAttendanceHistoryPage.jsx
// ============================================================
processFile(
  'employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx',
  ['import { getAuth } from "../../../../services/auth/auth";',
   'import { getAuth } from "../../../../services/auth/auth";' + '\n' +
   'import { localeForLanguage, translate, useLanguage } from "../../../../services/i18n/LanguageProvider";'],
  ['    const [search, setSearch] = useState("");',
   '    const [search, setSearch] = useState("");' + '\n' +
   '    const { language } = useLanguage();' + '\n' +
   '    const locale = localeForLanguage(language);' + '\n' +
   '    const L = (text) => translate(text, language);'],
  [
    // calTitle: "vi-VN" -> locale
    ['toLocaleDateString("vi-VN", { month: "long", year: "numeric" })',
     'toLocaleDateString(locale, { month: "long", year: "numeric" })'],
    // alert
    ['alert("Không xác định được người duyệt (chưa liên kết nhân viên).");',
     'alert(L("Không xác định được người duyệt (chưa liên kết nhân viên)."));'],
    // loading
    ['<div className="att-loading">Đang tải...</div>',
     '<div className="att-loading">{L("Đang tải...")}</div>'],
    // KPI labels
    ['<span>Quân số</span>', '<span>{L("Quân số")}</span>'],
    ['<span>Đã vào ca</span>', '<span>{L("Đã vào ca")}</span>'],
    ['<span>Đang trong ca</span>', '<span>{L("Đang trong ca")}</span>'],
    ['<span>Đã ra ca</span>', '<span>{L("Đã ra ca")}</span>'],
    ['<span>Vắng mặt</span>', '<span>{L("Vắng mặt")}</span>'],
    // calendar buttons
    ['aria-label="Tháng trước"', 'aria-label={L("Tháng trước")}'],
    ['aria-label="Tháng sau"', 'aria-label={L("Tháng sau")}'],
    // legend
    ['/>Chưa duyệt</span>', '/>{L("Chưa duyệt")}</span>'],
    ['/>Đã xử lý</span>', '/>{L("Đã xử lý")}</span>'],
    ['/>Không có bản ghi</span>', '/>{L("Không có bản ghi")}</span>'],
    // calendar action buttons
    ['>Xem hôm nay</button>', '>{L("Xem hôm nay")}</button>'],
    ['>Xem tất cả</button>', '>{L("Xem tất cả")}</button>'],
    // search
    ['placeholder="Tìm mã hoặc tên nhân viên..."', 'placeholder={L("Tìm mã hoặc tên nhân viên...")}'],
    ['aria-label="Tìm nhân viên"', 'aria-label={L("Tìm nhân viên")}'],
    ['{filtered.length} bản ghi', '{filtered.length} {L("bản ghi")}'],
    // buttons
    ['⬇ Xuất file tháng', '{L("⬇ Xuất file tháng")}'],
    ['>+ Thêm</button>', '>{L("+ Thêm")}</button>'],
    // table headers
    ['<th>Nhân viên</th>', '<th>{L("Nhân viên")}</th>'],
    ['<th>Ngày</th>', '<th>{L("Ngày")}</th>'],
    ['<th>Trạng thái</th>', '<th>{L("Trạng thái")}</th>'],
    ['<th>Giờ vào → ra</th>', '<th>{L("Giờ vào → ra")}</th>'],
    ['<th>Giờ thực</th>', '<th>{L("Giờ thực")}</th>'],
    ['<th>Ảnh vào ca</th>', '<th>{L("Ảnh vào ca")}</th>'],
    ['<th>Ảnh ra ca</th>', '<th>{L("Ảnh ra ca")}</th>'],
    ['<th className="att-col-approval">Duyệt</th>', '<th className="att-col-approval">{L("Duyệt")}</th>'],
    // status/approval labels (from labels.js, used in JSX)
    ['{statusLabel(row.status)}', '{L(statusLabel(row.status))}'],
    ['{approvalLabel(row.approvalStatus)}', '{L(approvalLabel(row.approvalStatus))}'],
    // empty
    ['<span className="att-muted">Không có bản ghi phù hợp.</span>',
     '<span className="att-muted">{L("Không có bản ghi phù hợp.")}</span>'],
    // photo alt
    ['alt="Vào ca"', 'alt={L("Vào ca")}'],
    ['alt="Ra ca"', 'alt={L("Ra ca")}'],
    // approve button
    ['>Duyệt\n                                                                    </button>',
     '>{L("Duyệt")}\n                                                                    </button>'],
    // edit button
    ['>Sửa</button>', '>{L("Sửa")}</button>'],
    // view detail
    ['title="Xem chi tiết"', 'title={L("Xem chi tiết")}'],
    ['>Xem chi tiết</span>', '>{L("Xem chi tiết")}</span>'],
    // error message
    ['setError("Không thể chỉnh sửa bản ghi chấm công đã được duyệt.")',
     'setError(L("Không thể chỉnh sửa bản ghi chấm công đã được duyệt."))'],
    // CSV export keys
    ['"Mã NV"', 'L("Mã NV")'],
    ['"Họ tên"', 'L("Họ tên")'],
    ['"Ngày"', 'L("Ngày")'],
    ['"Giờ vào"', 'L("Giờ vào")'],
    ['"Giờ ra"', 'L("Giờ ra")'],
    ['"Giờ công"', 'L("Giờ công")'],
    ['"Trạng thái"', 'L("Trạng thái")'],
    ['"Duyệt"', 'L("Duyệt")'],
    ['Object.keys(rowsCsv[0] || { "Mã NV": "" })', 'Object.keys(rowsCsv[0] || { [L("Mã NV")]: "" })'],
  ]
);

// ============================================================
// EmployeeStatisticsPage.jsx
// ============================================================
processFile(
  'employees/attendance/pages/EmployeeStatisticsPage.jsx',
  ['import AttendanceDetailModal from "../components/AttendanceDetailModal";',
   'import AttendanceDetailModal from "../components/AttendanceDetailModal";' + '\n' +
   'import { localeForLanguage, translate, useLanguage } from "../../../../services/i18n/LanguageProvider";'],
  ['    const [modalOpen, setModalOpen] = useState(false);',
   '    const [modalOpen, setModalOpen] = useState(false);' + '\n' +
   '    const { language } = useLanguage();' + '\n' +
   '    const locale = localeForLanguage(language);' + '\n' +
   '    const L = (text) => translate(text, language);'],
  [
    // loading
    ['<div className="att-loading">Đang tải...</div>',
     '<div className="att-loading">{L("Đang tải...")}</div>'],
    // KPI labels
    ['<span className="admin-kpi-label">Nhân viên</span>', '<span className="admin-kpi-label">{L("Nhân viên")}</span>'],
    ['<span className="admin-kpi-sub">đang làm</span>', '<span className="admin-kpi-sub">{L("đang làm")}</span>'],
    ['<span className="admin-kpi-label">Có ngày công</span>', '<span className="admin-kpi-label">{L("Có ngày công")}</span>'],
    ['<span className="admin-kpi-sub">trong tháng</span>', '<span className="admin-kpi-sub">{L("trong tháng")}</span>'],
    ['<span className="admin-kpi-label">Bản ghi</span>', '<span className="admin-kpi-label">{L("Bản ghi")}</span>'],
    ['<span className="admin-kpi-label">Đi trễ</span>', '<span className="admin-kpi-label">{L("Đi trễ")}</span>'],
    ['<span className="admin-kpi-sub">lượt</span>', '<span className="admin-kpi-sub">{L("lượt")}</span>'],
    ['<span className="admin-kpi-label">Vắng mặt</span>', '<span className="admin-kpi-label">{L("Vắng mặt")}</span>'],
    // checkbox label
    ['hiện cả người chưa có', '{L("hiện cả người chưa có")}'],
    // button
    ['>+ Thêm bản ghi</button>', '>{L("+ Thêm bản ghi")}</button>'],
    // search
    ['placeholder="Tìm mã hoặc tên nhân viên..."', 'placeholder={L("Tìm mã hoặc tên nhân viên...")}'],
    ['aria-label="Tìm nhân viên"', 'aria-label={L("Tìm nhân viên")}'],
    // table headers
    ['<th>Nhân viên</th>', '<th>{L("Nhân viên")}</th>'],
    ['<th>Ngày đã làm</th>', '<th>{L("Ngày đã làm")}</th>'],
    ['<th>Đi trễ</th>', '<th>{L("Đi trễ")}</th>'],
    ['<th>Vắng mặt</th>', '<th>{L("Vắng mặt")}</th>'],
    ['<th>Nghỉ phép</th>', '<th>{L("Nghỉ phép")}</th>'],
    ['<th>Tổng giờ</th>', '<th>{L("Tổng giờ")}</th>'],
    // empty rows
    ['? "Không tìm thấy nhân viên phù hợp."', '? L("Không tìm thấy nhân viên phù hợp.")'],
    ['"Chưa có dữ liệu trong tháng này."}', 'L("Chưa có dữ liệu trong tháng này.")}'],
    // action buttons
    ['>Chi tiết\n                                                                </button>', '>{L("Chi tiết")}\n                                                                </button>'],
    ['>Sửa\n                                                                </button>', '>{L("Sửa")}\n                                                                </button>'],
  ]
);

console.log('\nDone.');
