# -*- coding: utf-8 -*-
"""1) Xoa thanh 'Xem ngay' (nuot < > ngay).
2) Tieu de thang cam giua giua 2 nut < > (loa nut 'Hom nay' khoi head).
3) 'Hom nay' -> 'Xem hom nay', di xuong hang legend + 'Xem tat ca'."""
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
    o = old.replace("\r\n", "\n"); c = s.replace("\r\n", "\n")
    if o in c:
        log.append((label, True)); return c.replace(o, new.replace("\r\n", "\n"), 1)
    log.append((label, False))
    print("   MISS [" + label + "]: " + repr(old[:80]))
    return s

# ================= PAGE =================
s = load(PAGE)

# A) Bỏ nút "Hôm nay" khỏi header lịch
s = rep(s,
"""                                    <button type="button" className="att-cal-nav" onClick={() => shiftCalMonth(1)} aria-label="Tháng sau">›</button>
                                    <button type="button" className="att-cal-today" onClick={clearDay}>Hôm nay</button>
                                </div>""",
"""                                    <button type="button" className="att-cal-nav" onClick={() => shiftCalMonth(1)} aria-label="Tháng sau">›</button>
                                </div>""",
"A. bo nut Hom nay")

# B) Xóa hàm shiftDay (không còn dùng), thêm viewToday
s = rep(s,
"""    // Chuyển ngày qua lại (‹ › trên thanh "Xem ngày")
    const shiftDay = (n) => {
        const from = selectedDate || vnToday();
        const d = new Date(from + "T00:00:00");
        d.setDate(d.getDate() + n);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        setSelectedDate(key);
        setMonth("");
        setCalMonth(key.slice(0, 7));
    };

    const clearDay = () => {
        setSelectedDate("");
        setCalMonth(vnToday().slice(0, 7));
    };
""",
"""    // "Xem hôm nay": về đúng ngày hôm nay (lịch hiện tháng chứa hôm nay)
    const viewToday = () => {
        const todayKey = vnToday();
        setSelectedDate(todayKey);
        setMonth("");
        setCalMonth(todayKey.slice(0, 7));
    };

    const clearDay = () => {
        setSelectedDate("");
        setCalMonth(vnToday().slice(0, 7));
    };
""",
"B. viewToday thay shiftDay")

# C) Xóa block thanh "Xem ngày" (giữa legend + Xem tất cả)
s = rep(s,
"""                                <div className="att-daybar">
                                    <button type="button" className="att-daybar-nav" onClick={() => shiftDay(-1)} aria-label="Ngày trước">‹</button>
                                    <span className={`att-daybar-label${selectedDate ? " active" : ""}`}>
                                        Xem ngày {formatVnDate(selectedDate || vnToday())}
                                    </span>
                                    <button type="button" className="att-daybar-nav" onClick={() => shiftDay(1)} aria-label="Ngày sau">›</button>
                                    <button
                                        type="button"
                                        className={`att-daybar-clear${selectedDate ? "" : " active"}`}
                                        onClick={clearDay}
                                    >
                                        Xem tất cả
                                    </button>
                                </div>
""",
"""                                <div className="att-cal-actions">
                                    <button
                                        type="button"
                                        className={`att-cal-action${selectedDate === vnToday() ? " active" : ""}`}
                                        onClick={viewToday}
                                    >
                                        Xem hôm nay
                                    </button>
                                    <button
                                        type="button"
                                        className={`att-cal-action${selectedDate ? "" : " active"}`}
                                        onClick={clearDay}
                                    >
                                        Xem tất cả
                                    </button>
                                </div>
""",
"C. actions row thay daybar")

save(PAGE, s)

# ================= CSS =================
c = load(CSS)

# 1) .att-cal-today không dùng nữa -> thay bằng .att-cal-actions
c = rep(c,
""".att-cal-today {
    border: 1px solid #d1d5db;
    border-radius: 7px;
    background: #fff;
    padding: 4px 9px;
    font-size: 11px;
    font-weight: 600;
    color: #38506a;
    cursor: pointer;
}
.att-cal-today:hover { border-color: #005b94; color: #005b94; }""",
"""/* Hàng nút "Xem hôm nay / Xem tất cả" (cùng dòng với legend) */
.att-cal-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}

.att-cal-action {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    color: #38506a;
    cursor: pointer;
}
.att-cal-action:hover { border-color: #005b94; color: #005b94; }
.att-cal-action.active {
    background: #005b94;
    border-color: #005b94;
    color: #fff;
}
.att-cal-action.active:hover {
    background: #0e1a26;
    border-color: #0e1a26;
}""",
"1. css actions thay cal-today")

# 2) Header lịch: title cam giua hoan toan giua 2 nut (nav dong nhat + title chan fill)
c = rep(c,
""".att-cal-head {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

.att-cal-title {
    flex: 1;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    color: #0e1a26;
    text-transform: capitalize;
}""",
""".att-cal-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

/* Title thang cam giua: 2 nut nav dong kich, title chan fill phia giua */
.att-cal-title {
    flex: 1;
    min-width: 0;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    color: #0e1a26;
    text-transform: capitalize;
}""",
"2. css head center")

save(CSS, c)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
