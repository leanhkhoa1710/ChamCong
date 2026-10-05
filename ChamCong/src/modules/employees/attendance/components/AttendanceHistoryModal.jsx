import { approvalLabel } from "../labels";
import { formatVnTime, formatVnDate } from "../../../../utils/vnTime";

// Modal lịch sử phê duyệt + chỉnh sửa của 1 bản ghi chấm công.
// Hiển thị khi hover "Đã duyệt" / "Từ chối" -> click "Xem chi tiết".
const AttendanceHistoryModal = ({ row, employeeLabel, onClose }) => {
    if (!row) return null;

    const isRejected = row.approvalStatus === 2;
    const hasEdit = row.changeSummary;

    return (
        <div className="att-guide-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <section className="att-history-modal" role="dialog" aria-modal="true">
                <header className="att-history-modal-head">
                    <h2>Lịch sử bản ghi</h2>
                    <p>{employeeLabel} · {formatVnDate(row.attendanceDate)}</p>
                    <button type="button" onClick={onClose} aria-label="Đóng">×</button>
                </header>

                <div className="att-history-body">
                    {/* ===== 1. PHÊ DUYỆT ===== */}
                    <div className="att-history-section">
                        <div className="att-history-section-title">
                            <span className={`att-badge ${isRejected ? "att-badge--bad" : "att-badge--ok"}`}>
                                {approvalLabel(row.approvalStatus)}
                            </span>
                        </div>
                        <div className="att-history-row">
                            <span className="att-history-label">Người duyệt</span>
                            <span>{row.approverName || "—"}</span>
                        </div>
                        <div className="att-history-row">
                            <span className="att-history-label">Thời gian</span>
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
                                <span className="att-badge att-badge--info">Đã chỉnh sửa</span>
                            </div>
                            <div className="att-history-row">
                                <span className="att-history-label">Người sửa</span>
                                <span>{row.lastUpdatedBy || "—"}</span>
                            </div>
                            <div className="att-history-row">
                                <span className="att-history-label">Thời gian</span>
                                <span>
                                    {row.lastUpdatedTime
                                        ? `${formatVnTime(row.lastUpdatedTime)} · ${formatVnDate(row.lastUpdatedTime)}`
                                        : "—"}
                                </span>
                            </div>
                            <div className="att-history-row">
                                <span className="att-history-label">Nội dung</span>
                                <span className="att-history-change-detail">{row.changeSummary}</span>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="att-history-modal-foot">
                    <button type="button" className="admin-link-btn" onClick={onClose}>Đóng</button>
                </footer>
            </section>
        </div>
    );
};

export default AttendanceHistoryModal;
