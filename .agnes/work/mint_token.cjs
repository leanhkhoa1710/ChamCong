// Mint a valid HS256 JWT matching M.API JwtGenerator config, to test the
// upload pipeline without needing the seed password.
const crypto = require("crypto");
const b64url = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");

const SECRET = "ThisIsASecretKeyWithAtLeast32Characters!"; // JwtSettings:Key (appsettings.json)
const now = Math.floor(Date.now() / 1000);
const claims = {
  iss: "API",
  aud: "APIUser",
  sub: "C0000000-0000-0000-0000-000000000001", // user id (Employee)
  email: "sample.tai@marixa.local",
  name: "0947733609",
  jti: crypto.randomUUID(),
  iat: now,
  exp: now + 3600,
};
const header = { alg: "HS256", typ: "JWT" };
const payload = b64url(header) + "." + b64url(claims);
const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
process.stdout.write(payload + "." + sig);
