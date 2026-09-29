import { useState, useMemo } from "react";
import AdminAppLayout from "../../layout/AdminAppLayout";
import adminApi from "../../api/adminApi";
import { useHrData } from "../hooks/useHrData";
import { useHrKpis } from "../hooks/useHrKpis";
import { useHrFilters } from "../hooks/useHrFilters";
import HrKpiCards from "../components/HrKpiCards";
import HrFilterBar from "../components/HrFilterBar";
import HrEmployeeTable from "../components/HrEmployeeTable";
import HrPagination from "../components/HrPagination";
import HrAddForm from "../components/HrAddForm";
import { downloadCsv, hrTemplate, exportEmployees, parseCsv } from "../hrUtils";
import "../../../../modules/attendance/attendance.css";
import "../hr.css";

const PAGE_SIZE = 20;

const HrPage = () => {
    const data = useHrData();
    const kpis = useHrKpis(data);
    const { filters, setters, filtered, hasActiveFilter } = useHrFilters(
        data.employees
    );
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(() => new Set());
    const [showForm, setShowForm] = useState(false);
    const [viewEmp, setViewEmp] = useState(null);
    const [tab, setTab] = useState("active"); // active | archive

    const active = filtered.filter((e) => [1, 2, 3].includes(e.status));
    const resigned = filtered.filter((e) => [4, 5].includes(e.status));
    const list = tab === "active" ? active : resigned;

    const pageCount = Math.ceil(list.length / PAGE_SIZE);
    const safePage = Math.min(page, Math.max(1, pageCount));
    const slice = list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    // Lương theo nhân viên (từ bảng lương thật)
    const salaryMap = useMemo(() => {
        const m = new Map();
        data.salaries.forEach((s) => m.set(s.employeeId, s.basicSalary));
        return m;
    }, [data.salaries]);

    const toggle = (id) =>
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    const toggleAll = (uncheck) =>
        setSelected(
            uncheck ? new Set() : new Set(slice.map((e) => e.id))
        );

    // ===== CSV (nhập / xuất / mẫu) =====
    const onTemplate = () =>
        downloadCsv("mau-nhan-vien.csv", hrTemplate());
    const onExport = () =>
        downloadCsv(
            "danh-sach-nhan-vien.csv",
            exportEmployees(list, salaryMap)
        );
    const onImportFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const rows = parseCsv(String(reader.result));
            if (rows.length < 2) {
                alert("File rỗng hoặc thiếu dữ liệu.");
                return;
            }
            const headers = rows[0].map((h) => h.trim());
            let ok = 0;
            for (let i = 1; i < rows.length; i++) {
                const g = (k) => {
                    const idx = headers.indexOf(k);
                    return idx >= 0 ? (rows[i][idx] || "").trim() : "";
                };
                const code = g("EmployeeCode");
                const given = g("GivenName");
                const fam = g("FamilyName");
                if (!code || (!given && !fam)) continue; // bỏ dòng thiếu bắt buộc
                try {
                    await adminApi.createEmployee({
                        employeeCode: code,
                        givenName: given,
                        familyName: fam,
                        email: g("Email") || null,
                        phoneNumber: g("PhoneNumber") || null,
                    });
                    ok++;
                } catch {
                    /* bỏ qua dòng lỗi, tiếp tục */
                }
            }
            alert(`Đã nhập ${ok} nhân viên từ file (CSV).`);
            location.reload();
        };
        reader.readAsText(file, "utf-8");
    };

    return (
        <AdminAppLayout
            title="Nhân sự"
            subtitle="Quản lý nhân viên, chấm công, hợp đồng & hồ sơ lương"
        >
            <div className="att-content">
                {data.error && <div className="att-error">{data.error}</div>}
                {data.loading && (
                    <div className="att-loading">Đang tải...</div>
                )}

                {!data.loading && !data.error && (
                    <div className="hr-body">
                        <HrKpiCards kpis={kpis} />

                        <div className="hr-tabs">
                            <button
                                type="button"
                                className={`hr-tab${tab === "active" ? " active" : ""}`}
                                onClick={() => setTab("active")}
                            >
                                Nhân sự đang làm ({active.length})
                            </button>
                            <button
                                type="button"
                                className={`hr-tab${tab === "archive" ? " active" : ""}`}
                                onClick={() => setTab("archive")}
                            >
                                Lưu trữ – đã nghỉ ({resigned.length})
                            </button>
                        </div>

                        <HrFilterBar
                            departments={data.departments}
                            positions={data.positions}
                            filters={filters}
                            setters={setters}
                            hasActiveFilter={hasActiveFilter}
                            onAdd={() => setShowForm(true)}
                            onImportFile={onImportFile}
                            onExport={onExport}
                            onTemplate={onTemplate}
                        />

                        <HrEmployeeTable
                            employees={slice}
                            selected={selected}
                            onToggle={toggle}
                            onToggleAll={toggleAll}
                            data={{
                                contracts: data.contracts,
                                salaries: data.salaries,
                                insurance: data.insurance,
                                bankAccounts: data.bankAccounts,
                                salaryMap,
                            }}
                            onView={setViewEmp}
                            onEdit={(e) => setViewEmp(e)}
                        />
                        {tab === "archive" && (
                            <p className="hr-note">
                                * Lưu trữ giữ toàn bộ hồ sơ đã nghỉ việc và
                                lịch sử trạng thái (soft-delete, không xóa dữ
                                liệu).
                            </p>
                        )}

                        <HrPagination
                            page={safePage}
                            pageCount={pageCount}
                            totalItems={list.length}
                            onPrev={() => setPage((p) => Math.max(1, p - 1))}
                            onNext={() =>
                                setPage((p) => Math.min(pageCount, p + 1))
                            }
                            onPage={setPage}
                        />

                        {showForm && (
                            <HrAddForm
                                departments={data.departments}
                                positions={data.positions}
                                banks={data.banks || []}
                                onSaved={() => {
                                    setShowForm(false);
                                    location.reload();
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        )}

                        {viewEmp && (
                            <div
                                className="hr-view-modal"
                                onClick={() => setViewEmp(null)}
                            >
                                <div className="hr-view-box" onClick={(e) => e.stopPropagation()}>
                                    <h3>
                                        {viewEmp.fullName} — {viewEmp.employeeCode}
                                    </h3>
                                    <dl className="hr-view-grid">
                                        <span>Phòng ban</span>
                                        <dd>{viewEmp.departmentName || "—"}</dd>
                                        <span>Chức vụ</span>
                                        <dd>{viewEmp.positionName || "—"}</dd>
                                        <span>Email</span>
                                        <dd>{viewEmp.email || "—"}</dd>
                                        <span>Điện thoại</span>
                                        <dd>{viewEmp.phoneNumber || "—"}</dd>
                                        <span>CCCD</span>
                                        <dd>{viewEmp.citizenId || "—"}</dd>
                                        <span>Trạng thái</span>
                                        <dd>{viewEmp.status}</dd>
                                    </dl>
                                    <button
                                        type="button"
                                        className="hr-btn hr-btn--primary"
                                        onClick={() => setViewEmp(null)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminAppLayout>
    );
};

export default HrPage;
