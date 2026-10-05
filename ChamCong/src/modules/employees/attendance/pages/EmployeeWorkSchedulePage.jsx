import { useEffect, useMemo, useState } from "react";
import HrAppLayout from "../../hr/layout/HrAppLayout";
import employeeAttendanceApi from "../api/employeeAttendanceApi";
import { approvalClass, approvalLabel } from "../labels";
import "../../employee.css";

const vnToday = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Bangkok" }).format(new Date());
const dayKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const weekdayBit = (date) => 1 << ((date.getDay() + 6) % 7);
const dateOnly = (value) => (value || "").slice(0, 10);

const EmployeeWorkSchedulePage = () => {
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(vnToday);
    const [calendarMonth, setCalendarMonth] = useState(() => vnToday().slice(0, 7));
    const [search, setSearch] = useState("");

    useEffect(() => {
        Promise.all([
            employeeAttendanceApi.employeesAll(),
            employeeAttendanceApi.employeeShiftsAll(),
            employeeAttendanceApi.shiftsAll(),
            employeeAttendanceApi.attendanceAll(),
        ]).then(([employeeResponse, assignmentResponse, shiftResponse, attendanceResponse]) => {
            setEmployees(employeeResponse.data.data?.items || []);
            setAssignments(assignmentResponse.data.data?.items || []);
            setShifts(shiftResponse.data.data?.items || []);
            setAttendance(attendanceResponse.data.data?.items || []);
        }).catch((err) => {
            setError(err.response?.data?.message || err.message || "Không tải được lịch làm.");
        }).finally(() => setLoading(false));
    }, []);

    const shiftById = useMemo(() => new Map(shifts.map((shift) => [shift.id, shift])), [shifts]);
    const employeeById = useMemo(() => new Map(employees.map((employee) => [employee.id, employee])), [employees]);

    const scheduleForDate = useMemo(() => (date) => {
        const dateValue = dayKey(date);
        const bit = weekdayBit(date);
        const byEmployee = new Map();
        assignments.forEach((assignment) => {
            const shift = shiftById.get(assignment.shiftId);
            if (!shift?.isActive || !(Number(shift.workDays) & bit) || dateOnly(assignment.effectiveFrom) > dateValue || (assignment.effectiveTo && dateOnly(assignment.effectiveTo) < dateValue)) return;
            const employee = employeeById.get(assignment.employeeId);
            if (!employee) return;
            const current = byEmployee.get(employee.id) || { employee, shifts: [] };
            if (!current.shifts.some((item) => item.id === shift.id)) current.shifts.push(shift);
            byEmployee.set(employee.id, current);
        });
        return [...byEmployee.values()].sort((a, b) => a.employee.employeeCode.localeCompare(b.employee.employeeCode, "vi"));
    }, [assignments, employeeById, shiftById]);

    const monthDates = useMemo(() => {
        const [year, month] = calendarMonth.split("-").map(Number);
        const first = new Date(year, month - 1, 1);
        const offset = (first.getDay() + 6) % 7;
        const daysInMonth = new Date(year, month, 0).getDate();
        const count = Math.ceil((offset + daysInMonth) / 7) * 7;
        return Array.from({ length: count }, (_, index) => {
            const date = new Date(year, month - 1, index - offset + 1);
            return date.getMonth() === month - 1 ? date : null;
        });
    }, [calendarMonth]);

    const selectedDateObject = useMemo(() => {
        const [year, month, day] = selectedDate.split("-").map(Number);
        return new Date(year, month - 1, day);
    }, [selectedDate]);
    const scheduled = useMemo(() => scheduleForDate(selectedDateObject), [scheduleForDate, selectedDateObject]);
    const attendanceByEmployee = useMemo(() => {
        const result = new Map();
        attendance.filter((row) => dateOnly(row.attendanceDate) === selectedDate).forEach((row) => {
            const previous = result.get(row.employeeId);
            if (!previous || new Date(row.lastUpdatedTime || row.createdTime) > new Date(previous.lastUpdatedTime || previous.createdTime)) result.set(row.employeeId, row);
        });
        return result;
    }, [attendance, selectedDate]);
    const visibleScheduled = useMemo(() => {
        const term = search.trim().toLocaleLowerCase();
        if (!term) return scheduled;
        return scheduled.filter(({ employee }) => `${employee.employeeCode} ${employee.fullName}`.toLocaleLowerCase().includes(term));
    }, [scheduled, search]);

    const moveMonth = (offset) => {
        const [year, month] = calendarMonth.split("-").map(Number);
        const next = new Date(year, month - 1 + offset, 1);
        setCalendarMonth(dayKey(next).slice(0, 7));
    };
    const chooseDate = (value) => {
        if (!value) return;
        setSelectedDate(value);
        setCalendarMonth(value.slice(0, 7));
    };
    const monthLabel = new Date(`${calendarMonth}-01T00:00:00`).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
    const selectedLabel = selectedDateObject.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

    return (
        <HrAppLayout>
            <div className="att-content work-schedule-page">
                {error && <div className="att-error">{error}</div>}
                {loading ? <div className="att-loading">Đang tải lịch làm...</div> : (
                    <>
                        <section className="work-schedule-calendar att-card">
                            <div className="work-schedule-calendar-head">
                                <button type="button" className="att-cal-nav" onClick={() => moveMonth(-1)} aria-label="Tháng trước">‹</button>
                                <h2>{monthLabel}</h2>
                                <button type="button" className="att-cal-nav" onClick={() => moveMonth(1)} aria-label="Tháng sau">›</button>
                                <label className="work-schedule-date-picker">Chọn ngày <input type="date" value={selectedDate} onChange={(event) => chooseDate(event.target.value)} /></label>
                                <button type="button" className="admin-link-btn" onClick={() => chooseDate(vnToday())}>Xem hôm nay</button>
                            </div>
                            <div className="work-schedule-weekdays"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>
                            <div className="work-schedule-days">
                                {monthDates.map((date, index) => {
                                    if (!date) return <span key={`empty-${index}`} className="work-schedule-day is-empty" />;
                                    const key = dayKey(date);
                                    const count = scheduleForDate(date).length;
                                    return <button key={key} type="button" className={`work-schedule-day${selectedDate === key ? " is-selected" : ""}${key === vnToday() ? " is-today" : ""}`} onClick={() => chooseDate(key)} aria-label={`${date.getDate()} tháng ${date.getMonth() + 1}, ${count} người có lịch làm`}>
                                        <span>{date.getDate()}</span><small>{count}</small>
                                    </button>;
                                })}
                            </div>
                            <div className="work-schedule-calendar-foot"><span><i className="work-schedule-count-dot" />Số người có lịch làm</span><span>Chọn ngày để xem danh sách ca</span></div>
                        </section>

                        <div className="work-schedule-day-summary">
                            <div><span>Ngày đang xem</span><strong>{selectedLabel}</strong></div>
                            <div><span>Người có lịch làm</span><strong>{scheduled.length} người</strong></div>
                        </div>

                        <section className="att-card work-schedule-list">
                            <div className="work-schedule-list-head">
                                <label className="admin-search"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã hoặc tên nhân viên..." aria-label="Tìm nhân viên" /></label>
                            </div>
                            <div className="att-table-wrap">
                                <table className="att-table work-schedule-table">
                                    <thead><tr><th>Nhân viên</th><th>Ca làm</th><th>Giờ làm</th><th>Chấm công</th><th>Duyệt chấm công</th></tr></thead>
                                    <tbody>
                                        {visibleScheduled.length === 0 ? <tr><td colSpan={5}><span className="att-muted">{scheduled.length ? "Không tìm thấy nhân viên phù hợp." : "Ngày này chưa có nhân viên được xếp lịch làm."}</span></td></tr> : visibleScheduled.map(({ employee, shifts: employeeShifts }) => {
                                            const record = attendanceByEmployee.get(employee.id);
                                            return <tr key={employee.id}>
                                                <td><span className="work-schedule-employee-code">{employee.employeeCode}</span><strong className="work-schedule-employee-name">{employee.fullName}</strong></td>
                                                <td>{employeeShifts.map((shift) => shift.name).join(", ")}</td>
                                                <td>{employeeShifts.map((shift) => `${String(shift.startTime).slice(0, 5)}–${String(shift.endTime).slice(0, 5)}`).join(", ")}</td>
                                                <td><span className={`att-badge ${record ? "ok" : "warn"}`}>{record ? "Đã chấm công" : "Chưa chấm công"}</span></td>
                                                <td><span className={`att-badge ${record ? approvalClass(Number(record.approvalStatus)) : ""}`}>{record ? approvalLabel(Number(record.approvalStatus)) : "Chưa có bản ghi"}</span></td>
                                            </tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </HrAppLayout>
    );
};

export default EmployeeWorkSchedulePage;
