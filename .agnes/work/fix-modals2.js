const fs = require('fs');

function proc(rel, importAnchor, lAnchor, wraps) {
  const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/' + rel;
  let c = fs.readFileSync(f, 'utf8');
  const nl = c.includes('\r\n') ? '\r\n' : '\n';
  let applied = 0, missing = [];
  const w = (find, repl) => { if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push(find.substring(0, 50)); };

  // 1. Add i18n import
  const imp = 'import { translate, useLanguage } from "../../../../services/i18n/LanguageProvider";';
  if (!c.includes('LanguageProvider')) {
    w(importAnchor, importAnchor + nl + imp);
  }

  // 2. Add L() helper inside component
  if (!c.includes('const L = (text) => translate(text, language);')) {
    w(lAnchor, lAnchor + nl + '    const { language } = useLanguage();' + nl + '    const L = (text) => translate(text, language);');
  }

  // 3. Wraps
  for (const [find, repl] of wraps) w(find, repl);

  fs.writeFileSync(f, c, 'utf8');
  console.log(rel + ': ' + applied + ' applied, ' + missing.length + ' missing');
  missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
}

const IMPL = 'import { translate, useLanguage } from "../../../../services/i18n/LanguageProvider";';

// ============ AttendanceFormModal.jsx ============
proc(
  'employees/attendance/components/AttendanceFormModal.jsx',
  'import { useState, useEffect } from "react";',
  '    const [showEmployeeOptions, setShowEmployeeOptions] = useState(false);',
  [
    // Options
    ['<option key={o.l} value={o.v}>\n                                        {o.l}\n                                    </option>',
     '<option key={o.l} value={o.v}>\n                                        {L(o.l)}\n                                    </option>'],
    ['<option key={o.v} value={o.v}>\n                                        {o.l}\n                                    </option>',
     '<option key={o.v} value={o.v}>\n                                        {L(o.l)}\n                                    </option>'],
    // Modal title
    ['<h2>{row ? "Sửa bản ghi chấm công" : "Thêm bản ghi chấm công"}</h2>',
     '<h2>{row ? L("Sửa bản ghi chấm công") : L("Thêm bản ghi chấm công")}</h2>'],
    // Labels
    ['<label>\n                        Nhân viên\n', '<label>\n                        {L("Nhân viên")}\n'],
    ['placeholder="Nhập họ tên hoặc mã nhân viên..."', 'placeholder={L("Nhập họ tên hoặc mã nhân viên...")}'],
    ['<div className="att-employee-empty">Không tìm thấy nhân viên phù hợp.</div>',
     '<div className="att-employee-empty">{L("Không tìm thấy nhân viên phù hợp.")}</div>'],
    ['<label>\n                            Ngày\n', '<label>\n                            {L("Ngày")}\n'],
    ['<label>\n                            Trạng thái\n', '<label>\n                            {L("Trạng thái")}\n'],
    ['<label>Giờ vào ca<input', '<label>{L("Giờ vào ca")}<input'],
    ['<label>Giờ ra ca<input', '<label>{L("Giờ ra ca")}<input'],
    ['Giờ thực tế\n                            <input', '{L("Giờ thực tế")}\n                            <input'],
    ['Phê duyệt\n                            <select', '{L("Phê duyệt")}\n                            <select'],
    ['<label>\n                        Ghi chú\n', '<label>\n                        {L("Ghi chú")}\n'],
    ['placeholder="Tùy chọn"', 'placeholder={L("Tùy chọn")}'],
    ['Hủy\n                        </button>', '{L("Hủy")}\n                        </button>'],
    ['{row ? "Lưu sửa" : "Thêm mới"}', '{row ? L("Lưu sửa") : L("Thêm mới")}'],
    ['setError("Chọn nhân viên và ngày là bắt buộc.");', 'setError(L("Chọn nhân viên và ngày là bắt buộc."));'],
  ]
);

// ============ AttendanceDetailModal.jsx ============
proc(
  'employees/attendance/components/AttendanceDetailModal.jsx',
  'import { useMemo } from "react";',
  'const AttendanceDetailModal = ({ monthRows, employeeLabel, onClose }) => {',
  [
    ['<h2>Chi tiết chấm công</h2>', '<h2>{L("Chi tiết chấm công")}</h2>'],
    ['aria-label="Đóng"', 'aria-label={L("Đóng")}'],
    ['<span>Tổng</span>', '<span>{L("Tổng")}</span>'],
    ['<span>Công</span>', '<span>{L("Công")}</span>'],
    ['<span>Đi trễ</span>', '<span>{L("Đi trễ")}</span>'],
    ['<span>Vắng</span>', '<span>{L("Vắng")}</span>'],
    ['<span>Nghỉ phép</span>', '<span>{L("Nghỉ phép")}</span>'],
    ['<span>Tổng giờ</span>', '<span>{L("Tổng giờ")}</span>'],
    ['<strong>Nội dung đã sửa</strong>', '<strong>{L("Nội dung đã sửa")}</strong>'],
    ['<p className="att-muted">Không có bản ghi trong tháng này.</p>',
     '<p className="att-muted">{L("Không có bản ghi trong tháng này.")}</p>'],
    ['<th>Ngày</th>', '<th>{L("Ngày")}</th>'],
    ['<th>Giờ vào</th>', '<th>{L("Giờ vào")}</th>'],
    ['<th>Giờ ra</th>', '<th>{L("Giờ ra")}</th>'],
    ['<th>Giờ thực tế</th>', '<th>{L("Giờ thực tế")}</th>'],
    ['<th>Trạng thái</th>', '<th>{L("Trạng thái")}</th>'],
    ['>Đóng</button>', '>{L("Đóng")}</button>'],
    ['{statusLabel(row.status)}', '{L(statusLabel(row.status))}'],
  ]
);

// ============ AttendanceHistoryModal.jsx ============
proc(
  'employees/attendance/components/AttendanceHistoryModal.jsx',
  'import { approvalLabel } from "../labels";',
  'const AttendanceHistoryModal = ({ row, employeeLabel, onClose }) => {',
  [
    ['<h2>Lịch sử bản ghi</h2>', '<h2>{L("Lịch sử bản ghi")}</h2>'],
    ['aria-label="Đóng"', 'aria-label={L("Đóng")}'],
    ['<span className="att-history-label">Người duyệt</span>',
     '<span className="att-history-label">{L("Người duyệt")}</span>'],
    ['<span className="att-history-label">Thời gian</span>',
     '<span className="att-history-label">{L("Thời gian")}</span>'],
    ['<span className="att-history-label">Lý do</span>',
     '<span className="att-history-label">{L("Lý do")}</span>'],
    ['<span className="att-badge att-badge--info">Đã chỉnh sửa</span>',
     '<span className="att-badge att-badge--info">{L("Đã chỉnh sửa")}</span>'],
    ['<span className="att-history-label">Người sửa</span>',
     '<span className="att-history-label">{L("Người sửa")}</span>'],
    ['<span className="att-history-label">Nội dung</span>',
     '<span className="att-history-label">{L("Nội dung")}</span>'],
    ['>Đóng</button>', '>{L("Đóng")}</button>'],
    ['{approvalLabel(row.approvalStatus)}', '{L(approvalLabel(row.approvalStatus))}'],
  ]
);
