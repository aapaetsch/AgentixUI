# Drawings

The drawings entrypoint provides a practical technical-analysis pack with 37 built-in tools, renderer-neutral primitives, controlled documents, transient selection, data-aware calculations, and versioned clipboard/workspace persistence.

## Tool families

- Lines: trend line, arrow, ray, info line, extended line, trend angle, horizontal line/ray, vertical line, and cross line.
- Channels: parallel, OLS regression, flat top/bottom, and disjoint channels.
- Measurements and positions: price/date/date-and-price ranges, quick measure, and three-point long/short positions.
- Fibonacci: configurable retracement, trend-based extension, and time zones.
- Volume: anchored and inclusive fixed-range VWAP with seven price sources, missing-volume disclosure, zero-volume support, and optional 1/2/3σ bands.
- Shapes and annotations: rectangle, ellipse, circle, triangle, variable polyline, simplified brush/highlighter, text, note, callout, price label/note, and arrow marker.

## Controlled usage

```tsx
<MarketChart
  data={bars}
  drawings={drawings}
  selectedDrawingIds={selectedIds}
  drawingPreferences={preferences}
  showDrawingObjectTree
  onDrawingsChange={(next, metadata) => {
    setDrawings(next)
    audit(metadata?.type)
  }}
  onSelectedDrawingIdsChange={setSelectedIds}
  onDrawingPreferencesChange={setPreferences}
  onCreateDrawingAlert={(drawingId) => openAlertEditor(drawingId)}
/>
```

Selection, hover, draft points, inline text editing, and quick measure remain transient. A completed pointer, touch, freehand, multi-click, variable-point, style, group-move, or keyboard gesture emits one history commit. Backspace removes the last multi-click draft point; Enter or double-click completes variable tools; Escape cancels.

Snapped points may retain an `anchor.field` binding so they continue to follow the selected bar's open, high, low, or close value. Hold Alt to bypass weak or strong OHLC snapping. Shift constrains ellipse drawing and Shift-drag on blank chart space provides a non-persistent date-and-price measurement.

## Data conventions

Regression and VWAP use the read-only ordered OHLCV slice supplied to `MarketChart`. Regression uses ordinary least squares across an inclusive anchor range. VWAP uses cumulative `price × volume / volume`; zero-volume bars preserve the current cumulative value and missing volume makes the result unavailable with an accessible reason. Fixed-range VWAP stops at its inclusive end anchor and anchored VWAP extends through the latest bar.

Position account size, risk percentage, and quantity are calculation metadata only. `onCreateDrawingAlert` is an intent callback; the package never evaluates alerts or places trades.

## Management and persistence

`DrawingObjectTree`, `DrawingInlineTextEditor`, management helpers, versioned clipboard helpers, controlled favorites/recent tools, keep-drawing mode, defaults/templates, z-order, grouping, lock/hide/remove-all commands, and synchronization modes (`off`, `same-symbol`, `layout`) are exported from `aapaetsch-charts-market/drawings`. Existing drawing documents remain readable because every new drawing-state field is optional.
