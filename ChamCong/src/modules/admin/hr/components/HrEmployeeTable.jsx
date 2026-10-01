import { STATUS_LABELS, STATUS_TONES } from "../hooks/useHrFilters";
import { docCompleteness } from "../hrUtils";

// Bảng nhân sự: checkbox + Mã NV + Họ tên + Phòng ban + Chức vụ + Trạng thái
// + Lương + Hồ sơ % + Còn thiếu + Xem/Sửa/Lưu trữ.
const HrEmployeeTable = ({
    employees,
    selected,
    onToggle,
    onToggleAll,
    data,
    onView,
    onEdit,
    onArchive,
    onDelete,
}) => {
    const allSelected =
        employees.length > 0 && employees.every((e) => selected.has(e.id));

    return (
        <div className="hr-table-wrap">
            <table className="hr-table">
                <thead>
                    <tr>
                        <th className="hr-col-check">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={() => onToggleAll(allSelected)}
                                aria-label="Chọn tất cả"
                            />
                        </th>
                        <th>Mã NV</th>
                        <th>Họ và tên</th>
                        <th>Phòng ban</th>
                        <th>Chức vụ</th>
                        <th>Trạng thái</th>
                        <th>Lương</th>
                        <th>Hồ sơ</th>
                        <th>Còn thiếu</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="hr-empty">
                                Không có nhân viên nào khớp bộ lọc.
                            </td>
                        </tr>
                    ) : (
                        employees.map((e) => {
                            const comp = docCompleteness(e, data);
                            const archived = [4, 5].includes(e.status);
                            return (
                                <tr key={e.id}>
                                    <td className="hr-col-check">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(e.id)}
                                            onChange={() => onToggle(e.id)}
                                            aria-label={"Chọn " + e.fullName}
                                        />
                                    </td>
                                    <td>{e.employeeCode}</td>
                                    <td>{e.fullName}</td>
                                    <td>{e.departmentName || "—"}</td>
                                    <td>{e.positionName || "—"}</td>
                                    <td>
                                        <span
                                            className={`hr-badge hr-badge--${STATUS_TONES[e.status] || "muted"}`}
                                        >
                                            {STATUS_LABELS[e.status] || "Chưa rõ"}
                                        </span>
                                    </td>
                                    <td>
                                        {data.salaryMap?.get(e.id) ?? "—"}
                                    </td>
                                    <td>
                                        <span
                                            className={`hr-doc ${comp.percent === 100 ? "hr-doc--full" : ""}`}
                                        >
                                            {comp.percent}%
                                        </span>
                                    </td>
                                    <td className="hr-missing">
                                        {comp.missing.length
                                            ? comp.missing.join(", ")
                                            : "Đủ"}
                                    </td>
                                    <td>
                                        <div className="hr-row-actions">
                                            <button
                                                type="button"
                                                className="hr-mini-btn"
                                                onClick={() => onView(e)}
                                            >
                                                Xem
                                            </button>
                                            <button
                                                type="button"
                                                className="hr-mini-btn"
                                                onClick={() => onEdit(e)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                className="hr-mini-btn hr-mini-btn--archive"
                                                onClick={() => onArchive(e)}
                                                disabled={archived}
                                                title={archived ? "Nhân viên đã được lưu trữ" : "Lưu hồ sơ vào danh sách đã nghỉ"}
                                            >
                                                {archived ? "Đã lưu trữ" : "Lưu trữ"}
                                            </button>
                                            <button type="button" className="hr-mini-btn hr-mini-btn--delete" onClick={() => onDelete(e)} title="Xóa hồ sơ">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HrEmployeeTable;
