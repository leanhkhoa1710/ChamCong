# -*- coding: utf-8 -*-
"""Trang Lịch sử & duyệt công (/employees/attendance-history):
1. Gom nút Duyệt/Từ chối/Sửa vào cột DUYỆT (bỏ cột hành động riêng)
2. Thêm lịch tháng + chuyển ngày qua lại; ngày có bản ghi chờ duyệt = đỏ,
   đã xử lý hết = xanh; chọn ngày để chỉ xem công của ngày đó."""
import io, os

BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\attendance"
PAGE = BASE + r"\pages\AdminAttendanceHistoryPage.jsx"
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
    print(f"   MISS [{label}]: " + repr(old[:90]))
    return s

# ================= PAGE =================
s = load(PAGE)

# 1) helper vnToday (đặt sau imports)
s = rep(s,
"""import "../../../../modules/attendance/attendance.css";
import "../../admin.css";
""",
"""import "../../../../modules/attendance/attendance.css";
import "../../admin.css";

// Ngày hiện tại theo giờ Việt Nam (UTC+7), dạng "YYYY-MM-DD".
const vnToday = () => {
    const t = new Date(Date.now() + new Date().getTimezoneOffset() * 60000 + 7 * 3600000);
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};
""", "1. vnToday helper")

# 2) state ngày + tháng lịch
s = rep(s,
"""    const [month, setMonth] = useState("");
    const [search, setSearch] = useState("");
""",
"""    const [month, setMonth] = useState("");
    const [search, setSearch] = useState("");
    // Xem theo ngày (lịch): "" = tất cả các ngày, "YYYY-MM-DD" = 1 ngày
    const [selectedDate, setSelectedDate] = useState("");
    const [calMonth, setCalMonth] = useState(() => vnToday().slice(0, 7));
""", "2. state ngày")

# 3) baseFiltered + dayStatus + filtered mới
s = rep(s,
"""    const filtered = useMemo(() => {
        const term = search.trim().toLocaleLowerCase();
        return rows.filter((r) => {
            if (q && r.employeeId !== q) return false;
            const employee = empMap[r.employeeId];
            const haystack = [r.employeeCode, r.employeeName, employee?.employeeCode, employee?.fullName]
                .join(" ").toLocaleLowerCase();
            if (term && !haystack.includes(term)) return false;
            if (month) {
                const d = new Date(r.attendanceDate);
                const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                if (m !== month) return false;
            }
            return true;
        });
    }, [rows, q, month, search, empMap]);
""",
"""    // Lọc nền (theo nhân viên + từ khóa) - dùng để tô màu ngày trong lịch.
    const baseFiltered = useMemo(() => {
        const term = search.trim().toLocaleLowerCase();
        return rows.filter((r) => {
            if (q && r.employeeId !== q) return false;
            const employee = empMap[r.employeeId];
            const haystack = [r.employeeCode, r.employeeName, employee?.employeeCode, employee?.fullName]
                .join(" ").toLocaleLowerCase();
            if (term && !haystack.includes(term)) return false;
            return true;
        });
    }, [rows, q, search, empMap]);

    // Ngày -> "pending" (còn bản ghi chờ duyệt) | "done" (đã xử lý hết).
    const dayStatus = useMemo(() => {
        const map = {};
        baseFiltered.forEach((r) => {
            const key = (r.attendanceDate || "").slice(0, 10);
            if (!key) return;
            if (r.approvalStatus === 0) map[key] = "pending";
            else if (map[key] !== "pending") map[key] = "done";
        });
        return map;
    }, [baseFiltered]);

    const filtered = useMemo(
        () =>
            baseFiltered.filter((r) => {
                if (selectedDate)
                    return (r.attendanceDate || "").slice(0, 10) === selectedDate;
                if (month) {
                    const d = new Date(r.attendanceDate);
                    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                    if (m !== month) return false;
                }
                return true;
            }),
        [baseFiltered, selectedDate, month]
    );

    // ===== Lịch tháng + điều hướng ngày =====
    const calTitle = useMemo(() => {
        const [yy, mm] = calMonth.split("-").map(Number);
        return new Date(yy, mm - 1, 1).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
    }, [calMonth]);

    const calCells = useMemo(() => {
        const [yy, mm] = calMonth.split("-").map(Number);
        const startDow = (new Date(yy, mm - 1, 1).getDay() + 6) % 7; // T2 = 0
        const cells = Array(startDow).fill(null);
        for (let d = 1; d <= new Date(yy, mm, 0).getDate(); d++)
            cells.push(`${yy}-${String(mm).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
        return cells;
    }, [calMonth]);

    const shiftCalMonth = (n) => {
        const [yy, mm] = calMonth.split("-").map(Number);
        const d = new Date(yy, mm - 1 + n, 1);
        setCalMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    };

    // Bấm ngày trong lịch (bấm lần nữa bỏ chọn)
    const selectDay = (key) => {
        setSelectedDate((prev) => (prev === key ? "" : key));
        setMonth("");
    };

    // Chuyển ngày qua lại (‹ › trên thanh "Xem ngày")
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
""", "3. filtered + dayStatus + calendar")

# 4) month input: chọn tháng thì bỏ lọc ngày (tránh chồng bộ lọc)
s = rep(s,
"""                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                />
""",
"""                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => {
                                        setMonth(e.target.value);
                                        setSelectedDate("");
                                    }}
                                />
""", "4. month input sync")

# 5) exportMonth: xuất đúng ngày nếu đang chọn ngày
s = rep(s,
"""        const target = month
            ? filtered
            : filtered.filter((r) => {
                  const d = new Date(r.attendanceDate);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              });
""",
"""        const target =
            selectedDate || month
                ? filtered
                : filtered.filter((r) => {
                      const d = new Date(r.attendanceDate);
                      const now = new Date();
                      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  });
""", "5. export target")

s = rep(s,
"""            `cham-cong-${month || new Date().toISOString().slice(0, 7)}.csv`,
""",
"""            selectedDate
                ? `cham-cong-${selectedDate}.csv`
                : `cham-cong-${month || new Date().toISOString().slice(0, 7)}.csv`,
""", "5b. export filename")

# 6) chèn lịch + thanh xem ngày (giữa KPI và section)
s = rep(s,
"""                        <div className="attendance-history-summary">
                            <div><span>Quân số</span><strong>{kpi.workforce}</strong></div>
                            <div><span>Đã vào ca hôm nay</span><strong>{kpi.checkedInToday}</strong></div>
                            <div><span>Đang trong ca</span><strong>{kpi.onShiftToday}</strong></div>
                            <div><span>Đã ra ca hôm nay</span><strong>{kpi.checkedOutToday}</strong></div>
                            <div><span>Vắng hôm nay</span><strong>{kpi.absentToday}</strong></div>
                        </div>

                        <section className="att-card">
""",
"""                        <div className="attendance-history-summary">
                            <div><span>Quân số</span><strong>{kpi.workforce}</strong></div>
                            <div><span>Đã vào ca hôm nay</span><strong>{kpi.checkedInToday}</strong></div>
                            <div><span>Đang trong ca</span><strong>{kpi.onShiftToday}</strong></div>
                            <div><span>Đã ra ca hôm nay</span><strong>{kpi.checkedOutToday}</strong></div>
                            <div><span>Vắng hôm nay</span><strong>{kpi.absentToday}</strong></div>
                        </div>

                        <div className="att-cal-strip">
                            <div className="att-cal">
                                <div className="att-cal-head">
                                    <button type="button" className="att-cal-nav" onClick={() => shiftCalMonth(-1)} aria-label="Tháng trước">‹</button>
                                    <span className="att-cal-title">{calTitle}</span>
                                    <button type="button" className="att-cal-nav" onClick={() => shiftCalMonth(1)} aria-label="Tháng sau">›</button>
                                    <button type="button" className="att-cal-today" onClick={clearDay}>Hôm nay</button>
                                </div>
                                <div className="att-cal-wk">
                                    <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>CC</span><span>T7</span>
                                </div>
                                <div className="att-cal-grid">
                                    {calCells.map((key, i) =>
                                        key === null ? (
                                            <span key={`blank-${i}`} className="att-cal-day att-cal-day--blank" />
                                        ) : (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`att-cal-day${dayStatus[key] ? ` att-cal-day--${dayStatus[key]}` : ""}${selectedDate === key ? " att-cal-day--selected" : ""}`}
                                                onClick={() => selectDay(key)}
                                                title={
                                                    dayStatus[key] === "pending"
                                                        ? "Còn bản ghi chờ duyệt"
                                                        : dayStatus[key] === "done"
                                                        ? "Đã xử lý hết"
                                                        : "Không có bản ghi"
                                                }
                                            >
                                                {Number(key.slice(8))}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="att-cal-side">
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
                        </div>

                        <section className="att-card">
""", "6. calendar strip")

# 7) header: gom cột DUYỆT (xóa cột hành động rỗng)
s = rep(s,
"""                                            <th>Duyệt</th>
                                            <th />
""",
"""                                            <th className="att-col-approval">Duyệt</th>
""", "7. thead")

s = rep(s,
"""                                                <td colSpan={9}>
""",
"""                                                <td colSpan={8}>
""", "7b. colspan")

# 8) row: gom badge + nút vào 1 ô DUYỆT
s = rep(s,
"""                                                    <td>
                                                        <span
                                                            className={`att-badge ${approvalClass(row.approvalStatus)}`}
                                                        >
                                                            {approvalLabel(row.approvalStatus)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="admin-row-actions">
                                                            {row.approvalStatus === 0 && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-link-btn"
                                                                        onClick={() => approve(row, true)}
                                                                    >
                                                                        Duyệt
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-link-btn admin-link-btn--danger"
                                                                        onClick={() => approve(row, false)}
                                                                    >
                                                                        Từ chối
                                                                    </button>
                                                                </>
                                                            )}
                                                            {row.approvalStatus !== 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="admin-link-btn"
                                                                    onClick={() => {
                                                                        setEditRow(row);
                                                                        setModalOpen(true);
                                                                    }}
                                                                >
                                                                    Sửa
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
""",
"""                                                    <td>
                                                        <div className="att-approval-cell">
                                                            <span
                                                                className={`att-badge ${approvalClass(row.approvalStatus)}`}
                                                            >
                                                                {approvalLabel(row.approvalStatus)}
                                                            </span>
                                                            {row.approvalStatus === 0 && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-link-btn admin-link-btn--sm"
                                                                        onClick={() => approve(row, true)}
                                                                    >
                                                                        Duyệt
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-link-btn admin-link-btn--sm admin-link-btn--danger"
                                                                        onClick={() => approve(row, false)}
                                                                    >
                                                                        Từ chối
                                                                    </button>
                                                                </>
                                                            )}
                                                            {row.approvalStatus !== 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="admin-link-btn admin-link-btn--sm"
                                                                    onClick={() => {
                                                                        setEditRow(row);
                                                                        setModalOpen(true);
                                                                    }}
                                                                >
                                                                    Sửa
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
""", "8. approval cell")

save(PAGE, s)

# ================= CSS (admin.css) =================
c = load(CSS)
extra = """
/* ===== Lịch sử & duyệt công: lịch tháng + cột DUYỆT gộp nút ===== */
.att-cal-strip {
    display: flex;
    gap: 14px;
    align-items: stretch;
    flex-wrap: wrap;
    margin: 0 0 16px;
}

.att-cal {
    width: 330px;
    flex: 0 0 auto;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 10px;
    padding: 12px 14px;
}

.att-cal-head {
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
}

.att-cal-nav {
    width: 26px;
    height: 26px;
    border: 1px solid #d1d5db;
    border-radius: 7px;
    background: #fff;
    color: #38506a;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
}
.att-cal-nav:hover { border-color: #005b94; color: #005b94; }

.att-cal-today {
    border: 1px solid #d1d5db;
    border-radius: 7px;
    background: #fff;
    padding: 4px 9px;
    font-size: 11px;
    font-weight: 600;
    color: #38506a;
    cursor: pointer;
}
.att-cal-today:hover { border-color: #005b94; color: #005b94; }

.att-cal-wk {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding-bottom: 4px;
    font-size: 10px;
    font-weight: 700;
    color: #9aa9b8;
    text-align: center;
}

.att-cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
}

.att-cal-day {
    position: relative;
    min-width: 0;
    height: 30px;
    display: grid;
    place-items: center;
    border: 1px solid transparent;
    border-radius: 7px;
    background: #fff;
    font-size: 12px;
    font-weight: 500;
    color: #182a3a;
    cursor: pointer;
}
.att-cal-day:hover { border-color: #005b94; color: #005b94; }
.att-cal-day--blank { visibility: hidden; cursor: default; }

/* Ngày còn bản ghi chờ duyệt = ĐỎ */
.att-cal-day--pending {
    background: #fee2e2;
    color: #b42323;
    font-weight: 700;
}
.att-cal-day--pending::after {
    content: "";
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #dc2626;
}

/* Ngày đã xử lý hết = XANH */
.att-cal-day--done {
    background: #dcfce7;
    color: #15803d;
    font-weight: 700;
}

.att-cal-day--selected {
    background: #005b94;
    color: #fff;
    border-color: #005b94;
    box-shadow: 0 0 0 2px rgba(0, 91, 148, 0.15);
}
.att-cal-day--selected:hover { border-color: #0e1a26; color: #fff; }
.att-cal-day--selected::after { background: #fff; }

.att-cal-side {
    flex: 1;
    min-width: 240px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
}

.att-cal-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: #5a6b7b;
}
.att-cal-legend .att-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    margin-right: 5px;
    vertical-align: -1px;
}
.att-dot--pending { background: #fee2e2; border: 1px solid #f3b4b4; }
.att-dot--done { background: #dcfce7; border: 1px solid #b7e4c7; }
.att-dot--none { background: #fff; border: 1px solid #d1d5db; }

/* Thanh "Xem ngày" + chuyển ngày qua lại */
.att-daybar {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1px solid #eef2f6;
    border-radius: 10px;
    padding: 10px 14px;
}
.att-daybar--idle { opacity: 0.9; }
.att-daybar-label {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
    color: #0e1a26;
}
.att-daybar-nav {
    width: 32px;
    height: 32px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    color: #38506a;
    font-size: 15px;
    cursor: pointer;
}
.att-daybar-nav:hover { border-color: #005b94; color: #005b94; }
.att-daybar-clear {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    color: #38506a;
    cursor: pointer;
}
.att-daybar-clear:hover { border-color: #005b94; color: #005b94; }

/* Cột DUYỆT: badge + nút gộp trong 1 ô (nút nhỏ, gọn không gian) */
.att-col-approval { text-align: right; }
.att-approval-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 6px;
}
.att-approval-cell .admin-link-btn--sm {
    min-height: 0;
    padding: 3px 9px;
    font-size: 11px;
    line-height: 1.4;
}

@media (max-width: 900px) {
    .att-cal-strip { flex-direction: column; }
    .att-cal-side { min-width: 0; }
}
"""
c = c + extra
save(CSS, c)
log.append(("css admin", True))

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
