# -*- coding: utf-8 -*-
import io, re

BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr"

def load(p):
    with io.open(p, "r", encoding="utf-8") as f:
        return f.read()
def save(p, s):
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)

log = []
def rep(s, old, new, label):
    global log
    if old in s:
        log.append((label, True)); return s.replace(old, new, 1)
    o = old.replace("\r\n", "\n"); c = s.replace("\r\n", "\n")
    if o in c:
        log.append((label, True)); return c.replace(o, new.replace("\r\n", "\n"), 1)
    log.append((label, False)); print("   MISS:", repr(old[:80])); return s

# ===== 1) HrPage.jsx: thay 2 tab bằng dòng đếm số =====
p = BASE + "\\pages\\HrPage.jsx"
s = load(p)
pat = re.compile(r'<div className="hr-tabs">.*?</div>', re.S)
new_note = ('<div className="hr-tabs-note">\n'
            '                                Đang làm <b>{active.length}</b> · Đã nghỉ <b>{resigned.length}</b>\n'
            '                            </div>')
s2, n = pat.subn(new_note, s, count=1)
log.append(("1. tabs->note", n == 1)); s = s2
save(p, s)

# ===== 2) HrFilterBar.jsx: xóa select Trạng thái + import =====
p = BASE + "\\components\\HrFilterBar.jsx"
s = load(p)
block = """                <select
                    className="hr-select"
                    value={filters.status}
                    onChange={(e) => setters.setStatus(e.target.value)}
                >
                    <option value="">Trạng thái</option>
                    {Object.entries(STATUS_LABELS).map(([v, label]) => (
                        <option key={v} value={v}>
                            {label}
                        </option>
                    ))}
                </select>
"""
s = rep(s, block, "", "2. status select")
s = rep(s, 'import { STATUS_LABELS } from "../hooks/useHrFilters";\n', "", "2b. import")
save(p, s)

# ===== 3) hr.css: grid 3->2 select + style tabs-note =====
p = BASE + "\\hr.css"
s = load(p)
s = rep(s,
"    grid-template-columns: minmax(280px, 2fr) repeat(3, minmax(150px, 1fr)) auto;",
"    grid-template-columns: minmax(280px, 2fr) repeat(2, minmax(150px, 1fr)) auto;",
"3. grid main")
s = rep(s,
"        grid-template-columns: minmax(0, 1fr) repeat(3, minmax(120px, 150px));",
"        grid-template-columns: minmax(0, 1fr) repeat(2, minmax(120px, 150px));",
"3b. grid media")
# thêm style hr-tabs-note
if ".hr-tabs-note" not in s:
    s += "\n/* Dòng đếm NV đang làm / đã nghỉ (thay 2 tab đã bỏ) */\n.hr-tabs-note {\n    font-size: 13px;\n    color: #5a6b7b;\n    white-space: nowrap;\n}\n.hr-tabs-note b { color: #0e1a26; font-weight: 700; }\n"
    log.append(("3c. css note", True))
save(p, s)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
