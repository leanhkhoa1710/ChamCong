// Nhãn + class badge dùng chung trong module Nhân sự (HR admin).
// Trạng thái chấm công (AttendanceStatus enum).
export const ATT_STATUS_LABELS = {
    1: "Đúng giờ",
    2: "Đi trễ",
    3: "Về sớm",
    4: "Vắng mặt",
    5: "Nghỉ phép",
    6: "Lễ",
    7: "Ngoại tuần",
};
export const ATT_STATUS_CLASS = {
    1: "ok",
    2: "warn",
    3: "warn",
    4: "bad",
    5: "info",
    6: "info",
    7: "info",
};

// Phê duyệt chấm công (AttendanceApprovalStatus enum).
export const APPROVAL_LABELS = { 0: "Chờ duyệt", 1: "Đã duyệt", 2: "Từ chối" };
export const APPROVAL_CLASS = { 0: "warn", 1: "ok", 2: "bad" };

// Nghỉ phép (LeaveRequestStatus enum).
export const LEAVE_STATUS_LABELS = {
    1: "Chờ duyệt",
    2: "Đã duyệt",
    3: "Từ chối",
    4: "Đã hủy",
};
export const LEAVE_STATUS_CLASS = {
    1: "warn",
    2: "ok",
    3: "bad",
    4: "muted",
};

// Giới tính (GenderType enum).
export const GENDER_LABELS = { 0: "—", 1: "Nam", 2: "Nữ" };

// Loại lao động (LaborType enum).
export const LABOR_LABELS = {
    1: "Chính thức",
    2: "Bán thời gian",
    3: "Thực tập",
    4: "Cộng tác",
};

// Trạng thái nhân viên (EmployeeStatus enum).
export const EMP_STATUS_LABELS = {
    1: "Thử việc",
    2: "Đang làm",
    3: "Tạm nghỉ",
    4: "Đã nghỉ việc",
    5: "Chấm dứt",
};
export const EMP_STATUS_CLASS = {
    1: "info",
    2: "ok",
    3: "warn",
    4: "muted",
    5: "bad",
};
