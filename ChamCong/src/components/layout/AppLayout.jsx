import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./header.css";

const COLLAPSE_KEY = "marixa_sidebar_collapsed";

// Layout dùng chung mọi trang đã đăng nhập:
// header nav (100% width) trên cùng, bên dưới là sidebar (kéo ra/vào) + main.
const AppLayout = ({ title, subtitle, profile, children, mobileAttendance = false }) => {
    const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 900px)").matches);
    const [mobileOpen, setMobileOpen] = useState(false);
    useEffect(() => {
        const media = window.matchMedia("(max-width: 900px)");
        const change = () => { setMobile(media.matches); setMobileOpen(false); };
        media.addEventListener("change", change);
        return () => media.removeEventListener("change", change);
    }, []);
    useEffect(() => {
        if (!mobileAttendance || !mobile || !mobileOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const close = (event) => { if (event.key === "Escape") setMobileOpen(false); };
        window.addEventListener("keydown", close);
        return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); };
    }, [mobileAttendance, mobile, mobileOpen]);
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(COLLAPSE_KEY) === "1";
        } catch {
            return false;
        }
    });

    const toggle = useCallback(() => {
        if (mobileAttendance && mobile) { setMobileOpen((open) => !open); return; }
        setCollapsed((v) => {
            const next = !v;
            try {
                localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
            } catch {
                // localStorage bị chặn: bỏ qua, không chặn luồng.
            }
            return next;
        });
    }, [mobileAttendance, mobile]);

    // Kéo ra/vào bằng phím tắt "[" (không cần focus input).
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "[") toggle();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [toggle]);

    return (
        <div className={`app-shell${mobileAttendance ? " att-mobile-layout" : ""}`}>
            <Header
                profile={profile}
                collapsed={mobileAttendance && mobile ? !mobileOpen : collapsed}
                onToggleSidebar={toggle}
            />
            <div className="app-body">
                {mobileAttendance && mobile && mobileOpen && <button className="att-menu-backdrop" aria-label="Đóng menu" onClick={() => setMobileOpen(false)} />}
                <Sidebar collapsed={mobileAttendance && mobile ? !mobileOpen : collapsed} onNavigate={() => setMobileOpen(false)} />
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
