# Drawings

The drawing package provides eight built-in tools: horizontal and vertical lines, trend lines, rays, extended lines, rectangles, ellipses, and Fibonacci retracements. Every tool resolves through a `DrawingRendererDefinition`; custom renderers return renderer-neutral `DrawingPrimitive` and `DrawingHandle` values and can participate in the same deterministic hit-testing pipeline.

`MarketChart` keeps drawings controlled and serializable while selection remains transient:

```tsx
<MarketChart
  drawings={drawings}
  selectedDrawingIds={selectedIds}
  onDrawingsChange={(next, metadata) => {
    setDrawings(next)
    audit(metadata.type)
  }}
  onSelectedDrawingIdsChange={setSelectedIds}
  drawingInteraction={{
    snapMode: "weak",
    snapDistance: 10,
    keyboardPriceStep: 0.05,
    keepDrawingMode: false,
    historyLimit: 100,
  }}
/>
```

Legacy `DrawingState.selected` remains supported when the new selection props are absent. Selection and hover never enter history. Create, move, resize, and style gestures preview locally and produce one pointer-up commit with change metadata. External controlled documents rebase history and invalidate redo.

Pointer and touch users can click or modifier-click to select, drag bodies, and edit endpoints. Blank clicks deselect without consuming chart navigation. Keyboard users can Tab through visible drawings, use arrows to nudge (Shift for 10×), Delete/Backspace, Escape, Ctrl/Cmd+D, and Enter/Space to create with an active tool. Locked drawings remain selectable but cannot move or resize.

Snapping modes are `off`, `weak` (default, threshold-based), and `strong` (nearest OHLC value on the selected bar). Hold Alt to bypass either magnet mode temporarily.
