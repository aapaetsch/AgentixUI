# BreakevenBadges

Pill row of breakeven underlying prices.

## Props
- `values: number[]`
- `format?: "currency" | "number"` — @default `"currency"`.
- `currency?: string` — @default `"USD"`.
- `max?: number` — @default `6`; overflow summarized as `+N`.
- `label?: ReactNode` — @default `"BE"`. Set to `null` to hide.
- `variant?: BadgeProps["variant"]` — @default `"outline"`.
- `className?: string`.

## Dependencies
- `Badge` for the pill; `NumericText` for value formatting.

## Styling Decisions
- Uses `Badge variant="outline"` so breakevens look secondary next to put/call
  status — they are reference markers, not state indicators.
- `role="list"` + `role="listitem"` per badge so screen readers announce them
  as a list of breakevens.
- The inner `NumericText` uses `align="left"` so the formatted value sits
  naturally inside the shrink-wrapping pill (right-aligned tabular figures add
  trailing space inside a small badge).
- The `+N` overflow badge carries `aria-label={`${N} more breakevens not shown`}`
  so screen readers announce context instead of "plus N".

## Maintenance Notes
- Empty `values` renders a friendly `"No breakevens"` placeholder rather than
  nothing — keeps card layouts stable when the strategy has no breakevens
  (e.g. a naked long call with insufficient premium info).
- `max=0` is a degenerate but supported edge case: no badges render, only the
  label plus a `+N` overflow badge equal to `values.length`.
- Duplicate breakeven prices are safe — keys are `${i}-${v}` so the leading
  index disambiguates them.