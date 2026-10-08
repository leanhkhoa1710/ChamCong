import { Link } from "react-router-dom";
import Header from "../../../components/layout/Header";
import { canAccessModule } from "../../../services/auth/permission";
import "../home.css";

const MODULES = [
    { to: "/attendance", icon: "◷", title: "Chấm công", detail: "Vào / ra ca, lịch sử, thống kê và nghỉ phép", color: "blue" },
    { to: "/work", icon: "▤", title: "Công việc", detail: "Theo dõi công việc và các yêu cầu cần xử lý", color: "blue" },
    { to: "/profile", icon: "♙", title: "Hồ sơ cá nhân", detail: "Thông tin nhân viên và hồ sơ của bạn", color: "blue" },
    { to: "/salary", icon: "＄", title: "Lương & chế độ", detail: "Bảng lương, bảo hiểm, thuế và tài khoản nhận lương", color: "blue" },
    { to: "/employees", icon: "♙", title: "Nhân sự", detail: "Hồ sơ và danh sách nhân viên", color: "pink" },
    { to: "/admin", icon: "▦", title: "Dashboard", detail: "Điều hành và quản lý hệ thống", color: "blue" },
];

const HomePage = () => (
    <div className="home-shell">
        <Header minimal />
        <main className="home-main">
            <section className="home-hero">
                <div>
                    <span className="home-eyebrow">MARIXA · PEOPLE OPERATIONS</span>
                    <h1>Mọi công việc trong một không gian.</h1>
                    <p>Chọn khu vực làm việc bên dưới. Các chức năng chi tiết nằm trong menu của từng trang.</p>
                </div>
                <div className="home-hero-art" aria-hidden="true"><span>M</span><i /><i /><i /></div>
            </section>

            <section className="home-launcher" aria-labelledby="home-title">
                <div className="home-heading">
                    <div><span className="home-eyebrow">MARIXA</span><h2 id="home-title">Không gian làm việc</h2></div>
                    <p>Truy cập nhanh các khu vực chính.</p>
                </div>
                <div className="home-grid">
                    {MODULES.filter((module) => canAccessModule(module.to)).map((module) => (
                        <Link className="home-card" to={module.to} key={module.to}>
                            <span className={`home-icon home-icon--${module.color}`} aria-hidden="true">{module.icon}</span>
                            <strong>{module.title}</strong>
                            <span>{module.detail}</span>
                            <span className="home-arrow" aria-hidden="true">↗</span>
                        </Link>
                    ))}
                </div>
            </section>
            <footer className="home-footer"><strong>MARIXA</strong><span>Chấm công &amp; quản lý nhân sự</span></footer>
        </main>
    </div>
);

export default HomePage;
