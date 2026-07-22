# Built by Handbook

A small footer credit for client sites. The Handbook mark, a short label, and a link to [byhandbook.com](https://byhandbook.com). Nothing else.

This repo holds the embed script. Client sites load it from our CDN — they never touch this repository.

---

## Add it to a site

Drop this in the footer. Match `data-theme` to the footer background.

```html
<div data-handbook-credit data-theme="dark" data-project="client-slug"></div>
<script async src="https://builtby.byhandbook.com/v1/credit.js"></script>
```

Use a short slug for `data-project` — something like `bloomfilter` or `acme`. It tags the link for analytics so we can see which site a visit came from.

**Dark footer** → `data-theme="dark"` (white text)

**Light footer** → `data-theme="light"` (black text)

That is the whole integration for most sites.

---

## Options

| Attribute | Required | Default | What it does |
|-----------|----------|---------|--------------|
| `data-theme` | yes | — | `light` or `dark`. Sets label color. The icon stays the same. |
| `data-project` | recommended | — | Client slug. Becomes `utm_campaign` on the byhandbook.com link. |
| `data-mark-size` | no | `24` | Icon size in pixels (16–40). |
| `data-text-size` | no | `16` | Label size in pixels (12–22). |
| `data-animate` | no | off | Hover animation. Loads extra files on first hover. Leave off for client sites. |

---

## How it works

1. The `<div>` is a placeholder. It carries the options.
2. The script loads asynchronously. It does not block the page.
3. The script replaces the placeholder with a link: Handbook icon + **built by handbook**.
4. The icon is an inline SVG. No font files. No images. No cookies. No background requests.
5. The link goes to byhandbook.com with standard UTM parameters (`utm_source=builtby`, `utm_medium=footer`, and `utm_campaign` when `data-project` is set).

**Default weight:** one request, about 3.4 KB gzipped.

**With `data-animate`:** the hover animation loads only after someone hovers the credit. About 230 KB additional, total. We do not recommend this on client sites.

---

## Privacy

This embed is for clients who had a good experience working with Handbook and want to give credit where it is due.

It is intentionally minimal. The script renders a static mark and a link. It does not load custom fonts on the host site. It does not track users, set cookies, or phone home. The only outbound connection beyond the script itself is when someone clicks through to byhandbook.com — the same as any normal link.

If a client prefers not to use it, that is fine. This is a courtesy, not a requirement.

---

## Deploy

Client sites load the embed from **`builtby.byhandbook.com`**. That subdomain serves static files built from this repo. The main Handbook site on `byhandbook.com` is separate and unchanged.

### How the pieces connect

```
GitHub (byhandbook/built-by)
        │
        │  push to main
        ▼
Cloudflare Pages  ──builds──▶  dist/v1/credit.js  (+ optional animate assets)
        │
        │  custom domain
        ▼
builtby.byhandbook.com/v1/credit.js
        │
        │  <script async src="…">
        ▼
Client site footer
```

Cloudflare Pages watches the GitHub repo. On every push to `main`, it runs `npm run build` and publishes the `dist/` folder. Client embeds point at the resulting URL. When we update the script here, every client site picks up the new version on their next page load — no action needed on their end.

### First-time setup

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the **`byhandbook/built-by`** repository.
4. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Framework preset:** None
5. Click **Save and Deploy**. Wait for the first build to finish.
6. Open the project → **Custom domains** → **Set up a custom domain**.
7. Enter **`builtby.byhandbook.com`**. Cloudflare will add the DNS record if `byhandbook.com` is already on Cloudflare (it should be).
8. Verify these URLs return 200:
   - `https://builtby.byhandbook.com/v1/credit.js`
   - `https://builtby.byhandbook.com/v1/credit-animate.js` (only if using `data-animate`)
   - `https://builtby.byhandbook.com/v1/assets/hb-hover-w.json` (only if using `data-animate`)

After that, every push to `main` redeploys automatically.

### Smoke test

Paste the embed snippet into any HTML page. Confirm the icon and label render, the theme looks right, and clicking the link opens byhandbook.com with the UTM parameters you expect.

---

## Develop locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build      # outputs to dist/v1/
npm run typecheck
```

---

## License

© Handbook. The Handbook mark and name are brand assets. Client use is limited to the provided embed as agreed in project terms.
