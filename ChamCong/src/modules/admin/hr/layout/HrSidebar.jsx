import { NavLink } from "react-router-dom";

const HR_NAV_ITEMS = [
    { to: "/admin/employees", label: "Danh sách nhân viên" },
    { to: "/admin/employees/attendance-history", label: "Lịch sử & duyệt công" },
    { to: "/admin/employees/statistics", label: "Thống kê công" },
    { to: "/admin/employees/leaves", label: "Duyệt nghỉ phép" },
    { to: "/admin/employees/handover", label: "Bàn giao" },
    { to: "/admin/employees/promotions", label: "Thăng chức" },
];

const HrSidebar = ({ collapsed }) => (
    <aside className={`att-sidebar${collapsed ? " collapsed" : ""}`}>
        <nav className="att-sidebar-nav" aria-label="Điều hướng nhân sự">
            {HR_NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin/employees"}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                        `att-nav-item${isActive ? " active" : ""}`
                    }
                >
                    {item.label}
                </NavLink>
            ))}
                <NavLink
                    to="/admin"
                    title={collapsed ? "Quay lại Dashboard" : undefined}
                    className="att-nav-item att-nav-back"
                >
                    <span aria-hidden="true">←</span>
                    <span>Quay lại Dashboard</span>
                </NavLink>
        </nav>
    </aside>
);

export default HrSidebar;
