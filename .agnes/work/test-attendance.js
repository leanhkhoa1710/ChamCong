const fs = require('fs');
const https = require('https');
const http = require('http');

const token = fs.readFileSync('D:/Monica/M-ChamCong/.agnes/work/token.txt', 'utf8').trim();
const tests = [
  'http://127.0.0.1:5022/api/Attendance/get-all',
  'http://127.0.0.1:5022/api/AttendanceLog/get-all',
  'http://127.0.0.1:5022/api/Attendance/by-employee/c0000000-0000-0000-0000-000000000001',
  'http://127.0.0.1:5022/api/AttendanceRule/get-all',
];

function req(url) {
  return new Promise((resolve) => {
    const r = http.get(url, { headers: { Authorization: 'Bearer ' + token } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ url, status: res.statusCode, body: data.substring(0, 400) }));
    });
    r.on('error', (e) => resolve({ url, status: 'ERR', body: e.message }));
  });
}

(async () => {
  for (const u of tests) {
    const r = await req(u);
    console.log(r.status, r.url.replace('http://localhost:5022/', ''));
    if (r.status !== 200) console.log('   BODY:', r.body);
  }
})();
