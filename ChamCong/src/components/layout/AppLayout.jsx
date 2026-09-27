import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./header.css";

const COLLAPSE_KEY = "marixa_sidebar_collapsed";

// Layout dùng chung mọi trang đã đăng nhập:
// header nav (100% width) trên cùng, bên dưới là sidebar (kéo ra/vào) + main.
const AppLayout = ({ title, subtitle, profile, children }) => {
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
            <Header
                profile={profile}
                collapsed={collapsed}
                onToggleSidebar={toggle}
            />
            <div className="app-body">
                <Sidebar collapsed={collapsed} />
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

export default AppLayout;
