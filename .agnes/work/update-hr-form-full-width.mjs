import fs from 'node:fs';

const cssFile = 'ChamCong/src/modules/employees/hr/hr.css';
let css = fs.readFileSync(cssFile, 'utf8');
const cssPattern = /\.hrf-body \{[^}]*\}/;
if (cssPattern.test(css)) {
    css = css.replace(cssPattern, `.hrf-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    min-height: 0;
    padding: 20px 22px;
    overflow-y: auto;
}`);
    fs.writeFileSync(cssFile, css, 'utf8');
}

const formFile = 'ChamCong/src/modules/employees/hr/components/HrAddForm.jsx';
let form = fs.readFileSync(formFile, 'utf8').replace(/\r\n/g, '\n');

const socialPattern = /\s*<label className="hrf-check">\s*<input type="checkbox" checked=\{form\.isSocialInsuranceParticipant\} onChange=\{setChk\("isSocialInsuranceParticipant"\)\} \/>\s*Tham gia BHXH\s*<\/label>\n?/;
const bankPattern = /\s*<label className="hrf-check">\s*<input type="checkbox" checked=\{form\.isPrimary\} onChange=\{setChk\("isPrimary"\)\} \/>\s*TK chính\s*<\/label>\n?/;

if (!socialPattern.test(form) || !bankPattern.test(form)) {
    console.error('Checkbox blocks not found by pattern');
    process.exit(1);
}
form = form.replace(socialPattern, '').replace(bankPattern, '');
fs.writeFileSync(formFile, form, 'utf8');
console.log('HR form layout and checkboxes updated');
