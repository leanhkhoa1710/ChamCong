import { getAuth } from "../../services/auth/auth";
import { MODULES } from "../../constants/modules";

// Role "điều hành / quản trị" (nhiều module hơn nhân viên thường).
export const ADMIN_ROLES = ["Admin"];

// Có quyền admin hay không (đọc role từ auth đã lưu).
export const hasAdminRole = () =>
    (getAuth()?.roles || []).some((r) => ADMIN_ROLES.includes(r));

// Module (đường dẫn) có được truy cập không với tài khoản hiện tại.
export const canAccessModule = (to) => {
    const m = MODULES.find((x) => x.to === to);
    if (!m) return true; // đường dẫn tự do (login, hồ sơ...)
    if (m.access === "admin") return hasAdminRole();
    return true;
};

// Danh sách module hiển thị trên sidebar cho tài khoản hiện tại.
export const visibleModules = () =>
    MODULES.filter((m) =>
        m.access === "admin" ? hasAdminRole() : true
    );
