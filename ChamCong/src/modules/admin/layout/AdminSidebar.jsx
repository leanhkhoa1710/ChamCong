import { NavLink } from "react-router-dom";
import { canAccessModule } from "../../../services/auth/permission";

// Sidebar khu quản trị. Mục "Trang chủ" trỏ tới /employees (Nhân sự)
// nên chỉ hiện khi tài khoản có role HR / Manager / Admin.
const ADMIN_NAV_ITEMS = [
    { to: "/employees", label: "Trang chủ" },
    { to: "/admin/attendance-history", label: "Chấm công (QL)" },
    { to: "/admin/statistics", label: "Thống kê công (QL)" },
];

const AdminSidebar = ({ collapsed }) => {
    const items = ADMIN_NAV_ITEMS.filter((i) => canAccessModule(i.to));

    return (
        <aside className={`att-sidebar${collapsed ? " collapsed" : ""}`}>
            <nav className="att-sidebar-nav">
                {items.map((item) => (
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
