# -*- coding: utf-8 -*-
"""Cot DUYET: can giua + bo badge 'Cho duyet' + nut Duyen mau nau vang."""
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
    log.append((label, False)); print("   MISS [" + label + "]: " + repr(old[:80]))
    return s

# ================= PAGE: thay cell approval =================
s = load(PAGE)

old_cell = """                                                    <td>
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
"""

new_cell = """                                                    <td>
                                                        <div className="att-approval-cell">
                                                            {row.approvalStatus === 0 ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-link-btn admin-link-btn--sm admin-link-btn--approve"
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
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span
                                                                        className={`att-badge ${approvalClass(row.approvalStatus)}`}
                                                                    >
                                                                        {approvalLabel(row.approvalStatus)}
                                                                    </span>
                                                                    {row.approvalStatus === 2 && (
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
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
"""

s = rep(s, old_cell, new_cell, "cell approval")
save(PAGE, s)

# ================= CSS: căn giữa + nút Duyệt nâu vàng =================
c = load(CSS)

c = rep(c,
""".att-col-approval { text-align: right; }
.att-approval-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 6px;
}""",
""".att-col-approval { text-align: center; }
.att-approval-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
}

/* Nút "Duyệt" - màu nâu vàng, thay cho badge "Chờ duyệt" */
.admin-link-btn--approve {
    background: #fff4dc;
    border: 1px solid #f0d8ae;
    color: #8a5a0a;
}
.admin-link-btn--approve:hover {
    background: #f5e2b8;
    border-color: #d8a849;
    color: #704600;
}""",
"css center + amber")
save(CSS, c)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
