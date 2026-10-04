# -*- coding: utf-8 -*-
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

# ============ PAGE: bo dau "·" -> "Ngay 3 thang 10 nam 2026" ============
s = load(PAGE)
s = rep(s,
"""        return selectedDate ? `Ngày ${Number(selectedDate.slice(8))} · ${base}` : base;""",
"""        return selectedDate ? `Ngày ${Number(selectedDate.slice(8))} ${base}` : base;""",
"1. title bo dau giua")
save(PAGE, s)

# ============ CSS: head sang grid 3 cot (auto 1fr auto) de cam giua don gian ============
c = load(CSS)
c = rep(c,
""".att-cal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
}""",
"""/* Grid 3 cot (auto 1fr auto): 2 nut dong kich => title DUNG GIUA lịch */
.att-cal-head {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}""",
"2. head grid 3 cot")
save(CSS, c)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
