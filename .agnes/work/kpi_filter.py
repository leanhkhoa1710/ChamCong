import io

def patch(path, old, new, label):
    with io.open(path, "r", encoding="utf-8") as f:
        s = f.read()
    if old in s:
        s = s.replace(old, new)
        print(f"[{label}] OK (CRLF)")
    else:
        old_lf = old.replace("\r\n", "\n")
        s_lf = s.replace("\r\n", "\n")
        if old_lf in s_lf:
            s = s_lf.replace(old_lf, new.replace("\r\n", "\n"))
            print(f"[{label}] OK (LF)")
        else:
            print(f"[{label}] NOT FOUND:\n--- OLD ---\n{old[:400]}\n---")
            return
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(s)

N = "\r\n"
KPIS = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr\hooks\useHrKpis.js"
FIL  = r"D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr\hooks\useHrFilters.js"

# ===== useHrKpis: trả thêm 2 Set id =====
patch(KPIS,
    "        const noContractEnd = active.filter((e) => !withContract.has(e.id))" + N +
    "            .length;" + N + N +
    "        // Hồ sơ đủ tính lương: NV đang làm đã có bảng lương." + N +
    "        const withSalary = new Set(salaries.map((s) => s.employeeId));" + N +
    "        const missingSalary = active.filter((e) => !withSalary.has(e.id))" + N +
    "            .length;" + N + N +
    "        return {" + N +
    "            activeCount: active.length," + N +
    "            noContractEnd," + N +
    "            missingSalary," + N +
    "            readyForPayroll: active.length - missingSalary," + N +
    "        };",
    "        const noContractEndList = active.filter((e) => !withContract.has(e.id));" + N + N +
    "        // Hồ sơ đủ tính lương: NV đang làm đã có bảng lương." + N +
    "        const withSalary = new Set(salaries.map((s) => s.employeeId));" + N +
    "        const missingSalaryList = active.filter((e) => !withSalary.has(e.id));" + N + N +
    "        return {" + N +
    "            activeCount: active.length," + N +
    "            noContractEnd: noContractEndList.length," + N +
    "            missingSalary: missingSalaryList.length," + N +
    "            readyForPayroll: active.length - missingSalaryList.length," + N +
    "            // Mã NV của từng nhóm KPI - dùng khi nhấn thẻ KPI để lọc bảng." + N +
    "            noContractEndIds: new Set(noContractEndList.map((e) => e.id))," + N +
    "            readyPayrollIds: new Set(" + N +
    "                active.filter((e) => withSalary.has(e.id)).map((e) => e.id)" + N +
    "            )," + N +
    "        };",
    "useHrKpis")

# ===== useHrFilters: state =====
patch(FIL,
    "    const [search, setSearch] = useState(\"\");" + N +
    "    const [department, setDepartment] = useState(\"\");" + N +
    "    const [position, setPosition] = useState(\"\");" + N +
    "    const [status, setStatus] = useState(\"\");",
    "    const [search, setSearch] = useState(\"\");" + N +
    "    const [department, setDepartment] = useState(\"\");" + N +
    "    const [position, setPosition] = useState(\"\");" + N +
    "    const [status, setStatus] = useState(\"\");" + N +
    "    // Nhóm KPI đang chọn (\"none\" | \"noContract\" | \"payroll\") + tập id khớp." + N +
    "    const [kpiGroup, setKpiGroup] = useState(\"none\");" + N +
    "    const [kpiIds, setKpiIds] = useState(null);" + N +
    "    const applyKpiGroup = (group, ids) => {" + N +
    "        setKpiGroup(group);" + N +
    "        setKpiIds(ids);" + N +
    "        setStatus(\"\");" + N +
    "    };" + N +
    "    const clearKpiGroup = () => {" + N +
    "        setKpiGroup(\"none\");" + N +
    "        setKpiIds(null);" + N +
    "    };",
    "useHrFilters-state")

# ===== useHrFilters: filtered =====
patch(FIL,
    "            if (status && String(e.status) !== status) return false;" + N +
    "            return true;" + N +
    "        });" + N +
    "    }, [employees, search, department, position, status]);",
    "            if (status && String(e.status) !== status) return false;" + N +
    "            if (kpiGroup !== \"none\" && !(kpiIds && kpiIds.has(e.id))) return false;" + N +
    "            return true;" + N +
    "        });" + N +
    "    }, [employees, search, department, position, status, kpiGroup, kpiIds]);",
    "useHrFilters-filtered")

# ===== useHrFilters: reset + return =====
patch(FIL,
    "    const reset = () => {" + N +
    "        setSearch(\"\");" + N +
    "        setDepartment(\"\");" + N +
    "        setPosition(\"\");" + N +
    "        setStatus(\"\");" + N +
    "    };" + N + N +
    "    return {" + N +
    "        filters: { search, department, position, status }," + N +
    "        setters: {" + N +
    "            setSearch," + N +
    "            setDepartment," + N +
    "            setPosition," + N +
    "            setStatus," + N +
    "            reset," + N +
    "        }," + N +
    "        filtered," + N +
    "        hasActiveFilter:" + N +
    "            !!search || !!department || !!position || !!status," + N +
    "    };",
    "    const reset = () => {" + N +
    "        setSearch(\"\");" + N +
    "        setDepartment(\"\");" + N +
    "        setPosition(\"\");" + N +
    "        setStatus(\"\");" + N +
    "        clearKpiGroup();" + N +
    "    };" + N + N +
    "    return {" + N +
    "        filters: { search, department, position, status }," + N +
    "        setters: {" + N +
    "            setSearch," + N +
    "            setDepartment," + N +
    "            setPosition," + N +
    "            setStatus," + N +
    "            applyKpiGroup," + N +
    "            clearKpiGroup," + N +
    "            reset," + N +
    "        }," + N +
    "        kpiGroup," + N +
    "        filtered," + N +
    "        hasActiveFilter:" + N +
    "            !!search || !!department || !!position || !!status || kpiGroup !== \"none\"," + N +
    "    };",
    "useHrFilters-return")
