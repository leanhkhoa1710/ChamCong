import { useState, useEffect, useMemo, useCallback } from "react";
import AdminAppLayout from "../../layout/AdminAppLayout";
import adminApi from "../../api/adminApi";
import "../../../../modules/attendance/attendance.css";
import "../../admin.css";

// Module "Cấp tài khoản" cho người lao động.
// KPI: tổng hồ sơ - đang làm - đã có tài khoản - chưa có - không hợp lệ -
//       trùng id - sẵn sàng - đang chọn.
const AccountIssuancePage = () => {
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selected, setSelected] = useState(() => new Set());
    const [issued, setIssued] = useState("");

    const load = async () => {
        try {
            const [e, u, c] = await Promise.all([
                adminApi.employees(),
                adminApi.users ? adminApi.users() : Promise.resolve(null),
                adminApi.activationCodes(),
            ]);
            setEmployees(e.data.data?.items || []);
            if (u?.data?.data) setUsers(u.data.data.items || []);
            setCodes(c.data.data?.items || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        load();
    }, []);

    // Map: employee đã liên kết user (userId) chưa?
    const userIds = useMemo(() => new Set(users.map((u) => u.employeeId)), [users]);

    // Trạng thái từng NV đang làm
    const rowState = useCallback(
        (e) => {
            const hasUser = !!e.userId || userIds.has(e.id);
        const email = (e.email || "").trim();
        const invalidEmail =
            email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const dupCode = employees.filter(
            (x) =>
                x.employeeCode === e.employeeCode && x.id !== e.id
        ).length > 0;
        if (dupCode) return { key: "dup", label: "Trùng mã", cls: "bad" };
        if (invalidEmail)
            return { key: "invalid", label: "Không hợp lệ", cls: "bad" };
        if (hasUser) return { key: "has", label: "Đã có tài khoản", cls: "ok" };
        return { key: "none", label: "Chưa có", cls: "warn" };
    }, [userIds, employees]);

    const kpis = useMemo(() => {
        const working = employees.filter((e) => [1, 2, 3].includes(e.status));
        const st = working.map(rowState);
        const ready = st.filter((s) => s.key === "none").length;
        return {
            total: employees.length,
            working: working.length,
            has: st.filter((s) => s.key === "has").length,
            none: st.filter((s) => s.key === "none").length,
            invalid: st.filter((s) => s.key === "invalid").length,
            dup: st.filter((s) => s.key === "dup").length,
            ready,
            choosing: selected.size,
        };
    }, [employees, selected, rowState]);

    const toggle = (id) =>
        setSelected((prev) => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });

    // Cấp mã kích hoạt cho danh sách đã chọn (mỗi NV 1 mã 72h)
    const issueCodes = async () => {
        if (selected.size === 0) {
            alert("Vui lòng chọn ít nhất 1 nhân viên.");
            return;
        }
        const gen = () =>
            "ACT-" +
            Math.random().toString(36).slice(2, 8).toUpperCase();
        let ok = 0;
        const list = [...selected];
        for (const id of list) {
            try {
                await adminApi.createActivationCode({
                    employeeId: id,
                    code: gen(),
                    validMinutes: 4320, // 72h
                });
                ok++;
            } catch {
                /* bỏ qua lỗi từng người */
            }
        }
        setIssued(`Đã cấp ${ok}/${list.length} mã kích hoạt (hạn 72h).`);
        load();
        setSelected(new Set());
    };

    const working = employees.filter((e) => [1, 2, 3].includes(e.status));

    return (
        <AdminAppLayout
            title="Cấp tài khoản"
            subtitle="Cấp tài khoản + mã kích hoạt cho người lao động"
        >
            <div className="att-content">
                {error && <div className="att-error">{error}</div>}
                {loading && <div className="att-loading">Đang tải...</div>}

                {!loading && !error && (
                    <>
                        {/* 8 KPI */}
                        <div className="admin-kpi-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                            {[
                                ["Tổng hồ sơ", kpis.total, ""],
                                ["Đang làm", kpis.working, ""],
                                ["Đã có tài khoản", kpis.has, "ok"],
                                ["Chưa có", kpis.none, "warn"],
                                ["Không hợp lệ", kpis.invalid, "bad"],
                                ["Trùng mã", kpis.dup, "bad"],
                                ["Sẵn sàng cấp", kpis.ready, "ok"],
                                ["Đang chọn", kpis.choosing, "warn"],
                            ].map(([label, value, tone]) => (
                                <div
                                    key={label}
                                    className={`admin-kpi admin-kpi--${tone || "neutral"}`}
                                >
                                    <span className="admin-kpi-label">{label}</span>
                                    <strong>{value}</strong>
                                </div>
                            ))}
                        </div>

                        {issued && (
                            <div className="att-notice" style={{ color: "#15803d", background: "#dcfce7", padding: "10px 14px", borderRadius: 8, fontSize: 14, marginBottom: 12 }}>
                                ✓ {issued}
                            </div>
                        )}

                        <div className="att-card">
                            <div className="admin-toolbar">
                                <span className="att-muted">
                                    {working.length} người đang làm việc
                                </span>
                                <button
                                    type="button"
                                    className="admin-link-btn"
                                    onClick={issueCodes}
                                >
                                    Cấp tài khoản cho ({selected.size}) người đã
                                    chọn
                                </button>
                            </div>
                            <div className="att-table-wrap">
                                <table className="att-table">
                                    <thead>
                                        <tr>
                                            <th>Chọn</th>
                                            <th>Mã</th>
                                            <th>Họ tên</th>
                                            <th>Trạng thái</th>
                                            <th>Email</th>
                                            <th>Mã kích hoạt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {working.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="att-muted">
                                                    Không có nhân viên đang làm.
                                                </td>
                                            </tr>
                                        ) : (
                                            working.map((e) => {
                                                const s = rowState(e);
                                                const code = codes.find(
                                                    (c) =>
                                                        c.employeeId === e.id &&
                                                        !c.isUsed
                                                );
                                                return (
                                                    <tr key={e.id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                className="admin-check"
                                                                checked={selected.has(
                                                                    e.id
                                                                )}
                                                                onChange={() =>
                                                                    toggle(e.id)
                                                                }
                                                            />
                                                        </td>
                                                        <td>{e.employeeCode}</td>
                                                        <td>{e.fullName}</td>
                                                        <td>
                                                            <span
                                                                className={`att-badge ${s.cls}`}
                                                            >
                                                                {s.label}
                                                            </span>
                                                        </td>
                                                        <td>{e.email || "—"}</td>
                                                        <td>
                                                            {code ? (
                                                                <code
                                                                    style={{
                                                                        background:
                                                                            "#eef2f6",
                                                                        padding:
                                                                            "2px 8px",
                                                                        borderRadius:
                                                                            6,
                                                                    }}
                                                                >
                                                                    {code.code}
                                                                </code>
                                                            ) : (
                                                                "—"
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminAppLayout>
    );
};

export default AccountIssuancePage;
