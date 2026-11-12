# MarketChart

`drawingEditor?: MarketDrawingEditorOptions` opts the active editable instance into a fixed themed drawing toolbar and atomic four-tab settings. Position is host account-session state; exact `DrawingPoint.priceText`/`utcTimeText` survive history, and final `onDrawingsChange` metadata includes `exactCoordinates`. Financial statistics require matching host context and geometry keys. Shared cancel discards previews/capture even with delayed controlled selection. See [the complete editor contract](../../../DRAWING-EDITOR.md) and packaged [INTERACTIONS.md](../../../INTERACTIONS.md). No option preserves the historical contextual toolbar; inactive opt-ins suppress contextual editors. The existing shared object tree recovers hidden drawings.

`priceReferences?: readonly MarketPriceReference[]` is a runtime supplied display input, reconciled without recreating the engine. It is excluded from calculations, saved state and drawing selection/history. The first-party engine draws noninteractive dotted levels and optional outlined R axis values; hosts own exact evidence/session selection and reference freshness. See [PRICE-REFERENCES.md](../../../PRICE-REFERENCES.md).

`canvasHostRef` optionally receives the live canvas allocation element for composed layout measurement. Measure it and natural content together; engine `onContentHeightChange` reports after bitmap/CSS dimensions update, while React allocation can commit later. This ref does not change engine ownership. Equal pixel dimensions no longer clear the canvas bitmap; real resize and device-pixel-ratio changes still update it.

`dataTable="none"` renders no controls/footer row and reserves no empty-row
height. `toggle` retains View/Hide data controls; `always` renders its table
directly. `presentation.crosshair.lineMarker` forwards optional display-only
line inspection to the built-in engine. `snapshot.lineInspection` distinguishes
exact/interpolated screen geometry from authoritative OHLC inspection; no price
observation or provider request is generated.

`presentation.badges.endpointValues='all-visible'` enables outlined price/study endpoint boxes in a separate gutter. Supply human `axisLabel` metadata for custom low-level series; use the shared engine rather than host layout patches. See [ENDPOINT-LABELS.md](../../../ENDPOINT-LABELS.md).

Opt-in right-axis moving-average endpoint boxes are described in [MOVING-AVERAGE-LABELS.md](../../../MOVING-AVERAGE-LABELS.md). Use public `presentation.badges.movingAverages='all-visible'` and tagged definition/series metadata; existing callers retain legacy badges.

`MarketChart` is the accessible React surface for the isolated market-chart engine. It supports candlestick, OHLC bar, line, area and baseline series, volume panes, markers, pan/zoom, scale controls, visible-range callbacks and incremental updates.

```tsx
const chartRef = useRef<MarketChartHandle>(null)

<MarketChart
  ref={chartRef}
  symbol="AAPL"
  interval="1D"
  data={bars}
  onVisibleRangeChange={setVisibleRange}
/>
```

Use `chartRef.current?.appendOrUpdate(bar)` for streaming updates and `chartRef.current?.getSnapshot()` for read-only viewport state. Consumers own data fetching and persistence. The package has no runtime chart-engine dependency or third-party branding.

Drawing interaction is configured through `drawingRenderers` and `drawingInteraction`. Prefer `selectedDrawingIds` and `onSelectedDrawingIdsChange` for transient controlled selection; the deprecated `DrawingState.selected` wire shape remains compatible when those props are omitted. `onDrawingsChange` receives additive change metadata as its second argument.

### Composed technical views

Use `TechnicalChartView` for the complete workspace. Advanced low-level consumers can opt into `panes`, `viewport`, `scale`, `renderSurfaceOverlay`, `showSummary`, and drawing-toolbar orientation without changing legacy callers. Viewport callbacks include exact logical ranges; price-axis scaling emits controlled manual scale state. New engine setters remain optional for existing custom adapters.

The imperative handle also exposes `coordinateForTime(time)`, returning the engine coordinate for an exact available candle or null. Composed surfaces use it for event pins without changing the shared time scale.

Supplied producer results: prefer TechnicalChartView for request identity matching. MarketChart accepts calculationMode, suppliedIndicatorSeries, suppliedDrawingResults and themeRevision for lower-level integration. These low-level results must already be matched/validated by the host. In supplied mode CurrentBarSnapshot.change/changePercent use NaN as an unavailable sentinel, and the summary displays an unavailable label.


Calendar geometry: timeAxis and discontinuities are optional host-owned runtime inputs. coordinateForTime returns unobserved geometry in UTC/calendar modes; use inspected snapshots/data to identify actual observations. See [the full contract](../../../CALENDAR-COORDINATES.md).
# Research runtime seams

Opt-in matching candle and volume slot widths are supported through `presentation.candles` / `presentation.volume` (`widthMode: 'adaptive', gap: 2`). Runtime updates repaint the existing engine; omitted settings preserve historical defaults. See [ADAPTIVE-WIDTHS.md](../../../ADAPTIVE-WIDTHS.md) for dense/DPI behavior and validation bounds.

`presentation`, `dataIdentity`/`dataRevision`/`onDataAcceptance`, `drawingToolIds`, `drawingCommand` and `onDrawingHistoryChange` are additive. The handle exposes shared drawing commands/history and resetScale. Theme and host availability overlays retain the existing engine. See [REFINEMENT.md](../../../REFINEMENT.md) for precise revision, metadata and compatibility rules.


Workspace input and controlled geometry: [INTERACTIONS.md](../../../INTERACTIONS.md). Use the public scroll owner and intrinsic-height callback with one host scroller.
# Runtime timeline observations

`presentation.timeline?: MarketTimelinePresentation` opts into range-aware labels
and calendar blank logical right space. Omission retains existing behavior.
`onSnapshotChange?: (snapshot: MarketChartSnapshot) => void` observes read-only
resolved `priceAxis`, `scale` and `timeTicks` through a current callback ref,
without replacing the engine. These optional fields preserve custom-engine
compatibility. Coordinates are surface-local CSS pixels. Deduplicate only the
observed fields before updating React state, and never trigger economic requests
from scale/layout snapshots. See ../../../INTERACTIONS.md for typed usage and
the exact controlled viewport/session/default contracts.

