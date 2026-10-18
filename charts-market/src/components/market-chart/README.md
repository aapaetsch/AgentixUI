# MarketChart

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

`presentation`, `dataIdentity`/`dataRevision`/`onDataAcceptance`, `drawingToolIds`, `drawingCommand` and `onDrawingHistoryChange` are additive. The handle exposes shared drawing commands/history and resetScale. Theme and host availability overlays retain the existing engine. See [REFINEMENT.md](../../../REFINEMENT.md) for precise revision, metadata and compatibility rules.

