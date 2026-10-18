# DrawingLayer and DrawingToolbar

- **Props:** Controlled drawing documents/preferences, transient selected IDs, fixed/multi-click/variable/freehand lifecycles, tool and renderer registries, read-only OHLCV context, object-tree actions, alert intents, engine coordinate port, consolidated interaction settings and typed commit callbacks.
- **Dependencies:** React, UI-kit buttons/dropdown menus/tooltips, AgentixUI icons and engine-neutral drawing contracts.
- **Styling Decisions:** The chart remains the visual anchor. The compact pointer/tool menu and contextual controls use one restrained toolbar; SVG primitives retain serialized color while hover, focus, snap markers and touch handles add non-layout feedback.
- **Maintenance Notes:** Keep all coordinate conversion behind `MarketChartEngine`; never import vendor types into drawing APIs. Built-ins must route through `DrawingRendererDefinition`, and renderer geometry belongs in pure registry/calculation helpers rather than JSX switches. Draft creation, body/group moves, handle editing, freehand simplification and style previews stay local and emit one final commit. Selection, quick measure, inline editing and hover must never mutate bounded history. Missing VWAP volume is an unavailable result, never an implicit partial calculation.
- Crosshair/indicator readouts must overlay the chart rather than enter document flow. Drawn SVG elements can intercept pointer movement, so flow-mounted hover UI will repeatedly shift the canvas when the pointer crosses a drawing.

- DrawingToolbar supports horizontal (legacy default) and vertical orientations, including direct favorites. Composed chart overlays set coordinateRevision and clipToPricePane; ignore interactive pane-header descendants in drawing event capture.

- Supplied mode uses only the four audited geometric renderers; all other renderer and hit-test callbacks are replaced with supplied paths/status. Draft anchor/settings changes must suppress old derived values. Use per-instance DOM IDs and allow Tab exit. Never restore OHLC anchor bindings in supplied mode.


- Host gaps clip SVG drawing geometry and handles, reject pointer hits inside open gaps, and split supplied VWAP at gaps/nulls. Singleton supplied paths remain visible. Coordinate conversion on whitespace is geometry only. Prefer engine.shiftTime for host display-unit keyboard nudges; preserve compressed fallback behavior.
