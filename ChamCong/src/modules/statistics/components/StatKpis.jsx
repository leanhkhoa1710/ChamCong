import { hoursShort } from "./statUtils";

// KPI "Ngày công / Giờ làm / Đi trễ / Nghỉ phép" + thanh điều hướng tháng.
const StatKpis = ({ ym, stats, onShiftMonth }) => {
    const monthLabel = new Date(ym.y, ym.m, 1)
        .toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
        .toUpperCase();
    const missingDays = Math.max(0, stats.expectedWorkdays - stats.daysWorked);
    const missingHours = Math.max(0, stats.standardMin - stats.hoursWorked);
    const pct = (a, b) => (b > 0 ? Math.min(100, Math.round((a / b) * 100)) : 0);

    return (
        <>
            <div className="att-kpi-bar">
                <button
                    type="button"
                    className="att-kpi-nav"
                    onClick={() => onShiftMonth(-1)}
                    aria-label="Tháng trước"
                >
                    &lsaquo;
                </button>
                <strong className="att-stat-month">{monthLabel}</strong>
                <button
                    type="button"
                    className="att-kpi-nav"
                    onClick={() => onShiftMonth(1)}
                    aria-label="Tháng sau"
                >
                    &rsaquo;
                </button>
            </div>

            <div className="att-stat-kpi-grid">
                <div className="att-card att-stat-kpi">
                    <span className="att-kpi-label">Ngày công</span>
                    <div className="att-stat-value">
                        <strong>{stats.daysWorked}</strong>
                        <span className="att-stat-fraction">
                            / {stats.expectedWorkdays}
                        </span>
                    </div>
                    <span className="att-stat-unit">ngày công</span>
                    <div className="att-stat-bar">
                        <div
                            className="att-stat-bar-fill ok"
                            style={{ width: `${pct(stats.daysWorked, stats.expectedWorkdays)}%` }}
                        />
                    </div>
                    <span className="att-stat-sub">
                        {missingDays > 0
                            ? `Còn thiếu ${missingDays} ngày`
                            : "✓ Đủ ngày công kỳ vọng"}
                    </span>
                </div>

                <div className="att-card att-stat-kpi">
                    <span className="att-kpi-label">Giờ làm</span>
                    <div className="att-stat-value">
                        <strong>{hoursShort(stats.hoursWorked)}</strong>
                        <span className="att-stat-fraction">
                            / {hoursShort(stats.standardMin)}
                        </span>
                    </div>
                    <span className="att-stat-unit">giờ công</span>
                    <div className="att-stat-bar">
                        <div
                            className="att-stat-bar-fill info"
                            style={{ width: `${pct(stats.hoursWorked, stats.standardMin)}%` }}
                        />
                    </div>
                    <span className="att-stat-sub">
                        {missingHours > 0
                            ? `Còn thiếu ${hoursShort(missingHours)}`
                            : "✓ Đủ giờ công kỳ vọng"}
                    </span>
                </div>

                <div className="att-card att-stat-kpi">
                    <span className="att-kpi-label">Đi trễ</span>
                    <div className="att-stat-value">
                        <strong>{stats.late}</strong>
                    </div>
                    <span className="att-stat-unit">lần</span>
                    <div className="att-stat-bar">
                        <div
                            className={`att-stat-bar-fill ${stats.late > 0 ? "warn" : "ok"}`}
                            style={{ width: `${pct(stats.late, stats.daysWorked)}%` }}
                        />
                    </div>
                    <span className="att-stat-sub">
                        {stats.late > 0
                            ? `${stats.late} lần đi trễ trong tháng`
                            : "✓ Không có lần đi trễ"}
                    </span>
                </div>

                <div className="att-card att-stat-kpi">
                    <span className="att-kpi-label">Nghỉ phép</span>
                    <div className="att-stat-value">
                        <strong>{stats.leaveDays}</strong>
                    </div>
                    <span className="att-stat-unit">ngày</span>
                    <div className="att-stat-bar">
                        <div
                            className="att-stat-bar-fill info"
                            style={{ width: `${pct(stats.leaveDays, stats.expectedWorkdays)}%` }}
                        />
                    </div>
                    <span className="att-stat-sub">
                        {stats.hasQuota
                            ? `Phép còn lại: ${Math.round(stats.remainingLeave)} ngày`
                            : "Chưa cấu hình hạn mức phép"}
                    </span>
                </div>
            </div>
        </>
    );
};

export default StatKpis;
