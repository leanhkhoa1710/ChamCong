import { useState, useEffect, useMemo } from "react";
import AdminAppLayout from "../../layout/AdminAppLayout";
import HrAppLayout from "../../../employees/hr/layout/HrAppLayout";
import adminApi from "../../api/adminApi";
import employeeApi from "../../../employees/api/employeeApi";
import "../../../../modules/attendance/attendance.css";
import "../../admin.css";

// 5 trạng thái hợp đồng (tính từ endDate so với hôm nay, giờ VN).
const CONTRACT_STATUS = {
    expired: { label: "Hết hạn", cls: "bad" },
    expiring: { label: "Sắp hết hạn", cls: "warn" },
    pending: { label: "Chờ ký", cls: "info" },
    none: { label: "Chưa lập", cls: "muted" },
    signed: { label: "Đã ký", cls: "ok" },
};

const daysUntil = (iso) => {
    const now = new Date();
    const end = new Date(iso);
    return Math.round((end - now) / 86400000);
};

const contractStateOf = (e, contracts) => {
    const c = contracts.find((x) => x.employeeId === e.id);
    if (!c) return "none";
    if (!c.endDate) return "signed";
    const d = daysUntil(c.endDate);
    if (d < 0) return "expired";
    if (d <= 30) return "expiring";
    return "signed";
};

const normalizeSearch = (v) =>
    String(v || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .toLocaleLowerCase("vi-VN");

const AdminContractPage = ({ hrMode = false }) => {
    const [employees, setEmployees] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Bộ lọc
    const [search, setSearch] = useState("");
    const [state, setState] = useState("");

    // Modal tạo hợp đồng
    const [showModal, setShowModal] = useState(false);
    const [empSearch, setEmpSearch] = useState("");
    const [showEmpOptions, setShowEmpOptions] = useState(false);
    const [form, setForm] = useState({
        employeeId: "",
        contractNumber: "",
        contractType: 2,
        startDate: "",
        endDate: "",
    });
    const PageLayout = hrMode ? HrAppLayout : AdminAppLayout;
    const api = hrMode ? employeeApi : adminApi;

    const load = async () => {
        try {
            const [e, c] = await Promise.all([
                api.employees(),
                api.contracts(),
            ]);
            setEmployees(e.data.data?.items || []);
            setContracts(c.data.data?.items || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const stateMap = useMemo(
        () =>
            Object.fromEntries(
                employees.map((e) => [e.id, contractStateOf(e, contracts)])
            ),
        [employees, contracts]
    );

    const PRIORITY = { pending: 1, none: 2, expired: 3, expiring: 4, signed: 5 };

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const list = employees.filter((e) => {
            const s = stateMap[e.id];
            if (state && s !== state) return false;
            if (q) {
                const hit =
                    (e.fullName || "").toLowerCase().includes(q) ||
                    (e.employeeCode || "").toLowerCase().includes(q);
                if (!hit) return false;
            }
            return true;
        });
        if (!state) {
            list.sort(
                (a, b) =>
                    (PRIORITY[stateMap[a.id]] || 9) -
                    (PRIORITY[stateMap[b.id]] || 9)
            );
        }
        return list;
    }, [employees, search, state, stateMap]);

    const counts = useMemo(() => {
        const c = { expired: 0, expiring: 0, pending: 0, none: 0, signed: 0 };
        Object.values(stateMap).forEach((s) => c[s]++);
        return c;
    }, [stateMap]);

    const submitContract = async () => {
        if (!form.employeeId || !form.contractNumber) {
            alert("Chọn nhân viên và nhập số hợp đồng.");
            return;
        }
        try {
            await api.createContract({
                employeeId: form.employeeId,
                contractNumber: form.contractNumber,
                contractType: Number(form.contractType),
                startDate: form.startDate || new Date().toISOString().slice(0, 10),
                endDate: form.endDate || null,
            });
            setShowModal(false);
            setForm({
                employeeId: "",
                contractNumber: "",
                contractType: 2,
                startDate: "",
                endDate: "",
            });
            setEmpSearch("");
            load();
        } catch (err) {
            alert("Tạo thất bại: " + (err.response?.data?.message || err.message));
        }
    };

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const openModal = () => {
        setEmpSearch("");
        setShowEmpOptions(false);
        setShowModal(true);
    };

    const empTerm = normalizeSearch(empSearch.trim());
    const empOptions = empTerm
        ? employees
              .filter((e) => [1, 2, 3].includes(e.status))
              .filter((e) =>
                  normalizeSearch(`${e.fullName} ${e.employeeCode}`).includes(empTerm)
              )
              .slice(0, 8)
        : [];

    return (
        <PageLayout>
            <div className="att-content">
                {error && <div className="att-error">{error}</div>}
                {loading && <div className="att-loading">Đang tải...</div>}

                {!loading && !error && (
                    <>
                        <div className="admin-toolbar">
                            <label className="admin-search">
                                <span aria-hidden="true">⌕</span>
                                <input
                                    type="search"
                                    placeholder="Tìm tên, mã NV..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label="Tìm hợp đồng"
                                />
                            </label>
                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="expired">Hết hạn ({counts.expired})</option>
                                <option value="expiring">Sắp hết hạn ({counts.expiring})</option>
                                <option value="pending">Chờ ký</option>
                                <option value="none">Chưa lập ({counts.none})</option>
                                <option value="signed">Đã ký ({counts.signed})</option>
                            </select>
                            <span className="att-muted">{filtered.length} hồ sơ</span>
                            <button
                                type="button"
                                className="admin-link-btn"
                                onClick={load}
                            >
                                ⟳ Tải lại
                            </button>
                            <button
                                type="button"
                                className="admin-link-btn"
                                onClick={openModal}
                            >
                                + Tạo hợp đồng
                            </button>
                        </div>

                        <div className="att-card">
                            <div className="att-table-wrap">
                                <table className="att-table">
                                    <thead>
                                        <tr>
                                            <th>Nhân viên</th>
                                            <th>Phòng ban</th>
                                            <th>Số HĐ</th>
                                            <th>Loại</th>
                                            <th>Bắt đầu</th>
                                            <th>Hết hạn</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="att-muted">
                                                    Không có hợp đồng phù hợp.
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((e) => {
                                                const c = contracts.find(
                                                    (x) => x.employeeId === e.id
                                                );
                                                const s = stateMap[e.id];
                                                return (
                                                    <tr key={e.id}>
                                                        <td>
                                                            <div className="att-emp-cell">
                                                                <span className="att-emp-code">{e.employeeCode}</span>
                                                                <span className="att-emp-name">{e.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {e.departmentName || "—"}
                                                        </td>
                                                        <td>
                                                            {c
                                                                ? c.contractNumber
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            {
                                                                ({
                                                                    1: "Thử việc",
                                                                    2: "Hạn định",
                                                                    3: "Không xác định",
                                                                    4: "Mùa vụ",
                                                                })[
                                                                    c
                                                                        ? c.contractType
                                                                        : 0
                                                                ] || "—"
                                                            }
                                                        </td>
                                                        <td>
                                                            {c?.startDate
                                                                ? new Date(
                                                                      c
                                                                          .startDate
                                                                  ).toLocaleDateString(
                                                                      "vi-VN"
                                                                  )
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            {c?.endDate
                                                                ? new Date(
                                                                      c
                                                                          .endDate
                                                                  ).toLocaleDateString(
                                                                      "vi-VN"
                                                                  )
                                                                : c
                                                                ? "Không xác định"
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`att-badge ${CONTRACT_STATUS[s].cls}`}
                                                            >
                                                                {
                                                                    CONTRACT_STATUS[
                                                                        s
                                                                    ].label
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {showModal && (
                            <div
                                className="att-guide-overlay"
                                onMouseDown={(e) => e.target === e.currentTarget && setShowModal(false)}
                            >
                                <div className="att-form-modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="att-form">
                                        <h2>Tạo hợp đồng lao động</h2>
                                        <label>
                                            Nhân viên
                                            <div className="att-employee-picker" onBlur={(event) => {
                                                if (!event.currentTarget.contains(event.relatedTarget)) setShowEmpOptions(false);
                                            }}>
                                                <input
                                                    required
                                                    role="combobox"
                                                    aria-autocomplete="list"
                                                    aria-expanded={showEmpOptions && empOptions.length > 0}
                                                    aria-controls="contract-employee-options"
                                                    value={empSearch}
                                                    placeholder="Nhập họ tên hoặc mã nhân viên..."
                                                    onFocus={() => setShowEmpOptions(true)}
                                                    onChange={(event) => {
                                                        setEmpSearch(event.target.value);
                                                        setShowEmpOptions(true);
                                                        setForm({ ...form, employeeId: "" });
                                                    }}
                                                />
                                                {showEmpOptions && empOptions.length > 0 && (
                                                    <div className="att-employee-options" id="contract-employee-options" role="listbox">
                                                        {empOptions.map((employee) => (
                                                            <button
                                                                type="button"
                                                                role="option"
                                                                aria-selected={form.employeeId === employee.id}
                                                                key={employee.id}
                                                                onClick={() => {
                                                                    setForm({ ...form, employeeId: employee.id });
                                                                    setEmpSearch(`${employee.fullName} · ${employee.employeeCode}`);
                                                                    setShowEmpOptions(false);
                                                                }}
                                                            >
                                                                <strong>{employee.fullName}</strong>
                                                                <span>{employee.employeeCode}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {showEmpOptions && empTerm && empOptions.length === 0 && (
                                                    <div className="att-employee-empty">Không tìm thấy nhân viên phù hợp.</div>
                                                )}
                                            </div>
                                        </label>
                                        <label>
                                            Số hợp đồng
                                            <input
                                                value={form.contractNumber}
                                                onChange={set("contractNumber")}
                                                placeholder="HD-001"
                                            />
                                        </label>
                                        <label>
                                            Loại hợp đồng
                                            <select
                                                value={form.contractType}
                                                onChange={set("contractType")}
                                            >
                                                <option value={1}>Thử việc</option>
                                                <option value={2}>Hạn định</option>
                                                <option value={3}>
                                                    Không xác định
                                                </option>
                                                <option value={4}>Mùa vụ</option>
                                            </select>
                                        </label>
                                        <label>
                                            Ngày bắt đầu
                                            <input
                                                type="date"
                                                value={form.startDate}
                                                onChange={set("startDate")}
                                            />
                                        </label>
                                        <label>
                                            Ngày hết hạn
                                            <input
                                                type="date"
                                                value={form.endDate}
                                                onChange={set("endDate")}
                                            />
                                        </label>
                                        <div className="att-form-actions">
                                            <button
                                                type="button"
                                                className="att-cam-btn-remove"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-link-btn"
                                                onClick={submitContract}
                                            >
                                                Lưu hợp đồng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default AdminContractPage;
