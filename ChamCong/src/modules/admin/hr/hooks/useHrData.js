import { useState, useEffect, useCallback } from "react";
import adminApi from "../../api/adminApi";

const items = (r) =>
    r?.status === "fulfilled" ? r.value.data.data?.items || [] : [];

// Kéo dữ liệu HR (không còn logs chấm công - đã bỏ KPI chấm công).
export const useHrData = () => {
    const [data, setData] = useState({
        employees: [],
        contracts: [],
        departments: [],
        positions: [],
        salaries: [],
        insurance: [],
        bankAccounts: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const r = await Promise.allSettled([
                    adminApi.employees(),
                    adminApi.contracts(),
                    adminApi.departments(),
                    adminApi.positions(),
                    adminApi.salaries(),
                    adminApi.insurance(),
                    adminApi.bankAccounts(),
                ]);
                setData({
                    employees: items(r[0]),
                    contracts: items(r[1]),
                    departments: items(r[2]),
                    positions: items(r[3]),
                    salaries: items(r[4]),
                    insurance: items(r[5]),
                    bankAccounts: items(r[6]),
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
        };
        load();
    }, [load]);

    return { ...data, loading, error, reload: load };
};
