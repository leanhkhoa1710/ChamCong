import { useState } from "react";
import { useHrData } from "../hooks/useHrData";
import { useHrKpis } from "../hooks/useHrKpis";
import { useHrFilters } from "../hooks/useHrFilters";
import HrKpiCards from "../components/HrKpiCards";
import HrFilterBar from "../components/HrFilterBar";
import HrEmployeeTable from "../components/HrEmployeeTable";
import HrPagination from "../components/HrPagination";
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

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const safePage = Math.min(page, Math.max(1, pageCount));
    const slice = filtered.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

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
        <div className="hr-page">
            <div className="hr-head">
                <h1>Nhân sự</h1>
                <p>Quản lý nhân viên, chấm công, hợp đồng &amp; hồ sơ lương</p>
            </div>

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
                        onAdd={() => window.alert("Chức năng thêm nhân viên")}
                    />
                    <HrEmployeeTable
                        employees={slice}
                        selected={selected}
                        onToggle={toggle}
                        onToggleAll={toggleAll}
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
        </div>
    );
};

export default HrPage;
