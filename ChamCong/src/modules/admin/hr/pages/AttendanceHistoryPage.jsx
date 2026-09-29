import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import HrLayout from "../layout/HrLayout";
import hrApi from "../api/hrApi";
import AttendanceFormModal from "../components/AttendanceFormModal";
import {
    ATT_STATUS_LABELS,
    ATT_STATUS_CLASS,
    APPROVAL_LABELS,
    APPROVAL_CLASS,
} from "../hrLabels";
import { formatVnTime, formatVnDate } from "../../../../utils/vnTime";
import "../../../../modules/attendance/attendance.css";
import "../../admin.css";

// Trong hub Nhân sự: lịch sử chấm công của TOÀN BỘ nhân viên,
// dạng bảng có nút Thêm / Sửa / Xóa (soft-delete).
const AttendanceHistoryPage = () => {
    const [rows, setRows] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Bộ lọc theo nhân viên (?employee=<id> - link từ trang Thống kê)
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("employee") || "";
    const [month, setMonth] = useState("");

    const setQ = (value) => {
        const p = new URLSearchParams(searchParams);
        if (value) p.set("employee", value);
        else p.delete("employee");
        setSearchParams(p);
    };

    // Modal thêm / sửa
    const [modalOpen, setModalOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);

    const empMap = useMemo(
        () => Object.fromEntries(employees.map((e) => [e.id, e])),
        [employees]
    );

    const load = async () => {
        try {
            const [a, e] = await Promise.all([
                hrApi.attendanceAll(),
                hrApi.employees(),
            ]);
            setRows(a.data.data?.items || []);
            setEmployees(e.data.data?.items || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        return rows.filter((r) => {
            if (q && r.employeeId !== q) return false;
            if (month) {
                const d = new Date(r.attendanceDate);
                const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                if (m !== month) return false;
            }
            return true;
        });
    }, [rows, q, month]);

    const doDelete = async (row) => {
        const e = empMap[row.employeeId];
        if (!window.confirm(`Xóa bản ghi ${formatVnDate(row.attendanceDate)} của ${e?.fullName || row.employeeCode}?`)) return;
        try {
            await hrApi.softDeleteAttendance(row.id);
            load();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const submitModal = async (form, isEdit) => {
        const payload = {
            employeeId: form.employeeId,
            attendanceDate: form.attendanceDate,
            status: form.status === "" ? null : Number(form.status),
            actualHours: form.actualHours === "" ? null : Number(form.actualHours),
            approvalStatus: Number(form.approvalStatus),
            note: form.note || null,
        };
        try {
            if (isEdit) {
                payload.id = editRow.id;
                await hrApi.updateAttendance(payload);
            } else {
                // Create chỉ nhận các field của CreateAttendanceModelView
                await hrApi.createAttendance({
                    employeeId: payload.employeeId,
                    attendanceDate: payload.attendanceDate,
                    status: payload.status,
                    note: payload.note,
                });
            }
            setModalOpen(false);
            setEditRow(null);
            load();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const empName = (row) => {
        const e = empMap[row.employeeId];
        return e ? `${e.employeeCode} · ${e.fullName}` : row.employeeName || "—";
    };

    return (
        <HrLayout
            title="Lịch sử chấm công"
            subtitle="Toàn bộ bản ghi chấm công của tất cả nhân viên"
        >
            <div className="att-content">
                {error && <div className="att-error">{error}</div>}
                {loading ? (
                    <div className="att-loading">Đang tải...</div>
                ) : (
                    <section className="att-card">
                        <div className="admin-toolbar">
                            <select value={q} onChange={(e) => setQ(e.target.value)}>
                                <option value="">Tất cả nhân viên</option>
                                {employees.map((x) => (
                                    <option key={x.id} value={x.id}>
                                        {x.employeeCode} · {x.fullName}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            />
                            <span className="att-muted">{filtered.length} bản ghi</span>
                            <button
                                type="button"
                                className="admin-link-btn"
                                onClick={() => {
                                    setEditRow(null);
                                    setModalOpen(true);
                                }}
                            >
                                + Thêm
                            </button>
                        </div>

                        <div className="att-table-wrap">
                            <table className="att-table">
                                <thead>
                                    <tr>
                                        <th>Nhân viên</th>
                                        <th>Ngày</th>
                                        <th>Trạng thái</th>
                                        <th>Giờ vào → ra</th>
                                        <th>Giờ thực</th>
                                        <th>Duyệt</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan="7">
                                                <span className="att-muted">Không có bản ghi phù hợp.</span>
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((row) => (
                                            <tr key={row.id}>
                                                <td>{empName(row)}</td>
                                                <td>{formatVnDate(row.attendanceDate)}</td>
                                                <td>
                                                    <span
                                                        className={`att-badge ${ATT_STATUS_CLASS[row.status] || ""}`}
                                                    >
                                                        {ATT_STATUS_LABELS[row.status] || "Chưa đánh giá"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {formatVnTime(row.checkInTime) || "—"} →{" "}
                                                    {formatVnTime(row.checkOutTime) || "—"}
                                                </td>
                                                <td>{row.actualHours != null ? `${row.actualHours}h` : "—"}</td>
                                                <td>
                                                    <span
                                                        className={`att-badge ${APPROVAL_CLASS[row.approvalStatus] || ""}`}
                                                    >
                                                        {APPROVAL_LABELS[row.approvalStatus]}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="admin-row-actions">
                                                        <button
                                                            type="button"
                                                            className="admin-link-btn"
                                                            onClick={() => {
                                                                setEditRow(row);
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="admin-link-btn admin-link-btn--danger"
                                                            onClick={() => doDelete(row)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                <AttendanceFormModal
                    open={modalOpen}
                    row={editRow}
                    employees={employees}
                    onClose={() => {
                        setModalOpen(false);
                        setEditRow(null);
                    }}
                    onSubmit={submitModal}
                />
            </div>
        </HrLayout>
    );
};

export default AttendanceHistoryPage;
