import { NavLink, useLocation } from "react-router-dom";
import { useLanguage, translate } from "../../../services/i18n/LanguageProvider";


// Sidebar khu "Công việc": 3 mục (Tổng quan / Việc của tôi / Báo cáo) + thanh tìm kiếm.
const WorkSidebar = ({ collapsed, search, setSearch, onToggleSearch }) => {
    const { language } = useLanguage();
    const L = (t) => translate(t, language);
    const { search: query } = useLocation();
    const tab = new URLSearchParams(query).get("tab") || "overview";

    const items = [
        { to: "/work", tab: "overview", label: L("Tổng quan"), icon: "▦", end: true },
        { to: "/work?tab=tasks", tab: "tasks", label: L("Việc của tôi"), icon: "☰" },
        { to: "/work?tab=reports", tab: "reports", label: L("Báo cáo"), icon: "▤" },
        { to: "/promotions", label: L("Đề xuất thăng chức"), icon: "↗" },
        { to: "/handover", label: L("Bàn giao nghỉ việc"), icon: "⇥" },
    ];

    return (
        <aside className={`work-sidebar att-sidebar${collapsed ? " collapsed" : ""}`}>
            <div className="work-sidebar-inner">
                <label className="work-search att-search">
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        placeholder={L("Tìm việc / báo cáo...")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={onToggleSearch}
                        aria-label={L("Tìm trong công việc")}
                    />
                </label>
                <nav className="att-sidebar-nav">
                    <NavLink to="/home" className="att-nav-item">← {L("Trang chủ")}</NavLink>
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) => `att-nav-item work-nav-item${isActive && (!item.tab || item.tab === tab) ? " active" : ""}`}
                        >
                            <span className="work-nav-ico" aria-hidden="true">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default WorkSidebar;
