import { Link } from "react-router-dom";

// Khối cảnh báo "Bạn cần kiểm tra" (chỉ hiện khi có việc cần xử lý).
const StatWarnings = ({ warnings }) => {
    const hasItems = warnings.list.length > 0 || warnings.noDataDays > 0;
    if (!hasItems) return null;

    return (
        <div className="att-card att-stat-card att-stat-warn">
            <h2 className="att-stat-title">⚠ Bạn cần kiểm tra</h2>
            <ul className="att-stat-warn-list">
                {warnings.list.map((w, i) => (
                    <li key={i}>{w}</li>
                ))}
                {warnings.noDataDays > 0 && (
                    <li>
                        Hiện còn {warnings.noDataDays} ngày chưa có dữ liệu
                        chấm công
                    </li>
                )}
            </ul>
            <div className="att-stat-warn-foot">
                <Link to="/attendance-history">Xem chi tiết →</Link>
            </div>
        </div>
    );
};

export default StatWarnings;
