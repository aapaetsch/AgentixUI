# Trading Charts Capability Handoff

**Date:** 2026-09-11  
**Status:** Current capability and product-composition handoff  
**Audience:** Product, design, and application engineering teams building Web or Electron trading experiences

## Executive summary

The UI kit can support a production-grade trading and market-analysis product today. The chart
surface is intentionally split across three packages:

| Package | Role |
|---|---|
| `aapaetsch-ui-kit` | Application shell, finance workflows, tables, controls, small data-viz primitives, and shared theme tokens |
| `aapaetsch-charts` | Recharts-backed analytical, portfolio, risk, and quantitative charts |
| `aapaetsch-charts-market` | ESM-only first-party Canvas market engine for interactive price and technical-analysis charts |

The strongest ready-to-use deliverable is a professional technical-analysis workspace built from
`TechnicalChartView`. It already supplies candlesticks, indicators, panes, volume profile,
drawings, earnings markers, chart commands, accessible inspection, and responsive states from a
single controlled state object. The same foundation can also power multi-chart terminals,
trade-review screens, symbol-detail pages, market-depth workspaces, portfolio and risk dashboards,
and options-analysis screens.

The packages deliberately do **not** fetch market data, save layouts, evaluate alerts, create
orders, connect to brokers, or export files. Applications own those services and respond to the
typed intents emitted by the components.

## Capability map

Legend:

- **Ready:** exported component or composition exists now.
- **Compose:** no new chart engine is required; assemble existing chart and UI-kit exports.
- **Extend:** requires a new domain wrapper, overlay, or chart implementation.

| Product experience | Status | Primary building blocks | What remains application-owned |
|---|---|---|---|
| Single-symbol technical chart | **Ready** | `TechnicalChartView`, daily-analysis and price-only presets | OHLCV feed, symbol/interval selection, state storage |
| Professional chart terminal | **Ready** | `TechnicalChartView`, `TechnicalWorkspace`, `SymbolSearch`, `QuoteStatistics`, `MarketSessionStatus` | Watchlist data, news, company details, fullscreen/export handlers |
| Multi-chart workstation | **Ready** | `SynchronizedMarketCharts`, `MultiChartLayout`, workspace layout manager | Layout storage and live feeds per chart |
| Lightweight embeddable price chart | **Ready** | `MarketChart` | Data feed and host controls |
| Market depth and liquidity view | **Compose** | `DepthChart`, `VolumeProfile`, `OrderBook`, `TimeAndSales` | Level 2/trade feed and venue normalization |
| Orders and positions on chart | **Compose** | Order, bracket, position, execution, alert, replay, and session overlays; `WorkingOrders`; `TradeBlotter`; `BracketOrderEditor` | Broker state, validation, order submission, alert evaluation |
| Strategy replay and trade review | **Compose** | `MarketChart`, replay/execution overlays, `ReplayControls`, `StrategyReport`, `TradeBlotter` | Replay clock, fill model, strategy engine, persistence |
| Backtest or performance tearsheet | **Ready** | `Tearsheet`, `EquityCurve`, `DrawdownChart`, `ReturnsChart`, `RollingMetricChart`, `CorrelationMatrix` | Metric calculation and backtest results |
| Portfolio and risk dashboard | **Compose** | `RiskChart`, `DonutChart`, `Heatmap`, `Gauge`, `Sparkline`, `DataTable`, investment-ops templates | Portfolio analytics, pricing, risk calculations |
| Options analysis workspace | **Compose** | `PayoffDiagram`, `GreeksDecayChart`, `IVChart`, options-chain and multi-leg templates, Greeks displays | Option pricing, volatility surface data, live chain and order routing |
| Screener-to-chart workflow | **Compose** | `ScreenerFilterBuilder`, `SavedScreenPicker`, `ScreenerResults`, `SymbolSearch`, `TechnicalChartView` | Screening service and query persistence |
| Research and signal dashboard | **Compose** | `SignalChart`, `ScatterPlot`, `Heatmap`, `CorrelationMatrix`, `BoxPlot`, `RadarChart`, `DataTable` | Factor/signal calculations and dataset access |
| Specialized quant studies | **Extend** | Foundational chart primitives | Domain wrappers listed in the roadmap backlog |

## What the market chart can do now

### Price rendering and navigation

- Candlestick, OHLC bar, line, area, and baseline series.
- Linear, logarithmic, percentage, and indexed-to-100 scales.
- Mouse, trackpad, touch, and keyboard pan, zoom, inspection, axis scaling, and reset paths.
- Exact logical visible-range state, configurable future/right offset, fit-content, and realtime
  navigation.
- Incremental `appendOrUpdate()` for streaming bars and a read-only engine snapshot.
- Consumer-defined locale and timezone formatting.

### Technical analysis

- SMA, EMA, VWAP, Bollinger Bands, RSI, MACD, ATR, and stochastic definitions.
- A turnkey daily-analysis preset with RSI, price plus four moving averages, MACD and volume,
  stochastic, and a price-aligned volume profile.
- Multiple studies per pane, reorderable and resizable panes, volume compositing, persistent
  legends, and latest-value axis badges.
- Visible-range, fixed-range, and session volume-profile contracts with POC, VAH, VAL, provenance,
  and supplied-level or bar-derived inputs.
- Earnings pins plus hover, keyboard, and dialog inspection when the host supplies earnings data.

Bar-derived volume profile is explicitly approximate. It distributes each bar's volume over its
high/low range and must not be presented as measured bid/ask volume. Use supplied volume-at-price
levels when accurate profile data is available.

### Drawings and annotations

The package exports a practical 37-tool set, including:

- trend, ray, extended, horizontal, vertical, cross, arrow, and angle lines;
- parallel, regression, flat-top/bottom, and disjoint channels;
- price, date, and combined range measurements;
- long- and short-position tools;
- Fibonacci retracement, extension, and time-zone tools;
- anchored and fixed-range VWAP;
- rectangles, ellipses, circles, triangles, polylines, brush, and highlighter;
- text, notes, callouts, price labels, price notes, and arrow markers.

Selection, snapping, locking, visibility, grouping, duplication, templates, clipboard operations,
object ordering, and bounded undo/redo are part of the controlled drawing contract.

### Trading overlays

Serializable definitions exist for price and indicator alerts, working and bracket order lines,
position lines, execution markers, replay cursors, and session markers. These are visual state
only. A consumer must evaluate conditions and confirm or route every trading action.

### Accessibility and scale

- Accessible chart summary and a bounded data-table alternative.
- Keyboard inspection with deliberate live announcements rather than pointer-driven chatter.
- Labeled series and values that do not rely on color alone.
- Focusable pane separators and accessible toolbar/menu controls.
- Light, dark, narrow, reduced-motion, forced-color, and 200% zoom coverage.
- A documented stress fixture with 100,000 bars, four panes, 100 drawings, and 100 profile rows.

## General and quant chart inventory

`aapaetsch-charts` supplies shared chart chrome (`ChartContainer`, `ChartCard`, axes, grid, legend,
and tooltip) plus these exported charts:

| Family | Available components |
|---|---|
| Foundational | `LineChart`, `AreaChart`, `BarChart`, `Histogram`, `ScatterPlot`, `DonutChart`, `BoxPlot`, `Treemap`, `RadarChart`, `Heatmap` |
| Market structure | `DepthChart`, `VolumeProfile` |
| Performance | `EquityCurve`, `DrawdownChart`, `ReturnsChart`, `RollingMetricChart` |
| Quant and risk | `CorrelationMatrix`, `SignalChart`, `RiskChart` |
| Report composition | `Tearsheet` |

Use these for analytical views with axes, tooltips, legends, categorical comparisons, and report
layouts. Use `aapaetsch-charts-market` when the interaction model centers on OHLC bars, a shared
time scale, crosshair inspection, technical panes, drawings, or live market updates.

## UI-kit components that complete the trading experience

The chart packages are most useful when composed with these existing UI-kit surfaces:

| Need | Existing components |
|---|---|
| Quote context | `SymbolSearch`, `QuoteStatistics`, `MarketSessionStatus`, `TrendIndicator`, `Sparkline`, `MiniBars`, `Gauge` |
| Market microstructure | `OrderBook`, `TimeAndSales` |
| Trading workflow | `WorkingOrders`, `TradeBlotter`, `BracketOrderEditor`, `OrderStatusBadge`, `AlertRuleEditor`, `AlertManager`, `AlertLog`, `ReplayControls` |
| Discovery | `ScreenerFilterBuilder`, `SavedScreenPicker`, `ScreenerResults`, `CommandPalette` |
| Workspace shell | `Resizable`, `Tabs`, `Toolbar`, `Sheet`, `Popover`, `DropdownMenu`, `ContextMenu`, `ScrollArea` |
| Dense data | `DataTable`, `Table`, `Tooltip`, `HoverCard`, `Badge`, `Skeleton`, `EmptyState` |
| Options | `PayoffDiagram`, `IVChart`, `GreeksDecayChart`, `GreeksDisplay`, `OptionsChain`, `MultiLegOrderTicket` |

## Recommended product compositions

### 1. Technical-analysis terminal

Use `TechnicalWorkspace` as the shell, `TechnicalChartView` in the main region, a `Watchlist` or
`ScreenerResults` panel on the left, `QuoteStatistics` and news on the right, and `WorkingOrders`,
`TradeBlotter`, or `TimeAndSales` in the lower panel.

This is the shortest path to a desktop-class charting product. It requires integration work, not
new chart rendering.

### 2. Execution workstation

Compose `TechnicalChartView` with order/position/execution overlays, `OrderBook`, `TimeAndSales`,
`BracketOrderEditor`, `WorkingOrders`, and `TradeBlotter`. Treat every chart interaction as an
intent: open an application-owned confirmation flow before changing broker state.

The useful next wrapper would be a `ChartTradingAdapter` in the consuming application, not in the
UI kit. It would translate broker/domain objects to serializable overlays and chart gestures back
to validated order-edit intents.

### 3. Strategy replay and review

Use the low-level `MarketChart` when the application needs full control of the replay clock, or
`TechnicalChartView` when studies and drawings must remain available during replay. Add execution
markers, a replay cursor, `ReplayControls`, `StrategyReport`, and `TradeBlotter`.

### 4. Portfolio and risk cockpit

Build the shell from investment-ops templates and use `EquityCurve`, `DrawdownChart`,
`CorrelationMatrix`, `RiskChart`, `DonutChart`, `Heatmap`, `Gauge`, and dense tables. This surface
is chart-ready, but the consumer must define calculation methodology and data lineage for risk
metrics.

### 5. Options strategy analyzer

Combine the existing chain, position, Greeks, IV, payoff, and multi-leg components. Add a
`MarketChart` or `TechnicalChartView` for the underlying. This can ship without a new renderer.
A full strike-by-expiry volatility surface would require a new specialized chart.

## Integration contract

### Install and theme

```bash
npm install aapaetsch-ui-kit aapaetsch-charts aapaetsch-charts-market recharts
```

Import `aapaetsch-ui-kit/globals.css` once at the application root. Include chart-package source
or published output in the host Tailwind content configuration. The UI kit owns shared visual
tokens, including chart colors; neither chart package should introduce a competing theme system.

`aapaetsch-charts-market` is ESM-only. `aapaetsch-charts` publishes ESM and CommonJS builds.

### Controlled state example

```tsx
import * as React from "react";
import {
  TechnicalChartView,
  createTechnicalChartViewState,
  technicalChartViewReducer,
  type OhlcBar,
} from "aapaetsch-charts-market";

export function SymbolChart({ bars }: { bars: readonly OhlcBar[] }) {
  const [state, dispatch] = React.useReducer(
    technicalChartViewReducer,
    createTechnicalChartViewState("daily-analysis"),
  );

  return (
    <TechnicalChartView
      symbol="AAPL"
      interval="1D"
      data={bars}
      state={state}
      onStateChange={(next) => dispatch({ type: "replace", state: next })}
      onRequestExport={(request) => performApplicationExport(request)}
    />
  );
}
```

Persist chart state with the package serialization helpers. Store market data, user layouts,
drawings, and broker state in application services appropriate to the host; do not make a chart
component the system of record.

### Data boundaries

| Data or action | Library responsibility | Application responsibility |
|---|---|---|
| OHLCV and streaming bars | Validate, render, incrementally update | Fetch, authorize, normalize, reconnect, backfill |
| Indicators | Calculate/render built-ins and extensions | Choose defaults and explain methodology |
| Volume profile | Calculate/render supplied or approximate inputs | Acquire accurate trade/volume-at-price data when required |
| Earnings and events | Place and inspect supplied events | Fetch and normalize corporate actions |
| Layouts and drawings | Serialize, parse, migrate, emit changes | Save, sync, permission, and resolve conflicts |
| Alerts | Render definitions and edit state | Evaluate rules and notify users |
| Orders and positions | Render overlays and emit UI intent | Validate, confirm, route, reconcile, and audit |
| Export/fullscreen/timezone | Emit host intents | Perform platform-specific behavior |

## Recommended build sequence for an application team

1. **Vertical slice:** Render `TechnicalChartView` from deterministic OHLCV, wire controlled
   state, and import the shared theme.
2. **Data adapter:** Add historical loading, streaming `appendOrUpdate()`, timezone/locale rules,
   and loading/empty/error behavior.
3. **Workspace:** Add symbol search, watchlist, quote statistics, layout persistence, and the
   lower panel.
4. **Trading context:** Map alerts, orders, positions, executions, and sessions into overlays.
5. **Host intents:** Implement export, fullscreen/maximize, financials, timezone, and confirmation
   flows.
6. **Verification:** Test light/dark, narrow layouts, keyboard-only use, touch, 200% zoom, data
   reconnects, stale data, and high-volume streaming.

## Highest-value extensions

These additions would expand the product surface but are not blockers for a first release:

1. Comparison series and relative-performance overlays on the market time scale.
2. Domain wrappers for returns histograms, monthly-return heatmaps, factor scatter, term
   structure, volatility cones, Monte Carlo fans, signal decay, and attribution.
3. Trade-marker and regime-shading helpers that convert common application data into overlays.
4. A volatility-surface chart for options research.
5. An application-level chart trading adapter with broker confirmation and audit hooks.

Specialist Gann, pitchfork, Elliott-wave and harmonic-pattern tools, automatic pattern
recognition, and very large icon/sticker packs should remain optional extensions rather than core
requirements.

## Release and handoff checklist

- [ ] Choose `TechnicalChartView` or low-level `MarketChart` based on the desired ownership of
      chart chrome and pane state.
- [ ] Document the market-data provider, entitlement model, sessions, timezone, and adjustment
      policy.
- [ ] Define persistence ownership for layouts, drawings, and preferences.
- [ ] Keep alert evaluation and all broker mutations outside the component packages.
- [ ] Label approximate and supplied volume-profile sources correctly.
- [ ] Verify keyboard, pointer, touch, reduced-motion, forced-color, and 200% zoom paths.
- [ ] Exercise reconnect, delayed/stale feed, missing volume, split adjustment, and large-history
      cases.
- [ ] Run package tests, typecheck, build, Storybook build, accessibility checks, and browser
      smoke tests before release.

## Source-of-truth references

- Package strategy and dependency boundary: `docs/chart-library-strategy.md`
- General chart roadmap: `docs/roadmap/charts.md`
- Market chart roadmap and verification status: `docs/roadmap/charts-market.md`
- Technical chart API and behavior: `charts-market/src/components/technical-chart-view/README.md`
- Market chart low-level API: `charts-market/src/components/market-chart/README.md`
- Original implementation handoff: `implementation-plans/technical-chart-view-handoff.md`

End of handoff. The practical recommendation is to ship the technical-analysis terminal as the
first application vertical: it exercises the most mature chart surface and naturally grows into
execution, replay, screening, and symbol-research workflows without changing the package
architecture.
