import { STATUS_LABELS } from "./hooks/useHrFilters";

// ===== Tiện ích CSV (không phụ thuộc package) =====
const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

export const toCsv = (rows, headers) => {
    const lines = [headers.map(esc).join(",")];
    rows.forEach((r) =>
        lines.push(headers.map((h) => esc(r[h])).join(","))
    );
    // BOM UTF-8 để Excel đọc tiếng Việt đúng
    return "\uFEFF" + lines.join("\n");
};

export const downloadCsv = (filename, content) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

// Mẫu nhập nhân viên (1 dòng, đúng các cột bắt buộc).
export const HR_CSV_HEADERS = [
    "EmployeeCode",
    "GivenName",
    "FamilyName",
    "Email",
    "PhoneNumber",
    "Department",
    "Position",
    "Status",
];

export const hrTemplate = () =>
    toCsv(
        [
            {
                EmployeeCode: "NV001",
                GivenName: "Văn",
                FamilyName: "Nguyễn",
                Email: "van.nguyen@congty.vn",
                PhoneNumber: "0900000000",
                Department: "IT",
                Position: "Developer",
                Status: "Thử việc",
            },
        ],
        HR_CSV_HEADERS
    );

// Xuất danh sách (đã lọc) ra CSV. salaryMap: Map(employeeId -> lương cơ bản).
export const exportEmployees = (employees, salaryMap) => {
    const rows = employees.map((e) => ({
        ma: e.employeeCode,
        ten: e.fullName,
        email: e.email,
        phone: e.phoneNumber,
        phong: e.departmentName,
        chucvu: e.positionName,
        luong: salaryMap ? salaryMap.get(e.id) || "" : "",
        trangthai: STATUS_LABELS[e.status] || "",
    }));
    return toCsv(rows, [
        "Mã NV",
        "Họ tên",
        "Email",
        "Điện thoại",
        "Phòng ban",
        "Chức vụ",
        "Lương cơ bản",
        "Trạng thái",
    ]);
};

// Đọc CSV (tách đúng dấu phẩy trong ngoặc kép) -> mảng mảng hàng.
export const parseCsv = (text) => {
    const rows = [];
    let row = [];
    let cur = "";
    let inQ = false;
    const src = text.replace(/^\uFEFF/, "");
    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if (inQ) {
            if (c === '"') {
                if (src[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else inQ = false;
            } else cur += c;
        } else if (c === '"') inQ = true;
        else if (c === ",") {
            row.push(cur);
            cur = "";
        } else if (c === "\n") {
            row.push(cur);
            cur = "";
            rows.push(row);
            row = [];
        } else if (c !== "\r") cur += c;
    }
    if (cur !== "" || row.length) {
        row.push(cur);
        rows.push(row);
    }
    return rows.filter((r) => r.some((x) => String(x).trim() !== ""));
};

// ===== Độ hoàn thiện hồ sơ (7 nhóm, theo dữ liệu thật) =====
export const docCompleteness = (e, data) => {
    const has = (arr) => arr.some((x) => x.employeeId === e.id);
    const items = [
        { key: "danh tính", done: !!(e.citizenId || e.citizenIdNumber) },
        { key: "pháp lý", done: !!e.citizenId },
        { key: "liên hệ", done: !!(e.email || e.phoneNumber) },
        { key: "điều kiện", done: !!e.status },
        { key: "hợp đồng", done: has(data.contracts) },
        { key: "lương&chế độ", done: has(data.salaries) },
        {
            key: "bảo hiểm&thue",
            done: has(data.insurance),
        },
        { key: "thanh toán", done: has(data.bankAccounts) },
    ];
    const done = items.filter((i) => i.done).length;
    const missing = items.filter((i) => !i.done).map((i) => i.key);
    return {
        percent: Math.round((done / items.length) * 100),
        missing,
    };
};
