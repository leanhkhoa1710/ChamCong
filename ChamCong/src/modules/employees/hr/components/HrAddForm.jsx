import { createContext, useContext, useRef, useState } from "react";
import employeeApi from "../../api/employeeApi";
import { useEmployeeCode } from "../../../../components/common/useEmployeeCode";

// Component con định nghĩa ở MODULE-LEVEL (ngoài component) để giữ identity ổn định
// qua từng lần render. Nếu định nghĩa bên trong thân HR_ADDForm thì mỗi keystroke
// sẽ tạo hàm mới → React unmount/remount cây con (kèm input) → mất focus,
// không nhập liên tục được.
const Grp = ({ t, children }) => (
    <div className="hrf-group">
        <h3>{t}</h3>
        {children}
    </div>
);
const FieldContext = createContext({ errors: {}, touched: {}, touch: () => {} });
const required = (value) => value.trim() ? "" : "Vui lòng nhập trường này.";
const money = (value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0) ? "" : "Nhập số tiền từ 0 trở lên.";
const today = () => new Date().toLocaleDateString("sv-SE");
const after = (startKey, label) => (value, form) => !value || !form[startKey] || value >= form[startKey] ? "" : `Ngày này không được trước ${label}.`;
const rules = {
    "Mã nhân viên": ["employeeCode", "Mã được tạo tự động sau khi chọn phòng ban.", required],
    "Họ / tên đệm": ["givenName", "Ví dụ: Nguyễn Văn. Tối đa 100 ký tự.", required],
    "Tên": ["familyName", "Ví dụ: An. Tối đa 100 ký tự.", required],
    "Ngày sinh": ["birthDate", "Chọn ngày sinh; không được là ngày tương lai.", (value) => !value || value <= today() ? "" : "Ngày sinh không được ở tương lai."],
    "CCCD / CMT": ["citizenId", "CCCD: 12 chữ số; CMND cũ: 9 chữ số.", (value) => !value || /^(\d{9}|\d{12})$/.test(value) ? "" : "Nhập 9 hoặc 12 chữ số, không có khoảng trắng."],
    "Ngày cấp": ["citizenIdIssuedDate", "Ngày cấp phải từ ngày sinh đến hôm nay.", (value, form) => !value ? "" : value > today() ? "Ngày cấp không được ở tương lai." : after("birthDate", "ngày sinh")(value, form)],
    "Điện thoại": ["phoneNumber", "Ví dụ: 0901234567 hoặc +84901234567.", (value) => !value || /^(0\d{9}|\+84\d{9})$/.test(value) ? "" : "Nhập 10 chữ số bắt đầu bằng 0, hoặc +84 và 9 chữ số."],
    "Email": ["email", "Ví dụ: ten@congty.com; có thể để trống.", (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Email chưa đúng định dạng, ví dụ: ten@congty.com."],
    "Hết thử việc": ["probationEndDate", "Không trước ngày vào làm.", after("startDate", "ngày vào làm")],
    "Số hợp đồng": ["contractNumber", "Nếu thêm hợp đồng, nhập số hợp đồng và ngày ký.", (value, form) => !value && (form.contractStart || form.contractEnd) ? "Vui lòng nhập số hợp đồng." : ""],
    "Ngày ký": ["contractStart", "Bắt buộc khi nhập số hợp đồng.", (value, form) => form.contractNumber && !value ? "Vui lòng chọn ngày ký hợp đồng." : ""],
    "Hết hạn": ["contractEnd", "Không trước ngày ký; để trống nếu không xác định thời hạn.", after("contractStart", "ngày ký")],
    "Lương cơ bản": ["basicSalary", "Đơn vị VNĐ. Nhập số, ví dụ: 15000000.", money],
    "Lương theo ngày": ["dailyRate", "Đơn vị VNĐ/ngày; để trống nếu không áp dụng.", money],
    "Phụ cấp chức vụ": ["positionAllowance", "Đơn vị VNĐ; không có thì để trống hoặc nhập 0.", money],
    "Phụ cấp khác": ["otherAllowance", "Đơn vị VNĐ; không có thì để trống hoặc nhập 0.", money],
    "Thưởng": ["bonus", "Đơn vị VNĐ; không có thì để trống hoặc nhập 0.", money],
    "Lương đóng BHXH": ["salaryInsuranceBase", "Đơn vị VNĐ, từ 0 trở lên.", money],
    "Hiệu lực đến": ["salaryEffectiveTo", "Không trước ngày hiệu lực từ; có thể để trống.", after("salaryEffectiveFrom", "ngày hiệu lực từ")],
    "Số BHXH": ["socialInsuranceNumber", "Nếu có, nhập mã BHXH gồm 10 chữ số.", (value) => !value || /^\d{10}$/.test(value) ? "" : "Mã BHXH phải có 10 chữ số."],
    "Ngày kết thúc tham gia": ["insuranceEndDate", "Không trước ngày bắt đầu tham gia.", after("insuranceStartDate", "ngày bắt đầu tham gia")],
    "Mức lương đóng BHXH": ["insuranceSalary", "Đơn vị VNĐ, từ 0 trở lên.", money],
    "Ngân hàng": ["bankId", "Chọn ngân hàng nếu nhập thông tin nhận lương.", (value, form) => !value && (form.accountNumber || form.accountHolderName) ? "Vui lòng chọn ngân hàng." : ""],
    "Số tài khoản": ["accountNumber", "Nhập 6–30 chữ số; không nhập số thẻ ngân hàng.", (value, form) => !value ? form.bankId || form.accountHolderName ? "Vui lòng nhập số tài khoản." : "" : /^\d{6,30}$/.test(value) ? "" : "Số tài khoản phải gồm 6–30 chữ số."],
    "Tên chủ tài khoản": ["accountHolderName", "Nhập đúng tên chủ tài khoản tại ngân hàng."],
};
const F = ({ l, req, children }) => {
    const { errors, touched, touch } = useContext(FieldContext);
    const [key, hint] = rules[l] || [];
    const error = touched[key] && errors[key];
    return (
        <label className={`hrf-field${error ? " hrf-field--invalid" : ""}`} onBlur={() => key && touch(key)}>
            <span>{l}{req && <i className="req">*</i>}</span>
            {children}
            {error ? <small className="hrf-error" role="alert">{error}</small> : hint && <small className="hrf-hint">{hint}</small>}
        </label>
    );
};

// Form hồ sơ nhân viên theo 8 nhóm; chỉ mã và họ tên là bắt buộc.
// Chỉ cho lưu khi đủ: Mã NV + Họ và tên (group 1) + Điều kiện làm việc.
const HR_ADDForm = ({
    departments,
    positions,
    banks,
    employee = null,
    related = {},
    onSaved,
    onCancel,
}) => {
    const [form, setForm] = useState(() => ({
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
        contractNumber: related.contract?.contractNumber || "",
        contractType: related.contract?.contractType ?? 1,
        contractStart: (related.contract?.startDate || "").slice(0, 10),
        contractEnd: (related.contract?.endDate || "").slice(0, 10),
        contractNote: related.contract?.note || "",
        // 6. Lương & chế độ
        basicSalary: related.salary?.basicSalary ?? "",
        dailyRate: related.salary?.dailyRate ?? "",
        paymentType: related.salary?.paymentType ?? 1,
        positionAllowance: related.salary?.positionAllowance ?? "",
        otherAllowance: related.salary?.otherAllowance ?? "",
        bonus: related.salary?.bonus ?? "",
        salaryInsuranceBase: related.salary?.socialInsuranceSalary ?? "",
        salaryEffectiveFrom: (related.salary?.effectiveFrom || "").slice(0, 10),
        salaryEffectiveTo: (related.salary?.effectiveTo || "").slice(0, 10),
        // 7. Bảo hiểm & thuế
        socialInsuranceNumber: related.insurance?.socialInsuranceNumber || "",
        healthInsuranceNumber: related.insurance?.healthInsuranceNumber || "",
        personalTaxCode: related.insurance?.personalTaxCode || "",
        isSocialInsuranceParticipant: Boolean(related.insurance?.isSocialInsuranceParticipant),
        insuranceStartDate: (related.insurance?.participationStartDate || "").slice(0, 10),
        insuranceEndDate: (related.insurance?.participationEndDate || "").slice(0, 10),
        insuranceSalary: related.insurance?.socialInsuranceSalary ?? "",
        insuranceStatus: related.insurance?.status ?? 1,
        // 8. Thanh toán
        bankId: related.bankAccount?.bankId || "",
        accountNumber: related.bankAccount?.accountNumber || "",
        accountHolderName: related.bankAccount?.accountHolderName || "",
        isPrimary: related.bankAccount?.isPrimary ?? true,
        bankAccountStatus: related.bankAccount?.status ?? 1,
        // 9. Ghi chú
        note: "",
        // 10. Kết thúc làm việc
        endWorkDate: "",
        endWorkReason: "",
        ...(employee ? {
            employeeCode: employee.employeeCode || "",
            givenName: employee.givenName || "",
            familyName: employee.familyName || "",
            birthDate: (employee.birthDate || "").slice(0, 10),
            gender: employee.gender ?? 0,
            citizenId: employee.citizenId || "",
            citizenIdIssuedDate: (employee.citizenIdIssuedDate || "").slice(0, 10),
            citizenIdIssuedPlace: employee.citizenIdIssuedPlace || "",
            phoneNumber: employee.phoneNumber || "",
            email: employee.email || "",
            permanentAddress: employee.permanentAddress || "",
            currentAddress: employee.currentAddress || "",
            departmentId: employee.departmentId || "",
            positionId: employee.positionId || "",
            startDate: (employee.startDate || "").slice(0, 10),
            probationEndDate: (employee.probationEndDate || "").slice(0, 10),
            laborType: employee.laborType ?? 1,
            status: employee.status ?? 1,
            usePhoneAttendance: Boolean(employee.usePhoneAttendance),
            note: employee.note || "",
        } : {}),
    }));

    const [saving, setSaving] = useState(false);
    const [touched, setTouched] = useState({});
    const errors = Object.fromEntries(Object.values(rules).filter(([, , validate]) => validate).map(([key, , validate]) => [key, validate(form[key], form)]));
    if (form.givenName.length > 100) errors.givenName = "Tối đa 100 ký tự.";
    if (form.familyName.length > 100) errors.familyName = "Tối đa 100 ký tự.";
    const savingRef = useRef(false);
    const createdId = useRef(null);
    const codeError = useEmployeeCode(form.departmentId, employee, setForm);
    const set = (k) => (e) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));
    const setChk = (k) => (e) =>
        setForm((f) => ({ ...f, [k]: e.target.checked }));

    // Bắt buộc: mã NV + họ tên (given hoặc family phải có).
    const missing = [];
    if (!form.employeeCode.trim()) missing.push("Mã NV");
    if (!form.givenName.trim()) missing.push("Họ / tên đệm");
    if (!form.familyName.trim()) missing.push("Tên");
    const canSave = missing.length === 0;

    const save = async () => {
        if (!canSave || savingRef.current) return;
        setTouched(Object.fromEntries(Object.keys(errors).map((key) => [key, true])));
        if (Object.values(errors).some(Boolean)) return;
        savingRef.current = true;
        setSaving(true);
        const d = employeeApi;
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
            const existingId = employee?.id || createdId.current;
            const res = existingId
                ? await d.updateEmployee({ ...base, id: existingId, userId: employee?.userId, managerId: employee?.managerId })
                : await d.createEmployee(base);
            const employeeId = existingId || res?.data?.data;
            if (!employeeId) throw new Error("Không nhận được mã nhân viên để lưu các mục hồ sơ.");
            let savedRelated = related;
            if (createdId.current) {
                const responses = await Promise.all([d.contracts(), d.salaries(), d.insurance(), d.bankAccounts()]);
                savedRelated = Object.fromEntries(["contract", "salary", "insurance", "bankAccount"].map((key, index) => [key, responses[index].data.data?.items?.find((item) => item.employeeId === employeeId)]));
            }
            createdId.current = employeeId;

            const hasContract = Boolean(form.contractNumber || form.contractStart || form.contractEnd || related.contract);
            if (hasContract && form.contractNumber && form.contractStart) {
                const payload = { employeeId, contractNumber: form.contractNumber, contractType: Number(form.contractType), startDate: form.contractStart, endDate: form.contractEnd || null, note: form.contractNote || null };
                await (savedRelated.contract ? d.updateContract({ ...payload, id: savedRelated.contract.id }) : d.createContract(payload));
            }

            const hasSalary = [form.basicSalary, form.dailyRate, form.positionAllowance, form.otherAllowance, form.bonus, form.salaryInsuranceBase].some((value) => value !== "") || related.salary;
            if (hasSalary) {
                const payload = { employeeId, paymentType: Number(form.paymentType), basicSalary: Number(form.basicSalary || 0), dailyRate: Number(form.dailyRate || 0), positionAllowance: Number(form.positionAllowance || 0), otherAllowance: Number(form.otherAllowance || 0), bonus: Number(form.bonus || 0), socialInsuranceSalary: Number(form.salaryInsuranceBase || 0), effectiveFrom: form.salaryEffectiveFrom || employee?.startDate?.slice(0, 10) || new Date().toISOString().slice(0, 10), effectiveTo: form.salaryEffectiveTo || null };
                await (savedRelated.salary ? d.updateSalary({ ...payload, id: savedRelated.salary.id }) : d.createSalary(payload));
            }

            const hasInsurance = Boolean(form.socialInsuranceNumber || form.healthInsuranceNumber || form.personalTaxCode || form.isSocialInsuranceParticipant || form.insuranceStartDate || form.insuranceEndDate || form.insuranceSalary !== "" || related.insurance);
            if (hasInsurance) {
                const payload = { employeeId, socialInsuranceNumber: form.socialInsuranceNumber || null, healthInsuranceNumber: form.healthInsuranceNumber || null, personalTaxCode: form.personalTaxCode || null, isSocialInsuranceParticipant: form.isSocialInsuranceParticipant, participationStartDate: form.insuranceStartDate || null, participationEndDate: form.insuranceEndDate || null, socialInsuranceSalary: Number(form.insuranceSalary || 0), status: Number(form.insuranceStatus) };
                await (savedRelated.insurance ? d.updateInsurance({ ...payload, id: savedRelated.insurance.id }) : d.createInsurance(payload));
            }

            const hasBankAccount = Boolean(form.bankId || form.accountNumber || form.accountHolderName || related.bankAccount);
            if (hasBankAccount && form.bankId && form.accountNumber) {
                const payload = { employeeId, bankId: form.bankId, accountNumber: form.accountNumber, accountHolderName: form.accountHolderName || null, isPrimary: form.isPrimary, status: Number(form.bankAccountStatus) };
                await (savedRelated.bankAccount ? d.updateBankAccount({ ...payload, id: savedRelated.bankAccount.id }) : d.createBankAccount(payload));
            }

            onSaved?.(employeeId, missing);
        } catch (e) {
            alert(
                "Lưu thất bại: " +
                    (e.response?.data?.message || e.message)
            );
        } finally {
            savingRef.current = false;
            setSaving(false);
        }
    };

    const inp = "hrf-input";
    const sel = "hrf-input";

    return (
        <div className="hrf-modal-backdrop">
            <section
                className="hrf-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="hrf-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="hrf-head">
                    <h3 id="hrf-title">{employee ? "Sửa hồ sơ nhân viên" : "Thêm nhân viên"}</h3>
                    <button type="button" onClick={onCancel} aria-label="Đóng">
                        ×
                    </button>
                </div>

                <FieldContext.Provider value={{ errors, touched, touch: (key) => setTouched((previous) => ({ ...previous, [key]: true })) }}>
                <div className="hrf-body">
                <p className="hrf-hint">Trường có dấu * là bắt buộc. Các thông tin chưa có có thể để trống. Lỗi sẽ hiện khi bạn rời khỏi ô nhập.</p>
                <Grp t="1. Danh tính">
                    <F l="Mã nhân viên" req>
                        <input className={inp} value={form.employeeCode} onChange={set("employeeCode")} readOnly={!employee} placeholder={form.departmentId ? "Đang lấy mã nhân viên…" : "Chọn bộ phận để tự tạo mã"} />
                        {codeError && <small role="alert">{codeError}</small>}
                    </F>
                    <F l="Họ / tên đệm" req>
                        <input className={inp} value={form.givenName} onChange={set("givenName")} placeholder="Nguyễn Văn" />
                    </F>
                    <F l="Tên" req>
                        <input className={inp} value={form.familyName} onChange={set("familyName")} placeholder="An" />
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
                        <select className={sel} value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value, employeeCode: employee ? f.employeeCode : "" }))}>
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
                            {employee?.status === 4 && <option value={4}>Đã nghỉ việc</option>}
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
                    <F l="Ghi chú hợp đồng">
                        <input className={inp} value={form.contractNote} onChange={set("contractNote")} />
                    </F>
                </Grp>

                <Grp t="6. Lương & chế độ">
                    <F l="Hình thức trả lương">
                        <select className={sel} value={form.paymentType} onChange={set("paymentType")}>
                            <option value={1}>Theo tháng</option>
                            <option value={2}>Theo ngày</option>
                            <option value={3}>Theo giờ</option>
                            <option value={4}>Theo sản phẩm</option>
                        </select>
                    </F>
                    <F l="Lương cơ bản">
                        <input type="number" className={inp} value={form.basicSalary} onChange={set("basicSalary")} />
                    </F>
                    <F l="Lương theo ngày">
                        <input type="number" className={inp} value={form.dailyRate} onChange={set("dailyRate")} />
                    </F>
                    <F l="Phụ cấp chức vụ">
                        <input type="number" className={inp} value={form.positionAllowance} onChange={set("positionAllowance")} />
                    </F>
                    <F l="Phụ cấp khác">
                        <input type="number" className={inp} value={form.otherAllowance} onChange={set("otherAllowance")} />
                    </F>
                    <F l="Thưởng">
                        <input type="number" className={inp} value={form.bonus} onChange={set("bonus")} />
                    </F>
                    <F l="Lương đóng BHXH">
                        <input type="number" className={inp} value={form.salaryInsuranceBase} onChange={set("salaryInsuranceBase")} />
                    </F>
                    <F l="Hiệu lực từ">
                        <input type="date" className={inp} value={form.salaryEffectiveFrom} onChange={set("salaryEffectiveFrom")} />
                    </F>
                    <F l="Hiệu lực đến">
                        <input type="date" className={inp} value={form.salaryEffectiveTo} onChange={set("salaryEffectiveTo")} />
                    </F>
                </Grp>

                <Grp t="7. Bảo hiểm & thuế">
                    <F l="Số BHXH">
                        <input className={inp} value={form.socialInsuranceNumber} onChange={set("socialInsuranceNumber")} />
                    </F>
                    <F l="Số bảo hiểm y tế (BHYT)">
                        <input className={inp} value={form.healthInsuranceNumber} onChange={set("healthInsuranceNumber")} />
                    </F>
                    <F l="Mã TNCN">
                        <input className={inp} value={form.personalTaxCode} onChange={set("personalTaxCode")} />
                    </F>
                    <F l="Tham gia BHXH">
                        <select className={sel} value={form.isSocialInsuranceParticipant ? "true" : "false"} onChange={(event) => setForm((f) => ({ ...f, isSocialInsuranceParticipant: event.target.value === "true" }))}>
                            <option value="false">Không</option>
                            <option value="true">Có</option>
                        </select>
                    </F>
                    <F l="Ngày bắt đầu tham gia">
                        <input type="date" className={inp} value={form.insuranceStartDate} onChange={set("insuranceStartDate")} />
                    </F>
                    <F l="Ngày kết thúc tham gia">
                        <input type="date" className={inp} value={form.insuranceEndDate} onChange={set("insuranceEndDate")} />
                    </F>
                    <F l="Mức lương đóng BHXH">
                        <input type="number" className={inp} value={form.insuranceSalary} onChange={set("insuranceSalary")} />
                    </F>
                    <F l="Trạng thái bảo hiểm">
                        <select className={sel} value={form.insuranceStatus} onChange={set("insuranceStatus")}>
                            <option value={1}>Đang tham gia</option>
                            <option value={2}>Tạm dừng</option>
                            <option value={3}>Đã chốt sổ</option>
                        </select>
                    </F>
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
                    <F l="Tên chủ tài khoản">
                        <input className={inp} value={form.accountHolderName} onChange={set("accountHolderName")} />
                    </F>
                    <F l="Trạng thái tài khoản">
                        <select className={sel} value={form.bankAccountStatus} onChange={set("bankAccountStatus")}>
                            <option value={1}>Đang dùng</option>
                            <option value={0}>Đã ngưng</option>
                        </select>
                    </F>
                    <label className="hrf-check">
                        <input type="checkbox" checked={form.isPrimary} onChange={setChk("isPrimary")} />
                        Tài khoản chính
                    </label>
                </Grp>

                <Grp t="Ghi chú">
                    <F l="Ghi chú">
                        <textarea className={inp} rows={2} value={form.note} onChange={set("note")} />
                    </F>
                </Grp>

                </div>
                </FieldContext.Provider>

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
                            disabled={!canSave || saving}
                            onClick={save}
                        >
                            {saving ? "Đang lưu…" : employee ? "Lưu thay đổi" : "Lưu hồ sơ"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HR_ADDForm;
