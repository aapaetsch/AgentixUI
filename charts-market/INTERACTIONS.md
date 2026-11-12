# Workspace interactions (opt in)

`aapaetsch-charts-market` owns navigation and pane gestures. These contracts are runtime presentation state; no provider, formula, acquisition, database or saved-document change is involved. Omit `interactions` to retain existing consumers and Chart Boards calendar behavior.

## Public contracts and callback mapping

All types below are exported from the package root and `/core`. React props are on `TechnicalChartViewProps` and `MarketChartProps`; methods are on `MarketChartHandle` (composite `chartApiRef`, low-level forwarded ref).

| Contract | Purpose / callback |
| --- | --- |
| `MarketChartInteractions` | `{mode: 'workspace', contextKey?: string, rightPaddingBars?: number, scrollOwner?: MarketChartScrollOwner}`. Compressed initial/Fit/Latest padding defaults to ten bars and is clamped to 0–150; pan can explore at most 150 blank slots. Host UTC/calendar domains retain their own geometry. |
| `MarketChartScrollOwner` | `getScrollTop()` and `scrollTo(top)` address the one explicit host workspace scroller. Optional `restoreScrollTop(top)` lets the host retain a restoration request until its intrinsic-height allocation commits. No ancestor lookup or host touch arbitration is needed. |
| `MarketChartInteractionState` | Optional controlled `paneScales: Record<paneId, MarketScaleOptions>` and `maximizedPaneId: string \| null`. Omit the state prop for local composite state. `onInteractionStateChange(next, metadata)` reports temporary values; never persist this object. |
| `MarketViewportCommand` | `{id: string \| number, viewport: MarketViewportOptions}`. Change the id for an external date/reset request, including requests with equal economic bounds. `viewportCommand` works on both components; imperative `setViewportCommand(viewport)` applies immediately. Empty viewport resets to Latest. |
| `resetPaneScale(paneId, metadata?)` | Restore that pane's supplied automatic/fixed domain. Footer Auto/Log and legacy `resetScale()` still address the price pane. Manual ranges are in the scale's transformed domain, retaining its mode and anchor. |
| `onPaneLayoutChange(panes, metadata)` | Composite-only valid local drafts with `phase: 'change'`, final `end`, or `cancel`. Retain the latest draft for Save during a drag; only final changes invoke `onStateChange` to commit pane preferences. Pointer cancellation restores the prior stack without a final intent. |
| `onStateChange(next, metadata)` | Final resize/reorder/collapse updates use existing `TechnicalPaneState`. Map renderer IDs to stable product IDs before saving size/collapse/order. Never save the temporary maximize projection. |
| `onViewportChange` / `onVisibleRangeChange` | Low-level full logical viewport / actual supplied economic bounds. Composite state changes retain logical coordinates. Economic callbacks are suppressed for blank-only views and pane/value-scale/layout actions. Multiple logical positions with equal economic bounds still emit logical state. |
| `MarketChartChangeMetadata` | Distinct `source: 'user' \| 'api' \| 'data' \| 'layout'`, optional gesture, phase and paneId. Gesture kinds include pan/wheel/pinch/time-scale/value-scale/pane-resize/pane-reorder/pane-collapse/pane-maximize/pane-restore/reset. Silent controlled setters do not manufacture user intent. |
| `TechnicalChartGeometry` / `onGeometryChange` | Existing `availableHeight`, `chromeHeight`, `plotHeight`, width and overflow remain. Workspace `renderedPlotHeight` is actual pane-stack/canvas extent (time axis included); `intrinsicHeight` is that extent plus natural chrome. `plotHeight` remains the resolved host available/minimum request. |

## One scroller, hidden inner wrappers and intrinsic allocation

The composite measures natural chrome and its live canvas-host allocation in the same DOM layout. Engine extent callbacks can precede React allocation commits; do not subtract a callback height from an older DOM content measurement. The optional low-level `MarketChart.canvasHostRef` exposes the allocation element for explicit composition without selector or ancestor lookup. Reading it does not transfer canvas/gesture ownership to the host. Repeated equal dimensions retain the bitmap; actual size or device-pixel-ratio changes resize it normally.

Keep the host's **available-height input independent of its content allocation**. For example, obtain `availableHeight` from the available workspace/card slot. Allocate the hidden inner wrapper from `geometry.intrinsicHeight ?? availableHeight`, while continuing to pass the original available height to `appearance.height`. The package measures natural content independently of that wrapper, so growing at minimums increases the document footprint and maximizing shrinks it without an allocation feedback loop.

```tsx
const owner = React.useMemo<MarketChartScrollOwner>(() => ({
  getScrollTop: () => workspace.current?.scrollTop ?? 0,
  scrollTo: top => { if (workspace.current) workspace.current.scrollTop = top },
  // Optional: retain target until onGeometryChange/host layout has committed.
  restoreScrollTop: top => { pendingRestore.current = top },
}), [])
const interactions = React.useMemo<MarketChartInteractions>(() => ({
  mode: 'workspace', rightPaddingBars: 10, scrollOwner: owner,
}), [owner])

// The sole scroll container belongs to the host; keep a plot-external gutter.
<div ref={workspace} style={{overflowY: 'auto', paddingRight: '1.5rem'}}>
  <div style={{height: geometry?.intrinsicHeight ?? availableHeight, overflow: 'hidden'}}>
    <TechnicalChartView
      {...suppliedChartProps}
      interactions={interactions}
      interactionState={temporaryState}
      onInteractionStateChange={setTemporaryState}
      onPaneLayoutChange={(panes, metadata) => {
        latestDraft.current = panes // Save reads this even during an active drag.
        if (metadata.phase === 'end') commitDisplayPreferences(panes)
      }}
      onGeometryChange={setGeometry}
      appearance={{height: availableHeight, heightMode: 'available',
        minimumPlotHeight: 280, navigation: 'integrated'}}
    />
  </div>
</div>
// In a layout effect after geometry/allocation commits, apply pendingRestore
// to workspace.current.scrollTop and clear it. This performs no chart action.
```

Keep size weights finite in 0.01–1000. In workspace geometry one weight corresponds to 100 CSS pixels before distributing surplus available space; supplied minimums always win. Growing a pane can increase the document instead of squeezing a neighbour below its minimum. Collapsed panes retain a 28px header and reorder through their reachable action menu. Expanded-pane reorder hit areas extend into their own plot, preserving the full 44px target without clipping above the chart or overlapping the next collapsed header. Visible resize and reorder handles have 44px targets; resize occupies the axis edge so it does not cover the next header's controls. Keyboard arrows and menu Grow/Shrink/Move actions are equivalent reachable alternatives. Maximize temporarily projects one expanded pane and disables saved stack mutations; Restore preserves the saved order/weights/collapse state and returns focus and workspace scroll. Removing a maximized pane restores the remaining stack.

## Input ownership and controlled updates

Plot drag pans only time. Plot vertical wheel zooms at its cursor anchor; Shift or dominant horizontal trackpad movement pans. Normalize both axes for pixel/line/page units before classification; ties are vertical. Time-axis drag/wheel scales time (Shift+wheel pans). The actual pane's value axis scales only that pane; Shift+drag translates its manual range. Value-axis double-click resets that pane; time-axis double-click fits history; noninteractive pane-header double-click toggles maximize. Ctrl/Meta+wheel remains browser zoom. Gutter and ordinary chrome scroll the workspace.

A plot touch remains undecided until 8 CSS pixels, then locks horizontal pan or vertical workspace scroll (ties vertical). Two plot fingers pinch around their midpoint and cancel long press/one-finger intent. Remaining fingers cannot resume a pan until a fresh sequence. A stationary 450ms long press inspects exact accepted timestamps; sparse/null studies never substitute neighbours. Axes and handles own immediately. Drawing tools and editable drawing handles retain priority. Pointer cancel, capture loss, blur and unmount clear gesture state/capture/timers without committing a drawing or leaving a pane drag active.

Keep `viewport.logicalRange` separately from clipped economic bounds. Normal controlled echoes acknowledge earlier emitted viewports; they do not move a newer local gesture, including delayed 300ms echoes. Use `viewportCommand` for intentional external Reset/Fit/date selections. Theme, sidebar resize and same-dataset accepted revisions retain historical anchors/manual scales. An optional interactions.contextKey supplies a stable **presentation-only** dataset/source/seed/history context plus layout-load epoch. It does not replace, synthesize or enter dataIdentity, dataRevision, calculationIdentity, financial request keys or atomic bars/results acceptance. Consumers whose canonical calculationIdentity changes on compatible cache-only recalculation should supply this key. Equal context + symbol/interval retains active pane drafts, manual scales and maximize across result identity refreshes; a changed context (or symbol/interval) deliberately resets temporary geometry. Without this opt-in key the existing data identity remains the fallback. Dataset identity, symbol or interval changes deliberately reset temporary geometry; stale data/result acceptance remains guarded by the existing revision contract.

Blank slots contain no OHLC, sessions, generated timestamps, indicator values, crosshair observations or requests. Pane interactions do not change supplied calculation identities, drawing history, warnings, source values or serializer version 1. Existing v1 documents round-trip without new fields. Product persistence, dependency adoption, deployment and acquisition-counter checks belong to the product workstream.

## Validation limits

Use the synthetic Workspace Interactions stories for repeatable input and public snapshots. Automated tests and desktop emulation cannot satisfy physical iPad Safari, real trackpad or physical-device pointer-cancellation acceptance. Those gates remain pending until executed on the actual devices; candidate evidence records precisely what was run. No publication or consumer installation follows from local validation.
# Range-sensitive timeline (opt-in)

Pass `appearance.timeline` to `TechnicalChartView`, or the identical
`presentation.timeline` to `MarketChart`/the engine. These are runtime options,
outside version-1 documents, calculation identities and supplied results.

```tsx
import {
  TechnicalChartView, type MarketTimelinePresentation,
  type MarketSessionRange, type MarketChartSnapshot,
} from 'aapaetsch-charts-market';

const sessions: MarketSessionRange[] = [{
  id: 'producer-session', from: 1773063000, to: 1773086400,
}]; // Host-supplied UTC seconds; never inferred from weekdays or 09:30.
const timeline: MarketTimelinePresentation = {
  range: 'auto', sessions, rightPaddingBars: 10, scaleControls: 'icons',
};
<TechnicalChartView {...suppliedChartProps}
  interactions={{mode: 'workspace', contextKey: 'same-dataset'}}
  appearance={{...appearance, timeline}}
  onStateChange={(next, origin) => {
    // Retain next.viewport.logicalRange on cache-only pan/zoom echoes.
    // Debouncing is supported; external date selection uses viewportCommand.
    saveControlledState(next, origin);
  }} />;
```

Omission preserves legacy calendar clamping, labels and text Auto/Log controls.
An empty `timeline: {}` enables range-sensitive labels and logical right space;
it does not enable icon controls. `range` defaults to `auto`, independent of bar
resolution: <=36 hours selects 1D, <=8 days 5D, <=45 days 1M, <=125 days 3M,
then 6M+. `range: '1D'|'5D'|'1M'|'3M'|'6M'|'1Y'|'all'` is an optional host hint.
The automatic estimate retains the visible logical span when its right portion
is blank; it creates no future timestamp. A fully blank window has no ticks.

1D uses 30-minute wall-clock ticks; 5D uses supplied session starts plus noon
and14:00 within those sessions. Missing `sessions` falls back explicitly to
first/last accepted OHLC observation per display day, never a missing-price
calendar slot or an official session open.
An empty sessions array suppresses that fallback. Intraday labels may interpolate
within supplied display geometry, including missing midday observations, without
creating OHLC rows. 1M/3M prioritize month starts and about every2/5 observed days;
For a calendar axis, include session boundary instants in the supplied `times`
grid when they fall outside observed candle bounds; a session label cannot be
placed beyond its host-owned display geometry. The synthetic fixtures include
these explicit axis-only coordinates, including missing-price session opens.
6M+ uses months and years. Boundaries use the first supplied coordinate of that
period. A year transition takes precedence over month/day/clock labels.
Collision thinning uses measured text width, and repeated clocks during fall DST
are printed once per display day. `timeZone` controls dates and DST; clocks use
24-hour `00:00`, never24:00. Crosshair labels retain date, year, seconds and zone.

`rightPaddingBars` defaults to10, bounded0..150 logical slots. Fit/Home show the
supplied domain plus this padding. Latest preserves horizontal span and returns
to the padded end; if the span is wider than that fitted domain, Latest restores
the fitted view instead of retaining extra blank space.
Plot pan may use up to150 additional slots, retaining zoom and manual value
scales; a fully blank window retains the last automatic domains too. No new
economic bounds, observation, session or earnings date is inferred there.
Explicit supplied future calendar anchors remain available to earnings/drawings.
Calendar updates preserve the logical window, remapping a known left anchor when
needed, and same-context data revisions/resize preserve it. Use a new contextKey
for a true dataset replacement. Existing gesture ownership/cancellation remains
shared: plot pan, bottom-axis stretch around its starting anchor, value-axis
scale, drawing hits and workspace scroll. Shift+Left/Right pans; +/- zoom; Home
fits and End returns to Latest. Ctrl/Meta browser shortcuts remain untouched.

`onVisibleRangeChange` emits only changed accepted OHLC bounds in this mode;
empty windows do not fabricate an economic range. `onViewportChange` carries
logical geometry even for calendar/UTC axes and can carry no visibleRange in
blank space. Old logical or economic-only acknowledgements are ignored; explicit
`viewportCommand` remains authoritative. Metadata uses existing `source`,
`gesture` (`pan`, `time-scale`, `keyboard`, etc.) and `phase` fields. Scale,
chrome, tick/padding configuration and layout edits emit no economic callback.
Hosts must treat these callbacks as cache-only navigation, never provider intent.

With `scaleControls:'icons'` the engine reserves an88CSSpx price-axis lane and
the composite puts two44CSSpx targets beneath it. Icons remain1rem; pressed
state, distinct icons, accessible names, focus rings and current-state tooltips
identify Auto/manual and linear/log. Host status/timezone/actions wrap to the
left. Native axis gestures/reset update the live snapshot used by these controls;
log switches retain nonpositive-value errors and clear stale manual overrides.
Alternative engines can return these optional read-only snapshot fields:

```ts
function observe(snapshot: MarketChartSnapshot) {
  snapshot.priceAxis; // {left,width,surfaceWidth,side} in surface-local CSS px
  snapshot.scale;     // actual price mode/autoScale/manualRange
  snapshot.timeTicks; // readonly MarketTimeTick[]: time,x,label,left,width,kind,source
}
// <MarketChart {...props} presentation={{timeline}} onSnapshotChange={observe}/>
```

The snapshot callback uses a current ref, retains the engine instance, and runs
after scale/layout/tick resolution. It may fire for inspection; deduplicate the
fields you consume instead of setting an entire snapshot into props each frame.
Custom snapshots may omit the new fields; icon layout then uses an88px fallback.
For accurate custom-engine alignment, return an88px priceAxis lane. Original
snapshots and custom engines remain type-compatible. No product DOM selectors
or second gesture implementation is needed. Synthetic stories live under
**Market Charts / Timeline Controls**. Physical-device and product adoption
verification remain separate from upstream browser emulation.

## Directional line annotations and a future ruler

`trend-line` and `horizontal-line` accept optional boolean
`parameters.extendLeft` and `parameters.extendRight`, also described by the
exported `MarketLineExtensionParameters` type from the root and `/drawings`.
The supplied renderer uses these audited geometric primitives without executing
financial or consumer renderer callbacks.

| Drawing | Omitted flags | Both false | Left/right |
| --- | --- | --- | --- |
| Trend line | Both false: saved two-anchor segment | Segment | Chronological screen direction, independent of anchor creation order; both true gives an infinite line clipped to the price pane |
| Horizontal line | Each omitted flag defaults true: legacy full-width line | A 6px diameter marker at its saved anchor, still pointer/keyboard selectable | Ray from the one saved anchor toward the chosen price-pane edge |

Equal-time trend anchors use a deterministic vertical convention: left extends
upward and right downward in screen space. Coincident anchors render a selectable
marker. Horizontal/reversed anchors produce finite geometry. Rendering and body
hit-testing share the same clipped primitives; handles stay on actual saved
anchors, including after reverse panning. Vertical lines and rectangles have no
extension controls.

The existing floating selection toolbar contains labeled **Extend left** and
**Extend right** buttons with `aria-pressed`, tooltips, visible keyboard focus and
44px minimum targets. They wrap at narrow widths. A completed toggle emits one
existing `style` drawing transaction, preserving ID and both anchor values. Shared
undo/redo, clipboard and generic drawing serialization retain the booleans.
The standalone horizontal DrawingToolbar can opt into the same controls with
onLineExtensionChange(changes: {extendLeft:boolean;extendRight:boolean}); commit
those flags through the host's existing style/history transaction. Existing
string/number style callback signatures remain compatible. Mixed-tool selections
do not gain irrelevant flags. Locked selections cannot toggle extension state.

```tsx
import {
  TechnicalChartView, type MarketTimeAxis, type MarketLineExtensionParameters,
  type DrawingState,
} from 'aapaetsch-charts-market';

const timeAxis: MarketTimeAxis = {
  mode: 'compressed',
  futureDisplay: {
    convention: 'utc-calendar', intervalSeconds: 86400, horizonMonths: 12,
  },
};
const parameters: MarketLineExtensionParameters = {
  color: '#64748b', lineWidth: 1, extendLeft: false, extendRight: true,
};
const line: DrawingState = {
  id: 'stable-host-id', type: 'trend-line', version: 1,
  points: [{time: 1767225600, price: 100}, {time: 1798761600, price: 120}],
  parameters, visible: true, locked: false,
};
<TechnicalChartView {...suppliedChartProps} timeAxis={timeAxis}
  state={state} onStateChange={(next, metadata) => {
    // Preserve logicalRange on normal controlled pan/zoom acknowledgements.
    // Existing shared drawing history emits final create/move/resize/style edits.
    setState(next);
  }} appearance={{...appearance, timeline: {rightPaddingBars: 10}}} />;
// External date/reset intent: chartApiRef.current?.setViewportCommand(viewport).
// Shared history: chartApiRef.current?.executeDrawingCommand({type:'undo'}).
// Example serialized parameters: {"extendLeft":false,"extendRight":true}.
```

See `CALENDAR-COORDINATES.md` for exact UTC convention, horizon, seam, mapping and
non-economic inspection semantics. A 1Y daily chart can pan/zoom to approximately
half its accepted observations plus twelve future calendar months; future space
is drawable without leaving the chart DOM. A fully future view retains date ticks
and drawings. Existing drawing/handle ownership, cancellation/capture cleanup,
manual price scales and controlled echo behavior continue through this mapping.
If a future-mode group movement or duplicate would put any anchor outside the
ruler, reject the whole translation rather than distorting the line/group by
moving only some anchors. A handle resize can intentionally move one anchor.
For direct `DrawingLayer` composition, pass
`futureDisplay={Boolean(timeAxis.futureDisplay)}` to enable bounded keyboard
ownership; `MarketChart` and `TechnicalChartView` derive this automatically. That
flag contains no dates or separate coordinate policy: all geometry still comes
from the engine port.

Product adoption is separate: strict private persistence must explicitly admit
optional booleans, preserve unchanged Decimal anchor strings/manual edits, and
keep display viewports separate from acquisition bounds. No product code,
database, provider, dependency or publishing operation follows from this API.

# Floating drawing editor and selected timeline (additive API)

This is an opt-in shared editor for one selected trend line, horizontal line,
vertical line or rectangle. Enable it only on the active editable chart instance.
Omitting `drawingEditor` preserves the existing contextual toolbar; supplying
`{active:false}` hides contextual editors on an inactive instance. Multi-selection
retains shared commands/history without a single-object toolbar. Default and
read-only Board consumers do not need to adopt it.

## Public integration

The package root and `/drawings` export `MarketDrawingEditorOptions`,
`MarketDrawingPresentation`, `MarketDrawingParameters`, `MarketDrawingText`,
`MarketDrawingStatistic`, `MarketDrawingFinancialStatistic`,
`MarketDrawingIntervalFamily`, `MarketDrawingIntervalRange`,
`MarketDrawingEditorPosition`, `MarketDrawingSuppliedStatistics`,
`MarketDrawingExactCoordinate`, `MarketEditableDrawing`, and
`marketDrawingGeometryKey`. Both `MarketChartProps` and
`TechnicalChartViewProps` accept `drawingEditor?: MarketDrawingEditorOptions`.

```ts
interface MarketDrawingEditorOptions {
  active: boolean;
  position?: {x:number; y:number} | null;
  onPositionChange?: (position:{x:number; y:number} | null) => void;
  timeZone?: string;
  statistics?: readonly MarketDrawingSuppliedStatistics[];
  statisticsContextKey?: string;
  onAlertIntent?: (drawingId:string) => void;
}
interface MarketDrawingSuppliedStatistics {
  drawingId: string;
  geometryKey: string;
  contextKey: string;
  values: Partial<Record<
    'price_range'|'percent_change'|'bars_range'|'date_time_range', string|null
  >>;
}
```

The editor timezone inherits the chart timezone, then UTC; a valid IANA override
is optional. Invalid timezone identifiers fall back to UTC. Position is fixed
viewport CSS pixels, independent of drawings/history. Keep it in host
account-session memory; clear it on account change. Null or Home/Reset returns
the toolbar to the upper center of its own chart. Pointer movement is local
until release; arrow keys move 4px, Shift+arrow 20px. Only the handle captures
pointer/touch input. Scroll, resize, visual-viewport changes, fullscreen changes
and chart/panel resize clamp the toolbar to the current visual viewport.

Example host wiring (persistence and supplied values remain host-owned):

```tsx
const [toolbarPosition, setToolbarPosition] =
  React.useState<MarketDrawingEditorPosition|null>(null);

<TechnicalChartView
  state={state}
  onStateChange={(next, metadata) => {
    setState(next);
    if (metadata.drawing && metadata.drawing.type !== 'selection') {
      // Use next.drawings plus metadata.drawing.exactCoordinates in
      // the host's existing validated authored-drawing save transaction.
    }
  }}
  calculationMode="supplied"
  drawingEditor={{
    active: isActiveEditableChart,
    position: toolbarPosition,
    onPositionChange: setToolbarPosition,
    statisticsContextKey: admittedDrawingResultContext,
    statistics: admittedDrawingResults,
  }}
  /* existing data, identity, timeAxis, appearance and interactions props */
/>
```

Use the existing shared drawing commands/handle for undo, redo, duplicate,
delete, lock, hide and explicit cancel. Selection metadata is transient, not an
autosave trigger. Quick color/width/dash changes preview locally and Apply
commits once. Settings Style/Text/Coordinates/Visibility are one draft and one
history entry on changed OK. Untouched OK does not add defaults or a transaction.
The dialog heading identifies the current draft name or friendly drawing type.
Closing returns focus to its connected Settings/Text/More trigger; blur or
disposed instances do not steal focus. A timezone change cancels the old draft
before local date fields can be reused under a different label.
Cancel, Escape, blur, selection/document replacement, explicit shared cancel and
unmount discard drafts and release capture. A shared cancel also clears pending
optimistic acknowledgements. Normal known delayed/out-of-order controlled echoes
retain the latest shared transaction. Unknown external documents/context changes
rebase to the host document. A host rejecting a transaction with identical old
bytes should issue the explicit cancel command before supplying its replacement.

Locked drawings remain selectable and unlockable; geometry/style/text edits are
disabled. Hide changes the existing visible flag; recover through the shared
object tree. The default bell is disabled and says “Drawing alerts — coming
later”. An optional host intent callback receives only the drawing ID and
creates no live alert in this library.

## Authored document and private DTO mapping

Public presentation lives under `DrawingState.parameters.presentation`.
Existing `parameters.color`, `lineWidth`, `dashStyle`, `extendLeft` and
`extendRight` stay authoritative. Top-level `name`, `visible` and `locked`
stay top-level. Omission preserves historical behavior and does not materialize
defaults merely through selection or opening settings.

| Private DTO | Shared drawing |
| --- | --- |
| color, width, presentation.line_style | parameters.color, lineWidth, dashStyle |
| extend_left, extend_right | parameters.extendLeft, extendRight |
| name, visible, locked | same top-level fields |
| presentation.start_cap, end_cap | presentation.startCap, endCap (trend only) |
| middle_point, price_labels | middlePoint (paired), priceLabels (except vertical) |
| text.font_size, vertical_alignment, horizontal_alignment | text.fontSize, verticalAlignment, horizontalAlignment |
| statistics_position, always_show_statistics | statisticsPosition, alwaysShowStatistics |
| statistics values; visibility family keys | same values and keys |

Every shared presentation entry in the table is under
`parameters.presentation`. Text also has `value`, six-digit hex `color`,
`bold`, `italic`; fontSize is an integer 8..48, value is plain text of at most
2000 Unicode codepoints. It is rendered as text, never HTML. Name is optional,
1..120 codepoints when supplied. Start/end caps are normal/arrow. Independent
left/right extensions preserve existing trend/horizontal defaults. Paired shapes
support a midpoint, statistics array, left/center/right/auto statisticsPosition,
and alwaysShowStatistics. Vertical lines do not expose price labels.

Statistics enum values are `price_range`, `percent_change`,
`change_in_pips`, `bars_range`, `date_time_range`, `distance`, `angle`.
Visibility is an optional object keyed by minutes/hours/days/weeks/months.
Each explicit range contains `{enabled:boolean,min:number,max:number}`, bounded
respectively to 1..59, 1..24, 1..366, 1..52, 1..12 with min <= max. An omitted
family preserves prior visible behavior. Ticks, seconds and ranges are visibly
unavailable in the editor and preserve historical visibility. Supported runtime
interval strings are positive integer suffix forms m/h/H/d/D/w/W/M. The host
retains strict validation, unknown/null rejection and its explicit DTO mapper;
do not persist an opaque renderer state.

## Exact coordinate edits and history

`DrawingPoint` adds optional `priceText:string` and `utcTimeText:string`.
Seed these from the host's exact authored anchor strings. Numeric `price` and
`time` remain the renderer projection. Price text uses the product's canonical
plain-decimal syntax:

```text
^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$
```

The maximum is 80 characters, with a finite numeric projection; no exponents,
plus sign, commas or noncanonical leading zeros. Two valid decimals projecting
to the same JavaScript number still create distinct history transactions.
Untouched numeric-only legacy anchors also retain their original document.

UTC text is a valid ISO instant ending Z or +00:00, with up to six fractional
digits and years 0001..9999, matching the private datetime DTO. Nonzero and
unknown offsets are rejected. Untouched text retains its original spelling and
microsecond precision. Newly
edited timezone/ruler inputs produce millisecond UTC. Local DST gaps are
rejected, and folds require an explicit UTC offset choice. Inputs outside the
engine's available drawing ruler are rejected. Only changed coordinates replace
their exact text. Completed active opt-in create/move/resize/duplicate/clipboard
transactions stamp missing authored text before history and callbacks: canonical
plain decimal from the coordinate projection, and millisecond UTC. Valid existing
text survives byte-for-byte. Previews, selection, cancellation and opt-out do not
materialize fields. An affected coordinate outside the Decimal/UTC contract rejects
the entire transaction with an accessibility announcement, without a callback or
history entry. This lets undo restore newly authored exact anchors after a later
sub-number-resolution edit. Ruler indices convert
immediately to durable timestamps and are never persisted.

Final callbacks include additive
`DrawingChangeMetadata.exactCoordinates?: MarketDrawingExactCoordinate[]`:

```ts
interface MarketDrawingExactCoordinate {
  drawingId:string; pointIndex:number; price?:string; utcTime?:string;
}
```

Undo/redo regenerates this metadata from the restored document. TechnicalChartView
forwards it as `TechnicalChartViewChangeMetadata.drawing`; MarketChart supplies it
as the existing second onDrawingsChange argument. Prefer valid point text or its
matching metadata entry in the private mapper, otherwise use the host's existing
unchanged-anchor comparison and numeric-gesture conversion. Never round-trip all
anchors through numbers simply because one style or coordinate changed.

UTC comparisons normalize Z/+00:00 and trailing fractional zeros lexically at
full microsecond precision. Equivalent server spellings keep history, drafts and
supplied geometry keys stable; .123456 and .123457 remain distinct. Comparison
never rewrites raw snapshots or commit metadata. Object-key ordering is ignored,
while drawing/point/statistic array ordering remains significant.

## Supplied statistics and timeline geometry

The four financial/date/bar statistics are formatted strings supplied by the
host, never calculated here. Admit a result only when its drawingId,
`marketDrawingGeometryKey(drawing)` and nonempty contextKey match the current
drawing and editor.statisticsContextKey. Geometry keys include exact coordinate
text. Clear/reissue results atomically on the host's admitted dataset/result
revision. Do not re-key old financial strings onto new geometry. Geometry drafts,
including invalid coordinate-edit intent, suppress financial results until the
draft ends. Unknown, missing, null or stale values display Unavailable. Distance
and angle alone are CSS-pixel geometry and respond to scale/viewport changes.
Pips remain unavailable until a registered convention exists. Long display
strings may use an ellipsis; the exact supplied text remains in title/ARIA.

`MarketChartEngine.logicalForTime?` and `timeForLogical?` expose the existing
engine ruler. `MarketChartSnapshot.timeAxis?` reports actual surface-local
`{left,top,width,height,futureFrom?}`. Custom engines may omit these additions;
no private DOM selectors or second time scale are used. The selected timeline
uses actual anchor dates, never extended ray ends. Paired anchors form a subtle
span; one-anchor drawings have one marker. Reversed/coincident/colliding anchors
retain distinct labels; offscreen endpoints clamp with direction indicators.
Labels follow pan/zoom/resize. Beyond the engine's known future seam, the
annotation ruler labels explicitly use UTC; historical dates use chart timezone.
These overlays create no bars, financial values, sessions or economic requests.

## Verification and adoption

Storybook **Market Charts / Drawing Editor** contains Dark, Light, Narrow390,
Narrow320, Calendar, Utc, DelayedEcho, FourInstances and HiddenRecovery fixtures.
The fixture's expandable verification output is public synthetic state for
browser checks. No provider or private account is required.

Fullscreen editor surfaces use the paired UI-kit's new optional `portalContainer`
Content API (Dialog, Popover, DropdownMenu and Tooltip). The chart passes a
container only for the active opt-in fullscreen editor; omitted/default consumers
keep body portals. The currently published UI peer lacks this capability. Review
and publish the coordinated UI/chart successors, including an approved chart peer
minimum, before adopting fullscreen support. This local review keeps both existing
workspace versions/manifests unchanged; the dependency change is a later gate.

Implementation evidence, actual test/build/browser results, source/package
hashes, preservation checks and the publication proposal live under
`.chart-drawing-editor-validation/`. Browser emulation does not establish
physical iPad/Safari/trackpad or native-browser-zoom acceptance; see the evidence
for exactly which modes were exercised. The local candidate retains the unchanged
workspace manifest/version. Publication, release-version assignment, exact
consumer dependency/complete-lock/install, private persistence and deployment
acceptance remain separate owner-controlled gates.
