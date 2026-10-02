const crypto = require("crypto");
const b64url = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const SECRET = "ThisIsASecretKeyWithAtLeast32Characters!";
const claims = {
  iss: "API",
  aud: "APIUser",
  sub: "B0000000-0000-0000-0000-000000000009",
  email: "sample.tai@marixa.local",
  name: "0947733609",
  jti: crypto.randomUUID(),
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
  employeeId: "C0000000-0000-0000-0000-000000000009",
  employeeCode: "MANAGER-001",
  fullName: "Sample Tai",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": ["Employee"],
};
const header = { alg: "HS256", typ: "JWT" };
const payload = b64url(header) + "." + b64url(claims);
const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
process.stdout.write(payload + "." + sig);
