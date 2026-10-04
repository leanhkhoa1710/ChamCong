import io

def patch(path, old, new, label):
    with io.open(path, "r", encoding="utf-8") as f:
        s = f.read()
    if old in s:
        s = s.replace(old, new); print(f"[{label}] OK (CRLF)")
    else:
        s = s.replace("\r\n", "\n")
        o = old.replace("\r\n", "\n")
        if o in s:
            s = s.replace(o, new.replace("\r\n", "\n")); print(f"[{label}] OK (LF)")
        else:
            print(f"[{label}] NOT FOUND: {old[:150]}")
            return
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(s)

N = "\r\n"
BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr"

# 1) HrFilterBar: thêm props (chỗ này có showActions)
patch(BASE + "\\components\\HrFilterBar.jsx",
    "    onExport," + N +
    "    onTemplate," + N +
    "    showActions = true," + N +
    "}) => {",
    "    onExport," + N +
    "    onTemplate," + N +
    "    kpiLabel," + N +
    "    onClearKpi," + N +
    "    showActions = true," + N +
    "}) => {",
    "fb-props")

# 2) HrPage: truyền kpiLabel/onClearKpi (chỗ này có showActions={false})
patch(BASE + "\\pages\\HrPage.jsx",
    "                            onTemplate={onTemplate}" + N +
    "                            showActions={false}" + N +
    "                        />",
    "                            onTemplate={onTemplate}" + N +
    "                            kpiLabel={kpiLabel}" + N +
    "                            onClearKpi={setters.clearKpiGroup}" + N +
    "                            showActions={false}" + N +
    "                        />",
    "hp-filterbar")

# 3) hr.css: thêm style (giá trị hiện tại sau merge)
patch(BASE + "\\hr.css",
    ".hr-card--warn {" + N +
    "    background: #f9f3e5;" + N +
    "    border-color: #f0e0bc;" + N +
    "}",
    ".hr-card--warn {" + N +
    "    background: #f9f3e5;" + N +
    "    border-color: #f0e0bc;" + N +
    "}" + N +
    N +
    "/* Thẻ KPI là nút lọc: nhấn để bảng chỉ hiện đúng nhóm NV. */" + N +
    ".hr-card--clickable {" + N +
    "    cursor: pointer;" + N +
    "    font: inherit;" + N +
    "    text-align: left;" + N +
    "    color: inherit;" + N +
    "    transition: border-color 0.15s, box-shadow 0.15s;" + N +
    "}" + N +
    ".hr-card--clickable:hover {" + N +
    "    box-shadow: 0 2px 10px rgba(14, 26, 38, 0.08);" + N +
    "}" + N +
    ".hr-card--active {" + N +
    "    border-color: #005b94;" + N +
    "    box-shadow: 0 0 0 3px rgba(0, 91, 148, 0.14);" + N +
    "}" + N +
    ".hr-kpi-chip {" + N +
    "    border-color: #005b94;" + N +
    "    color: #005b94;" + N +
    "    background: #e3f0ff;" + N +
    "    white-space: nowrap;" + N +
    "}",
    "css")
