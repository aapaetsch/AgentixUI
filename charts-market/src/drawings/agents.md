# DrawingLayer and DrawingToolbar

- **Props:** Controlled drawing documents, transient selected IDs, tool and renderer registries, engine coordinate port, consolidated interaction settings and typed commit callbacks.
- **Dependencies:** React, UI-kit buttons/dropdown menus/tooltips, Lucide icons and engine-neutral drawing contracts.
- **Styling Decisions:** The chart remains the visual anchor. The compact pointer/tool menu and contextual controls use one restrained toolbar; SVG primitives retain serialized color while hover, focus, snap markers and touch handles add non-layout feedback.
- **Maintenance Notes:** Keep all coordinate conversion behind `MarketChartEngine`; never import vendor types into drawing APIs. Built-ins must route through `DrawingRendererDefinition`, and renderer geometry belongs in pure registry helpers rather than JSX switches. Draft creation, body moves, handle editing and style previews stay local and emit one final commit. Selection and hover must never mutate bounded history.
- Crosshair/indicator readouts must overlay the chart rather than enter document flow. Drawn SVG elements can intercept pointer movement, so flow-mounted hover UI will repeatedly shift the canvas when the pointer crosses a drawing.
