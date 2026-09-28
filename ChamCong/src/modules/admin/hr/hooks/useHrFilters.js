import { useMemo, useState } from "react";

// Trạng thái nhân viên (đồng bộ EmployeeStatus enum).
export const STATUS_LABELS = {
    1: "Thử việc",
    2: "Đang làm",
    3: "Nghỉ phép",
    4: "Đã nghỉ việc",
    5: "Chấm dứt",
};
export const STATUS_TONES = {
    1: "info",
    2: "ok",
    3: "warn",
    4: "muted",
    5: "bad",
};

// Lọc phía client: tìm kiếm (tên/mã/email) + phòng ban + chức vụ + trạng thái.
export const useHrFilters = (employees) => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");
    const [status, setStatus] = useState("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return employees.filter((e) => {
            if (q) {
                const name = (e.fullName || "").toLowerCase();
                const code = (e.employeeCode || "").toLowerCase();
                const email = (e.email || "").toLowerCase();
                const hit =
                    name.includes(q) || code.includes(q) || email.includes(q);
                if (!hit) return false;
            }
            if (department && e.departmentId !== department) return false;
            if (position && e.positionId !== position) return false;
            if (status && String(e.status) !== status) return false;
            return true;
        });
    }, [employees, search, department, position, status]);

    const reset = () => {
        setSearch("");
        setDepartment("");
        setPosition("");
        setStatus("");
    };

    return {
        filters: { search, department, position, status },
        setters: {
            setSearch,
            setDepartment,
            setPosition,
            setStatus,
            reset,
        },
        filtered,
        hasActiveFilter:
            !!search || !!department || !!position || !!status,
    };
};
