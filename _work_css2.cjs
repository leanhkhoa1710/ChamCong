const fs = require('fs');
const p = 'ChamCong/src/modules/admin/admin.css';
let c = fs.readFileSync(p, 'utf8');
const add = `
/* ===== QUÁ TRÌNH CÔNG TÁC - preview nhân viên ===== */
.work-emp-preview { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #d5dee8; border-left: 3px solid #2f6df6; background: #f8fafc; border-radius: 10px; }
.work-emp-preview-ava { width: 38px; height: 38px; border-radius: 50%; background: #2f6df6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex: 0 0 auto; }
.work-emp-preview-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.work-emp-preview-info strong { font-size: 13px; color: #172b42; }
.work-emp-preview-info small { font-size: 11px; color: #63758a; }
.work-emp-warn { font-size: 12px; color: #e65100; margin: 2px 0; }
`;
if (!c.includes('.work-emp-preview')) c += add;
fs.writeFileSync(p, c, 'utf8');
console.log('work emp preview CSS added');
