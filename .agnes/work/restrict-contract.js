const fs = require('fs');

// 1. Add missing phrase to dict
const lpFile = 'D:/Monica/M-ChamCong/ChamCong/src/services/i18n/LanguageProvider.jsx';
let lp = fs.readFileSync(lpFile, 'utf8');
const nl = lp.includes('\r\n') ? '\r\n' : '\n';
const existing = new Set();
lp.split('\n').forEach((l) => { const m = l.match(/^\s*"(.+?)"\s*:\s*\[/); if (m) existing.add(m[1]); });
const add = [
  ["Nhân viên có hợp đồng đang hiệu lực không được tạo hợp đồng mới.", "Employees with an active contract cannot create a new one.", "员工有有效合同，无法创建新合同。"],
  ["Nhân viên hợp lệ (chưa có hợp đồng hoặc hợp đồng đã hết hạn).", "Eligible employees (no contract or contract expired).", "符合条件的员工（无合同或合同已过期）。"],
];
const toAdd = add.filter(([vi]) => !existing.has(vi));
if (toAdd.length) {
  const block = toAdd.map(([vi, en, zh]) => `    "${vi}": ["${en}", "${zh}"],`).join(nl);
  const start = lp.indexOf('const phrases = {');
  let close = lp.indexOf('\n};', start);
  if (close === -1) close = lp.indexOf('\n};\n', start);
  const at = close + 1;
  lp = lp.substring(0, at) + block + nl + lp.substring(at);
  fs.writeFileSync(lpFile, lp, 'utf8');
  console.log('Added ' + toAdd.length + ' phrases');
}

// 2. Fix AdminContractPage: restrict employee dropdown + add note
const f = 'D:/Monica/M-ChamCong/ChamCong/src/modules/admin/contracts/pages/AdminContractPage.jsx';
let c = fs.readFileSync(f, 'utf8');
const fNL = c.includes('\r\n') ? '\r\n' : '\n';
let applied = 0;

// 2a. Change the filter: exclude signed/expiring (valid contract)
// Only eligible when state is "none" (chưa lập) or "expired" (hết hạn).
// signed / expiring / pending => already has an active contract -> blocked.
const oldFilter = '{employees' + fNL +
  '                                                .filter((e) =>' + fNL +
  '                                                    [1, 2, 3].includes(' + fNL +
  '                                                        e.status' + fNL +
  '                                                    )' + fNL +
  '                                                )';
const newFilter = '{employees' + fNL +
  '                                                .filter((e) =>' + fNL +
  '                                                    [1, 2, 3].includes(e.status) &&' + fNL +
  '                                                    ["none", "expired"].includes(stateMap[e.id])' + fNL +
  '                                                )';
if (c.includes(oldFilter)) { c = c.replace(oldFilter, newFilter); applied++; }
else {
  const oldSimple = '.filter((e) =>' + fNL + '                                                    [1, 2, 3].includes(' + fNL + '                                                        e.status' + fNL + '                                                    )';
  if (c.includes(oldSimple)) {
    c = c.replace(oldSimple, '.filter((e) =>' + fNL + '                                                    [1, 2, 3].includes(e.status) &&' + fNL + '                                                    ["none", "expired"].includes(stateMap[e.id])');
    applied++;
  } else {
    console.log('WARN: filter pattern not matched');
  }
}

// 2b. Add a note below the select explaining the restriction
const oldLabelEnd = '</select>' + fNL + '                                    </label>';
const newLabelEnd = '</select>' + fNL +
  '                                        <small className="att-muted">' + fNL +
  '                                            {L("Nhân viên có hợp đồng đang hiệu lực không được tạo hợp đồng mới.")}' + fNL +
  '                                        </small>' + fNL +
  '                                    </label>';
if (c.includes(oldLabelEnd)) { c = c.replace(oldLabelEnd, newLabelEnd); applied++; }

fs.writeFileSync(f, c, 'utf8');
console.log('AdminContractPage: ' + applied + ' changes applied');
