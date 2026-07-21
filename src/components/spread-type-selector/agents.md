# SpreadTypeSelector

Pick a multi-leg spread template (`single` / `vertical` / `calendar` /
`straddle` / `strangle` / `iron-condor` / `butterfly`).

## Props
- `value: SpreadType` (controlled).
- `onChange: (value) => void` — called only when a *different* template is
  selected. Clicking the currently-active toggle is a no-op (Radix emits an
  empty string, which is ignored), so the controlled `value` keeps the toggle
  visually `on` with no flicker.
- `options?: readonly SpreadType[]` — restrict the available templates.
  @default `DEFAULT_SPREAD_OPTIONS`.
- `disabled?: boolean` — forwarded to `ToggleGroup`; every item is disabled.
- `className?: string`.

## Empty State
When `options` is an empty array, the component renders a muted
`<span className="text-xs text-muted-foreground">No spreads</span>` instead
of the toggle row. The `className` prop is still applied so consumers can
match the surrounding layout.

## Dependencies
- `ToggleGroup` + `ToggleGroupItem`. No new variants.

## Styling Decisions
- Uses `toggleGroupVariants` defaults with `size="sm"`, wrapped with
  `flex-wrap` so longer label lists collapse gracefully in narrow tickets.
- **Size propagation:** this library's `ToggleGroupItem` does **not** inherit
  the parent `ToggleGroup` size — it defaults to `md`. Each item therefore
  passes `size="sm"` explicitly so heights/borders line up with the `sm`
  container. If a future `ToggleGroup` change adds automatic size inheritance,
  the per-item prop can be dropped.

## Maintenance Notes
- `SpreadType` and `DEFAULT_SPREAD_OPTIONS` are exported so consumers can
  reuse the type and restrict options without re-stating the list.
- The component emits *only* the chosen template — mapping a `SpreadType` to
  leg skeletons is the parent ticket's job (keeps this primitive dumb).