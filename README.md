# BAGGI — Dropshipping storefront + automated supplier flow

A static streetwear store with WhatsApp ordering, a shopping bag, multi-gateway checkout, and a Node.js backend that creates a CJ Dropshipping supplier order **after payment is confirmed**.

## What was added

- **More products:** 19 total — jeans, hoodies, tees, cargos, jackets, shorts, hats, totes, plus custom jeans, tees, hoodies, mugs and posters.
- **Custom print-on-demand:** `Design Yours` maps designs to the custom products and adds a personalised pre-order to the bag.
- **Shopping bag + checkout:** quantity controls, delivery fee, six payment choices, order confirmation.
- **Payments:** Paystack, Flutterwave, Stripe, PayPal, bank transfer and WhatsApp confirmation.
- **Supplier automation:** backend verifies payment webhooks, then sends a CJ Dropshipping order using each product's SKU and CNY cost.
- **Admin page:** edit products, prices, supplier SKUs/costs and shop settings in the browser.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `collection.html` | All products by category |
| `fit-advisor.html` | Design yours |
| `about.html` | Brand story |
| `contact.html` | Contact options |
| `cart.html` | Shopping bag |
| `checkout.html` | Delivery + payment |
| `admin.html` | **Private** browser helper for editing products/prices |

## Run locally

### 1. Storefront

```bash
cd baggi-dropship
python -m http.server 8000
```

Open `http://localhost:8000`.

### 2. Backend

```bash
cd baggi-dropship/server
npm install
npm start
```

The backend uses **port 3001** (3000 was already occupied on this machine). Check it:

```text
http://127.0.0.1:3001/api/health
```

`js/config.js` has `backendUrl: "http://127.0.0.1:3001"`. For production, change this to your public backend URL (for example `https://baggi-api.onrender.com`). If you serve the static files from the Express server itself, set it to `""`.

Until keys are added, checkout still works in **demo mode**: it shows a demo order ID and a WhatsApp confirmation link. No real money is taken and no real supplier order is placed.

### Current live-setup status (21 Nov 2026)

- Storefront + API: `http://127.0.0.1:3001` (one Express app). Preview only: `http://localhost:8000`.
- Public HTTPS tunnel: current URL is in `server/data/tunnel-url.txt`. It changes on restart. `server/tools/keep-tunnel.js` keeps it alive and re-points the webhook automatically; verified end to end.
- `js/config.js` uses `backendUrl: ""` — the browser calls the same origin, so a tunnel/host change cannot break checkout.
- Paystack is configured in test mode (secret + public key saved in `server/.env` and `js/config.js`).
- Paystack webhook `WHK_a80cf00a` → `<tunnel-url>/webhooks/paystack`, subscribed to `charge.success`. Verified with signed sandbox webhooks end to end.
- Only Paystack, bank transfer and WhatsApp are shown at checkout; Flutterwave, Stripe and PayPal are disabled until their keys exist.
- `server/.env` exists with non-secret defaults. Real keys must be added there with the owner's approval and the API restarted.
- The CJ adapter uses CJ API V2.0 (token exchange + `createOrderV3`). `CJ_API_KEY` is set and verified; `CJ_LOGISTIC_NAME=CJPacket Postal` (from the CN→NG freight API); `CJ_PAY_TYPE=3` (create only — CJ balance is $0); `CJ_SANDBOX=1` while testing.
- Full sandbox chain verified: Paystack test payment → signed webhook → real CJ order `SD2611212131240662000` (status `CREATED`, `isSandbox: 1`, logistic `CJPacket Postal`).
- **SKU mapping applied (best-effort):** all 19 products now have real CJ `sku` + `vid` values in `js/config.js`, including a `sizes` map so the customer's selected size resolves to the correct CJ variant. Verified: a W32 order produced CJ variant `2409200336291616700` (Blue-L) and a real sandbox order `SD2611212143590648600`.
  - **Important:** these are the closest generic CJ catalog matches, **not your branded BAGGI designs**. Some are approximations (e.g. waist sizes mapped to S–XXL, "Off White" mapped to white/gray, custom print items mapped to blank products). Review every mapping in `admin.html` or `js/config.js` before live orders, or upload your own products to CJ and replace the SKUs.
  - Custom/print-on-demand items (`custom-jeans`, `custom-tee`, `custom-hoodie`, `gods-plan-tee`, `custom-mug`, `custom-poster`) will ship **blank** products with these SKUs — CJ's POD service is not wired up. Keep `supplier.mode: "manual"` for those, or integrate CJ POD separately.
- **Pricing updated to cover real freight:** prices were recalculated from live CJ product cost + CN→NG shipping (`supplier.deliveryNgn`) with a ~30% margin. Example: OG Baggi is now ₦90,000 product + ₦43,440 delivery = ₦133,440. Delivery is charged per item and shown at checkout. These are much higher than the original prices because CJ shipping to Nigeria is $6–$30+ per item. If this is too expensive for your market, use a local supplier or change `supplier.mode` to `manual`.
- **Checkout is now server-authoritative:** `server/index.js` loads `js/config.js`, recomputes the total from real prices/delivery and fills in SKU/VID/supplier cost itself. A browser cannot submit a fake amount. The Paystack webhook also rejects payments that don't match the stored amount, acknowledges immediately, and de-duplicates retries.
- **Deploy files added:** `Dockerfile`, `render.yaml`, `.dockerignore`, `DEPLOY.md`, `server/tools/set-webhook-url.js` and `server/tools/keep-tunnel.js`. Permanent hosting still needs your account — see `DEPLOY.md`. The Quick Tunnel is temporary; same-origin calls mean no browser config change is needed when you move hosts.
- To go live: follow `DEPLOY.md` — permanent HTTPS, update the webhook, live Paystack keys, `FRONTEND_ORIGIN`, persistent order storage, review SKUs/prices, fund CJ balance (if `CJ_PAY_TYPE=2`), then `CJ_SANDBOX=0` after a successful live test.

## Edit products, prices and supplier costs

### Option A — admin page (recommended)

1. Open `admin.html`.
2. Edit shop settings and product rows.
3. Click **Download config.js**.
4. Replace `js/config.js` with the downloaded file.
5. Refresh the store.

The admin table includes **Supplier SKU**, **CJ variant ID**, **Cost (CNY)** and **Delivery (₦)** columns. The SKU/VID are sent to CJ; the delivery value is what customers are charged at checkout. The per-size variant maps (`supplier.sizes`) are preserved when you download the config, but must be edited directly in `js/config.js`.

### Option B — edit `js/config.js` directly

- `products[].price` — customer price in naira.
- `products[].image` — filename inside `assets/`.
- `products[].supplier.sku` — your product code in CJ.
- `products[].supplier.costCny` — what you pay CJ in yuan.
- `supplier.exchangeRateToNgn` — conversion used for your margin calculation.
- `contact.whatsapp` — WhatsApp number, digits only, with country code.
- `payments.methods[].enabled` — show/hide a payment option.
- `trust`, `heroPoints`, `steps`, `features` — the trust strip, hero micro-copy, “How it works” and feature cards on the home page.

Prices display automatically as `₦14,000`.

## Product photos

All product photos are AI-generated model-wearing shots stored locally in `assets/` as `model-<product>.jpg`. The collection uses these directly, and `tools/apply_model_photos.py` + `tools/generate_model_photos.py` wire them into `js/config.js` automatically.

To replace any photo with real supplier imagery:

1. Upload a portrait/4:5 product photo from your supplier into `assets/`.
2. Set that product's `image` value in `js/config.js` (or in `admin.html`) to the exact filename.
3. Keep the filename simple, e.g. `cargo-olive-real.jpg`.

## How the money and supplier flow works

This is a **merchant-of-record** setup:

1. The customer pays **you** the full retail price through Paystack / Flutterwave / Stripe / PayPal, or confirms a bank/WhatsApp payment.
2. The payment provider sends a webhook to the backend.
3. The backend marks the order paid and calls CJ Dropshipping with the product SKU, size, quantity and your CNY cost.
4. **You pay CJ from your CJ wallet/balance** using the collected money. CJ manufactures and ships to the customer.
5. Your margin is `customer price − supplier cost − delivery − gateway fees`.

So the customer is not literally split-charged at checkout. You collect the full amount, then fund the supplier order. True split settlements require a marketplace/vendor payout product and are a larger setup.

The backend stores each order, supplier cost in CNY and NGN, margin, payment status and supplier order ID in `server/data/orders.json`.

## Set up payments

Copy `server/.env.example` to `server/.env`, then add keys for the providers you want. Never share `.env` or put secret keys in `js/config.js`.

| Provider | Where to get keys | Webhook URL to add |
| --- | --- | --- |
| Paystack | dashboard.paystack.com → Settings → API Keys | `https://YOUR-API-Host/webhooks/paystack` |
| Flutterwave | dashboard.flutterwave.com → Settings → API Keys | `https://YOUR-API-Host/webhooks/flutterwave` |
| Stripe | dashboard.stripe.com → Developers → API keys | `https://YOUR-API-Host/webhooks/stripe` |
| PayPal | developer.paypal.com → My Apps | `https://YOUR-API-Host/webhooks/paypal` |

Set `FRONTEND_ORIGIN` in `.env` to your storefront URL. Stripe also needs `STRIPE_WEBHOOK_SECRET` from the webhook endpoint. Flutterwave needs `FLUTTERWAVE_HASH_SECRET`.

PayPal needs `PAYPAL_WEBHOOK_ID`, and all four webhook signatures are verified before an order is fulfilled.

PayPal does not accept naira, so PayPal amounts are converted from NGN to USD using `NGN_TO_USD_RATE` in `.env` — check that rate before going live. All other gateways charge in NGN.

## Set up CJ Dropshipping

1. Create an account at **app.cjdropshipping.com**, install the **API** app, then copy the API key from the API page. Put it in `.env` as `CJ_API_KEY`.
2. Find your real products (or ask a CJ agent for the streetwear/custom items) and copy their **variant SKUs**. Replace every placeholder `BAG-...` `supplier.sku` in `js/config.js` (or in `admin.html`) with the real SKU. Keep `supplier.costCny` as your real cost per item.
3. Get a valid `logisticName` from CJ's freight-calculate API or your CJ account and put it in `.env` as `CJ_LOGISTIC_NAME`. CJ rejects orders with an invalid logistics name.
4. `server/services/cj.js` exchanges `CJ_API_KEY` for a CJ access token, caches it, and posts to `/api2.0/v1/shopping/order/createOrderV3`. `CJ_PAY_TYPE=2` pays from your CJ balance when the order is created; `CJ_PAY_TYPE=3` only creates it. Use `CJ_SANDBOX=1` for a test order with no real charge or fulfilment.
5. Set `supplier.mode` in `js/config.js` to `"api"` for automatic orders, or `"manual"` if you want to place each order in CJ yourself after payment. If a key, SKU or logistics name is missing, the adapter returns a demo order with the exact missing item in its message instead of silently pretending the order was placed.

If CJ changes its API, edit `CJ_API_BASE`, `CJ_ORDER_ENDPOINT`, `CJ_ORDER_STATUS_ENDPOINT` and the payload in `server/services/cj.js`. The rest of the store does not change.

## Go live (free/cheap)

- **Storefront:** Netlify, Cloudflare Pages, Vercel or GitHub Pages — drag in the folder, no build command.
- **Backend:** Render, Railway or Fly.io — deploy the `server/` folder, set environment variables, and allow your storefront origin in CORS.
- **Domain:** point your domain at the storefront host and set `FRONTEND_ORIGIN` accordingly.
- **admin.html:** do not link it in customer navigation. It creates a downloadable config file; it does not write to the server.

## Dropshipping notes

- Set supplier costs from real CJ quotes before running ads.
- Recheck the CNY → NGN rate regularly.
- Test every payment method in test/sandbox mode first.
- Add your real bank account details under `payments.bank` in `js/config.js`.
- Add delivery timelines and return policy to `copy.contactText` / About page.

Everything is local and admin-ready — no database is required for the storefront itself.
