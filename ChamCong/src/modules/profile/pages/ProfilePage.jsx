import { useState, useEffect, useMemo } from "react";
import { getAuth } from "../../../services/auth/auth";
import AppLayout from "../../../components/layout/AppLayout";
import relatedApi from "../../attendance/api/relatedApi";
import { formatVnDate } from "../../../utils/vnTime";
import { AvatarBlock } from "../components/AvatarBlock";
import "../../attendance/attendance.css";
import "../profile.css";

const statusLabel = (s) =>
    ({
        1: "Thử việc",
        2: "Đang làm",
        3: "Tạm nghỉ",
        4: "Đã nghỉ việc",
        5: "Chấm dứt",
    })[s] || "—";

const genderLabel = (g) =>
    ({ 1: "Nam", 2: "Nữ" })[g] || "—";

const ProfilePage = () => {
    const auth = getAuth();
    const userId = auth?.userId;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const notify = (msg) => {
        setNotice(msg);
        setTimeout(() => setNotice(""), 3000);
    };

    useEffect(() => {
        const load = async () => {
            try {
                if (!userId) {
                    setError("Chưa xác định được tài khoản đang đăng nhập.");
                    setLoading(false);
                    return;
                }
                const res = await relatedApi.employeeByUser(userId);
                setProfile(res.data.data || null);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "Không thể tải hồ sơ."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [userId]);

    const rows = useMemo(
        () => [
            ["Mã NV", profile?.employeeCode || auth?.employeeCode || "—"],
            ["Phòng ban", profile?.departmentName || "—"],
            ["Chức vụ", profile?.positionName || "—"],
            ["Điện thoại", profile?.phoneNumber || "—"],
            ["Email", profile?.email || "—"],
            ["Ngày vào", profile?.startDate ? formatVnDate(profile.startDate) : "—"],
            ["Ngày sinh", profile?.birthDate ? formatVnDate(profile.birthDate) : "—"],
            ["Giới tính", genderLabel(profile?.gender)],
            ["CCCD", profile?.citizenId || "—"],
            ["Địa chỉ", profile?.permanentAddress || "—"],
            ["Trạng thái", statusLabel(profile?.status)],
        ],
        [profile, auth]
    );

    return (
        <AppLayout
            title="Hồ sơ"
            subtitle="Thông tin cá nhân và tài khoản của bạn"
            profile={profile}
        >
            {notice && <div className="profile-notice">{notice}</div>}
            {error && <div className="att-error">{error}</div>}

            {loading ? (
                <div className="att-loading">Đang tải...</div>
            ) : (
                <div className="profile-layout">
                    {/* Ảnh đại diện */}
                    <section className="profile-card">
                        <h2>Ảnh đại diện</h2>
                        <AvatarBlock auth={auth} notice={notify} />
                    </section>

                    {/* Thông tin nhân viên */}
                    <section className="profile-card">
                        <h2>Thông tin cá nhân</h2>
                        <div className="profile-head">
                            <div>
                                <strong>{profile?.fullName || auth?.userName || "—"}</strong>
                                <span>
                                    {profile?.employeeCode || auth?.employeeCode || ""}
                                </span>
                            </div>
                            <span className="att-badge info">
                                {statusLabel(profile?.status)}
                            </span>
                        </div>
                        <dl className="profile-info">
                            {rows.map(([label, value]) => (
                                <div key={label}>
                                    <dt>{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                </div>
            )}
        </AppLayout>
    );
};

export default ProfilePage;
