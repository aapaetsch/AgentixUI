# DrawingLayer and DrawingToolbar

- **Props:** Controlled drawing states, tool definitions, engine coordinate port, optional OHLC snapping controls and intent callbacks.
- **Dependencies:** React, UI kit buttons, engine-neutral drawing contracts.
- **Styling Decisions:** Canvas-adjacent SVG primitives use the selected drawing's own serialized color and restrained handles.
- **Maintenance Notes:** Keep all coordinate conversion behind `MarketChartEngine`; never import vendor types into drawing APIs. OHLC snapping must use indexed timestamps and the engine coordinate port so it remains renderer-neutral.
