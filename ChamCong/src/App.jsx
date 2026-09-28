import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/login/pages/LoginPage";
import EmployeePage from "./modules/employees/pages/EmployeePage";
import AttendancePage from "./modules/attendance/pages/AttendancePage";
import LeavePage from "./modules/leave/pages/LeavePage";
import ContractPage from "./modules/contracts/pages/ContractPage";
import SalaryPage from "./modules/salary/pages/SalaryPage";
import InsurancePage from "./modules/insurance/pages/InsurancePage";
import BankPage from "./modules/bank-accounts/pages/BankPage";
import StatisticsPage from "./modules/statistics/pages/StatisticsPage";
import AttendanceHistoryPage from "./modules/attendance/pages/AttendanceHistoryPage";
import ProfilePage from "./modules/profile/pages/ProfilePage";
import DashboardPage from "./modules/admin/pages/DashboardPage";
import AdminAttendanceHistoryPage from "./modules/admin/attendance/pages/AdminAttendanceHistoryPage";
import AdminStatisticsPage from "./modules/admin/attendance/pages/AdminStatisticsPage";
import RequireModule from "./components/common/RequireModule";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/employees"
                    element={
                        <RequireModule to="/employees">
                            <EmployeePage />
                        </RequireModule>
                    }
                />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route
                    path="/attendance-history"
                    element={<AttendanceHistoryPage />}
                />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route
                    path="/admin"
                    element={
                        <RequireModule to="/admin">
                            <DashboardPage />
                        </RequireModule>
                    }
                />
                <Route
                    path="/admin/attendance-history"
                    element={
                        <RequireModule to="/admin/attendance-history">
                            <AdminAttendanceHistoryPage />
                        </RequireModule>
                    }
                />
                <Route
                    path="/admin/statistics"
                    element={
                        <RequireModule to="/admin/statistics">
                            <AdminStatisticsPage />
                        </RequireModule>
                    }
                />
                <Route path="/leave" element={<LeavePage />} />
                <Route path="/contracts" element={<ContractPage />} />
                <Route path="/salary" element={<SalaryPage />} />
                <Route path="/insurance" element={<InsurancePage />} />
                <Route path="/bank-accounts" element={<BankPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/attendance" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
