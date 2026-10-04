# -*- coding: utf-8 -*-
"""Quay lai trang thai code luc 10:34 AM: bo grid 3 cot -> flex space-between;
doi 'Ngay 3 thang 10 nam 2026' -> 'Ngay 3 · thang 10 nam 2026';
doi lai flex:1 cho .att-cal-title."""
import io

PAGE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\attendance\pages\AdminAttendanceHistoryPage.jsx"
CSS = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\admin.css"

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
    o = old.replace("\r\n","\n"); c = s.replace("\r\n","\n")
    if o in c:
        log.append((label, True)); return c.replace(o, new.replace("\r\n","\n"), 1)
    log.append((label, False))
    print("   MISS [" + label + "]")
    return s

# 1) PAGE: doi dau "·"
s = load(PAGE)
s = rep(s,
"""        return selectedDate ? `Ngày ${Number(selectedDate.slice(8))} ${base}` : base;""",
"""        return selectedDate ? `Ngày ${Number(selectedDate.slice(8))} · ${base}` : base;""",
"1. title + dau .")
save(PAGE, s)

# 2) CSS: head grid -> flex space-between
c = load(CSS)
c = rep(c,
"""/* Grid 3 cot (auto 1fr auto): 2 nut dong kich => title DUNG GIUA lich */
.att-cal-head {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}""",
""".att-cal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
}""",
"2. head -> flex")

# 3) CSS: doi lai flex:1 vao .att-cal-title
c = rep(c,
""".att-cal-title {
    min-width: 0;
    text-align: center;""",
""".att-cal-title {
    flex: 1;
    min-width: 0;
    text-align: center;""",
"3. title flex:1")
save(CSS, c)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
