import fs from 'node:fs';

const file = 'ChamCong/src/modules/employees/attendance/components/AttendanceFormModal.jsx';
let text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const dayStatusOld = `                    <label>
                        Ngày
                        <input
                            type="date"
                            required
                            value={form.attendanceDate}
                            onChange={set("attendanceDate")}
                        />
                    </label>

                    <label>
                        Trạng thái
                        <select value={form.status} onChange={set("status")}>
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.l} value={o.v}>
                                    {o.l}
                                </option>
                            ))}
                        </select>
                    </label>`;

const dayStatusNew = `                    <div className="att-form-row">
                        <label>
                            Ngày
                            <input
                                type="date"
                                required
                                value={form.attendanceDate}
                                onChange={set("attendanceDate")}
                            />
                        </label>

                        <label>
                            Trạng thái
                            <select value={form.status} onChange={set("status")}>
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.l} value={o.v}>
                                        {o.l}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>`;

if (!text.includes(dayStatusOld)) {
    throw new Error('Day/status block not found');
}
text = text.replace(dayStatusOld, dayStatusNew);

const timesOld = `                    {!row && <>
                        <label>Giờ vào<input type="time" value={form.checkInTime} onChange={setTime("checkInTime")} /></label>
                        <label>Giờ ra<input type="time" value={form.checkOutTime} onChange={setTime("checkOutTime")} /></label>
                    </>}`;

const timesNew = `                    {!row && (
                        <div className="att-form-row">
                            <label>Giờ vào<input type="time" value={form.checkInTime} onChange={setTime("checkInTime")} /></label>
                            <label>Giờ ra<input type="time" value={form.checkOutTime} onChange={setTime("checkOutTime")} /></label>
                        </div>
                    )}`;

if (!text.includes(timesOld)) {
    throw new Error('Time block not found');
}
text = text.replace(timesOld, timesNew);

const approvalOld = `                    <label>
                        Giờ thực tế
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={form.actualHours}
                            onChange={set("actualHours")}
                            placeholder="Tùy chọn"
                        />
                    </label>

                    <label>
                        Phê duyệt
                        <select
                            value={form.approvalStatus}
                            onChange={set("approvalStatus")}
                        >
                            {APPROVAL_OPTIONS.map((o) => (
                                <option key={o.v} value={o.v}>
                                    {o.l}
                                </option>
                            ))}
                        </select>
                    </label>`;

const approvalNew = `                    <div className="att-form-row">
                        <label>
                            Giờ thực tế
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={form.actualHours}
                                onChange={set("actualHours")}
                                placeholder="Tùy chọn"
                            />
                        </label>

                        <label>
                            Phê duyệt
                            <select
                                value={form.approvalStatus}
                                onChange={set("approvalStatus")}
                            >
                                {APPROVAL_OPTIONS.map((o) => (
                                    <option key={o.v} value={o.v}>
                                        {o.l}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>`;

if (!text.includes(approvalOld)) {
    throw new Error('Approval block not found');
}
text = text.replace(approvalOld, approvalNew);

fs.writeFileSync(file, text, 'utf8');
console.log('Attendance modal layout updated');
