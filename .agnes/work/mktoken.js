const crypto = require('crypto');
const fs = require('fs');
function b64(d) { return Buffer.from(d).toString('base64').replace(/=/g, ''); }
const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const now = Math.floor(Date.now() / 1000);
const payload = b64(JSON.stringify({
  sub: 'b0000000-0000-0000-0000-000000000001',
  employeeId: 'c0000000-0000-0000-0000-000000000001',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': '0900000001',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': 'Admin',
  iss: 'API', aud: 'APIUser', exp: now + 7200,
}));
const sig = crypto.createHmac('sha256', 'ThisIsASecretKeyWithAtLeast32Characters!')
  .update(head + '.' + payload).digest('base64').replace(/=/g, '');
const token = head + '.' + payload + '.' + sig;
fs.writeFileSync('D:/Monica/M-ChamCong/.agnes/work/token.txt', token);
console.log('PARTS:', [head, payload, sig].map(x => x.length).join(','), 'FULL:', token.length);
