const fs = require('fs');
const base = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/';
for (const f of ['leaves/pages/LeaveAdminPage.jsx', 'leaves/pages/PayrollResignedReport.jsx']) {
  const c = fs.readFileSync(base + f, 'utf8');
  console.log('===== ' + f);
  c.split('\n').forEach((l, i) => {
    if (/Layout|const (PayrollAdminPage|ResignedPage|ReportPage)|export/.test(l) && i < 60) {
      console.log('  ' + (i + 1) + ': ' + l.trim().substring(0, 90));
    }
  });
}
