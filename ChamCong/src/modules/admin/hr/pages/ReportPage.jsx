import { useState, useEffect, useMemo } from "react";
import HrLayout from "../layout/HrLayout";
import hrApi from "../api/hrApi";
import {
    ATT_STATUS_LABELS,
    ATT_STATUS_CLASS,
    APPROVAL_LABELS,
    APPROVAL_CLASS,
} from "../hrLabels";
import { formatVnTime, formatVnDate } from "../../../../utils/vnTime";
import "../../../../modules/attendance/attendance.css";
import "../../admin.css";

const pad = (n) => String(n).padStart(2, "0");
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

// Báo cáo nhân sự: chuyển đổi Ngày / Tháng + điều hướng ‹ ›.
// - Ngày: ai đi làm, đi trễ, vắng mặt, nghỉ phép + bảng từng người.
// - Tháng: tổng hợp từng nhân viên (số ngày công, giờ, trễ, vắng).
const ReportPage = () => {
    const [rows, setRows] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [mode, setMode] = useState("day"); // day | month
    const [cursor, setCursor] = useState(() => new Date());

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

    const isDay = mode === "day";
    const key = isDay ? dayKey(cursor) : monthKey(cursor);

    // Bản ghi của kỳ đang xem (ngày hoặc tháng).
    const periodRows = useMemo(
        () =>
            rows.filter((r) =>
                isDay
                    ? dayKey(new Date(r.attendanceDate)) === key
                    : monthKey(new Date(r.attendanceDate)) === key
            ),
        [rows, key, isDay]
    );

    // ===== CHẾ ĐỘ NGÀY =====
    const dayKpi = useMemo(() => {
        const present = periodRows.filter((r) => [1, 2, 3].includes(r.status));
        const late = periodRows.filter((r) => r.status === 2);
        const absent = periodRows.filter((r) => r.status === 4);
        const leave = periodRows.filter((r) => r.status === 5);
        const active = employees.filter((e) => [1, 2, 3].includes(e.status));
        return {
            active: active.length,
            present: present.length,
            late: late.length,
            absent: absent.length,
            leave: leave.length,
            pending: periodRows.filter((r) => r.approvalStatus === 0).length,
        };
    }, [periodRows, employees]);

    const periodLabel = isDay
        ? formatVnDate(cursor.toISOString())
        : cursor.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

    const shift = (delta) =>
        setCursor((d) => {
            if (isDay) return new Date(d.getTime() + delta * 86400000);
            return new Date(d.getFullYear(), d.getMonth() + delta, 1);
        });

    // ===== CHẾ ĐỘ THÁNG =====
    const monthPerEmployee = useMemo(
        () =>
            employees
                .map((emp) => {
                    const own = periodRows.filter((r) => r.employeeId === emp.id);
                    if (own.length === 0) return null;
                    return {
                        emp,
                        days: own.length,
                        worked: own.filter((r) => [1, 2, 3].includes(r.status)).length,
                        late: own.filter((r) => r.status === 2).length,
                        absent: own.filter((r) => r.status === 4).length,
                        leave: own.filter((r) => r.status === 5).length,
                        hours: own.reduce((s, r) => s + (r.actualHours || 0), 0),
                    };
                })
                .filter(Boolean),
        [employees, periodRows]
    );

    const KpiCard = ({ label, value, sub, tone }) => (
        <div className={`admin-kpi${tone ? ` admin-kpi--${tone}` : ""}`}>
            <span className="admin-kpi-label">{label}</span>
            <strong>{value}</strong>
            <span className="admin-kpi-sub">{sub}</span>
        </div>
    );

    return (
        <HrLayout title="Báo cáo" subtitle="Số liệu chấm công theo ngày hoặc tháng">
            {error && <div className="att-error">{error}</div>}
            {loading ? (
                <div className="att-loading">Đang tải...</div>
            ) : (
                <div className="att-content">
                    {/* Thanh điều hướng + chế độ */}
                    <section className="att-card">
                        <div className="admin-toolbar">
                            <button type="button" className="admin-toggle" onClick={() => shift(-1)} aria-label="Kỳ trước">
                                ‹
                            </button>
                            <strong style={{ fontSize: 16, fontWeight: 800, color: "#0e1a26" }}>
                                {periodLabel}
                            </strong>
                            <button type="button" className="admin-toggle" onClick={() => shift(1)} aria-label="Kỳ sau">
                                ›
                            </button>
                            <button
                                type="button"
                                className="admin-toggle"
                                onClick={() => {
                                    setCursor(new Date());
                                }}
                            >
                                {isDay ? "Hôm nay" : "Tháng này"}
                            </button>
                            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                                <button
                                    type="button"
                                    className={`admin-toggle${isDay ? " hr-approve-btn hr-approve-btn--ok" : ""}`}
                                    onClick={() => setMode("day")}
                                >
                                    Theo ngày
                                </button>
                                <button
                                    type="button"
                                    className={`admin-toggle${!isDay ? " hr-approve-btn hr-approve-btn--ok" : ""}`}
                                    onClick={() => setMode("month")}
                                >
                                    Theo tháng
                                </button>
                            </div>
                        </div>

                        <div className="admin-kpi-row">
                            {isDay ? (
                                <>
                                    <KpiCard label="Đang làm" value={dayKpi.active} sub="người hoạt động" />
                                    <KpiCard label="Có mặt" value={dayKpi.present} sub="chấm công hôm nay" tone="ok" />
                                    <KpiCard label="Đi trễ" value={dayKpi.late} sub="lượt" />
                                    <KpiCard label="Vắng mặt" value={dayKpi.absent} sub="lượt" tone={dayKpi.absent ? "bad" : ""} />
                                    <KpiCard label="Chờ duyệt" value={dayKpi.pending} sub="bản ghi" tone={dayKpi.pending ? "ok" : ""} />
                                </>
                            ) : (
                                <>
                                    <KpiCard label="Nhân viên" value={employees.length} sub="trong công ty" />
                                    <KpiCard label="Có ngày công" value={monthPerEmployee.length} sub="người trong tháng" tone="ok" />
                                    <KpiCard label="Tổng giờ" value={`${monthPerEmployee.reduce((s, x) => s + x.hours, 0)}h`} sub="giờ thực tế" />
                                    <KpiCard label="Đi trễ" value={monthPerEmployee.reduce((s, x) => s + x.late, 0)} sub="lượt" />
                                    <KpiCard label="Vắng mặt" value={monthPerEmployee.reduce((s, x) => s + x.absent, 0)} sub="lượt" tone={monthPerEmployee.some((x) => x.absent) ? "bad" : ""} />
                                </>
                            )}
                        </div>
                    </section>

                    {/* Chi tiết từng nhân viên trong kỳ */}
                    <section className="att-card" style={{ marginTop: 18 }}>
                        <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#182a3a" }}>
                            {isDay
                                ? `Chi tiết ${periodLabel} · ${periodRows.length} bản ghi`
                                : `Tổng hợp từng nhân viên · ${monthPerEmployee.length} người`}
                        </h2>
                        <div className="att-table-wrap">
                            <table className="att-table">
                                <thead>
                                    <tr>
                                        <th>Nhân viên</th>
                                        {isDay ? (
                                            <>
                                                <th>Trạng thái</th>
                                                <th>Giờ vào → ra</th>
                                                <th>Giờ thực</th>
                                                <th>Duyệt</th>
                                            </>
                                        ) : (
                                            <>
                                                <th>Ngày công</th>
                                                <th>Đi trễ</th>
                                                <th>Vắng mặt</th>
                                                <th>Nghỉ phép</th>
                                                <th>Tổng giờ</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isDay ? (
                                        periodRows.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="att-muted">
                                                    Chưa có bản ghi chấm công ngày này.
                                                </td>
                                            </tr>
                                        ) : (
                                            periodRows.map((r) => {
                                                const e = empMap[r.employeeId];
                                                return (
                                                    <tr key={r.id}>
                                                        <td>
                                                            {e
                                                                ? `${e.employeeCode} · ${e.fullName}`
                                                                : r.employeeName || "—"}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`att-badge ${ATT_STATUS_CLASS[r.status] || ""}`}
                                                            >
                                                                {ATT_STATUS_LABELS[r.status] || "—"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {formatVnTime(r.checkInTime) || "—"} →{" "}
                                                            {formatVnTime(r.checkOutTime) || "—"}
                                                        </td>
                                                        <td>
                                                            {r.actualHours != null ? `${r.actualHours}h` : "—"}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`att-badge ${APPROVAL_CLASS[r.approvalStatus] || ""}`}
                                                            >
                                                                {APPROVAL_LABELS[r.approvalStatus]}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )
                                    ) : monthPerEmployee.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="att-muted">
                                                Chưa có dữ liệu trong tháng này.
                                            </td>
                                        </tr>
                                    ) : (
                                        monthPerEmployee.map(({ emp, days, worked, late, absent, leave, hours }) => (
                                            <tr key={emp.id}>
                                                <td>
                                                    <strong>{emp.fullName}</strong>{" "}
                                                    <span className="att-muted">{emp.employeeCode}</span>
                                                </td>
                                                <td>{worked} / {days}</td>
                                                <td>{late}</td>
                                                <td>{absent}</td>
                                                <td>{leave}</td>
                                                <td>{hours}h</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}
        </HrLayout>
    );
};

export default ReportPage;
