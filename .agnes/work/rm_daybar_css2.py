# -*- coding: utf-8 -*-
import io

CSS = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\admin.css"
with io.open(CSS, "r", encoding="utf-8") as f:
    lines = f.readlines()

# muc: tu comment "Highlight phan dang xem" (trước .att-daybar-label.active)
#   -> den ngay trước comment "Cot DUYET: th + td" (khoc DUYET moi)
start = None
end = None
for i, ln in enumerate(lines):
    if "Highlight" in ln and "dang xem" in ln.replace("đ", "d"):
        # comment dong truoc
        if ln.startswith("/*"):
            start = i
    if start is not None and ".att-daybar-label.active" in ln:
        start = i - 1
        break
if start is None:
    # phuong thuc: tim "att-daybar-label.active" va lay comment truoc
    for i, ln in enumerate(lines):
        if ".att-daybar-label.active" in ln:
            start = i - 1
            break

for i, ln in enumerate(lines):
    if "Cot DUYET: th + td" in ln.replace("Cột", "Cot") or (ln.strip().startswith("/*") and "Cột DUYỆT: th + td" in ln):
        end = i
        break
if end is None:
    for i, ln in enumerate(lines):
        if i > (start or 0) and ln.strip().startswith("/*") and "D" in ln and "th + td" in ln:
            end = i
            break

assert start is not None, "khong tim thay start"
assert end is not None and end > start, "khong tim thay end"

# xoa dong start..end-1
removed = lines[start:end]
newlines = lines[:start] + lines[end:]

# that nao: xoa lan 2 comment DUYET nu? (1 cu + 1 moi) - giu lai comment "th + td can giua" thoi
joined = "".join(newlines)
joined = joined.replace(
    "/* Cột DUYỆT: badge + nút gộp trong 1 ô (nút nhỏ, gọn không gian) */\n"
    "/* Cột DUYỆT: th + td căn giữa (specificity cao hơn .att-table th/td) */\n",
    "/* Cột DUYỆT: th + td căn giữa (specificity cao hơn .att-table th/td) */\n",
)

with io.open(CSS, "w", encoding="utf-8", newline="") as f:
    f.write(joined)

print(f"XOA {end-start} dong (hang {start+1}..{end})")
with io.open(CSS, "r", encoding="utf-8") as f:
    c2 = f.read()
print("att-daybar con lai:", c2.count("att-daybar"))
