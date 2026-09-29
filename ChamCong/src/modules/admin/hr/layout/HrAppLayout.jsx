import { useCallback, useEffect, useState } from "react";
import Header from "../../../../components/layout/Header";
import HrSidebar from "./HrSidebar";
import "../../../../components/layout/header.css";
import "../../admin.css";

const COLLAPSE_KEY = "marixa_hr_sidebar_collapsed";

const HrAppLayout = ({ title, subtitle, children }) => {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(COLLAPSE_KEY) === "1";
        } catch {
            return false;
        }
    });

    const toggle = useCallback(() => {
        setCollapsed((value) => {
            const next = !value;
            try {
                localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
            } catch {
                // Bỏ qua khi trình duyệt chặn localStorage.
            }
            return next;
        });
    }, []);

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === "[") toggle();
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

export default HrAppLayout;
