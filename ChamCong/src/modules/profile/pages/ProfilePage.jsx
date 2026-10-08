import { useState, useEffect, useMemo } from "react";
import { getAuth } from "../../../services/auth/auth";
import AppLayout from "../../../components/layout/AppLayout";
import axiosClient from "../../../services/api/axiosClient";
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
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

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
                const res = await axiosClient.get("/Employee/my-profile");
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

    const startEditing = () => {
        setError("");
        setForm(Object.fromEntries(["givenName", "familyName", "phoneNumber", "email", "permanentAddress", "currentAddress"].map((key) => [key, profile?.[key] || ""])));
        setForm((value) => ({ ...value, birthDate: profile?.birthDate?.slice(0, 10) || "", gender: profile?.gender ?? 0 }));
        setEditing(true);
    };
    const saveProfile = async (event) => {
        event.preventDefault();
        if (saving) return;
        setSaving(true);
        setError("");
        try {
            const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, typeof value === "string" ? value.trim() || null : value]));
            const response = await axiosClient.put("/Employee/my-profile", { ...payload, gender: Number(form.gender) });
            setProfile(response.data.data);
            setEditing(false);
            notify("Đã cập nhật hồ sơ. HR có thể xem thông tin mới của bạn.");
        } catch (err) {
            setError(err.response?.data?.message || "Không lưu được hồ sơ. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setSaving(false);
        }
    };
    const personalFields = [
        ["givenName", "Họ / tên đệm", "text", "Ví dụ: Trần Văn", 100],
        ["familyName", "Tên", "text", "Ví dụ: Triệu", 100],
        ["birthDate", "Ngày sinh", "date", "Không được là ngày tương lai"],
        ["phoneNumber", "Điện thoại", "tel", "Ví dụ: 0901234567 hoặc +84901234567", 20],
        ["email", "Email", "email", "Ví dụ: ten@congty.com", 150],
        ["permanentAddress", "Địa chỉ thường trú", "text", "Nhập địa chỉ thường trú của bạn", 500],
        ["currentAddress", "Địa chỉ hiện tại", "text", "Nhập nơi bạn đang sinh sống", 500],
    ];

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
                        {!editing && profile && <button className="profile-avatar-btn" type="button" onClick={startEditing}>Cập nhật hồ sơ của tôi</button>}
                        {editing && <form className="profile-edit" onSubmit={saveProfile}>
                            <p>Bạn chỉ được cập nhật thông tin cá nhân. Phòng ban, chức vụ, mã nhân viên và trạng thái do HR quản lý.</p>
                            <fieldset disabled={saving}>
                                {personalFields.map(([key, label, type, hint, maxLength]) => <label key={key}>
                                    <span>{label}{["givenName", "familyName"].includes(key) ? " *" : ""}</span>
                                    <input type={type} value={form[key] || ""} required={["givenName", "familyName"].includes(key)} maxLength={maxLength} max={type === "date" ? new Date().toLocaleDateString("sv-SE") : undefined} pattern={type === "tel" ? "(0[0-9]{9}|\\+84[0-9]{9})" : ["givenName", "familyName"].includes(key) ? ".*\\S.*" : undefined} onChange={(event) => setForm((value) => ({ ...value, [key]: event.target.value }))} onBlur={(event) => event.target.reportValidity()} />
                                    <small>{hint}</small>
                                </label>)}
                                <label><span>Giới tính</span><select value={form.gender} onChange={(event) => setForm((value) => ({ ...value, gender: Number(event.target.value) }))}><option value={0}>Không tiết lộ</option><option value={1}>Nam</option><option value={2}>Nữ</option></select></label>
                            </fieldset>
                            <div className="profile-edit-actions"><button type="button" className="att-btn" disabled={saving} onClick={() => setEditing(false)}>Hủy</button><button type="submit" className="att-btn" disabled={saving}>{saving ? "Đang lưu…" : "Lưu thông tin"}</button></div>
                        </form>}
                        {!editing && <>
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
                        </>}
                    </section>

                </div>
            )}
        </AppLayout>
    );
};

export default ProfilePage;
