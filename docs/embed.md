# Embed reference

## Snippet

```html
<div data-handbook-credit data-theme="dark" data-project="client-slug"></div>
<script async src="https://builtby.byhandbook.com/v1/credit.js"></script>
```

## Web component

If you prefer the element directly:

```html
<handbook-credit theme="dark" project="client-slug"></handbook-credit>
<script async src="https://builtby.byhandbook.com/v1/credit.js"></script>
```

## Themes

Both themes use the same icon: the Handbook app icon (black square, white mark) with hover Lottie inside. `data-theme` only changes the **label color**.

- **`light`** — black “built by handbook” text. Use on light footers.
- **`dark`** — white “built by handbook” text. Use on dark footers (the icon’s black fill blends into the footer; the white ring and mark stay visible).

Typography is **FT System Mono**, loaded from the embed CDN.

## Sizing (optional)

```html
<div
  data-handbook-credit
  data-theme="light"
  data-mark-size="24"
  data-text-size="16"
></div>
```

| Attribute | Default | Range |
|-----------|---------|--------|
| `data-mark-size` | `24` | 16–40 px |
| `data-text-size` | `16` | 12–22 px |

## Analytics

The credit links to `https://byhandbook.com/` with:

- `utm_source=builtby`
- `utm_medium=footer`
- `utm_campaign={project}` when `data-project` is set
