const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/hr/layout/HrSidebar.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';

// Add a "back to admin dashboard" NavLink after the nav items map
const oldNavEnd = '            ))}' + nl +
  '        </nav>';
const newNavEnd = '            ))}' + nl +
  '                <NavLink' + nl +
  '                    to="/admin"' + nl +
  '                    title={collapsed ? "Quay lại Dashboard" : undefined}' + nl +
  '                    className="att-nav-item att-nav-back"' + nl +
  '                >' + nl +
  '                    <span aria-hidden="true">←</span>' + nl +
  '                    <span>Quay lại Dashboard</span>' + nl +
  '                </NavLink>' + nl +
  '        </nav>';

if (c.includes(oldNavEnd)) {
  c = c.replace(oldNavEnd, newNavEnd);
  fs.writeFileSync(f, c, 'utf8');
  console.log('Added "Quay lại Dashboard" link at bottom of sidebar');
} else {
  console.log('Pattern not found');
}

// Add CSS for the back link (subtle, pushed to bottom)
const cssFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/admin.css';
let css = fs.readFileSync(cssFile, 'utf8');
const cssNL = css.includes('\r\n') ? '\r\n' : '\n';
if (!css.includes('.att-nav-back')) {
  const block = cssNL +
    '/* Back-to-dashboard link at the bottom of the HR admin sidebar */' + cssNL +
    '.att-nav-back {' + cssNL +
    '    margin-top: auto;' + cssNL +
    '    border-top: 1px solid #e8edf2;' + cssNL +
    '    padding-top: 10px;' + cssNL +
    '    color: #5a6b7b;' + cssNL +
    '}' + cssNL +
    '' + cssNL +
    '.att-nav-back:hover {' + cssNL +
    '    color: #005b94;' + cssNL +
    '    background: #f0f7fc;' + cssNL +
    '}';
  css += block;
  fs.writeFileSync(cssFile, css, 'utf8');
  console.log('Added .att-nav-back CSS');
}

// Ensure the sidebar nav is a flex column so margin-top:auto works
const layoutCheck = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/attendance/attendance.css', 'utf8');
if (layoutCheck.includes('.att-sidebar-nav')) {
  console.log('.att-sidebar-nav exists in attendance.css (flex column already set)');
}
