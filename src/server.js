const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const paymentService = require("./paymentService");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "..", "public");

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filename, contentType) {
  const filePath = path.join(PUBLIC_DIR, filename);
  const body = fs.readFileSync(filePath);
  res.writeHead(200, { "content-type": contentType });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("payload-too-large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("invalid-json"));
      }
    });
  });
}

async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/") {
    return sendFile(res, "index.html", "text/html; charset=utf-8");
  }

  if (req.method === "GET" && url.pathname === "/app.js") {
    return sendFile(res, "app.js", "application/javascript; charset=utf-8");
  }

  if (req.method === "POST" && url.pathname === "/api/payments") {
    try {
      const body = await readJson(req);
      const payment = paymentService.createPayment(body);
      return sendJson(res, 201, payment);
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  const paymentMatch = url.pathname.match(/^\/api\/payments\/([^/]+)$/);
  if (req.method === "GET" && paymentMatch) {
    const payment = paymentService.getPayment(paymentMatch[1]);
    if (!payment) return sendJson(res, 404, { error: "not-found" });
    return sendJson(res, 200, payment);
  }

  const retryMatch = url.pathname.match(/^\/api\/payments\/([^/]+)\/retry$/);
  if (req.method === "POST" && retryMatch) {
    const result = paymentService.retryPayment(retryMatch[1]);
    if (!result) return sendJson(res, 404, { error: "not-found" });
    return sendJson(res, result.allowed ? 200 : 409, result);
  }

  return sendJson(res, 404, { error: "not-found" });
}

if (require.main === module) {
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`Payment retry proof running at http://localhost:${PORT}`);
  });
}

module.exports = { handler };
