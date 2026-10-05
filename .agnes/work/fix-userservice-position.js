const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/M.Services/Services/Account/UserService.cs';
let c = fs.readFileSync(f, 'utf8');
const isCRLF = c.includes('\r\n');
const nl = isCRLF ? '\r\n' : '\n';
const lines = c.split(isCRLF ? /\r\n/ : /\n/);

// 1. Locate the wrongly-placed Block/Unblock region
let blockStart = -1, blockEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('#region Block / Unblock')) blockStart = i;
  if (blockStart > 0 && lines[i].includes('#endregion') && i > blockStart) { blockEnd = i; break; }
}
if (blockStart === -1 || blockEnd === -1) {
  console.log('Block region not found; assuming file already correct.');
  process.exit(0);
}

// 2. Remove it from its current (wrong, outside-class) position
const blockLines = lines.splice(blockStart, blockEnd - blockStart + 1);

// 3. Find the class closing brace: scan from the end for the first line whose trim is "}".
//    The last line is the namespace close "}", so start just before it.
let classClose = -1;
for (let i = lines.length - 2; i >= 0; i--) {
  if (lines[i].trim() === '}') { classClose = i; break; }
}
if (classClose === -1) {
  console.log('ERROR: class closing brace not found');
  process.exit(1);
}

// 4. Insert the block inside the class, just before the class close, with a blank spacer
lines.splice(classClose, 0, '', ...blockLines, '');

fs.writeFileSync(f, lines.join(nl), 'utf8');
console.log('Moved Block/Unblock inside class. Block was ' + blockLines.length + ' lines, now before class close at old index ' + classClose);
