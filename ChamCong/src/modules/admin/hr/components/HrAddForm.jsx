import { useState } from "react";
import adminApi from "../../api/adminApi";

// Form "Thêm nhân viên" 10 nhóm, đánh dấu * cho bắt buộc.
// Chỉ cho lưu khi đủ: Mã NV + Họ và tên (group 1) + Điều kiện làm việc.
const HR_ADDForm = ({
    departments,
    positions,
    banks,
    onSaved,
    onCancel,
}) => {
    const [form, setForm] = useState({
        // 1. Danh tính
        employeeCode: "",
        givenName: "",
        familyName: "",
        birthDate: "",
        gender: 0,
        // 2. Giấy tờ pháp lý
        citizenId: "",
        citizenIdIssuedDate: "",
        citizenIdIssuedPlace: "",
        // 3. Địa chỉ liên hệ
        phoneNumber: "",
        email: "",
        permanentAddress: "",
        currentAddress: "",
        // 4. Điều kiện làm việc
        departmentId: "",
        positionId: "",
        startDate: "",
        probationEndDate: "",
        laborType: 1,
        status: 1,
        usePhoneAttendance: false,
        // 5. Hợp đồng
        contractNumber: "",
        contractType: 1,
        contractStart: "",
        contractEnd: "",
        // 6. Lương & chế độ
        basicSalary: "",
        paymentType: 1,
        positionAllowance: "",
        otherAllowance: "",
        // 7. Bảo hiểm & thuế
        socialInsuranceNumber: "",
        personalTaxCode: "",
        isSocialInsuranceParticipant: false,
        // 8. Thanh toán
        bankId: "",
        accountNumber: "",
        isPrimary: true,
        // 9. Ghi chú
        note: "",
        // 10. Kết thúc làm việc
        endWorkDate: "",
        endWorkReason: "",
    });

    const set = (k) => (e) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));
    const setChk = (k) => (e) =>
        setForm((f) => ({ ...f, [k]: e.target.checked }));

    // Bắt buộc: mã NV + họ tên (given hoặc family phải có).
    const missing = [];
    if (!form.employeeCode.trim()) missing.push("Mã NV");
    if (!form.givenName.trim() && !form.familyName.trim())
        missing.push("Họ và tên");
    const canSave = missing.length === 0;

    const save = async () => {
        if (!canSave) return;
        const d = adminApi;
        const base = {
            employeeCode: form.employeeCode.trim(),
            givenName: form.givenName.trim(),
            familyName: form.familyName.trim(),
            birthDate: form.birthDate || null,
            gender: Number(form.gender),
            citizenId: form.citizenId || null,
            citizenIdIssuedDate: form.citizenIdIssuedDate || null,
            citizenIdIssuedPlace: form.citizenIdIssuedPlace || null,
            phoneNumber: form.phoneNumber || null,
            email: form.email || null,
            permanentAddress: form.permanentAddress || null,
            currentAddress: form.currentAddress || null,
            departmentId: form.departmentId || null,
            positionId: form.positionId || null,
            startDate: form.startDate || null,
            probationEndDate: form.probationEndDate || null,
            laborType: Number(form.laborType),
            status: Number(form.status),
            usePhoneAttendance: form.usePhoneAttendance,
            note: form.note || null,
        };
        try {
            const res = await d.createEmployee(base);
            onSaved?.(res?.data?.data?.id || null, missing);
        } catch (e) {
            alert(
                "Lưu thất bại: " +
                    (e.response?.data?.message || e.message)
            );
        }
    };

    const Grp = ({ t, children }) => (
        <div className="hrf-group">
            <h3>{t}</h3>
            {children}
        </div>
    );
    const F = ({ l, req, children }) => (
        <label className="hrf-field">
            <span>
                {l}
                {req && <i className="req">*</i>}
            </span>
            {children}
        </label>
    );
    const inp = "hrf-input";
    const sel = "hrf-input";

    return (
        <div className="hrf-modal">
            <div className="hrf-head">
                <h3>Thêm nhân viên</h3>
                <button type="button" onClick={onCancel} aria-label="Đóng">
                    ×
                </button>
            </div>

            <div className="hrf-body">
                <Grp t="1. Danh tính">
                    <F l="Mã nhân viên" req>
                        <input className={inp} value={form.employeeCode} onChange={set("employeeCode")} placeholder="NV001" />
                    </F>
                    <F l="Họ / tên đệm" req>
                        <input className={inp} value={form.givenName} onChange={set("givenName")} placeholder="Văn" />
                    </F>
                    <F l="Tên" req>
                        <input className={inp} value={form.familyName} onChange={set("familyName")} placeholder="Nguyễn" />
                    </F>
                    <F l="Ngày sinh">
                        <input type="date" className={inp} value={form.birthDate} onChange={set("birthDate")} />
                    </F>
                    <F l="Giới tính">
                        <select className={sel} value={form.gender} onChange={set("gender")}>
                            <option value={0}>Không tiết lộ</option>
                            <option value={1}>Nam</option>
                            <option value={2}>Nữ</option>
                        </select>
                    </F>
                </Grp>

                <Grp t="2. Giấy tờ pháp lý">
                    <F l="CCCD / CMT">
                        <input className={inp} value={form.citizenId} onChange={set("citizenId")} />
                    </F>
                    <F l="Ngày cấp">
                        <input type="date" className={inp} value={form.citizenIdIssuedDate} onChange={set("citizenIdIssuedDate")} />
                    </F>
                    <F l="Nơi cấp">
                        <input className={inp} value={form.citizenIdIssuedPlace} onChange={set("citizenIdIssuedPlace")} />
                    </F>
                </Grp>

                <Grp t="3. Địa chỉ liên hệ">
                    <F l="Điện thoại">
                        <input className={inp} value={form.phoneNumber} onChange={set("phoneNumber")} />
                    </F>
                    <F l="Email">
                        <input type="email" className={inp} value={form.email} onChange={set("email")} />
                    </F>
                    <F l="Địa chỉ thường trú">
                        <input className={inp} value={form.permanentAddress} onChange={set("permanentAddress")} />
                    </F>
                    <F l="Địa chỉ hiện tại">
                        <input className={inp} value={form.currentAddress} onChange={set("currentAddress")} />
                    </F>
                </Grp>

                <Grp t="4. Điều kiện làm việc">
                    <F l="Phòng ban">
                        <select className={sel} value={form.departmentId} onChange={set("departmentId")}>
                            <option value="">— Chọn phòng ban —</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </F>
                    <F l="Chức vụ">
                        <select className={sel} value={form.positionId} onChange={set("positionId")}>
                            <option value="">— Chọn chức vụ —</option>
                            {positions.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </F>
                    <F l="Ngày vào">
                        <input type="date" className={inp} value={form.startDate} onChange={set("startDate")} />
                    </F>
                    <F l="Hết thử việc">
                        <input type="date" className={inp} value={form.probationEndDate} onChange={set("probationEndDate")} />
                    </F>
                    <F l="Loại lao động">
                        <select className={sel} value={form.laborType} onChange={set("laborType")}>
                            <option value={1}>Chính thức</option>
                            <option value={2}>Bán thời gian</option>
                            <option value={3}>Thực tập sinh</option>
                            <option value={4}>Cộng tác viên</option>
                        </select>
                    </F>
                    <F l="Trạng thái">
                        <select className={sel} value={form.status} onChange={set("status")}>
                            <option value={1}>Thử việc</option>
                            <option value={2}>Đang làm</option>
                            <option value={3}>Tạm nghỉ</option>
                            <option value={4}>Đã nghỉ việc</option>
                            <option value={5}>Chấm dứt HĐ</option>
                        </select>
                    </F>
                    <label className="hrf-check">
                        <input type="checkbox" checked={form.usePhoneAttendance} onChange={setChk("usePhoneAttendance")} />
                        Chấm công qua điện thoại
                    </label>
                </Grp>

                <Grp t="5. Hợp đồng">
                    <F l="Số hợp đồng">
                        <input className={inp} value={form.contractNumber} onChange={set("contractNumber")} />
                    </F>
                    <F l="Loại hợp đồng">
                        <select className={sel} value={form.contractType} onChange={set("contractType")}>
                            <option value={1}>Thử việc</option>
                            <option value={2}>Hạn định</option>
                            <option value={3}>Không xác định</option>
                            <option value={4}>Mùa vụ</option>
                        </select>
                    </F>
                    <F l="Ngày ký">
                        <input type="date" className={inp} value={form.contractStart} onChange={set("contractStart")} />
                    </F>
                    <F l="Hết hạn">
                        <input type="date" className={inp} value={form.contractEnd} onChange={set("contractEnd")} />
                    </F>
                </Grp>

                <Grp t="6. Lương & chế độ">
                    <F l="Lương cơ bản">
                        <input type="number" className={inp} value={form.basicSalary} onChange={set("basicSalary")} />
                    </F>
                    <F l="Phụ cấp chức vụ">
                        <input type="number" className={inp} value={form.positionAllowance} onChange={set("positionAllowance")} />
                    </F>
                    <F l="Phụ cấp khác">
                        <input type="number" className={inp} value={form.otherAllowance} onChange={set("otherAllowance")} />
                    </F>
                </Grp>

                <Grp t="7. Bảo hiểm & thuế">
                    <F l="Số BHXH">
                        <input className={inp} value={form.socialInsuranceNumber} onChange={set("socialInsuranceNumber")} />
                    </F>
                    <F l="Mã TNCN">
                        <input className={inp} value={form.personalTaxCode} onChange={set("personalTaxCode")} />
                    </F>
                    <label className="hrf-check">
                        <input type="checkbox" checked={form.isSocialInsuranceParticipant} onChange={setChk("isSocialInsuranceParticipant")} />
                        Tham gia BHXH
                    </label>
                </Grp>

                <Grp t="8. Thanh toán">
                    <F l="Ngân hàng">
                        <select className={sel} value={form.bankId} onChange={set("bankId")}>
                            <option value="">— Chọn ngân hàng —</option>
                            {banks.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </F>
                    <F l="Số tài khoản">
                        <input className={inp} value={form.accountNumber} onChange={set("accountNumber")} />
                    </F>
                    <label className="hrf-check">
                        <input type="checkbox" checked={form.isPrimary} onChange={setChk("isPrimary")} />
                        TK chính
                    </label>
                </Grp>

                <Grp t="9. Ghi chú">
                    <F l="Ghi chú">
                        <textarea className={inp} rows={2} value={form.note} onChange={set("note")} />
                    </F>
                </Grp>

                <Grp t="10. Kết thúc làm việc">
                    <F l="Ngày kết thúc">
                        <input type="date" className={inp} value={form.endWorkDate} onChange={set("endWorkDate")} />
                    </F>
                    <F l="Lý do">
                        <input className={inp} value={form.endWorkReason} onChange={set("endWorkReason")} />
                    </F>
                </Grp>
            </div>

            <div className="hrf-foot">
                {!canSave && (
                    <span className="hrf-missing">
                        Thiếu: {missing.join(", ")} — không thể lưu hồ sơ
                    </span>
                )}
                <div className="hrf-actions">
                    <button type="button" className="hr-btn hr-btn--ghost" onClick={onCancel}>
                        Hủy
                    </button>
                    <button
                        type="button"
                        className="hr-btn hr-btn--primary"
                        disabled={!canSave}
                        onClick={save}
                    >
                        Lưu hồ sơ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HR_ADDForm;
