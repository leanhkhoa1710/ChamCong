// ============================================================
// REGISTRY MODULE
// Mỗi module (một đường dẫn) khai báo:
//   - to     : đường dẫn
//   - label  : tên hiển thị trên sidebar
//   - access : cấp quyền chung. "user" = mọi tài khoản đã đăng
//              nhập; "admin" = chỉ những role trong ADMIN_ROLES.
//   - roles  : (tuỳ chọn) danh sách role được phép truy cập,
//              ưu tiên hơn access. Ví dụ: /employees chỉ HR,
//              Manager và Admin.
// Sidebar và route guard đều đọc từ đây -> thống nhất nguồn quyền.
// ============================================================
export const MODULES = [
    { to: "/home", label: "Trang chủ", access: "user" },
    { to: "/attendance", label: "Chấm công", access: "user" },
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
    // Hub Nhân sự: chỉ HR (Nhân sự), Manager (Quản lý), Admin.
    // Các trang con (/employees/*) kế thừa quyền của /employees.
    { to: "/employees", label: "Nhân sự", roles: ["HR", "Manager", "Admin"] },
];

export const moduleByPath = (path) =>
    MODULES.find((m) => m.to === path);
