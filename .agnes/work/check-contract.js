const fs = require('fs');
const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx', 'utf8').split('\n');
c.forEach((l, i) => {
  if (/CONTRACT_STATUS|Nhân viên|Hủy|toLocaleDateString/.test(l)) {
    console.log((i + 1) + ': ' + JSON.stringify(l.trim()));
  }
});
