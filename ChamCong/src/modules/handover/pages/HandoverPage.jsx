import { useCallback, useEffect, useState } from "react";
import { getAuth } from "../../../services/auth/auth";
import axiosClient from "../../../services/api/axiosClient";
import { localeForLanguage, useLanguage } from "../../../services/i18n/LanguageProvider";
import AppLayout from "../../../components/layout/AppLayout";
import HrAppLayout from "../../admin/hr/layout/HrAppLayout";
import "../handover.css";

const dataOf = (response) => response?.data?.data;
const statusLabels = ["Chờ duyệt", "Đã duyệt", "Từ chối"];
const initialAssets = () => [
    { assetType: "Màn hình máy tính", assetCode: "TS-MH-001", condition: "Tốt", note: "" },
    { assetType: "CPU", assetCode: "TS-CPU-001", condition: "Tốt", note: "" },
    { assetType: "PC", assetCode: "TS-PC-001", condition: "Đang sử dụng", note: "" },
    { assetType: "Bàn phím", assetCode: "TS-BP-001", condition: "Tốt", note: "" },
    { assetType: "Chuột", assetCode: "TS-CH-001", condition: "Tốt", note: "" },
];
const initialProjects = () => [
    { projectCode: "DA-001", projectName: "Website ABC", partner: "Công ty ABC", progress: 80, documents: [], handoverFiles: [] },
    { projectCode: "DA-002", projectName: "Mobile App XYZ", partner: "Công ty XYZ", progress: 45, documents: [], handoverFiles: [] },
];
const parseJson = (value) => { try { return JSON.parse(value || "[]"); } catch { return []; } };
const assetsOf = (row) => parseJson(row.assetsJson ?? row.AssetsJson).map((x) => ({ assetType: x.assetType ?? x.AssetType, assetCode: x.assetCode ?? x.AssetCode, condition: x.condition ?? x.Condition, note: x.note ?? x.Note }));
const projectsOf = (row) => parseJson(row.projectsJson ?? row.ProjectsJson).map((x) => ({
    projectCode: x.projectCode ?? x.ProjectCode, projectName: x.projectName ?? x.ProjectName,
    partner: x.partner ?? x.Partner, progress: x.progress ?? x.Progress,
    documents: (x.documents ?? x.Documents ?? []).map((file) => ({ fileName: file.fileName ?? file.FileName, storedName: file.storedName ?? file.StoredName, fileSize: file.fileSize ?? file.FileSize })),
    handoverFiles: (x.handoverFiles ?? x.HandoverFiles ?? []).map((file) => ({ fileName: file.fileName ?? file.FileName, storedName: file.storedName ?? file.StoredName, fileSize: file.fileSize ?? file.FileSize })),
}));
const fileSize = (bytes) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const HandoverTables = ({ row, onDownload }) => <div className="handover-data-tables">
    <h4>Tài sản công ty cần bàn giao</h4>
    <div className="handover-table-scroll"><table className="handover-table"><thead><tr><th>STT</th><th>Loại tài sản</th><th>Mã tài sản</th><th>Tình trạng</th><th>Ghi chú</th></tr></thead><tbody>
        {assetsOf(row).length ? assetsOf(row).map((asset, i) => <tr key={`${asset.assetCode}-${i}`}><td>{String(i + 1).padStart(2, "0")}</td><td>{asset.assetType}</td><td>{asset.assetCode}</td><td>{asset.condition}</td><td>{asset.note || "—"}</td></tr>) : <tr><td colSpan="5" className="handover-table-empty">Không có tài sản được khai báo.</td></tr>}
    </tbody></table></div>
    <h4>Tiến độ và bàn giao công việc</h4>
    <div className="handover-table-scroll"><table className="handover-table"><thead><tr><th>STT</th><th>Mã dự án</th><th>Tên dự án</th><th>Tên đối tác</th><th>Tiến độ</th><th>Tài liệu dự án</th><th>File bàn giao</th></tr></thead><tbody>
        {projectsOf(row).length ? projectsOf(row).map((project, i) => <tr key={`${project.projectCode}-${i}`}><td>{String(i + 1).padStart(2, "0")}</td><td>{project.projectCode}</td><td>{project.projectName}</td><td>{project.partner || "—"}</td><td><span className="handover-progress">{project.progress}%</span></td><td><FileList files={project.documents} onDownload={(file) => onDownload?.(row.id, file)} /></td><td><FileList files={project.handoverFiles} onDownload={(file) => onDownload?.(row.id, file)} /></td></tr>) : <tr><td colSpan="7" className="handover-table-empty">Chưa có dự án bàn giao.</td></tr>}
    </tbody></table></div>
</div>;
const FileList = ({ files = [], onDownload }) => files.length ? <div className="handover-file-list">{files.map((file, index) => <button type="button" key={`${file.storedName}-${index}`} title={`${file.fileName} · ${fileSize(file.fileSize)}`} onClick={() => onDownload?.(file)}>📎 {file.fileName}</button>)}</div> : <span className="handover-muted">—</span>;
const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const dateLabel = (value, locale) => value
    ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(locale)
    : "—";

export default function HandoverPage({ reviewMode = false }) {
    const auth = getAuth();
    const { language } = useLanguage();
    const locale = localeForLanguage(language);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [selected, setSelected] = useState(null);
    const [note, setNote] = useState("");
    const [form, setForm] = useState({ lastWorkingDate: today(), reason: "", assets: initialAssets(), projects: initialProjects() });
    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axiosClient.get(`/EmployeeHandover/${reviewMode ? "get-all" : "mine"}`);
            setRows(dataOf(response) || []);
        } catch (e) {
            setError(e.response?.data?.message || e.response?.data || e.message || "Không tải được yêu cầu bàn giao.");
        } finally { setLoading(false); }
    }, [reviewMode]);
    useEffect(() => { load(); }, [load]);

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true); setError(""); setNotice("");
        try {
            const body = new FormData();
            body.append("LastWorkingDate", form.lastWorkingDate);
            body.append("Reason", form.reason);
            body.append("AssetsJson", JSON.stringify(form.assets.map(({ assetType, assetCode, condition, note }) => ({ assetType, assetCode, condition, note }))));
            body.append("ProjectsJson", JSON.stringify(form.projects.map(({ projectCode, projectName, partner, progress }) => ({ projectCode, projectName, partner, progress, documents: [], handoverFiles: [] }))));
            const metadata = [];
            form.projects.forEach((project, projectIndex) => ["documents", "handoverFiles"].forEach((kind) => (project[kind] || []).forEach((file) => {
                body.append("Attachments", file);
                metadata.push({ projectIndex, kind });
            })));
            body.append("AttachmentMetadataJson", JSON.stringify(metadata));
            await axiosClient.post("/EmployeeHandover/request", body, { headers: { "Content-Type": "multipart/form-data" } });
            setForm({ lastWorkingDate: today(), reason: "", assets: initialAssets(), projects: initialProjects() });
            setNotice("Đã gửi yêu cầu bàn giao cho cấp trên.");
            await load();
        } catch (e) {
            setError(e.response?.data?.message || e.response?.data || e.message || "Không gửi được yêu cầu bàn giao.");
        } finally { setSaving(false); }
    };

    const download = async (handoverId, file) => {
        try {
            const response = await axiosClient.get(`/EmployeeHandover/${handoverId}/files/${encodeURIComponent(file.storedName)}`, { responseType: "blob" });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url; link.download = file.fileName; link.click();
            URL.revokeObjectURL(url);
        } catch (e) { setError(e.response?.data?.message || "Không tải được tệp bàn giao."); }
    };

    const review = async (approve) => {
        if (!selected) return;
        setSaving(true); setError(""); setNotice("");
        try {
            await axiosClient.post(`/EmployeeHandover/review/${selected.id}`, { approve, note });
            setNotice(approve ? "Đã duyệt bàn giao. Nhân viên đã được chuyển sang danh sách nghỉ việc." : "Đã từ chối yêu cầu bàn giao.");
            setSelected(null); setNote("");
            await load();
        } catch (e) {
            setError(e.response?.data?.message || e.response?.data || e.message || "Không xử lý được yêu cầu.");
        } finally { setSaving(false); }
    };

    const content = <div className="handover-page">
        <header className="handover-heading"><div><span className="handover-eyebrow">MARIXA · NHÂN SỰ</span><h1>{reviewMode ? "Duyệt bàn giao nghỉ việc" : "Bàn giao nghỉ việc"}</h1><p>{reviewMode ? "Xem tài sản, tài khoản và tiến độ công việc trước khi duyệt nghỉ việc." : "Gửi thông tin bàn giao để cấp trên kiểm tra trước ngày nghỉ việc."}</p></div>{!reviewMode && <span className="handover-user">{auth?.userName || "Nhân viên"}</span>}</header>
        {notice && <div className="handover-alert success">{notice}</div>}{error && <div className="handover-alert error">{String(error)}</div>}
        {!reviewMode && !rows.some((row) => row.status === 0) && <form className="handover-form" onSubmit={submit}>
            <h2>Tạo yêu cầu bàn giao</h2>
            <div className="handover-form-grid">
                <label>Ngày làm việc cuối cùng<input type="date" min={today()} required value={form.lastWorkingDate} onChange={(e) => setForm({ ...form, lastWorkingDate: e.target.value })} /></label>
                <label className="handover-wide">Lý do nghỉ việc<textarea required maxLength={2000} rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></label>
                <div className="handover-wide handover-editor-section"><div className="handover-table-heading"><h3>Tài sản công ty cần bàn giao</h3><button type="button" className="handover-secondary" onClick={() => setForm({ ...form, assets: [...form.assets, { assetType: "", assetCode: "", condition: "Tốt", note: "" }] })}>＋ Thêm tài sản</button></div><div className="handover-table-scroll"><table className="handover-table handover-edit-table"><thead><tr><th>STT</th><th>Loại tài sản</th><th>Mã tài sản</th><th>Tình trạng</th><th>Ghi chú</th><th /></tr></thead><tbody>{form.assets.map((asset, index) => <tr key={index}><td>{String(index + 1).padStart(2, "0")}</td><td><input aria-label="Loại tài sản" value={asset.assetType} onChange={(e) => setForm({ ...form, assets: form.assets.map((item, i) => i === index ? { ...item, assetType: e.target.value } : item) })} /></td><td><input aria-label="Mã tài sản" value={asset.assetCode} onChange={(e) => setForm({ ...form, assets: form.assets.map((item, i) => i === index ? { ...item, assetCode: e.target.value } : item) })} /></td><td><select aria-label="Tình trạng" value={asset.condition} onChange={(e) => setForm({ ...form, assets: form.assets.map((item, i) => i === index ? { ...item, condition: e.target.value } : item) })}><option>Tốt</option><option>Đang sử dụng</option><option>Hư hỏng</option><option>Thất lạc</option><option>Đã bàn giao</option></select></td><td><input aria-label="Ghi chú tài sản" value={asset.note} onChange={(e) => setForm({ ...form, assets: form.assets.map((item, i) => i === index ? { ...item, note: e.target.value } : item) })} /></td><td><button type="button" className="handover-remove-row" aria-label="Xóa tài sản" onClick={() => setForm({ ...form, assets: form.assets.filter((_, i) => i !== index) })}>×</button></td></tr>)}</tbody></table></div></div>
                <div className="handover-wide handover-editor-section"><div className="handover-table-heading"><h3>Tiến độ và bàn giao công việc</h3><button type="button" className="handover-secondary" onClick={() => setForm({ ...form, projects: [...form.projects, { projectCode: "", projectName: "", partner: "", progress: 0, documents: [], handoverFiles: [] }] })}>＋ Thêm dự án</button></div><div className="handover-table-scroll"><table className="handover-table handover-edit-table"><thead><tr><th>STT</th><th>Mã dự án</th><th>Tên dự án</th><th>Tên đối tác</th><th>Tiến độ</th><th>Tài liệu dự án</th><th>File bàn giao</th><th /></tr></thead><tbody>{form.projects.map((project, index) => <tr key={index}><td>{String(index + 1).padStart(2, "0")}</td><td><input aria-label="Mã dự án" value={project.projectCode} onChange={(e) => setForm({ ...form, projects: form.projects.map((item, i) => i === index ? { ...item, projectCode: e.target.value } : item) })} /></td><td><input aria-label="Tên dự án" value={project.projectName} onChange={(e) => setForm({ ...form, projects: form.projects.map((item, i) => i === index ? { ...item, projectName: e.target.value } : item) })} /></td><td><input aria-label="Tên đối tác" value={project.partner} onChange={(e) => setForm({ ...form, projects: form.projects.map((item, i) => i === index ? { ...item, partner: e.target.value } : item) })} /></td><td><div className="handover-progress-input"><input type="number" min="0" max="100" value={project.progress} onChange={(e) => setForm({ ...form, projects: form.projects.map((item, i) => i === index ? { ...item, progress: Number(e.target.value) } : item) })} /><span>%</span></div></td>{["documents", "handoverFiles"].map((kind) => <td key={kind}><label className="handover-upload">＋ Chọn file<input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" onChange={(e) => { const files = Array.from(e.target.files || []); setForm({ ...form, projects: form.projects.map((item, i) => i === index ? { ...item, [kind]: [...item[kind], ...files] } : item) }); e.target.value = ""; }} /></label>{project[kind].length > 0 && <div className="handover-pending-files">{project[kind].map((file, fileIndex) => <button type="button" key={`${file.name}-${fileIndex}`} title="Xóa tệp đã chọn" onClick={() => setForm({ ...form, projects: form.projects.map((item, i) => i === index ? { ...item, [kind]: item[kind].filter((_, j) => j !== fileIndex) } : item) })}>📎 {file.name} ×</button>)}</div>}</td>)}<td><button type="button" className="handover-remove-row" aria-label="Xóa dự án" onClick={() => setForm({ ...form, projects: form.projects.filter((_, i) => i !== index) })}>×</button></td></tr>)}</tbody></table></div></div>
            </div>
            <p className="handover-hint">Tình trạng tài khoản đã cấp được đính kèm tự động để cấp trên kiểm tra. Hồ sơ chỉ được chuyển sang danh sách nghỉ việc sau khi được duyệt.</p>
            <button className="handover-primary" disabled={saving}>{saving ? "Đang gửi..." : "Gửi cấp trên duyệt"}</button>
        </form>}
        <section className="handover-list-section"><div className="handover-list-heading"><h2>{reviewMode ? "Yêu cầu bàn giao cần xử lý" : "Lịch sử yêu cầu của tôi"}</h2><button onClick={load} disabled={loading}>↻ Làm mới</button></div>
            {loading ? <div className="handover-empty">Đang tải...</div> : rows.length === 0 ? <div className="handover-empty">{reviewMode ? "Chưa có yêu cầu bàn giao." : "Bạn chưa gửi yêu cầu bàn giao nào."}</div> : <div className="handover-list">{rows.map((row) => <article className="handover-card" key={row.id}>
                <div className="handover-card-head"><div><h3>{reviewMode ? row.employeeName : "Yêu cầu bàn giao nghỉ việc"}</h3><span>{reviewMode ? `${row.employeeCode} · ${row.departmentName || "Chưa có phòng ban"}` : `Quản lý duyệt: ${row.managerName}`}</span></div><span className={`handover-status handover-status-${row.status}`}>{statusLabels[row.status] || "Không rõ"}</span></div>
                <div className="handover-facts"><span><small>Ngày làm việc cuối cùng</small><b>{dateLabel(row.lastWorkingDate, locale)}</b></span><span><small>Tài khoản công ty</small><b>{row.accountIssued ? "Đã được cấp" : "Chưa được cấp"}</b></span><span><small>Gửi ngày</small><b>{row.createdTime ? new Date(row.createdTime).toLocaleDateString(locale) : "—"}</b></span></div>
                <p className="handover-reason"><strong>Lý do nghỉ việc:</strong> {row.reason}</p><HandoverTables row={row} onDownload={download} />{row.reviewNote && <p className="handover-review-note"><strong>Phản hồi cấp trên:</strong> {row.reviewNote}</p>}
                {reviewMode && row.status === 0 && <button className="handover-secondary" onClick={() => { setSelected(row); setNote(""); }}>Xem và xử lý</button>}
            </article>)}</div>}
        </section>
        {selected && <div className="handover-overlay" onMouseDown={(e) => e.target === e.currentTarget && !saving && setSelected(null)}><section className="handover-dialog" role="dialog" aria-modal="true"><button className="handover-close" onClick={() => setSelected(null)}>×</button><span className="handover-eyebrow">DUYỆT BÀN GIAO</span><h2>{selected.employeeName}</h2><p>{selected.employeeCode} · {selected.departmentName || "Chưa có phòng ban"}</p><div className="handover-detail-grid"><div><small>Ngày làm việc cuối cùng</small><b>{dateLabel(selected.lastWorkingDate, locale)}</b></div><div><small>Tài khoản công ty</small><b>{selected.accountIssued ? "Đã được cấp" : "Chưa được cấp"}</b></div></div><p className="handover-reason"><strong>Lý do nghỉ việc:</strong> {selected.reason}</p><HandoverTables row={selected} onDownload={download} /><label>Ý kiến duyệt<textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ý kiến; bắt buộc nếu từ chối." /></label><footer><button className="handover-reject" disabled={saving || !note.trim()} onClick={() => review(false)}>Từ chối</button><button className="handover-primary" disabled={saving} onClick={() => review(true)}>Duyệt và chuyển sang nghỉ việc</button></footer></section></div>}
    </div>;
    return reviewMode ? <HrAppLayout>{content}</HrAppLayout> : <AppLayout>{content}</AppLayout>;
}
