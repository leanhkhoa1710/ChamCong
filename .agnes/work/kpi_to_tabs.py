# -*- coding: utf-8 -*-
"""KPI cards -> 2 tab filter nhỏ (cùng hàng tab Đang làm / Lưu trữ, trên thanh tìm kiếm).
- Bỏ hoàn toàn 2 card KPI (HrKpiCards)
- Thêm 2 tab: "Hợp đồng (n)" và "Đủ lương (n)" - nhấn lọc bảng, nhấn lại bỏ lọc
- Bỏ chip KPI trong HrFilterBar (nhấn lại tab là đủ để bỏ lọc)
- Xoá CSS card-click + chip không dùng nữa
"""
import io, re, os

BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr"

def load(p):
    with io.open(p, "r", encoding="utf-8") as f:
        return f.read()

def save(p, s):
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)

# =========================================================
# 1) HrPage.jsx
# =========================================================
p = BASE + "\\pages\\HrPage.jsx"
s = load(p)
log = []

# 1.1 bỏ import HrKpiCards
s, n = re.subn(r'[ \t]*import HrKpiCards from "\.\./components/HrKpiCards";\n', '', s)
log.append(("1.1 import", n == 1))

# 1.2 bỏ khối <HrKpiCards ... />
s, n = re.subn(r'\n[ \t]*<HrKpiCards\b[\s\S]*?/>\n', '\n', s)
log.append(("1.2 kpi block", n == 1))

# 1.3 bỏ biến kpiLabel (chip đã bỏ, không cần label nữa)
s, n = re.subn(r'\n[ \t]*const kpiLabel =\n[\s\S]*?: null;\n', '\n', s)
log.append(("1.3 kpiLabel var", n == 1))

# 1.4 bỏ 2 props kpiLabel/onClearKpi trong gọi HrFilterBar
s, n1 = re.subn(r'[ \t]*kpiLabel=\{kpiLabel\}\n', '', s)
s, n2 = re.subn(r'[ \t]*onClearKpi=\{setters\.clearKpiGroup\}\n', '', s)
log.append(("1.4 filterbar props", n1 == 1 and n2 == 1))

# 1.5 chèn 2 tab KPI sau nút "Lưu trữ – đã nghỉ"
anchor = 'onClick={() => setTab("archive")}'
i = s.index(anchor)
j = s.index("</button>", i) + len("</button>")
new_tabs = (
    '\n'
    '                                <span className="hr-tab-sep" aria-hidden="true"></span>\n'
    '                                <button\n'
    '                                    type="button"\n'
    '                                    className={`hr-tab hr-tab--kpi${kpiGroup === "noContract" ? " active" : ""}`}\n'
    '                                    onClick={() => toggleKpi("noContract")}\n'
    '                                    title="Lọc nhân viên chưa có hợp đồng / chưa nhập ngày hết hạn - nhấn lại để bỏ lọc"\n'
    '                                >\n'
    '                                    📄 Hợp đồng ({kpis.noContractEnd})\n'
    '                                </button>\n'
    '                                <button\n'
    '                                    type="button"\n'
    '                                    className={`hr-tab hr-tab--kpi${kpiGroup === "payroll" ? " active" : ""}`}\n'
    '                                    onClick={() => toggleKpi("payroll")}\n'
    '                                    title="Lọc nhân viên đã có bảng lương (hồ sơ đủ tính lương) - nhấn lại để bỏ lọc"\n'
    '                                >\n'
    '                                    💰 Đủ lương ({kpis.readyForPayroll})\n'
    '                                </button>'
)
s = s[:j] + new_tabs + s[j:]
log.append(("1.5 insert kpi tabs", True))

# 1.6 chuyển tab Lưu trữ -> tự bỏ lọc KPI (KPI chỉ tính trên NV đang làm)
s, n = re.subn(
    'onClick={() => setTab("archive")}',
    'onClick={() => { setTab("archive"); setters.clearKpiGroup(); }}', s)
log.append(("1.6 archive clears kpi", n == 1))

save(p, s)

# =========================================================
# 2) HrFilterBar.jsx
# =========================================================
p = BASE + "\\components\\HrFilterBar.jsx"
s = load(p)

s, n1 = re.subn(r'[ \t]*kpiLabel,\n', '', s)
s, n2 = re.subn(r'[ \t]*onClearKpi,\n', '', s)
log.append(("2.1 props", n1 == 1 and n2 == 1))

s, n3 = re.subn(r'\n {16}\{kpiLabel && \([\s\S]*?\)\}\n', '\n', s)
log.append(("2.2 chip block", n3 == 1))

save(p, s)

# =========================================================
# 3) hr.css
# =========================================================
p = BASE + "\\hr.css"
s = load(p)

# 3.1 thêm style tab KPI + separator (gắn sau .hr-tab.active)
m = re.search(r'\.hr-tab\.active \{[^}]*\}\n', s)
if m:
    extra = (
        "\n"
        "/* Separator + tab filter KPI (Hợp đồng / Đủ lương - cùng hàng tab Đang làm / Lưu trữ) */\n"
        ".hr-tab-sep {\n"
        "    width: 1px;\n"
        "    align-self: stretch;\n"
        "    margin: 0 2px;\n"
        "    background: #d1d5db;\n"
        "}\n"
        "\n"
        ".hr-tab--kpi {\n"
        "    font-size: 13px;\n"
        "    padding: 7px 12px;\n"
        "}\n"
    )
    s = s[:m.end()] + extra + s[m.end():]
    log.append(("3.1 tab styles", True))
else:
    log.append(("3.1 tab styles", False))

# 3.2 xoá khối CSS card-click + chip (không còn dùng)
s, n = re.subn(r'\n/\* Thẻ KPI là nút lọc[\s\S]*?\.hr-kpi-chip \{[^}]*\}\n', '\n', s)
log.append(("3.2 cleanup old css", n == 1))
s = re.sub(r'\n{3,}', '\n\n', s)

save(p, s)

# =========================================================
# 4) Xoá component HrKpiCards (không còn ai dùng)
# =========================================================
target = BASE + "\\components\\HrKpiCards.jsx"
if os.path.exists(target):
    # verify không ai import nữa
    hits = []
    for root, _dirs, files in os.walk(r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src"):
        for f in files:
            if f.endswith((".jsx", ".js")):
                fp = os.path.join(root, f)
                if fp == target:
                    continue
                with io.open(fp, "r", encoding="utf-8") as fh:
                    if "HrKpiCards" in fh.read():
                        hits.append(fp)
    if hits:
        log.append(("4. delete HrKpiCards", "VIETED: " + str(hits)))
    else:
        os.remove(target)
        log.append(("4. delete HrKpiCards", True))

for name, ok in log:
    print(f"[{name}] {'OK' if ok else 'FAIL'}")
print("DONE")
