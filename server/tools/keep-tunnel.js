/* Keeps a Cloudflare Quick Tunnel alive and keeps Paystack pointed at it.
 *
 *   node server/tools/keep-tunnel.js
 *
 * Quick Tunnels get a new random URL each time they restart. This wrapper
 * notices the new URL, writes it to server/data/tunnel-url.txt, and re-points
 * the Paystack webhook so paid orders keep reaching the API.
 *
 * Overrides: CLOUDFLARED_PATH, LOCAL_API (default http://127.0.0.1:3001)
 */
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env")
});

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const CANDIDATES = [
  path.join(ROOT, "tools", "cloudflared.exe"),
  path.join(ROOT, "..", "tools", "cloudflared.exe")
];
const BIN = process.env.CLOUDFLARED_PATH ||
  CANDIDATES.find((p) => fs.existsSync(p)) || CANDIDATES[0];
const LOCAL_API = process.env.LOCAL_API || "http://127.0.0.1:3001";
const URL_FILE = path.join(__dirname, "..", "data", "tunnel-url.txt");
const ERR_LOG = path.join(require("os").tmpdir(), "vortex-tunnel.err");
const WEBHOOKS = "https://api.paystack.co/integration/webhooks/endpoints";

let currentUrl = "";

function log(msg) {
  console.log("[" + new Date().toISOString() + "] " + msg);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pointWebhook(url) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return log("No PAYSTACK_SECRET_KEY - webhook not updated");
  const headers = { Authorization: "Bearer " + secret, "Content-Type": "application/json" };

  // A brand-new trycloudflare host may not resolve for Paystack yet. Retry.
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const list = await fetch(WEBHOOKS, { headers }).then((r) => r.json());
      if (!list.status) throw new Error(list.message || "list failed");
      const found = (list.data || []).find(
        (w) => (w.webhook_url || "").includes("/webhooks/paystack")
      );
      const body = JSON.stringify({
        name: "Vortex order fulfillment",
        url: url.replace(/\/$/, "") + "/webhooks/paystack",
        events: ["charge.success"]
      });
      const endpoint = found ? WEBHOOKS + "/" + found.webhook_url_code : WEBHOOKS;
      const res = await fetch(endpoint, {
        method: found ? "PATCH" : "POST",
        headers,
        body
      });
      const out = await res.json();
      if (!out.status) throw new Error(out.message || "save failed");
      log("Paystack webhook -> " + (out.data.webhook_url || url));
      return;
    } catch (e) {
      log("Webhook attempt " + attempt + "/6 failed: " + e.message);
      if (attempt < 6) await sleep(10000);
    }
  }
  log("Webhook NOT updated for " + url + " - check manually");
}

function run() {
  log("Starting cloudflared tunnel to " + LOCAL_API);
  const child = spawn(BIN, ["tunnel", "--url", LOCAL_API], {
    windowsHide: true,
    stdio: ["ignore", "ignore", "pipe"]
  });

  const errStream = fs.createWriteStream(ERR_LOG, { flags: "a" });
  let buffer = "";
  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    errStream.write(text);
    buffer += text;
    const match = buffer.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (match && match[0] !== currentUrl) {
      currentUrl = match[0];
      fs.mkdirSync(path.dirname(URL_FILE), { recursive: true });
      fs.writeFileSync(URL_FILE, currentUrl + "\n");
      log("Tunnel URL: " + currentUrl);
      pointWebhook(currentUrl);
    }
    if (buffer.length > 20000) buffer = buffer.slice(-4000);
  });

  child.on("error", (e) => log("cloudflared error: " + e.message));
  child.on("exit", (code) => {
    errStream.end();
    log("cloudflared exited (" + code + ") - restarting in 5s");
    setTimeout(run, 5000);
  });
}

if (!fs.existsSync(BIN)) {
  console.error("cloudflared not found at " + BIN);
  process.exit(1);
}
run();
