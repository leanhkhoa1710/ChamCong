import { useCallback, useEffect, useState } from "react";
import Header from "../../../../components/layout/Header";
import HrSidebar from "./HrSidebar";
import "../../../../components/layout/header.css";
import "../../admin.css";

const COLLAPSE_KEY = "marixa_sidebar_collapsed";

// Layout dùng chung mọi trang của hub /employees (Nhân sự):
// header nav 100% width + sidebar 6 mục (kéo ra/vào) + main.
const HrLayout = ({ title, subtitle, children }) => {
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
                // localStorage bị chặn: bỏ qua.
            }
            return next;
        });
    }, []);

    // Kéo ra/vào bằng phím tắt "[".
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
                <HrSidebar collapsed={collapsed} />
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

export default HrLayout;
