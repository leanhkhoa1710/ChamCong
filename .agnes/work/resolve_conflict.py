import io, re

p = r"D:\My Project\M-BE\Marixa-ChamCong\M.Services\Services\Account\AuthService.cs"
with io.open(p, "r", encoding="utf-8") as f:
    s = f.read()

pattern = re.compile(
    r"<<<<<<< HEAD\r?\n"
    r"(.*?)\r?\n"
    r"=======\r?\n"
    r"(.*?)\r?\n"
    r">>>>>>> [0-9a-f]+\r?\n",
    re.DOTALL,
)

count = [0]

def repl(m):
    count[0] += 1
    head = m.group(1).rstrip()
    remote = m.group(2).rstrip()
    nl = "\r\n"
    # HEAD: if(employee.UserId==null) { ... } (thiếu } đóng if)
    # Remote: foreach { ... } (thiếu } đóng foreach; } dùng chung sau marker sẽ đóng foreach)
    merged = (
        "            // (1) Đảm bảo nhân viên có tài khoản đăng nhập trước khi cấp mã" + nl
        + head + nl
        + "            }" + nl
        + nl
        + "            // (2) Vô hiệu hóa các mã kích hoạt cũ (chưa dùng, chưa hết hạn)" + nl
        + remote
    )
    return merged

s2, n = pattern.subn(repl, s)
print("replacements:", n)

# Còn marker conflict nào không (kiểm tra đầu dòng)
lines = s2.splitlines()
bad = [i + 1 for i, l in enumerate(lines)
       if l.startswith("<<<<<<<") or l.startswith(">>>>>>>")
       or l.rstrip() == "=======" and len(l) == 7]
print("remaining conflict lines:", bad)

with io.open(p, "w", encoding="utf-8", newline="") as f:
    f.write(s2)
print("DONE")
