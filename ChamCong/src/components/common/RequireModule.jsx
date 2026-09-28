import { Navigate } from "react-router-dom";
import { canAccessModule } from "../../services/auth/permission";

// Bọc route theo quyền module: thiếu quyền -> chuyển về /attendance.
const RequireModule = ({ to, children }) =>
    canAccessModule(to) ? children : <Navigate to="/attendance" replace />;

export default RequireModule;
