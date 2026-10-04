# -*- coding: utf-8 -*-
import io

CSS = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\admin.css"
with io.open(CSS, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Tim dong bat dau (comment "Highlight") va dong ket (comment "Cot DUYET: th + td")
start = None
end = None
for i, ln in enumerate(lines):
    t = ln.strip()
    if t.startswith("/*") and "Highlight" in t:
        start = i
    if start is not None and t.startswith("/*") and "th + td" in t and "specificity" in t:
        end = i
        break

print("start:", start, "end:", end)
assert start is not None and end is not None and end > start, "khong co muc"

removed = lines[start:end]
newlines = lines[:start] + lines[end:]

# Dat rong trongg (3+ dong trongg -> 2)
joined = "".join(newlines)
import re
joined = re.sub(r"\n{3,}", "\n\n", joined)

with io.open(CSS, "w", encoding="utf-8", newline="") as f:
    f.write(joined)

with io.open(CSS, "r", encoding="utf-8") as f:
    c3 = f.read()
print("XOA", end - start, "dong; att-daybar con lai:", c3.count("att-daybar"),
      "| att-approval-cell co:", "att-approval-cell" in c3,
      "| .att-cal-actions co:", "att-cal-actions" in c3)
print("DONE")
