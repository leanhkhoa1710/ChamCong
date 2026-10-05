const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/handover/pages/HandoverPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let ok = 0;

// 1. Add admin HrAppLayout import
if (!c.includes('AdminHrAppLayout')) {
  c = c.replace(
    'import HrAppLayout from "../../employees/hr/layout/HrAppLayout";',
    'import HrAppLayout from "../../employees/hr/layout/HrAppLayout";' + nl +
    'import AdminHrAppLayout from "../../admin/hr/layout/HrAppLayout";'
  );
  ok++;
}

// 2. Use AdminHrAppLayout when reviewMode (line 633: ? <HrAppLayout>{content}</HrAppLayout>)
// The current line: `? <HrAppLayout>{content}</HrAppLayout> : <AppLayout>{content}</AppLayout>;`
// where the condition is reviewMode. Replace HrAppLayout with AdminHrAppLayout in that ternary.
const oldTernary = '? <HrAppLayout>{content}</HrAppLayout>';
if (c.includes(oldTernary)) {
  c = c.replace(oldTernary, '? <AdminHrAppLayout>{content}</AdminHrAppLayout>');
  ok++;
}

fs.writeFileSync(f, c, 'utf8');
console.log('HandoverPage: ' + ok + ' changes');
