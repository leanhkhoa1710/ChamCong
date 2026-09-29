import { NavLink } from "react-router-dom";
const ADMIN_NAV_ITEMS = [{ to: "/admin", label: "Dashboard" }];

const AdminSidebar = ({ collapsed }) => {
    return (
        <aside className={`att-sidebar${collapsed ? " collapsed" : ""}`}>
            <nav className="att-sidebar-nav">
                {ADMIN_NAV_ITEMS.map((item) => (
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

export default AdminSidebar;
