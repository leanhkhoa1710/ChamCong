import { useState, useEffect, useMemo } from "react";
import HrLayout from "../layout/HrLayout";
import hrApi from "../api/hrApi";
import { getAuth } from "../../../../services/auth/auth";
import {
    ATT_STATUS_LABELS,
    ATT_STATUS_CLASS,
    APPROVAL_LABELS,
    APPROVAL_CLASS,
} from "../hrLabels";
import { formatVnTime, formatVnDate } from "../../../../utils/vnTime";
import "../../../../modules/attendance/attendance.css";
import "../../admin.css";

// Duyệt ngày công: chọn nhân viên -> xem các bản ghi "Chờ duyệt"
// -> Duyệt / Từ chối (đủ 2 lượt vào-ra mới cho phép duyệt "Đúng giờ").
const AttendanceApprovalPage = () => {
    const auth = getAuth();
    const approverId = auth?.employeeId || "";

    const [rows, setRows] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    // Bộ lọc: nhân viên + tab trạng thái duyệt
    const [empId, setEmpId] = useState("");
    const [tab, setTab] = useState("pending"); // pending | all

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

    const empMap = useMemo(
        () => Object.fromEntries(employees.map((e) => [e.id, e])),
        [employees]
    );

    const filtered = useMemo(() => {
        return rows.filter((r) => {
            if (empId && r.employeeId !== empId) return false;
            if (tab === "pending" && r.approvalStatus !== 0) return false;
            return true;
        });
    }, [rows, empId, tab]);

    const pendingCount = useMemo(
        () =>
            rows.filter((r) => r.approvalStatus === 0 && (!empId || r.employeeId === empId)).length,
        [rows, empId]
    );

    const flash = (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(""), 3000);
    };

    const approve = async (row, status) => {
        if (!approverId) {
            flash("Tài khoản của bạn chưa gắn với hồ sơ nhân viên, không thể đóng vai người duyệt.");
            return;
        }
        try {
            await hrApi.approveAttendance({
                id: row.id,
                approvalStatus: status,
                approvedBy: approverId,
            });
            await load();
            flash(
                status === 1
                    ? `Đã duyệt ngày ${formatVnDate(row.attendanceDate)}.`
                    : `Đã từ chối ngày ${formatVnDate(row.attendanceDate)}.`
            );
        } catch (err) {
            flash(err.response?.data?.message || err.message || "Duyệt thất bại.");
        }
    };

    const canApprove = (row) => {
        // Phải có đủ giờ vào + ra (hoặc ghi "Vắng mặt/Nghỉ") mới cho quyết.
        return row.checkInTime || row.checkOutTime || row.status === 4 || row.status === 5;
    };

    const employeeName = (row) => {
        const e = empMap[row.employeeId];
        return e ? `${e.employeeCode} · ${e.fullName}` : row.employeeName || "—";
    };

    return (
        <HrLayout
            title="Duyệt chấm công"
            subtitle="Xác nhận hoặc từ chối ngày công của từng nhân viên"
        >
            {notice && <div className="att-notice">{notice}</div>}
            {error && <div className="att-error">{error}</div>}
            {loading ? (
                <div className="att-loading">Đang tải...</div>
            ) : (
                <section className="att-card">
                    <div className="admin-toolbar">
                        <select value={empId} onChange={(e) => setEmpId(e.target.value)}>
                            <option value="">Tất cả nhân viên</option>
                            {employees.map((x) => (
                                <option key={x.id} value={x.id}>
                                    {x.employeeCode} · {x.fullName}
                                </option>
                            ))}
                        </select>
                        <label className="admin-check">
                            <input
                                type="radio"
                                checked={tab === "pending"}
                                onChange={() => setTab("pending")}
                            />
                            Chờ duyệt
                        </label>
                        <label className="admin-check">
                            <input
                                type="radio"
                                checked={tab === "all"}
                                onChange={() => setTab("all")}
                            />
                            Tất cả
                        </label>
                        <span className="att-muted">
                            {tab === "pending"
                                ? `${pendingCount} bản ghi chờ`
                                : `${filtered.length} bản ghi`}
                        </span>
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
                                            <span className="att-muted">
                                                Không có bản ghi phù hợp.
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((row) => (
                                        <tr key={row.id}>
                                            <td>{employeeName(row)}</td>
                                            <td>{formatVnDate(row.attendanceDate)}</td>
                                            <td>
                                                {row.status != null ? (
                                                    <span
                                                        className={`att-badge ${ATT_STATUS_CLASS[row.status] || ""}`}
                                                    >
                                                        {ATT_STATUS_LABELS[row.status] || "Chưa đánh giá"}
                                                    </span>
                                                ) : (
                                                    <span className="att-muted">—</span>
                                                )}
                                            </td>
                                            <td>
                                                {formatVnTime(row.checkInTime) || "—"} →{" "}
                                                {formatVnTime(row.checkOutTime) || "—"}
                                            </td>
                                            <td>
                                                {row.actualHours != null ? `${row.actualHours}h` : "—"}
                                            </td>
                                            <td>
                                                <span
                                                    className={`att-badge ${APPROVAL_CLASS[row.approvalStatus] || ""}`}
                                                >
                                                    {APPROVAL_LABELS[row.approvalStatus]}
                                                </span>
                                            </td>
                                            <td>
                                                {row.approvalStatus === 0 ? (
                                                    canApprove(row) ? (
                                                        <div className="admin-row-actions">
                                                            <button
                                                                type="button"
                                                                className="hr-approve-btn hr-approve-btn--ok"
                                                                onClick={() => approve(row, 1)}
                                                            >
                                                                Duyệt
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="hr-approve-btn hr-approve-btn--bad"
                                                                onClick={() => approve(row, 2)}
                                                            >
                                                                Từ chối
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="att-muted">
                                                            Chưa đủ log vào/ra
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="att-muted">
                                                        {row.approverName || "Đã xử lý"}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </HrLayout>
    );
};

export default AttendanceApprovalPage;
