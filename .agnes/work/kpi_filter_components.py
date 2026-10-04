import io

def patch(path, old, new, label, required=True):
    with io.open(path, "r", encoding="utf-8") as f:
        s = f.read()
    if old in s:
        s = s.replace(old, new)
        print(f"[{label}] OK (CRLF)")
        ok = True
    else:
        old_lf = old.replace("\r\n", "\n")
        s_lf = s.replace("\r\n", "\n")
        if old_lf in s_lf:
            s = s_lf.replace(old_lf, new.replace("\r\n", "\n"))
            print(f"[{label}] OK (LF)")
            ok = True
        else:
            print(f"[{label}] NOT FOUND:\n---\n{old[:300]}")
            ok = False
    if ok:
        with io.open(path, "w", encoding="utf-8", newline="") as f:
            f.write(s)

N = "\r\n"
BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr"

# ===== 1) HrKpiCards: div -> button, nhận activeGroup/onSelect =====
patch(BASE + "\\components\\HrKpiCards.jsx",
    "const HrKpiCards = ({ kpis }) => {",
    "const HrKpiCards = ({ kpis, activeGroup = \"none\", onSelect }) => {",
    "kpi-signature")

patch(BASE + "\\components\\HrKpiCards.jsx",
    "            title: \"Hợp đồng sắp hết hạn\"," + N +
    "            value: kpis.noContractEnd,",
    "            title: \"Hợp đồng sắp hết hạn\"," + N +
    "            group: \"noContract\"," + N +
    "            value: kpis.noContractEnd,",
    "kpi-group-1")

patch(BASE + "\\components\\HrKpiCards.jsx",
    "            title: \"Hồ sơ đủ để tính lương\"," + N +
    "            value: kpis.readyForPayroll,",
    "            title: \"Hồ sơ đủ để tính lương\"," + N +
    "            group: \"payroll\"," + N +
    "            value: kpis.readyForPayroll,",
    "kpi-group-2")

patch(BASE + "\\components\\HrKpiCards.jsx",
    "                <div" + N +
    "                    key={c.title}" + N +
    "                    className={`hr-card hr-card--${c.tone}`}" + N +
    "                >",
    "                <button" + N +
    "                    type=\"button\"" + N +
    "                    key={c.title}" + N +
    "                    className={`hr-card hr-card--${c.tone} hr-card--clickable${" + N +
    "                        activeGroup === c.group ? \" hr-card--active\" : \"\"" + N +
    "                    }`}" + N +
    "                    onClick={() => onSelect && onSelect(c.group)}" + N +
    "                >",
    "kpi-open")

patch(BASE + "\\components\\HrKpiCards.jsx",
    "                    <p className=\"hr-card-sub\">{c.sub}</p>" + N +
    "                </div>" + N +
    "            ))}",
    "                    <p className=\"hr-card-sub\">{c.sub}</p>" + N +
    "                </button>" + N +
    "            ))}",
    "kpi-close")

# ===== 2) HrPage: destruct kpiGroup + toggleKpi + truyền props =====
patch(BASE + "\\pages\\HrPage.jsx",
    "    const { filters, setters, filtered, hasActiveFilter } = useHrFilters(" + N +
    "        data.employees" + N +
    "    );",
    "    const { filters, setters, filtered, hasActiveFilter, kpiGroup } = useHrFilters(" + N +
    "        data.employees" + N +
    "    );" + N +
    N +
    "    // Nhấn thẻ KPI -> chỉ hiện đúng nhóm NV trong bảng; nhấn lần nữa bỏ lọc." + N +
    "    const toggleKpi = (group) => {" + N +
    "        if (kpiGroup === group) setters.clearKpiGroup();" + N +
    "        else if (group === \"noContract\")" + N +
    "            setters.applyKpiGroup(\"noContract\", kpis.noContractEndIds);" + N +
    "        else if (group === \"payroll\")" + N +
    "            setters.applyKpiGroup(\"payroll\", kpis.readyPayrollIds);" + N +
    "    };" + N +
    "    const kpiLabel =" + N +
    "        kpiGroup === \"noContract\"" + N +
    "            ? \"Hợp đồng sắp hết hạn\"" + N +
    "            : kpiGroup === \"payroll\"" + N +
    "            ? \"Hồ sơ đủ tính lương\"" + N +
    "            : null;",
    "hrpage-state")

patch(BASE + "\\pages\\HrPage.jsx",
    "                        <HrKpiCards kpis={kpis} />",
    "                        <HrKpiCards" + N +
    "                            kpis={kpis}" + N +
    "                            activeGroup={kpiGroup}" + N +
    "                            onSelect={toggleKpi}" + N +
    "                        />",
    "hrpage-kpi")

patch(BASE + "\\pages\\HrPage.jsx",
    "                            onTemplate={onTemplate}" + N +
    "                        />",
    "                            onTemplate={onTemplate}" + N +
    "                            kpiLabel={kpiLabel}" + N +
    "                            onClearKpi={setters.clearKpiGroup}" + N +
    "                        />",
    "hrpage-filterbar")

# ===== 3) HrFilterBar: nhận kpiLabel/onClearKpi + chip =====
patch(BASE + "\\components\\HrFilterBar.jsx",
    "    onExport," + N +
    "    onTemplate," + N +
    "}) => {",
    "    onExport," + N +
    "    onTemplate," + N +
    "    kpiLabel," + N +
    "    onClearKpi," + N +
    "}) => {",
    "filterbar-props")

patch(BASE + "\\components\\HrFilterBar.jsx",
    "                <button" + N +
    "                    type=\"button\"" + N +
    "                    className={`hr-btn hr-btn--ghost hr-clear-filter${hasActiveFilter ? \"\" : \" hr-clear-filter--hidden\"}`}" + N +
    "                    onClick={setters.reset}" + N +
    "                    disabled={!hasActiveFilter}" + N +
    "                    aria-hidden={!hasActiveFilter}" + N +
    "                    tabIndex={hasActiveFilter ? 0 : -1}" + N +
    "                >" + N +
    "                    ✕ Xóa lọc" + N +
    "                </button>" + N +
    "            </div>",
    "                <button" + N +
    "                    type=\"button\"" + N +
    "                    className={`hr-btn hr-btn--ghost hr-clear-filter${hasActiveFilter ? \"\" : \" hr-clear-filter--hidden\"}`}" + N +
    "                    onClick={setters.reset}" + N +
    "                    disabled={!hasActiveFilter}" + N +
    "                    aria-hidden={!hasActiveFilter}" + N +
    "                    tabIndex={hasActiveFilter ? 0 : -1}" + N +
    "                >" + N +
    "                    ✕ Xóa lọc" + N +
    "                </button>" + N +
    "                {kpiLabel && (" + N +
    "                    <button" + N +
    "                        type=\"button\"" + N +
    "                        className=\"hr-btn hr-btn--ghost hr-kpi-chip\"" + N +
    "                        onClick={onClearKpi}" + N +
    "                        title=\"Bỏ lọc nhóm KPI đang chọn\"" + N +
    "                    >" + N +
    "                        🔹 {kpiLabel} ✕" + N +
    "                    </button>" + N +
    "                )}" + N +
    "            </div>",
    "filterbar-chip")

# ===== 4) hr.css: style card click + chip =====
patch(BASE + "\\hr.css",
    ".hr-card--warn {" + N +
    "    background: #fffaf0;" + N +
    "    border-color: #f5e7c8;" + N +
    "}",
    ".hr-card--warn {" + N +
    "    background: #fffaf0;" + N +
    "    border-color: #f5e7c8;" + N +
    "}" + N +
    N +
    "/* Thẻ KPI là nút lọc: nhấn để bảng chỉ hiện đúng nhóm NV. */" + N +
    ".hr-card--clickable {" + N +
    "    cursor: pointer;" + N +
    "    font: inherit;" + N +
    "    text-align: left;" + N +
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
