# SegmentedProgress

A horizontal / vertical bar divided into proportional labeled segments.
Sibling of `LinearProgress`. Pure CSS / flexbox — no SVG, no charting deps.

## Props

```ts
interface Segment {
  value: number;
  color?: string;     // explicit CSS color; cycles chart palette when omitted
  label?: string;
}

interface SegmentedProgressProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof segmentedProgressVariants> {
  segments: Segment[];
  orientation?: "horizontal" | "vertical"; // default "horizontal"
  size?: "xs" | "sm" | "md";              // default "sm" (bar thickness)
  rounded?: boolean;                       // default true
  showValues?: boolean;                   // default false
  max?: number;                           // defaults to sum of segment values
  gap?: number;                           // px gap between segments, default 0
}
```

Exports: `SegmentedProgress`, `SegmentedProgressProps`, `Segment`,
`segmentedProgressVariants`.

## Dependencies

- `class-variance-authority` (CVA) — already in the kit.
- `cn()` from `../../lib/utils`.
- `formatNumber` from `../../lib/number-utils` (value labels only).
- `resolveToken` from `../../lib/color-utils` (resolves `--chart-*` tokens).

No new packages introduced.

## Styling Decisions

- **Layout**: pure flexbox. The bar is a flex row (horizontal) or flex column
  (vertical). Each segment uses `flexGrow: value / total` and `flexBasis: 0`
  so segments always sum to the full bar width regardless of `value` magnitudes.
- **Default palette**: segments without an explicit `color` rotate through
  `--chart-1` … `--chart-5` defined in `src/globals.css`. The palette is
  resolved inside the component via `useMemo` (rebuilding on mount when the
  CSS has painted, and on runtime theme switches via a `MutationObserver`
  on `document.documentElement`). When the tokens are unavailable (SSR before
  paint, custom theme without them) the segments fall back to
  `currentColor`, letting a consumer colorize via a parent text color.
- **`max` semantics**: when `max` is greater than the sum of segment
  values, an empty `bg-muted/60` remainder segment is appended so the bar
  visually fills the full `max` (the standard "allocated vs. unallocated"
  pattern). When `max` is **less** than the sum, `max` is effectively
  ignored — segments fill the bar completely with no remainder. A dev-mode
  `console.warn` is emitted in that case so callers notice the invalid
  configuration.
- **Rounding**: the outer wrapper uses `rounded-full overflow-hidden`, so when
  `rounded` is true the corners follow the bar ends naturally. Inner segments
  only round on the outermost ends to avoid color bleed past the container.
- **Labels (`showValues`)**: when enabled, a flex row/column of label cells is
  rendered alongside the bar. Each cell shares the same `flex-grow` proportion
  as its segment and is colored to match, giving a quick legend above/left of
  the bar without an explicit legend component.
- **Track**: the bar surface itself is `bg-secondary/40` so empty space (e.g.
  the remainder) remains visually distinct from the surrounding surface.

## Maintenance Notes

- `segments={[]}` is handled gracefully — when `max > 0`, a single muted
  segment is rendered; when `max` is also zero/undefined the bar is empty
  (zero height visually) but still renders its container so layout doesn't
  collapse.
- Negative segment values are clamped to `0` via `Math.max(0, value)` in the
  proportion calculation; this is documented behavior, not an error.
- `gap` is in pixels because flex gap units don't compose cleanly with our
  `flexBasis: 0` approach in all browsers when using relative units.
- The chart palette is resolved inside the component (not at module load) and
  is recomputed on mount and whenever the theme toggles (via a
  `MutationObserver` on the root element's `class`/`data-theme`). Consumers
  can also pass explicit `color` per segment to bypass the palette entirely.
- The outer container uses `role="presentation"` with an `aria-label`
  summarizing the segments. `meter` was misleading because an aggregate of
  segments is not a single meter reading and ARIA `meter` expects
  `aria-valuenow/min/max` that don't map cleanly onto a multi-segment bar.
- Empty `segments` with `max > 0` renders a single muted bar (handled by
  the empty-state branch). The remainder segment is gated on
  `safeSegments.length > 0` so the empty state never renders two
  overlapping muted divs.

## Related

- `LinearProgress` — sibling for single-value linear progress.
- `Gauge` — sibling for radial dials.