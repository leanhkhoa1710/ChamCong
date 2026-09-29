import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import AdminAppLayout from "../../layout/AdminAppLayout";
import adminAttendanceApi from "../api/adminAttendanceApi";
import AttendanceFormModal from "../components/AttendanceFormModal";
import { statusLabel, statusClass, approvalLabel, approvalClass } from "../labels";
import { formatVnTime, formatVnDate } from "../../../../utils/vnTime";
import { toCsv, downloadCsv } from "../../hr/hrUtils";
import { getAuth } from "../../../../services/auth/auth";
import "../../../../modules/attendance/attendance.css";
import "../../admin.css";

// Trang quản trị: lịch sử chấm công của TOÀN BỘ nhân viên,
// + KPI (chấm hôm nay / bất thường / chờ duyệt), duyệt công,
// xuất file theo tháng và báo cáo công việc.
const AdminAttendanceHistoryPage = () => {
    const [rows, setRows] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [logs, setLogs] = useState([]);
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
            const [a, e, lg] = await Promise.all([
                adminAttendanceApi.attendanceAll(),
                adminAttendanceApi.employeesAll(),
                adminAttendanceApi.logsAll ? adminAttendanceApi.logsAll() : Promise.resolve(null),
            ]);
            setRows(a.data.data?.items || []);
            setEmployees(e.data.data?.items || []);
            if (lg?.data?.data) setLogs(lg.data.data.items || []);
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

    // ===== KPI + báo cáo =====
    const kpi = useMemo(() => {
        const todayKey = new Date(
            Date.now() +
                new Date().getTimezoneOffset() * 60000 +
                7 * 3600000
        );
        const todayVN = `${todayKey.getFullYear()}-${String(todayKey.getMonth() + 1).padStart(2, "0")}-${String(todayKey.getDate()).padStart(2, "0")}`;
        const logToday = logs.filter((l) => {
            if (!l.logTime) return false;
            const t = new Date(l.logTime).getTime() + new Date(l.logTime).getTimezoneOffset() * 60000;
            const d = new Date(t + 7 * 3600000);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` === todayVN;
        });
        const checkedInToday = new Set(logToday.filter((l) => l.type === 1).map((l) => l.employeeId)).size;
        const abnormalToday = logToday.filter((l) => l.isAdjusted || l.type === 2).length;
        const pending = rows.filter((r) => r.approvalStatus === 0).length;
        const monthRows = month
            ? filtered
            : rows.filter((r) => {
                  const d = new Date(r.attendanceDate);
                  return d.getMonth() === todayKey.getMonth() && d.getFullYear() === todayKey.getFullYear();
              });
        const hours = monthRows.reduce((s, r) => s + (Number(r.actualHours) || 0), 0);
        const late = monthRows.filter((r) => [2, 3].includes(r.status)).length;
        const absent = monthRows.filter((r) => r.status === 4).length;
        return { checkedInToday, abnormalToday, pending, hours, late, absent, people: new Set(monthRows.map((r) => r.employeeId)).size };
    }, [rows, logs, filtered, month]);

    // ===== Duyệt công (thấp / cao cấp: duyệt / từ chối) =====
    const approve = async (row, ok) => {
        const auth = getAuth();
        if (!auth?.employeeId) {
            alert("Không xác định được người duyệt (chưa liên kết nhân viên).");
            return;
        }
        try {
            await adminAttendanceApi.approve({
                id: row.id,
                approvalStatus: ok ? 1 : 2,
                approvedBy: auth.employeeId,
            });
            load();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    // ===== Xuất file theo tháng (CSV) =====
    const exportMonth = () => {
        const target = month
            ? filtered
            : rows.filter((r) => {
                  const d = new Date(r.attendanceDate);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              });
        const rowsCsv = target.map((r) => {
            const e = empMap[r.employeeId];
            return {
                "Mã NV": r.employeeCode || e?.employeeCode || "",
                "Họ tên": e?.fullName || "",
                "Ngày": formatVnDate(r.attendanceDate),
                "Giờ vào": formatVnTime(r.checkInTime) || "",
                "Giờ ra": formatVnTime(r.checkOutTime) || "",
                "Giờ công": r.actualHours != null ? `${r.actualHours}h` : "",
                "Trạng thái": statusLabel(r.status),
                "Duyệt": approvalLabel(r.approvalStatus),
            };
        });
        const headers = Object.keys(rowsCsv[0] || { "Mã NV": "" });
        downloadCsv(
            `cham-cong-${month || new Date().toISOString().slice(0, 7)}.csv`,
            toCsv(rowsCsv, headers)
        );
    };

    const doDelete = async (row) => {
        const e = empMap[row.employeeId];
        if (!window.confirm(`Xóa bản ghi ${formatVnDate(row.attendanceDate)} của ${e?.fullName || row.employeeCode}?`)) return;
        try {
            await adminAttendanceApi.softDelete(row.id);
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
                await adminAttendanceApi.update(payload);
            } else {
                // Create chỉ nhận các field của CreateAttendanceModelView
                await adminAttendanceApi.create({
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
        <AdminAppLayout
            title="Lịch sử chấm công · Quản trị"
            subtitle="Toàn bộ bản ghi chấm công của tất cả nhân viên"
        >
            <div className="att-content">
                {error && <div className="att-error">{error}</div>}
                {loading ? (
                    <div className="att-loading">Đang tải...</div>
                ) : (
                    <>
                        {/* KPI + báo cáo */}
                        <div className="admin-kpi-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                            <div className="admin-kpi">
                                <span className="admin-kpi-label">Chấm công hôm nay</span>
                                <strong>{kpi.checkedInToday}</strong>
                                <span className="admin-kpi-sub">người đã vào ca</span>
                            </div>
                            <div className="admin-kpi admin-kpi--bad">
                                <span className="admin-kpi-label">Công bất thường</span>
                                <strong>{kpi.abnormalToday}</strong>
                                <span className="admin-kpi-sub">lượt cần xem lại hôm nay</span>
                            </div>
                            <div className="admin-kpi admin-kpi--ok">
                                <span className="admin-kpi-label">Đang chờ duyệt</span>
                                <strong>{kpi.pending}</strong>
                                <span className="admin-kpi-sub">bản ghi chưa phê duyệt</span>
                            </div>
                            <div className="admin-kpi">
                                <span className="admin-kpi-label">Báo cáo công việc</span>
                                <strong>{kpi.hours}h</strong>
                                <span className="admin-kpi-sub">
                                    {kpi.people} người · trễ {kpi.late} · vắng {kpi.absent} (tháng)
                                </span>
                            </div>
                        </div>

                        <section className="att-card">
                            <div className="admin-toolbar">
                                <select
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                >
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
                                    onClick={exportMonth}
                                >
                                    ⬇ Xuất file tháng
                                </button>
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
                                                <td colSpan={7}>
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
                                                            className={`att-badge ${statusClass(row.status)}`}
                                                        >
                                                            {statusLabel(row.status)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {formatVnTime(row.checkInTime) || "—"} →{" "}
                                                        {formatVnTime(row.checkOutTime) || "—"}
                                                    </td>
                                                    <td>{row.actualHours != null ? `${row.actualHours}h` : "—"}</td>
                                                    <td>
                                                        <span
                                                            className={`att-badge ${approvalClass(row.approvalStatus)}`}
                                                        >
                                                            {approvalLabel(row.approvalStatus)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="admin-row-actions">
                                                            {row.approvalStatus === 0 && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-link-btn"
                                                                        onClick={() => approve(row, true)}
                                                                    >
                                                                        Duyệt
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-link-btn admin-link-btn--danger"
                                                                        onClick={() => approve(row, false)}
                                                                    >
                                                                        Từ chối
                                                                    </button>
                                                                </>
                                                            )}
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
                    </>
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
        </AdminAppLayout>
    );
};

export default AdminAttendanceHistoryPage;
