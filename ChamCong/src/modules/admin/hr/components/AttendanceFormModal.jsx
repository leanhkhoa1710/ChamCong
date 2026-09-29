import { useState, useEffect } from "react";

// Modal thêm / sửa bản ghi chấm công (hub Nhân sự).
// row = null -> thêm mới; row có giá trị -> sửa.
const STATUS_OPTIONS = [
    { v: "", l: "Chưa đánh giá" },
    { v: 1, l: "Đúng giờ" },
    { v: 2, l: "Đi trễ" },
    { v: 3, l: "Về sớm" },
    { v: 4, l: "Vắng mặt" },
    { v: 5, l: "Nghỉ phép" },
    { v: 6, l: "Lễ" },
    { v: 7, l: "Ngoại tuần" },
];

const APPROVAL_OPTIONS = [
    { v: 0, l: "Chờ duyệt" },
    { v: 1, l: "Đã duyệt" },
    { v: 2, l: "Từ chối" },
];

const buildDraft = (row) =>
    row
        ? {
              employeeId: row.employeeId,
              attendanceDate: (row.attendanceDate || "").slice(0, 10),
              status: row.status ?? "",
              actualHours: row.actualHours ?? "",
              approvalStatus: row.approvalStatus ?? 0,
              note: row.note || "",
          }
        : {
              employeeId: "",
              attendanceDate: new Date().toISOString().slice(0, 10),
              status: "",
              actualHours: "",
              approvalStatus: 0,
              note: "",
          };

const AttendanceFormModal = ({ open, row, employees, onClose, onSubmit }) => {
    const [form, setForm] = useState(null);
    const [error, setError] = useState("");

    // Nạp form mỗi lần mở (thêm: trống, sửa: từ row)
    useEffect(() => {
        if (open) {
            setForm(buildDraft(row));
            setError("");
        }
    }, [open, row]);

    if (!open || !form) return null;

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        if (!form.employeeId || !form.attendanceDate) {
            setError("Chọn nhân viên và ngày là bắt buộc.");
            return;
        }
        setError("");
        try {
            await onSubmit(form, !!row);
            setForm(null);
        } catch {
            // giữ form để người dùng sửa lỗi
        }
    };

    return (
        <div className="att-guide-overlay" onClick={onClose}>
            <div className="att-form-modal" onClick={(e) => e.stopPropagation()}>
                <h2>{row ? "Sửa bản ghi chấm công" : "Thêm bản ghi chấm công"}</h2>
                <form onSubmit={submit} className="att-form">
                    <label>
                        Nhân viên
                        <select required value={form.employeeId} onChange={set("employeeId")}>
                            <option value="">— Chọn nhân viên —</option>
                            {employees.map((x) => (
                                <option key={x.id} value={x.id}>
                                    {x.employeeCode} · {x.fullName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Ngày
                        <input type="date" required value={form.attendanceDate} onChange={set("attendanceDate")} />
                    </label>

                    <label>
                        Trạng thái
                        <select value={form.status} onChange={set("status")}>
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.l} value={o.v}>
                                    {o.l}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Giờ thực tế
                        <input type="number" min="0" step="0.5" value={form.actualHours} onChange={set("actualHours")} placeholder="Tùy chọn" />
                    </label>

                    <label>
                        Phê duyệt
                        <select value={form.approvalStatus} onChange={set("approvalStatus")}>
                            {APPROVAL_OPTIONS.map((o) => (
                                <option key={o.v} value={o.v}>
                                    {o.l}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Ghi chú
                        <textarea rows="2" value={form.note} onChange={set("note")} placeholder="Tùy chọn" />
                    </label>

                    {error && <p className="att-cam-error">{error}</p>}

                    <div className="att-form-actions">
                        <button type="button" className="att-cam-btn-remove" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="admin-link-btn">
                            {row ? "Lưu sửa" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AttendanceFormModal;
