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
            print(f"[{label}] NOT FOUND:\n{old[:200]}")
            return
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(s)

N = "\r\n"
BASE = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr"

# 1) HrPage: 2 nút lọc KPI nhỏ ngay trong hàng tab (trên thanh tìm kiếm)
patch(BASE + "\\pages\\HrPage.jsx",
    "                            Lưu trữ – đã nghỉ ({resigned.length})" + N +
    "                        </button>" + N +
    "                    </div>",
    "                            Lưu trữ – đã nghỉ ({resigned.length})" + N +
    "                        </button>" + N +
    "                        <button" + N +
    "                            type=\"button\"" + N +
    "                            className={`hr-tab hr-tab--kpi${kpiGroup === \"noContract\" ? \" active\" : \"\"}`}" + N +
    "                            onClick={() => toggleKpi(\"noContract\")}" + N +
    "                            title=\"Chỉ hiện NV chưa có hợp đồng / chưa nhập ngày hết hạn\"" + N +
    "                        >" + N +
    "                            📄 Hợp đồng sắp hết hạn ({kpis.noContractEnd})" + N +
    "                        </button>" + N +
    "                        <button" + N +
    "                            type=\"button\"" + N +
    "                            className={`hr-tab hr-tab--kpi${kpiGroup === \"payroll\" ? \" active\" : \"\"}`}" + N +
    "                            onClick={() => toggleKpi(\"payroll\")}" + N +
    "                            title=\"Chỉ hiện NV đã có đủ hồ sơ tính lương\"" + N +
    "                        >" + N +
    "                            💰 Hồ sơ đủ tính lương ({kpis.readyForPayroll})" + N +
    "                        </button>" + N +
    "                    </div>",
    "hrpage-tab-kpi")

# 2) hr.css: style tab KPI (nhỏ, tách nhẹ khỏi 2 tab trạng thái)
patch(BASE + "\\hr.css",
    ".hr-tab.active {" + N +
    "    background: #e3f0ff;" + N +
    "    border-color: #005b94;" + N +
    "    color: #005b94;" + N +
    "    font-weight: 700;" + N +
    "}",
    ".hr-tab.active {" + N +
    "    background: #e3f0ff;" + N +
    "    border-color: #005b94;" + N +
    "    color: #005b94;" + N +
    "    font-weight: 700;" + N +
    "}" + N +
    N +
    "/* 2 nút lọc KPI nhỏ cùng hàng tab - nhấn để lọc bảng NV. */" + N +
    ".hr-tab--kpi {" + N +
    "    margin-left: 6px;" + N +
    "    color: #5a6b7b;" + N +
    "}",
    "css-tab-kpi")
