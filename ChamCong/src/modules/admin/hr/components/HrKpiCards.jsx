// 4 thẻ KPI quản lý nhân sự (nền sáng, accent marixa).
const HrKpiCards = ({ kpis }) => {
    const cards = [
        {
            icon: "✓",
            title: "Đã chấm công hôm nay",
            value: kpis.checkedInToday,
            of: kpis.activeCount,
            sub: `trên ${kpis.activeCount} người đang làm việc · ${kpis.logsToday} lượt trong ca`,
            tone: "neutral",
        },
        {
            icon: "⚠",
            title: "Lượt chấm cần duyệt tay",
            value: kpis.needsManual,
            of: kpis.logsToday,
            sub: `trên ${kpis.logsToday} lượt chấm hôm nay`,
            tone: "warn",
        },
        {
            icon: "📄",
            title: "Hợp đồng sắp hết hạn",
            value: kpis.noContractEnd,
            of: kpis.activeCount,
            sub: `Chưa có số hạn trong ${kpis.noContractEnd} người được nhập ngày hết hợp đồng`,
            tone: "warn",
        },
        {
            icon: "💰",
            title: "Hồ sơ đủ để tính lương",
            value: kpis.readyForPayroll,
            of: kpis.activeCount,
            sub: `trên ${kpis.activeCount} hồ sơ · ${kpis.missingSalary} hồ sơ còn thiếu`,
            tone: "ok",
        },
    ];

    return (
        <div className="hr-kpi-row">
            {cards.map((c) => (
                <div
                    key={c.title}
                    className={`hr-card hr-card--${c.tone}`}
                >
                    <div className="hr-card-head">
                        <span className="hr-card-icon">{c.icon}</span>
                        <span className="hr-card-title">{c.title}</span>
                    </div>
                    <div className="hr-card-value">
                        <strong>{c.value}</strong>
                        <span className="hr-card-of">/{c.of}</span>
                    </div>
                    <p className="hr-card-sub">{c.sub}</p>
                </div>
            ))}
        </div>
    );
};

export default HrKpiCards;
