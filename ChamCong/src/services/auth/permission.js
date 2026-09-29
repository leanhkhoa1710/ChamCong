import { getAuth } from "../../services/auth/auth";
import { MODULES } from "../../constants/modules";

// Role "điều hành / quản trị" (nhiều module hơn nhân viên thường).
export const ADMIN_ROLES = ["Admin"];

// Lấy danh sách role của tài khoản hiện tại (từ auth đã lưu).
export const getRoles = () => getAuth()?.roles || [];

// Có quyền admin hay không.
export const hasAdminRole = () =>
    getRoles().some((r) => ADMIN_ROLES.includes(r));

// Tài khoản có 1 role nào trong danh sách không.
const hasAnyRole = (roles) =>
    Array.isArray(roles) && roles.length > 0
        ? getRoles().some((r) => roles.includes(r))
        : false;

// Module (đường dẫn) có được truy cập không với tài khoản hiện tại.
// - có "roles": phải thuộc đúng 1 role trong danh sách (ưu tiên).
// - "access: admin": chỉ role quản trị (Admin).
// - "access: user" / không khai báo: mọi tài khoản đã đăng nhập.
// - trang con (VD /employees/approval) kế thừa quyền của module cha
//   dài nhất (/employees) nếu chưa được khai báo riêng.
export const canAccessModule = (to) => {
    let m = MODULES.find((x) => x.to === to);
    if (!m) {
        const parent = MODULES.map((x) => x.to)
            .filter((p) => to.startsWith(p + "/"))
            .sort((a, b) => b.length - a.length)[0];
        m = MODULES.find((x) => x.to === parent);
    }
    if (!m) return true; // đường dẫn tự do (login, hồ sơ...)
    if (m.roles) return hasAnyRole(m.roles);
    if (m.access === "admin") return hasAdminRole();
    return true;
};

// Danh sách module hiển thị trên sidebar cho tài khoản hiện tại.
export const visibleModules = () =>
    MODULES.filter((m) => canAccessModule(m.to));
