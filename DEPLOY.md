# Deploying BAGGI for real orders

The storefront and API are **one Express app**. `server/index.js` serves the
static pages from the parent folder and handles checkout, Paystack webhooks and
CJ orders. Deploy the whole `baggi-dropship` folder as a single web service.

## 1. Current permanent deployment

The `baggi-store` host/repo names below are legacy deployment identifiers from the
original scaffold. The storefront itself is branded BAGGI everywhere.

- GitHub: `https://github.com/TotoHunter/baggi-store` (branch `main`, legacy repo name)
- Canonical host (Oregon): `https://baggi-store.onrender.com`
- Render service ID: `srv-dc11pcl9fdbs739ggbhg`
- Health check: `https://baggi-store.onrender.com/api/health`
- Paystack live webhook `WHK_6bc15772`: `https://baggi-store.onrender.com/webhooks/paystack`
  (event `charge.success`). The old test webhook was `WHK_a80cf00a`.
- `js/config.js` uses `backendUrl: ""`, so the browser always calls the same
  origin. Only Paystack's webhook URL needs to change if the host changes.

The earlier Quick Tunnel watcher is **stopped and no longer used**. Do not start
`server/tools/keep-tunnel.js`; the public URL is permanent.

A second Render service in Singapore (`srv-dc123tou01pc738h94j0`,
`https://baggi-store-sg.onrender.com`) was used only to diagnose CJ's IP
throttling and is being removed. Keep only the Oregon service above.

## 2. Why there is a Cloudflare relay

CJ throttles Render's shared cloud egress IPs with:

```text
1600200 — Too Many Requests, one ip limit 3 users, Your Ip is ...
```

This happened on both Oregon and Singapore. Paid orders were landing in
`supplier_demo` with `CJ-ERROR-...` IDs. A free Cloudflare Worker now relays
only the four CJ calls the backend makes:

- `/api2.0/v1/authentication/getAccessToken`
- `/api2.0/v1/authentication/refreshAccessToken`
- `/api2.0/v1/shopping/order/createOrderV3`
- `/api2.0/v1/shopping/order/getOrderDetail`

Relay URL: `https://baggi-cj-relay.phpwo2.workers.dev`

The Worker checks the `x-relay-secret` header against its `RELAY_SECRET`
secret, rejects any other path, and forwards method/body/headers to
`https://developers.cjdropshipping.com`. The Render service has:

- `CJ_API_BASE=https://baggi-cj-relay.phpwo2.workers.dev`
- `CJ_RELAY_SECRET=<secret stored only in Render and Cloudflare>`

`server/services/cj.js` adds the `x-relay-secret` header whenever
`CJ_RELAY_SECRET` is set. Verified end to end: signed Paystack test webhook →
`supplier_ordered` with a real CJ sandbox order ID (no `CJ-ERROR` fallback).

If the Worker is ever lost, recreate it with `wrangler deploy` from the saved
worker folder, set `RELAY_SECRET` with `wrangler secret put RELAY_SECRET`, then
restore the two Render variables above.

## 3. Render setup

Render was created from `render.yaml`: Docker build from the project root,
`plan: free`. Environment variables are set in the Render dashboard, not in
Git. Important ones:

- `PAYSTACK_PUBLIC_KEY` / `js/config.js` public key — live `pk_live_...ac29`
- `PAYSTACK_USE_INLINE=1` — Paystack Inline checkout in the browser. The old
  `sk_live_...1618` was exposed and is revoked; the replacement restricted key
  cannot call the Paystack API. Inline needs only the public key, so payments can
  still be started while a fresh full `sk_live_...` is not available. Replace
  this with a new rotated full secret key when one is issued, then set
  `PAYSTACK_USE_INLINE=0`.
- Webhook authenticity is checked with the dashboard-generated signing secret
  (`whsec_...`). It is installed as a Render **Secret File** named
  `PAYSTACK_WEBHOOK_SECRET`, mounted at `/etc/secrets/PAYSTACK_WEBHOOK_SECRET`.
  `server/services/payments.js` reads that file (or the
  `PAYSTACK_WEBHOOK_SECRET` env var) and verifies the `Paystack-Signature`
  header with a 300-second timestamp tolerance. The legacy
  `x-paystack-signature` header remains accepted as a fallback.
- `CJ_API_KEY`, `CJ_PLATFORM_TOKEN`
- `CJ_SANDBOX=1` while testing; set to `0` only after a successful live test
- `CJ_PAY_TYPE=3` (create only); use `2` only when the CJ balance is funded
- `CJ_LOGISTIC_NAME=CJPacket Postal`, `CJ_FROM_COUNTRY_CODE=CN`
- `CJ_API_BASE` and `CJ_RELAY_SECRET` as described above
- `FRONTEND_ORIGIN=https://baggi-store.onrender.com`

Free tier sleeps after ~15 minutes idle; the first request can take ~50s.
Storage is ephemeral — see below.

To re-point Paystack after a host change, run on this machine:

```powershell
node server\tools\set-webhook-url.js https://your-app.onrender.com
```

## 4. Persistent order storage (still required before heavy live use)

Orders are saved to `server/data/orders.json`. On Render's free tier the
filesystem is ephemeral, so orders vanish on restart/redeploy. Before relying on
order history, either:

- mount a persistent disk at `/app/server/data`, or
- migrate `readOrders`/`writeOrders` in `server/index.js` to a hosted database.

Webhook fulfilment itself still works because payment is recorded by Paystack
and the order is created/fulfilled in the same request cycle.

## 5. Go-live checklist

- [x] Permanent public HTTPS URL, verified with `/api/health`
- [x] Paystack webhook points to `<public-url>/webhooks/paystack`
- [x] CJ IP throttle bypassed with the Cloudflare relay
- [x] Replace test keys with `sk_live_...` / `pk_live_...` in Render and `js/config.js`
- [x] Register the Paystack webhook with the **live** secret key (`WHK_6bc15772`)
- [x] Live Inline checkout deployed; webhook verified with dashboard `whsec_` secret
      stored as a Render Secret File (bad/tampered signatures are rejected)
- [ ] Rotate the exposed `sk_live_...1618` and replace Inline with a fresh full
      `sk_live_...` for server-side transaction initialisation
- [ ] Review SKU mapping in `js/config.js` — generic CJ matches are not BAGGI designs
- [ ] Confirm product prices and delivery charges
- [ ] Fund CJ balance if switching `CJ_PAY_TYPE` from `3` to `2`
- [x] Signed webhook tests passed: `BAG-MWR3694R-K2VB` → `supplier_ordered`
      (CJ sandbox `SD2611220016080654000`, legacy signature) and
      `BAG-MWRK67E7-J37P` → `supplier_ordered` (CJ sandbox
      `SD2611220811560660300`, new `Paystack-Signature`/`whsec_`); test data
      cleared by a service restart
- [ ] Set `CJ_SANDBOX=0` only after a real live payment succeeds and CJ is funded
- [ ] Run a small live payment, confirm webhook + CJ order, then clean up test data

## 6. Verify after any change

```powershell
curl.exe https://baggi-store.onrender.com/api/health
node server\tools\set-webhook-url.js https://baggi-store.onrender.com
```
