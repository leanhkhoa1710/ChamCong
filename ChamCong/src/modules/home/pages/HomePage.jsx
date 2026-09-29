import { Link } from "react-router-dom";
import AppLayout from "../../../components/layout/AppLayout";
import { canAccessModule } from "../../../services/auth/permission";
import { getAuth } from "../../../services/auth/auth";
import "../home.css";

const MODULES = [
    { to: "/employees", title: "Nhân sự", subtitle: "Hồ sơ và danh sách nhân viên", group: "Con người", icon: "people", tone: "pink" },
    { to: "/attendance", title: "Chấm công", subtitle: "Ghi nhận giờ vào ca và tan ca", group: "Thời gian", icon: "clock", tone: "blue" },
    { to: "/leave", title: "Nghỉ phép", subtitle: "Theo dõi ngày phép và đơn nghỉ", group: "Phúc lợi", icon: "calendar", tone: "lime" },
    { to: "/statistics", title: "Thống kê công", subtitle: "Tổng hợp ngày công của bạn", group: "Báo cáo", icon: "chart", tone: "amber" },
    { to: "/attendance-history", title: "Lịch sử chấm công", subtitle: "Tra cứu các lượt chấm công", group: "Thời gian", icon: "history", tone: "red" },
    { to: "/contracts", title: "Hợp đồng", subtitle: "Tra cứu thông tin hợp đồng", group: "Hồ sơ", icon: "file", tone: "blue" },
    { to: "/salary", title: "Bảng lương", subtitle: "Xem chi tiết lương theo kỳ", group: "Tài chính", icon: "wallet", tone: "lime" },
    { to: "/insurance", title: "Bảo hiểm & thuế", subtitle: "Thông tin bảo hiểm và mã số thuế", group: "Tài chính", icon: "shield", tone: "pink" },
    { to: "/bank-accounts", title: "Tài khoản ngân hàng", subtitle: "Thông tin nhận lương", group: "Tài chính", icon: "bank", tone: "amber" },
    { to: "/profile", title: "Hồ sơ của tôi", subtitle: "Thông tin cá nhân và công việc", group: "Tài khoản", icon: "profile", tone: "red" },
    { to: "/employees/approval", title: "Duyệt công", subtitle: "Xử lý các yêu cầu điều chỉnh công", group: "Nhân sự", icon: "check", tone: "blue" },
    { to: "/employees/leaves", title: "Duyệt nghỉ phép", subtitle: "Xem và xử lý đơn nghỉ phép", group: "Nhân sự", icon: "calendar", tone: "lime" },
    { to: "/employees/report", title: "Báo cáo nhân sự", subtitle: "Tổng hợp dữ liệu nhân sự", group: "Báo cáo", icon: "report", tone: "pink" },
    { to: "/admin", title: "Điều hành", subtitle: "Tổng quan hoạt động hệ thống", group: "Quản trị", icon: "chart", tone: "amber" },
];

const ICONS = {
    people: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20zM16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8V20" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M4 9h16M8 14h3M8 17h7" /></>,
    chart: <><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6" /><path d="M16 7h3v3" /></>,
    history: <><path d="M4 8a8 8 0 1 1-1 5M4 4v4h4M12 7v5l3 2" /></>,
    file: <><path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z" /><path d="M14 3.5V8h4M9 13h6M9 16h6" /></>,
    wallet: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M3 9h18M15 14h3" /><circle cx="15" cy="14" r=".5" /></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    bank: <><path d="m3 9 9-5 9 5M4 10h16M5 19h14M7 10v8M12 10v8M17 10v8" /></>,
    profile: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
    check: <><rect x="4" y="4" width="16" height="17" rx="2" /><path d="M8 4V2.5M16 4V2.5M8 10h8m-8 4 2.2 2.2L16 12" /></>,
    report: <><path d="M5 3.5h10l4 4V20a.5.5 0 0 1-.5.5h-13A.5.5 0 0 1 5 20z" /><path d="M14.5 3.5V8H19M8 12h8M8 15h8M8 18h5" /></>,
};

const HomePage = () => {
    const auth = getAuth();
    const modules = MODULES.filter((module) => canAccessModule(module.to));
    const employeeModule = canAccessModule("/employees");
    const today = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date());

    return (
        <AppLayout>
            <div className="home-page">
                <section className="home-hero">
                    <div className="home-hero-copy">
                        <span className="home-eyebrow">MARIXA · PEOPLE OPERATIONS</span>
                        <h1>Mọi công việc nhân sự, trong một không gian.</h1>
                        <p>Chấm công, hồ sơ và các nghiệp vụ hằng ngày được kết nối trong một nơi làm việc gọn gàng.</p>
                        <div className="home-hero-actions">
                            <Link to="/attendance" className="home-primary-action">Bắt đầu chấm công <span aria-hidden="true">↗</span></Link>
                            {employeeModule && <Link to="/employees" className="home-secondary-action">Mở nhân sự</Link>}
                        </div>
                    </div>
                    <div className="home-hero-aside" aria-label="Ngày hôm nay">
                        <div className="home-orbit" aria-hidden="true"><span className="home-orbit-core">M</span><i /><i /><i /></div>
                        <div className="home-date-card"><span>KHÔNG GIAN LÀM VIỆC</span><strong>{today}</strong><small>Xin chào{auth?.userName ? `, ${auth.userName}` : ""}</small></div>
                    </div>
                </section>

                <section className="home-launcher" aria-labelledby="home-launcher-title">
                    <div className="home-section-heading">
                        <div><span className="home-section-kicker">BUSINESS LAUNCHER</span><h2 id="home-launcher-title">Không gian làm việc</h2></div>
                        <p>Chọn một module để tiếp tục công việc của bạn.</p>
                    </div>
                    <div className="home-module-grid">
                        {modules.map((module) => (
                            <Link className="home-module-card" to={module.to} key={module.to}>
                                <span className={`home-module-icon home-module-icon--${module.tone}`} aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[module.icon]}</svg>
                                </span>
                                <span className="home-module-meta">{module.group}</span>
                                <strong>{module.title}</strong>
                                <span className="home-module-description">{module.subtitle}</span>
                                <span className="home-module-arrow" aria-hidden="true">↗</span>
                            </Link>
                        ))}
                    </div>
                </section>
                <footer className="home-footer"><span>MARIXA</span><span>Chấm công &amp; quản lý nhân sự</span></footer>
            </div>
        </AppLayout>
    );
};

export default HomePage;
