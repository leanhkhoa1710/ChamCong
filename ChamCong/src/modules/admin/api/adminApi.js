import axiosClient from "../../../services/api/axiosClient";

// API cấp công ty (admin) - kéo danh sách để tính dashboard "Trung tâm việc".
// Dùng get-all với pageSize lớn, tính toán phía client (đồng bộ dữ liệu thật).
const PAGE = "pageNumber=1&pageSize=500";

const adminApi = {
    employees() {
        return axiosClient.get(`/Employee/get-all?${PAGE}`);
    },
    attendanceLogs() {
        return axiosClient.get(
            `/AttendanceLog/get-all?pageNumber=1&pageSize=1000`
        );
    },
    leaveRequests() {
        return axiosClient.get(`/LeaveRequest/get-all?${PAGE}`);
    },
    payrolls() {
        return axiosClient.get(`/Payroll/get-all?${PAGE}`);
    },
    contracts() {
        return axiosClient.get(`/EmployeeContract/get-all?${PAGE}`);
    },
    activationCodes() {
        return axiosClient.get(`/ActivationCode/get-all?${PAGE}`);
    },
};

export default adminApi;
