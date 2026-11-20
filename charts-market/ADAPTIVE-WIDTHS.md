# Adaptive candle and volume widths

## Independent OHLC tick width

`MarketChartPresentation.bars?: {tickWidth?: number}` is also available as
`TechnicalChartView.appearance.bars.tickWidth` and `MarketChart.presentation`.
The optional scalar accepts finite **0.5–5 CSS pixels inclusive**. Invalid values
are rejected by existing constructor/runtime presentation validation even on a
chart type that ignores the option. No new composite forwarding is necessary.

Omission preserves the legacy OHLC tick width (`candles.wickWidth`) and inset
endpoints exactly. An explicit width affects only the two horizontal OHLC ticks;
the high–low stem retains its existing width and path. Open extends left to the
stem and close extends right from it, at their unmodified supplied prices.
Flat (`butt`) caps keep the stroke ends inside the horizontal bar footprint.
Tick line caps/width are scoped with Canvas save/restore. Incomplete dashes and
direction colors are inherited unchanged.

Adaptive ticks use the same exact time center and width as the shared geometry
above, without the legacy stem-width inset. Thus each tick retains a positive
half-slot length even at sub-device-pixel spacing. Their requested stroke width
is vertical thickness and is not reduced to the horizontal slot width. Existing
antialiasing and plot clipping still apply. Proportional ticks retain the legacy
snapped stem center and unchanged body-width span, centered on that stem. Neither
mode changes the high–low path, price/time scales, observations or slot spacing.

MyCharts' host mapping is now: candle Thin/Thick adaptive gaps **2/1px**, wick
width **1px**; OHLC gap **1px** and stem **1px** in both presets, with
`bars.tickWidth` **1/2px**. Line widths remain **1/3px**. These settings do not
enter version-1 saved state or supplied financial request identities; the host
owns saved selections. This local follow-up requires its own immutable release
and exact consumer version/lock approval before adoption.

The existing Price series thickness stories compare these presets in light/dark
desktop/narrow and dense views. Canvas regression tests cover legacy omission,
stroke widths/endpoints/caps, fractional slots/DPR1/2, equal open/close, one-sided
and zero-length wicks, and unchanged line/candle paths.

Adaptive sizing is opt-in runtime presentation. Existing consumers, including compact Chart Boards that omit these options, keep their historical geometry.

```tsx
import {TechnicalChartView, type MarketChartPresentation} from 'aapaetsch-charts-market';

const widths = {
  candles: {widthMode: 'adaptive', gap: 2},
  volume: {widthMode: 'adaptive', gap: 2},
} satisfies MarketChartPresentation;

<TechnicalChartView
  {...existingSuppliedChartProps}
  appearance={{...existingAppearance,
    candles: {...existingAppearance.candles, ...widths.candles},
    volume: {...existingAppearance.volume, ...widths.volume}}}
/>;
```

Apply these settings only to the intended chart surface after publication and exact consumer dependency/lock approval. Leave existing compact-board settings unchanged. A complete public-entrypoint example is in `examples/adaptive-supplied-chart.tsx`.

## Public contract and precedence

Both `MarketChartPresentation.candles` and the new `MarketChartPresentation.volume` accept:

| Field | Default | Behavior |
| --- | --- | --- |
| `widthMode` | `"proportional"` | `"adaptive"` opts into shared time-scale slot sizing. |
| `gap` | `2` in adaptive mode | Target edge-to-edge gap in CSS pixels, finite range **0–32 inclusive**. Ignored by proportional sizing. |

`TechnicalChartView.appearance`, `MarketChart.presentation`, engine creation options and `engine.setPresentation()` use this same public presentation contract. Invalid modes and nonfinite, negative or greater-than-32 gaps are rejected before the engine changes its presentation. Provided scalars are validated even when their mode ignores them.

In proportional mode, candle bodies keep the original `bodyRatio` / `maximumWidth` behavior: default ratio 0.7, cap 14 CSS px, floored whole-CSS-pixel body width and minimum 1 CSS px. Volume keeps its original ratio 0.7, cap 12 CSS px and minimum 1 CSS px. Explicit `widthMode: "proportional"` has the same behavior as omission. Existing candle `wickWidth` is retained.

In adaptive mode, `bodyRatio` and `maximumWidth` do not size candle bodies, and neither the candle nor volume legacy cap applies. Wide slots can therefore produce bodies and volume bars wider than 100px. Setting adaptive mode for only one family affects only that family. Equal candle/volume gaps produce identical horizontal boundaries at the same timestamp in every volume pane, including price overlays and volume accompanying line charts.

## Slot geometry, DPI and dense zoom

Let `S` be current time-scale slot spacing, `G` the configured gap, and `R` the engine's Canvas device-pixel ratio (at least 1). Adaptive width is:

```
width = min(S, max(1 / R, S - G))
left  = timestampCoordinate - width / 2
```

When `S >= G + 1/R`, the target gap holds exactly in CSS coordinates. Fractional spacing remains fractional. Candle bodies and volume use the same helper, center and edges; they do not independently floor widths or round coordinates. This gives deterministic shared pixel alignment while keeping the exact time-scale coordinate centered. Canvas antialiasing can affect the perceived edges at fractional physical pixels.

When a target gap cannot fit, a one-device-pixel body takes priority and the gap shrinks. If even one device pixel does not fit inside a slot, width equals the subpixel slot spacing, the gap becomes zero, and neighboring mathematical slots do not overlap. Several subpixel observations can contribute to the same physical display pixel; the renderer does not aggregate or change their data. Adaptive wicks are centered on the same coordinate and bounded to the body width. Hollow/incomplete borders are inset inside those boundaries; a degenerate flat one-pixel body retains a visible fill instead of disappearing.

Spacing comes from the shared time scale, never the distance to the next observed bar. Missing observations leave reserved UTC/calendar slots empty. An irregular host calendar retains its own ordinal slot semantics across closed sessions. The renderer does not infer cadence or widen a bar across a missing session.

## Runtime behavior and limits

Widths are derived during every draw. Pan, user wheel/keyboard zoom, resize, fit/latest, direct visible-range/viewport setters and presentation updates repaint the existing engine. Accepted current-bar revisions and theme refreshes retain the same geometry for the same time scale. No width state is added to saved version-1 documents or financial request identities.

Pane clipping, volume heights/zero baseline, axis units, direction colors and volume opacity (0.25) are unchanged. Missing, nonfinite, zero and negative volume still produce no volume rectangle. Empty and single-bar views remain supported; edge bars can be clipped by the existing plot boundary. Supplied calculation mode still invokes no financial formulas or provider acquisition. Exact source evidence and controlled range/history responsibilities are unchanged.

Geometry/regression coverage includes legacy defaults, gap/mode validation, sparse calendars, fractional spacing, wide slots, sub-2px spacing, DPR1/2/3, hollow flat candles, overlay/dedicated/line volume, runtime forwarding and unchanged identities. Synthetic Storybook examples provide comparison, narrow, multi-chart and runtime/native-DPI inspection. This is a local publication candidate. Publication, consumer installation/deployment and real cached product acceptance remain separate gates.
