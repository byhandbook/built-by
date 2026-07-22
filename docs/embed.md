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

- **`dark`** — white label. Full app icon frame with hover Lottie (same pattern as handbook.com nav). Use on dark footers.
- **`light`** — black label and full black app icon. Use on light footers. Static icon only (no Lottie).

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
