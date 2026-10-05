const fs = require('fs');
const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/handover/pages/HandoverPage.jsx', 'utf8').split('\n');
c.forEach((l, i) => {
  if (/initialAssets|initialProjects|L\("|\btệp\b|Attachments|File đính kèm|pendingFiles/.test(l)) {
    console.log((i + 1) + ': ' + l.trim().substring(0, 130));
  }
});
