const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/attendance/components/AttendanceCard.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let ok = 0;

// 1. Import useEffect
if (c.includes('import { useState } from "react";')) {
  c = c.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
  ok++;
}

// 2. Add a running VN clock helper + state in the component
c = c.replace(
  'const AttendanceCard = ({ employeeId, record, history, onChanged }) => {' + nl +
  '    const [busy, setBusy] = useState(false);',
  'const VnClock = () => {' + nl +
  '    const [now, setNow] = useState(() => new Date());' + nl +
  nl +
  '    useEffect(() => {' + nl +
  '        const id = setInterval(() => setNow(new Date()), 1000);' + nl +
  '        return () => clearInterval(id);' + nl +
  '    }, []);' + nl +
  nl +
  '    const time = now.toLocaleTimeString("vi-VN", {' + nl +
  '        hour: "2-digit", minute: "2-digit", second: "2-digit",' + nl +
  '        hour12: false, timeZone: "Asia/Ho_Chi_Minh"' + nl +
  '    });' + nl +
  nl +
  '    return (' + nl +
  '        <div className="att-vn-clock" aria-label="Giờ Việt Nam" title="Giờ Việt Nam (GMT+7)">' + nl +
  '            <strong>{time}</strong>' + nl +
  '            <small>Giờ Việt Nam · GMT+7</small>' + nl +
  '        </div>' + nl +
  '    );' + nl +
  '};' + nl + nl +
  'const AttendanceCard = ({ employeeId, record, history, onChanged }) => {' + nl +
  '    const [busy, setBusy] = useState(false);'
);
ok++;

// 3. Render <VnClock /> in the hero title
c = c.replace(
  '            <div className="att-hero-title">' + nl +
  '                <h2>Ch?m cụng</h2>',
  '            <div className="att-hero-title">' + nl +
  '                <VnClock />' + nl +
  '                <h2>Ch?m cụng</h2>'
);
// fallback with proper Vietnamese if the mojibake form wasn't literal
if (!c.includes('<VnClock />')) {
  c = c.replace(
    '<div className="att-hero-title">' + nl + '                <h2>',
    '<div className="att-hero-title">' + nl + '                <VnClock />' + nl + '                <h2>'
  );
}
ok++;

fs.writeFileSync(f, c, 'utf8');
console.log('AttendanceCard: ' + ok + ' changes (VnClock added)');

// 4. Add CSS for .att-vn-clock
const cssFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/attendance/attendance.css';
let css = fs.readFileSync(cssFile, 'utf8');
const cssNL = css.includes('\r\n') ? '\r\n' : '\n';
if (!css.includes('.att-vn-clock')) {
  css += nl +
    '/* Clock on attendance page (Vietnam time) */' + nl +
    '.att-vn-clock {' + nl +
    '    display: flex;' + nl +
    '    flex-direction: column;' + nl +
    '    align-items: center;' + nl +
    '    gap: 2px;' + nl +
    '    padding: 8px 16px;' + nl +
    '    border-radius: 12px;' + nl +
    '    background: #fff8e1;' + nl +
    '    border: 1px solid #ffe08a;' + nl +
    '}' + nl +
    '.att-vn-clock strong {' + nl +
    "    font-family: 'Montserrat', 'Be Vietnam Pro', sans-serif;" + nl +
    '    font-size: 24px;' + nl +
    '    font-weight: 800;' + nl +
    '    color: #0e1a26;' + nl +
    '    line-height: 1;' + nl +
    '    font-variant-numeric: tabular-nums;' + nl +
    '}' + nl +
    '.att-vn-clock small {' + nl +
    '    font-size: 11px;' + nl +
    '    font-weight: 600;' + nl +
    '    letter-spacing: 0.04em;' + nl +
    '    color: #8a6d00;' + nl +
    '}';
  fs.writeFileSync(cssFile, css, 'utf8');
  console.log('CSS .att-vn-clock added');
}
