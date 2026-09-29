// Reproduce the axios instance behavior WITHOUT starting the server.
// We intercept the XHR adapter to capture what axios would actually send.
const axios = require("D:/Monica/M-ChamCong/ChamCong/node_modules/axios/index.js");

function makeInstance() {
  return axios.create({
    baseURL: "https://localhost:7038/api",
    headers: { "Content-Type": "application/json" },
  });
}

function capture(instance, label, cfg) {
  // Replace adapter to capture config after axios transforms data/headers.
  instance.defaults.adapter = function (config) {
    const ct = (config.headers && config.headers["Content-Type"]) ||
               (config.headers && config.headers.get && config.headers.get("Content-Type")) || "?";
    const dataType = config.data ? (config.data.constructor ? config.data.constructor.name : typeof config.data) : "(none)";
    console.log(`\n[${label}]`);
    console.log("  body type :", dataType);
    console.log("  body      :", typeof config.data === "string" ? config.data.slice(0, 120) : "(not string - likely FormData, good)");
    console.log("  CT header :", JSON.stringify(ct));
    const ok = dataType === "FormData" && !String(ct || "").includes("application/json");
    console.log("  => multipart-OK ?", ok);
    return Promise.reject(new Error("captured"));
  };
  const form = new (require("buffer").Blob ? globalThis.FormData || require("undici").FormData : Object)();
  // In Node, FormData from undici/globalex
  const F = globalThis.FormData;
  const fd = new F();
  fd.append("file", new globalThis.Blob([Buffer.from("x".repeat(10))], { type: "image/jpeg" }), "a.jpg");
  return instance.post("/Upload/photo?type=checkin", fd, cfg || {}).catch(() => {});
}

(async () => {
  // Approach 1: current new code (no header override) -> expect axios JSON-encodes (BAD)
  await capture(makeInstance(), "no override (current relatedApi)");
  // Approach 2: explicit Content-Type undefined
  await capture(makeInstance(), "headers:{'Content-Type':undefined}", { headers: { "Content-Type": undefined } });
  // Approach 3: transformRequest identity + CT undefined
  await capture(makeInstance(), "transformRequest identity + CT undefined", {
    headers: { "Content-Type": undefined },
    transformRequest: [(d) => d],
  });
})();
