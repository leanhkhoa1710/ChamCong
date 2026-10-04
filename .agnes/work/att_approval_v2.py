# -*- coding: utf-8 -*-
"""1) th DUYỆT can giua (fix specificity voi .att-table th)
2) Nhuan "Tu choi" -> "Da tu choi" (labels.js) + bo nut Sua canh "da tu choi"."""
import io

BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules"
PAGE = BASE + r"\admin\attendance\pages\AdminAttendanceHistoryPage.jsx"
CSS  = BASE + r"\admin\admin.css"
LBL  = BASE + r"\admin\attendance\labels.js"

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
    log.append((label, False)); print("   MISS [" + label + "]: " + repr(old[:90]))
    return s

# ================= labels.js: "Tu choi" -> "Da tu choi" =================
s = load(LBL)
s = rep(s,
"export const approvalLabel = (s) =>\n    ({ 0: \"Chờ duyệt\", 1: \"Đã duyệt\", 2: \"Từ chối\" })[s] ?? \"Chờ duyệt\";",
"export const approvalLabel = (s) =>\n    ({ 0: \"Chờ duyệt\", 1: \"Đã duyệt\", 2: \"Đã từ chối\" })[s] ?? \"Chờ duyệt\";",
"1. label")
save(LBL, s)

# ================= PAGE: bo nut Sua o dong da tu choi =================
s = load(PAGE)
old = """                                                            ) : (
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
                                                            )}"""
new = """                                                            ) : (
                                                                <span
                                                                    className={`att-badge ${approvalClass(row.approvalStatus)}`}
                                                                >
                                                                    {approvalLabel(row.approvalStatus)}
                                                                </span>
                                                            )}"""
s = rep(s, old, new, "2. remove sua button")
save(PAGE, s)

s = rep(s,
"""<th className="att-col-approval">Duyệt</th>""",
"""<th className="att-col-approval">Duyệt</th>""",
"2b. check th class")
# th trong page HAI TRANG: them class vao th cu (khong co class) neu chua co
s = rep(s,
"""                                            <th>Duyệt</th>
""",
"""                                            <th className="att-col-approval">Duyệt</th>
""",
"2c. add class to th")
save(PAGE, s)

# ================= CSS: th can giua (specificity cao hon .att-table th) =================
c = load(CSS)
c = rep(c,
""".att-col-approval { text-align: center; }""",
"""/* Can giua th + td cot DUYET (phai danh th chinh de thang .att-table th) */
.att-table th.att-col-approval,
.att-table td.att-col-approval {
    text-align: center;
}""",
"3. th center")
save(CSS, c)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
