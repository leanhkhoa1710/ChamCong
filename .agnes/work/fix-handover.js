const fs = require('fs');
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/handover/pages/HandoverPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const nl = c.includes('\r\n') ? '\r\n' : '\n';
let applied = 0, missing = [];
const w = (find, repl) => { if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push(find.substring(0, 50)); };

// 1. Fix module-scope L() bug: L() -> translate() (L only exists in component scope)
c = c.replace('L("Màn hình máy tính", language)', 'translate("Màn hình máy tính", language)');
c = c.replace('L("Bàn phím", language)', 'translate("Bàn phím", language)');
c = c.replace('L("Chuột", language)', 'translate("Chuột", language)');
c = c.replace('L("Công ty ABC", language)', 'translate("Công ty ABC", language)');
c = c.replace('L("Công ty XYZ", language)', 'translate("Công ty XYZ", language)');
applied += 5;

// 2. Fix "tệp" (Vietnamese) -> L("tệp") so it translates
w('({pendingFiles} tệp)', '({pendingFiles} {L("tệp")})');
// Actually the real text is: <b>{pendingFiles} tệp</b>
w('{pendingFiles} tệp', '{pendingFiles} {L("tệp")}');
// Also add "tệp" to phrases if not already
// The word "tệp" = "files" in English

// 3. Fix "File đính kèm" label (line 381: <small>File đính kèm</small>)
w('<small>File đính kèm</small>', '<small>{L("File đính kèm")}</small>');

// 4. statusLabels array - these are module scope, use translate in component
// Actually statusLabels is used in JSX. Let's wrap in JSX instead.

// 5. "Không rõ" fallback
w('|| "Không rõ"', '|| L("Không rõ")');

// 6. "Xóa tệp đã chọn" title
w('title="Xóa tệp đã chọn"', 'title={L("Xóa tệp đã chọn")}');

// 7. "mục" and "dự án" in the review card
w('{assets.length} mục', '{assets.length} {L("mục")}');
w('{projects.length} dự án', '{projects.length} {L("dự án")}');

// 8. "Đã cấp" / "Chưa cấp"
w('row.accountIssued ? "Đã cấp" : "Chưa cấp"', 'row.accountIssued ? L("Đã cấp") : L("Chưa cấp")');
w('selected.accountIssued ? "Đã cấp" : "Chưa cấp"', 'selected.accountIssued ? L("Đã cấp") : L("Chưa cấp")');

// 9. "Chưa có phòng ban"
w('row.departmentName || "Chưa có phòng ban"', 'row.departmentName || L("Chưa có phòng ban")');
w('selected.departmentName || "Chưa có phòng ban"', 'selected.departmentName || L("Chưa có phòng ban")');

fs.writeFileSync(f, c, 'utf8');
console.log('HandoverPage: ' + applied + ' applied, ' + missing.length + ' missing');
missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));

// Add "tệp" to dict if not present
let lp = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx', 'utf8');
const nl2 = lp.includes('\r\n') ? '\r\n' : '\n';
const extra = [["tệp", "files", "个文件"], ["Xóa tệp đã chọn", "Remove selected file", "删除已选文件"]];
const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });
const toAdd = extra.filter(([vi]) => !existing.has(vi));
if (toAdd.length) {
  const block = toAdd.map(([vi, en, zh]) => `    "${vi}": ["${en}", "${zh}"],`).join(nl2);
  const start = lp.indexOf('const phrases = {');
  let close = lp.indexOf('\n};', start);
  if (close === -1) close = lp.indexOf('\n};\n', start);
  const at = close + 1;
  lp = lp.substring(0, at) + block + nl2 + lp.substring(at);
  fs.writeFileSync('D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx', lp, 'utf8');
  console.log('Added ' + toAdd.length + ' more phrases');
}
