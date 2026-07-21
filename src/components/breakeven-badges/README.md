# BreakevenBadges

Pill row of breakeven underlying prices, formatted with `NumericText`.

## Customization

Use `precision`, `currency`, `size`, `variant`, and `overflowVariant` for the standard presentation. `renderValue` replaces only the value content, while `label`, `emptyContent`, and `ariaLabel` customize surrounding copy without losing list semantics.

## Usage

```tsx
<BreakevenBadges values={[412.5, 387.5]} />
<BreakevenBadges values={breakevens} format="number" max={4} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `values` | `number[]` | — | Breakeven prices. |
| `format` | `"currency" \| "number"` | `"currency"` | `NumericText` format. |
| `currency` | `string` | `"USD"` | Currency code when `format="currency"`. |
| `max` | `number` | `6` | Max badges before showing `+N`. |
| `label` | `ReactNode` | `"BE"` | Prefix label. `null` to hide. |
| `variant` | `BadgeProps["variant"]` | `"outline"` | Badge variant. |
| `className` | `string` | — | Merged last via `cn()`. |

## Accessibility
- The outer `<span>` exposes `role="list"` with `aria-label="Breakeven prices"`;
  each badge is `role="listitem"`.
- The `+N` overflow badge carries `aria-label="N more breakevens not shown"` so
  assistive tech announces context rather than just "plus N".

## Edge Cases
- Empty `values` renders a `No breakevens` placeholder.
- `max=0` is degenerate but supported: only the label and a `+N` overflow show.
- Duplicate values are safely keyed via `${index}-${value}`.
