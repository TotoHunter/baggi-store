/* Register or update the Paystack webhook to your public backend URL.
   Usage:
     node server/tools/set-webhook-url.js https://your-app.onrender.com
   Or set PUBLIC_URL in the environment. Reads PAYSTACK_SECRET_KEY from server/.env. */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const baseUrl = (process.argv[2] || process.env.PUBLIC_URL || "").replace(/\/+$/, "");
if (!/^https:\/\//i.test(baseUrl)) {
  console.error("Provide a public HTTPS URL, e.g. node set-webhook-url.js https://your-app.onrender.com");
  process.exit(1);
}
const secret = process.env.PAYSTACK_SECRET_KEY;
if (!secret) {
  console.error("PAYSTACK_SECRET_KEY is not set in server/.env");
  process.exit(1);
}
const webhookUrl = baseUrl + "/webhooks/paystack";
const headers = {
  Authorization: "Bearer " + secret,
  "Content-Type": "application/json"
};
const API = "https://api.paystack.co/integration/webhooks/endpoints";

async function main() {
  const list = await fetch(API, { headers }).then((r) => r.json());
  if (!list.status) throw new Error(list.message || "Could not list webhook endpoints");
  const existing = (list.data || []).find(
    (w) => (w.webhook_url || "").includes("/webhooks/paystack")
  );
  const body = JSON.stringify({
    name: "BAGGI order fulfillment",
    url: webhookUrl,
    events: ["charge.success"]
  });
  const res = existing
    ? await fetch(API + "/" + existing.webhook_url_code, { method: "PATCH", headers, body })
    : await fetch(API, { method: "POST", headers, body });
  const text = await res.text();
  let out;
  try { out = JSON.parse(text); } catch { throw new Error("Unexpected response: " + text.slice(0, 200)); }
  if (!out.status) throw new Error(out.message || "Could not save webhook");
  const d = out.data || {};
  console.log((existing ? "Updated" : "Created") + " Paystack webhook:", d.webhook_url_code || "(unknown)");
  console.log("URL:", d.webhook_url || webhookUrl);
  console.log("Events:", (d.events || []).join(", "));
}

main().catch((e) => {
  console.error("Webhook setup failed:", e.message);
  process.exit(1);
});
