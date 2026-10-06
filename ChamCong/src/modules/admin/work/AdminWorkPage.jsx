import { useState, useEffect, useMemo, useCallback } from "react";
import AdminAppLayout from "../layout/AdminAppLayout";
import adminApi from "../api/adminApi";
import { toCsv, downloadCsv } from "../hr/hrUtils";
import { translate, useLanguage } from "../../../services/i18n/LanguageProvider";
import "../admin.css";

// ===== LỊCH TRÌNH CÔNG TÁC (TRƯỚC TRỌNG) =====
// Dữ liệu lưu local (localStorage) vì chưa có API "trip" phía backend.
const LS_KEY = "marixa_admin_work_schedule";
const STATUS_LABELS = { 0: "Chờ duyệt", 1: "Đang thực hiện", 2: "Hoàn thành", 3: "Hủy" };
const STATUS_TONE = { 0: "warn", 1: "info", 2: "ok", 3: "bad" };
const TYPES = ["Công tác nội bộ", "Công tác ngoại tỉnh", "Đào tạo", "Hỗ trợ dự án", "Khảo sát", "Khác"];

const nowMonth = () => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
const today = () => new Date().toISOString().slice(0, 10);

const blankRow = () => ({ id: Date.now(), owner: "", department: "", title: "", type: TYPES[0], startDate: today(), endDate: today(), status: 0, note: "" });

const AdminWorkPage = () => {
    const { language } = useLanguage();
    const L = (t) => translate(t, language);

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [rows, setRows] = useState([]);
    const [month, setMonth] = useState(nowMonth());
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blankRow());
    const [error, setError] = useState("");

    // Đọc localStorage
    useEffect(() => {
        try { const raw = localStorage.getItem(LS_KEY); if (raw) setRows(JSON.parse(raw)); } catch { setRows([]); }
    }, []);
    // Lưu localStorage
    useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(rows)); } catch { /* noop */ } }, [rows]);

    const load = useCallback(async () => {
        try {
            const [e, d] = await Promise.all([adminApi.employees(), adminApi.departments()]);
            setEmployees(e.data.data?.items || []);
            setDepartments(d.data.data?.items || []);
        } catch { /* local data still usable */ }
    }, []);
    useEffect(() => { load(); }, [load]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return rows.filter((r) => {
            if (month && !String(r.startDate || "").slice(0, 7).startsWith(month) && !String(r.endDate || "").slice(0, 7).startsWith(month)) return false;
            if (statusFilter !== "" && String(r.status) !== statusFilter) return false;
            if (q) {
                const hay = `${r.title} ${r.owner} ${r.department} ${r.type}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [rows, month, search, statusFilter]);

    const kpi = useMemo(() => ({
        total: rows.length,
        active: rows.filter((r) => r.status === 1).length,
        pending: rows.filter((r) => r.status === 0).length,
        done: rows.filter((r) => r.status === 2).length,
    }), [rows]);

    const openAdd = () => { setEditing(null); setForm(blankRow()); setModal(true); };
    const openEdit = (row) => { setEditing(row.id); setForm({ ...row }); setModal(true); };

    const save = async () => {
        if (!form.title.trim()) { setError(L("Vui lòng nhập tên công tác.")); return; }
        setError("");
        if (editing) {
            setRows((prev) => prev.map((r) => (r.id === editing ? { ...form, id: editing } : r)));
        } else {
            setRows((prev) => [...prev, { ...form }]);
        }
        setModal(false);
    };

    const remove = (row) => {
        if (!window.confirm(`${L("Xóa công tác")} ${row.title}?`)) return;
        setRows((prev) => prev.filter((r) => r.id !== row.id));
    };

    const changeStatus = (row, status) => {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
    };

    const exportCsv = () => {
        const data = filtered.map((r) => ({
            [L("Mã")]: r.id, [L("Công tác")]: r.title, [L("Người phụ trách")]: r.owner, [L("Phòng ban")]: r.department,
            [L("Loại")]: r.type, [L("Từ")]: r.startDate, [L("Đến")]: r.endDate, [L("Trạng thái")]: L(STATUS_LABELS[r.status] || ""), [L("Ghi chú")]: r.note,
        }));
        downloadCsv("cong-tac.csv", toCsv(data, Object.keys(data[0] || { a: "" })));
    };

    return (
        <AdminAppLayout title={L("Công tác")} subtitle={L("Lịch trình công tác của nhân viên")}>
            <div className="att-content">
                {error && <div className="att-error" role="alert">{error}<button onClick={() => setError("")}>×</button></div>}

                <div className="admin-kpi-row">
                    <div className="admin-kpi"><span className="admin-kpi-label">{L("Tổng công tác")}</span><strong>{kpi.total}</strong><span className="admin-kpi-sub">{L("lượt")}</span></div>
                    <div className="admin-kpi admin-kpi--ok"><span className="admin-kpi-label">{L("Đang thực hiện")}</span><strong>{kpi.active}</strong></div>
                    <div className="admin-kpi admin-kpi--warn"><span className="admin-kpi-label">{L("Chờ duyệt")}</span><strong>{kpi.pending}</strong></div>
                    <div className="admin-kpi"><span className="admin-kpi-label">{L("Hoàn thành")}</span><strong>{kpi.done}</strong></div>
                </div>

                <section className="att-card">
                    <div className="admin-toolbar">
                        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} aria-label={L("Tháng")} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label={L("Trạng thái")}>
                            <option value="">{L("Tất cả trạng thái")}</option>
                            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{L(l)}</option>)}
                        </select>
                        <label className="admin-search">
                            <span aria-hidden="true">⌕</span>
                            <input type="search" placeholder={L("Tìm công tác / người phụ trách...")} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={L("Tìm")} />
                        </label>
                        <button type="button" className="admin-link-btn" onClick={exportCsv}>⬇ {L("Xuất CSV")}</button>
                        <button type="button" className="admin-link-btn" onClick={openAdd}>+ {L("Thêm công tác")}</button>
                    </div>

                    {/* Timeline */}
                    <div className="att-table-wrap">
                        <table className="att-table">
                            <thead>
                                <tr>
                                    <th>{L("Công tác")}</th>
                                    <th>{L("Người phụ trách")}</th>
                                    <th>{L("Phòng ban")}</th>
                                    <th>{L("Loại")}</th>
                                    <th>{L("Từ")}</th>
                                    <th>{L("Đến")}</th>
                                    <th>{L("Trạng thái")}</th>
                                    <th>{L("Thao tác")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="8" className="att-muted">{L("Chưa có công tác trong tháng này.")}</td></tr>
                                ) : filtered.map((r) => (
                                    <tr key={r.id}>
                                        <td><strong>{r.title}</strong>{r.note && <div className="att-muted work-note">{r.note}</div>}</td>
                                        <td>{r.owner || "—"}</td>
                                        <td>{r.department || "—"}</td>
                                        <td>{r.type}</td>
                                        <td>{new Date(r.startDate).toLocaleDateString("vi-VN")}</td>
                                        <td>{new Date(r.endDate).toLocaleDateString("vi-VN")}</td>
                                        <td>
                                            <select className="work-status-select" value={r.status} onChange={(e) => changeStatus(r, Number(e.target.value))} aria-label={L("Đổi trạng thái")}>
                                                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{L(l)}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <div className="admin-row-actions">
                                                <button type="button" className="admin-link-btn" onClick={() => openEdit(r)}>{L("Sửa")}</button>
                                                <button type="button" className="admin-link-btn admin-link-btn--danger" onClick={() => remove(r)}>{L("Xóa")}</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Modal thêm / sửa */}
                {modal && (
                    <div className="att-guide-overlay work-overlay" onMouseDown={(e) => e.target === e.currentTarget && setModal(false)}>
                        <section className="att-detail-modal work-modal">
                            <header className="att-detail-modal-head">
                                <div><h2>{editing ? L("Sửa công tác") : L("Thêm công tác")}</h2></div>
                                <button type="button" onClick={() => setModal(false)}>×</button>
                            </header>
                            <div className="work-form">
                                <label>{L("Tên công tác")}<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={L("VD: Khảo sát công trình")} autoFocus /></label>
                                <label>{L("Người phụ trách")}
                                    <select value={form.owner} onChange={(e) => { const emp = employees.find((x) => x.fullName === e.target.value); setForm({ ...form, owner: e.target.value, department: emp?.departmentName || form.department }); }}>
                                        <option value="">{L("Chọn nhân viên...")}</option>
                                        {employees.map((emp) => <option key={emp.id} value={emp.fullName}>{emp.employeeCode} · {emp.fullName}</option>)}
                                    </select>
                                </label>
                                <label>{L("Phòng ban")}
                                    <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                                        <option value="">{L("Chọn phòng ban...")}</option>
                                        {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                                    </select>
                                </label>
                                <label>{L("Loại")}
                                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                        {TYPES.map((t) => <option key={t} value={t}>{L(t)}</option>)}
                                    </select>
                                </label>
                                <div className="work-form-row">
                                    <label>{L("Từ ngày")}<input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label>
                                    <label>{L("Đến ngày")}<input type="date" value={form.endDate} min={form.startDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label>
                                </div>
                                <label>{L("Trạng thái")}
                                    <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
                                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{L(l)}</option>)}
                                    </select>
                                </label>
                                <label>{L("Ghi chú")}<textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder={L("Mục đích, địa điểm...")} /></label>
                                <div className="work-form-actions">
                                    <button type="button" className="admin-link-btn" onClick={() => setModal(false)}>{L("Hủy")}</button>
                                    <button type="button" className="admin-link-btn work-save" onClick={save}>{L("Lưu")}</button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </AdminAppLayout>
    );
};

export default AdminWorkPage;
