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

let tokenCache = null;

function ok(body) {
  return body && (body.code === 200 || body.code === 0) && body.result !== false;
}

async function fetchToken(body, label) {
  const res = await axios.post(BASE + (label === "refresh" ? REFRESH_PATH : TOKEN_PATH), body, {
    headers: { "Content-Type": "application/json" },
    timeout: 20000
  });
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
  const res = await axios({
    method,
    url: BASE + path,
    ...(payload ? { data: payload } : {}),
    ...(params ? { params } : {}),
    headers: {
      "CJ-Access-Token": token,
      // CJ requires this header on order endpoints; empty is valid when unused.
      platformToken: process.env.CJ_PLATFORM_TOKEN || "",
      "Content-Type": "application/json"
    },
    timeout: 20000
  });
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

  const badSku = (order.items || []).find(
    (item) => !(item.vid && String(item.vid).trim()) && !(item.sku && item.sku.trim())
  );
  if (badSku) {
    return demo(
      "CJ-SETUP-" + order.id.slice(-6),
      "Product " + badSku.id + " has no real CJ variant. Replace the placeholder SKUs in js/config.js with real CJ SKUs or VIDs."
    );
  }
  const placeholders = (order.items || []).filter(
    (item) => (item.sku || "").trim().startsWith("BAG-") && !(item.vid && String(item.vid).trim())
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

  const payload = {
    orderNumber: order.id,
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
