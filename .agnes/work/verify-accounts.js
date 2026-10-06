const fs = require('fs');
const c = fs.readFileSync('D:/Monica/M-ChamCong/ChamCong/src/modules/employees/accounts/pages/AccountIssuancePage.jsx', 'utf8');
const tests = [
  'import { localeForLanguage, translate, useLanguage }',
  'const L = useCallback((text) => translate(text, language), [language]);',
  '{L("Xuất Excel")}',
  '{L("Cấp mã")}',
  '{L(label)}',
  '{L(state.label)}',
  'title={L("Cấp tài khoản")}',
  'd(verificationEmployee.birthDate)',
  '{L("Chưa cập nhật")}',
  '{L("✓ Xác minh & kích hoạt")}',
  '{L("Hủy")}',
  '{L("1. Tổng quan")}',
];
tests.forEach((t) => console.log((c.includes(t) ? 'OK  ' : 'MISS') + ': ' + t));
