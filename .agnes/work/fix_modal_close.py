import io

base = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src"

def rep(path, old, new, count=None):
    with io.open(path, "r", encoding="utf-8") as f:
        s = f.read()
    n = s.count(old)
    if n < 1:
        print("NOT FOUND:", path)
        return
    limit = count if count else n
    s = s.replace(old, new) if count is None else s.replace(old, new, limit)
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("OK x%d: %s" % (n, path.split("\\")[-1]))

# 1) Modal "Thêm nhân viên": bỏ đóng khi bấm nền (giữ nút Hủy / ×)
rep(base + r"\modules\admin\hr\components\HrAddForm.jsx",
    '<div className="hrf-modal-backdrop" onClick={onCancel}>',
    '<div className="hrf-modal-backdrop">')

# 2) Modal nghỉ phép (tạo đơn + chi tiết): bỏ ngoài-click-đóng
rep(base + r"\modules\leave\pages\LeavePage.jsx",
    '<div className="leave-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>',
    '<div className="leave-modal-backdrop">', 2)

# 3) HrPage.jsx: modal xem chi tiết nhân viên — giữ nguyên đóng khi bấm ngoài
# (đây là modal "chi tiết" read-only, không có input đang nhập)
