import { useState, useEffect, useCallback } from "react";
import adminApi from "../../api/adminApi";

const items = (r) =>
    r?.status === "fulfilled" ? r.value.data.data?.items || [] : [];

// Kéo toàn bộ dữ liệu HR (dùng lại 1 lần, chia sẻ cho KPI + filter + bảng).
// `reload` gọi lại sau khi có thay đổi dữ liệu (CRUD nhân viên...).
export const useHrData = () => {
    const [data, setData] = useState({
        employees: [],
        logs: [],
        contracts: [],
        departments: [],
        positions: [],
        salaries: [],
        insurance: [],
        bankAccounts: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        try {
            const r = await Promise.allSettled([
                adminApi.employees(),
                adminApi.attendanceLogs(),
                adminApi.contracts(),
                adminApi.departments(),
                adminApi.positions(),
                adminApi.salaries(),
                adminApi.insurance(),
                adminApi.bankAccounts(),
            ]);
            setData({
                employees: items(r[0]),
                logs: items(r[1]),
                contracts: items(r[2]),
                departments: items(r[3]),
                positions: items(r[4]),
                salaries: items(r[5]),
                insurance: items(r[6]),
                bankAccounts: items(r[7]),
            });
        } catch (e) {
            setError(
                e.response?.data?.message ||
                    e.message ||
                    "Không thể tải dữ liệu nhân sự."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { ...data, loading, error, reload: load };
};
