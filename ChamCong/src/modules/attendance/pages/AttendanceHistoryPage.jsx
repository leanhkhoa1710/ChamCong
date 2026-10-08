import { useState, useEffect, useMemo } from "react";
import { formatWorkHours } from "../../../utils/vnTime";
import { getAuth } from "../../../services/auth/auth";
import AppLayout from "../../../components/layout/AppLayout";
import HistoryTable from "../components/HistoryTable";
import relatedApi from "../api/relatedApi";
import "../attendance.css";
import "../../employees/employee.css";

const AttendanceHistoryPage = () => {
    const auth = getAuth();
    const userId = auth?.userId;
    const employeeId = auth?.employeeId;

    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [month, setMonth] = useState(() => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()).slice(0, 7));
    const monthRows = useMemo(() => history.filter((row) => (row.attendanceDate || "").slice(0, 7) === month), [history, month]);
    const summary = useMemo(() => {
        const approved = monthRows.filter((row) => Number(row.approvalStatus) === 1 && [1, 2, 3].includes(Number(row.status)));
        const minutesOf = (row) => row.actualHours != null
            ? Math.max(0, Math.round(Number(row.actualHours) * 60))
            : row.checkInTime && row.checkOutTime
                ? Math.max(0, Math.floor((new Date(row.checkOutTime) - new Date(row.checkInTime)) / 60000)) : 0;
        return {
            days: new Set(approved.filter((row) => minutesOf(row) > 0).map((row) => row.attendanceDate.slice(0, 10))).size,
            hours: approved.reduce((total, row) => total + minutesOf(row), 0) / 60,
            pending: monthRows.filter((row) => Number(row.approvalStatus) === 0).length,
            rejected: monthRows.filter((row) => Number(row.approvalStatus) === 2).length,
        };
    }, [monthRows]);

    useEffect(() => {
        const load = async () => {
            try {
                if (userId) {
                    const p = await relatedApi.employeeByUser(userId);
                    setProfile(p.data.data || null);
                }
                if (employeeId) {
                    const res = await relatedApi.attendanceByEmployee(
                        employeeId
                    );
                    setHistory(res.data.data || []);
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "Không thể tải lịch sử chấm công."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [userId, employeeId]);

    return (
        <AppLayout profile={profile} mobileAttendance title="Lịch sử chấm công" subtitle="Giờ vào, giờ ra và trạng thái duyệt của bạn">
            {error && <div className="att-error">{error}</div>}
            {loading ? (
                <div className="att-loading">Đang tải...</div>
            ) : (
                <>
                    <section className="att-card att-month-summary">
                        <div className="att-month-summary-head">
                            <div><h2>Tổng công tháng {Number(month.slice(5))}/{month.slice(0, 4)}</h2><p className="att-muted">Chỉ cộng ngày và giờ công đã duyệt. Mỗi ngày được tính một lần.</p></div>
                            <label>Chọn tháng<input type="month" value={month} onChange={(event) => { if (event.target.value) setMonth(event.target.value); }} /></label>
                        </div>
                        <div className="att-month-summary-grid">
                            <div><span>Ngày công đã duyệt</span><strong>{summary.days} ngày</strong></div>
                            <div><span>Giờ công đã duyệt</span><strong>{formatWorkHours(summary.hours)}</strong></div>
                            <div><span>Chờ duyệt</span><strong>{summary.pending} bản ghi</strong><small>Chưa cộng vào tổng công</small></div>
                            <div><span>Bị từ chối</span><strong>{summary.rejected} bản ghi</strong><small>Không tính công</small></div>
                        </div>
                    </section>
                    <HistoryTable history={monthRows} />
                </>
            )}
        </AppLayout>
    );
};

export default AttendanceHistoryPage;
