import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\attendance\attendance.css"
with io.open(p, "r", encoding="utf-8") as f:
    s = f.read()

anchor = """.att-guide-close {
    margin-top: 22px;
    width: 100%;
    padding: 12px;
    background: #0e1a26;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
}"""

addition = """.att-guide-close {
    margin-top: 22px;
    width: 100%;
    padding: 12px;
    background: #0e1a26;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
}

/* Header row: tiêu đề + nút × (cho modal Đổi mật khẩu) */
.att-guide-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}

.att-head-close {
    flex: none;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    color: #64748b;
    border: none;
    border-radius: 8px;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
}

.att-head-close:hover {
    background: #f1f5f9;
    color: #0e1a26;
}"""

if anchor in s:
    s = s.replace(anchor, addition)
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("OK CSS added")
else:
    print("ANCHOR NOT FOUND")
