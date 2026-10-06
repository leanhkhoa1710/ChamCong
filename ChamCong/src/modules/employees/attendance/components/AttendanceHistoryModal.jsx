import { approvalLabel } from "../labels";
import { translate, useLanguage } from "../../../../services/i18n/LanguageProvider";
import { formatVnTime, formatVnDate } from "../../../../utils/vnTime";

// Modal lịch sử phê duyệt + chỉnh sửa của 1 bản ghi chấm công.
// Hiển thị khi hover "Đã duyệt" / "Từ chối" -> click "Xem chi tiết".
const AttendanceHistoryModal = ({ row, employeeLabel, logs = [], onClose }) => {
    const { language } = useLanguage();
    const L = (text) => translate(text, language);
    if (!row) return null;

    const isRejected = row.approvalStatus === 2;
    const hasEdit = row.changeSummary;

    return (
        <div className="att-guide-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <section className="att-history-modal" role="dialog" aria-modal="true">
                <header className="att-history-modal-head">
                    <h2>{L("Lịch sử bản ghi")}</h2>
                    <p>{employeeLabel} · {formatVnDate(row.attendanceDate)}</p>
                    <button type="button" onClick={onClose} aria-label={L("Đóng")}>×</button>
                </header>

                <div className="att-history-body">
                    <div className="att-history-section">
                        <div className="att-history-section-title"><strong>Vị trí chấm công</strong></div>
                        {logs.length === 0 && <p className="att-muted">Bản ghi này chưa có vị trí GPS. Vị trí chỉ được lưu ở lần chấm công có cấp quyền định vị.</p>}
                        {logs.map((log) => (
                            <div className="att-history-row" key={log.id}>
                                <span className="att-history-label">{log.type === 1 ? "Vào ca" : "Ra ca"} · {formatVnTime(log.logTime)}</span>
                                {log.latitude != null && log.longitude != null ? (
                                    <a href={`https://www.google.com/maps?q=${encodeURIComponent(`${log.latitude},${log.longitude}`)}`} target="_blank" rel="noopener noreferrer">{log.latitude}, {log.longitude} · Xem bản đồ ↗</a>
                                ) : <span>Chưa có vị trí</span>}
                            </div>
                        ))}
                    </div>
                    {/* ===== 1. PHÊ DUYỆT ===== */}
                    <div className="att-history-section">
                        <div className="att-history-section-title">
                            <span className={`att-badge ${isRejected ? "att-badge--bad" : "att-badge--ok"}`}>
                                {L(approvalLabel(row.approvalStatus))}
                            </span>
                        </div>
                        <div className="att-history-row">
                            <span className="att-history-label">{L("Người duyệt")}</span>
                            <span>{row.approverName || "—"}</span>
                        </div>
                        <div className="att-history-row">
                            <span className="att-history-label">{L("Thời gian")}</span>
                            <span>
                                {row.approvedAt
                                    ? `${formatVnTime(row.approvedAt)} · ${formatVnDate(row.approvedAt)}`
                                    : "—"}
                            </span>
                        </div>
                        {row.note && (
                            <div className="att-history-row">
                                <span className="att-history-label">{isRejected ? "Lý do từ chối" : "Ghi chú"}</span>
                                <span>{row.note}</span>
                            </div>
                        )}
                    </div>

                    {/* ===== 2. CHỈNH SỬA (chỉ hiện nếu có) ===== */}
                    {hasEdit && (
                        <div className="att-history-section">
                            <div className="att-history-section-title">
                                <span className="att-badge att-badge--info">{L("Đã chỉnh sửa")}</span>
                            </div>
                            <div className="att-history-row">
                                <span className="att-history-label">{L("Người sửa")}</span>
                                <span>{row.lastUpdatedBy || "—"}</span>
                            </div>
                            <div className="att-history-row">
                                <span className="att-history-label">{L("Thời gian")}</span>
                                <span>
                                    {row.lastUpdatedTime
                                        ? `${formatVnTime(row.lastUpdatedTime)} · ${formatVnDate(row.lastUpdatedTime)}`
                                        : "—"}
                                </span>
                            </div>
                            <div className="att-history-row">
                                <span className="att-history-label">{L("Nội dung")}</span>
                                <span className="att-history-change-detail">{row.changeSummary}</span>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="att-history-modal-foot">
                    <button type="button" className="admin-link-btn" onClick={onClose}>{L("Đóng")}</button>
                </footer>
            </section>
        </div>
    );
};

export default AttendanceHistoryModal;
