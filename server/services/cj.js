/* CJ Dropshipping adapter (API V2.0).
   CJ does not accept the API key directly on business calls: exchange CJ_API_KEY
   for an access token, then send that token in the CJ-Access-Token header.
   Real orders need real CJ variant SKUs in js/config.js and a real logistic
   name in server/.env. Without a key this stays in demo mode. */
const axios = require("axios");

const BASE = (process.env.CJ_API_BASE || "https://developers.cjdropshipping.com").replace(/\/$/, "");
const TOKEN_PATH = "/api2.0/v1/authentication/getAccessToken";
const REFRESH_PATH = "/api2.0/v1/authentication/refreshAccessToken";
const CREATE_PATH = process.env.CJ_ORDER_ENDPOINT || "/api2.0/v1/shopping/order/createOrderV3";
const DETAIL_PATH = process.env.CJ_ORDER_STATUS_ENDPOINT || "/api2.0/v1/shopping/order/getOrderDetail";
// When CJ_API_BASE points at our Cloudflare relay, this header authenticates
// the relay. It is ignored when calling CJ directly.
const RELAY_SECRET = process.env.CJ_RELAY_SECRET || "";
const relayHeaders = () => (RELAY_SECRET ? { "x-relay-secret": RELAY_SECRET } : {});

let tokenCache = null;

// CJ allows 1 request/second. Pace every call and retry throttling/transient
// errors so a paid order never falls back to demo because of a 429.
let lastCallAt = 0;
const MIN_INTERVAL_MS = 1300;

async function pacedRequest(work) {
  const wait = Math.max(0, lastCallAt + MIN_INTERVAL_MS - Date.now());
  if (wait) await new Promise((r) => setTimeout(r, wait));
  lastCallAt = Date.now();
  const delays = [2000, 5000, 10000, 20000, 40000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await work();
    } catch (err) {
      const status = err.response && err.response.status;
      const retryable = status === 429 || (status >= 500 && status < 600);
      if (!retryable || attempt === delays.length) {
        const url = err.config && err.config.url ? " " + err.config.url.replace(BASE, "") : "";
        const detail = err.response && err.response.data
          ? " " + JSON.stringify(err.response.data).slice(0, 300)
          : "";
        err.message = "CJ HTTP " + status + url + ": " + err.message + detail;
        throw err;
      }
      const header = err.response.headers && err.response.headers["retry-after"];
      // Shared cloud egress IPs can stay throttled for a while; back off hard.
      const delay = Math.max(delays[attempt], Number(header) > 0 ? Number(header) * 1000 : 0);
      await new Promise((r) => setTimeout(r, delay));
      lastCallAt = Date.now();
    }
  }
}

function ok(body) {
  return body && (body.code === 200 || body.code === 0) && body.result !== false;
}

async function fetchToken(body, label) {
  const res = await pacedRequest(() => axios.post(BASE + (label === "refresh" ? REFRESH_PATH : TOKEN_PATH), body, {
    headers: { "Content-Type": "application/json", ...relayHeaders() },
    timeout: 20000
  }));
  const data = res.data;
  if (!ok(data) || !data.data || !data.data.accessToken) {
    throw new Error("CJ token " + label + " failed: " + (data && data.message ? data.message : "no access token"));
  }
  tokenCache = {
    token: data.data.accessToken,
    refreshToken: data.data.refreshToken || null,
    // Refresh well before CJ's 180-day expiry; shorter is safer after a restart.
    expiresAt: Date.now() + 23 * 60 * 60 * 1000
  };
  return tokenCache.token;
}

async function accessToken() {
  if (!process.env.CJ_API_KEY) throw new Error("CJ_API_KEY is not set");
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.token;
  return fetchToken({ apiKey: process.env.CJ_API_KEY }, "issue");
}

async function refreshToken() {
  if (!tokenCache || !tokenCache.refreshToken) return accessToken();
  return fetchToken({ refreshToken: tokenCache.refreshToken }, "refresh");
}

async function callCj(method, path, payload, params, retried) {
  const token = await accessToken();
  const res = await pacedRequest(() => axios({
    method,
    url: BASE + path,
    ...(payload ? { data: payload } : {}),
    ...(params ? { params } : {}),
    headers: {
      "CJ-Access-Token": token,
      // CJ requires this header on order endpoints; empty is valid when unused.
      platformToken: process.env.CJ_PLATFORM_TOKEN || "",
      "Content-Type": "application/json",
      ...relayHeaders()
    },
    timeout: 20000
  }));
  const body = res.data;
  if (body && body.code === 1600001 && !retried) {
    await refreshToken();
    return callCj(method, path, payload, params, true);
  }
  if (!ok(body)) {
    throw new Error((body && body.message ? body.message : "CJ request failed") + " (code " + (body && body.code) + ")");
  }
  return body;
}

function demo(id, message) {
  return { demo: true, id, message };
}

async function createSupplierOrder(order) {
  if (!process.env.CJ_API_KEY) {
    return demo(
      "CJ-DEMO-" + order.id.slice(-6),
      "CJ_API_KEY is not set. Supplier order was simulated. Add your key to server/.env to send real orders."
    );
  }

  const logisticName = (process.env.CJ_LOGISTIC_NAME || "").trim();
  if (!logisticName) {
    return demo(
      "CJ-SETUP-" + order.id.slice(-6),
      "CJ_LOGISTIC_NAME is not set in server/.env. Get a real name from CJ's freight-calculate API or your CJ account before live orders."
    );
  }

  const preview = (order.items || []).find((item) => item && item.podPending);
  if (preview) {
    return demo(
      "CJ-SETUP-" + order.id.slice(-6),
      "Product " + preview.id + " is a design preview (podPending). Confirm it on WhatsApp; no paid CJ order is created."
    );
  }

  const badSku = (order.items || []).find(
    (item) =>
      !(item.vid && String(item.vid).trim()) ||
      !(item.sku && item.sku.trim())
  );
  if (badSku) {
    return demo(
      "CJ-SETUP-" + order.id.slice(-6),
      "Product " + badSku.id + " has no complete CJ variant. Both SKU and VID must be set in js/config.js."
    );
  }
  const placeholders = (order.items || []).filter(
    (item) => (item.sku || "").trim().startsWith("VTX-") && !(item.vid && String(item.vid).trim())
  );
  if (placeholders.length) {
    return demo(
      "CJ-SETUP-" + order.id.slice(-6),
      "Products still using placeholder SKUs: " + placeholders.map((i) => i.id).join(", ") + ". Set real CJ SKUs/VIDs in js/config.js."
    );
  }

  const remarks = [
    "BAGGI order " + order.id,
    ...(order.items || []).map((i) => i.notes).filter(Boolean)
  ].join(" | ").slice(0, 500);

  // CJ accepts only numbers, symbols and spaces in the postcode. Strip letters
  // so a typo cannot block a paid order; fall back to a Lagos code if absent.
  const rawZip = (order.customer && (order.customer.postcode || order.customer.zip)) || "";
  const shippingZip = String(rawZip).replace(/[A-Za-z]/g, "").trim() || "100001";

  const payload = {
    orderNumber: order.id,
    shippingZip,
    shippingCountryCode: "NG",
    shippingCountry: "Nigeria",
    shippingProvince: (order.customer && order.customer.state) || (order.customer && order.customer.city) || "Lagos",
    shippingCity: (order.customer && order.customer.city) || "Lagos",
    shippingAddress: (order.customer && order.customer.address) || "",
    shippingCustomerName: (order.customer && order.customer.name) || "",
    shippingPhone: (order.customer && order.customer.phone) || "",
    email: (order.customer && order.customer.email) || "",
    remark: remarks,
    logisticName,
    fromCountryCode: process.env.CJ_FROM_COUNTRY_CODE || "CN",
    shopLogisticsType: 2,
    orderFlow: 1,
    // 3 = create order only (no payment). Use 2 only after funding your CJ balance.
    payType: Number(process.env.CJ_PAY_TYPE || 3),
    isSandbox: Number(process.env.CJ_SANDBOX || 1),
    products: (order.items || []).map((item) => {
      const line = {
        quantity: Number(item.qty) || 1,
        storeLineItemId: item.id,
        variantOptions: [item.variant, item.size].filter(Boolean).join("-").slice(0, 200)
      };
      if (item.vid && String(item.vid).trim()) line.vid = String(item.vid).trim();
      if (item.sku && item.sku.trim()) line.sku = item.sku.trim();
      return line;
    })
  };

  try {
    const body = await callCj("post", CREATE_PATH, payload);
    const data = body.data || {};
    const id = data.orderId || data.orderNumber || "CJ-" + order.id;
    const intercepted = data.interceptOrderReasons || [];
    if (intercepted.length) {
      return {
        demo: true,
        id,
        message: "CJ created the order but flagged it: " + intercepted.map((r) => r.message || r.code).join(", ")
      };
    }
    return { demo: false, id, raw: data };
  } catch (err) {
    return demo("CJ-ERROR-" + order.id.slice(-6), "CJ API call failed: " + err.message);
  }
}

async function getSupplierOrderStatus(supplierOrderId) {
  if (!process.env.CJ_API_KEY) return { demo: true, status: "demo" };
  try {
    const body = await callCj("get", DETAIL_PATH, null, { orderId: supplierOrderId });
    return { demo: false, data: body.data || body };
  } catch (err) {
    return { demo: true, status: "error", message: err.message };
  }
}

module.exports = { createSupplierOrder, getSupplierOrderStatus };
