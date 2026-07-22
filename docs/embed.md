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

- **`dark`** — white text and mark. Use on dark footer backgrounds. Hover Lottie enabled.
- **`light`** — black (`#0D0D0D`) text and mark. Use on light footer backgrounds.

## Analytics

The credit links to `https://byhandbook.com/` with:

- `utm_source=builtby`
- `utm_medium=footer`
- `utm_campaign={project}` when `data-project` is set
