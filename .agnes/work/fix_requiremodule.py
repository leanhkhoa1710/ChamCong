import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\components\common\RequireModule.jsx"
with io.open(p, "r", encoding="utf-8") as f:
    s = f.read()

nl = "\r\n" if "\r\n" in s else "\n"

old = ("// Bọc route theo quyền module: thiếu quyền -> chuyển về /attendance." + nl
       + "const RequireModule = ({ to, children }) =>" + nl
       + "    canAccessModule(to) ? children : <Navigate to=\"/attendance\" replace />;")

new = ("// Bọc route theo quyền module: thiếu quyền -> chuyển tới trang 403" + nl
       + "// (khu vực bạn không có quyền). Tài khoản Admin vẫn vào được mọi" + nl
       + "// module vì canAccessModule luôn trả true với role \"Admin\"." + nl
       + "const RequireModule = ({ to, children }) =>" + nl
       + "    canAccessModule(to) ? children : <Navigate to=\"/unauthorized\" replace />;")

if old in s:
    s = s.replace(old, new)
    print("OK replace")
else:
    print("NOT FOUND")

with io.open(p, "w", encoding="utf-8", newline="") as f:
    f.write(s)
print("DONE")
