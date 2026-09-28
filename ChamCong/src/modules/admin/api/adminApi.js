import axiosClient from "../../../services/api/axiosClient";

// API cấp công ty (admin) - dùng get-all với pageSize lớn, tính phía client.
const P = "pageNumber=1&pageSize=500";

const adminApi = {
    employees() {
        return axiosClient.get(`/Employee/get-all?${P}`);
    },
    attendanceLogs() {
        return axiosClient.get(
            `/AttendanceLog/get-all?pageNumber=1&pageSize=2000`
        );
    },
    leaveRequests() {
        return axiosClient.get(`/LeaveRequest/get-all?${P}`);
    },
    payrolls() {
        return axiosClient.get(`/Payroll/get-all?${P}`);
    },
    contracts() {
        return axiosClient.get(`/EmployeeContract/get-all?${P}`);
    },
    activationCodes() {
        return axiosClient.get(`/ActivationCode/get-all?${P}`);
    },
    // Thêm: dữ liệu cần cho bộ lọc + KPI
    departments() {
        return axiosClient.get(`/Department/get-all?${P}`);
    },
    positions() {
        return axiosClient.get(`/Position/get-all?${P}`);
    },
    insurance() {
        return axiosClient.get(`/EmployeeInsurance/get-all?${P}`);
    },
    bankAccounts() {
        return axiosClient.get(`/EmployeeBankAccount/get-all?${P}`);
    },
    salaries() {
        return axiosClient.get(`/EmployeeSalary/get-all?${P}`);
    },
};

export default adminApi;
