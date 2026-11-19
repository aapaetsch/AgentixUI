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

### Earnings timeline coordinates

Supply `earnings` to render native **E** buttons on the price-pane timeline. Each
button identifies the supplied announcement date, estimated status and session on
hover/focus; click, Enter, Space or touch opens the shared earnings details card.
Closing the card restores focus to the marker when it is still visible.

An explicit event `barTime` is the exact display anchor, including a future date
present in the host's `timeAxis` calendar without a corresponding price candle.
Both ends of the visible plot are inclusive. At an edge only the 24 CSS-pixel
button hit target moves inward to keep its focus ring inside the pane; the event
date and calendar coordinate stay unchanged. Truly off-screen anchors stay hidden.
Events without a resolvable anchor remain in the accessible earnings list and are
never relocated to the last candle. No calendar sessions or price rows are added.

See **Market Charts / Earnings timeline** in Storybook for fitted endpoints,
pan/zoom/Fit/Latest, calendar/event updates, light/dark and compact-card examples.

TechnicalChartView now supports controlled supplied-only calculations, independent palettes and UTC viewport linking. See [the integration contract and publication review](./SUPPLIED-RESULTS.md) for exact types, adapter mappings, guard behavior and limitations.


Host-controlled calendar geometry: see [CALENDAR-COORDINATES.md](./CALENDAR-COORDINATES.md) for timeAxis, discontinuities, inclusive range adapters, sparse/dense alignment and unchanged version-1 persistence.

Research workspace refinement: see [REFINEMENT.md](./REFINEMENT.md) for typed appearance, compact evidence/details, available-height geometry, shared drawing commands/history, accepted snapshot revisions and interaction-origin callbacks. Runtime additions preserve version-1 persistence and supplied-only calculations.

Workspace interactions opt-in: see [INTERACTIONS.md](./INTERACTIONS.md) for the public scroll owner, temporary pane scales/maximize, logical viewport commands, per-gesture pane drafts and intrinsic geometry contract. Defaults and version-1 serializers remain compatible.

`appearance.suppliedDetails=false` removes compact supplied-details entry points
while preserving status and critical warnings; defaults remain unchanged.

Board card controls: `useTechnicalPaneMenu`, controlled `paneMenu`/
`onPaneMenuChange`, `paneMenuTrigger="none"` and `allowLogScale={false}` provide
host-title access to the same shared pane menu and runtime scale policy. Opt into
`appearance.crosshair.lineMarker` for a small outlined closing-price hover dot.
Its exact/interpolated display geometry is separate from OHLC/study readouts.
See the TechnicalChartView README and **Market Charts / Board Card** stories.

Timeline controls: `appearance.timeline` (`presentation.timeline` on MarketChart)
opts into visible-span labels, supplied session starts, calendar right-space pan
and optional stateful Auto/linear-log icons beneath the real price axis. Public
types include `MarketTimelinePresentation`, `MarketTimelineRange` and
`MarketTimeTick`; `onSnapshotChange` exposes optional resolved ticks/axis geometry.
See the typed examples, defaults, callback origins and blank-space economic
contract in [INTERACTIONS.md](./INTERACTIONS.md). No new price bars, sessions,
calculation inputs or saved-state fields are generated.
### Drawing extensions and future annotation dates (local candidate)

Opt into `timeAxis.futureDisplay` to author drawings on a bounded UTC calendar
ruler beyond known observations. Optional serialized `extendLeft`/`extendRight`
booleans on trend and horizontal lines use the existing selection toolbar and
shared history; saved anchors and IDs stay exact. Existing consumers retain their
defaults. See [INTERACTIONS.md](./INTERACTIONS.md) for typed controlled examples and
[CALENDAR-COORDINATES.md](./CALENDAR-COORDINATES.md) for the seam, interval, horizon,
inspection and economic-bound contract. These options do not acquire data or
create future sessions, prices or study observations.
## Feature integration notes

Opt-in floating drawing editor: pass `drawingEditor={{active:true,...}}` on the active editable `TechnicalChartView` or `MarketChart` instance. The shared portal toolbar, atomic Style/Text/Coordinates/Visibility dialog, exact-coordinate history, host-supplied statistics and selected timeline are documented in [DRAWING-EDITOR.md](./DRAWING-EDITOR.md). The complete public contract is also embedded in [INTERACTIONS.md](./INTERACTIONS.md), which is included by the unchanged package manifest. Default/Board consumers retain existing behavior. Local review evidence and the separate publication proposal are under `.chart-drawing-editor-validation/`; no publication or product adoption follows from this opt-in.

Quiet compact Boards may opt into `appearance.suppliedStatus='host'` with existing discoverable host-expanded evidence, and `priceReferences` using `showPlotLabel:false, showAxisLabel:true, axisLabel:'Open'`. This removes only redundant study-status chrome and the plot caption, retains complete evidence/accessibility and preserves default/expanded behavior. See [BOARD-INLINE-READOUT.md](./BOARD-INLINE-READOUT.md) and [PRICE-REFERENCES.md](./PRICE-REFERENCES.md). Publication and consumer adoption remain separate from this local source candidate.

See [BOARD-INLINE-READOUT.md](./BOARD-INLINE-READOUT.md) for compact `studyReadout='volume-only'` beside a host shared average key and expanded `'inline'` with all numeric values. Both use natural measured height and one lowercase `vol`; missing volume reserves no compact row, zero remains zero, and omitted-option full-chart legends are unchanged.

See [PRICE-REFERENCES.md](./PRICE-REFERENCES.md) for runtime supplied dotted price levels, optional outlined reference values and exact host-owned evidence boundaries. These noninteractive references do not enter saved state, drawings or calculations.

Shared bar-volume legend values use `Vol`; the `Bar volume` group title, supplied values and direction colors retain their existing meaning.

See [ENDPOINT-LABELS.md](./ENDPOINT-LABELS.md) for opt-in price and all-study endpoint boxes in a separate gutter, pane-relative anchors, minimal collision displacement and accessible bounded overflow. This includes oscillator line/histogram outputs and preserves existing defaults.

See [MOVING-AVERAGE-LABELS.md](./MOVING-AVERAGE-LABELS.md) for opt-in outlined boxes for every visible moving-average price overlay, exact historical endpoints, collision connectors, off-scale markers and bounded overflow. Other consumers retain the legacy badge behavior.

See [READABILITY.md](./READABILITY.md) for visible study/VWAP/volume/profile legends, timestamp-aligned display values, accessible compact details, reference-aware automatic scales and integrated navigation. Source changes are a local publication candidate until separately approved.

See [ADAPTIVE-WIDTHS.md](./ADAPTIVE-WIDTHS.md) for opt-in matching candle/volume widths with a configurable CSS-pixel gap, dense/DPI behavior and unchanged proportional defaults.

## Price stroke width

Set `TechnicalChartView appearance={{line: {width: 1}}}` (or `MarketChart`
`presentation`) for a thin closing-price line; use `3` for thick. Finite CSS
pixels 0.5–5, default 2. See [price series thickness](PRICE-SERIES-THICKNESS.md)
for isolated markers, candle/bar composition and compatibility.
