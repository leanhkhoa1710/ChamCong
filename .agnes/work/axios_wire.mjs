// Definitive test: start a local HTTP server, POST a FormData through the
// SAME axios instance shape the app uses, and record what actually arrives.
const http = await import("http");

const server = http.createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    const ct = req.headers["content-type"] || "";
    const hasBoundary = /multipart\/form-data; boundary=/i.test(ct);
    // a real multipart body contains the boundary string
    const looksMultipart = raw.includes("file") && ct.toLowerCase().includes("multipart/form-data");
    console.log(
      "  ARRIVED  content-type:",
      ct,
    );
    console.log(
      "  body head           :",
      JSON.stringify(raw.slice(0, 90)),
    );
    console.log(
      "  boundary present?   :",
      hasBoundary,
      "| multipart+file?     :",
      looksMultipart,
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: looksMultipart }));
  });
});

await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const axios = await import("file:///D:/Monica/M-ChamCong/ChamCong/node_modules/axios/index.js");
const base = `http://127.0.0.1:${port}`;

// Mirror the app's axiosClient: instance default Content-Type application/json
const makeClient = () =>
  axios.default.create({
    baseURL: base + "/api",
    headers: { "Content-Type": "application/json" },
  });

async function attempt(label, cfg) {
  console.log("\n[" + label + "]");
  const inst = makeClient();
  const fd = new FormData();
  // ~2KB jpeg-ish blob
  const fdummy = new Uint8Array(2048).fill(7);
  fd.append("file", new Blob([fdummy], { type: "image/jpeg" }), "shot.jpg");
  try {
    const resp = await inst.post("/Upload/photo?type=checkin", fd, cfg || {});
    console.log("  response ok:", resp.data.ok);
  } catch (e) {
    console.log("  request error:", e.message, "| ct:", e.config?.headers?.get?.("Content-Type"));
  }
}

// A) current production code path (no override) -> expect JSON body (BAD)
await attempt("A. no override (current relatedApi)", {});
// B) override Content-Type undefined -> browser sets multipart boundary (GOOD)
await attempt("B. { Content-Type: undefined }", { headers: { "Content-Type": undefined } });
// C) override explicit multipart/form-data (no boundary) -> often BAD in browser
await attempt("C. { 'Content-Type': 'multipart/form-data' }", {
  headers: { "Content-Type": "multipart/form-data" },
});

server.close();
