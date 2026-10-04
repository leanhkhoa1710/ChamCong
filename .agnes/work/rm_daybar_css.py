# -*- coding: utf-8 -*-
import io, re

CSS = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\admin.css"
with io.open(CSS, "r", encoding="utf-8") as f:
    c = f.read()

# 1) Xoa comment "Thanh Xem ngay" + toan bo cac rule .att-daybar*
c, n1 = re.subn(r'/\* Thanh "Xem ngày".*?\n(?=/\*)', '', c, flags=re.S)
print("daybar block:", "XOA" if n1 else "KHONG TIM THAY")

# 2) Dan sat rong trongg
c = re.sub(r"\n{3,}", "\n\n", c)

with io.open(CSS, "w", encoding="utf-8", newline="") as f:
    f.write(c)

# Verify
with io.open(CSS, "r", encoding="utf-8") as f:
    c2 = f.read()
print("att-daybar con lai:", c2.count("att-daybar"))
print("att-cal-actions ton tai:", "att-cal-actions" in c2)
print("DONE")
