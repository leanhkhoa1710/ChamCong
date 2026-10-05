const fs = require('fs');

// ============================================================
// 1. Add .att-overlay to attendance.css
// ============================================================
const cssFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/attendance/attendance.css';
let css = fs.readFileSync(cssFile, 'utf8');
const cssNL = css.includes('\r\n') ? '\r\n' : '\n';
if (!css.includes('.att-overlay')) {
  const overlayCSS = '\n/* Modal overlay (che full màn, căn giữa modal) */\n.att-overlay {\n    position: fixed;\n    inset: 0;\n    background: rgba(14, 26, 38, 0.45);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 20px;\n    z-index: 100;\n}\n';
  // Append to end of file
  css += overlayCSS;
  fs.writeFileSync(cssFile, css, 'utf8');
  console.log('Added .att-overlay to attendance.css');
} else {
  console.log('.att-overlay already exists');
}

// ============================================================
// 2. Fix AdminContractPage modal: wrap in .att-overlay
// ============================================================
const f1 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx';
let c1 = fs.readFileSync(f1, 'utf8');
const nl1 = c1.includes('\r\n') ? '\r\n' : '\n';
let applied1 = 0;

// Old: {showModal && (
//         <div
//             className="att-form-modal"
//         >
//             <div
//                 className="att-form"
//                 onClick={(e) => e.stopPropagation()}
//             >
// New: {showModal && (
//         <div className="att-overlay" onClick={() => setShowModal(false)}>
//             <div className="att-form-modal" onClick={(e) => e.stopPropagation()}>
//                 <div className="att-form">

const oldStart = '{showModal && (' + nl1 + '                            <div' + nl1 + '                                className="att-form-modal"' + nl1 + '                            >' + nl1 + '                                <div' + nl1 + '                                    className="att-form"' + nl1 + '                                    onClick={(e) => e.stopPropagation()}' + nl1 + '                                >';
const newStart = '{showModal && (' + nl1 + '                            <div className="att-overlay" onClick={() => setShowModal(false)}>' + nl1 + '                                <div className="att-form-modal" onClick={(e) => e.stopPropagation()}>' + nl1 + '                                    <div className="att-form">';

if (c1.includes(oldStart)) {
  c1 = c1.replace(oldStart, newStart);
  applied1++;
} else {
  // Try simpler match
  const idx = c1.indexOf('className="att-form-modal"');
  if (idx > 0) {
    // Find the line and replace
    const lineStart = c1.lastIndexOf(nl, idx) + 1;
    const lineEnd = c1.indexOf(nl, idx);
    const oldLine = c1.substring(lineStart, lineEnd);
    // We need to find the opening <div that contains this class
    // Let's just do a simpler approach: replace the specific multi-line pattern
    const searchPattern = '<div' + nl1 + '                                className="att-form-modal"' + nl1 + '                            >';
    const replacePattern = '<div className="att-overlay" onClick={() => setShowModal(false)}>' + nl1 + '                                <div className="att-form-modal" onClick={(e) => e.stopPropagation()}>';
    if (c1.includes(searchPattern)) {
      c1 = c1.replace(searchPattern, replacePattern);
      applied1++;
    }
  }
}

// Fix closing: the old closing was:
// </div>  (att-form)
// </div>  (att-form-modal)  
// )}
// New closing needs an extra </div> for the overlay
// Find the closing after "Lưu hợp đồng" button
const oldEnd = '                                    </div>' + nl1 + '                                </div>' + nl1 + '                            </div>' + nl1 + '                        )}';
const newEnd = '                                        </div>' + nl1 + '                                    </div>' + nl1 + '                                </div>' + nl1 + '                            )}';

// Actually the indentation is complex. Let me just add the closing </div> before the )}
// Find: </div>\n</div>\n)}  (the last two </div> before )})
// The structure was: <div att-form-modal><div att-form>...</div></div>
// Now it's: <div att-overlay><div att-form-modal><div att-form>...</div></div></div>

// Find the specific closing pattern
const closePattern = '                                    </div>' + nl1 + '                                </div>' + nl1 + '                            </div>' + nl1 + '                        )}';
if (c1.includes(closePattern)) {
  c1 = c1.replace(closePattern, '                                        </div>' + nl1 + '                                    </div>' + nl1 + '                                </div>' + nl1 + '                            </div>' + nl1 + '                        )}');
  applied1++;
}

fs.writeFileSync(f1, c1, 'utf8');
console.log('AdminContractPage modal: ' + applied1 + ' changes applied');

// ============================================================
// 3. Fix calendar title: "ngày 4 October 2026" -> locale-aware
// ============================================================
const f2 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx';
let c2 = fs.readFileSync(f2, 'utf8');
const nl2 = c2.includes('\r\n') ? '\r\n' : '\n';
let applied2 = 0;

// Replace the calTitle useMemo
// Old: return `ngày ${day} ${new Date(year, monthNumber - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" })}`;
// New: use toLocaleDateString with full date options (no "ngày" prefix)
const oldCal = 'return `ngày ${day} ${new Date(year, monthNumber - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" })}`;';
const newCal = 'return day !== "…" ? new Date(year, monthNumber - 1, Number(day)).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : new Date(year, monthNumber - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });';
if (c2.includes(oldCal)) {
  c2 = c2.replace(oldCal, newCal);
  applied2++;
}

fs.writeFileSync(f2, c2, 'utf8');
console.log('Calendar title fix: ' + applied2 + ' changes');
