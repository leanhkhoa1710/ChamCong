# -*- coding: utf-8 -*-
"""2 tab KPI -> hang chip loc (Tat ca / Dang lam viec / Thu viec / Sap het hop dong /
Chua co hop dong / Thieu ho so / Chua du de tinh luong / Chua du de khai BHXH /
Chua co tai khoan / Da nghi viec / Cham dut) - theo mau anh 2."""
import io, re, os

BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr"

def load(p):
    with io.open(p, "r", encoding="utf-8") as f:
        return f.read()

def save(p, s):
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)

log = []
def rep(s, old, new, label):
    global log
    if old in s:
        log.append((label, True)); return s.replace(old, new)
    o = old.replace("\r\n", "\n"); c = s.replace("\r\n", "\n")
    if o in c:
        log.append((label, True)); return c.replace(o, new.replace("\r\n", "\n"))
    log.append((label, False)); return s

# ================= 1) useHrFilters.js: kpiGroup -> quickChip =================
p = BASE + "\\hooks\\useHrFilters.js"
s = load(p)
s = rep(s,
"""    // Nhóm KPI đang chọn ("none" | "noContract" | "payroll") + tập id khớp.
    const [kpiGroup, setKpiGroup] = useState("none");
    const [kpiIds, setKpiIds] = useState(null);
    const applyKpiGroup = (group, ids) => {
        setKpiGroup(group);
        setKpiIds(ids);
        setStatus("");
    };
    const clearKpiGroup = () => {
        setKpiGroup("none");
        setKpiIds(null);
    };""",
"""    // Chip lọc nhanh: ("all" | key-chip) + tập id NV khớp (null = chip theo trạng thái).
    const [quickChip, setQuickChip] = useState("all");
    const [quickChipIds, setQuickChipIds] = useState(null);
    const applyQuickChip = (key, ids) => {
        setQuickChip(key);
        setQuickChipIds(ids);
        setStatus("");
    };
    const clearQuickChip = () => {
        setQuickChip("all");
        setQuickChipIds(null);
    };""", "1.1 state")

s = rep(s,
"""            if (status && String(e.status) !== status) return false;
            if (kpiGroup !== "none" && !(kpiIds && kpiIds.has(e.id))) return false;
            return true;
        });
    }, [employees, search, department, position, status, kpiGroup, kpiIds]);""",
"""            if (status && String(e.status) !== status) return false;
            if (quickChip !== "all" && !(quickChipIds && quickChipIds.has(e.id))) return false;
            return true;
        });
    }, [employees, search, department, position, status, quickChip, quickChipIds]);""", "1.2 filtered")

s = rep(s,
"""        setStatus("");
        clearKpiGroup();
    };""",
"""        setStatus("");
        clearQuickChip();
    };""", "1.3 reset")

s = rep(s,
"""            setStatus,
            applyKpiGroup,
            clearKpiGroup,
            reset,
        },
        kpiGroup,
        filtered,
        hasActiveFilter:
            !!search || !!department || !!position || !!status || kpiGroup !== "none",""",
"""            setStatus,
            applyQuickChip,
            clearQuickChip,
            reset,
        },
        quickChip,
        filtered,
        hasActiveFilter:
            !!search || !!department || !!position || !!status || quickChip !== "all",""", "1.4 return")

save(p, s)

# ================= 2) HrPage.jsx =================
p = BASE + "\\pages\\HrPage.jsx"
s = load(p)

# 2.1 import: bỏ useHrKpis, thêm docCompleteness
s = rep(s, 'import { useHrKpis } from "../hooks/useHrKpis";\n', '', "2.1a kpi import")
s = rep(s, 'import { downloadExcel, hrTemplate, exportEmployees, HR_HEADER_BY_KEY, parseCsv, readExcel } from "../hrUtils";',
          'import { downloadExcel, hrTemplate, exportEmployees, HR_HEADER_BY_KEY, parseCsv, readExcel, docCompleteness } from "../hrUtils";',
          "2.1b docCompleteness import")

# 2.2 state block: bỏ kpis + toggleKpi, thêm chips + selectChip
s = rep(s,
"""    const kpis = useHrKpis(data);
    const { filters, setters, filtered, hasActiveFilter, kpiGroup } = useHrFilters(
        data.employees
    );

    // Nhấn thẻ KPI -> chỉ hiện đúng nhóm NV trong bảng; nhấn lần nữa bỏ lọc.
    const toggleKpi = (group) => {
        if (kpiGroup === group) setters.clearKpiGroup();
        else if (group === "noContract")
            setters.applyKpiGroup("noContract", kpis.noContractEndIds);
        else if (group === "payroll")
            setters.applyKpiGroup("payroll", kpis.readyPayrollIds);
    };""",
"""    const { filters, setters, filtered, hasActiveFilter, quickChip } = useHrFilters(
        data.employees
    );

    // ===== Chip lọc nhanh (mẫu: Tất cả · Đang làm việc · Sắp hết hợp đồng · ...) =====
    const chips = useMemo(() => {
        const all = data.employees;
        const activeNow = all.filter((e) => [1, 2, 3].includes(e.status));
        const hasContract = new Set(data.contracts.map((c) => c.employeeId));
        const withSalary = new Set(data.salaries.map((x) => x.employeeId));
        const withInsurance = new Set(data.insurance.map((x) => x.employeeId));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const in30 = new Date(today.getTime() + 30 * 24 * 3600 * 1000);
        const nearEnd = new Set();
        data.contracts.forEach((c) => {
            if (!c.endDate) return;
            const d = new Date(c.endDate);
            if (d >= today && d <= in30) nearEnd.add(c.employeeId);
        });
        const idsOf = (fn) => new Set(activeNow.filter(fn).map((e) => e.id));
        return [
            { key: "all", label: "Tất cả" },
            { key: "status2", label: "Đang làm việc", count: all.filter((e) => e.status === 2).length, status: 2, tab: "active" },
            { key: "status1", label: "Thử việc", count: all.filter((e) => e.status === 1).length, status: 1, tab: "active" },
            { key: "nearEnd", label: "Sắp hết hợp đồng", count: activeNow.filter((e) => nearEnd.has(e.id)).length, ids: idsOf((e) => nearEnd.has(e.id)) },
            { key: "noContract", label: "Chưa có hợp đồng", count: activeNow.filter((e) => !hasContract.has(e.id)).length, ids: idsOf((e) => !hasContract.has(e.id)) },
            { key: "incomplete", label: "Thiếu hồ sơ", count: activeNow.filter((e) => docCompleteness(e, data).percent < 100).length, ids: idsOf((e) => docCompleteness(e, data).percent < 100) },
            { key: "noPayroll", label: "Chưa đủ để tính lương", count: activeNow.filter((e) => !withSalary.has(e.id)).length, ids: idsOf((e) => !withSalary.has(e.id)) },
            { key: "noInsurance", label: "Chưa đủ để khai BHXH", count: activeNow.filter((e) => !withInsurance.has(e.id)).length, ids: idsOf((e) => !withInsurance.has(e.id)) },
            { key: "noAccount", label: "Chưa có tài khoản", count: activeNow.filter((e) => !e.userId).length, ids: idsOf((e) => !e.userId) },
            { key: "status4", label: "Đã nghỉ việc", count: all.filter((e) => e.status === 4).length, status: 4, tab: "archive" },
            { key: "status5", label: "Chấm dứt", count: all.filter((e) => e.status === 5).length, status: 5, tab: "archive" },
        ];
    }, [data]);

    // Bấm chip: chọn (tự chuyển tab nếu chip thuộc tab Lưu trữ) / bấm lại để bỏ chọn.
    const selectChip = (chip) => {
        if (chip.key === "all") {
            setters.clearQuickChip();
            setters.setStatus("");
            return;
        }
        if (chip.status) {
            const isActive = quickChip === "all" && String(filters.status) === String(chip.status);
            if (isActive) { setters.setStatus(""); return; }
            setters.clearQuickChip();
            setters.setStatus(String(chip.status));
            setTab(chip.tab || "active");
            setPage(1);
            return;
        }
        if (quickChip === chip.key) { setters.clearQuickChip(); return; }
        setters.applyQuickChip(chip.key, chip.ids);
        setters.setStatus("");
        setTab(chip.tab || "active");
        setPage(1);
    };
    const chipActive = (chip) => {
        if (chip.key === "all") return quickChip === "all" && !filters.status;
        if (chip.status) return quickChip === "all" && String(filters.status) === String(chip.status);
        return quickChip === chip.key;
    };""", "2.2 state+chips")

# 2.3 tab Lưu trữ: clearQuickChip
s = rep(s, 'onClick={() => { setTab("archive"); setters.clearKpiGroup(); }}',
          'onClick={() => { setTab("archive"); setters.clearQuickChip(); setPage(1); }}',
          "2.3 archive tab")

# 2.4 xóa 2 nút tab KPI cũ (sep + 2 button)
s = rep(s,
"""                                <span className="hr-tab-sep" aria-hidden="true"></span>
                                <button
                                    type="button"
                                    className={`hr-tab hr-tab--kpi${kpiGroup === "noContract" ? " active" : ""}`}
                                    onClick={() => toggleKpi("noContract")}
                                    title="Lọc nhân viên chưa có hợp đồng / chưa nhập ngày hết hạn - nhấn lại để bỏ lọc"
                                >
                                    📄 Hợp đồng ({kpis.noContractEnd})
                                </button>
                                <button
                                    type="button"
                                    className={`hr-tab hr-tab--kpi${kpiGroup === "payroll" ? " active" : ""}`}
                                    onClick={() => toggleKpi("payroll")}
                                    title="Lọc nhân viên đã có bảng lương (hồ sơ đủ tính lương) - nhấn lại để bỏ lọc"
                                >
                                    💰 Đủ lương ({kpis.readyForPayroll})
                                </button>
""", "", "2.4 remove old kpi tabs")

# 2.5 chèn hàng chip trước HrFilterBar
s = rep(s,
"""                        <HrFilterBar""",
"""                        <div className="hr-chips">
                            {chips.map((chip) => (
                                <button
                                    key={chip.key}
                                    type="button"
                                    className={`hr-chip${chipActive(chip) ? " active" : ""}`}
                                    onClick={() => selectChip(chip)}
                                >
                                    {chip.label}
                                    {chip.count != null ? ` (${chip.count})` : ""}
                                </button>
                            ))}
                        </div>

                        <HrFilterBar""", "2.5 chip row")

save(p, s)

# ================= 3) xóa useHrKpis.js (không ai dùng nữa) =================
target = BASE + "\\hooks\\useHrKpis.js"
if os.path.exists(target):
    refs = []
    for root, _d, files in os.walk(r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src"):
        for f in files:
            if not f.endswith((".jsx", ".js")):
                continue
            fp = os.path.join(root, f)
            if fp == target:
                continue
            with io.open(fp, "r", encoding="utf-8") as fh:
                if "useHrKpis" in fh.read():
                    refs.append(fp)
    if refs:
        log.append(("3. delete useHrKpis", "STILL REFERENCED: " + ", ".join(refs)))
    else:
        os.remove(target)
        log.append(("3. delete useHrKpis", True))

# ================= 4) hr.css =================
p = BASE + "\\hr.css"
s = load(p)
s = rep(s,
"""/* Separator + tab filter KPI (Hợp đồng / Đủ lương - cùng hàng tab Đang làm / Lưu trữ) */
.hr-tab-sep {
    width: 1px;
    align-self: stretch;
    margin: 0 2px;
    background: #d1d5db;
}

.hr-tab--kpi {
    font-size: 13px;
    padding: 7px 12px;
}
""",
"""/* Hàng chip lọc nhanh (Tất cả / Đang làm việc / Sắp hết hợp đồng / ...) */
.hr-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
}

.hr-chip {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 999px;
    background: #fff;
    color: #5a6b7b;
    font-size: 12.5px;
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.hr-chip:hover {
    border-color: #005b94;
    color: #005b94;
}

.hr-chip.active {
    background: #e3f0ff;
    border-color: #005b94;
    color: #005b94;
    font-weight: 700;
}
""", "4. chip css")
save(p, s)

for label, ok in log:
    print(f"[{label}] {'OK' if ok else 'FAIL'}")
print("DONE")
