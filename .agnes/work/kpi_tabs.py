# -*- coding: utf-8 -*-
"""Bỏ 2 card KPI -> 2 tab filter nhỏ trên thanh tìm kiếm (HrPage)."""
import io, re

def load(p):
    with io.open(p, "r", encoding="utf-8") as f:
        return f.read()

def save(p, s):
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)

BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr"

# ================= 1) HrPage.jsx =================
p = BASE + "\\pages\\HrPage.jsx"
s = load(p)

# 1.1 bỏ import HrKpiCards
s2, n1 = re.subn(r'[ \t]*import HrKpiCards from "\.\./components/HrKpiCards";\n', '', s)
print("1.1 import:", "OK" if n1 else "NOT FOUND")
s = s2

# 1.2 bỏ khối <HrKpiCards ... />
s2, n2 = re.subn(r'\n[ \t]*<HrKpiCards\b.*?/>\n', '', s, flags=re.S)
print("1.2 kpi block:", "OK" if n2 else "NOT FOUND")
s = s2

# 1.3 bỏ biến kpiLabel (không còn dùng)
s2, n3 = re.subn(r'\n[ \t]*const kpiLabel =\n.*?: null;\n', '', s, flags=re.S)
print("1.3 kpiLabel var:", "OK" if n3 else "NOT FOUND")
s = s2

# 1.4 bỏ 2 props kpiLabel/onClearKpi ở gọi HrFilterBar
s2 = s.replace("                            kpiLabel={kpiLabel}\n", "")
s2 = s2.replace("                            onClearKpi={setters.clearKpiGroup}\n", "")
print("1.4 filterbar props:", "OK" if s2 != s else "NOT FOUND")
s = s2

# 1.5 tab archive tự clear KPI group khi chuyển tab
s2, n5 = re.subn(
    r'onClick=\{\(\) => setTab\("archive"\)\}',
    'onClick={() => { setTab("archive"); setters.clearKpiGroup(); }}', s)
print("1.5 archive clear:", "OK" if n5 else "NOT FOUND")
s = s2

# 1.6 chèn 2 tab KPI ngay sau tab "Lưu trữ – đã nghỉ"
anchor = "Lưu trữ – đã nghỉ ({resigned.length})"
idx = s.find(anchor)
if idx < 0:
    print("1.6 anchor: NOT FOUND")
else:
    end = s.find("</button>", idx)
    end = s.find("\n", end) + 1  # hết dòng </button>
    # dòng tiếp theo là "                            </div>" (đóng hr-tabs)
    close_div = s.find("</div>", end)
    indent = "                                "
    new_tabs = (
        "\n" + indent + "<span className=\"hr-tab-sep\" aria-hidden=\"true\"></span>\n"
        + indent + "<button\n"
        + indent + "    type=\"button\"\n"
        + indent + "    className={`hr-tab hr-tab--kpi${kpiGroup === \"noContract\" ? \" active\" : \"\"}`}\n"
        + indent + "    onClick={() => toggleKpi(\"noContract\")}\n"
        + indent + "    title=\"Lọc nhân viên chưa có hợp đồng / chưa nhập ngày hết hạn - nhấn lại để bỏ lọc\"\n"
        + indent + ">\n"
        + indent + "    📄 Hợp đồng (" + "{kpis.noContractEnd})\n"
        + indent + "</button>\n"
        + indent + "<button\n"
        + indent + "    type=\"button\"\n"
        + indent + "    className={`hr-tab hr-tab--kpi${kpiGroup === \"payroll\" ? \" active\" : \"\"}`}\n"
        + indent + "    onClick={() => toggleKpi(\"payroll\")}\n"
        + indent + "    title=\"Lọc nhân viên đã có bảng lương - nhấn lại để bỏ lọc\"\n"
        + indent + ">\n"
        + indent + "    💰 Đủ lương (" + "{kpis.readyForPayroll})\n"
        + indent + "</button>"
    )
    s = s[:end] + new_tabs + s[end:]
    print("1.6 insert kpi tabs: OK")

save(p, s)

# ================= 2) HrFilterBar.jsx =================
p = BASE + "\\components\\HrFilterBar.jsx"
s = load(p)

s2, a = re.subn(r'[ \t]*kpiLabel,\n', '', s)
s3, b = re.subn(r'[ \t]*onClearKpi,\n', s2)
print("2.1 props:", "OK" if (a and b) else f"NOT FOUND a={a} b={b}")
s = s3

s2, c = re.subn(r'\n[ \t]*\{kpiLabel && \(.*?\}\)\n', '', s, flags=re.S)
print("2.2 chip block:", "OK" if c else "NOT FOUND (có thể đã khác)")
if c:
    s = s2
save(p, s)

# ================= 3) hr.css =================
p = BASE + "\\hr.css"
s = load(p)

# 3.1 thêm style tab KPI + separator sau khối .hr-tab.active
m = re.search(r'\.hr-tab\.active \{[^}]*\}', s)
if m:
    insert_at = m.end()
    extra = (
        "\n\n"
        "/* Tab filter KPI (nhỏ, cùng hàng tab Đang làm / Lưu trữ) */\n"
        ".hr-tab-sep {\n"
        "    width: 1px;\n"
        "    align-self: stretch;\n"
        "    margin: 2px 4px 2px 8px;\n"
        "    background: #d1d5db;\n"
        "}\n\n"
        ".hr-tab--kpi {\n"
        "    font-size: 13px;\n"
        "    padding: 8px 12px;\n"
        "}\n"
    )
    s = s[:insert_at] + extra + s[insert_at:]
    print("3.1 tab styles: OK")
else:
    print("3.1 tab styles: ANCHOR NOT FOUND")

# 3.2 xóa khối style card-click/chip không dùng nữa (chèn ở lượt trước)
start = s.find("/* Thẻ KPI là nút lọc")
end_marker = "white-space: nowrap;\n}\n"
end = s.find(end_marker, start) if start >= 0 else -1
if start >= 0 and end > start:
    s = s[:start] + s[end + len(end_marker):]
    print("3.2 cleanup old kpi css: OK")
else:
    print("3.2 cleanup: skip (không thấy khối cũ)")
# loại bỏ khoảng trắng thừa liên tiếp
s = re.sub(r'\n{3,}', '\n\n', s)
save(p, s)
print("DONE")
