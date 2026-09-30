import io

base = r"D:\My Project\M-BE\Marixa-ChamCong"

# 1) ApplicationUser: thêm property EmployeeId (cột đã tồn tại trong DB)
p1 = base + r"\M.Contract.Repositories\AuthEntity\ApplicationUser.cs"
with io.open(p1, "r", encoding="utf-8") as f:
    s = f.read()

if "EmployeeId" not in s:
    old1 = "        public virtual Employee? Employee { get; set; }"
    new1 = """        public virtual Employee? Employee { get; set; }

        // Mã nhân viên liên kết (cột AspNetUsers.EmployeeId, có sẵn từ migration gốc).
        // Được đồng bộ với Employees.UserId khi tạo/cấp tài khoản.
        public Guid? EmployeeId { get; set; }"""
    if old1 in s:
        s = s.replace(old1, new1)
        with io.open(p1, "w", encoding="utf-8", newline="") as f:
            f.write(s)
        print("OK: ApplicationUser.EmployeeId added")
    else:
        print("NOT FOUND: anchor in ApplicationUser.cs")
else:
    print("SKIP: already has EmployeeId")

# 2) AuthService.EnsureUserForAsync: đồng bộ EmployeeId + PhoneNumber
p2 = base + r"\M.Services\Services\Account\AuthService.cs"
with io.open(p2, "r", encoding="utf-8") as f:
    s = f.read()

old2 = """            employee.UserId = user.Id;
        }"""
new2 = """            // Đồng bộ quan hệ user <-> employee ở CẢ 2 phía:
            // - Employees.UserId (chính)
            // - AspNetUsers.EmployeeId (cột tương ứng)
            // - Số điện thoại (hỗ trợ đăng nhập linh hoạt)
            employee.UserId = user.Id;
            user.EmployeeId = employee.Id;
            if (!string.IsNullOrWhiteSpace(employee.PhoneNumber))
            {
                user.PhoneNumber = employee.PhoneNumber;
            }
        }"""

if old2 in s:
    s = s.replace(old2, new2)
    with io.open(p2, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("OK: EnsureUserForAsync synced")
else:
    print("NOT FOUND: EnsureUserForAsync anchor")
