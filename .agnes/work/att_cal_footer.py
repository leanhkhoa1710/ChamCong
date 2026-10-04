# -*- coding: utf-8 -*-
"""Xep lai khoc lich: legend + 2 nut (Xem hom nay / Xem tat ca) DI XUONG DUOI lich,
cung 1 card, cung 1 hang (legend trai, 2 nut phai)."""
import io, re

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

# ============ PAGE: footer vao BEN TRONG .att-cal (duoi grid), bo .att-cal-side ============
s = load(PAGE)

old = """                                </div>
                            </div>
                            <div className="att-cal-side">
                                <div className="att-cal-legend">
                                    <span><i className="att-dot att-dot--pending" />Chưa duyệt</span>
                                    <span><i className="att-dot att-dot--done" />Đã xử lý</span>
                                    <span><i className="att-dot att-dot--none" />Không có bản ghi</span>
                                </div>
                                <div className="att-cal-actions">
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
                            </div>
                        </div>
"""

new = """                                </div>

                                <div className="att-cal-footer">
                                    <div className="att-cal-legend">
                                        <span><i className="att-dot att-dot--pending" />Chưa duyệt</span>
                                        <span><i className="att-dot att-dot--done" />Đã xử lý</span>
                                        <span><i className="att-dot att-dot--none" />Không có bản ghi</span>
                                    </div>
                                    <div className="att-cal-actions">
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
                                </div>
                            </div>
                        </div>
"""

s = rep(s, old, new, "1. footer vao att-cal")
save(PAGE, s)

# ============ CSS ============
c = load(CSS)

# lich full-width (bo side)
c = rep(c,
""".att-cal {
    flex: 1 1 320px;
    min-width: 300px;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 10px;
    padding: 12px 14px;
}""",
""".att-cal {
    flex: 1;
    min-width: 0;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 10px;
    padding: 12px 14px;
}""",
"2. lich full-width")

# bo CSS .att-cal-side (da chet)
m = re.search(r"\n\.att-cal-side \{.*?\n\}\n", c, re.S)
if m:
    c = c[:m.start()] + c[m.end():]
    log.append(("3. bo att-cal-side css", True))
else:
    log.append(("3. bo att-cal-side css", False))

# them CSS footer (sau block .att-cal-grid / truoc legend)
anchor = "\n/* Hang nut \"Xem hôm nay / Xem tất cả\" (cùng dòng vơi legend) */"
if anchor not in c:
    # tim comment hang nut (co the sai teo ky tu) va dat footer truoc do
    m2 = re.search(r"\n/\* Hang nut[^*]*\*/", c)
    pos = m2.start() if m2 else None
    footer_css = """
/* Footer lich: legend trai + 2 nut phai, dong duoi luoi ngay */
.att-cal-footer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 14px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #eef2f6;
}
"""
    if pos is not None:
        c = c[:pos] + footer_css + c[pos:]
        log.append(("4. css footer (anchor comment)", True))
    else:
        c += footer_css
        log.append(("4. css footer (append)", True))
else:
    c = c.replace(anchor, "\n/* Footer lich: legend trai + 2 nut phai, dong duoi luoi ngay */\n.att-cal-footer {\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 10px 14px;\n    margin-top: 12px;\n    padding-top: 10px;\n    border-top: 1px solid #eef2f6;\n}\n" + anchor)
    log.append(("4. css footer (anchor day)", True))

save(CSS, c)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
