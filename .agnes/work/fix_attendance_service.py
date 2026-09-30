import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\M.Services\Services\AttendanceService.cs"
with io.open(p, "r", encoding="utf-8") as f:
    s = f.read()

old = """            IQueryable<Attendance> query = repo.Entities
                .Where(x => !x.DeletedTime.HasValue)
                .Include(x => x.Employee)
                .Include(x => x.PlannedShift)
                .Include(x => x.Approver)
                .OrderBy(x => x.CreatedTime);"""

new = """            IQueryable<Attendance> query = repo.Entities
                .Where(x => !x.DeletedTime.HasValue)
                .Include(x => x.Employee)
                .Include(x => x.PlannedShift)
                .Include(x => x.Approver)
                // Đồng bộ với ByEmployeeIdAsync: giờ vào/ra (CheckInTime/
                // CheckOutTime) được mapping từ AttendanceLogs, nếu thiếu
                // Include thì các trang dùng get-all (admin) hiện "— —".
                .Include(x => x.AttendanceLogs)
                .OrderBy(x => x.CreatedTime);"""

if old in s:
    s = s.replace(old, new)
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("OK: Include AttendanceLogs added to GetAllAsync")
else:
    print("NOT FOUND")
