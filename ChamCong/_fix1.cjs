const fs = require('fs');
const p = 'src/modules/admin/attendance/pages/AdminStatisticsPage.jsx';
let lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);

// 1. import modal after AttendanceFormModal import
const impIdx = lines.findIndex(l => l.includes('import AttendanceFormModal from "../components/AttendanceFormModal";'));
if (impIdx >= 0) lines.splice(impIdx + 1, 0, 'import AttendanceDetailModal from "../../../employees/attendance/components/AttendanceDetailModal";');

// 2. import employee.css after admin.css import
const cssIdx = lines.findIndex(l => l.includes('import "../../admin.css";'));
if (cssIdx >= 0) lines.splice(cssIdx + 1, 0, 'import "../../../employees/employee.css";');

// 3. remove Link import
lines = lines.filter(l => !l.includes('import { Link } from "react-router-dom";'));

// 4. add detailEmpId state after editRow state
const editIdx = lines.findIndex(l => l.includes('const [editRow, setEditRow] = useState(null);'));
if (editIdx >= 0) lines.splice(editIdx + 1, 0, '    const [detailEmpId, setDetailEmpId] = useState(null);');

// 5. replace the Link element lines (find <Link to attendanceHistoryPath ... </Link>)
const linkStart = lines.findIndex(l => l.trim() === '<Link' && lines.slice(lines.indexOf(l), lines.indexOf(l)+6).join('\n').includes('attendanceHistoryPath'));
let li = lines.findIndex(l => l.trim() === '<Link' && l.includes('to={`') === false && true);
// robust: find line that is just '<Link'
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '<Link') {
        // verify following lines contain attendanceHistoryPath
        if (lines.slice(i, i + 6).join(' ').includes('attendanceHistoryPath')) {
            const indent = lines[i].match(/^(\s*)/)[1];
            const inner = lines[i + 1].match(/^(\s*)/)[1];
            lines.splice(i, 6,
                `${indent}<button`,
                `${inner}type="button"`,
                `${inner}className="admin-view-link"`,
                `${inner}onClick={() => setDetailEmpId(emp.id)}`,
                `${inner}>`,
                `${inner}Chi tiết`,
                `${indent}</button>`
            );
            break;
        }
    }
}

// 6. remove attendanceHistoryPath decl lines
let delIdx = lines.findIndex(l => l.includes('const attendanceHistoryPath = hrMode'));
if (delIdx >= 0) {
    // it spans 3 lines: decl, ? "...", : "...";
    lines.splice(delIdx, 3);
}

// 7. add modal render before the closing </div> that precedes AttendanceFormModal close
// find the AttendanceFormModal opening line
const afmIdx = lines.findIndex(l => l.trim().startsWith('<AttendanceFormModal'));
if (afmIdx >= 0) {
    // find its closing /> line
    let closeIdx = afmIdx;
    while (!lines[closeIdx].includes('/>') && closeIdx < lines.length) closeIdx++;
    const block = [
        '',
        `                {detailEmpId && (`,
        `                    <AttendanceDetailModal`,
        `                        monthRows={rows.filter((r) => r.employeeId === detailEmpId && monthOf(r.attendanceDate) === month)}`,
        `                        employeeLabel={(() => {`,
        `                            const e = empMap[detailEmpId];`,
        `                            return e ? \`\${e.employeeCode} · \${e.fullName}\` : String(detailEmpId);`,
        `                        })()}`,
        `                        onClose={() => setDetailEmpId(null)}`,
        `                    />`,
        `                )}`,
    ];
    lines.splice(closeIdx + 1, 0, ...block);
}

fs.writeFileSync(p, lines.join('\r\n'), 'utf8');
console.log('AdminStatisticsPage rewritten OK');
