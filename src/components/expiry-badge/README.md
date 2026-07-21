# ExpiryBadge

Color-graded expiration pill showing days/hours until expiry.

Use `thresholds` or `band` to control classification, `variants` to remap individual bands, and `formatDays` to replace the compact DTE label. Date/day visibility, pulse behavior, size, and the generated accessible label are independently configurable.

Use `thresholds` or `band` to control classification, `variants` to remap individual bands, and `formatDays` to replace the compact DTE label. Date/day visibility, pulse behavior, size, and the generated accessible label are independently configurable.

Bands (`far` → `near` → `imminent` → `expiring`) auto-derive from DTE and map to existing `Badge` variants:
- `>30d` → `outline` (neutral)
- `7–30d` → `warning` (amber)
- `1–7d` → `destructive` (red)
- `≤1d` → `destructive` + `animate-pulse`

## Usage

```tsx
<ExpiryBadge expiry={Date.now() + 5 * 86_400_000} />
<ExpiryBadge expiry={exp} daysToExpiry={0.4} thresholds={[60, 14, 2]} />
<ExpiryBadge expiry={exp} showDate showDays />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expiry` | `number` | — | Expiration in epoch ms. |
| `daysToExpiry` | `number` | derived | Days until expiry; clamped to `>= 0`. |
| `thresholds` | `[far, near, imminent]` | `[30, 7, 1]` | DTE band thresholds (descending). |
| `band` | `ExpiryBadgeBand` | auto | Override the auto band. |
| `showDate` | `boolean` | `false` | Render the formatted date. |
| `showDays` | `boolean` | `true` | Render `Dd` / `Dh` pill. |
| `dateFormat` | `string` | `"M/d/yy"` | `date-fns` pattern. |
| `pulseOnExpiring` | `boolean` | `true` | Pulse when `band === "expiring"`. |
| `size` | `"medium" \| "large"` | `"medium"` | Badge size forwarded to `Badge`. |
| `className` | `string` | — | Merged last via `cn()`. |

## Show flags

| `showDate` | `showDays` | Visible content | `aria-label` |
|:---:|:---:|---|---|
| `false` | `true` | `5d` | `Expires in 5d` |
| `true` | `true` | `7/25/26 5d` | `Expires 7/25/26 in 5d` |
| `true` | `false` | `7/25/26` | `Expires 7/25/26` |
| `false` | `false` | `5d` (fallback) | `Expires in 5d` |

## Accessibility

The `aria-label` is built from the **actually-visible** content, so screen readers never announce a duration that isn't on screen (e.g. with `showDate` only, the label is just `Expires <date>`). Color is never the only signal — the label always conveys the time-to-expiry.

## Boundaries

Band boundaries are exclusive at the upper edge: `dte === 30` falls into `near`, `dte === 7` into `imminent`, `dte === 1` into `expiring`. `dte` is clamped to `>= 0`, so already-expired contracts render as `expiring` / `0d` rather than negative.
