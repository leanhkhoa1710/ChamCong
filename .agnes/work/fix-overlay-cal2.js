const fs = require('fs');

// ============ 1. Add .att-overlay CSS ============
const cssFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/attendance/attendance.css';
let css = fs.readFileSync(cssFile, 'utf8');
if (!css.includes('.att-overlay')) {
  const cssNL = css.includes('\r\n') ? '\r\n' : '\n';
  const overlayCSS = '' + cssNL +
    '/* Overlay cho modal tạo / sửa (căn giữa màn, che nền) */' + cssNL +
    '.att-overlay {' + cssNL +
    '    position: fixed;' + cssNL +
    '    inset: 0;' + cssNL +
    '    background: rgba(14, 26, 38, 0.45);' + cssNL +
    '    display: flex;' + cssNL +
    '    align-items: center;' + cssNL +
    '    justify-content: center;' + cssNL +
    '    padding: 20px;' + cssNL +
    '    z-index: 100;' + cssNL +
    '}' + cssNL +
    '' + cssNL +
    '.att-overlay .att-form-modal {' + cssNL +
    '    width: 100%;' + cssNL +
    '    max-width: 460px;' + cssNL +
    '    max-height: calc(100vh - 40px);' + cssNL +
    '    overflow-y: auto;' + cssNL +
    '}';
  css += overlayCSS;
  fs.writeFileSync(cssFile, css, 'utf8');
  console.log('1. .att-overlay added to attendance.css');
} else {
  console.log('1. .att-overlay already present');
}

// ============ 2. Wrap contract modal in overlay ============
const f1 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx';
let c1 = fs.readFileSync(f1, 'utf8');
const nl1 = c1.includes('\r\n') ? '\r\n' : '\n';
let ok1 = 0;

// opening: add overlay wrapper + move stopPropagation to att-form-modal
const openFind = '                        {showModal && (' + nl1 +
  '                            <div' + nl1 +
  '                                className="att-form-modal"' + nl1 +
  '                            >' + nl1 +
  '                                <div' + nl1 +
  '                                    className="att-form"' + nl1 +
  '                                    onClick={(e) => e.stopPropagation()}' + nl1 +
  '                                >';
const openRepl = '                        {showModal && (' + nl1 +
  '                            <div className="att-overlay" onClick={() => setShowModal(false)}>' + nl1 +
  '                                <div' + nl1 +
  '                                    className="att-form-modal"' + nl1 +
  '                                    onClick={(e) => e.stopPropagation()}' + nl1 +
  '                                >' + nl1 +
  '                                    <div className="att-form">';
if (c1.includes(openFind)) { c1 = c1.replace(openFind, openRepl); ok1++; }
else console.log('   2a opening pattern not matched');

// closing: add one extra </div> for the overlay
const closeFind = '                                    </div>' + nl1 +
  '                                </div>' + nl1 +
  '                            </div>' + nl1 +
  '                        )}';
const closeRepl = '                                    </div>' + nl1 +
  '                                </div>' + nl1 +
  '                            </div>' + nl1 +
  '                            </div>' + nl1 +
  '                        )}';
if (c1.includes(closeFind)) { c1 = c1.replace(closeFind, closeRepl); ok1++; }
else console.log('   2b closing pattern not matched');

fs.writeFileSync(f1, c1, 'utf8');
console.log('2. modal overlay: ' + ok1 + '/2 patterns applied');

// ============ 3. Calendar title locale-aware ============
const f2 = 'D:/Monica/M-ChamCong/ChamCong/src/modules/employees/attendance/pages/EmployeeAttendanceHistoryPage.jsx';
let c2 = fs.readFileSync(f2, 'utf8');
const oldCal = 'return `ngày ${day} ${new Date(year, monthNumber - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" })}`;';
const newCal = 'return day !== "…" ? new Date(year, monthNumber - 1, Number(day)).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) : new Date(year, monthNumber - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });';
if (c2.includes(oldCal)) {
  c2 = c2.replace(oldCal, newCal);
  fs.writeFileSync(f2, c2, 'utf8');
  console.log('3. calendar title localized');
} else {
  console.log('3. calendar title pattern not matched');
}
