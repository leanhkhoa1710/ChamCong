import { NavLink } from "react-router-dom";
import { canAccessModule } from "../../../../services/auth/permission";

// Sidebar hub /employees: 6 mục của khu Nhân sự.
// "Nhân viên" khớp chính xác (end) để không active khi vào các /employees/*.
const HR_NAV_ITEMS = [
    { to: "/employees", label: "Nhân viên", end: true },
    { to: "/employees/approval", label: "Duyệt chấm công" },
    { to: "/employees/attendance-history", label: "Lịch sử chấm công" },
    { to: "/employees/statistics", label: "Thống kê công" },
    { to: "/employees/leaves", label: "Nghỉ phép" },
    { to: "/employees/report", label: "Báo cáo" },
];

const HrSidebar = ({ collapsed }) => {
    const items = HR_NAV_ITEMS.filter((i) => canAccessModule(i.to));

    return (
        <aside className={`att-sidebar${collapsed ? " collapsed" : ""}`}>
            <nav className="att-sidebar-nav">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
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

export default HrSidebar;
