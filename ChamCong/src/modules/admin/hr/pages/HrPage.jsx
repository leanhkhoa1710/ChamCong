import { useState } from "react";
import HrLayout from "../layout/HrLayout";
import { useHrData } from "../hooks/useHrData";
import { useHrKpis } from "../hooks/useHrKpis";
import { useHrFilters } from "../hooks/useHrFilters";
import HrKpiCards from "../components/HrKpiCards";
import HrFilterBar from "../components/HrFilterBar";
import HrEmployeeTable from "../components/HrEmployeeTable";
import HrPagination from "../components/HrPagination";
import EmployeeFormModal from "../components/EmployeeFormModal";
import hrApi from "../api/hrApi";
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

    // Modal thêm / sửa
    const [modalOpen, setModalOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [notice, setNotice] = useState("");

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const safePage = Math.min(page, Math.max(1, pageCount));
    const slice = filtered.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    const flash = (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(""), 3000);
    };

    const openAdd = () => {
        setEditRow(null);
        setModalOpen(true);
    };
    const openEdit = (e) => {
        setEditRow(e);
        setModalOpen(true);
    };

    const doDelete = async (e) => {
        if (
            !window.confirm(
                `Xóa nhân viên ${e.employeeCode} · ${e.fullName}? (soft-delete)`
            )
        )
            return;
        try {
            await hrApi.softDeleteEmployee(e.id);
            await data.reload();
            flash("Đã xóa nhân viên.");
        } catch (err) {
            flash(err.response?.data?.message || err.message || "Xóa thất bại.");
        }
    };

    const onSaved = async () => {
        setModalOpen(false);
        setEditRow(null);
        await data.reload();
        flash("Đã lưu nhân viên.");
    };

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

    return (
        <HrLayout
            title="Nhân viên"
            subtitle="Danh sách, thêm / sửa / xóa và hồ sơ nhân viên"
        >
            {notice && <div className="att-notice">{notice}</div>}
            {data.error && <div className="att-error">{data.error}</div>}
            {data.loading && <div className="att-loading">Đang tải...</div>}

            {!data.loading && !data.error && (
                <div className="hr-body">
                    <HrKpiCards kpis={kpis} />
                    <HrFilterBar
                        departments={data.departments}
                        positions={data.positions}
                        filters={filters}
                        setters={setters}
                        hasActiveFilter={hasActiveFilter}
                        onAdd={openAdd}
                    />
                    <HrEmployeeTable
                        employees={slice}
                        selected={selected}
                        onToggle={toggle}
                        onToggleAll={toggleAll}
                        onEdit={openEdit}
                        onDelete={doDelete}
                    />
                    <HrPagination
                        page={safePage}
                        pageCount={pageCount}
                        totalItems={filtered.length}
                        onPrev={() => setPage((p) => Math.max(1, p - 1))}
                        onNext={() =>
                            setPage((p) => Math.min(pageCount, p + 1))
                        }
                        onPage={setPage}
                    />
                </div>
            )}

            <EmployeeFormModal
                open={modalOpen}
                employee={editRow}
                departments={data.departments}
                positions={data.positions}
                onClose={() => {
                    setModalOpen(false);
                    setEditRow(null);
                }}
                onSaved={onSaved}
            />
        </HrLayout>
    );
};

export default HrPage;
