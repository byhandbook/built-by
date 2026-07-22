# Built by Handbook

A small footer credit for client sites. The Handbook mark, a short label, and a link to [byhandbook.com](https://byhandbook.com).

```html
<div data-handbook-credit data-theme="dark" data-project="client-slug"></div>
<script async src="https://builtby.byhandbook.com/v1/credit.js"></script>
```

Match `data-theme` to the footer background. Use a short slug for `data-project` — it tags the link for analytics.

**Dark footer** → `data-theme="dark"` (white text)

**Light footer** → `data-theme="light"` (black text)

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
5. The link goes to byhandbook.com with UTM parameters: `utm_source=builtby`, `utm_medium=footer`, and `utm_campaign` when `data-project` is set.

**Default weight:** one request, about 3.4 KB gzipped.

**With `data-animate`:** the hover animation loads only after someone hovers the credit. About 230 KB additional. Not recommended on client sites.

---

## Privacy

This embed is for clients who had a good experience working with Handbook and want to give credit where it is due.

It is intentionally minimal. The script renders a static mark and a link. It does not load custom fonts on the host site. It does not track users, set cookies, or phone home. The only outbound connection beyond the script itself is when someone clicks through to byhandbook.com — the same as any normal link.

If a client prefers not to use it, that is fine. This is a courtesy, not a requirement.

---

## License

© Handbook. The Handbook mark and name are brand assets. Client use is limited to the provided embed as agreed in project terms.
