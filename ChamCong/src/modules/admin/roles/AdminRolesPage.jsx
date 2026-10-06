import { useState, useEffect, useCallback, useMemo } from "react";
import AdminAppLayout from "../layout/AdminAppLayout";
import adminApi from "../api/adminApi";
import { translate, useLanguage } from "../../../services/i18n/LanguageProvider";
import "../admin.css";

const COLS = {
    code: "Mã NV",
    name: "Họ tên",
    email: "Email",
    dept: "Phòng ban",
    position: "Chức vụ",
};
const DEFAULT_ORDER = ["code", "name", "dept", "position", "email"];
const ORDER_KEY = "marixa_roles_col_order";

const AdminRolesPage = () => {
    const { language } = useLanguage();
    const L = useCallback((t) => translate(t, language), [language]);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [userRolesMap, setUserRolesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });
    const [viewUser, setViewUser] = useState(null);
    const [addUserForm, setAddUserForm] = useState({ roleName: "", code: "" });
    const [dragCol, setDragCol] = useState(null);
    const [colOrder, setColOrder] = useState(() => {
        try {
            const raw = localStorage.getItem(ORDER_KEY);
            const saved = raw ? JSON.parse(raw) : null;
            return Array.isArray(saved) && DEFAULT_ORDER.every((k) => saved.includes(k)) ? saved : DEFAULT_ORDER;
        } catch { return DEFAULT_ORDER; }
    });

    const saveOrder = (next) => {
        setColOrder(next);
        try { localStorage.setItem(ORDER_KEY, JSON.stringify(next)); } catch { /* noop */ }
    };

    // user (id, userName) + employee info hợp nhất
    const userRows = useMemo(() => {
        const rows = [];
        const seen = new Set();
        users.forEach((u) => {
            if (seen.has(u.id)) return;
            seen.add(u.id);
            const emp = employees.find((x) => x.userId === u.id) || null;
            rows.push({ ...u, employeeCode: emp?.employeeCode, fullName: emp?.fullName || u.userName, employee: emp, departmentName: emp?.departmentName, positionName: emp?.positionName });
        });
        return rows;
    }, [users, employees]);

    const load = useCallback(async () => {
        setLoading(true); setError("");
        try {
            const [r, u, e] = await Promise.all([
                adminApi.roles(),
                adminApi.users(),
                adminApi.employees(),
            ]);
            const roleList = r.data.data?.items || [];
            const userList = u.data.data?.items || [];
            const empList = e.data.data?.items || [];
            setRoles(roleList);
            setUsers(userList);
            setEmployees(empList);
            // Lấy roles của từng user (theo user)
            const map = {};
            const validUsers = userList.filter((user) => empList.find((x) => x.userId === user.id));
            const results = await Promise.all(
                validUsers.slice(0, 200).map(async (user) => {
                    try {
                        const res = await adminApi.userRoles(user.id);
                        return [user.id, res.data.data || []];
                    } catch { return [user.id, []]; }
                })
            );
            results.forEach(([id, list]) => { map[id] = list; });
            setUserRolesMap(map);
        } catch (err) {
            setError(err.response?.data?.message || err.message || L("Không tải được dữ liệu phân quyền."));
        } finally { setLoading(false); }
    }, [L]);

    useEffect(() => { load(); }, [load]);

    // === Role CRUD ===
    const createRole = async () => {
        if (!form.name.trim()) return;
        try {
            await adminApi.createRole({ name: form.name.trim(), description: form.description.trim() });
            setShowNew(false); setForm({ name: "", description: "" });
            load();
        } catch (err) { setError(err.response?.data?.message || err.message); }
    };

    const deleteRole = async (role) => {
        if (!window.confirm(`${L("Xóa vai trò")} ${role.name}?`)) return;
        try {
            await adminApi.deleteRole(role.id);
            setUserRolesMap((prev) => {
                const next = {};
                Object.entries(prev).forEach(([uid, list]) => { next[uid] = list.filter((n) => n !== role.name); });
                return next;
            });
            load();
        } catch (err) { setError(err.response?.data?.message || err.message); }
    };

    // === Gán / gỡ role (luôn dùng role.id thật) ===
    const addRoleToUser = async (user, role) => {
        try {
            await adminApi.addRoleToUser(user.id, role.id);
            setUserRolesMap((prev) => ({ ...prev, [user.id]: [...new Set([...(prev[user.id] || []), role.name])] }));
        } catch (err) { setError(err.response?.data?.message || err.message); }
    };

    const addUserByCode = async () => {
        const q = addUserForm.code.trim().toUpperCase();
        const roleName = addUserForm.roleName;
        const role = roles.find((r) => r.name === roleName);
        if (!role || !q) return;
        const user = userRows.find((u) => String(u.employeeCode || "").toUpperCase() === q || String(u.id).toUpperCase() === q);
        if (!user) { setError(L("Không tìm thấy nhân viên theo mã này.")); return; }
        setError("");
        await addRoleToUser(user, role);
        setAddUserForm({ roleName: "", code: "" });
    };
    const removeRoleFromUser = async (user, role) => {
        if (!window.confirm(`${L("Gỡ khỏi vai trò")} ${role.name}? ${user.fullName} (${user.employeeCode || user.userName})`)) return;
        try {
            await adminApi.removeRoleFromUser(user.id, role.id);
            setUserRolesMap((prev) => ({ ...prev, [user.id]: (prev[user.id] || []).filter((n) => n !== role.name) }));
        } catch (err) { setError(err.response?.data?.message || err.message); }
    };

    // Nhóm thành viên của role: phòng ban -> chức vụ
    const groupedOf = (roleName) => {
        const members = userRows.filter((u) => (userRolesMap[u.id] || []).includes(roleName));
        const byDept = {};
        members.forEach((m) => {
            const d = m.departmentName || "Chưa có phòng ban";
            (byDept[d] = byDept[d] || []).push(m);
        });
        return Object.entries(byDept)
            .sort(([a], [b]) => a.localeCompare(b, "vi"))
            .map(([dept, list]) => ({
                dept,
                items: list.sort((a, b) => String(a.positionName || "").localeCompare(String(b.positionName || ""), "vi")),
            }));
    };

    const AVA_COLORS = ["#2f6df6", "#16a085", "#e67e22", "#8e44ad", "#c0392b", "#1565c0", "#00838f"];
    const avaColor = (name = "") => {
        let h = 0;
        for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
        return AVA_COLORS[Math.abs(h) % AVA_COLORS.length];
    };

    const cellOf = (key, u) => {
        switch (key) {
            case "code": return <span className="roles-code-chip">{u.employeeCode || "—"}</span>;
            case "name":
                return (
                    <span className="roles-name-cell">
                        <span className="roles-member-ava roles-member-ava--sm" style={{ background: avaColor(u.fullName || u.userName) }}>
                            {(u.fullName || u.userName || "?").slice(0, 1).toUpperCase()}
                        </span>
                        <span className="roles-name-text">{u.fullName}</span>
                    </span>
                );
            case "email": return u.email || "—";
            case "dept": return u.departmentName || "—";
            case "position": return <span className="roles-position-chip">{u.positionName || "—"}</span>;
            default: return "—";
        }
    };

    const kpi = useMemo(() => ({
        totalRoles: roles.length,
        totalUsers: userRows.length,
        assigned: userRows.reduce((sum, u) => sum + ((userRolesMap[u.id] || []).length ? 1 : 0), 0),
    }), [roles, userRows, userRolesMap]);

    const colSpan = colOrder.length + 2; // + phòng ban/giá + thao tác

    return (
        <AdminAppLayout title={L("Phân quyền")} subtitle={L("Quản lý vai trò (role) và người dùng trong từng vai trò")}>
            <div className="att-content">
                {error && <div className="att-error" role="alert">{error}<button onClick={() => setError("")}>×</button></div>}
                {loading ? <div className="att-loading">{L("Đang tải...")}</div> : (
                    <>
                        <div className="roles-toolbar">
                            <div className="admin-kpi-row roles-kpi-row">
                                <div className="admin-kpi roles-kpi roles-kpi--blue"><span className="roles-kpi-ico">🛡️</span><div><span className="admin-kpi-label">{L("Vai trò")}</span><strong>{kpi.totalRoles}</strong></div></div>
                                <div className="admin-kpi roles-kpi roles-kpi--teal"><span className="roles-kpi-ico">👤</span><div><span className="admin-kpi-label">{L("Người dùng")}</span><strong>{kpi.totalUsers}</strong></div></div>
                                <div className="admin-kpi roles-kpi roles-kpi--green"><span className="roles-kpi-ico">✅</span><div><span className="admin-kpi-label">{L("Đã có vai trò")}</span><strong>{kpi.assigned}</strong></div></div>
                            </div>
                            <button type="button" className="roles-add-btn" onClick={() => setShowNew((v) => !v)}>+ {L("Thêm vai trò")}</button>
                        </div>
                        {showNew && (
                            <div className="roles-new-form">
                                <input type="text" placeholder={L("Tên vai trò (VD: HR, Manager...)")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
                                <input type="text" placeholder={L("Mô tả (không bắt buộc)")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                                <button type="button" className="admin-link-btn" onClick={createRole}>{L("Lưu")}</button>
                                <button type="button" className="admin-link-btn admin-link-btn--danger" onClick={() => { setShowNew(false); setForm({ name: "", description: "" }); }}>{L("Hủy")}</button>
                            </div>
                        )}

                        {roles.length === 0 ? (
                            <div className="att-card"><p className="att-muted">{L("Chưa có vai trò nào. Hãy tạo vai trò đầu tiên.")}</p></div>
                        ) : (
                            <>
                            <div className="att-card roles-add-panel">
                                <div className="roles-add-panel-head">
                                    <h3>{L("Thêm người dùng vào vai trò")}</h3>
                                    <p className="att-muted">{L("Nhập mã nhân viên (VD: NV001) hoặc mã User để gán vào vai trò đã chọn.")}</p>
                                </div>
                                <div className="roles-add-form">
                                    <select
                                        value={addUserForm.roleName}
                                        onChange={(e) => setAddUserForm({ ...addUserForm, roleName: e.target.value })}
                                    >
                                        <option value="">{L("Chọn vai trò...")}</option>
                                        {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={L("Mã nhân viên (VD: NV001)")}
                                        value={addUserForm.code}
                                        onChange={(e) => setAddUserForm({ ...addUserForm, code: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && addUserByCode()}
                                    />
                                    <button
                                        type="button"
                                        className="roles-add-btn"
                                        onClick={addUserByCode}
                                        disabled={!addUserForm.roleName || !addUserForm.code.trim()}
                                    >
                                        + {L("Thêm")}
                                    </button>
                                </div>
                            </div>

                            <div className="roles-grid">
                                {roles.map((role, idx) => {
                                    const groups = groupedOf(role.name);
                                    const totalMembers = groups.reduce((s, g) => s + g.items.length, 0);
                                    const accent = idx % AVA_COLORS.length;
                                    return (
                                        <article key={role.id} className="roles-role-card" style={{ "--role-accent": AVA_COLORS[accent] }}>
                                            <header className="roles-role-head">
                                                <div className="roles-role-head-left">
                                                    <span className="roles-role-ava" style={{ background: AVA_COLORS[accent] }}>{(role.name || "?").slice(0, 1).toUpperCase()}</span>
                                                    <div>
                                                        <h3>{role.name}</h3>
                                                        <p>{role.description || L("Chưa có mô tả")}</p>
                                                    </div>
                                                </div>
                                                <div className="roles-role-actions">
                                                    <span className="roles-member-count" style={{ background: AVA_COLORS[accent] + "1a", color: AVA_COLORS[accent] }}>{totalMembers} {L("người")}</span>
                                                    <button type="button" className="roles-role-delete" onClick={() => deleteRole(role)} title={L("Xóa vai trò")}>×</button>
                                                </div>
                                            </header>

                                            <div className="att-table-wrap roles-role-table">
                                                <table className="att-table">
                                                    <thead>
                                                        <tr>
                                                            {colOrder.map((key) => (
                                                                <th
                                                                    key={key}
                                                                    draggable
                                                                    className="roles-drag-col"
                                                                    onDragStart={() => setDragCol(key)}
                                                                    onDragOver={(e) => e.preventDefault()}
                                                                    onDrop={() => {
                                                                        if (dragCol && dragCol !== key) {
                                                                            const next = colOrder.filter((x) => x !== dragCol);
                                                                            next.splice(next.indexOf(key), 0, dragCol);
                                                                            saveOrder(next);
                                                                        }
                                                                        setDragCol(null);
                                                                    }}
                                                                >
                                                                    <span className="roles-drag-ico" aria-hidden="true">⋮⋮</span> {L(COLS[key])}
                                                                </th>
                                                            ))}
                                                            <th className="roles-th-act">{L("Thao tác")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groups.length === 0 ? (
                                                            <tr><td colSpan={colSpan} className="att-muted roles-member-empty">{L("Chưa có người dùng trong vai trò này.")}</td></tr>
                                                        ) : groups.map((g) => (
                                                            [
                                                                <tr key={g.dept} className="roles-dept-row">
                                                                    <td colSpan={colSpan}>
                                                                        <span className="roles-dept-ico">🏢</span> {g.dept}
                                                                        <small> · {g.items.length} {L("người")} · {L("thứ tự theo chức vụ")}</small>
                                                                    </td>
                                                                </tr>,
                                                                ...g.items.map((u) => (
                                                                    <tr key={u.id}>
                                                                        {colOrder.map((key) => <td key={key} className={key === "name" ? "roles-td-strong" : ""}>{cellOf(key, u)}</td>)}
                                                                        <td className="roles-td-act">
                                                                            <button type="button" className="roles-eye-btn" title={L("Xem thông tin")} onClick={() => setViewUser(u)}>👁</button>
                                                                            <button type="button" className="roles-member-remove" title={L("Gỡ khỏi vai trò")} onClick={() => removeRoleFromUser(u, role)}>−</button>
                                                                        </td>
                                                                    </tr>
                                                                )),
                                                            ]
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </article>
                                    );
                                })}
                            </div>
                            </>
                        )}

                        {userRows.some((u) => (userRolesMap[u.id] || []).length === 0) && (
                            <section className="att-card">
                                <div className="admin-toolbar"><h3 className="roles-card-title">{L("Người dùng chưa có vai trò")}</h3></div>
                                <div className="roles-orphan-list">
                                    {userRows.filter((u) => (userRolesMap[u.id] || []).length === 0)
                                        .sort((a, b) => String(a.employeeCode || "zzz").localeCompare(String(b.employeeCode || "zzz")))
                                        .map((u) => (
                                            <span key={u.id} className="roles-orphan-chip">{u.employeeCode || "—"} · {u.fullName}</span>
                                        ))}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* Modal xem thông tin người dùng */}
                {viewUser && (
                    <div className="att-guide-overlay roles-overlay" onMouseDown={(e) => e.target === e.currentTarget && setViewUser(null)}>
                        <section className="att-detail-modal roles-modal">
                            <header className="att-detail-modal-head">
                                <div>
                                    <h2>{L("Thông tin người dùng")}</h2>
                                    <p>{viewUser.employeeCode || "—"} · {viewUser.fullName}</p>
                                </div>
                                <button type="button" onClick={() => setViewUser(null)} aria-label={L("Đóng")}>×</button>
                            </header>
                            <div className="roles-profile-grid">
                                <span>{L("Mã nhân viên")}<strong>{viewUser.employeeCode || "—"}</strong></span>
                                <span>{L("Họ tên")}<strong>{viewUser.fullName}</strong></span>
                                <span>{L("Email")}<strong>{viewUser.email || "—"}</strong></span>
                                <span>{L("Điện thoại")}<strong>{viewUser.phoneNumber || "—"}</strong></span>
                                <span>{L("Phòng ban")}<strong>{viewUser.departmentName || "—"}</strong></span>
                                <span>{L("Chức vụ")}<strong>{viewUser.positionName || "—"}</strong></span>
                                <span>{L("Tài khoản")}<strong>{viewUser.userName}</strong></span>
                                <span>{L("Vai trò")}<strong>{(userRolesMap[viewUser.id] || []).join(", ") || "—"}</strong></span>
                            </div>
                            <footer>
                                <button type="button" className="admin-link-btn" onClick={() => setViewUser(null)}>{L("Đóng")}</button>
                            </footer>
                        </section>
                    </div>
                )}
            </div>
        </AdminAppLayout>
    );
};

export default AdminRolesPage;
