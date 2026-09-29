// Reproduce axios instance behavior without a server.
// Captures what axios transforms the FormData body + Content-Type header into.
const axios = await import("file:///D:/Monica/M-ChamCong/ChamCong/node_modules/axios/index.js");

function makeInstance() {
  return axios.default.create({
    baseURL: "https://localhost:7038/api",
    headers: { "Content-Type": "application/json" },
  });
}

async function capture(instance, label, cfg) {
  let report;
  instance.defaults.adapter = function (config) {
    const ct = config.headers
      ? (typeof config.headers.get === "function"
          ? config.headers.get("Content-Type")
          : config.headers["Content-Type"])
      : null;
    const body = config.data;
    const bodyType = body ? body.constructor ? body.constructor.name : typeof body : "(none)";
    report = {
      bodyType,
      bodyPreview: typeof body === "string" ? body.slice(0, 100) : "(not string)",
      ct: String(ct),
      ok: bodyType === "FormData" && !String(ct || "").includes("application/json"),
    };
    return Promise.reject(new Error("captured"));
  };
  const fd = new FormData();
  fd.append("file", new Blob([new ArrayBuffer(16)], { type: "image/jpeg" }), "a.jpg");
  try {
    await instance.post("/Upload/photo?type=checkin", fd, cfg || {});
  } catch (_) { /* captured */ }
  console.log(`[${label}] body=${report.bodyType} ct=${JSON.stringify(report.ct)} -> multipart-OK? ${report.ok}`);
  return report;
}

(async () => {
  // Current: no override -> axios JSON-encodes FormData (BAD)
  await capture(makeInstance(), "A. current (no override)");
  // Override Content-Type undefined -> keeps FormData, CT undefined (browser sets boundary) -> GOOD
  await capture(makeInstance(), "B. CT=undefined", { headers: { "Content-Type": undefined } });
  // Belt-and-braces: identity transformRequest + CT undefined
  await capture(makeInstance(), "C. identity transform + CT=undefined", {
    headers: { "Content-Type": undefined },
    transformRequest: [(d) => d],
  });
})();
