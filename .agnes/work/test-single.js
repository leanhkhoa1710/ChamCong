const fs = require('fs');
const http = require('http');

const token = fs.readFileSync('D:/Monica/M-ChamCong/.agnes/work/token.txt', 'utf8').trim();
const url = 'http://127.0.0.1:5022/api/Attendance/get-all';

const req = http.request(url, { headers: { Authorization: 'Bearer ' + token } }, (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', JSON.stringify(res.headers));
    console.log('BODY:', data.substring(0, 600));
  });
});
req.on('error', (e) => console.log('REQ ERROR:', e.code, e.message));
req.setTimeout(8000, () => {
  console.log('TIMEOUT');
  req.destroy();
});
req.end();
