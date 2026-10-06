import AdminAppLayout from "../layout/AdminAppLayout";
import adminApi from "../api/adminApi";
import { useState, useEffect, useCallback } from "react";

const AdminBlockAccountPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const load = useCallback(() => {
        setLoading(true);
        Promise.all([adminApi.employees(), adminApi.users()]).then(([empRes, usrRes]) => {
            const employees = empRes.data.data?.items || [];
            const users = usrRes.data.data?.items || [];
            const merged = employees.map((e) => {
                const u = users.find((x) => x.id === e.userId);
                return { ...e, isLockedOut: u?.isLockedOut ?? false, userId: u?.id || null };
            });
            setUsers(merged);
        }).catch(() => { setUsers([]); }).finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = users.filter((u) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (u.fullName || "").toLowerCase().includes(q) || (u.employeeCode || "").toLowerCase().includes(q);
    });

    const blockAccount = async (user) => {
        if (!user.userId) { alert("Tài khoản chưa được tạo cho nhân viên này."); return; }
        if (!window.confirm(`Chặn tài khoản của ${user.fullName} (${user.employeeCode})?`)) return;
        try {
            await adminApi.blockUser(user.userId, {});
            alert(`Đã chặn tài khoản của ${user.fullName}.`);
            load();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    const unblockAccount = async (user) => {
        if (!window.confirm(`Mở chặn tài khoản của ${user.fullName} (${user.employeeCode})?`)) return;
        try {
            await adminApi.unblockUser(user.userId);
            alert(`Đã mở chặn tài khoản của ${user.fullName}.`);
            load();
        } catch (err) { alert(err.response?.data?.message || err.message); }
    };

    return (
        <AdminAppLayout title="Chặn tài khoản" subtitle="Quản lý chặn / mở chặn tài khoản nhân viên">
            <div className="att-content">
                {loading && <div className="att-loading">Đang tải...</div>}
                {!loading && (
                    <div className="att-card">
                        <div className="admin-toolbar">
                            <label className="admin-search">
                                <span aria-hidden="true">⌕</span>
                                <input type="search" placeholder="Tìm mã, họ tên..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Tìm nhân viên" />
                            </label>
                        </div>
                        <div className="att-table-wrap">
                            <table className="att-table">
                                <thead><tr><th>Mã NV</th><th>Họ tên</th><th>Email</th><th>Trạng thái</th><th>Tài khoản</th><th>Thao tác</th></tr></thead>
                                <tbody>
                                    {filtered.length === 0 ? (<tr><td colSpan={6} className="att-muted">Không tìm thấy nhân viên.</td></tr>) :
                                    filtered.slice(0, 50).map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.employeeCode}</td>
                                            <td>{u.fullName}</td>
                                            <td>{u.email || "—"}</td>
                                            <td><span className={`att-badge ${u.status === 2 ? "ok" : "warn"}`}>{u.status === 2 ? "Đang làm" : "Đã nghỉ"}</span></td>
                                            <td>
                                                {u.isLockedOut
                                                    ? <span className="att-badge bad">Đã chặn</span>
                                                    : u.userId
                                                    ? <span className="att-badge ok">Đang hoạt động</span>
                                                    : <span className="att-badge muted">Chưa có</span>}
                                            </td>
                                            <td>
                                                {u.isLockedOut
                                                    ? <button type="button" className="admin-link-btn" onClick={() => unblockAccount(u)}>Mở chặn</button>
                                                    : <button type="button" className="admin-link-btn admin-link-btn--danger" onClick={() => blockAccount(u)} disabled={!u.userId || u.status !== 2}>Chặn</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminAppLayout>
    );
};

export default AdminBlockAccountPage;
