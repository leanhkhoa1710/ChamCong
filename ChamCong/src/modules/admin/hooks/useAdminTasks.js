import { useMemo } from "react";

// Ngày VN (UTC+7): label "28/09/2026" + key "YYYY-MM-DD".
export const vnToday = () => {
    const utc = Date.now() + new Date().getTimezoneOffset() * 60000 + 7 * 3600000;
    const d = new Date(utc);
    const pad = (n) => String(n).padStart(2, "0");
    return {
        label: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
        key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    };
};
// Key ngày VN "YYYY-MM-DD" từ một timestamp ISO.
export const vnDayKey = (iso) => {
    if (!iso) return "";
    const t = new Date(iso).getTime() + new Date(iso).getTimezoneOffset() * 60000;
    const d = new Date(t + 7 * 3600000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Tính KPI "Hôm nay" + danh sách việc cần làm từ dữ liệu quản trị.
export const useAdminTasks = (data) => {
    const { employees, logs, leaves, payrolls, contracts, codes } = data;
    const t = vnToday();

    const kpi = useMemo(() => {
        const active = employees.filter((e) => [1, 2, 3].includes(e.status));
        const todayIn = new Set(
            logs
                .filter((l) => l.type === 1 && vnDayKey(l.logTime) === t.key)
                .map((l) => l.employeeId)
        );
        const abnormal = logs.filter(
            (l) => l.isAdjusted && vnDayKey(l.logTime) === t.key
        ).length;
        const pendingLeave = leaves.filter((l) => l.status === 1).length;
        const pendingPayroll = payrolls.filter(
            (p) => p.status === 1 || p.status === 2
        ).length;
        return {
            total: active.length,
            checkedIn: todayIn.size,
            abnormal,
            pendingApproval: pendingLeave + pendingPayroll,
        };
    }, [employees, logs, leaves, payrolls, t.key]);

    const activationNote = useMemo(() => {
        const n = codes.filter((c) => !c.isUsed && !c.usedAt).length;
        return n ? `${n} người đã nhận mã nhưng chưa kích hoạt` : "";
    }, [codes]);

    const tasks = useMemo(() => {
        const arr = [];
        // Người đang làm (status=2) nhưng chưa có hợp đồng hiện hành (endDate rỗng).
        const withContract = new Set(
            contracts.filter((c) => !c.endDate).map((c) => c.employeeId)
        );
        const noContract = employees.filter(
            (e) => e.status === 2 && !withContract.has(e.id)
        );
        if (noContract.length) {
            arr.push({
                id: "contract",
                title: "Hoàn tất hợp đồng lao động cho người đã đi làm",
                sub: `${noContract.length} người`,
                status: "Quá hạn",
                cls: "bad",
                owner: "Nhân sự",
                deadline: "Không có hạn",
                risk:
                    "Đang đi làm mà không có hợp đồng — mỗi ngày công là mất căn cứ pháp lý",
                action: "Xem người chưa ký",
                to: "/employees",
            });
        }
        if (activationNote) {
            arr.push({
                id: "activation",
                title: "Nhắc người lao động kích hoạt tài khoản",
                sub: activationNote,
                status: "Cần xử lý",
                cls: "warn",
                owner: "Nhân sự",
                deadline: "Trước khi mã hết hạn",
                risk: "Mã hết hạn 72 giờ phải cấp lại — làm phiền người lao động",
                action: "Nhắc kích hoạt",
                to: "/employees",
            });
        }
        if (kpi.pendingApproval) {
            arr.push({
                id: "approval",
                title: "Duyệt đơn nghỉ phép / bảng lương đang chờ",
                sub: `${kpi.pendingApproval} mục chờ phê duyệt`,
                status: "Chờ duyệt",
                cls: "warn",
                owner: "Quản lý",
                deadline: "Trước hạn",
                risk: "Trễ duyệt ảnh hưởng xếp ca và thời điểm trả lương",
                action: "Xử lý",
                to: "/leave",
            });
        }
        return arr;
    }, [employees, contracts, activationNote, kpi.pendingApproval]);

    return { t, kpi, tasks, activationNote };
};
