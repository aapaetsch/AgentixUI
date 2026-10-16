# Host-controlled calendars and gaps

`MarketChart` and `TechnicalChartView` accept two optional runtime props:

```ts
type MarketTimeAxis =
  | { mode: "compressed" }
  | { mode: "utc"; domain: VisibleRange; intervalSeconds: number }
  | { mode: "calendar"; times: readonly MarketTime[] };
interface MarketTimeGap { from: MarketTime; to: MarketTime }

timeAxis?: MarketTimeAxis;
discontinuities?: readonly MarketTimeGap[];
```

Omit `timeAxis` to retain historical session-compressed observation indexes and
right-offset behavior. `discontinuities` can also split strokes in compressed mode.
There is no cadence detection. The host owns calendar acquisition, session rules,
holidays, UTC starts/ends and these immutable controlled inputs.

## Shared coordinates

`utc` uses elapsed UTC seconds. The host supplies an ascending finite `domain`
(the available navigation extent) and a positive `intervalSeconds` (one display
unit, used for bar width, inspection tolerance and keyboard drawing nudges).
For example, a five-minute chart uses `300`. Zooming can show smaller windows.
No OHLC or financial value is interpolated.

`calendar` uses an explicitly supplied ascending, unique, nonempty time grid.
Each grid entry occupies one display unit, even if an individual chart has no
observation there. Time coordinates between grid entries interpolate UTC geometry;
the renderer does not infer additional sessions or extrapolate beyond the grid.
Supply the union/common host grid to every linked chart. A one-entry grid can
display one observation; use an extent with at least two entries for navigation.

At equal plot sizes, the same axis/domain, visible range, axis side and pane
configuration place identical UTC instants at identical x coordinates regardless
of observation density. At differing widths, their normalized plot coordinates
match. Both modes initialize and fit to the host extent, retain empty visible
windows, and clamp pan/zoom to that extent. `rightOffsetBars` remains serialized
but has no geometric effect in these modes: include desired whitespace in the
host domain/grid. Geometry is independent of the observed dataset's first/last bar.

Inputs accept `MarketTime` (numeric UTC seconds, business-date strings or structured
business dates). Calendar/UTC inverse coordinates and range callbacks normalize to
numeric UTC seconds; observation timestamps themselves are never rewritten.

```tsx
const axis: MarketTimeAxis = {
  mode: "utc",
  domain: { from: firstAllowedUtc, to: lastAllowedUtc },
  intervalSeconds: 300,
};
<TechnicalChartView
  {...props}
  calculationMode="supplied"
  timeAxis={axis}
  discontinuities={hostGaps}
  state={{ ...state, viewport: withMarketVisibleRange(state.viewport, sharedRange) }}
  onVisibleRangeChange={range => {
    if (range) updateSharedRangeOnlyIfChanged(range);
  }}
/>
```

`withMarketVisibleRange(viewport, inclusiveRange)` returns a new viewport with
`logicalRange` removed and other settings preserved. Calendar modes also prioritize
`visibleRange` over a stale `logicalRange` defensively. User pan/zoom callbacks
carry inclusive calendar bounds with `logicalRange: undefined`. Controlled prop/data
updates emit no calendar viewport callbacks; repeated identical ranges are suppressed.
The host should compare normalized UTC bounds before updating linked state and
apply its own debounce. The composed view retains its existing 140ms settled state
callback. Compressed mode keeps historical logical-range behavior.

`VisibleRange` callbacks and inputs are **inclusive display bounds**. A product's
exclusive data end is a separate contract: use its supplied bar-start/bar-end
metadata to select the last included start for a requested display window and to
map callbacks back to an exclusive end. Do not subtract a guessed trading interval
or infer the next session. The kit never changes the host's provider query bounds.
The continuous axis can also display an explicit empty extent after the final bar.
For `from === to`, the viewport expands to a one-display-unit window around that
instant, clamped to the host extent. Callbacks report that actual display window.

## Gaps, isolated points and drawings

A gap is the **open UTC interval** `(from, to)`. Its endpoint observations remain
valid. Declare only observation-free interiors; producer observations remain
authoritative in tables/exports even if the host supplies contradictory gap metadata.
Intervals must have finite ascending bounds; overlap is allowed. No gaps are
derived automatically from a chart's interval label or timezone.

Price line/area/baseline strokes and fills break across a declared gap. Supplied
study lines and supplied drawing paths (including VWAP) break at gaps and nulls.
Isolated price/study samples use a small marker; isolated supplied paths use an
ellipse. Their neighboring prices are never synthesized. Candles, bars and volume
use actual timestamps. Study coordinates and inspection match by their own UTC
sample times rather than an OHLC array index.

All SVG drawing primitives/handles are clipped out of gap interiors (with a three
CSS-pixel footprint retained for boundary markers) and to the price
pane when the composed view requests that clip. Pointer hit testing ignores those
interiors. Geometric drawing endpoints may use any valid calendar coordinate;
price values are host/user supplied. Keyboard drawing nudges move by one host display
unit, rather than skipping to the next sparse observation. Existing compressed
nudges retain observed-bar stepping. Geometry changes invalidate drawing coordinates
even if the visible times and price scale do not change.

Whitespace is geometry only. It never enters `OhlcBar[]`, study calculation inputs,
volume arrays, `visibleData`, inspected OHLC, accessible tables or exported data.
Pointer and programmatic crosshairs clear on missing calendar slots and declared
gaps; they cannot retain stale inspected prices there. Inspection snaps only within
half a display unit of a real observation. Drawing coordinate conversion may return
an unobserved time, which must not be treated as an observed OHLC sample.

## Public exports and persistence

| Surface | Additions / mapping |
|---|---|
| Root and `/core` | `MarketTimeAxis`, `MarketTimeGap`, `validateMarketTimeGeometry`, `crossesMarketTimeGap`, `isMarketTimeInGap`, `withMarketVisibleRange` |
| `MarketChartProps`, `TechnicalChartViewProps` | `timeAxis`, `discontinuities` |
| `MarketChartEngineOptions` | Same runtime geometry |
| `MarketChartEngine` | Optional `setTimeAxis`, `setDiscontinuities`, `shiftTime` (alternative engines remain source-compatible) |
| `MarketSeriesRendererContext` | Optional `timeToCoordinate`, `isTimeSegmentContinuous`; legacy `logicalToCoordinate(index)` still maps **observation indexes** |
| `DrawingRendererContext` | Optional `isTimeSegmentContinuous` |
| `DrawingLayerProps` (`/drawings`) | Optional `discontinuities` for direct low-level usage |
| `LogicalTimeScale` (root) | `setAxis`, `timeToLogical`, `indexToCoordinate`, `coordinateToTime`, `visibleTimes`, `shiftTime`, `isCalendar`, `maximum`, `isRealtime` |

Custom price renderers must use the supplied coordinate and continuity callbacks
when connecting observations. Custom drawing renderers remain subject to SVG gap
clipping; they should use the continuity callback for supplied paths as well.

`validateMarketTimeGeometry` returns diagnostic strings. Engine setters reject
invalid geometry without mutating the previous axis/gaps. Components show a readable
error; invalid controlled updates do not replace the last valid engine geometry.

No historical serializer, schema or version changed. `TechnicalChartViewState`
remains version 1; viewport `visibleRange` persists as before and external linking
clears local logical indexes. `timeAxis` and `discontinuities` are runtime host
inputs and are reapplied after deserializing. Drawing state/clipboard serializers
and opaque extensions are unchanged. The product's exact Decimal/state codec remains
its own adapter. Supplied request identities/results and financial-calculation guards
are unchanged; geometry never causes browser financial calculations.

Styles remain `aapaetsch-charts-market/styles.css` plus
`aapaetsch-ui-kit/globals.css`. No new stylesheet, theme token, peer dependency,
provider, persistence layer or financial formula is introduced.
