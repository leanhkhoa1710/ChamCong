import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
    { to: "/attendance", label: "Trang chủ" },
    { to: "/attendance-history", label: "Lịch sử chấm công" },
    { to: "/statistics", label: "Thống kê công" },
    { to: "/leave", label: "Nghỉ phép" },
    { to: "/contracts", label: "Hợp đồng" },
    { to: "/salary", label: "Bảng lương" },
    { to: "/insurance", label: "Bảo hiểm & thuế" },
    { to: "/bank-accounts", label: "Tài khoản ngân hàng" },
    { to: "/profile", label: "Hồ sơ" },
];

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
