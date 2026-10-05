const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';

// The h2 line has 36 spaces
const h2 = '                                    <h2>{L("Tạo hợp đồng lao động")}</h2>';
if (c.includes(h2)) {
  c = c.replace(h2,
    '                                    <div className="att-form-head">' + nl +
    '                                        <h2>{L("Tạo hợp đồng lao động")}</h2>' + nl +
    '                                        <button type="button" className="att-form-close" aria-label={L("Đóng")} onClick={() => setShowModal(false)}>×</button>' + nl +
    '                                    </div>');
  fs.writeFileSync(f, c, 'utf8');
  console.log('modal header with close button: OK');
} else {
  console.log('h2 pattern not found');
}
