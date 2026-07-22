# Built by Handbook

Embeddable footer credit for client sites — small logo, 14px mono label, hover Lottie, and a registry ping so you know where it's installed.

**Not used on handbook.com itself.** Drop into client footers only.

## Quick embed

```html
<div data-handbook-credit data-theme="dark" data-project="client-slug"></div>
<script async src="https://builtby.handbook.com/v1/credit.js"></script>
```

- `data-theme="dark"` — white mark + text (for dark footers). Hover Lottie enabled.
- `data-theme="light"` — Handbook black (`#0D0D0D`) mark + text (for light footers). Static mark on hover for now (Lottie asset is white-on-transparent).

See [docs/embed.md](./docs/embed.md) for full options.

## Development

```bash
npm install
npm run dev      # preview at localhost:5173
npm run build    # outputs dist/credit.js + dist/assets/hb-hover-w.json
```

## Deploy (CDN)

1. Run `npm run build`
2. Upload `dist/credit.js` and `dist/assets/` to `builtby.handbook.com/v1/`
3. Deploy the registry worker (see below)

Pin client embeds to a version path (`/v1/`). Ship breaking changes as `/v2/`.

## Registry worker

The credit sends **one load ping per browser session** when it appears on a page:

```
GET /r?host=client.com&theme=dark&v=1&project=bloomfilter
```

Cloudflare Worker + KV scaffold lives in [`worker/`](./worker/). After deploy:

- `GET /r` — ingest ping (called by the embed)
- `GET /installs` — JSON list of known installs (**lock this down before prod**)

```bash
cd worker
npx wrangler kv namespace create INSTALLS
# paste id into wrangler.toml
npx wrangler deploy
```

---

## Keeping on top of installs

### Do this

| Tool | Purpose |
|------|---------|
| **Registry (`/r` ping)** | Inventory — which domains load the credit, last seen, version |
| **GA4 on handbook.com** | Clicks on footer links (UTM: `utm_source=builtby&utm_medium=footer`) |
| **Linear / Notion table** | Intended installs per client project at launch |

Check the registry weekly (or wire a simple dashboard). Use GA for traffic insights, not inventory.

### Don't do this

**Slack notification on every click** — noisy, not useful, and feels surveillance-y. Clicks are analytics; pings are inventory.

**Slack on every page load ping** — also noisy. If you want Slack at all:

- Daily digest cron (Worker → `#builtby-installs`: "3 new domains this week")
- Alert only when a **known** install goes stale for 30+ days
- Alert when a **new** domain appears and isn't in your project list

### Privacy & client sites

The ping collects:

- `host` (e.g. `bloomfilter.com`)
- optional `project` slug you set
- `theme`, embed `version`

It does **not** collect user IDs, cookies, or page paths. It's comparable to a favicon request or "powered by Stripe" badge phone-home — still disclose in your embed docs / client agreements if required.

For strict CSP clients, use the static HTML fallback in `docs/` (no external script, no ping).

---

## Repo layout

```
assets/           # Lottie JSON (from handbook-website)
src/              # Web component + loader
dist/             # Built embed (gitignored)
worker/           # Cloudflare registry
docs/             # Embed snippets
index.html        # Local preview (light + dark)
```

## License

Proprietary — Handbook. Client embed is public; assets are Handbook brand.
