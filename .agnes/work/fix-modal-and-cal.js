const fs = require('fs');

// ============================================================
// FIX 1: AdminContractPage — wrap modal in a proper overlay
// ============================================================
const f1 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx';
let c1 = fs.readFileSync(f1, 'utf8');
const nl1 = c1.includes('\r\n') ? '\r\n' : '\n';
let applied1 = 0;

// Replace: {showModal && (\n    <div\n        className="att-form-modal"\n    >\n        <div\n            className="att-form"\n            onClick={(e) => e.stopPropagation()}\n        >
// With:  {showModal && (\n    <div className="att-overlay" onClick={() => setShowModal(false)}>\n        <div className="att-form-modal" onClick={(e) => e.stopPropagation()}>\n            <div className="att-form">

const oldPattern = '{showModal && (' + nl1 + '                            <div' + nl1 + '                                className="att-form-modal"' + nl1 + '                            >' + nl1 + '                                <div' + nl1 + '                                    className="att-form"' + nl1 + '                                    onClick={(e) => e.stopPropagation()}' + nl1 + '                                >';

const newPattern = '{showModal && (' + nl1 + '                            <div className="att-overlay" onClick={() => setShowModal(false)}>' + nl1 + '                                <div className="att-form-modal" onClick={(e) => e.stopPropagation()}>' + nl1 + '                                    <div className="att-form">';

if (c1.includes(oldPattern)) {
  c1 = c1.replace(oldPattern, newPattern);
  applied1++;
} else {
  // Try matching with actual whitespace
  const idx = c1.indexOf('{showModal && (');
  if (idx >= 0) {
    // Find the section and replace it wholesale
    const sectionStart = idx;
    const modalEnd = c1.indexOf('</div>' + nl1 + '                        )}' , c1.indexOf('Lưu hợp đồng'));
    const afterModalEnd = c1.indexOf('</div>', c1.indexOf('Lưu hợp đồng')) + '</div>'.length;
    // Simpler: just find the specific div className="att-form-modal" and wrap it
    c1 = c1.replace(
      '<div' + nl1 + '                                className="att-form-modal"' + nl1 + '                            >',
      '<div className="att-overlay" onClick={() => setShowModal(false)}>' + nl1 + '                                <div className="att-form-modal" onClick={(e) => e.stopPropagation()}>'
    );
    applied1++;
  }
  console.log('WARN: could not match oldPattern, trying simpler approach');
}

// Also add a close button in the modal header
c1 = c1.replace(
  '<h2>{L("Tạo hợp đồng lao động")}</h2>',
  '<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>' + nl1 +
  '                                        <h2 style={{ margin: 0 }}>{L("Tạo hợp đồng lao động")}</h2>' + nl1 +
  '                                        <button type="button" onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#5a6b7b" }}>×</button>' + nl1 +
  '                                    </div>'
);
applied1++;

fs.writeFileSync(f1, c1, 'utf8');
console.log('AdminContractPage modal overlay: ' + applied1 + ' changes');

// ============================================================
// FIX 2: EmployeeAttendanceHistoryPage — calendar title "Ngày 4 October 2026"
// ============================================================
const f2 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx';
let c2 = fs.readFileSync(f2, 'utf8');
const nl2 = c2.includes('\r\n') ? '\r\n' : '\n';
let applied2 = 0;

// The calTitle function:
// return `ngày ${day} ${new Date(year, monthNumber - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" })}`;
// Fix: use L("ngày") + locale-based month, and handle locale-appropriate format
// For EN: "4 October 2026" (no "ngày" prefix)
// For VI: "ngày 4 tháng 10 năm 2026"
// Best approach: just format the whole thing with toLocaleDateString options and skip the "ngày" word
c2 = c2.replace(
  'return `ngày ${day} ${new Date(year, monthNumber - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" })}`;',
  'return day !== "…" ? new Date(year, monthNumber - 1, Number(day)).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : new Date(year, monthNumber - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });'
);
applied2++;

fs.writeFileSync(f2, c2, 'utf8');
console.log('AttendanceHistoryPage calendar title: ' + applied2 + ' changes');
