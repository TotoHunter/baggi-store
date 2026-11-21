/* BAGGI store server — checkout, payment webhooks, supplier automation. */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const payments = require("./services/payments");
const cj = require("./services/cj");
const vm = require("vm");

/* Load the same config.js the browser uses, so the server can price orders
   authoritatively instead of trusting an amount sent by the client. */
function loadCatalog() {
  try {
    const code = fs.readFileSync(path.join(__dirname, "..", "js", "config.js"), "utf8");
    const sandbox = { window: {} };
    vm.runInNewContext(code, sandbox, { timeout: 1000 });
    return sandbox.window.BAGGI_CONFIG || null;
  } catch (e) {
    console.error("Could not load product catalog:", e.message);
    return null;
  }
}
const CATALOG = loadCatalog();
const PRODUCTS = new Map(
  CATALOG && Array.isArray(CATALOG.products)
    ? CATALOG.products.map((p) => [p.id, p])
    : []
);

/* Fill in supplier identifiers and pricing from the catalog, ignoring any
   values supplied by the browser. Sizes map to their own CJ variant. */
function enrichItems(items) {
  if (!PRODUCTS.size) return null;
  return items.map((item) => {
    const product = PRODUCTS.get(item.id);
    if (!product) return null; // unknown product — never trust a made-up price
    const supplier = product.supplier || {};
    const sized = supplier.sizes && item.size ? supplier.sizes[item.size] : null;
    return {
      ...item,
      name: product.name,
      variant: product.variant,
      sku: sized ? sized.sku : supplier.sku || "",
      vid: sized ? sized.vid : supplier.vid || "",
      supplierCostCny: Number(supplier.costCny) || 0
    };
  });
}

/* Recalculate the payable total from real product prices + CJ delivery. */
function priceOrder(items) {
  if (!PRODUCTS.size) return null;
  let subtotal = 0;
  let delivery = 0;
  for (const item of items) {
    const product = PRODUCTS.get(item.id);
    if (!product) return null; // unknown product — never trust a made-up price
    const qty = Number(item.qty) || 1;
    subtotal += (Number(product.price) || 0) * qty;
    delivery += (Number(product.supplier && product.supplier.deliveryNgn) || 0) * qty;
  }
  return {
    subtotal: Math.round(subtotal),
    delivery: Math.round(delivery),
    total: Math.round(subtotal + delivery)
  };
}

const app = express();
const PORT = process.env.PORT || 3000;
const ORDERS_FILE = path.join(__dirname, "data", "orders.json");

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN
      ? process.env.FRONTEND_ORIGIN.split(",")
      : "*"
  })
);
app.use(
  express.json({
    limit: "1mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

/* ---------- Tiny JSON order store ---------- */
function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

function writeOrders(orders) {
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function saveOrder(order) {
  const orders = readOrders();
  const i = orders.findIndex((o) => o.id === order.id);
  if (i >= 0) orders[i] = order;
  else orders.push(order);
  writeOrders(orders);
}

function newOrderId() {
  return "BAG-" + Date.now().toString(36).toUpperCase() + "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase();
}

/* ---------- Health ---------- */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    paymentsConfigured: {
      paystack: Boolean(process.env.PAYSTACK_SECRET_KEY),
      flutterwave: Boolean(process.env.FLUTTERWAVE_SECRET_KEY),
      stripe: Boolean(process.env.STRIPE_SECRET_KEY),
      paypal: Boolean(process.env.PAYPAL_CLIENT_ID)
    },
    supplierConfigured: Boolean(process.env.CJ_API_KEY)
  });
});

/* ---------- Checkout ---------- */
app.post("/api/checkout", async (req, res) => {
  try {
    const { items, customer, paymentMethod, amount, supplier } = req.body || {};

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "No items in order." });
    }
    if (!customer || !customer.email || !customer.name || !customer.address) {
      return res.status(400).json({ error: "Customer details are incomplete." });
    }

    const priced = priceOrder(items);
    const enriched = enrichItems(items);
    if (!priced || !enriched) {
      return res.status(400).json({
        error: "One or more products are no longer available. Refresh the page and try again."
      });
    }

    const rate = Number(process.env.EXCHANGE_RATE_CNY_TO_NGN) ||
      Number(supplier?.exchangeRateToNgn) || 240;
    const supplierCostCny = items.reduce(
      (sum, item) => sum + (Number(item.supplierCostCny) || 0) * (Number(item.qty) || 1),
      0
    );
    const supplierCostNgn = Math.round(supplierCostCny * rate);

    const order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      status: "pending_payment",
      items: enriched,
      customer,
      paymentMethod: paymentMethod || "whatsapp",
      amount: priced.total,
      currency: "NGN",
      shipping: priced.delivery,
      supplier: {
        name: supplier?.name || "CJ Dropshipping",
        mode: supplier?.mode || "api"
      },
      supplierCostCny,
      supplierCostNgn,
      marginNgn: Math.round(priced.total - supplierCostNgn - priced.delivery),
      payment: null,
      supplierOrder: null,
      timeline: [
        { at: new Date().toISOString(), event: "order_created" }
      ]
    };

    const paymentResult = await payments.initiate(order.paymentMethod, order);
    order.payment = {
      provider: order.paymentMethod,
      reference: paymentResult.reference,
      demo: Boolean(paymentResult.demo),
      message: paymentResult.message || null
    };
    order.status = paymentResult.paymentUrl ? "awaiting_payment" : "manual_confirmation";
    order.timeline.push({
      at: new Date().toISOString(),
      event: "payment_initiated",
      demo: Boolean(paymentResult.demo)
    });
    saveOrder(order);

    res.json({
      orderId: order.id,
      status: order.status,
      paymentUrl: paymentResult.paymentUrl,
      demo: Boolean(paymentResult.demo),
      message: paymentResult.message || "Order created. Complete payment to continue.",
      supplierOrderId: null
    });
  } catch (err) {
    console.error("checkout error", err);
    res.status(500).json({ error: "Could not create order.", detail: err.message });
  }
});

/* ---------- Payment webhooks ---------- */
async function handlePaidOrder(order, eventName, reference) {
  if (!order || order.status === "supplier_ordered") return order;
  order.status = "paid";
  order.timeline.push({
    at: new Date().toISOString(),
    event: eventName,
    reference: reference || null
  });

  if ((order.supplier && order.supplier.mode) === "manual") {
    // Manual mode: keep the order ready for you to place in CJ yourself.
    order.supplierOrder = {
      id: "MANUAL-" + order.id,
      demo: true,
      message:
        "Supplier is in manual mode. Log in to CJ Dropshipping and place this order using the saved SKUs and CNY costs.",
      createdAt: new Date().toISOString()
    };
    order.status = "awaiting_manual_supplier";
    order.timeline.push({
      at: new Date().toISOString(),
      event: "supplier_manual_required"
    });
  } else {
    const supplierResult = await cj.createSupplierOrder(order);
    order.supplierOrder = {
      id: supplierResult.id,
      demo: Boolean(supplierResult.demo),
      message: supplierResult.message || null,
      createdAt: new Date().toISOString()
    };
    order.status = supplierResult.demo ? "supplier_demo" : "supplier_ordered";
    order.timeline.push({
      at: new Date().toISOString(),
      event: "supplier_order_created",
      supplierOrderId: supplierResult.id
    });
  }
  saveOrder(order);
  return order;
}

function findOrderByReference(reference) {
  if (!reference) return null;
  return readOrders().find(
    (o) =>
      o.id === reference ||
      (o.payment && o.payment.reference === reference)
  );
}

/* Acknowledge immediately, then fulfil in the background. Paystack expects a
   200 quickly; CJ calls can take several seconds. The in-flight set stops a
   retry from placing a duplicate supplier order. */
const inFlight = new Set();
function fulfilAsync(res, order, eventName, reference) {
  res.json({ received: true });
  if (!order || !reference || inFlight.has(reference)) return;
  inFlight.add(reference);
  setImmediate(async () => {
    try {
      await handlePaidOrder(order, eventName, reference);
    } catch (err) {
      console.error("Fulfilment error for", reference, err);
    } finally {
      inFlight.delete(reference);
    }
  });
}

app.post("/webhooks/paystack", async (req, res) => {
  if (!payments.verifyPaystack(req)) return res.status(400).json({ error: "Invalid signature" });
  const event = req.body || {};
  if (event.event === "charge.success") {
    const data = event.data || {};
    const reference = data.reference;
    const order = findOrderByReference(reference);
    const paidMajor = Number(data.amount);
    const expectedMajor = order ? Math.round(Number(order.amount) * 100) : NaN;
    const currencyOk = !data.currency || data.currency === (order && order.currency);
    if (!order || data.status !== "success" || !Number.isFinite(paidMajor) ||
        paidMajor < expectedMajor || !currencyOk) {
      // Never fulfil an order that was not paid in full. Acknowledge so Paystack
      // does not retry forever, but leave the order pending for manual review.
      console.error("Paystack webhook rejected:", reference, {
        status: data.status, paid: paidMajor, expected: expectedMajor, currency: data.currency
      });
      return res.json({ received: true, fulfilled: false, reason: "payment_mismatch" });
    }
    return fulfilAsync(res, order, "paystack_charge_success", reference);
  }
  res.json({ received: true });
});

app.post("/webhooks/flutterwave", async (req, res) => {
  if (!payments.verifyFlutterwave(req)) return res.status(400).json({ error: "Invalid hash" });
  const body = req.body || {};
  if (body.status === "successful") {
    const reference = body.tx_ref || body.data?.tx_ref;
    return fulfilAsync(res, findOrderByReference(reference), "flutterwave_success", reference);
  }
  res.json({ received: true });
});

app.post("/webhooks/stripe", async (req, res) => {
  if (!payments.verifyStripe(req)) return res.status(400).json({ error: "Invalid signature" });
  const type = req.body && req.body.type;
  if (type === "checkout.session.completed") {
    const session = req.body.data.object;
    const reference = session.metadata?.orderId || session.id;
    return fulfilAsync(res, findOrderByReference(reference), "stripe_checkout_completed", reference);
  }
  res.json({ received: true });
});

app.post("/webhooks/paypal", async (req, res) => {
  if (!(await payments.verifyPaypal(req))) {
    return res.status(400).json({ error: "Invalid PayPal webhook signature" });
  }
  const reference = req.body?.resource?.purchase_units?.[0]?.reference_id;
  if (req.body?.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    await handlePaidOrder(findOrderByReference(reference), "paypal_capture", reference);
  }
  res.json({ received: true });
});

/* ---------- Order status ---------- */
app.get("/api/orders/:id", (req, res) => {
  const order = readOrders().find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  const safe = {
    id: order.id,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    payment: order.payment,
    supplierOrderId: order.supplierOrder?.id || null,
    timeline: order.timeline
  };
  res.json(safe);
});

/* ---------- Supplier status proxy ---------- */
app.get("/api/orders/:id/supplier", async (req, res) => {
  const order = readOrders().find((o) => o.id === req.params.id);
  if (!order || !order.supplierOrder) {
    return res.status(404).json({ error: "No supplier order yet" });
  }
  const status = await cj.getSupplierOrderStatus(order.supplierOrder.id);
  res.json(status);
});

/* ---------- Static storefront ---------- */
app.use(express.static(path.join(__dirname, "..")));

app.listen(PORT, () => {
  console.log("BAGGI server listening on http://localhost:" + PORT);
  console.log("Storefront: http://localhost:8000 (or open the static files directly)");
});
