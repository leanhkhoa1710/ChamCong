import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/login/pages/LoginPage";
import HrPage from "./modules/admin/hr/pages/HrPage";
import AttendancePage from "./modules/attendance/pages/AttendancePage";
import LeavePage from "./modules/leave/pages/LeavePage";
import ContractPage from "./modules/contracts/pages/ContractPage";
import SalaryPage from "./modules/salary/pages/SalaryPage";
import InsurancePage from "./modules/insurance/pages/InsurancePage";
import BankPage from "./modules/bank-accounts/pages/BankPage";
import StatisticsPage from "./modules/statistics/pages/StatisticsPage";
import AttendanceHistoryPage from "./modules/attendance/pages/AttendanceHistoryPage";
import ProfilePage from "./modules/profile/pages/ProfilePage";
import AdminHomepage from "./modules/admin/pages/AdminHomepage";
import AdminAttendanceHistoryPage from "./modules/admin/attendance/pages/AdminAttendanceHistoryPage";
import AdminStatisticsPage from "./modules/admin/attendance/pages/AdminStatisticsPage";
import AdminContractPage from "./modules/admin/contracts/pages/AdminContractPage";
import LeaveAdminPage from "./modules/admin/leaves/pages/LeaveAdminPage";
import {
    PayrollAdminPage,
    ResignedPage,
    ReportPage,
} from "./modules/admin/leaves/pages/PayrollResignedReport";
import AccountIssuancePage from "./modules/admin/accounts/pages/AccountIssuancePage";
import HomePage from "./modules/home/pages/HomePage";
import RequireModule from "./components/common/RequireModule";

const guarded = (to, el) => <RequireModule to={to}>{el}</RequireModule>;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/Home" replace />} />
                <Route path="/Home" element={<HomePage />} />

                {/* Khu quản trị */}
                <Route
                    path="/employees"
                    element={guarded("/employees", <HrPage />)}
                />
                <Route
                    path="/employees/attendance-history"
                    element={guarded(
                        "/employees/attendance-history",
                        <AdminAttendanceHistoryPage hrMode />
                    )}
                />
                <Route
                    path="/employees/statistics"
                    element={guarded(
                        "/employees/statistics",
                        <AdminStatisticsPage hrMode />
                    )}
                />
                <Route
                    path="/employees/leaves"
                    element={guarded(
                        "/employees/leaves",
                        <LeaveAdminPage hrMode />
                    )}
                />
                <Route
                    path="/employees/resigned"
                    element={guarded(
                        "/employees/resigned",
                        <ResignedPage hrMode />
                    )}
                />
                <Route
                    path="/employees/reports"
                    element={guarded(
                        "/employees/reports",
                        <ReportPage hrMode />
                    )}
                />
                <Route
                    path="/employees/accounts"
                    element={guarded(
                        "/employees/accounts",
                        <AccountIssuancePage hrMode />
                    )}
                />
                <Route
                    path="/admin/attendance-history"
                    element={guarded(
                        "/admin/attendance-history",
                        <AdminAttendanceHistoryPage />
                    )}
                />
                <Route
                    path="/admin/statistics"
                    element={guarded(
                        "/admin/statistics",
                        <AdminStatisticsPage />
                    )}
                />
                <Route
                    path="/admin/contracts"
                    element={guarded("/admin/contracts", <AdminContractPage />)}
                />
                <Route
                    path="/admin/leaves"
                    element={guarded("/admin/leaves", <LeaveAdminPage />)}
                />
                <Route
                    path="/admin/payroll"
                    element={guarded("/admin/payroll", <PayrollAdminPage />)}
                />
                <Route
                    path="/admin/resigned"
                    element={guarded("/admin/resigned", <ResignedPage />)}
                />
                <Route
                    path="/admin/reports"
                    element={guarded("/admin/reports", <ReportPage />)}
                />
                <Route
                    path="/admin/accounts"
                    element={guarded("/admin/accounts", <AccountIssuancePage />)}
                />
                <Route path="/admin" element={guarded("/admin", <AdminHomepage />)} />

                {/* Khu nhân viên */}
                <Route path="/attendance" element={<AttendancePage />} />
                <Route
                    path="/attendance-history"
                    element={<AttendanceHistoryPage />}
                />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/leave" element={<LeavePage />} />
                <Route path="/contracts" element={<ContractPage />} />
                <Route path="/salary" element={<SalaryPage />} />
                <Route path="/insurance" element={<InsurancePage />} />
                <Route path="/bank-accounts" element={<BankPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="*" element={<Navigate to="/Home" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
