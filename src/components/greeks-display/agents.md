# GreeksDisplay

Compact readout of an option's Greeks (Δ / Γ / Θ / ν / ρ).

## Props
- `greeks: Greeks` — any field omitted is hidden.
- `layout?: "grid" | "inline"` — @default `"grid"`.
- `signed?`, `colorize?` — passed to `NumericText`.
- `showTooltips?: boolean` — @default `true`.
- `glossary?: Partial<Record<keyof Greeks, ReactNode>>` — override tooltip text.
- `className?: string`.

## Dependencies
- `NumericText` (existing) for value formatting + colorization.
- `Tooltip` (Radix) — wraps each Greek label for glossary tooltips.
- `lib/finance-types` `Greeks`.

## Styling Decisions
- 2-col grid layout for compact vertical display in tables/cards; inline layout
  for tight stat strips.
- Label uses `font-mono` and a dotted underline (when tooltips enabled) to
  signal hover affordance without competing with primary actions.
- Inline layout binds each label+value pair in an `inline-flex` span
  (`role="group"`, `aria-label` = Greek name) so the outer `gap-x-3` separates
  cells rather than blurring label/value pairs together. Grid layout keeps
  label/value as direct grid children to preserve the `auto_1fr` columns.

## Accessibility
- The visible Greek letter (`Δ`, `Γ`, …) is announced inconsistently by screen
  readers, so each label includes an `sr-only` semantic name (`Delta`, `Gamma`,
  …) before the letter. Inline cells additionally carry `role="group"` +
  `aria-label` for a stable per-cell accessible name.
- Tooltip triggers are `<span>`s wrapped by Radix `TooltipTrigger asChild`,
  which adds `tabindex={0}` automatically, so glossary tooltips are
  keyboard-focusable.

## Maintenance Notes
- `GREEK_ORDER` controls output order (Δ Γ Θ ν ρ) and precision per Greek.
- `GREEK_NAMES` provides the sr-only semantic names; keep in sync with
  `GREEK_ORDER` if a Greek is ever added.
- `DEFAULT_GREEK_GLOSSARY` is exported so consumers can layer additional
  explanations onto a custom `glossary` prop without re-stating the defaults.
- Empty `greeks` renders an em-dash rather than an empty block.
- `0` values are included (`0 != null`); `null`/`undefined` are dropped.