import { useState, useEffect, useMemo } from "react";
import HrLayout from "../layout/HrLayout";
import hrApi from "../api/hrApi";
import { getAuth } from "../../../../services/auth/auth";
import {
    LEAVE_STATUS_LABELS,
    LEAVE_STATUS_CLASS,
} from "../hrLabels";
import { formatVnDate } from "../../../../utils/vnTime";
import "../../../../modules/attendance/attendance.css";
import "../../admin.css";

// Danh sách đơn nghỉ phép của toàn công ty + Duyệt / Từ chối.
// Người duyệt = hồ sơ nhân viên của tài khoản đang đăng nhập.
const LeaveApprovalPage = () => {
    const auth = getAuth();
    const approverId = auth?.employeeId || "";

    const [rows, setRows] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [tab, setTab] = useState("pending"); // pending | all

    const load = async () => {
        try {
            const [l, e] = await Promise.all([
                hrApi.leaveRequests(),
                hrApi.employees(),
            ]);
            setRows(l.data.data?.items || []);
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

    const pendingCount = useMemo(
        () => rows.filter((r) => r.status === 1).length,
        [rows]
    );

    const filtered = useMemo(
        () =>
            tab === "pending"
                ? rows.filter((r) => r.status === 1)
                : rows,
        [rows, tab]
    );

    const flash = (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(""), 3000);
    };

    const decide = async (row, status) => {
        if (!approverId) {
            flash("Tài khoản của bạn chưa gắn hồ sơ nhân viên, không thể duyệt.");
            return;
        }
        try {
            await hrApi.approveLeave({
                id: row.id,
                employeeId: row.employeeId,
                leaveTypeId: row.leaveTypeId,
                fromDate: row.fromDate,
                toDate: row.toDate,
                totalDays: row.totalDays,
                reason: row.reason,
                status,
                approvedBy: approverId,
                approvedAt: new Date().toISOString(),
            });
            await load();
            flash(
                status === 2
                    ? `Đã duyệt đơn nghỉ của ${row.employeeName || "nhân viên"}.`
                    : `Đã từ chối đơn nghỉ của ${row.employeeName || "nhân viên"}.`
            );
        } catch (err) {
            flash(err.response?.data?.message || err.message || "Duyệt thất bại.");
        }
    };

    return (
        <HrLayout
            title="Nghỉ phép"
            subtitle="Duyệt hoặc từ chối các đơn nghỉ phép"
        >
            {notice && <div className="att-notice">{notice}</div>}
            {error && <div className="att-error">{error}</div>}
            {loading ? (
                <div className="att-loading">Đang tải...</div>
            ) : (
                <section className="att-card">
                    <div className="admin-toolbar">
                        <label className="admin-check">
                            <input
                                type="radio"
                                checked={tab === "pending"}
                                onChange={() => setTab("pending")}
                            />
                            Chờ duyệt ({pendingCount})
                        </label>
                        <label className="admin-check">
                            <input
                                type="radio"
                                checked={tab === "all"}
                                onChange={() => setTab("all")}
                            />
                            Tất cả ({rows.length})
                        </label>
                    </div>

                    <div className="att-table-wrap">
                        <table className="att-table">
                            <thead>
                                <tr>
                                    <th>Nhân viên</th>
                                    <th>Loại</th>
                                    <th>Ngày từ → đến</th>
                                    <th>Số ngày</th>
                                    <th>Lý do</th>
                                    <th>Trạng thái</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">
                                            <span className="att-muted">
                                                Không có đơn nghỉ nào.
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((row) => {
                                        const e = empMap[row.employeeId];
                                        return (
                                            <tr key={row.id}>
                                                <td>
                                                    {e
                                                        ? `${e.employeeCode} · ${e.fullName}`
                                                        : row.employeeName || "—"}
                                                </td>
                                                <td>{row.leaveTypeName || "—"}</td>
                                                <td>
                                                    {formatVnDate(row.fromDate)} →{" "}
                                                    {formatVnDate(row.toDate)}
                                                </td>
                                                <td>
                                                    {row.totalDays != null
                                                        ? row.totalDays
                                                        : "—"}
                                                </td>
                                                <td>
                                                    <span className="att-muted">
                                                        {row.reason || "—"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`att-badge ${
                                                            LEAVE_STATUS_CLASS[row.status] || ""
                                                        }`}
                                                    >
                                                        {LEAVE_STATUS_LABELS[row.status] ||
                                                            "—"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {row.status === 1 ? (
                                                        <div className="admin-row-actions">
                                                            <button
                                                                type="button"
                                                                className="hr-approve-btn hr-approve-btn--ok"
                                                                onClick={() =>
                                                                    decide(row, 2)
                                                                }
                                                            >
                                                                Duyệt
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="hr-approve-btn hr-approve-btn--bad"
                                                                onClick={() =>
                                                                    decide(row, 3)
                                                                }
                                                            >
                                                                Từ chối
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="att-muted">
                                                            {row.approverName ||
                                                                "Đã xử lý"}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </HrLayout>
    );
};

export default LeaveApprovalPage;
