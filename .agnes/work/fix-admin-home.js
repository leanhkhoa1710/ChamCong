const fs = require('fs');

// ============================================================
// 1. Add 2 missing phrases to dict
// ============================================================
const lpFile = 'D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx';
let lp = fs.readFileSync(lpFile, 'utf8');
const nl = lp.includes('\r\n') ? '\r\n' : '\n';
const add = [
  ["Giờ Việt Nam · GMT+7", "Vietnam Time · GMT+7", "越南时间 · GMT+7"],
  ["Hồ sơ & tuyển mới", "Profiles & hiring", "档案与招聘"],
];
const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });
const toAdd = add.filter(([vi]) => !existing.has(vi));
if (toAdd.length) {
  const block = toAdd.map(([vi, en, zh]) => `    "${vi}": ["${en}", "${zh}"],`).join(nl);
  const start = lp.indexOf('const phrases = {');
  let close = lp.indexOf('\n};', start);
  if (close === -1) close = lp.indexOf('\n};\n', start);
  const at = close + 1;
  lp = lp.substring(0, at) + block + nl + lp.substring(at);
  fs.writeFileSync(lpFile, lp, 'utf8');
  console.log('Added ' + toAdd.length + ' phrases');
}

// ============================================================
// 2. Wire i18n into AdminHomepage.jsx
// ============================================================
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/pages/AdminHomepage.jsx';
let c = fs.readFileSync(f, 'utf8');
const fNL = c.includes('\r\n') ? '\r\n' : '\n';
let applied = 0, missing = [];
const w = (find, repl) => { if (c.includes(find)) { c = c.split(find).join(repl); applied++; } else missing.push(find.substring(0, 50)); };

// 2a. Add i18n import
w('import "../admin.css";',
  'import "../admin.css";' + fNL +
  'import { localeForLanguage, translate, useLanguage } from "../../../services/i18n/LanguageProvider";');

// 2b. VnClock: add language/locale/L + change dateLabel to use locale
w('const VnClock = () => {\n    const [now, setNow] = useState(vnNow());',
  'const VnClock = () => {\n    const [now, setNow] = useState(vnNow());' + fNL +
  '    const { language } = useLanguage();' + fNL +
  '    const locale = localeForLanguage(language);' + fNL +
  '    const L = (text) => translate(text, language);');

// Change toLocaleDateString("vi-VN") to toLocaleDateString(locale)
w('.toLocaleDateString("vi-VN", {', '.toLocaleDateString(locale, {');

// "Giờ Việt Nam · GMT+7" -> L()
w('<span className="admhome-clock-tz">Giờ Việt Nam · GMT+7</span>',
  '<span className="admhome-clock-tz">{L("Giờ Việt Nam · GMT+7")}</span>');

// 2c. AdminHomepage: add L
w('const AdminHomepage = () => {\n    const navigate = useNavigate();',
  'const AdminHomepage = () => {\n    const navigate = useNavigate();' + fNL +
  '    const { language } = useLanguage();' + fNL +
  '    const L = (text) => translate(text, language);');

// title/subtitle
w('title="Trang chủ"', 'title={L("Trang chủ")}');
w('subtitle="Chọn chức năng để quản lý"', 'subtitle={L("Chọn chức năng để quản lý")}');

// ICONS in JSX: wrap label + sub
w('<span className="admhome-tile-label">{x.label}</span>', '<span className="admhome-tile-label">{L(x.label)}</span>');
w('<span className="admhome-tile-sub">{x.sub}</span>', '<span className="admhome-tile-sub">{L(x.sub)}</span>');

fs.writeFileSync(f, c, 'utf8');
console.log('AdminHomepage: ' + applied + ' applied, ' + missing.length + ' missing');
missing.forEach((m) => console.log('   - ' + JSON.stringify(m)));
