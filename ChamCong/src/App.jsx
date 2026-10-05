import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/login/pages/LoginPage";
import ActivatePage from "./modules/activate/pages/ActivatePage";
import HrPage from "./modules/employees/hr/pages/HrPage";
import ReportsPage from "./modules/employees/hr/pages/ReportsPage";
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
import AdminLeaveAdminPage from "./modules/admin/leaves/pages/LeaveAdminPage";
import {
    PayrollAdminPage,
    ResignedPage as AdminResignedPage,
    ReportPage as AdminReportPage,
} from "./modules/admin/leaves/pages/PayrollResignedReport";
import AdminAccountIssuancePage from "./modules/admin/accounts/pages/AccountIssuancePage";
import EmployeeAttendanceHistoryPage from "./modules/employees/attendance/pages/EmployeeAttendanceHistoryPage";
import EmployeeWorkSchedulePage from "./modules/employees/attendance/pages/EmployeeWorkSchedulePage";
import EmployeeStatisticsPage from "./modules/employees/attendance/pages/EmployeeStatisticsPage";
import EmployeeLeavePage from "./modules/employees/leaves/pages/EmployeeLeavePage";
import EmployeeAccountIssuancePage from "./modules/employees/accounts/pages/AccountIssuancePage";
import EmployeeContractPage from "./modules/employees/contracts/pages/EmployeeContractPage";
import HomePage from "./modules/home/pages/HomePage";
import UnauthorizedPage from "./modules/unauthorized/pages/UnauthorizedPage";
import RequireModule from "./components/common/RequireModule";
import MyReportsPage from "./modules/reports/MyReportsPage";
import PromotionsPage from "./modules/employees/hr/pages/PromotionsPage";
import HandoverPage from "./modules/handover/pages/HandoverPage";

const guarded = (to, el) => <RequireModule to={to}>{el}</RequireModule>;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/kich-hoat" element={<ActivatePage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />

                {/* Khu quản trị */}
                <Route
                    path="/employees"
                    element={guarded("/employees", <HrPage />)}
                />
                <Route
                    path="/employees/attendance-history"
                    element={guarded(
                        "/employees/attendance-history",
                        <EmployeeAttendanceHistoryPage hrMode />
                    )}
                />
                <Route
                    path="/employees/work-schedule"
                    element={guarded("/employees/work-schedule", <EmployeeWorkSchedulePage />)}
                />
                <Route
                    path="/employees/statistics"
                    element={guarded(
                        "/employees/statistics",
                        <EmployeeStatisticsPage hrMode />
                    )}
                />
                <Route path="/employees/contracts" element={guarded("/employees/contracts", <EmployeeContractPage />)} />
                <Route path="/employees/payroll" element={<Navigate to="/employees" replace />} />
                <Route
                    path="/employees/leaves"
                    element={guarded(
                        "/employees/leaves",
                        <EmployeeLeavePage hrMode />
                    )}
                />
                <Route
                    path="/employees/reports"
                    element={guarded("/employees/reports", <ReportsPage />)}
                />
                <Route
                    path="/employees/accounts"
                    element={guarded(
                        "/employees/accounts",
                        <EmployeeAccountIssuancePage hrMode />
                    )}
                />
                <Route path="/employees/promotions" element={guarded("/employees/promotions", <PromotionsPage />)} />
                <Route path="/employees/handover" element={guarded("/employees/handover", <HandoverPage reviewMode />)} />
                <Route path="/handover" element={guarded("/handover", <HandoverPage />)} />
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
                    element={guarded("/admin/leaves", <AdminLeaveAdminPage />)}
                />
                <Route
                    path="/admin/payroll"
                    element={guarded("/admin/payroll", <PayrollAdminPage />)}
                />
                <Route
                    path="/admin/resigned"
                    element={guarded("/admin/resigned", <AdminResignedPage />)}
                />
                <Route
                    path="/admin/reports"
                    element={guarded("/admin/reports", <AdminReportPage />)}
                />
                <Route
                    path="/admin/accounts"
                    element={guarded("/admin/accounts", <AdminAccountIssuancePage />)}
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
                <Route path="/reports" element={guarded("/reports", <MyReportsPage />)} />
                <Route path="/promotions" element={guarded("/promotions", <PromotionsPage selfMode />)} />
                <Route path="/contracts" element={<ContractPage />} />
                <Route path="/salary" element={<SalaryPage />} />
                <Route path="/insurance" element={<InsurancePage />} />
                <Route path="/bank-accounts" element={<BankPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
