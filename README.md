# BAGGI — Dropshipping storefront + automated supplier flow

A static streetwear store with WhatsApp ordering, a shopping bag, multi-gateway checkout, and a Node.js backend that creates a CJ Dropshipping supplier order **after payment is confirmed**. The folder name keeps the old scaffold name, but the brand is BAGGI everywhere in the store.

## What was added

- **More products:** 27 total — jeans, hoodies, tees, cargos, jackets, shorts, hats, totes, sweatpants, zip hoodie, denim shirt, utility vest, beanie, crossbody bag, socks and a plain cap, plus custom jeans, tees, hoodies, mugs and posters.
- **Custom / print-on-demand:** `Design Yours` builds a design preview and opens WhatsApp so a one-off order can be confirmed manually. No paid CJ order is placed for previews. POD/custom preview products (`podPending: true`) are blocked from cart, checkout and CJ fulfilment.
- **Shopping bag + checkout:** quantity controls, delivery fee, all six payment methods shown, order confirmation.
- **Payments:** Paystack, Flutterwave, Stripe, PayPal, Palmpay transfer and WhatsApp confirmation. Paystack, Palmpay and WhatsApp are selectable now; the other three show as coming soon until keys are added.
- **Supplier automation:** backend verifies payment webhooks, then sends a CJ Dropshipping order using each product's SKU and CNY cost.
- **Admin page:** edit products, prices, supplier SKUs/costs and shop settings in the browser.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `collection.html` | All products by category |
| `jeans.html`, `hoodies.html`, `shirts.html`, `cargo.html`, `outerwear.html`, `accessories.html`, `custom.html` | One dedicated page per product type |
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

`js/config.js` has `backendUrl: ""`. The Express server serves the static files and the API from the same origin, so this works locally on port 3001 and on the permanent Render host without changes.

Until keys are added, checkout still works in **demo mode**: it shows a demo order ID and a WhatsApp confirmation link. No real money is taken and no real supplier order is placed.

### Current live-setup status (26 Nov 2026)

- **Permanent storefront + API:** `https://baggi-store.onrender.com` (Render, Oregon, service `srv-dc11pcl9fdbs739ggbhg`). This URL and the GitHub repo name are legacy deployment identifiers; the storefront brand is BAGGI. Health: `/api/health`.
- Source: `https://github.com/TotoHunter/baggi-store`, branch `main` (legacy repo name). Local development still works on `http://127.0.0.1:3001`; the Python server on `:8000` is preview-only.
- `js/config.js` uses `backendUrl: ""` — the browser calls the same origin, so host changes need no browser config change.
- The old Quick Tunnel watcher is **stopped**. `server/tools/keep-tunnel.js` is retained only as a reference and must not be started.
- Paystack is in **live mode**: live public key `pk_live_...ac29` is in `js/config.js`. The previously exposed full secret was revoked; the restricted replacement cannot call the Paystack API, so checkout now uses **Paystack Inline** (`PAYSTACK_USE_INLINE=1`) and only needs the public key in the browser. A fresh full `sk_live_...` should still be issued and rotated in before launch.
- Paystack live webhook `WHK_6bc15772` → `https://baggi-store.onrender.com/webhooks/paystack`, subscribed to `charge.success`. The old test webhook was `WHK_a80cf00a`. Webhooks are verified with the dashboard-generated `whsec_` signing secret, stored as a Render Secret File at `/etc/secrets/PAYSTACK_WEBHOOK_SECRET` and in the OpenBot Vault. Bad or tampered signatures are rejected; the legacy header is accepted only as a fallback.
- All six payment methods are enabled and selectable at checkout: Paystack, Flutterwave, Stripe, PayPal, Palmpay and WhatsApp. Paystack, Palmpay and WhatsApp work now; Flutterwave, Stripe and PayPal complete a demo order until their keys are added in Render. Palmpay details are still placeholders.
- CJ adapter uses V2.0 (token exchange + `createOrderV3`), `CJ_PAY_TYPE=3`, `CJ_SANDBOX=1` while testing. CJ balance is $0. `CJ_LOGISTIC_NAME` is set per environment: Render used `CJPacket Postal` for the verified sandbox orders; the local `server/.env` currently uses `CJPacket Liquid Line`. Confirm the value against CJ's freight-calculate API before going live — CJ rejects orders with an invalid logistics name.
- **CJ IP throttle solved:** Render IPs were rejected with `1600200 / Too Many Requests, one ip limit 3 users`. A free Cloudflare Worker, `https://baggi-cj-relay.phpwo2.workers.dev`, now relays only the four CJ API paths used by the app. Render sets `CJ_API_BASE` to that Worker and `CJ_RELAY_SECRET` to the shared secret; the Worker keeps its own `RELAY_SECRET`. Verified: signed webhook with **live Paystack keys** → `supplier_ordered` with real CJ sandbox order `SD2611220016080654000` (and earlier `SD2611212331300665700`), then test data cleared.
- **CJ variant mapping:** all 27 products have a real CJ `sku` + `vid`. Sized products use per-size maps; the browser, server and CJ adapter reject unknown/stale sizes instead of falling back to another variant. Several matches are generic CJ catalogue items, **not your branded BAGGI designs** — a visible supplier note warns on cards, PDPs, cart and checkout. Custom/POD preview items are **WhatsApp-only**: `podPending: true` blocks them from cart, paid checkout and CJ fulfilment, so no blank item is ever shipped as a print. The cap and tote are plainly sold as blank items.
- **Pricing is set per product in `js/config.js`:** each product has its own customer price and delivery amount. Confirm the current prices suit your market before launch.
- **Checkout is server-authoritative:** totals and SKU/VID/supplier cost are recomputed on the server. The webhook rejects underpayments, acknowledges immediately and de-duplicates retries.
- Render free tier sleeps after inactivity and has ephemeral storage; persistent order storage is still a pre-launch task — see `DEPLOY.md`.
- To go live: rotate a fresh full `sk_live_...`, review SKUs/prices, fund CJ, run one **real** small live payment (signed-webhook tests already passed, including `BAG-MWRK67E7-J37P` → `supplier_ordered` with CJ sandbox `SD2611220811560660300`), then set `CJ_SANDBOX=0`.

## Edit products, prices and supplier costs

### Option A — admin page (recommended)

1. Open `admin.html`.
2. Edit shop settings and product rows.
3. Click **Download config.js**.
4. Replace `js/config.js` with the downloaded file.
5. Refresh the store.

The admin table includes **Supplier SKU**, **CJ variant ID**, **Cost (CNY)** and **Delivery (₦)** columns. The SKU/VID are sent to CJ; the delivery value is what customers are charged at checkout. Download/copy is blocked while any product (or size variant) has a blank SKU or VID. The per-size variant maps (`supplier.sizes`) are preserved when you download the config, but must be edited directly in `js/config.js`. **Download/Copy refuses to export if any product or size variant is missing a SKU or VID**, so a blank admin template cannot become an orderable product.

### Option B — edit `js/config.js` directly

- `products[].price` — customer price in naira.
- `products[].image` / `products[].imageAlt` — filename in `assets/` and its alt text.
- `products[].supplier.sku` — your product code in CJ.
- `products[].supplier.costCny` — what you pay CJ in yuan.
- `supplier.exchangeRateToNgn` — conversion used for your margin calculation.
- `contact.whatsapp` — WhatsApp number, digits only, with country code.
- `payments.methods[].enabled` — show/hide a payment option.
- `trust`, `heroPoints`, `steps`, `features` — the trust strip, hero micro-copy, “How it works” and feature cards on the home page.

Prices display automatically as `₦14,000`.

## Product photos

The supplied streetwear images are placed by what each picture actually shows, not
by filename: denim photos sit on jeans/shorts, hoodie photos on hoodies, the denim
jacket photo on the jacket, the painting photo on the custom poster, and the
hat/tote/mug photos on those products. The hero and About use the two BAGGI-branded
portraits.

`tools/IMAGE_CHECK.html` is a contact sheet that shows every product next to its
assigned picture and the caption used to verify it. To change a photo, replace the
file in `assets/` or edit `products[].image` in `js/config.js` (or the Image filename
column in `admin.html`).


## How the money and supplier flow works

This is a **merchant-of-record** setup:

1. The customer pays **you** the full retail price through Paystack / Flutterwave / Stripe / PayPal, or confirms a Palmpay/WhatsApp payment.
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

All six methods are enabled in `js/config.js`. To make a gateway take real money, add its keys as environment variables in Render (not in `js/config.js`): Paystack → `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`; Flutterwave → `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_PUBLIC_KEY`, `FLUTTERWAVE_HASH_SECRET`; Stripe → `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`; PayPal → `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_MODE`, `PAYPAL_CURRENCY`, `NGN_TO_USD_RATE`. Palmpay details come from `payments.bank`; WhatsApp needs no keys. Unconfigured gateways still show at checkout but finish as a demo order.

Set `FRONTEND_ORIGIN` in `.env` to your storefront URL. Stripe also needs `STRIPE_WEBHOOK_SECRET` from the webhook endpoint. Flutterwave needs `FLUTTERWAVE_HASH_SECRET`.

PayPal needs `PAYPAL_WEBHOOK_ID`, and all four webhook signatures are verified before an order is fulfilled.

PayPal does not accept naira, so PayPal amounts are converted from NGN to USD using `NGN_TO_USD_RATE` in `.env` — check that rate before going live. All other gateways charge in NGN.

## Set up CJ Dropshipping

1. Create an account at **app.cjdropshipping.com**, install the **API** app, then copy the API key from the API page. Put it in `.env` as `CJ_API_KEY`.
2. Find your real products (or ask a CJ agent for the streetwear/custom items) and copy their **variant SKUs**. Review every `supplier.sku` and variant ID in `js/config.js` (or in `admin.html`); the current values are generic CJ matches, not your branded designs. Keep `supplier.costCny` as your real cost per item.
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
- Add your real Palmpay details under `payments.bank` in `js/config.js`.
- Add delivery timelines and return policy to `copy.contactText` / About page.

Everything is local and admin-ready — no database is required for the storefront itself.
