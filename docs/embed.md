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

Typography uses **Helvetica/Arial at 400 weight** with the same letter-spacing as Handbook body text (`0.03em`). The embed does **not** load custom font files on client sites — that keeps third-party weight and FOUT off their pages. It will not be pixel-identical to Ftsystem on handbook.com, but it matches the secondary style closely without shipping a font.

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
