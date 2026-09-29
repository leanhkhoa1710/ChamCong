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
    users() {
        return axiosClient.get(`/User/get-all?${P}`);
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
    banks() {
        return axiosClient.get(`/Bank/get-all?${P}`);
    },
    createActivationCode(payload) {
        return axiosClient.post("/Auth/create-activation-code", payload);
    },
    // === Quản trị: chấm công / hợp đồng / nghỉ phép / tài khoản ===
    attendances() {
        return axiosClient.get(`/Attendance/get-all?${P}`);
    },
    approveAttendance(payload) {
        return axiosClient.post("/Attendance/approve", payload);
    },
    createContract(payload) {
        return axiosClient.post("/EmployeeContract/create", payload);
    },
    updateLeave(payload) {
        return axiosClient.put("/LeaveRequest/update", payload);
    },
    updatePayroll(payload) {
        return axiosClient.put("/Payroll/update", payload);
    },
    createUser(payload) {
        return axiosClient.post("/User/create", payload);
    },
    createEmployee(payload) {
        return axiosClient.post("/Employee/create", payload);
    },
    updateEmployee(payload) {
        return axiosClient.put("/Employee/update", payload);
    },
    createSalary(payload) {
        return axiosClient.post("/EmployeeSalary/create", payload);
    },
    createInsurance(payload) {
        return axiosClient.post("/EmployeeInsurance/create", payload);
    },
    createBankAccount(payload) {
        return axiosClient.post("/EmployeeBankAccount/create", payload);
    },
};

export default adminApi;
