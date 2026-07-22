# Built by Handbook

A small footer credit for sites Handbook designs and builds. Drop in a script tag, pick light or dark, and it renders a 14px **built by handbook** label with the Handbook mark. On dark backgrounds, the mark animates on hover.

This repo hosts the embed script and assets. It is meant for **client site footers**, not the Handbook marketing site.

## Embed

```html
<div data-handbook-credit data-theme="dark" data-project="client-slug"></div>
<script async src="https://builtby.byhandbook.com/v1/credit.js"></script>
```

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-theme` | `light` or `dark` | `light` = black text on light footers. `dark` = white text on dark footers (hover Lottie). |
| `data-project` | optional string | Slug for analytics (`utm_campaign`). |
| `data-mark-size` | pixels (optional) | Logo size. Default `24`. Range 16–40. |
| `data-text-size` | pixels (optional) | Label size. Default `16`. Range 12–22. |

The credit links to [byhandbook.com](https://byhandbook.com) with UTM parameters (see below).

## Link parameters

Every credit is a link. The URL is built automatically:

| Parameter | Value | Purpose |
|-----------|--------|---------|
| `utm_source` | `builtby` | Identifies traffic from this embed |
| `utm_medium` | `footer` | Identifies placement |
| `utm_campaign` | your `data-project` value | Identifies which client site (only if `data-project` is set) |

**Example** with `data-project="bloomfilter"`:

```
https://byhandbook.com/?utm_source=builtby&utm_medium=footer&utm_campaign=bloomfilter
```

**Example** without `data-project`:

```
https://byhandbook.com/?utm_source=builtby&utm_medium=footer
```

If you use Google Analytics on byhandbook.com, these show up under acquisition reports for footer credit clicks. That is usually enough to see which installs drive traffic — no separate dashboard required at small scale.

## Local preview

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The preview page shows light and dark variants side by side.

Production build:

```bash
npm run build
```

Output:

- `dist/v1/credit.js`
- `dist/v1/assets/hb-hover-w.json`

Deploy the **`dist`** folder to Cloudflare Pages. Files will be served at `/v1/credit.js` on your custom domain.

## Deploy

Hosting lives on **`builtby.byhandbook.com`** so it stays separate from the main site on `byhandbook.com`.

### 1. Cloudflare Pages (recommended)

1. In Cloudflare Dashboard → **Workers & Pages** → **Create** → **Connect to Git**
2. Select the `byhandbook/built-by` repository
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy, then add custom domain: **`builtby.byhandbook.com`**
5. In DNS for `byhandbook.com`, add a CNAME: `builtby` → your `*.pages.dev` hostname (Cloudflare usually does this when you attach the domain)

After deploy, verify:

- `https://builtby.byhandbook.com/v1/credit.js`
- `https://builtby.byhandbook.com/v1/assets/hb-hover-w.json`

**Version path:** Client embeds use `/v1/credit.js`. Run `npm run build` — the bundle is staged under `dist/v1/` automatically. Point Cloudflare Pages at the `dist` output directory.

### 2. Test on a real page

Paste the embed snippet into any site footer (or a static HTML file). Use `data-theme` to match the footer background. Click through and confirm the byhandbook.com URL includes the UTM params you expect.

### 3. Registry worker (optional)

The embed can send a one-time-per-session ping (`host`, `theme`, optional `project`) to a Cloudflare Worker for an install list. This is **optional** — the embed works without it. See [`worker/`](./worker/) if you want that later at higher volume. You do not need it to ship v1.

## Project structure

```
src/        Web component and loader
assets/     Lottie animation
dist/       Production bundle (generated)
worker/     Optional install registry (Cloudflare)
docs/       Additional embed notes
```

## License

© Handbook. The Handbook mark and name are brand assets. Client use is limited to the provided embed as agreed in project terms.
