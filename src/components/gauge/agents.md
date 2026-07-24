# Gauge

A radial dial/gauge primitive — sibling of `Progress`. Pure inline SVG, no
charting dependencies.

## Props

```ts
interface GaugeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gaugeVariants> {
  value: number;                       // current value
  min?: number;                        // default 0
  max?: number;                        // default 100
  variant?: "full" | "semicircle";      // default "full" (270° dial)
  thresholds?: { value: number; color: string }[];
  color?: string;                      // CSS color for active arc + needle, default "currentColor"
  trackColor?: string;                 // default "hsl(var(--muted))"
  label?: React.ReactNode;             // auto-formatted when omitted
  valueFormat?: "number" | "percent";  // default "number"
  animate?: boolean;                   // default true
  needleLength?: number;              // fraction of radius, default 0.78
  strokeWidth?: number;                // default 8
  size?: "sm" | "md" | "lg";           // viewBox 80 / 120 / 160
}
```

Exports: `Gauge`, `GaugeProps`, `GaugeVariant`, `GaugeSize`, `GaugeThreshold`,
`gaugeVariants`.

## Dependencies

- `class-variance-authority` (CVA) — already in the kit.
- `cn()` from `../../lib/utils`.
- `formatNumber` / `formatPercent` from `../../lib/number-utils` (default label
  formatting only).

No new packages introduced.

## Styling Decisions

- **Pure inline SVG** with `vectorEffect="non-scaling-stroke"` so strokes stay
  crisp across responsive viewBox sizes (80 / 120 / 160).
- **`currentColor` default** for the active arc and needle so a consumer can
  colorize the dial by wrapping it in a `text-positive` / `text-negative`
  container, in line with the kit's token-driven theming strategy.
- **Threshold zones** render as colored arc segments laid on top of the track
  (in front of `trackColor`, behind the active value arc). Sort order is
  computed from the threshold boundaries ascending; a final segment is
  appended automatically when the last boundary is below `max`.
- **Animation**: a small `requestAnimationFrame` tween (400ms, easeOutCubic)
  transitions the needle from the previous value to the target. We intentionally
  did NOT reuse `useAnimatedProgress` from `progress-shared` because that hook
  is geared toward looping/auto-play tweens rather than one-shot value tweens,
  and reusing it would require neutering most of its options.
- The outer wrapper is a `<div>` (not an `<svg>`-only component) so that a
  centered label can sit below the dial with normal flex layout.
- Color tokens are read as CSS color strings (`color`, `trackColor`,
  `threshold.color`). To use a kit token, pass e.g.
  `color="hsl(var(--positive))"`.
- Accessibility: the wrapper carries `role="meter"` plus `aria-valuenow`,
  `aria-valuemin`, `aria-valuemax`.

## Variant Geometry

- `full` — 270° dial starting at 225° (bottom-left) sweeping clockwise through
  0° (top) to 135° (bottom-right). Classic automotive gauge.
- `semicircle` — 180° arc from 270° (left, 9 o'clock) sweeping clockwise to
  90° (right, 3 o'clock), with the viewBox height halved to remove the empty
  bottom area.

## Maintenance Notes

- Values outside `[min, max]` are clamped silently; the displayed label still
  reflects the clamped value (the consumer is responsible for showing
  "below/above" indicators).
- SVG arc rendering breaks if start and end angles coincide exactly; we nudge
  the active arc's end angle with a `0.01°` epsilon in `clampAngle`. Keep this
  in mind when adjusting sweep math.
- `thresholds` is optional; when omitted the gauge falls back to a plain
  track + active arc + needle.
- Avoid passing extremely large `strokeWidth` values — they will visibly clip
  past `r` (`size/2 - 12`). The default (`8`) is safe at all sizes.
- Animation can be disabled with `animate={false}` for static/SSR contexts.

## Related

- `Progress` (linear + circular) — the family this is a sibling of.
- `SegmentedProgress` — the other sibling built alongside this component.