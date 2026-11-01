# aapaetsch-charts-market

React technical-analysis charts powered by a first-party Canvas 2D + SVG engine. Supports React 18/19, ESM, CommonJS, and TypeScript. Use [dashboard charts](../charts/README.md) for general-purpose charts.

## Installation and first chart

```bash
npm install aapaetsch-charts-market@beta aapaetsch-ui-kit@beta react@19 react-dom@19
```

The UI kit, React, and React DOM are peer dependencies. Import the two compiled stylesheets once; consumers do not need to scan package source with Tailwind.

```tsx
"use client";
import * as React from "react";
import "aapaetsch-ui-kit/globals.css";
import "aapaetsch-charts-market/styles.css";
import {
  TechnicalChartView,
  createTechnicalChartViewState,
  type OhlcBar,
} from "aapaetsch-charts-market";

const bars: OhlcBar[] = [
  { time: "2026-10-26", open: 100, high: 105, low: 99, close: 103, volume: 12000 },
  { time: "2026-10-27", open: 103, high: 108, low: 102, close: 106, volume: 15000 },
  { time: "2026-10-28", open: 106, high: 107, low: 101, close: 102, volume: 14000 },
];

export function Analysis() {
  const [state, setState] = React.useState(() =>
    createTechnicalChartViewState("price-only"),
  );
  return <TechnicalChartView
    symbol="DEMO"
    interval="1D"
    data={bars}
    state={state}
    onStateChange={next => setState(next)}
  />;
}
```

This minimal example uses the price-only preset. Use `daily-analysis` with enough history for RSI, moving averages, MACD, stochastic, and a volume profile; a three-bar sample cannot warm up those studies.

In Next.js, move stylesheet imports to the root layout and keep the chart in a client component. Set theme variables and `.dark` at the document root so portaled controls inherit them. Give the chart a measurable-width parent. See [TechnicalChartView](src/components/technical-chart-view/README.md) for height/overflow policies and the complete controlled-state example.

## Data and state contract

- `OhlcBar` requires time, open, high, low, and close; volume is optional. Supply finite prices with a valid high/low range. Missing volume means unavailable data; zero means measured zero.
- Numeric times are UTC Unix **seconds**, not JavaScript milliseconds. Date strings use YYYY-MM-DD; structured year/month/day values are also supported. Keep bars unique and ordered chronologically.
- The example uses host-controlled state: apply every onStateChange result. The host owns network acquisition, calendars, persistence, alert evaluation, and trade execution.
- Do not invent sessions or price rows to fill gaps. Supply calendar geometry when needed; see [calendar coordinates](CALENDAR-COORDINATES.md).
- Internal calculations are the default. For host-produced results use [supplied mode](SUPPLIED-RESULTS.md) and retain its identity, freshness, and unavailable-result rules.
- Versioned save/restore contracts preserve serializable state. Runtime callbacks, registries, and calendar inputs must be reapplied by the host.

## Choose the right API

| API | Use |
| --- | --- |
| [TechnicalChartView](src/components/technical-chart-view/README.md) | Complete controlled analysis workspace with pane menus, indicators, drawings, and profiles |
| [MarketChart](src/components/market-chart/README.md) | Lower-level chart with explicit engine, viewport, and overlay control |
| [Workspace](src/workspace/README.md) | Synchronized multi-chart composition and saved layouts |
| [Drawings](src/drawings/README.md) | Controlled drawing tools, commands, and history |
| [Controls](src/controls/README.md) | Host-controlled toolbar |

## Troubleshooting and development

- Empty/blank chart: verify measurable parent dimensions, finite OHLC values, ordered unique times, and both stylesheets.
- Missing indicator: provide enough history for its warm-up period, or inspect supplied-result status.
- Stale viewport/drawing changes: apply controlled callbacks and preserve logical ranges; do not overwrite them with stale state.
- Incorrect timestamps: check seconds versus milliseconds and explicit session/calendar inputs.
- Wrong portaled menu colors: put the theme at the document root.

Run from the repository root:

```bash
npm ci
npm run build
npm run storybook
npm run test --workspace aapaetsch-charts-market
npm run typecheck --workspace aapaetsch-charts-market
npm run build-storybook
```

Storybook includes Market Charts examples for keyboard navigation, themes, responsive layouts, streaming, drawings, and supplied data. See the component guides for browser-smoke commands and qualifications.

## Source and release status

This guide describes the current checkout. Feature contracts below include local candidates that may not be in an installed npm release. Consult [release evidence](../docs/README.md#source-and-release-status) before adopting a particular feature.

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

## Feature integration notes

See [ENDPOINT-LABELS.md](./ENDPOINT-LABELS.md) for opt-in price and all-study endpoint boxes in a separate gutter, pane-relative anchors, minimal collision displacement and accessible bounded overflow. This includes oscillator line/histogram outputs and preserves existing defaults.

See [MOVING-AVERAGE-LABELS.md](./MOVING-AVERAGE-LABELS.md) for opt-in outlined boxes for every visible moving-average price overlay, exact historical endpoints, collision connectors, off-scale markers and bounded overflow. Other consumers retain the legacy badge behavior.

See [READABILITY.md](./READABILITY.md) for visible study/VWAP/volume/profile legends, timestamp-aligned display values, accessible compact details, reference-aware automatic scales and integrated navigation. Source changes are a local publication candidate until separately approved.

See [ADAPTIVE-WIDTHS.md](./ADAPTIVE-WIDTHS.md) for opt-in matching candle/volume widths with a configurable CSS-pixel gap, dense/DPI behavior and unchanged proportional defaults.
