import { STATUS_LABELS, STATUS_TONES } from "../hooks/useHrFilters";

// Bảng nhân sự: checkbox + Mã NV + Họ tên + Phòng ban + Chức vụ + Trạng thái
// + cột hành động (Sửa / Xóa, nếu có onEdit/onDelete).
const HrEmployeeTable = ({
    employees,
    selected,
    onToggle,
    onToggleAll,
    onEdit,
    onDelete,
}) => {
    const allSelected =
        employees.length > 0 && employees.every((e) => selected.has(e.id));
    const hasActions = !!(onEdit || onDelete);

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
                        <th>Họ và tên</th>
                        <th>Mã NV</th>
                        <th>Phòng ban</th>
                        <th>Chức vụ</th>
                        <th>Trạng thái</th>
                        {hasActions && <th />}
                    </tr>
                </thead>
                <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6 + (hasActions ? 1 : 0)}
                                className="hr-empty"
                            >
                                Không có nhân viên nào khớp bộ lọc.
                            </td>
                        </tr>
                    ) : (
                        employees.map((e) => (
                            <tr key={e.id}>
                                <td className="hr-col-check">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(e.id)}
                                        onChange={() => onToggle(e.id)}
                                        aria-label={"Chọn " + e.fullName}
                                    />
                                </td>
                                <td>{e.fullName}</td>
                                <td>{e.employeeCode}</td>
                                <td>{e.departmentName || "—"}</td>
                                <td>{e.positionName || "—"}</td>
                                <td>
                                    <span
                                        className={`hr-badge hr-badge--${STATUS_TONES[e.status] || "muted"}`}
                                    >
                                        {STATUS_LABELS[e.status] || "Chưa rõ"}
                                    </span>
                                </td>
                                {hasActions && (
                                    <td>
                                        <div className="admin-row-actions">
                                            {onEdit && (
                                                <button
                                                    type="button"
                                                    className="admin-link-btn"
                                                    onClick={() => onEdit(e)}
                                                >
                                                    Sửa
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    className="admin-link-btn admin-link-btn--danger"
                                                    onClick={() => onDelete(e)}
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HrEmployeeTable;
