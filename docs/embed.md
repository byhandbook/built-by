# Embed snippets

## Script + mount point (recommended)

Drop this in the client footer. Use `data-theme="light"` on light backgrounds, `data-theme="dark"` on dark backgrounds.

```html
<div data-handbook-credit data-theme="dark" data-project="client-slug"></div>
<script async src="https://builtby.handbook.com/v1/credit.js"></script>
```

### Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-theme` | `light` \| `dark` | White or Handbook black (`#0D0D0D`) |
| `data-project` | string (optional) | Slug for registry + UTM campaign, e.g. `bloomfilter` |

## Web Component (manual)

```html
<handbook-credit theme="dark" project="bloomfilter"></handbook-credit>
<script async src="https://builtby.handbook.com/v1/credit.js"></script>
```

## Static fallback (strict CSP / no third-party scripts)

Copy the markup from `docs/static-snippet.html` when a client blocks external JS.

## Local preview

```bash
npm install
npm run dev
```

Open the Vite preview page to test light/dark variants.

## Registry ping

When the credit loads, it sends **one ping per browser session** to the registry worker:

```
GET https://builtby.handbook.com/r?host=example.com&theme=dark&v=1&project=bloomfilter
```

This records which domains are running the embed — not who clicked it.

List installs (after deploying the worker):

```
GET https://builtby.handbook.com/installs
```

Protect this route before production (Cloudflare Access, API token, etc.).
