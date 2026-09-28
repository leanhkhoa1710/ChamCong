import { useMemo } from "react";

// ===== Ngày VN (UTC+7) =====
const pad = (n) => String(n).padStart(2, "0");
export const vnTodayKey = () => {
    const utc = Date.now() + new Date().getTimezoneOffset() * 60000 + 7 * 3600000;
    const d = new Date(utc);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const vnDayKey = (iso) => {
    if (!iso) return "";
    const t = new Date(iso).getTime() + new Date(iso).getTimezoneOffset() * 60000;
    const d = new Date(t + 7 * 3600000);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Nhân viên đang hoạt động (thử việc / đang làm / tạm nghỉ).
export const activeEmployees = (employees) =>
    employees.filter((e) => [1, 2, 3].includes(e.status));

// ===== 4 KPI quản lý nhân sự (đồng bộ dữ liệu thật) =====
export const useHrKpis = (data) => {
    const { employees, logs, contracts, salaries } = data;
    const todayKey = vnTodayKey();

    return useMemo(() => {
        const active = activeEmployees(employees);
        const activeIds = new Set(active.map((e) => e.id));

        const inToday = new Set(
            logs
                .filter((l) => l.type === 1 && vnDayKey(l.logTime) === todayKey)
                .map((l) => l.employeeId)
        );
        const checkedInToday = [...inToday].filter((id) => activeIds.has(id)).length;

        const logsToday = logs.filter((l) => vnDayKey(l.logTime) === todayKey);
        const needsManual = logsToday.filter((l) => l.isAdjusted).length;

        const withEndDate = new Set(
            contracts.filter((c) => c.endDate).map((c) => c.employeeId)
        );
        const noContractEnd = active.filter((e) => !withEndDate.has(e.id)).length;

        const withSalary = new Set(salaries.map((s) => s.employeeId));
        const missingSalary = active.filter((e) => !withSalary.has(e.id)).length;

        return {
            activeCount: active.length,
            checkedInToday,
            logsToday: logsToday.length,
            needsManual,
            noContractEnd,
            missingSalary,
            readyForPayroll: active.length - missingSalary,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employees, logs, contracts, salaries]);
};
