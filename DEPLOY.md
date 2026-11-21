# Deploying BAGGI for real orders

The storefront and the API are **one Express app**. `server/index.js` serves the
static pages from the parent folder and handles checkout, Paystack webhooks and
CJ orders. Deploy the whole `baggi-dropship` folder as a single web service.

## 1. What is running now (temporary)

- Backend: `http://127.0.0.1:3001` (also serves the storefront)
- Preview only: `http://localhost:8000` (plain Python static server)
- Public HTTPS tunnel: read `server/data/tunnel-url.txt` — the URL changes on restart
- Paystack webhook: `WHK_a80cf00a` → `<tunnel-url>/webhooks/paystack`

`js/config.js` uses `backendUrl: ""`, so the browser always calls the **same
origin**. That means a tunnel URL change cannot break checkout. The only thing
that must follow the URL is the Paystack webhook, and `server/tools/keep-tunnel.js`
does that automatically:

```powershell
node server\tools\keep-tunnel.js
```

It restarts the tunnel if it drops, writes the current URL to
`server/data/tunnel-url.txt`, and re-points the webhook (retried until the new
host resolves). Verified end to end. This is still a Quick Tunnel, so it is fine
for testing but not a permanent public address.

## 2. Permanent hosting (recommended: Render)

A free/starter Node host is enough. You need an account — none is configured on
this machine, so this step needs you.

**Render (picked as the best free option — no card needed):**

1. Push this folder to a GitHub repo. (No git installed on this PC, so create the
   repo on GitHub and upload the files via the web UI, or install git.)
2. Render Dashboard → **New** → **Blueprint** → select that repo.
3. It reads `render.yaml`: Docker build from the project root, `plan: free`.
   Fill the secrets it asks for:
   - `PAYSTACK_SECRET_KEY` = test key now, live key (`sk_live_...`) at launch
   - `CJ_API_KEY` = your CJ API key
   - `CJ_PLATFORM_TOKEN` = leave empty unless CJ gave you one
4. When it's live, copy the public URL and run on this machine:

   ```powershell
   node server\tools\set-webhook-url.js https://your-app.onrender.com
   ```

5. Set `FRONTEND_ORIGIN` in Render to that same URL and redeploy.
   `js/config.js` already has `backendUrl: ""`, so no browser config change is
   needed — the store and API are the same service.

**Free-tier caveat:** the service sleeps after ~15 minutes idle and takes about
a minute to wake. Paystack retries webhooks, so orders still land, but the first
customer visit on a cold service is slow. Storage is also ephemeral — see below.

**Alternatives:** Railway, Fly.io, or any Node host. For all of them:

- Build/start from the project root: `npm ci --prefix server`, then `node server/index.js`
- Set `PORT` (the host usually injects it; the app respects it)
- Set `FRONTEND_ORIGIN` to the public storefront URL
- Set the env vars listed in `server/.env.example`
- Mount a persistent volume at `server/data` (see below)

## 3. Persistent order storage (important)

Orders are saved to `server/data/orders.json`. On most free hosts the filesystem
is ephemeral — **orders vanish on restart/redeploy**. Before going live either:

- mount a persistent disk at `/app/server/data` (Docker volume is declared in the
  `Dockerfile`), or
- migrate `readOrders`/`writeOrders` in `server/index.js` to a hosted database.

If you skip this, a webhook can arrive just as the host restarts and the order
will be lost, even though Paystack recorded a successful charge.

## 4. Stable HTTPS without a hosting account (Cloudflare named tunnel)

If you want to keep the backend on this PC:

1. Add a domain to Cloudflare and install `cloudflared`.
2. `cloudflared tunnel login`
3. `cloudflared tunnel create baggi`
4. Write `~/.cloudflared/config.yml`:

   ```yaml
   tunnel: <tunnel-id>
   credentials-file: <path-to-json>
   ingress:
     - hostname: baggi.yourdomain.com
       service: http://localhost:3001
     - service: http_status:404
   ```

5. `cloudflared tunnel route dns baggi baggi.yourdomain.com`
6. `cloudflared tunnel run baggi`
7. Set `backendUrl: "https://baggi.yourdomain.com"` in `js/config.js`.
8. Run `node server\tools\set-webhook-url.js https://baggi.yourdomain.com`.

Unlike a Quick Tunnel, this URL never changes.

## 5. Go-live checklist

- [ ] Permanent public HTTPS URL, verified with `/api/health`
- [ ] Paystack webhook points to `<public-url>/webhooks/paystack`
- [ ] Replace test keys with `sk_live_...` / `pk_live_...` (both `server/.env` and `js/config.js`)
- [ ] Register the webhook again with the **live** secret key
- [ ] `FRONTEND_ORIGIN` = public storefront URL
- [ ] Persistent order storage configured
- [ ] Review the SKU mapping in `js/config.js` — see README (catalog matches are
      best-effort, not your actual branded designs)
- [ ] Confirm product prices and delivery charges (they were raised to cover real
      CJ freight to Nigeria)
- [ ] Fund CJ balance if switching `CJ_PAY_TYPE` from `3` to `2`
- [ ] Set `CJ_SANDBOX=0` only after a successful live-key test
- [ ] Run a small live payment, confirm webhook + CJ order, then refund/clean up

## 6. Verify after any change

```powershell
curl.exe https://<your-url>/api/health
node server\tools\set-webhook-url.js https://<your-url>
```
