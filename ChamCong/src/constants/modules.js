// ============================================================
// REGISTRY MODULE
// Mỗi module (một đường dẫn) khai báo:
//   - to     : đường dẫn
//   - label  : tên hiển thị trên sidebar
//   - access : cấp quyền. "user" = mọi tài khoản đã đăng nhập;
//              "admin" = chỉ những role trong ADMIN_ROLES.
// Sidebar và route guard đều đọc từ đây -> thống nhất nguồn quyền.
// ============================================================
export const MODULES = [
    { to: "/attendance", label: "Trang chủ", access: "user" },
    { to: "/attendance-history", label: "Lịch sử chấm công", access: "user" },
    { to: "/statistics", label: "Thống kê công", access: "user" },
    { to: "/leave", label: "Nghỉ phép", access: "user" },
    { to: "/contracts", label: "Hợp đồng", access: "user" },
    { to: "/salary", label: "Bảng lương", access: "user" },
    { to: "/insurance", label: "Bảo hiểm & thuế", access: "user" },
    { to: "/bank-accounts", label: "Tài khoản ngân hàng", access: "user" },
    { to: "/profile", label: "Hồ sơ", access: "user" },
    // Khu quản trị (admin)
    { to: "/admin", label: "Dashboard", access: "admin" },
    { to: "/employees", label: "Nhân sự", access: "admin" },
];

export const moduleByPath = (path) =>
    MODULES.find((m) => m.to === path);
