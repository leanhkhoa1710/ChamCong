import axiosClient from "../../../../services/api/axiosClient";

// API cấp HR/quản lý cho module Nhân sự:
// danh sách + CRUD nhân viên + duyệt nghỉ phép + CRUD/duyệt chấm công.
const P = "pageNumber=1&pageSize=500";

const hrApi = {
    employees() {
        return axiosClient.get(`/Employee/get-all?${P}`);
    },
    createEmployee(payload) {
        return axiosClient.post("/Employee/create", payload);
    },
    updateEmployee(payload) {
        return axiosClient.put("/Employee/update", payload);
    },
    softDeleteEmployee(id) {
        return axiosClient.delete(`/Employee/soft-delete/${id}`);
    },
    leaveRequests() {
        return axiosClient.get(`/LeaveRequest/get-all?${P}`);
    },
    leaveTypes() {
        return axiosClient.get(`/LeaveType/get-all?${P}`);
    },
    approveLeave(payload) {
        return axiosClient.put("/LeaveRequest/update", payload);
    },
    attendanceAll() {
        return axiosClient.get(
            `/Attendance/get-all?pageNumber=1&pageSize=1000`
        );
    },
    createAttendance(payload) {
        return axiosClient.post("/Attendance/create", payload);
    },
    updateAttendance(payload) {
        return axiosClient.put("/Attendance/update", payload);
    },
    softDeleteAttendance(id) {
        return axiosClient.delete(`/Attendance/soft-delete/${id}`);
    },
    approveAttendance(payload) {
        // payload: { id, approvalStatus, approvedBy, note? }
        return axiosClient.post("/Attendance/approve", payload);
    },
    departments() {
        return axiosClient.get(`/Department/get-all?${P}`);
    },
    positions() {
        return axiosClient.get(`/Position/get-all?${P}`);
    },
};

export default hrApi;
