// ============================================================
// MARIXA /employees — Figma auto-draw plugin (single-file dev plugin)
// Cách dùng:
//   1. Figma -> Plugins -> Development -> New plugin
//   2. Đổi tên plugin: "Marixa Employees"
//   3. Xóa nội dung code.js, DÁN TOÀN BỘ file này vào, Save
//   4. Mở file Untitled của bạn -> Plugins -> Development -> "Marixa Employees" -> Run
//   5. Bấm nút "Vẽ thiết kế /employees" -> frame tự vẽ trên canvas
// Layer tạo ra hoàn chỉnh: header, sidebar, KPI, tabs, filter,
// legend, bảng nhân viên, pagination — giá trị lấy đúng từ code thật.
// ============================================================

figma.showUI(
  `<div style="padding:16px;font-family:sans-serif">
     <p style="font-size:12px;color:#555;margin:0 0 12px">Vẽ trang <b>/employees</b> (MARIXA) lên canvas, layer chỉnh được.</p>
     <button id="go" style="width:100%;padding:10px;background:#005b94;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Vẽ thiết kế /employees</button>
   </div>
   <script>document.getElementById('go').onclick=()=>parent.postMessage({type:'run'},'*');</script>`,
  { width: 260, height: 120 }
);

// ===== màu & font (đúng hr.css / attendance.css) =====
const C = {
  bg: "#f6f7f9", card: "#ffffff", line: "#eef2f6", line2: "#d1d5db",
  ink: "#0e1a26", ink2: "#38506a", mut: "#5a6b7b", mut2: "#9aa9b8",
  brand: "#005b94", brandBg: "#e3f0ff",
  ok: "#15803d", okBg: "#f0faf4", okBd: "#d6efe0",
  warn: "#a16207", warnBg: "#fffaf0", warnBd: "#f5e7c8",
  badgeOk: "#dcfce7", badgeOkTx: "#15803d",
  badgeInfoBg: "#dbeafe", badgeInfoTx: "#1d4ed8",
  chipBg: "#e8f2fb", chipTx: "#075b91",
  missBg: "#fff4dc", missTx: "#a16207",
  tblHead: "#fbfcfe", green: "#218838",
};
const hex = (h) => {
  const s = h.replace("#", "");
  return { r: parseInt(s.slice(0, 2), 16) / 255, g: parseInt(s.slice(2, 4), 16) / 255, b: parseInt(s.slice(4, 6), 16) / 255 };
};
const FONT = "Inter"; // Inter của Figma có bộ ký tự tiếng Việt
const styleOf = (w) => (w >= 800 ? "Extra bold" : w === 700 ? "Bold" : w === 600 ? "Semi bold" : w === 500 ? "Medium" : "Regular");

async function txt(parent, x, y, str, px, weight, color, opts = {}) {
  const t = figma.createText();
  const st = styleOf(weight || 400);
  await figma.loadFontAsync({ family: FONT, style: st });
  t.fontName = { family: FONT, style: st };
  t.characters = str;
  t.fontSize = px;
  t.fills = [{ type: "SOLID", color: hex(color) }];
  t.x = x; t.y = y;
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: "PIXELS" };
  if (opts.letterSpacing) t.letterSpacing = { value: opts.letterSpacing, unit: "PERCENT" };
  parent.appendChild(t);
  return t;
}

function box(parent, x, y, w, h, fillHex, radius, strokeHex) {
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.width = w; r.height = h;
  if (fillHex) r.fills = [{ type: "SOLID", color: hex(fillHex) }]; else r.fills = [];
  if (radius) r.cornerRadius = radius;
  if (strokeHex) { r.strokes = [{ type: "SOLID", color: hex(strokeHex) }]; r.strokeWeight = 1; r.strokeAlign = "INSIDE"; } else r.strokes = [];
  parent.appendChild(r);
  return r;
}

// nút với text giữa
async function btn(parent, x, y, w, h, label, o) {
  const b = box(parent, x, y, w, h, o.bg, 8, o.stroke);
  const t = await txt(parent, x, y, label, o.px || 14, o.weight || 600, o.color);
  t.resized = null;
  await figma.loadFontAsync({ family: FONT, style: styleOf(o.weight || 400) });
  const th = t.height;
  t.x = x + Math.max(0, (w - t.width) / 2 - 4);
  t.y = y + (h - th) / 2;
  if (o.prefix) t.x = x + 14;
  return b;
}

// pill badge text giữa
async function pill(parent, x, y, w, h, bg, fg, label, px) {
  box(parent, x, y, w, h, bg, h / 2);
  const t = await txt(parent, x, y, label, px, 600, fg);
  t.x = x + (w - t.width) / 2;
  t.y = y + (h - t.height) / 2;
}

async function build() {
  const ROOT_W = 1440, HEAD_H = 60, SIDE_W = 240;
  const root = figma.createFrame();
  root.name = "employees";
  root.fills = [{ type: "SOLID", color: hex(C.bg) }];
  root.resize(ROOT_W, 980);
  root.x = Math.round(figma.viewport.center.x - ROOT_W / 2);
  root.y = Math.round(figma.viewport.center.y - 490);
  figma.currentPage.appendChild(root);

  // ===== HEADER =====
  const header = box(root, 0, 0, ROOT_W, HEAD_H, C.card, 0, C.line);
  box(root, 18, 13, 34, 34, C.card, 8, C.line2); // nút gập menu
  for (let i = 0; i < 3; i++) box(root, 26, 20 + i * 8, 18, 2, C.mut, 2);
  box(root, 48, 14, 32, 32, C.brand, 8);
  await txt(root, 48 + 9, 22, "M", 16, 800, "#ffffff");
  await txt(root, 90, 22, "MARIXA", 14, 800, C.ink, { letterSpacing: 8 });
  await txt(root, 160, 25, "Chấm công & quản lý nhân sự", 12.5, 400, C.mut);
  // ngôn ngữ + avatar (phải)
  box(root, ROOT_W - 196, 13, 110, 34, C.card, 8, C.line2);
  await txt(root, ROOT_W - 184, 22, "🌐 Tiếng Việt", 13, 400, C.mut);
  const av = box(root, ROOT_W - 72, 11, 38, 38, C.brandBg, 19);
  await txt(root, ROOT_W - 72 + 12, 19, "N", 15, 700, C.brand);

  // ===== SIDEBAR =====
  box(root, 0, HEAD_H, SIDE_W, 920, C.card, 0, C.line);
  const nav = [
    "Danh sách nhân viên", "Lịch sử & duyệt công", "Thống kê công", "Duyệt nghỉ phép",
    "Bàn giao", "Nghỉ việc", "Báo cáo", "Cấp tài khoản", "Thăng chức",
  ];
  for (let i = 0; i < nav.length; i++) {
    const y = 78 + i * 42;
    if (i === 0) box(root, 12, y, SIDE_W - 24, 36, C.brandBg, 8);
    await txt(root, 24, y + 9, nav[i], 13.5, i === 0 ? 700 : 500, i === 0 ? C.brand : C.ink2);
  }

  // ===== MAIN =====
  const MX = SIDE_W + 26; // 266
  const MW = ROOT_W - SIDE_W - 52; // 1148
  let y = 86;
  await txt(root, MX, y, "Nhân sự", 24, 800, C.ink);
  y += 32;
  await txt(root, MX, y, "Quản lý nhân viên, chấm công, hợp đồng & hồ sơ lương", 13.5, 400, C.mut);
  y += 32; // y=150

  // ===== KPI =====
  const cardW = (MW - 14) / 2;
  const kpis = [
    { icon: "📄", title: "Hợp đồng sắp hết hạn", v: "10", of: "/20", sub: "10 người chưa có hợp đồng / chưa nhập ngày hết hạn", bg: C.warnBg, bd: C.warnBd, vcolor: C.warn },
    { icon: "💰", title: "Hồ sơ đủ để tính lương", v: "10", of: "/20", sub: "trên 20 hồ sơ · 10 hồ sơ còn thiếu", bg: C.okBg, bd: C.okBd, vcolor: C.ok },
  ];
  for (let i = 0; i < 2; i++) {
    const k = kpis[i], x = MX + i * (cardW + 14);
    box(root, x, y, cardW, 92, k.bg, 10, k.bd);
    box(root, x + 18, y + 16, 24, 24, k === kpis[0] ? C.warnBd : C.okBd, 6);
    await txt(root, x + 50, y + 22, k.title, 13, 600, C.ink2);
    const vt = await txt(root, x + cardW - 130, y + 18, k.v, 30, 800, k.vcolor);
    await txt(root, vt.x + vt.width + 4, y + 34, k.of, 15, 600, C.mut);
    await txt(root, x + 18, y + 64, k.sub, 13, 400, C.mut);
  }
  y += 92 + 16; // y=258

  // ===== TABS =====
  await pill(root, MX, y, 210, 36, C.brandBg, C.brand, "Nhân sự đang làm (20)", 14);
  await pill(root, MX + 220, y, 190, 36, C.card, C.mut, "Lưu trữ – đã nghỉ (0)", 14);
  y += 36 + 14; // y=308

  // ===== FILTER BAR =====
  box(root, MX, y, 440, 40, C.card, 8, C.line2);
  await txt(root, MX + 12, y + 12, "🔍 Tìm tên, mã NV, email...", 14, 400, C.mut2);
  const selW = 150;
  ["Phòng ban", "Chức vụ", "Trạng thái"].forEach((s, i) => {
    const x = MX + 450 + i * (selW + 10);
    box(root, x, y, selW, 40, C.card, 8, C.line2);
    txt(root, x + 12, y + 12, s, 14, 400, C.ink);
    txt(root, x + selW - 24, y + 10, "▾", 14, 400, C.mut);
  });
  await btn(root, MX + 450 + 3 * 160, y, 84, 40, "✕ Xóa lọc", { bg: C.card, stroke: C.line2, color: "#182a3a" });
  y += 40 + 10; // y=358

  // ===== NÚT HÀNH ĐỘNG (giữa) =====
  let ax = MX + 10;
  [
    ["⬆ Nhập Excel", 120, false], ["⬇ Tải mẫu", 96, false], ["⬇ Xuất danh sách", 130, false],
  ].forEach(([l, w]) => {
    btn(root, ax, y, w, 40, l, { bg: C.card, stroke: C.line2, color: "#182a3a", prefix: true });
    ax += w + 8;
  });
  const addW = 160;
  btn(root, MX + MW - addW, y, addW, 40, "+ Thêm nhân viên", { bg: C.brand, color: "#ffffff", prefix: true });
  y += 40 + 14; // y=412

  // ===== LEGEND CÒN THIẾU =====
  box(root, MX, y, MW, 44, C.card, 8, "#e5ebf1");
  await txt(root, MX + 12, y + 15, "Còn thiếu:", 12, 700, "#263b50");
  const legend = ["danh tính", "pháp lý", "liên hệ", "điều kiện", "hợp đồng", "lương & chế độ", "bảo hiểm & thuế", "thanh toán"];
  let lx = MX + 100;
  for (let i = 0; i < legend.length; i++) {
    box(root, lx, y + 12, 20, 20, C.chipBg, 10);
    txt(root, lx + 6, y + 15, String(i + 1), 11, 700, C.chipTx);
    const lt = await txt(root, lx + 26, y + 15, legend[i], 12, 400, "#526477");
    lx += 26 + lt.width + 18;
  }
  y += 44 + 10; // y=466

  // ===== BẢNG =====
  const cols = [44, 90, 170, 150, 130, 110, 120, 80, 150, 104]; // = 1148
  const heads = ["", "MÃ NV", "HỌ VÀ TÊN", "PHÒNG BAN", "CHỨC VỤ", "TRẠNG THÁI", "LƯƠNG", "HỒ SƠ", "CÒN THIẾU", ""];
  const tableY = y;
  box(root, MX, tableY, MW, 42 + 5 * 52, C.card, 10, C.line);
  box(root, MX, tableY, MW, 42, C.tblHead, 10);
  let cx = MX;
  heads.forEach((h, i) => {
    if (h) txt(root, cx + 14, tableY + 14, h, 12, 700, C.mut, { letterSpacing: 4 });
    cx += cols[i];
  });
  const rows = [
    ["AD-001", "Nguyễn Hoàng Nam", "Vận hành", "Quản trị viên", "Đang làm", "ok", "15,000,000", "75%", [1, 2], false],
    ["AD-002", "Trần Thị Mai", "Tài chính kế toán", "Quản trị viên", "Đang làm", "ok", "15,000,000", "75%", [1, 2], false],
    ["QL-001", "Phùng Vĩnh Luân", "Vận hành", "Trưởng bộ phận", "Đang làm", "ok", "12,000,000", "100%", [], true],
    ["HR-001", "Lê Anh Khoa", "Nhân sự", "Chuyên viên", "Thử việc", "info", "10,000,000", "62%", [3, 5, 6], false],
    ["NV-003", "Bùi Minh Anh", "Vận hành", "Nhân viên", "Đang làm", "ok", "—", "40%", [1, 4, 6, 8], false],
  ];
  const badge = {
    ok: [C.badgeOk, C.badgeOkTx],
    info: [C.badgeInfoBg, C.badgeInfoTx],
  };
  for (let r = 0; r < rows.length; r++) {
    const [code, name, dept, pos, status, tone, sal, doc, miss, full] = rows[r];
    const ry = tableY + 42 + r * 52;
    if (r > 0) box(root, MX, ry, MW, 1, C.line, 0);
    let x = MX;
    // checkbox
    box(root, x + 14, ry + 18, 16, 16, C.card, 3, C.line2);
    x += cols[0];
    await txt(root, x + 14, ry + 16, code, 14, 600, C.ink2);
    x += cols[1];
    await txt(root, x + 14, ry + 16, name, 14, 500, C.ink);
    x += cols[2];
    await txt(root, x + 14, ry + 16, dept, 14, 400, "#182a3a");
    x += cols[3];
    await txt(root, x + 14, ry + 16, pos, 14, 400, "#182a3a");
    x += cols[4];
    await pill(root, x + 14, ry + 14, 84, 24, badge[tone][0], badge[tone][1], status, 12);
    x += cols[5];
    await txt(root, x + 14, ry + 16, sal, 14, 400, C.ink);
    x += cols[6];
    await txt(root, x + 14, ry + 16, doc, 13, 700, full ? C.green : C.mut);
    x += cols[7];
    let mx2 = x + 14;
    if (full) {
      await txt(root, mx2, ry + 16, "Đủ", 12, 600, C.green);
    } else {
      for (const m of miss) {
        box(root, mx2, ry + 14, 20, 20, C.missBg, 10);
        txt(root, mx2 + 6, ry + 17, String(m), 11, 700, C.missTx);
        mx2 += 24;
      }
    }
    x += cols[8];
    await btn(root, x + 14, ry + 11, 48, 30, "Xem", { bg: C.card, stroke: "#d1dbe5", color: "#19334a", px: 12 });
    await btn(root, x + 70, ry + 11, 48, 30, "Sửa", { bg: C.card, stroke: "#d1dbe5", color: "#19334a", px: 12 });
  }
  y = tableY + 42 + 5 * 52 + 16; // y=910

  // ===== PAGINATION =====
  await btn(root, MX, y, 34, 34, "←", { bg: C.card, stroke: C.line2, color: "#182a3a", weight: 400 });
  let px2 = MX + 42;
  ["1", "2", "3", "4", "5"].forEach((n, i) => {
    if (i === 0) btn(root, px2, y, 32, 34, "1", { bg: C.brand, color: "#ffffff", weight: 700 });
    else btn(root, px2, y, 32, 34, n, { bg: C.card, stroke: C.line2, color: "#182a3a" });
    px2 += 38;
  });
  txt(root, px2, y + 10, "…", 14, 400, C.mut2);
  px2 += 26;
  btn(root, px2, y, 34, 34, "62", { bg: C.card, stroke: C.line2, color: "#182a3a" });
  await btn(root, px2 + 42, y, 34, 34, "→", { bg: C.card, stroke: C.line2, color: "#182a3a", weight: 400 });
  await txt(root, MX + MW - 150, y + 10, "1–20 / 1.248 nhân viên", 13, 400, C.mut);

  // ===== hoàn tất =====
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomToFit();
  figma.closePlugin("✓ Đã vẽ frame 'employees' (layer chỉnh được). Chỉnh xong gửi link Figma lại nhé.");
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "run") {
    try {
      await build();
    } catch (e) {
      figma.closePlugin("Lỗi: " + (e.message || e));
    }
  }
};
