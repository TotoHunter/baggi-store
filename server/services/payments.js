/* Payment adapters. Secret keys are read from server/.env only. */
const axios = require("axios");
const crypto = require("crypto");

const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:8000";

function toMajor(amount, currency) {
  // Stripe / Paystack use the smallest currency unit (kobo / cents).
  return Math.round(Number(amount) * 100);
}

async function initiate(method, order) {
  switch (method) {
    case "paystack":
      return paystack(order);
    case "flutterwave":
      return flutterwave(order);
    case "stripe":
      return stripe(order);
    case "paypal":
      return paypal(order);
    case "bank":
    case "whatsapp":
    default:
      return {
        demo: true,
        paymentUrl: null,
        reference: "MANUAL-" + order.id,
        message:
          "Manual payment method. Confirm the order on WhatsApp and collect payment there."
      };
  }
}

async function paystack(order) {
  if (!process.env.PAYSTACK_SECRET_KEY) return demo("Paystack");
  try {
    const res = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: order.customer.email,
        amount: toMajor(order.amount, "NGN"),
        currency: "NGN",
        reference: order.id,
        callback_url: FRONTEND + "/checkout.html?paid=paystack",
        metadata: { orderId: order.id, supplierCostCny: order.supplierCostCny }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return {
      demo: false,
      paymentUrl: res.data.data.authorization_url,
      reference: res.data.data.reference
    };
  } catch (err) {
    return demo("Paystack", err.message);
  }
}

async function flutterwave(order) {
  if (!process.env.FLUTTERWAVE_SECRET_KEY) return demo("Flutterwave");
  try {
    const res = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: order.id,
        amount: Number(order.amount),
        currency: "NGN",
        redirect_url: FRONTEND + "/checkout.html?paid=flutterwave",
        customer: {
          email: order.customer.email,
          name: order.customer.name,
          phonenumber: order.customer.phone
        },
        customizations: { title: "BAGGI", description: "BAGGI order " + order.id }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return {
      demo: false,
      paymentUrl: res.data.data.link,
      reference: order.id
    };
  } catch (err) {
    return demo("Flutterwave", err.message);
  }
}

async function stripe(order) {
  if (!process.env.STRIPE_SECRET_KEY) return demo("Stripe");
  try {
    const Stripe = require("stripe");
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      customer_email: order.customer.email,
      line_items: [
        {
          price_data: {
            currency: "ngn",
            unit_amount: toMajor(order.amount, "NGN"),
            product_data: { name: "BAGGI order " + order.id }
          },
          quantity: 1
        }
      ],
      success_url: FRONTEND + "/checkout.html?paid=stripe&order=" + order.id,
      cancel_url: FRONTEND + "/cart.html",
      metadata: { orderId: order.id, supplierCostCny: String(order.supplierCostCny) }
    });
    return { demo: false, paymentUrl: session.url, reference: session.id };
  } catch (err) {
    return demo("Stripe", err.message);
  }
}

function paypalHost() {
  return process.env.PAYPAL_MODE === "live"
    ? "api-m.paypal.com"
    : "api-m.sandbox.paypal.com";
}

async function paypalToken() {
  const res = await axios.post(
    `https://${paypalHost()}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );
  return res.data.access_token;
}

async function paypal(order) {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return demo("PayPal");
  }
  try {
    const token = await paypalToken();
    const currency = process.env.PAYPAL_CURRENCY || "USD";
    // PayPal does not support NGN. Convert from naira using a configurable rate.
    const rate = Number(process.env.NGN_TO_USD_RATE) || 1500;
    const value = currency === "USD" ? Number(order.amount) / rate : Number(order.amount);
    const orderRes = await axios.post(
      `https://${paypalHost()}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: order.id,
            amount: {
              currency_code: currency,
              value: value.toFixed(2)
            },
            description:
              "BAGGI order " + order.id + " (NGN " + Number(order.amount).toFixed(2) + ")"
          }
        ],
        application_context: {
          return_url: FRONTEND + "/checkout.html?paid=paypal&order=" + order.id,
          cancel_url: FRONTEND + "/cart.html"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    const approve = (orderRes.data.links || []).find((l) => l.rel === "approve");
    return {
      demo: false,
      paymentUrl: approve ? approve.href : null,
      reference: orderRes.data.id
    };
  } catch (err) {
    return demo("PayPal", err.message);
  }
}

function demo(provider, reason) {
  return {
    demo: true,
    paymentUrl: null,
    reference: null,
    message:
      (provider ? provider + " " : "") +
      "is not configured yet" +
      (reason ? " (" + reason + ")" : "") +
      ". Running in demo mode — add keys to server/.env to go live."
  };
}

/* ---------- Webhook verification ---------- */
function verifyPaystack(req) {
  if (!process.env.PAYSTACK_SECRET_KEY) return false;
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody || Buffer.from(""))
    .digest("hex");
  return hash === req.headers["x-paystack-signature"];
}

function verifyFlutterwave(req) {
  const secret = process.env.FLUTTERWAVE_HASH_SECRET;
  if (!secret) return false;
  const expected = crypto.createHash("sha256").update(secret).digest("hex");
  return req.headers["verif-hash"] === expected;
}

function verifyStripe(req) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return false;
  try {
    const Stripe = require("stripe");
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    stripeClient.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return true;
  } catch (e) {
    return false;
  }
}

async function verifyPaypal(req) {
  if (
    !process.env.PAYPAL_CLIENT_ID ||
    !process.env.PAYPAL_CLIENT_SECRET ||
    !process.env.PAYPAL_WEBHOOK_ID
  ) {
    return false;
  }
  try {
    const token = await paypalToken();
    const h = req.headers;
    const res = await axios.post(
      `https://${paypalHost()}/v1/notifications/verify-webhook-signature`,
      {
        transmission_id: h["paypal-transmission-id"],
        transmission_sig: h["paypal-transmission-sig"],
        transmission_time: h["paypal-transmission-time"],
        cert_url: h["paypal-cert-url"],
        auth_algo: h["paypal-auth-algo"],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: req.body
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );
    return res.data && res.data.verification_status === "SUCCESS";
  } catch (err) {
    console.error("paypal webhook verification failed", err.message);
    return false;
  }
}

module.exports = {
  initiate,
  verifyPaystack,
  verifyFlutterwave,
  verifyStripe,
  verifyPaypal,
  demo
};
