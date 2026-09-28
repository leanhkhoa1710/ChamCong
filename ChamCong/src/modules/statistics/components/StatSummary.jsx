import { hoursShort } from "./statUtils";

// Khối "Tổng giờ" + "Tăng ca" (dưới cùng trang thống kê).
const StatSummary = ({ stats }) => {
    const missingHours = Math.max(0, stats.standardMin - stats.hoursWorked);
    return (
        <div className="att-stat-bottom">
            <div className="att-card att-stat-card">
                <h2 className="att-stat-title">Tổng giờ</h2>
                <div className="att-stat-rows">
                    <div className="att-stat-row">
                        <span>Giờ chuẩn</span>
                        <strong>{hoursShort(stats.standardMin)}</strong>
                    </div>
                    <div className="att-stat-row">
                        <span>Giờ thực tế</span>
                        <strong>{hoursShort(stats.hoursWorked)}</strong>
                    </div>
                    <div className="att-stat-row">
                        <span>Giờ thiếu</span>
                        <strong>{hoursShort(missingHours)}</strong>
                    </div>
                </div>
            </div>
            <div className="att-card att-stat-card">
                <h2 className="att-stat-title">Tăng ca</h2>
                <div className="att-stat-rows">
                    <div className="att-stat-row">
                        <span>Ngày thường</span>
                        <strong>{hoursShort(stats.otWeekday)}</strong>
                    </div>
                    <div className="att-stat-row">
                        <span>Cuối tuần</span>
                        <strong>{hoursShort(stats.otWeekend)}</strong>
                    </div>
                    <div className="att-stat-row">
                        <span>Ngày lễ</span>
                        <strong>{hoursShort(stats.otHoliday)}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatSummary;
