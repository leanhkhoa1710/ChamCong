import io

p = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\login\login.css"

css = """
.activate-success {
    background: #dcfce7;
    border: 1px solid #86efac;
    color: #15803d;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
}

.activate-link {
    margin: 16px 0 0;
    font-size: 13px;
    color: #5a6b7b;
    text-align: center;
}

.activate-link a {
    color: #005b94;
    font-weight: 600;
    text-decoration: none;
}

.activate-link a:hover {
    text-decoration: underline;
}
"""

with io.open(p, "a", encoding="utf-8", newline="") as f:
    f.write(css)
print("OK")
