import { useState, useEffect } from "react";
import hrApi from "../api/hrApi";
import {
    GENDER_LABELS,
    LABOR_LABELS,
    EMP_STATUS_LABELS,
} from "../hrLabels";

// Modal thêm / sửa nhân viên (HR).
// employee = null -> thêm mới; employee có giá trị -> sửa.
const GENDER_OPTIONS = Object.entries(GENDER_LABELS).map(([v, l]) => ({
    v: Number(v),
    l,
}));
const LABOR_OPTIONS = Object.entries(LABOR_LABELS).map(([v, l]) => ({
    v: Number(v),
    l,
}));
const STATUS_OPTIONS = Object.entries(EMP_STATUS_LABELS).map(([v, l]) => ({
    v: Number(v),
    l,
}));

const EMPTY = {
    employeeCode: "",
    givenName: "",
    familyName: "",
    birthDate: "",
    gender: 0,
    citizenId: "",
    phoneNumber: "",
    email: "",
    permanentAddress: "",
    departmentId: "",
    positionId: "",
    startDate: "",
    probationEndDate: "",
    laborType: 1,
    status: 1,
    usePhoneAttendance: false,
    note: "",
};

const toForm = (e) => ({
    ...EMPTY,
    employeeCode: e.employeeCode || "",
    givenName: e.givenName || "",
    familyName: e.familyName || "",
    birthDate: e.birthDate ? String(e.birthDate).slice(0, 10) : "",
    gender: e.gender ?? 0,
    citizenId: e.citizenId || "",
    phoneNumber: e.phoneNumber || "",
    email: e.email || "",
    permanentAddress: e.permanentAddress || "",
    departmentId: e.departmentId || "",
    positionId: e.positionId || "",
    startDate: e.startDate ? String(e.startDate).slice(0, 10) : "",
    probationEndDate: e.probationEndDate
        ? String(e.probationEndDate).slice(0, 10)
        : "",
    laborType: e.laborType ?? 1,
    status: e.status ?? 1,
    usePhoneAttendance: !!e.usePhoneAttendance,
    note: e.note || "",
});

const buildPayload = (f) => ({
    employeeCode: f.employeeCode,
    givenName: f.givenName,
    familyName: f.familyName,
    birthDate: f.birthDate || null,
    gender: Number(f.gender),
    citizenId: f.citizenId || null,
    phoneNumber: f.phoneNumber || null,
    email: f.email || null,
    permanentAddress: f.permanentAddress || null,
    departmentId: f.departmentId || null,
    positionId: f.positionId || null,
    startDate: f.startDate || null,
    probationEndDate: f.probationEndDate || null,
    laborType: Number(f.laborType),
    status: Number(f.status),
    usePhoneAttendance: !!f.usePhoneAttendance,
    note: f.note || null,
});

const EmployeeFormModal = ({
    open,
    employee,
    departments,
    positions,
    onClose,
    onSaved,
}) => {
    const [form, setForm] = useState(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(toForm(employee || {}));
            setError("");
        }
    }, [open, employee]);

    if (!open || !form) return null;

    const set = (k) => (e) =>
        setForm({
            ...form,
            [k]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value,
        });

    const submit = async (e) => {
        e.preventDefault();
        if (!form.employeeCode || !form.givenName || !form.familyName) {
            setError("Mã NV, Họ, Tên là bắt buộc.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const payload = buildPayload(form);
            if (employee) {
                payload.id = employee.id;
                await hrApi.updateEmployee(payload);
            } else {
                await hrApi.createEmployee(payload);
            }
            onSaved?.();
            setForm(null);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Không thể lưu nhân viên."
            );
        } finally {
            setSaving(false);
        }
    };

    const F = (
        <>
            <div className="att-form-grid">
                <label>
                    Mã NV *
                    <input required value={form.employeeCode} onChange={set("employeeCode")} />
                </label>
                <label>
                    Họ *
                    <input required value={form.familyName} onChange={set("familyName")} />
                </label>
                <label>
                    Tên *
                    <input required value={form.givenName} onChange={set("givenName")} />
                </label>
                <label>
                    Ngày sinh
                    <input type="date" value={form.birthDate} onChange={set("birthDate")} />
                </label>
                <label>
                    Giới tính
                    <select value={form.gender} onChange={set("gender")}>
                        {GENDER_OPTIONS.map((o) => (
                            <option key={o.v} value={o.v}>{o.l}</option>
                        ))}
                    </select>
                </label>
                <label>
                    CCCD
                    <input value={form.citizenId} onChange={set("citizenId")} />
                </label>
                <label>
                    Điện thoại
                    <input value={form.phoneNumber} onChange={set("phoneNumber")} />
                </label>
                <label>
                    Email
                    <input type="email" value={form.email} onChange={set("email")} />
                </label>
                <label>
                    Phòng ban
                    <select value={form.departmentId} onChange={set("departmentId")}>
                        <option value="">— Chọn —</option>
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Chức vụ
                    <select value={form.positionId} onChange={set("positionId")}>
                        <option value="">— Chọn —</option>
                        {positions.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Ngày vào
                    <input type="date" value={form.startDate} onChange={set("startDate")} />
                </label>
                <label>
                    Hết thử việc
                    <input type="date" value={form.probationEndDate} onChange={set("probationEndDate")} />
                </label>
                <label>
                    Loại lao động
                    <select value={form.laborType} onChange={set("laborType")}>
                        {LABOR_OPTIONS.map((o) => (
                            <option key={o.v} value={o.v}>{o.l}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Trạng thái
                    <select value={form.status} onChange={set("status")}>
                        {STATUS_OPTIONS.map((o) => (
                            <option key={o.v} value={o.v}>{o.l}</option>
                        ))}
                    </select>
                </label>
            </div>
            <label>
                Địa chỉ thường trú
                <input value={form.permanentAddress} onChange={set("permanentAddress")} />
            </label>
            <label>
                Ghi chú
                <textarea rows="2" value={form.note} onChange={set("note")} />
            </label>
            <label className="att-form-check">
                <input type="checkbox" checked={form.usePhoneAttendance} onChange={set("usePhoneAttendance")} />
                Cho phép chấm công qua điện thoại
            </label>
        </>
    );

    return (
        <div className="att-guide-overlay" onClick={onClose}>
            <div
                className="att-form-modal"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: 560 }}
            >
                <h2>{employee ? "Sửa nhân viên" : "Thêm nhân viên"}</h2>
                <form onSubmit={submit} className="att-form">
                    {F}
                    {error && <p className="att-cam-error">{error}</p>}
                    <div className="att-form-actions">
                        <button
                            type="button"
                            className="att-cam-btn-remove"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="admin-link-btn"
                            disabled={saving}
                        >
                            {saving ? "Đang lưu..." : employee ? "Lưu sửa" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeFormModal;
