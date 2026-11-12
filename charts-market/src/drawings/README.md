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

## Selected drawing alert action

The opt-in floating editor uses the existing public
`MarketDrawingEditorOptions.onAlertIntent?: (drawingId: string) => void`:

```tsx
<MarketChart
  data={bars}
  drawings={drawings}
  selectedDrawingIds={selectedIds}
  drawingEditor={{active: true, onAlertIntent: openSavedDrawingAlertInspector}}
/>
```

With the callback, **Create alert** appears in the desktop toolbar and More
drawing actions menu for one selected visible horizontal line, trend line or
rectangle. Vertical/time-only drawings have no alert action. Locked objects remain
eligible because the intent does not modify them. Hidden objects, cleared/multiple
selection, inactive editors and disposed instances have no action controls.
Existing interval-visibility settings remain recoverable through explicit saved
object selection. Without the callback the existing disabled **Drawing alerts —
coming later** placeholder remains on both surfaces, including vertical lines.

The callback receives exactly the unchanged opaque ID, with no listing, price,
rule or saved revision inferred by the renderer. The host must resolve that ID in
its current account/listing document, flush pending saves or explain conflicts,
check final eligibility and open its own inspector. Replace the callback on listing
changes and use the chart's existing context/cancellation lifecycle to dispose old
controls. Never serialize callbacks in `DrawingState`. The renderer has no alert
API, storage, credential access, price-rule evaluation or notification behavior.
See [DRAWING-ALERT-ACTION.md](../../DRAWING-ALERT-ACTION.md) for delivery boundaries.

## Management and persistence

`DrawingObjectTree`, `DrawingInlineTextEditor`, management helpers, versioned clipboard helpers, controlled favorites/recent tools, keep-drawing mode, defaults/templates, z-order, grouping, lock/hide/remove-all commands, and synchronization modes (`off`, `same-symbol`, `layout`) are exported from `aapaetsch-charts-market/drawings`. Existing drawing documents remain readable because every new drawing-state field is optional.
## Directional supplied lines and future editing

Trend and horizontal lines support optional boolean `parameters.extendLeft` and
`parameters.extendRight` without rewriting saved anchors or IDs. Trend defaults
to a segment; each missing horizontal flag defaults true for legacy full width.
A horizontal line with both flags false is a selectable 6px marker. Chronological
left/right ignore anchor insertion order. Equal-time trend anchors use up/down
as the deterministic vertical convention.

The floating contextual toolbar commits each toggle through one existing style
transaction. Standalone horizontal `DrawingToolbar` opts in using the additive
`onLineExtensionChange({extendLeft,extendRight})`; old style callbacks retain their
string/number signatures. Both controls are labeled, pressed, focusable and have
at least44px targets. No extension controls appear for rectangles/vertical lines.

For direct composition pass `DrawingLayer futureDisplay={!!timeAxis.futureDisplay}`;
the chart components do this automatically. The engine owns all dates and bounds.
Future group moves/duplicates reject a translation if any anchor cannot map, and
selected arrow-key edits take priority over Canvas navigation. See
`../../INTERACTIONS.md` and `../../CALENDAR-COORDINATES.md` for complete public
policy/types/serialization examples and supplied-only limitations.
