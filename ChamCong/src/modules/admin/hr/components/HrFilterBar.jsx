import { useRef } from "react";
import { STATUS_LABELS } from "../hooks/useHrFilters";

// Thanh bộ lọc + nút nhập/xuất Excel (CSV) + nút thêm nhân viên.
const HrFilterBar = ({
    departments,
    positions,
    filters,
    setters,
    onAdd,
    hasActiveFilter,
    onImportFile,
    onExport,
    onTemplate,
}) => {
    const fileRef = useRef(null);

    return (
        <div className="hr-filter-bar">
            <input
                type="search"
                className="hr-input hr-input--search"
                placeholder="🔍 Tìm tên, mã NV, email..."
                value={filters.search}
                onChange={(e) => setters.setSearch(e.target.value)}
            />
            <select
                className="hr-select"
                value={filters.department}
                onChange={(e) => setters.setDepartment(e.target.value)}
            >
                <option value="">Phòng ban</option>
                {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                ))}
            </select>
            <select
                className="hr-select"
                value={filters.position}
                onChange={(e) => setters.setPosition(e.target.value)}
            >
                <option value="">Chức vụ</option>
                {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>
            <select
                className="hr-select"
                value={filters.status}
                onChange={(e) => setters.setStatus(e.target.value)}
            >
                <option value="">Trạng thái</option>
                {Object.entries(STATUS_LABELS).map(([v, label]) => (
                    <option key={v} value={v}>
                        {label}
                    </option>
                ))}
            </select>

            {hasActiveFilter && (
                <button
                    type="button"
                    className="hr-btn hr-btn--ghost"
                    onClick={setters.reset}
                >
                    ✕ Xóa lọc
                </button>
            )}

            <div className="hr-actions">
                <button
                    type="button"
                    className="hr-btn hr-btn--ghost"
                    onClick={() => fileRef.current?.click()}
                >
                    ⬆ Nhập Excel
                </button>
                <button
                    type="button"
                    className="hr-btn hr-btn--ghost"
                    onClick={onTemplate}
                >
                    ⬇ Tải mẫu
                </button>
                <button
                    type="button"
                    className="hr-btn hr-btn--ghost"
                    onClick={onExport}
                >
                    ⬇ Xuất danh sách
                </button>
                <button
                    type="button"
                    className="hr-btn hr-btn--primary"
                    onClick={onAdd}
                >
                    + Thêm nhân viên
                </button>
            </div>

            <input
                ref={fileRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                hidden
                onChange={(e) => {
                    onImportFile?.(e.target.files?.[0]);
                    e.target.value = "";
                }}
            />
        </div>
    );
};

export default HrFilterBar;
