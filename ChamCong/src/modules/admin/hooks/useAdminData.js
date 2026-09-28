import { useState, useEffect } from "react";
import adminApi from "../api/adminApi";

// Lấy danh sách từ một PromiseSettledResult (data.items hoặc mảng phẳng).
const items = (r) =>
    r?.status === "fulfilled" ? r.value.data.data?.items || [] : [];

// Kéo 6 nguồn dữ liệu quản trị (không chặn luồng khi 1 nguồn lỗi).
export const useAdminData = () => {
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [payrolls, setPayrolls] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const results = await Promise.allSettled([
                    adminApi.employees(),
                    adminApi.attendanceLogs(),
                    adminApi.leaveRequests(),
                    adminApi.payrolls(),
                    adminApi.contracts(),
                    adminApi.activationCodes(),
                ]);
                setEmployees(items(results[0]));
                setLogs(items(results[1]));
                setLeaves(items(results[2]));
                setPayrolls(items(results[3]));
                setContracts(items(results[4]));
                setCodes(items(results[5]));
            } catch (e) {
                setError(
                    e.response?.data?.message ||
                        e.message ||
                        "Không thể tải dữ liệu quản trị."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return {
        employees,
        logs,
        leaves,
        payrolls,
        contracts,
        codes,
        loading,
        error,
    };
};
