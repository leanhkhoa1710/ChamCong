# -*- coding: utf-8 -*-
import io

BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules"
CSS = BASE + r"\admin\admin.css"
HT = BASE + r"\attendance\components\HistoryTable.jsx"

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
    return s

# 1) CSS: th+td cot DUYET can giua (specificity thang .att-table th)
c = load(CSS)
c = rep(c,
""".att-col-approval { text-align: center; }""",
"""/* Cot DUYET: th + td can giua (specificity cao hon .att-table th/td) */
.att-table th.att-col-approval,
.att-table td.att-col-approval {
    text-align: center;
}""",
"1. css th/td center")
save(CSS, c)

# 2) HistoryTable: dong bo nhan "Da tu choi"
s = load(HT)
s = rep(s,
"({ 0: \"Chờ duyệt\", 1: \"Đã duyệt\", 2: \"Từ chối\" })[s] ?? \"Chờ duyệt\";",
"({ 0: \"Chờ duyệt\", 1: \"Đã duyệt\", 2: \"Đã từ chối\" })[s] ?? \"Chờ duyệt\";",
"2. HistoryTable label")
save(HT, s)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
