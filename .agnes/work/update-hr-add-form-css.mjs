import fs from 'node:fs';

const file = 'ChamCong/src/modules/employees/hr/hr.css';
let text = fs.readFileSync(file, 'utf8');
const pattern = /\.hrf-group \{[\s\S]*?\}/;
if (!pattern.test(text)) {
    console.error('hrf-group rule not found');
    process.exit(1);
}
const replacement = `.hrf-group {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: start;
    gap: 12px;
    padding: 16px;
    border: 1px solid #e8edf2;
    border-radius: 10px;
    background: #fbfcfe;
}

.hrf-group h3 {
    grid-column: 1 / -1;
}

.hrf-field,
.hrf-check {
    min-width: 0;
}`;
text = text.replace(pattern, replacement);
fs.writeFileSync(file, text, 'utf8');
console.log('HR add form group layout updated');
