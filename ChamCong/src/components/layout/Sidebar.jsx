import { NavLink } from "react-router-dom";
import { visibleModules } from "../../services/auth/permission";

const NAV_ITEMS = visibleModules();

const Sidebar = ({ collapsed }) => {
    return (
        <aside className={`att-sidebar${collapsed ? " collapsed" : ""}`}>
            <nav className="att-sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
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
