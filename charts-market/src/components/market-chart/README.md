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
