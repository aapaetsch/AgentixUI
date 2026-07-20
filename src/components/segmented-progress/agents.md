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
  `--chart-1` … `--chart-5` defined in `src/globals.css`. We resolved this at
  module-load time via `resolveToken()` and wrap each token in `hsl(...)`.
  When the tokens are unavailable (SSR before paint, custom theme without
  them) the segments fall back to `currentColor`, letting a consumer colorize
  via a parent text color.
- **Remainder segment**: when `max` is greater than the sum of segment values,
  an empty `bg-muted/60` segment is appended so the bar visually fills the
  full `max`. This is the standard "allocated vs. unallocated" pattern in
  portfolio / capacity dashboards.
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
- The default chart palette is resolved lazily on first import. If a theme is
  applied after import (rare, but possible in HMR scenarios) the palette will
  not re-resolve; consumers should pass explicit `color` in those cases.

## Related

- `LinearProgress` — sibling for single-value linear progress.
- `Gauge` — sibling for radial dials.