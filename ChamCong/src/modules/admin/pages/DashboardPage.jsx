import { useState } from "react";
import AppLayout from "../../../components/layout/AppLayout";
import "../../../modules/attendance/attendance.css";
import "../admin.css";
import { useAdminData } from "../hooks/useAdminData";
import { useAdminTasks } from "../hooks/useAdminTasks";

const AdminDashboard = () => {
    const data = useAdminData();
    const { t, kpi, tasks, activationNote } = useAdminTasks(data);

    const [collapsed, setCollapsed] = useState(false);
    const [alertClosed, setAlertClosed] = useState(false);

    const tiles = [
        { label: "Tổng nhân sự", value: kpi.total, sub: "người đang làm việc", tone: "neutral" },
        { label: "Đã vào ca", value: kpi.checkedIn, sub: "chấm vào hôm nay", tone: "neutral" },
        { label: "Bất thường", value: kpi.abnormal, sub: "lượt chấm cần duyệt tay", tone: "ok" },
        { label: "Chờ duyệt", value: kpi.pendingApproval, sub: "đơn công & bảng lương", tone: "ok" },
        { label: "Cần xử lý", value: tasks.length, sub: "đang chờ trong hàng đợi", tone: "bad" },
    ];

    return (
        <AppLayout
            title="Trung tâm việc"
            subtitle="Tổng quan hoạt động nhân sự hôm nay"
        >
            <div className="att-content">
                {data.error && <div className="att-error">{data.error}</div>}
                {data.loading && <div className="att-loading">Đang tải...</div>}

                {!data.loading && !data.error && (
                    <div className="admin-wrap">
                        <section className="admin-card admin-today">
                            <div className="admin-today-head">
                                <span className="admin-today-ico">📅</span>
                                <strong>Hôm nay · {t.label}</strong>
                            </div>
                            <div className="admin-kpi-row">
                                {tiles.map((x) => (
                                    <div
                                        key={x.label}
                                        className={`admin-kpi admin-kpi--${x.tone}`}
                                    >
                                        <span className="admin-kpi-label">{x.label}</span>
                                        <strong>{x.value}</strong>
                                        <span className="admin-kpi-sub">{x.sub}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="admin-card admin-tasks">
                            <div className="admin-tasks-head">
                                <strong>🔔 TRUNG TÂM VIỆC — {tasks.length}</strong>
                                <button
                                    type="button"
                                    className="admin-toggle"
                                    onClick={() => setCollapsed((v) => !v)}
                                >
                                    {collapsed ? "Mở rộng" : "Thu gọn"}
                                </button>
                            </div>

                            {!collapsed && (
                                <div className="admin-tasks-body">
                                    <div className="admin-pill">
                                        ≡ CẦN LÀM · {tasks.length}
                                    </div>

                                    {activationNote && !alertClosed && (
                                        <div className="admin-alert">
                                            <div className="admin-alert-head">
                                                <strong>{activationNote}</strong>
                                                <button
                                                    type="button"
                                                    className="admin-alert-close"
                                                    aria-label="Đóng"
                                                    onClick={() => setAlertClosed(true)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <p>
                                                Mã có hạn 72 giờ. Nhắc người
                                                lao động đặt mật khẩu trước khi
                                                hết hạn.
                                            </p>
                                            <button
                                                type="button"
                                                className="admin-link-btn"
                                                onClick={() => (window.location.href = "/employees")}
                                            >
                                                Nhắc kích hoạt →
                                            </button>
                                        </div>
                                    )}

                                    <div className="admin-card admin-table-card">
                                        <h3>Việc cần làm — {tasks.length}</h3>
                                        {tasks.length === 0 ? (
                                            <p className="att-muted">
                                                Không có việc nào cần xử lý.
                                                Tuyệt vời!
                                            </p>
                                        ) : (
                                            <div className="att-table-wrap">
                                                <table className="att-table admin-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Công việc</th>
                                                            <th>Trạng thái</th>
                                                            <th>Phụ trách</th>
                                                            <th>Hạn</th>
                                                            <th>Rủi ro nếu bỏ qua</th>
                                                            <th />
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tasks.map((x) => (
                                                            <tr key={x.id}>
                                                                <td>
                                                                    <strong>{x.title}</strong>
                                                                    <span className="admin-sub">
                                                                        {x.sub}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className={`att-badge ${x.cls}`}
                                                                    >
                                                                        {x.status}
                                                                    </span>
                                                                </td>
                                                                <td>{x.owner}</td>
                                                                <td>{x.deadline}</td>
                                                                <td className="admin-risk">
                                                                    {x.risk}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        className="admin-link-btn"
                                                                        onClick={() =>
                                                                            (window.location.href = x.to)
                                                                        }
                                                                    >
                                                                        {x.action}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default AdminDashboard;
