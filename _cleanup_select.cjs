const fs = require('fs');
const p = 'ChamCong/src/modules/admin/roles/AdminRolesPage.jsx';
let c = fs.readFileSync(p, 'utf8');
const lines = c.split('\n');

// Find and remove the old select block (lines starting with {available.length > 0 && (
// through the matching closing )})
let startIdx = -1, endIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('{available.length > 0 && (')) { startIdx = i; break; }
}
if (startIdx !== -1) {
    // count braces to find end
    let depth = 0;
    for (let i = startIdx; i < lines.length; i++) {
        depth += lines[i].split('(').length - 1 - lines[i].split(')').length - 1;
        // Also count with JSX braces
        const opens = (lines[i].match(/\(/g) || []).length;
        const closes = (lines[i].match(/\)/g) || []).length;
        // Simpler: just look for the line that has just ")}" at right indent
        if (i > startIdx && lines[i].trim() === ')}') { endIdx = i; break; }
    }
    if (endIdx !== -1) {
        lines.splice(startIdx, endIdx - startIdx + 1);
        console.log('removed old select block, lines', startIdx + 1, 'to', endIdx + 1);
    } else {
        console.log('could not find end of select block');
    }
} else {
    console.log('old select block already removed');
}

// Also remove unused `available` variable declaration
const joined = lines.join('\n');
c = joined
    .replace(/const available = userRows\.filter\(\(u\) => !\(userRolesMap\[u\.id\] \|\| \[\]\)\.includes\(role\.name\)\);\n?/g, '');
fs.writeFileSync(p, c, 'utf8');
console.log('done cleanup');
