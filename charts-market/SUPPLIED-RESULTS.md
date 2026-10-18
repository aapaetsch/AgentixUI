# Supplied market results — integration and publication review

The first-party Canvas/SVG engine renders producer-owned results without browser
financial calculations. No provider acquisition or scheduling is included.
`calculationMode` defaults to `internal`; existing exports and version-1 saved
documents remain supported. This document describes the local publication
candidate, not an installed or published product dependency.

## Public contract

```tsx
import {
  TechnicalChartView, createCalculationRequests, suppliedStudyDefinitions,
  type CalculationRequest, type SuppliedCalculationResults,
} from "aapaetsch-charts-market";
import "aapaetsch-ui-kit/globals.css";
import "aapaetsch-charts-market/styles.css";

<TechnicalChartView
  symbol={symbol} interval={interval} data={rendererBars}
  state={state} onStateChange={setState}
  calculationMode="supplied"
  calculationIdentity={authoritativeDatasetIdentity}
  suppliedResults={results}
  onCalculationRequest={request => requestProducerResults(request)}
  onVisibleRangeChange={range => linkUtcRange(range)}
  theme="midnight"
/>;
```

The host owns fetching, validation, permissions, aborting requests and persisting
exact decimals. `calculationIdentity` must change for every revised dataset,
listing, source, session, adjustment basis or currency. Missing identity renders
no supplied calculations. IDs must be unique across indicators, profiles and
drawings within one chart. Different charts can reuse IDs safely.

`createCalculationRequests(identity, symbol, interval, state)` produces the same
requests emitted by `onCalculationRequest`. The callback runs after mount and
after calculation inputs change, not on result delivery or pane resizing. React
StrictMode may replay mount effects; hosts must deduplicate by requestKey.

Each `CalculationRequest` contains `kind: indicator | profile | drawing`,
`instanceId`, `symbol`, `interval`, JSON `settings`, optional numeric UTC
`anchors`/`dateRange`, and an opaque `requestKey`. The key is stable JSON of the
host identity and calculation inputs. It is not a digest, auth token or versioned
storage codec; echo it unchanged. Indicator settings contain definitionId,
version and parameters. Profile settings contain range, rows, tickSize and
valueAreaPercent; dateRange selects the visible or explicit session/fixed range.
Derived drawing settings contain type, version and parameters, plus anchors and
viewport range. Geometric drawings require no calculation request.

`suppliedResults: SuppliedCalculationResults` is keyed by instance/profile/drawing
ID. Its discriminated `SuppliedCalculationResult` union reuses `IndicatorPoint`
and `VolumeProfileResult`:

- Indicator: `{kind: 'indicator', points: [{time, values: {lineId: number|null}}]}`.
- Profile: `{kind: 'profile', profile: {rows, totalVolume, poc, vah, val, provenance}}`.
- Drawing: `{kind: 'drawing', points: [{time, value: number|null}], derivedValues?}`.

Every result includes requestKey, `status: loading | available | partial |
unavailable`, provenanceLabel, and optional approximate, warning,
coverageSummary and stale. Only matching key AND kind can render. Available and
partial render their supplied values; loading and unavailable render status only.
An old key is rejected immediately in Canvas inputs, SVG, summaries and tables.
There is no automatic result retention. A host may explicitly retain a matching
result with `stale: true`, which displays a Stale label. It cannot relabel an old
dataset as current by merely setting stale. Settings/anchor edits invalidate a
result; transient drawing drafts suppress the old derived line until committed.

## Producer parameter and line mapping

The supplied default registry is `suppliedStudyDefinitions`, metadata with a
deliberately throwing internal calculate method. It never estimates a missing
output. `availableIndicators` can replace metadata and line IDs for another
producer. calculate/createRuntime/formatValue callbacks are bypassed in supplied
mode. Historical builtInIndicators retain their internal vocabulary separately.

| Family | Supplied definition ID | Parameters | Supplied values keys |
|---|---|---|---|
| SMA | sma | period | sma |
| EMA | ema | period | ema |
| Bollinger | bb | period, standard_deviations (string) | upper, middle, lower |
| RSI | rsi | period | rsi |
| MACD | macd | fast_period, slow_period, signal_period | macd, signal, histogram |
| ATR | atr | period | atr |
| Stochastic | stochastic | period, smooth_k, smooth_d | k, d |
| ADX | adx | period | adx, plus_di, minus_di |

The product adapter must explicitly map producer names to these line IDs, or
provide matching definitions. Product `RenderLine` may already flatten outputs;
group by study instance and UTC time into IndicatorPoint.values. Do not use the
internal stochastic `smooth` parameter to represent independent smooth_k/smooth_d.
The internal Bollinger ID is `bollinger-bands`; supplied default uses `bb`.
No compatibility with an unpublished service output naming scheme is assumed.

Product visible_range/session/anchored profiles map to UI range
visible/session/fixed. Explicit timeRange is required for session/fixed. Map
anchor→timeRange.from; the host supplies the session/end boundary. Map rows,
Number(value_area_percent), show_poc→showPoc. Map bins low/high/volume to
priceFrom/priceTo/volume and set legacy upVolume/downVolume to zero. A row's
optional authoritative `volume` takes precedence for width; it disables split
painting. The table leaves directional fields unavailable for such rows.
Never fabricate up/down or bid/ask allocation. Directional fields, when supplied,
are producer data, not measured bid/ask claims.

Supply totalVolume, poc, vah and val directly. There is no summation, binning,
POC selection or value-area expansion in supplied mode. The product's current
RenderProfile lacks totalVolume; extend the product-owned adapter only after its
separate integration approval to pass the producer total. Do not reconstruct it
here. `provenance: 'bar-derived-approximation'` is preserved even for supplied
rows; all summaries visibly call it approximate. `supplied-levels` is the other
existing provenance value; provenanceLabel adds the source/method description.

Session and anchored VWAP map to drawing IDs with type `session-vwap` and
`anchored-vwap` respectively; supply producer points and derivedValues.latest.
Session boundaries and resets are entirely producer-owned. `fixed-range-vwap`
is also accepted as a derived drawing. No VWAP, deviations or bands are inferred.
Unsupported derived drawings show an unavailable label until supplied results
arrive. Only a supplied centerline and supplied derived-value labels are drawn;
regression/position/band-specific visual geometry is not reconstructed.

## Numeric, viewport and drawing adapters

At the product boundary validate decimal strings, then Number(value), rejecting
nonfinite values. These numbers are lossy display coordinates. Keep authoritative
decimal tables/CSV and provenance in the product; this package's table uses exact
JavaScript number strings and never promises Decimal fidelity. OHLC/study rows
are bounded to the latest 100 source bars; profile rows and VWAP points have their
own supplied tables. Study legends and table cells read the same supplied points.
Axis ticks/badges use presentation formatting and collision rules.

For economic UTC instants use Date.parse(iso)/1000 → MarketTime numeric seconds.
Preserve daily exchange session dates separately as OhlcBar.sessionDate; numeric
time and date-only MarketTime are distinct APIs. OhlcBar.incomplete marks hollow,
dashed candles and labeled readouts/tables. Line mode still uses close values.
Absent volume is undefined and never inferred.

`onVisibleRangeChange` exposes the engine's immediate inclusive economic range;
it carries numeric UTC seconds for numeric input. The host owns its 300-ms
debounce and conversion from a product's exclusive bar-end bound. To apply a
linked range, replace state.viewport.visibleRange and clear logicalRange. Keep
rightOffsetBars at zero for compact calendar-aligned boards; the engine spaces
actual bars by logical index, not empty calendar days. Charts with different
missing-session sets need a host calendar alignment policy. No synthetic prices
are generated. Controlled state viewport persistence retains the historical
140-ms UI debounce; the direct callback is independent of that debounce.

Product geometric types map trend_line→trend-line,
horizontal_line→horizontal-line, vertical_line→vertical-line,
rectangle→rectangle. Map anchors `{time,price}` to numeric UTC seconds and
rendererNumber(price); map color/width to parameters.color/lineWidth. Carry
currency and adjustment_policy in DrawingState.extensions or product-owned
metadata, and filter for the chart's current currency/basis before rendering.
No automatic split or OHLC anchor transformation runs in supplied mode.

`onStateChange(next, {type:'drawing'})` carries controlled drawing documents and
selection; lower-level MarketChart.onDrawingsChange also supplies create/move/
resize/style/delete/undo/redo metadata. Geometry supports keyboard creation,
arrow-key edits, pointer/touch handles, delete and bounded undo/redo. Selection
and hover remain outside history. External document replacement rebases history.
`serializeTechnicalChartViewState`/`parseTechnicalChartViewState` are version 1;
`serializeDrawingClipboard`/`parseDrawingClipboard` retain existing formats.
The product's version-3 Decimal drawing codec is separate: convert only at the
boundary and persist its own authoritative layout; never claim codec identity.

## Scope, colors and accessibility

`theme: light | dark | midnight` and `technicalChartThemes` expose per-view HSL
CSS variables. Root style overrides also propagate to this view's portaled
dialogs, dropdown menus and tooltips through context; no document-global theme
mutation occurs. Existing host-root styling remains the default when theme is
omitted. Canvas reads background→--background, text→--muted-foreground,
border/grid→--border, positive/negative→--positive/--negative,
primary→--primary. A changed theme/style refreshes the engine and restores
controlled data/state. Study colors use instance.colors[lineId] then definition
line.color. Profiles use upColor/downColor/pocColor. These must be CSS colors
supported by Canvas; prefer explicit hex for independent study overrides.
CSS foreground/popover/muted/accent/input/ring and chart-1…5 tokens are included
in palettes. Engine axis badges choose black or white foreground from their
background luminance. Forced-colors substitutes Canvas/CanvasText/GrayText/
LinkText; up candles remain hollow so direction has a non-color distinction.

Drawings have per-instance DOM IDs. Pane actions and separators are focusable;
Tab can exit the drawing selection cycle. Pointer inspection has no live-region
chatter; deliberate keyboard inspection and committed drawing actions announce.
Reduced-motion utilities disable transitions. Narrow tools float over the
surface. Set appearance.height and hide header/commands/drawingRail/footer/indicators/profiles
features for compact boards. Place maximized views in a positioned container;
host fullscreen/window ownership stays external.

PNG/CSV are optional onRequestExport intents. This package does not yet expose a
composited image-capture API. The host must capture Canvas plus SVG and include
source/method attribution; capturing only Canvas omits drawings. MIT LICENSE and
NOTICE travel with the package. No TradingView wrapper, source or attribution is
introduced by this implementation.

## Publication review

Candidate version: `aapaetsch-charts-market@0.1.0-beta.1-supplied.20261015.1`.
Main and subpath exports preserve ESM and add CJS build artifacts; all public core types/functions
above are available at root and /core. suppliedStudyDefinitions is available at
root and /indicators. TechnicalChartView/Props/theme exports are at root;
MarketChart/Props/Handle remain at root. Historical /drawings, /overlays,
/controls and /workspace remain. Compiled stylesheet is /styles.css.

Validation logs, browser evidence, exact tarball SHA-256/SHA-512, file inventory,
license and installed peer/dependency versions are recorded under
`.chart-supplied-validation/`. Build output is inside charts-market/dist.
The immutable candidate is identified by its artifact hash, not baseline HEAD:
this checkout intentionally includes preserved pre-existing uncommitted work.
Root manifests/lockfiles and product/OpenBB sources are read-only.

Publication approval must name the exact packed artifact hash/version and beta
tag, include this review's limitations and peer resolution, and authorize registry
publication/provenance separately. Product exact-version/resolved-lock review,
download and installation remain separate gates. No publication, dependency
download, install, provider call or financial release is performed here.

### Icon package compatibility

Current builds use the original aapaetsch-icons dependency with native ESM and CommonJS exports. No icon peer-package repair is required. Earlier immutable publication evidence remains historical; current candidate identity and consumer results must be regenerated after this migration.
