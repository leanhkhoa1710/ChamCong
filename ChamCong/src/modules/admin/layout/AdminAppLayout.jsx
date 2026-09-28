import { useCallback, useEffect, useState } from "react";
import Header from "../../../components/layout/Header";
import AdminSidebar from "./AdminSidebar";
import "../../../components/layout/header.css";
import "../admin.css";

const COLLAPSE_KEY = "marixa_sidebar_collapsed";

// Layout dùng chung 3 trang quản trị (Nhân sự / Chấm công QL / Thống kê QL):
// header nav 100% width + sidebar 3 mục (kéo ra/vào) + main.
const AdminAppLayout = ({ title, subtitle, children }) => {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(COLLAPSE_KEY) === "1";
        } catch {
            return false;
        }
    });

    const toggle = useCallback(() => {
        setCollapsed((v) => {
            const next = !v;
            try {
                localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
            } catch {
                // localStorage bị chặn: bỏ qua, không chặn luồng.
            }
            return next;
        });
    }, []);

    // Kéo ra/vào bằng phím tắt "[" (không cần focus input).
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "[") toggle();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [toggle]);

    return (
        <div className="app-shell">
            <Header collapsed={collapsed} onToggleSidebar={toggle} />
            <div className="app-body">
                <AdminSidebar collapsed={collapsed} />
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

export default AdminAppLayout;
