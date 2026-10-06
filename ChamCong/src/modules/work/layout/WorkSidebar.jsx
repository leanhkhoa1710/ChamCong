import { NavLink } from "react-router-dom";
import { useLanguage, translate } from "../../../services/i18n/LanguageProvider";

const COLLAPSE_KEY = "marixa_work_sidebar_collapsed";

// Sidebar khu "Công việc": 3 mục (Tổng quan / Việc của tôi / Báo cáo) + thanh tìm kiếm.
const WorkSidebar = ({ collapsed, search, setSearch, onToggleSearch }) => {
    const { language } = useLanguage();
    const L = (t) => translate(t, language);

    const items = [
        { to: "/work", label: L("Tổng quan"), icon: "▦", end: true },
        { to: "/work/tasks", label: L("Việc của tôi"), icon: "☰" },
        { to: "/work/reports", label: L("Báo cáo"), icon: "▤" },
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
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) => `att-nav-item work-nav-item${isActive ? " active" : ""}`}
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
