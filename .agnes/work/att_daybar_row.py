# -*- coding: utf-8 -*-
"""att-cal-side: legend + daybar (Xem ngay / Xem tat ca) vao 1 hang;
bo 'Dang xem tat ca cac ngay'; luon hien ca 2 phan, highlight phan dang xem."""
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
    print("   MISS [" + label + "]")
    return s

# ================= PAGE: thay att-cal-side =================
s = load(PAGE)

old = """                            <div className="att-cal-side">
                                <div className="att-cal-legend">
                                    <span><i className="att-dot att-dot--pending" />Chưa duyệt</span>
                                    <span><i className="att-dot att-dot--done" />Đã xử lý</span>
                                    <span><i className="att-dot att-dot--none" />Không có bản ghi</span>
                                </div>
                                {selectedDate ? (
                                    <div className="att-daybar">
                                        <button type="button" className="att-daybar-nav" onClick={() => shiftDay(-1)} aria-label="Ngày trước">‹</button>
                                        <span className="att-daybar-label">Xem ngày {formatVnDate(selectedDate)}</span>
                                        <button type="button" className="att-daybar-nav" onClick={() => shiftDay(1)} aria-label="Ngày sau">›</button>
                                        <button type="button" className="att-daybar-clear" onClick={clearDay}>Xem tất cả</button>
                                    </div>
                                ) : (
                                    <div className="att-daybar att-daybar--idle">
                                        <span className="att-daybar-label">Đang xem tất cả các ngày</span>
                                    </div>
                                )}
                            </div>
"""

new = """                            <div className="att-cal-side">
                                <div className="att-cal-legend">
                                    <span><i className="att-dot att-dot--pending" />Chưa duyệt</span>
                                    <span><i className="att-dot att-dot--done" />Đã xử lý</span>
                                    <span><i className="att-dot att-dot--none" />Không có bản ghi</span>
                                </div>
                                <div className="att-daybar">
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
                            </div>
"""

s = rep(s, old, new, "page cal-side")
save(PAGE, s)

# ================= CSS =================
c = load(CSS)

# side: column -> row (legend + daybar cùng hàng)
c = rep(c,
""".att-cal-side {
    flex: 1;
    min-width: 240px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
}""",
""".att-cal-side {
    flex: 1;
    min-width: 240px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}""",
"css side row")

# daybar: co ve phai trong hang
c = rep(c,
""".att-daybar {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 10px;
    padding: 10px 14px;
}
.att-daybar--idle { opacity: 0.9; }""",
""".att-daybar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 10px;
    padding: 8px 12px;
}

/* Highlight phần đang xem: chọn ngày -> "Xem ngày" sáng; xem tất cả -> nút sáng */
.att-daybar-label.active {
    color: #005b94;
    font-weight: 700;
}
.att-daybar-clear.active {
    background: #005b94;
    border-color: #005b94;
    color: #fff;
}
.att-daybar-clear.active:hover {
    background: #0e1a26;
    border-color: #0e1a26;
}""",
"css daybar active")

save(CSS, c)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
