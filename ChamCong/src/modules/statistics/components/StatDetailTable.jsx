import { formatVnTime } from "../../../utils/vnTime";
import { dkey, durMin, durHm, pad2 } from "./statUtils";

// Bảng chi tiết chấm công trong tháng (đồng bộ lịch sử chấm công).
const StatDetailTable = ({ monthRows, holidayMap }) => {
    if (!monthRows.length) {
        return (
            <div className="att-card att-stat-card">
                <h2 className="att-stat-title">Chi tiết chấm công</h2>
                <p className="att-muted">
                    Chưa có bản ghi chấm công trong tháng này.
                </p>
            </div>
        );
    }

    return (
        <div className="att-card att-stat-card">
            <h2 className="att-stat-title">Chi tiết chấm công</h2>
            <div className="att-table-wrap">
                <table className="att-table att-stat-table">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Ca</th>
                            <th>Vào</th>
                            <th>Ra</th>
                            <th>Giờ công</th>
                            <th>OT</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthRows.map((row) => {
                            const dd = new Date(row.attendanceDate);
                            const inT = row.checkInTime
                                ? formatVnTime(row.checkInTime)
                                : "";
                            const outT = row.checkOutTime
                                ? formatVnTime(row.checkOutTime)
                                : "";
                            const counted = Number(row.approvalStatus) === 1;
                            const rejected = Number(row.approvalStatus) === 2;
                            const mins = !counted ? 0 :
                                inT && outT
                                    ? durMin(row.checkInTime, row.checkOutTime)
                                    : (row.actualHours || 0) * 60;
                            const dayKey = dkey(dd);
                            const weekend = dd.getDay() === 0 || dd.getDay() === 6;
                            const overtime = !inT || !outT
                                ? 0
                                : holidayMap?.[dayKey] === 3 || weekend
                                    ? mins
                                    : Math.max(0, mins - 8 * 60);
                            const short =
                                !outT || row.status === 2 || row.status === 3;
                            return (
                                <tr key={row.id}>
                                    <td>
                                        {pad2(dd.getDate())}/
                                        {pad2(dd.getMonth() + 1)}
                                    </td>
                                    <td>{row.plannedShiftName || "Hành chính"}</td>
                                    <td>{inT || "—"}</td>
                                    <td>{outT || "—"}</td>
                                    <td>{durHm(mins)}</td>
                                    <td>{durHm(overtime)}</td>
                                    <td>
                                        <span
                                            className={`att-badge ${rejected ? "bad" : !counted || short ? "warn" : "ok"}`}
                                        >
                                            {rejected ? "Từ chối — không tính công" : !counted ? "Chờ duyệt — chưa tính công" : short
                                                ? "● Thiếu công"
                                                : "● Đủ công"}
                                        </span>
                                        {rejected && <div className="att-muted">Lý do: {row.note || "HR chưa ghi lý do"}</div>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StatDetailTable;
