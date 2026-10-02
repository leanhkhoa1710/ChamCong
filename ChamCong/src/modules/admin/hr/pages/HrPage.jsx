import { useState, useMemo } from "react";
import HrAppLayout from "../layout/HrAppLayout";
import adminApi from "../../api/adminApi";
import { useHrData } from "../hooks/useHrData";
import { useHrKpis } from "../hooks/useHrKpis";
import { useHrFilters } from "../hooks/useHrFilters";
import HrKpiCards from "../components/HrKpiCards";
import HrFilterBar from "../components/HrFilterBar";
import HrEmployeeTable from "../components/HrEmployeeTable";
import HrPagination from "../components/HrPagination";
import HrAddForm from "../components/HrAddForm";
import { downloadExcel, hrTemplate, exportEmployees, HR_HEADER_BY_KEY, parseCsv, readExcel } from "../hrUtils";
import "../../../../modules/attendance/attendance.css";
import "../hr.css";

const formatImportError = (error) => {
    const body = error.response?.data;
    if (typeof body?.message === "string") return [body.message];
    const validation = body?.errors || body?.data?.errors;
    if (validation && typeof validation === "object") {
        return Object.entries(validation).flatMap(([key, messages]) =>
            (Array.isArray(messages) ? messages : [messages]).map((message) =>
                `${HR_HEADER_BY_KEY[key] || key}: ${String(message)}`
            )
        );
    }
    return [error.message || "API từ chối dữ liệu."];
};

const PAGE_SIZE = 20;

const HrPage = () => {
    const data = useHrData();
    const kpis = useHrKpis(data);
    const { filters, setters, filtered, hasActiveFilter } = useHrFilters(
        data.employees
    );
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(() => new Set());
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [viewEmp, setViewEmp] = useState(null);
    const [tab, setTab] = useState("active"); // active | archive
    const [importReport, setImportReport] = useState(null);

    const active = filtered.filter((e) => [1, 2, 3].includes(e.status));
    const resigned = filtered.filter((e) => [4, 5].includes(e.status));
    const list = tab === "active" ? active : resigned;

    const pageCount = Math.ceil(list.length / PAGE_SIZE);
    const safePage = Math.min(page, Math.max(1, pageCount));
    const slice = list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    // Lương theo nhân viên (từ bảng lương thật)
    const salaryMap = useMemo(() => {
        const m = new Map();
        data.salaries.forEach((s) => m.set(s.employeeId, s.basicSalary));
        return m;
    }, [data.salaries]);

    const toggle = (id) =>
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    const toggleAll = (uncheck) =>
        setSelected(
            uncheck ? new Set() : new Set(slice.map((e) => e.id))
        );

    // ===== Excel / CSV (nhập / xuất / mẫu) =====
    const onTemplate = () => downloadExcel("mau-nhan-vien.xlsx", hrTemplate());
    const onExport = () => downloadExcel("danh-sach-nhan-vien.xlsx", exportEmployees(list, data));
    const onImportFile = async (file) => {
        if (!file) return;
        const extension = file.name.split(".").pop().toLowerCase();
        if (!["csv", "xlsx"].includes(extension)) {
            setImportReport({ created: 0, skipped: 0, errors: 1, warnings: 0, rows: [{ row: "—", code: "", status: "Không đọc được", details: ["Vui lòng chọn file .xlsx hoặc .csv."] }] });
            return;
        }
        try {
            const rows = extension === "xlsx"
                ? await readExcel(file)
                : parseCsv(await file.text());
            if (rows.length < 2) {
                setImportReport({ created: 0, skipped: 0, errors: 1, warnings: 0, rows: [{ row: "—", code: "", status: "Không đọc được", details: ["File rỗng hoặc thiếu dòng dữ liệu."] }] });
                return;
            }
            const headers = rows[0].map((h) => h.trim().toLowerCase());
            const requiredHeaders = ["EmployeeCode", "GivenName", "FamilyName"];
            const absentHeaders = requiredHeaders.filter((key) => {
                const candidates = [HR_HEADER_BY_KEY[key], key].map((x) => x.toLowerCase());
                return !headers.some((header) => candidates.includes(header));
            });
            if (absentHeaders.length) {
                setImportReport({
                    created: 0, skipped: 0, errors: 1, warnings: 0,
                    rows: [{ row: 1, code: "", status: "Thiếu cột", details: absentHeaders.map((key) => `Thiếu cột “${HR_HEADER_BY_KEY[key]}”.`) }],
                });
                return;
            }

            let created = 0;
            let skipped = 0;
            let errors = 0;
            let warnings = 0;
            const reportRows = [];
            const normalizeCode = (value) => String(value || "").trim().toUpperCase();
            const normalizePhone = (value) => {
                const digits = String(value || "").replace(/\D/g, "");
                if (digits.startsWith("0084")) return `0${digits.slice(4)}`;
                if (digits.length === 11 && digits.startsWith("84")) return `0${digits.slice(2)}`;
                return digits;
            };
            const normalizeCitizenId = (value) => String(value || "").replace(/[\s.-]/g, "").toUpperCase();
            const findId = (value, items) => {
                if (!value) return null;
                const match = items.find((item) =>
                    String(item.id).toLowerCase() === value.toLowerCase() ||
                    item.name?.trim().toLowerCase() === value.toLowerCase()
                );
                return match?.id || null;
            };
            const existingBy = { code: new Map(), phone: new Map(), citizenId: new Map() };
            const addToIndex = (employee) => {
                const name = employee.employeeCode || employee.fullName || "đã tồn tại";
                const keys = [
                    ["code", normalizeCode(employee.employeeCode)],
                    ["phone", normalizePhone(employee.phoneNumber)],
                    ["citizenId", normalizeCitizenId(employee.citizenId || employee.citizenIdNumber)],
                ];
                keys.forEach(([field, key]) => { if (key) existingBy[field].set(key, name); });
            };
            data.employees.forEach(addToIndex);

            for (let i = 1; i < rows.length; i++) {
                const rowNumber = i + 1;
                const get = (k) => {
                    const labels = [HR_HEADER_BY_KEY[k], k].filter(Boolean).map((value) => value.toLowerCase());
                    const idx = headers.findIndex((header) => labels.includes(header));
                    return idx >= 0 ? String(rows[i][idx] ?? "").trim() : "";
                };
                const code = get("EmployeeCode");
                const given = get("GivenName");
                const family = get("FamilyName");
                const details = [];
                const duplicateFields = [
                    ["code", code, "Mã nhân viên"],
                    ["phone", get("PhoneNumber"), "Số điện thoại"],
                    ["citizenId", get("CitizenId"), "CCCD / CMT"],
                ];
                const duplicateReasons = duplicateFields.flatMap(([field, value, label]) => {
                    const key = field === "code" ? normalizeCode(value) : field === "phone" ? normalizePhone(value) : normalizeCitizenId(value);
                    const existing = key && existingBy[field].get(key);
                    return existing ? [`${label} đã có trong hệ thống (${existing}).`] : [];
                });

                const required = [[code, "Mã nhân viên"], [given, "Họ / tên đệm"], [family, "Tên"]];
                required.forEach(([value, label]) => { if (!value) details.push(`Chưa điền ${label}.`); });
                const maxLengths = [[code, 50, "Mã nhân viên"], [given, 100, "Họ / tên đệm"], [family, 100, "Tên"], [get("PhoneNumber"), 20, "Số điện thoại"], [get("CitizenId"), 20, "CCCD / CMT"], [get("Email"), 150, "Email"]];
                maxLengths.forEach(([value, max, label]) => { if (value.length > max) details.push(`${label} vượt quá ${max} ký tự.`); });
                if (get("Email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("Email"))) details.push("Email không đúng định dạng.");

                const parseDate = (key) => {
                    const value = get(key);
                    if (!value) return null;
                    let match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
                    if (!match) {
                        const local = value.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
                        if (local) match = [local[0], local[3], local[2], local[1]];
                    }
                    const label = HR_HEADER_BY_KEY[key];
                    if (!match) { details.push(`${label} không đúng định dạng ngày (dùng YYYY-MM-DD hoặc DD/MM/YYYY).`); return null; }
                    const iso = `${match[1]}-${String(match[2]).padStart(2, "0")}-${String(match[3]).padStart(2, "0")}`;
                    const date = new Date(`${iso}T00:00:00Z`);
                    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) { details.push(`${label} không phải ngày hợp lệ.`); return null; }
                    return iso;
                };
                const dates = Object.fromEntries(["BirthDate", "CitizenIdIssuedDate", "StartDate", "ProbationEndDate", "ContractStart", "ContractEnd"].map((key) => [key, parseDate(key)]));
                const enumLabels = {
                    Gender: { "không tiết lộ": 0, nam: 1, nữ: 2, nu: 2 },
                    LaborType: { "chính thức": 1, "bán thời gian": 2, "thực tập sinh": 3, "cộng tác viên": 4 },
                    Status: { "thử việc": 1, "đang làm": 2, "tạm nghỉ": 3, "đã nghỉ việc": 4, "chấm dứt hợp đồng": 5, "chấm dứt hđ": 5 },
                    ContractType: { "thử việc": 1, "hạn định": 2, "không xác định": 3, "mùa vụ": 4 },
                    PaymentType: { "theo tháng": 1, tháng: 1, ngày: 2, giờ: 3, "theo sản phẩm": 4, "sản phẩm": 4 },
                };
                const readEnum = (key, fallback, max) => {
                    const value = get(key);
                    if (!value) return fallback;
                    const label = HR_HEADER_BY_KEY[key];
                    const mapped = enumLabels[key][value.toLowerCase()];
                    const parsed = mapped ?? Number(value);
                    if (!Number.isInteger(parsed) || parsed < 0 || parsed > max || (key !== "Gender" && parsed === 0)) {
                        details.push(`${label} không hợp lệ. Giá trị được phép: ${Object.keys(enumLabels[key]).join(", " )} hoặc mã từ ${key === "Gender" ? 0 : 1} đến ${max}.`);
                        return fallback;
                    }
                    return parsed;
                };
                const gender = readEnum("Gender", 0, 2);
                const laborType = readEnum("LaborType", 1, 4);
                const status = readEnum("Status", 1, 5);
                const contractType = readEnum("ContractType", 1, 4);
                const paymentType = readEnum("PaymentType", 1, 4);
                const readBoolean = (key) => {
                    const value = get(key).toLowerCase();
                    if (!value || ["false", "0", "no", "không", "khong"].includes(value)) return false;
                    if (["true", "1", "yes", "có", "co", "x"].includes(value)) return true;
                    details.push(`${HR_HEADER_BY_KEY[key]} chỉ nhận Có hoặc Không.`);
                    return false;
                };
                const usePhoneAttendance = readBoolean("UsePhoneAttendance");
                const isSocialInsuranceParticipant = readBoolean("IsSocialInsuranceParticipant");
                const readMoney = (key) => {
                    const value = get(key);
                    if (!value) return 0;
                    const parsed = Number(value.replace(/[\s,.]/g, ""));
                    if (!Number.isFinite(parsed) || parsed < 0) details.push(`${HR_HEADER_BY_KEY[key]} phải là số không âm.`);
                    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
                };
                const basicSalary = readMoney("BasicSalary");
                const positionAllowance = readMoney("PositionAllowance");
                const otherAllowance = readMoney("OtherAllowance");
                const departmentId = get("DepartmentName") ? findId(get("DepartmentName"), data.departments) : null;
                const positionId = get("PositionName") ? findId(get("PositionName"), data.positions) : null;
                const bankId = get("BankName") ? findId(get("BankName"), data.banks || []) : null;
                if (get("DepartmentName") && !departmentId) details.push(`Phòng ban “${get("DepartmentName")}” không có trong danh mục.`);
                if (get("PositionName") && !positionId) details.push(`Chức vụ “${get("PositionName")}” không có trong danh mục.`);
                if (get("BankName") && !bankId) details.push(`Ngân hàng “${get("BankName")}” không có trong danh mục.`);
                if (!!get("BankName") !== !!get("AccountNumber")) details.push("Cần điền cả Ngân hàng và Số tài khoản.");
                if (get("ContractNumber") && !dates.ContractStart && !dates.StartDate) details.push("Có Số hợp đồng nhưng thiếu Ngày ký hợp đồng hoặc Ngày vào làm.");

                if (duplicateReasons.length || details.length) {
                    if (duplicateReasons.length) skipped++;
                    else errors++;
                    reportRows.push({ row: rowNumber, code, status: duplicateReasons.length ? "Đã tồn tại — bỏ qua" : "Cần chỉnh sửa", details: [...duplicateReasons, ...details] });
                    continue;
                }

                try {
                    const response = await adminApi.createEmployee({
                        employeeCode: code,
                        givenName: given,
                        familyName: family,
                        birthDate: dates.BirthDate,
                        gender,
                        citizenId: get("CitizenId") || null,
                        citizenIdIssuedDate: dates.CitizenIdIssuedDate,
                        citizenIdIssuedPlace: get("CitizenIdIssuedPlace") || null,
                        email: get("Email") || null,
                        phoneNumber: get("PhoneNumber") || null,
                        permanentAddress: get("PermanentAddress") || null,
                        currentAddress: get("CurrentAddress") || null,
                        departmentId,
                        positionId,
                        startDate: dates.StartDate,
                        probationEndDate: dates.ProbationEndDate,
                        laborType,
                        status,
                        usePhoneAttendance,
                        note: get("Note") || null,
                    });
                    created++;
                    const employee = { employeeCode: code, phoneNumber: get("PhoneNumber"), citizenId: get("CitizenId") };
                    addToIndex(employee);
                    const resultData = response.data?.data;
                    let employeeId = resultData?.id || response.data?.id ||
                        (typeof resultData === "string" && /^[\da-f-]{36}$/i.test(resultData) ? resultData : null);
                    if (!employeeId) {
                        try {
                            const refresh = await adminApi.employees();
                            const employees = refresh.data?.data?.items || refresh.data?.data || [];
                            employeeId = employees.find((item) => normalizeCode(item.employeeCode) === normalizeCode(code))?.id || null;
                        } catch {
                            // The create request already succeeded; optional details are reported below.
                        }
                    }
                    const warningsForRow = [];
                    if (!employeeId) {
                        const hasRelatedInfo = get("ContractNumber") ||
                            ["BasicSalary", "PositionAllowance", "OtherAllowance"].some((key) => get(key)) ||
                            get("SocialInsuranceNumber") || get("PersonalTaxCode") || isSocialInsuranceParticipant ||
                            get("AccountNumber");
                        if (hasRelatedInfo) warningsForRow.push("Đã thêm nhân viên, nhưng không lấy được mã hồ sơ để lưu hợp đồng/lương/bảo hiểm/tài khoản.");
                        if (get("EndWorkDate") || get("EndWorkReason")) warningsForRow.push("API hiện chưa lưu Ngày/Lý do kết thúc làm việc.");
                        if (warningsForRow.length) {
                            warnings++;
                            reportRows.push({ row: rowNumber, code, status: "Đã thêm, cần kiểm tra", details: warningsForRow });
                        } else reportRows.push({ row: rowNumber, code, status: "Đã thêm thành công", details: [] });
                        continue;
                    }
                    const relatedRequests = [];
                    const contractNumber = get("ContractNumber");
                    const contractStart = dates.ContractStart || dates.StartDate;
                    if (contractNumber && contractStart) {
                        relatedRequests.push(["Hợp đồng", adminApi.createContract({
                            employeeId,
                            contractNumber,
                            contractType,
                            startDate: contractStart,
                            endDate: dates.ContractEnd,
                        })]);
                    }
                    if (["BasicSalary", "PositionAllowance", "OtherAllowance"].some((key) => get(key))) {
                        relatedRequests.push(["Lương", adminApi.createSalary({
                            employeeId,
                            paymentType,
                            basicSalary,
                            positionAllowance,
                            otherAllowance,
                            effectiveFrom: dates.StartDate || new Date().toISOString().slice(0, 10),
                        })]);
                    }
                    if (get("SocialInsuranceNumber") || get("PersonalTaxCode") || isSocialInsuranceParticipant) {
                        relatedRequests.push(["Bảo hiểm", adminApi.createInsurance({
                            employeeId,
                            socialInsuranceNumber: get("SocialInsuranceNumber") || null,
                            personalTaxCode: get("PersonalTaxCode") || null,
                            isSocialInsuranceParticipant,
                        })]);
                    }
                    if (bankId && get("AccountNumber")) {
                        relatedRequests.push(["Tài khoản ngân hàng", adminApi.createBankAccount({
                            employeeId,
                            bankId,
                            accountNumber: get("AccountNumber"),
                            isPrimary: true,
                        })]);
                    }
                    const relatedResults = await Promise.allSettled(relatedRequests.map(([, request]) => request));
                    warningsForRow.push(...relatedResults.flatMap((result, idx) => result.status === "rejected"
                        ? [`Không lưu được ${relatedRequests[idx][0]}: ${formatImportError(result.reason).join(" ")}`]
                        : []));
                    if (get("EndWorkDate") || get("EndWorkReason")) warningsForRow.push("API hiện chưa lưu Ngày/Lý do kết thúc làm việc.");
                    if (warningsForRow.length) {
                        warnings++;
                        reportRows.push({ row: rowNumber, code, status: "Đã thêm, cần kiểm tra", details: warningsForRow });
                    } else reportRows.push({ row: rowNumber, code, status: "Đã thêm thành công", details: [] });
                } catch (error) {
                    errors++;
                    reportRows.push({ row: rowNumber, code, status: "Không thêm được", details: formatImportError(error) });
                }
            }
            await data.reload();
            setImportReport({ created, skipped, errors, warnings, rows: reportRows });
        } catch (error) {
            setImportReport({ created: 0, skipped: 0, errors: 1, warnings: 0, rows: [{ row: "—", code: "", status: "Không đọc được", details: [error.message] }] });
        }
    };

    return (
        <HrAppLayout>
            {data.error && <div className="att-error">{data.error}</div>}
            {data.loading && <div className="att-loading">Đang tải...</div>}

                {!data.loading && !data.error && (
                    <div className="hr-body">
                        <HrKpiCards kpis={kpis} />

                        <div className="hr-topbar">
                            <div className="hr-tabs">
                                <button
                                    type="button"
                                    className={`hr-tab${tab === "active" ? " active" : ""}`}
                                    onClick={() => setTab("active")}
                                >
                                    {`Nhân sự đang làm (${active.length})`}
                                </button>
                                <button
                                    type="button"
                                    className={`hr-tab${tab === "archive" ? " active" : ""}`}
                                    onClick={() => setTab("archive")}
                                >
                                    {`Lưu trữ – đã nghỉ (${resigned.length})`}
                                </button>
                            </div>

                            <div className="hr-actions">
                                <button
                                    type="button"
                                    className="hr-btn hr-btn--ghost"
                                    onClick={() => document.getElementById("hr-import-file")?.click()}
                                    title="Nhập danh sách nhân viên từ tệp Excel hoặc CSV"
                                >
                                    ⬆ Nhập Excel
                                </button>
                                <button
                                    type="button"
                                    className="hr-btn hr-btn--ghost"
                                    onClick={onTemplate}
                                >
                                    ⬇ Tải mẫu
                                </button>
                                <button
                                    type="button"
                                    className="hr-btn hr-btn--ghost"
                                    onClick={onExport}
                                >
                                    ⬇ Xuất danh sách
                                </button>
                                <button
                                    type="button"
                                    className="hr-btn hr-btn--primary"
                                    onClick={() => { setEditingEmployee(null); setShowForm(true); }}
                                >
                                    + Thêm nhân viên
                                </button>
                            </div>
                        </div>

                        <HrFilterBar
                            departments={data.departments}
                            positions={data.positions}
                            filters={filters}
                            setters={setters}
                            hasActiveFilter={hasActiveFilter}
                            onAdd={() => { setEditingEmployee(null); setShowForm(true); }}
                            onImportFile={onImportFile}
                            onExport={onExport}
                            onTemplate={onTemplate}
                            showActions={false}
                        />

                        <HrEmployeeTable
                            employees={slice}
                            selected={selected}
                            onToggle={toggle}
                            onToggleAll={toggleAll}
                            data={{
                                contracts: data.contracts,
                                salaries: data.salaries,
                                insurance: data.insurance,
                                bankAccounts: data.bankAccounts,
                                salaryMap,
                            }}
                            onView={setViewEmp}
                            onEdit={(e) => { setViewEmp(null); setEditingEmployee(e); setShowForm(true); }}
                        />
                        {tab === "archive" && (
                            <p className="hr-note">
                                * Lưu trữ giữ toàn bộ hồ sơ đã nghỉ việc và
                                lịch sử trạng thái (soft-delete, không xóa dữ
                                liệu).
                            </p>
                        )}

                        <HrPagination
                            page={safePage}
                            pageCount={pageCount}
                            totalItems={list.length}
                            onPrev={() => setPage((p) => Math.max(1, p - 1))}
                            onNext={() =>
                                setPage((p) => Math.min(pageCount, p + 1))
                            }
                            onPage={setPage}
                        />

                        {showForm && (
                            <HrAddForm
                                departments={data.departments}
                                positions={data.positions}
                                banks={data.banks || []}
                                employee={editingEmployee}
                                onSaved={() => {
                                    setShowForm(false);
                                    setEditingEmployee(null);
                                    data.reload();
                                }}
                                onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
                            />
                        )}

                        {viewEmp && (
                            <div
                                className="hr-view-modal"
                                onClick={() => setViewEmp(null)}
                            >
                                <div className="hr-view-box" onClick={(e) => e.stopPropagation()}>
                                    <h3>{viewEmp.fullName} <small>· {viewEmp.employeeCode}</small></h3>
                                    <dl className="hr-view-grid">
                                        <span>Ngày sinh</span><dd>{viewEmp.birthDate ? new Date(viewEmp.birthDate).toLocaleDateString("vi-VN") : "—"}</dd>
                                        <span>Giới tính</span><dd>{({ 1: "Nam", 2: "Nữ" })[viewEmp.gender] || "Không tiết lộ"}</dd>
                                        <span>Điện thoại</span><dd>{viewEmp.phoneNumber || "—"}</dd>
                                        <span>Email</span><dd>{viewEmp.email || "—"}</dd>
                                        <span>CCCD</span><dd>{viewEmp.citizenId || "—"}</dd>
                                        <span>Phòng ban</span>
                                        <dd>{viewEmp.departmentName || "—"}</dd>
                                        <span>Chức vụ</span>
                                        <dd>{viewEmp.positionName || "—"}</dd>
                                        <span>Ngày vào làm</span><dd>{viewEmp.startDate ? new Date(viewEmp.startDate).toLocaleDateString("vi-VN") : "—"}</dd>
                                        <span>Địa chỉ</span><dd>{viewEmp.currentAddress || viewEmp.permanentAddress || "—"}</dd>
                                        <span>Ghi chú</span><dd>{viewEmp.note || "—"}</dd>
                                        <span>Trạng thái</span><dd>{({ 1: "Thử việc", 2: "Đang làm", 3: "Tạm nghỉ", 4: "Đã nghỉ việc", 5: "Chấm dứt hợp đồng" })[viewEmp.status] || "Chưa rõ"}</dd>
                                    </dl>
                                    <div className="hr-view-actions">
                                        <button type="button" className="hr-btn hr-btn--ghost" onClick={() => setViewEmp(null)}>Đóng</button>
                                        <button type="button" className="hr-btn hr-btn--primary" onClick={() => { setEditingEmployee(viewEmp); setViewEmp(null); setShowForm(true); }}>Sửa hồ sơ</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {importReport && (
                            <div className="hr-view-modal" onClick={() => setImportReport(null)}>
                                <section className="hr-import-report" role="dialog" aria-modal="true" aria-labelledby="hr-import-report-title" onClick={(event) => event.stopPropagation()}>
                                    <header className="hr-import-report-head">
                                        <h3 id="hr-import-report-title">Kết quả nhập nhân viên</h3>
                                        <button type="button" aria-label="Đóng" onClick={() => setImportReport(null)}>×</button>
                                    </header>
                                    <p className="hr-import-summary">
                                        Đã thêm <strong>{importReport.created}</strong> · Bỏ qua do trùng <strong>{importReport.skipped}</strong> · Lỗi <strong>{importReport.errors}</strong> · Cảnh báo <strong>{importReport.warnings}</strong>
                                    </p>
                                    {importReport.rows.length ? (
                                        <div className="hr-import-report-table-wrap">
                                            <table className="hr-import-report-table">
                                                <thead><tr><th>Dòng</th><th>Mã nhân viên</th><th>Kết quả</th><th>Chi tiết cần xử lý</th></tr></thead>
                                                <tbody>{importReport.rows.map((item, index) => (
                                                    <tr key={`${item.row}-${item.code}-${index}`} className={item.status.startsWith("Đã thêm") ? "hr-import-row--created" : ""}>
                                                        <td>{item.row}</td><td>{item.code || "—"}</td><td>{item.status}</td>
                                                        <td>{item.details.map((detail, detailIndex) => <div key={detailIndex}>{detail}</div>)}</td>
                                                    </tr>
                                                ))}</tbody>
                                            </table>
                                        </div>
                                    ) : <p className="hr-import-empty">Tất cả dòng hợp lệ đã được nhập.</p>}
                                    <div className="hr-import-report-actions">
                                        <button type="button" className="hr-btn hr-btn--primary" onClick={() => setImportReport(null)}>Đóng</button>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                )}

        </HrAppLayout>
    );
};

export default HrPage;
