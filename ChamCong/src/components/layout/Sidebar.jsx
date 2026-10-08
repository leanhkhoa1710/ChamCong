import { NavLink, useLocation } from "react-router-dom";
import { visibleModules } from "../../services/auth/permission";

const SECTIONS = [
    { title: "Chấm công", paths: ["/attendance", "/attendance-history", "/statistics", "/leave"] },
    { title: "Công việc", paths: ["/work", "/reports", "/promotions", "/handover"] },
    { title: "Hồ sơ cá nhân", paths: ["/profile", "/contracts"] },
    { title: "Lương & chế độ", paths: ["/salary", "/insurance", "/bank-accounts"] },
];

const Sidebar = ({ collapsed, onNavigate }) => {
    const { pathname } = useLocation();
    const section = SECTIONS.find((item) => item.paths.includes(pathname));
    const items = visibleModules().filter((item) => section?.paths.includes(item.to));
    return (
        <aside className={`att-sidebar${collapsed ? " collapsed" : ""}`}>
            <nav className="att-sidebar-nav">
                <NavLink to="/home" onClick={onNavigate} className="att-nav-item">← Trang chủ</NavLink>
                {section && !collapsed && <div className="att-sidebar-section-title">{section.title}</div>}
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                            `att-nav-item${isActive ? " active" : ""}`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
