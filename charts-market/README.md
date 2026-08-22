# @agentix/charts-market

ESM-only technical-market chart components powered by a dependency-free first-party Canvas 2D + SVG engine.

## Public entrypoints

- `@agentix/charts-market/core`: data, engine and extension contracts plus validation.
- `@agentix/charts-market/indicators`: pure SMA, EMA, VWAP, Bollinger Bands, RSI, MACD and ATR calculations.
- `@agentix/charts-market/drawings`: built-in tools, SVG editing layer and controlled undo/redo commands.
- `@agentix/charts-market/overlays`: serializable alert, order, position, execution, replay and session overlays.
- `@agentix/charts-market/controls`: controlled market-chart toolbar.
- `@agentix/charts-market/workspace`: synchronized multi-chart layouts, shell composition, layout management and versioned persistence.

The package never fetches data, saves layouts, evaluates alerts or executes trades. Those responsibilities remain with consumers.

The renderer uses Canvas for price series, volume, indicators, axes, markers and overlays; the controlled drawing layer uses SVG; React owns controls, legends, accessibility summaries and the data table. `createMarketChartEngine()` is the stable factory and `MarketChartHandle.getSnapshot()` exposes read-only viewport state without renderer internals.
