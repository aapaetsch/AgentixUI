# StrikesNavigator

Strike ladder with ITM/ATM/OTM striping + quick-jump input.

## Props
- `strikes: number[]` — sorted ascending.
- `atmStrike: number` — spot/underlying for ITM/ATM/OTM classification.
- `selectedStrike?: number`, `onSelectStrike?: (strike) => void`.
- `atmTolerance?: number` — @default `0.5`.
- `viewportRows?: number` — @default `20`. Height of the scroll viewport in
  rows (i.e. `viewportRows * rowHeight`). All rows are rendered; no windowing.
- `rowHeight?: number` — @default `28`.
- `autoScrollToSelected?: boolean` — @default `true`.
- `className?: string`.

## Dependencies
- `ScrollArea` (existing), `Input` (existing), `lucide-react` icons.
- No virtualization lib — all rows are rendered directly. Strips targeted by
  the options chain rarely exceed ~80 rows; even 200 rows at 28px is fine for
  modern browsers.

## Styling Decisions
- ITM (`< atm`) → `bg-positive/5`, ATM → `bg-primary/10` (semibold), OTM →
  muted. Color only signals moneyness; selection uses an inset ring.
- The rows container has `role="listbox"` and each row `role="option"` with
  `aria-selected`. Roving tabindex: only the selected row (or the first row
  when nothing is selected) is in the tab order.

## Maintenance Notes
- A previous implementation tried to window rows by listening to `onScroll`
  on a `<div>` nested inside `ScrollArea`. That div was the *content*, not
  the scroll container (Radix's Viewport scrolls), so `scrollTop` never
  updated and the auto-scroll `scrollTo` was a no-op. Windowing was removed
  entirely; all rows render and `scrollIntoView` is used for auto-scroll.
- `classify` is type-agnostic (`strike < spot` → itm). If you need
  call-specific ITM (strike < spot) vs put-specific ITM (strike > spot),
  filter the `strikes` array upstream rather than adapting this component.
- Keyboard model: ArrowUp/ArrowDown move focus + selection (wraps);
  Home/End jump to first/last; Enter/Space select. No new public props were
  added for this — it is built in.