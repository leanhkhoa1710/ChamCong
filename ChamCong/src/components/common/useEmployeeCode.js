import { useEffect, useState } from "react";
import axiosClient from "../../services/api/axiosClient";

export const useEmployeeCode = (departmentId, employee, setForm) => {
    const [error, setError] = useState("");
    useEffect(() => {
        if (employee) return;
        let cancelled = false;
        setError("");
        setForm((form) => ({ ...form, employeeCode: "" }));
        if (!departmentId) return;
        axiosClient.get("/Employee/next-code", { params: { departmentId } })
            .then(({ data }) => {
                if (!cancelled) setForm((form) => ({ ...form, employeeCode: data.data || "" }));
            })
            .catch((err) => {
                if (!cancelled) setError(err.response?.data?.message || "Không lấy được mã nhân viên. Hãy chọn lại bộ phận.");
            });
        return () => { cancelled = true; };
    }, [departmentId, employee, setForm]);
    return error;
};
