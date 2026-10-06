import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage, translate } from "../../services/i18n/LanguageProvider";
import WorkLayout from "./layout/WorkLayout";
import { useWorkData } from "./useWorkData";
import workApi from "./workApi";
import "./work.css";

const WORK_VIEWS = {
    overview: { title: "Tổng quan", subtitle: "Việc cần bạn xử lý trong hôm nay" },
    tasks: { title: "Việc của tôi", subtitle: "Nghỉ phép & báo cáo đang chờ" },
    reports: { title: "Báo cáo", subtitle: "Báo cáo bạn đã gửi cho quản lý" },
};

const WorkPage = () => {
    const { language } = useLanguage();
    const L = (t) => translate(t, language);
    const navigate = useNavigate();
    const { search: query } = useLocation();
    const tab = useMemo(() => new URLSearchParams(query).get("tab") || "overview", [query]);

    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const { reports, leaves, loading, error, STATUS } = useWorkData();

    const q = search.trim().toLowerCase();
    const date = (v) => (v ? new Date(v).toLocaleDateString("vi-VN", { dateStyle: "medium" }) : "—");

    // Việc cần xử lý = báo cáo đang chờ / cần chỉnh + nghỉ phép chờ duyệt.
    const pendingReports = reports.filter((r) => [0, 3, 6].includes(r.status));
    const pendingLeaves = leaves.filter((x) => x.status === 1);

    // Nội dung theo từng tab (đã lọc theo từ khóa)
    const reportsFiltered = reports.filter((r) => !q || `${r.title} ${r.reportCode} ${r.reportType}`.toLowerCase().includes(q));
    const leavesFiltered = leaves.filter((x) => !q || `${x.leaveTypeName || ""} ${x.reason || ""}`.toLowerCase().includes(q));
    const pendingFiltered = [...pendingReports, ...pendingLeaves];

    const kpi = useMemo(() => ({
        pending: pendingReports.length + pendingLeaves.length,
        approved: reports.filter((r) => [1, 5, 7].includes(r.status)).length,
        needWork: reports.filter((r) => [2, 3, 6].includes(r.status)).length,
        total: reports.length,
    }), [reports, pendingReports, pendingLeaves]);

    const go = (t) => navigate(`/work?tab=${t}`);

    // Tải file báo cáo
    const download = async (version, attachment = false) => {
        try {
            const r = attachment ? await workApi.downloadAttachment(version.id) : await workApi.downloadReport(version.id);
            const url = URL.createObjectURL(r.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = version.fileName || "file";
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch { /* noop */ }
    };

    const Badge = ({ status }) => {
        const s = STATUS[status];
        return <i className={`work-status work-status--${s?.tone || "muted"}`}>{s?.label || status}</i>;
    };

    return (
        <WorkLayout title={WORK_VIEWS[tab].title} subtitle={WORK_VIEWS[tab].subtitle} search={search} onSearchChange={setSearch}>
            <div className="work-shell">
                {error && <div className="att-error">{error}</div>}
                {loading ? (
                    <div className="att-loading">Đang tải...</div>
                ) : (
                    <>
                        {/* ===== TÓNG QUAN ===== */}
                        {tab === "overview" && (
                            <div className="work-overview">
                                <div className="work-kpis">
                                    <div className="work-kpi"><span>{L("Cần xử lý")}</span><strong>{kpi.pending}</strong></div>
                                    <div className="work-kpi work-kpi--ok"><span>{L("Đã duyệt")}</span><strong>{kpi.approved}</strong></div>
                                    <div className="work-kpi work-kpi--bad"><span>{L("Cần chỉnh sửa")}</span><strong>{kpi.needWork}</strong></div>
                                    <div className="work-kpi"><span>{L("Tổng báo cáo")}</span><strong>{kpi.total}</strong></div>
                                </div>
                                <div className="work-ov-grid">
                                    <section className="att-card">
                                        <div className="work-ov-head">
                                            <h3>{L("Việc cần xử lý")}</h3>
                                            <button type="button" className="work-quick-link" onClick={() => go("tasks")}>{L("Xem tất cả")} →</button>
                                        </div>
                                        <div className="work-ov-list">
                                            {pendingFiltered.length === 0 ? (
                                                <p className="att-muted">{L("Không có việc nào cần xử lý. Tốt lắm!")}</p>
                                            ) : pendingFiltered.slice(0, 6).map((item) => {
                                                const isReport = !("leaveTypeName" in item);
                                                return (
                                                    <div key={`${item.kind || (isReport ? "report" : "leave")}-${item.id}`} className="work-ov-item">
                                                        <span className={`work-ov-ico ${isReport ? "report" : "leave"}`} aria-hidden="true">{isReport ? "▤" : "▣"}</span>
                                                        <div className="work-ov-text">
                                                            <strong>{isReport ? `"${item.title}"` : item.leaveTypeName}</strong>
                                                            <small>{isReport ? STATUS[item.status]?.label : `Nghỉ ${item.totalDays || ""} ngày · ${date(item.fromDate)}`}</small>
                                                        </div>
                                                        {isReport ? <Badge status={item.status} /> : <i className="work-status work-status--warn">{L("Chờ duyệt")}</i>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                    <section className="att-card">
                                        <div className="work-ov-head">
                                            <h3>{L("Việc gần đây")}</h3>
                                            <button type="button" className="work-quick-link" onClick={() => go("reports")}>{L("Báo cáo")} →</button>
                                        </div>
                                        <div className="work-ov-list">
                                            {reportsFiltered.length === 0 ? (
                                                <p className="att-muted">{L("Bạn chưa có báo cáo nào.")}</p>
                                            ) : reportsFiltered.slice(0, 4).map((r) => (
                                                <div key={r.id} className="work-ov-item">
                                                    <span className="work-ov-ico report" aria-hidden="true">▤</span>
                                                    <div className="work-ov-text">
                                                        <strong>{r.title}</strong>
                                                        <small>{r.reportCode} · {date(r.submittedAt)}</small>
                                                    </div>
                                                    <Badge status={r.status} />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )}

                        {/* ===== VIỆC CỦA TÔI ===== */}
                        {tab === "tasks" && (
                            <div className="work-tasks">
                                <section className="att-card">
                                    <h3 className="work-card-title">{L("Nghỉ phép đang chờ")}</h3>
                                    <div className="att-table-wrap">
                                        <table className="att-table">
                                            <thead><tr><th>{L("Loại")}</th><th>{L("Từ")}</th><th>{L("Đến")}</th><th>{L("Số ngày")}</th><th>{L("Trạng thái")}</th></tr></thead>
                                            <tbody>
                                                {leavesFiltered.length === 0 ? (
                                                    <tr><td colSpan="5" className="att-muted">{L("Không có đơn nghỉ phép.")}</td></tr>
                                                ) : leavesFiltered.map((x) => (
                                                    <tr key={x.id}>
                                                        <td>{x.leaveTypeName || "—"}</td>
                                                        <td>{date(x.fromDate)}</td>
                                                        <td>{date(x.toDate)}</td>
                                                        <td>{x.totalDays || "—"}</td>
                                                        <td><i className="work-status work-status--warn">{L("Chờ duyệt")}</i></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                                <section className="att-card">
                                    <h3 className="work-card-title">{L("Báo cáo cần xử lý")}</h3>
                                    <div className="att-table-wrap">
                                        <table className="att-table">
                                            <thead><tr><th>{L("Báo cáo")}</th><th>{L("Mã")}</th><th>{L("Gửi ngày")}</th><th>{L("Trạng thái")}</th><th>{L("Thao tác")}</th></tr></thead>
                                            <tbody>
                                                {reportsFiltered.filter((r) => [0, 3, 6].includes(r.status)).length === 0 ? (
                                                    <tr><td colSpan="5" className="att-muted">{L("Không có báo cáo nào cần xử lý.")}</td></tr>
                                                ) : reportsFiltered.filter((r) => [0, 3, 6].includes(r.status)).map((r) => (
                                                    <tr key={r.id}>
                                                        <td><strong>{r.title}</strong></td>
                                                        <td>{r.reportCode}</td>
                                                        <td>{date(r.submittedAt)}</td>
                                                        <td><Badge status={r.status} /></td>
                                                        <td><button type="button" className="admin-link-btn" onClick={() => go("reports")}>{L("Xem")}</button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* ===== BÁO CÁO ===== */}
                        {tab === "reports" && (
                            <div className="work-reports">
                                <div className="work-reports-note">
                                    <p>{L("Danh sách báo cáo bạn đã gửi. Muốn nộp báo cáo mới, vào trang")} <a href="/reports">{L("Báo cáo của tôi")}</a> {L("để tạo.")}</p>
                                </div>
                                <div className="work-reports-list">
                                    {reportsFiltered.length === 0 ? (
                                        <div className="att-card"><p className="att-muted">{L("Bạn chưa có báo cáo nào.")}</p></div>
                                    ) : reportsFiltered.map((r) => (
                                        <article key={r.id} className="work-report">
                                            <div className="work-report-ico" aria-hidden="true">▤</div>
                                            <div className="work-report-main">
                                                <div className="work-report-top">
                                                    <strong>{r.title}</strong>
                                                    <Badge status={r.status} />
                                                </div>
                                                <small>{r.reportCode} · {r.reportType} · {date(r.submittedAt)}</small>
                                                {r.managerComment && <p className="work-report-comment">{L("Ý kiến quản lý")}: {r.managerComment}</p>}
                                                {r.upperRequest && <p className="work-report-comment work-report-comment--upper">{L("Yêu cầu cấp trên")}: {r.upperRequest}</p>}
                                            </div>
                                            <button type="button" className="work-report-btn" onClick={() => setSelected(r)}>{L("Chi tiết")}</button>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Modal chi tiết báo cáo */}
                {selected && (
                    <div className="work-overlay" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
                        <section className="att-detail-modal work-detail">
                            <header className="att-detail-modal-head">
                                <div><h2>{selected.title}</h2><p>{selected.reportCode} · {selected.reportType} · {date(selected.submittedAt)}</p></div>
                                <button type="button" onClick={() => setSelected(null)}>×</button>
                            </header>
                            <Badge status={selected.status} />
                            {selected.managerComment && <div className="work-detail-note"><strong>{L("Ý kiến quản lý")}</strong><p>{selected.managerComment}</p></div>}
                            {selected.upperRequest && <div className="work-detail-note work-detail-note--upper"><strong>{L("Yêu cầu cấp trên")}</strong><p>{selected.upperRequest}</p></div>}
                            {[["Tổng quan", selected.overview], ["Kết quả", selected.results], ["Khó khăn", selected.issues], ["Đề xuất", selected.recommendations]]
                                .filter(([, v]) => v)
                                .map(([label, value]) => (
                                    <div className="work-detail-block" key={label}><strong>{label}</strong><p>{value}</p></div>
                                ))}
                            <h4>{L("Phiên bản file")}</h4>
                            {selected.versions?.map((v) => (
                                <div className="work-detail-file" key={v.id}>
                                    <span>v{v.version} · {v.fileName} <small>{date(v.uploadedAt)}</small></span>
                                    <button type="button" onClick={() => download(v)}>{L("Tải")}</button>
                                </div>
                            ))}
                            <footer><button type="button" className="admin-link-btn" onClick={() => setSelected(null)}>{L("Đóng")}</button></footer>
                        </section>
                    </div>
                )}
            </div>
        </WorkLayout>
    );
};

export default WorkPage;
