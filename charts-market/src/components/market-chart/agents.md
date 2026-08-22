# MarketChart

- **Props:** Controlled OHLC data, chart/scale modes, volume, markers, indicators, pane sizes, custom render layers, symbol/interval controls, visible-range/current-bar/crosshair callbacks, SSR states, table alternative, and an imperative streaming handle.
- **Dependencies:** React, `aapaetsch-ui-kit`, the engine-neutral core, and the first-party Canvas engine.
- **Styling Decisions:** A flat toolbar and current-bar strip frame one dominant canvas. Semantic positive/negative tokens communicate direction without extra chrome.
- **Maintenance Notes:** Data must use unique ascending timestamps. Keep Canvas renderer internals behind `MarketChartEngine`; only expose read-only state through `getSnapshot()`.
