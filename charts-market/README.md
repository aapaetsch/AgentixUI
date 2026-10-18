# aapaetsch-charts-market

ESM-only technical-market chart components powered by a dependency-free first-party Canvas 2D + SVG engine.

Import the UI kit theme and the package's compiled utilities once in the host application:

```tsx
import "aapaetsch-ui-kit/globals.css";
import "aapaetsch-charts-market/styles.css";
```

## Public entrypoints

- `aapaetsch-charts-market/core`: data, engine and extension contracts plus validation.
- `aapaetsch-charts-market/indicators`: pure SMA, EMA, VWAP, Bollinger Bands, RSI, MACD and ATR calculations.
- `aapaetsch-charts-market/drawings`: built-in tools, SVG editing layer and controlled undo/redo commands.
- `aapaetsch-charts-market/overlays`: serializable alert, order, position, execution, replay and session overlays.
- `aapaetsch-charts-market/controls`: controlled market-chart toolbar.
- `aapaetsch-charts-market/workspace`: synchronized multi-chart layouts, shell composition, layout management and versioned persistence.

The package never fetches data, saves layouts, evaluates alerts or executes trades. Those responsibilities remain with consumers.

The renderer uses Canvas for price series, volume, indicators, axes, markers and overlays; the controlled drawing layer uses SVG; React owns controls, legends, accessibility summaries and the data table. `createMarketChartEngine()` is the stable factory and `MarketChartHandle.getSnapshot()` exposes read-only viewport state without renderer internals.

## Complete technical workspace

Use `TechnicalChartView` with `createTechnicalChartViewState('daily-analysis')` for an out-of-box RSI / price with four moving averages / MACD+volume / stochastic workspace. It includes controlled pane geometry, a price-aligned volume profile, drawing rail, command menus, hover OHLC, colored latest-value badges, readable oscillator bands, optional supplied earnings dates and a range/status footer. `MarketChart` remains available unchanged as the low-level component.

See [TechnicalChartView documentation](src/components/technical-chart-view/README.md) for the single-state example, accurate versus approximate profile sources, host intents, accessibility and verification commands.

## Supplied producer results

TechnicalChartView now supports controlled supplied-only calculations, independent palettes and UTC viewport linking. See [the integration contract and publication review](./SUPPLIED-RESULTS.md) for exact types, adapter mappings, guard behavior and limitations.


Host-controlled calendar geometry: see [CALENDAR-COORDINATES.md](./CALENDAR-COORDINATES.md) for timeAxis, discontinuities, inclusive range adapters, sparse/dense alignment and unchanged version-1 persistence.

Research workspace refinement: see [REFINEMENT.md](./REFINEMENT.md) for typed appearance, compact evidence/details, available-height geometry, shared drawing commands/history, accepted snapshot revisions and interaction-origin callbacks. Runtime additions preserve version-1 persistence and supplied-only calculations.
