# GreeksDisplay

Compact, customizable readout of an option's Greeks (Δ / Γ / Θ / ν / ρ).

## Props
- `greeks: Greeks` — any field omitted is hidden.
- `layout?: "grid" | "inline"` — @default `"grid"`.
- `labelStyle?: "symbol" | "text" | "both"` — @default `"symbol"`.
  - `symbol` — Greek letter only (Δ).
  - `text` — semantic name only (Delta).
  - `both` — symbol + name (Δ Delta).
- `labelPosition?: "leading" | "stacked"` — @default `"leading"`.
  - `leading` — label beside value (grid = 2-col, inline = inline-flex pair).
  - `stacked` — label above value; turns `grid` into a horizontal auto-cols
    stat-tile row and `inline` into a wrapping tile strip.
- `labelCase?: "upper" | "lower" | "title"` — @default `"title"`. Applies to
  the `text` / `both` label parts only (the symbol itself is unaffected).
- `labelMuted?: boolean` — @default `true`. `true` = `text-muted-foreground`,
  `false` = `text-foreground` (high-contrast dashboards). When not muted and
  tooltips are on, the label gets a dotted underline to signal hover.
- `size?: "sm" | "md" | "lg"` — @default `"md"`. Scales label + value
  typography together.
- `signed?`, `colorize?` — passed to `NumericText`.
- `showTooltips?: boolean` — @default `true`.
- `glossary?: Partial<Record<keyof Greeks, ReactNode>>` — override tooltip text.
- `className?: string`.

## Dependencies
- `NumericText` (existing) for value formatting + colorization.
- `Tooltip` (Radix) — wraps each Greek label for glossary tooltips.
- `lib/finance-types` `Greeks`.

## Styling Decisions
- Label typography uses a `SIZE_TOKENS` lookup that keeps label + value scales
  in sync across `sm`/`md`/`lg`. Avoid ad-hoc font classes per render path.
- Symbol labels use `font-mono`; the `text`/`both` name part uses `font-sans` so
  the word reads as text, not a symbol glyph. The `both` name part is rendered
  at one step smaller than the symbol and at `opacity-70` so the symbol still
  leads visually without the name competing.
- `labelMuted=false` flips the label to `text-foreground`; the dotted
  underline is only added in this case (muted labels already signal
  secondary). This keeps tooltips discoverable without over-decorating the
  default muted look.
- `stacked` reshapes both layouts: `grid` becomes `grid-flow-col auto-cols-fr`
  (one column per Greek, label above value), `inline` becomes a wrapping flex
  of stacked mini tiles. Useful for dashboard stat rows / table summary cells.
- 2-col grid layout uses `items-baseline` so the label and value share a
  text baseline regardless of label weight.

## Accessibility
- Every label begins with an `sr-only` semantic name (`Delta`, `Gamma`, …),
  regardless of `labelStyle`. The Greek symbol alone is announced
  inconsistently by screen readers, so the sr-only name keeps a stable
  accessible name like "Delta 0.42".
- Visual `text`/`both` name parts are `aria-hidden` (they are redundant with
  the sr-only name) so SRs do not announce them twice.
- Stacked and inline cells carry `role="group"` + `aria-label` = Greek name.
- Tooltip triggers are `<span>`s wrapped by Radix `TooltipTrigger asChild`,
  which adds `tabindex={0}` automatically, so glossary tooltips are
  keyboard-focusable.

## Maintenance Notes
- `GREEK_ORDER` controls output order (Δ Γ Θ ν ρ) and per-Greek precision.
- `GREEK_NAMES` provides both the sr-only and visible-text labels; keep it
  in sync with `GREEK_ORDER` if a Greek is ever added.
- `SIZE_TOKENS` centralizes font-size + gap per size; add new sizes here only.
- `DEFAULT_GREEK_GLOSSARY` is exported so consumers can layer additional
  explanations onto a custom `glossary` prop without re-stating the defaults.
- Empty `greeks` renders an em-dash rather than an empty block.
- `0` values are included (`0 != null`); `null`/`undefined` are dropped.