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

# ============ PAGE: title co them "Ngay X" ============
s = load(PAGE)
s = rep(s,
"""    const calTitle = useMemo(() => {
        const [yy, mm] = calMonth.split("-").map(Number);
        return new Date(yy, mm - 1, 1).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
    }, [calMonth]);
""",
"""    const calTitle = useMemo(() => {
        const [yy, mm] = calMonth.split("-").map(Number);
        const base = new Date(yy, mm - 1, 1).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
        return selectedDate ? `Ngày ${Number(selectedDate.slice(8))} · ${base}` : base;
    }, [calMonth, selectedDate]);
""",
"1. title + Ngay")
save(PAGE, s)

# ============ CSS: lich co gian + head space-between (can giua) ============
c = load(CSS)
c = rep(c,
""".att-cal {
    width: 330px;
    flex: 0 0 auto;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 10px;
    padding: 12px 14px;
}""",
""".att-cal {
    flex: 1 1 320px;
    min-width: 300px;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 10px;
    padding: 12px 14px;
}""",
"2. lich co gian")

# head: dat 2 nut ra 2 dau, title cam giua (space-between + title flex:1)
c = rep(c,
""".att-cal-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}""",
""".att-cal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
}""",
"3. head space-between")

# title: flex:1 de chan giua 2 nut (da co, xac nhan van du) - giu nguyen
save(CSS, c)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
