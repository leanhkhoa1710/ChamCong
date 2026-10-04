# -*- coding: utf-8 -*-
"""Boi dat khoc .att-cal-head thanh flex space-between (doi dung theo dong,
khong phuo thuoc vao chu comment)."""
import io

CSS = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\admin.css"
with io.open(CSS, "r", encoding="utf-8") as f:
    lines = f.readlines()

start = None
for i, ln in enumerate(lines):
    if ln.strip() == ".att-cal-head {":
        start = i
        break
assert start is not None, "khong tim thay .att-cal-head"

# Xoa luot comment "Grid 3 cot..." (dong truoc .att-cal-head) neu co
if start >= 1 and lines[start - 1].lstrip().startswith("/*") and "Grid 3 cot" in lines[start - 1]:
    del lines[start - 1]
    start -= 1

# Tim nut dong ket "}"
depth = 0
end = None
for j in range(start, len(lines)):
    depth += lines[j].count("{") - lines[j].count("}")
    if lines[j].strip() == "}" and depth == 0:
        end = j
        break
assert end is not None, "khong tim thay nut ket"

new_block = [
    ".att-cal-head {\n",
    "    display: flex;\n",
    "    align-items: center;\n",
    "    justify-content: space-between;\n",
    "    gap: 8px;\n",
    "    margin-bottom: 8px;\n",
    "}\n",
]

lines[start:end + 1] = new_block

import re
text = "".join(lines)
text = re.sub(r"\n{3,}", "\n\n", text)

with io.open(CSS, "w", encoding="utf-8", newline="") as f:
    f.write(text)

print("OK - .att-cal-head -> flex space-between (grid 3 cot da bo)")
