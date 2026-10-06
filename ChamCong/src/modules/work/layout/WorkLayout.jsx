import { useCallback, useEffect, useState } from "react";
import Header from "../../../components/layout/Header";
import WorkSidebar from "./WorkSidebar";
import "../../../components/layout/header.css";
import "../../attendance/attendance.css";
import "../../employees/employee.css";
import "../../admin/admin.css";
import "../work.css";

const COLLAPSE_KEY = "marixa_work_sidebar_collapsed";

// Layout khu "Công việc": header + sidebar (Tổng quan / Việc của tôi / Báo cáo + tìm kiếm).
// "search" do cha sở hữu (controlled) để thanh tìm kiếm lọc chung cả 3 view.
const WorkLayout = ({ title, subtitle, search, onSearchChange, children }) => {
    const [collapsed, setCollapsed] = useState(() => {
        try { return localStorage.getItem(COLLAPSE_KEY) === "1"; } catch { return false; }
    });

    const toggle = useCallback(() => {
        setCollapsed((v) => {
            const next = !v;
            try { localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0"); } catch { /* noop */ }
            return next;
        });
    }, []);

    useEffect(() => {
        const onKey = (e) => { if (e.key === "[") toggle(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [toggle]);

    return (
        <div className="app-shell">
            <Header collapsed={collapsed} onToggleSidebar={toggle} />
            <div className="app-body">
                <WorkSidebar collapsed={collapsed} search={search} setSearch={onSearchChange} />
                <main className="att-main">
                    {title && (
                        <div className="att-main-head">
                            <h1>{title}</h1>
                            {subtitle && <p>{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
};

export default WorkLayout;
