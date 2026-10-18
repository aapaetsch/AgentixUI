# MarketChart

- **Props:** Controlled OHLC data, chart/scale modes, volume, markers, indicators, pane sizes, custom render layers, drawing renderer/interaction registries, transient selected drawing IDs, symbol/interval controls, visible-range/current-bar/crosshair callbacks, SSR states, table alternative, and an imperative streaming handle.
- **Dependencies:** React, `aapaetsch-ui-kit`, the engine-neutral core, and the first-party Canvas engine.
- **Styling Decisions:** A flat toolbar and current-bar strip frame one dominant canvas. Semantic positive/negative tokens communicate direction without extra chrome.
- **Maintenance Notes:** Data must use unique ascending timestamps. Keep Canvas renderer internals behind `MarketChartEngine`; only expose read-only state through `getSnapshot()`. Drawing changes must use the canonical bounded reducer, while selection and hover stay outside history. Rebase controlled external drawing documents and clear redo.

- TechnicalChartView opts into explicit panes, scale/viewport state, persistent overlays and vertical/floating toolbar composition. Initialize these in engine options before initial data callbacks. Coordinate revisions must invalidate SVG geometry after pan, scale or pane changes; do not recalculate indicator history for pane-size-only changes.

- calculationMode supplied bypasses indicator calculate/createRuntime/append and forwards guarded drawing rendering. suppliedIndicatorSeries and suppliedDrawingResults are low-level prevalidated inputs; prefer TechnicalChartView for request matching. In supplied mode CurrentBarSnapshot changes are NaN (unavailable), never internally computed. themeRevision refreshes Canvas colors from scoped CSS.


- Calendar geometry: timeAxis/discontinuities stay outside observation arrays and serializers. Bump SVG coordinate revision after runtime geometry setters, including equal-bounds mode changes. Calendar programmatic and pointer inspection must clear on whitespace. Do not emit viewport callbacks for controlled calendar/data updates.
- Refinement: theme/presentation/availability changes preserve the engine; accepted revisions commit only after React commits. Keep drawing commands on shared history and exact host anchors unchanged during style edits. Full snapshot ingestion is O(N); do not introduce full-history work in pointer events. See ../../../REFINEMENT.md.
