import io

base = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src"

def rep(path, old, new):
    with io.open(path, "r", encoding="utf-8") as f:
        s = f.read()
    if old not in s:
        print("NOT FOUND:", path)
        return
    s = s.replace(old, new)
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("OK:", path.split("\\")[-1])

# Form Thêm/Sửa bản ghi chấm công: bỏ đóng khi bấm nền (đã có nút Hủy)
rep(base + r"\modules\admin\attendance\components\AttendanceFormModal.jsx",
    '<div className="att-guide-overlay" onClick={onClose}>',
    '<div className="att-guide-overlay">')

# Form Đổi mật khẩu: bỏ đóng khi bấm nền (đóng bằng submit hoặc Hủy nếu có)
rep(base + r"\components\layout\ChangePasswordModal.jsx",
    '<div className="att-guide-overlay" onClick={onClose}>',
    '<div className="att-guide-overlay">')
