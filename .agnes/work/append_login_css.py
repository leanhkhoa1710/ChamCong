import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\login\login.css"

css = """
/* === Kích hoạt tài khoản (/kich-hoat) === */
.activate-form .activate-hint {
    margin: 6px 0 0;
    font-size: 12px;
    color: #8a99a8;
    line-height: 1.5;
}

.activate-rules {
    list-style: none;
    margin: 4px 0 18px;
    padding: 12px 14px;
    background: #f6f7f9;
    border: 1px solid #e8edf2;
    border-radius: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 14px;
}

.activate-rules li {
    font-size: 12px;
    color: #8a99a8;
}

.activate-rules li.done {
    color: #15803d;
    font-weight: 600;
}

.activate-mismatch {
    margin: 6px 0 0;
    font-size: 12px;
    color: #b42323;
}
"""

with io.open(p, "a", encoding="utf-8", newline="") as f:
    f.write(css)
print("OK - appended")
