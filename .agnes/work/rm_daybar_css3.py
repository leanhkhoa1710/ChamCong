# -*- coding: utf-8 -*-
import io, re

CSS = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\admin.css"
with io.open(CSS, "r", encoding="utf-8") as f:
    c = f.read()

before = c.count("att-daybar")

# Xoa tu comment "Highlight" (daybar) den ngay truoc comment "Cot DUYET: th + td"
# (giu lai luot th/td + .att-approval-cell)
pattern = re.compile(
    r'/\* Highlight.*?(?=/\* Cột DUYỆT: th \+ td)', re.S
)
c2, n = pattern.subn('', c)
print("khoc daybar xoa:", n, "| truoc:", before, "sau:", c2.count("att-daybar"))

# Dat rong trongg
c2 = re.sub(r"\n{3,}", "\n\n", c2)

with io.open(CSS, "w", encoding="utf-8", newline="") as f:
    f.write(c2)

with io.open(CSS, "r", encoding="utf-8") as f:
    c3 = f.read()
print("att-daybar con lai:", c3.count("att-daybar"))
print("att-approval-cell co:", "att-approval-cell" in c3)
print("DONE")
