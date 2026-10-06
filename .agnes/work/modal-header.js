const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let applied = 0;

// 1. Replace the modal h2 with a header row (title + close button)
const oldH2 = '                                    <div className="att-form">' + nl +
  '                                        <h2>{L("Tạo hợp đồng lao động")}</h2>' + nl +
  '                                        <label>';
const newH2 = '                                    <div className="att-form">' + nl +
  '                                        <div className="att-form-head">' + nl +
  '                                            <h2>{L("Tạo hợp đồng lao động")}</h2>' + nl +
  '                                            <button type="button" className="att-form-close" aria-label={L("Đóng")} onClick={() => setShowModal(false)}>×</button>' + nl +
  '                                        </div>' + nl +
  '                                        <label>';
if (c.includes(oldH2)) { c = c.replace(oldH2, newH2); applied++; }
else {
  // fallback: just wrap the h2
  const h2Line = '                                        <h2>{L("Tạo hợp đồng lao động")}</h2>';
  if (c.includes(h2Line)) {
    c = c.replace(h2Line,
      '                                        <div className="att-form-head">' + nl +
      h2Line + nl +
      '                                            <button type="button" className="att-form-close" aria-label={L("Đóng")} onClick={() => setShowModal(false)}>×</button>' + nl +
      '                                        </div>');
    applied++;
  } else console.log('   h2 not found');
}

fs.writeFileSync(f, c, 'utf8');
console.log('modal header: ' + applied + ' applied');

// 2. Add CSS for the new header
const cssFile = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/admin.css';
let css = fs.readFileSync(cssFile, 'utf8');
const cssNL = css.includes('\r\n') ? '\r\n' : '\n';
if (!css.includes('.att-form-head')) {
  const block = '' + cssNL +
    '/* Modal header (title + close) */' + cssNL +
    '.att-form-head {' + cssNL +
    '    display: flex;' + cssNL +
    '    align-items: center;' + cssNL +
    '    justify-content: space-between;' + cssNL +
    '    gap: 12px;' + cssNL +
    '    margin-bottom: 4px;' + cssNL +
    '}' + cssNL +
    '' + cssNL +
    '.att-form-head h2 {' + cssNL +
    '    margin: 0;' + cssNL +
    '}' + cssNL +
    '' + cssNL +
    '.att-form-close {' + cssNL +
    '    width: 32px;' + cssNL +
    '    height: 32px;' + cssNL +
    '    flex-shrink: 0;' + cssNL +
    '    border: 1px solid #e2e8f0;' + cssNL +
    '    border-radius: 8px;' + cssNL +
    '    background: #fff;' + cssNL +
    '    color: #5a6b7b;' + cssNL +
    '    font-size: 20px;' + cssNL +
    '    line-height: 1;' + cssNL +
    '    cursor: pointer;' + cssNL +
    '    transition: border-color 0.15s, color 0.15s;' + cssNL +
    '}' + cssNL +
    '' + cssNL +
    '.att-form-close:hover {' + cssNL +
    '    border-color: #005b94;' + cssNL +
    '    color: #005b94;' + cssNL +
    '}';
  css += block;
  fs.writeFileSync(cssFile, css, 'utf8');
  console.log('CSS .att-form-head + .att-form-close added');
} else {
  console.log('CSS already present');
}
