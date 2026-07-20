# Financial & Quant Component Gap Analysis

> A consolidated, ranked roadmap of components still missing from `@agentix/ui` that are needed to build **financial dashboards** and **quant research / strategy‑dev dashboards**. Items are ordered by ROI (impact ÷ effort), not alphabetically. Each entry lists rank, category, primary use, secondary use, dependencies, effort estimate, and notes.

## Package split (see `docs/chart-library-strategy.md`)

Components are split across **two packages**:

- **`@agentix/ui`** — UI primitives. Keeps tiny, dependency‑free inline‑SVG / text
  primitives (`Sparkline`, `NumericText`, `TrendIndicator`, `MiniBars`, `Gauge`,
  `SegmentedProgress` / `RangeBar`, small decorative `Heatmap`/`DonutChart`).
  Rule of thumb: if it has axes, ticks, legend, tooltip, crosshair, color scale,
  or domain logic → it does NOT belong here.
- **`@agentix/charts`** — separate package (planned). All real charting surface:
  `LineChart`, `AreaChart`, `BarChart`, `Histogram`, `ScatterPlot`, `BoxPlot`,
  `Treemap`, `SurfaceChart`, `SankeyChart`, `RadarChart`, full `Heatmap` /
  `DonutChart`, financial microstructure charts, all quant charts, the composed
  quant reports (`BacktestTearsheet`, `AlphaTearsheet`, `RiskDashboard`), and
  chart chrome (`ChartCard`, `ChartTooltip`, `ChartLegend`, `ChartGrid`).

The `Location` column in each table below uses:

- 🟦 **UI** — ship in `@agentix/ui` (current target).
- 🟧 **Charts** — defer to `@agentix/charts` (build later, separate package).
- ⬜ **Template** — composed app/layout template, consider a third
  `@agentix/templates` package.

`@agentix/charts` will depend on `@agentix/ui` (chart widgets consume UI
primitives + tokens). `@agentix/ui` MUST NOT depend on `@agentix/charts`.

## Rank Definitions

| Rank | Meaning |
|---|---|
| 🔴 **P0** | Foundational primitive — unblocks many composed widgets; should ship first. |
| 🟠 **P1** | High user‑visible value; composes P0 primitives into a recognizable widget. |
| 🟡 **P2** | Polishing / specialized widget; useful but not blocking. |
| 🟢 **P3** | Long‑tail / niche; defer until core set is shipped. |
| ⚪ **P4** | Nice‑to‑have infra / template; only Ship if a template task needs it. |

## Effort Legend

| Size | Rough effort |
|---|---|
| **XS** | < 1 hr — small primitive, no new deps. |
| **S** | 1–4 hrs — single component, no deps. |
| **M** | ~1 day — composed widget or modest SVG chart. |
| **L** | 2–4 days — composed report / multi‑sub‑component. |
| **XL** | 1 wk+ — requires external chart lib or complex state. |

---

## Section 1 — Foundational Charting & Data‑Viz Primitives
*(These compose everything below — ship first.)*

**Packaging:** Most items in this section go to 🟧 **`@agentix/charts`**. Exceptions kept in 🟦 **`@agentix/ui`**: `Sparkline` (#1, tiny inline `<path>`), a purely decorative `Heatmap` variant (#2, only if ≤ ~100 cells and no axis/legend), `Gauge` (#13, sibling of `Progress`), and possibly `DonutChart` (#7) **only if trivially small and decorative** — default to charts.

| # | Rank | Component | Location | Category | Use Case (Finance) | Use Case (Quant) | Deps | Effort | Notes |
|---|------|-----------|----------|----------|---------------------|------------------|------|--------|-------|
| 1 | 🔴 P0 | **`Sparkline`** | 🟦 UI | chart primitive | Tiny trend inside `StatTile`, `WatchlistCard`, `MarketMoverCard` rows | Inline inline NAV, rolling metric micro‑views | — | XS | Fills the empty `sparklineRenderSlot` already exposed in `StatTile`. |
| 2 | 🔴 P0 | **`Heatmap`** (generic) | 🟧 Charts | chart primitive | Sector/market overview tiles | Correlation matrix, signal heat, monthly returns heatmap, parameter sweep grid | — | S | Divergent & sequential color scales; axis labels optional. A small decorative tile‑grid variant MAY live in `@agentix/ui`; the full one goes to charts. |
| 3 | 🔴 P0 | **`LineChart` / AreaChart`** | 🟧 Charts | chart primitive | Price line, NAV, yield curve, term structure | Equity curve, drawdown, rolling metric, factor exposure trend | — | M | Dependency‑free SVG line/area; supports markers + regimes. |
| 4 | 🔴 P0 | **`ScatterPlot`** | 🟧 Charts | chart primitive | Cross‑sectional scatter (signal vs return) | Factor scatter, residual diagnostics, calibration curves | — | M | Optional regression line + R² annotation; sector coloring. |
| 5 | 🟠 P1 | **`BarChart`** | 🟧 Charts | chart primitive | Volume bars, broker comparison, holdings by sector | IC bars, monthly returns bars, factor exposure bars, performance attribution | — | S | Vertical + horizontal; supports stacked & divergent bars. |
| 6 | 🟠 P1 | **`Histogram`** | 🟧 Charts | chart primitive | Trade size / volume distribution | Returns distribution, signal value distribution, slippage distribution | — | S | Optional normal overlay, KDE, bins config. |
| 7 | 🟠 P1 | **`DonutChart` / PieChart`** | 🟧 Charts | chart primitive | Allocation donut in `AllocationBreakdown` | Risk decomposition donut (systematic/idiosyncratic/factor) | — | S | Default to charts. Stays in UI only if a small decorative variant is needed. |
| 8 | 🟠 P1 | **`CandlestickChart`** | 🟧 Charts | chart primitive | The core price chart for every symbol view | Price chart underneath backtest trade markers | (or adapter over `lightweight-charts`) | L | If bundled, prefer dependency‑free SVG impl for v1. |
| 9 | 🟡 P2 | **`BoxPlot`** | 🟧 Charts | chart primitive | Returns by sector / regime | Distribution diagnostics, signal decile returns | — | S | Useful for "is this alpha still alive?" diagnostics. |
| 10 | 🟡 P2 | **`SurfaceChart`** (heatmap) | 🟧 Charts | chart primitive | Volatility surface (strike × expiry) | Implied vol surface, factor exposure surface | — | M | Can reuse `Heatmap` + axis mapping. |
| 11 | 🟡 P2 | **`RadarChart`** | 🟧 Charts | chart primitive | Multi‑asset score comparison | Multi‑factor score comparison across strategies | — | S | Spider chart; used by risk & perf summaries. |
| 12 | 🟡 P2 | **`Treemap`** | 🟧 Charts | chart primitive | Market cap treemap overview | Position weight treemap, factor attribution treemap | — | M | Sized rectangles by weight + color for change. |
| 13 | 🟡 P2 | **`Gauge` / `Dial`** | 🟦 UI | chart primitive | Risk meter, margin usage, exposure gauge | Strategy score gauge, model confidence | — | S | Semicircle/full‑circle + needle; complements `Progress`. Sibling of `Progress`/`Spinner` family. |
| 14 | 🟢 P3 | **`SankeyChart`** | 🟧 Charts | chart primitive | Cash‑flow | Return decomposition flows | — | L | Visually compelling; defer. |
| 15 | 🟢 P3 | **`RadarChart` variants** | 🟧 Charts | chart primitive | | | — | S | Most needs covered by #11. |

---

## Section 2 — Form & Text Primitives
*(Cheap, high reuse across dashboards & quant forms)*

**Packaging:** All items 🟦 **`@agentix/ui`** (true primitives, no chart dependency).

| # | Rank | Component | Location | Category | Finance Use | Quant Use | Deps | Effort | Notes |
|---|------|-----------|----------|----------|-------------|-----------|------|--------|-------|
| 16 | 🔴 P0 | **`NumericText` / `PnLText`** | 🟦 UI | text primitive | Colorized signed formatted number everywhere | Same — every tearsheet cell | — | XS | Promotes the repeated `+1.24%` colorization in templates. |
| 17 | 🔴 P0 | **`TrendIndicator`** | 🟦 UI | text primitive | `▲ +1.24%` arrow icon + color | Same | — | XS | Tiny but used in dozens of places. |
| 18 | 🔴 P0 | **`Label`** | 🟦 UI | form primitive | Every form field | `StrategyParamsForm` field | — | XS | shadcn ships; needed by `Form`. |
| 19 | 🔴 P0 | **`Field` / `FormItem`** | 🟦 UI | form primitive | OrderTicket field layout | Parameter editor field layout | `Label` | S | Label + description + error + control wrapper. |
| 20 | 🟠 P1 | **`Form`** | 🟦 UI | form primitive | OrderTicket schema validation | StrategyParamsForm, signal filters | RHForm, zod (already likely deps) | M | Schema‑driven; standard shadcn pattern. |
| 21 | 🟠 P1 | **`Kbd`** | 🟦 UI | text primitive | Keyboard hints in `CommandPalette`, shortcuts | Same | — | XS | Inline `<kbd>` styling. |
| 22 | 🟠 P1 | **`VisuallyHidden`** | 🟦 UI | a11y primitive | sr-only labels on Avatar/Tabs | Same | — | XS | Replace inline `sr-only`. |
| 23 | 🟠 P1 | **`EmptyState` / `Placeholder`** | 🟦 UI | composite | DataTable zero/state fills | Same — every list/grid | — | S | Icon + title + description + optional CTA button. |
| 24 | 🟡 P2 | **`TagInput`** | 🟦 UI | form primitive | Ticker / sector tags when filtering | Signal tag filter, universe tags | `Chip` | S | Free‑text tokens emits chips. |
| 25 | 🟡 P2 | **`OTPInput` / `PinInput`** | 🟦 UI | form primitive | Auth flows | Auth flows | — | S | For the planned Auth templates. |
| 26 | 🟡 P2 | **`PhoneInput`** | 🟦 UI | form primitive | Account opening forms | n/a | `Input`, `Select` | S | Composite with country code select. |
| 27 | 🟡 P2 | **`FileUpload` / `Dropzone`** | 🟦 UI | form primitive | Document upload in onboarding | Dataset upload, notebook upload | — | M | Drag & drop; resumable flows later. |
| 28 | 🟢 P3 | **`MentionsInput`** | 🟦 UI | input primitive | n/a | Tag collaborators in research notes | textarea, Combobox | M | Tie to chat / notes. |
| 29 | 🟢 P3 | **`RichTextEditor`** | 🟦 UI | input primitive | Research note editing | Research note, strategy description | Tiptap / Slate | XL | Only if committed; high maintenance. |

---

## Section 3 — Layout & Shell (Finance‑Flavored)
*(Needed before the planned `Admin Dashboard Layout` template can ship.)*

**Packaging:** All items 🟦 **`@agentix/ui`** except `MarketViewLayout` (#37), which is a composed shell — candidate for a future `@agentix/templates` or kept in the existing `src/templates/` secondary entrypoint pattern.

| # | Rank | Component | Location | Category | Finance Use | Quant Use | Deps | Effort | Notes |
|---|------|-----------|----------|----------|-------------|-----------|------|--------|-------|
| 30 | 🔴 P0 | **`Typography`** | 🟦 UI | text primitive | Headings/prose everywhere | Same | — | XS | Already on roadmap as 📋; trivial. |
| 31 | 🟠 P1 | **`Sidebar`** | 🟦 UI | layout | Symbol/data sidebar | Strategy/feature tree sidebar | — | M | Responsive, collapsible, keyboardable. |
| 32 | 🟠 P1 | **`TreeView`** | 🟦 UI | navigation | Symbol universe tree | Strategy run tree, feature tree | `react-arborist` (virtualization) | M | Essential for Electron apps too. |
| 33 | 🟡 P2 | **`Collapsible`** | 🟦 UI | disclosure | Filter sections | Param group unveiling | Radix Collapsible | XS | Already 🟢 on roadmap. |
| 34 | 🟡 P2 | **`AspectRatio`** | 🟦 UI | layout | Avatar in cards, media tiles | Chart page thumbnails | Radix | XS | Already 🟢 on roadmap. |
| 35 | 🟡 P2 | **`WorkspaceTabs`** | 🟦 UI | navigation | Trading workspace tabs (chart/book/blotter) | Backtest workspace tabs | `Tabs` | M | Close/pin/unsaved indicator. |
| 36 | 🟡 P2 | **`DateRangePicker`** | 🟦 UI | form primitive | Quick ranges over any price chart | Backtest IS/OOS date range | `DatePicker`, `Popover` | M | Presets: 1D / 5D / 1M / YTD / 1Y / MAX. |
| 37 | 🟡 P2 | **`MarketViewLayout`** | ⬜ Template | layout template | chart + book + blotter shell | n/a | `Resizable`, `Tabs` | M | Composed layout — the canonical trading view. Belongs in templates, not charts. |
| 38 | 🟡 P2 | **`SegmentedProgress` | `RangeBar`** | 🟦 UI | chart primitive | Multi‑segment allocation bar | Allocation / exposure bars | — | S | Already 🟡 on roadmap. Sibling of `Progress`. |
| 39 | 🟢 P3 | **`PriceTicker` / `MarqueeTicker`** | 🟦 UI | display | Scrolling market tape | n/a | — | M | Horizontal CSS animation. |
| 40 | 🟢 P3 | **`Menubar`** | 🟦 UI | navigation | Menu bar in app shell (Electron) | Same | Radix | M | Already 🟢 on roadmap. |
| 41 | 🟢 P3 | **`ColorPicker`** | 🟦 UI | form primitive | Theme/chart customization | Chart series color picker | — | M | Already 🟢 on roadmap. |

---

## Section 4 — Financial Dashboard Components
*(Dashboards / portfolio / execution / monitoring)*

**Packaging:** Mostly 🟦 **`@agentix/ui`** (composites and small widgets). Heavy chart‑backed items go to 🟧 **`@agentix/charts`** (DepthChart #42, VolumeProfile #45, OptionsChain #46, PriceTiersChart #60). Layout templates like `MarketViewLayout` are ⬜ templates and already handled in §3.

### Market Microstructure

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 42 | 🟠 P1 | **`DepthChart`** | 🟧 Charts | Visual bid/ask depth profile alongside `OrderBook` | `Heatmap` or SVG | M | Reuses `OrderBookLevel.total`. |
| 43 | 🟠 P1 | **`PriceLadder` / `DOMView`** | 🟦 UI | Numeric DOM ladder for futures | `ScrollArea` | M | No depth bars; numbers only. |
| 44 | 🟡 P2 | **`TradeBlotter`** (generic) | 🟦 UI | Persistent live orders with cancel/modify | `DataTable`, filters | L | The canonical finance workspace primitive. |
| 45 | 🟡 P2 | **`VolumeProfile`** | 🟧 Charts | Horizontal volume by price histogram | SVG | M | Pairs with DepthChart. |
| 46 | 🟢 P3 | **`OptionsChain`** | 🟧 Charts | Calls/puts grid with IV/OI/delta | `DataTable` | L | Defer unless options platform target. |
| 47 | 🟢 P3 | **`MultiLegBuilder`** | 🟧 Charts | Build multi‑leg option orders | `OptionsChain` | XL | Depends on #46. |

### Portfolio & Analytics

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 48 | 🟠 P1 | **`SymbolHeader`** | 🟦 UI | Ticker + name + last + bid/ask on every detail view | — | S | Missing piece on every symbol view. |
| 49 | 🟠 P1 | **`QuoteStatsStrip`** | 🟦 UI | Day hi/lo, 52w hi/lo, P/E, mcap, dividend yield | — | S | Pairs with `SymbolHeader`. |
| 50 | 🟡 P2 | **`AccountStatsBar`** | 🟦 UI | Dense top strip: buying power, equity, cash, margin, P&L | — | S | Strip companion to `AccountSummary`. |
| 51 | 🟡 P2 | **`RebalanceTable`** | 🟦 UI | Target vs current weight + delta + suggested orders | `DataTable` | M | |
| 52 | 🟡 P2 | **`TaxLotTable`** | 🟦 UI | Tax lots with cost basis & holding period | `DataTable` | M | |
| 53 | 🟡 P2 | **`OrderStatusBadge`** | 🟦 UI | Typed status (pending/working/filled/cancelled/rejected/partial) | `Badge` | XS | Promote template pattern to primitive. |
| 54 | 🟡 P2 | **`AllocationRebalanceSliders`** | 🟦 UI | Drag allocation sliders: before vs target | `Slider` | M | |
| 55 | 🟡 P2 | **`WorkingOrdersList`** | 🟦 UI | Composed live orders widget with actions | `DataGrid` | M | |
| 56 | 🟡 P2 | **`WatchlistCard` | `MarketMoverCard`** | 🟦 UI | Card variant of `Watchlist` row | `Sparkline` | S | |
| 57 | 🟡 P2 | **`ScreenerBar` / `FilterChipRow`** | 🟦 UI | Drag‑reorder filter chips P/E, sector, mcap | `Chip` | M | |
| 58 | 🟡 P2 | **`RangeSliderFilter`** | 🟦 UI | Dual‑thumb range filter chip | `Slider`, `Chip` | S | |
| 59 | 🟡 P2 | **`DateRangePicker`** | 🟦 UI | (see #36) | | | |
| 60 | 🟡 P2 | **`PriceTiersChart`** | 🟧 Charts | Range‑bound price-tier visualization | SVG | M | |
| 61 | 🟢 P3 | **`EmailClientLayout`** | ⬜ Template | Multi‑panel email UI | | L | Generic template too. |

### News & Research

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 62 | 🟡 P2 | **`FilingsList` / `FilingRow`** | 🟦 UI | SEC filings (8‑K, 10‑Q) with type badge | `Badge`, `DataTable` | S | |
| 63 | 🟡 P2 | **`EarningsCalendar` / `EconomicCalendar`** | 🟦 UI | Grid of upcoming events with consensus vs actual | `DataTable` | M | |
| 64 | 🟡 P2 | **`EventTimeline`** | 🟦 UI | Corporate‑action timeline (split, div, M&A) | — | M | |
| 65 | 🟡 P2 | **`ResearchNoteCard`** | 🟦 UI | Analyst note with rating + price target + confidence | `Badge` | S | |
| 66 | 🟢 P3 | **`PressReleaseList`** | 🟦 UI | Branded news row variant | `NewsFeed` | S | |

---

## Section 5 — Quant Dashboard Components

**Packaging:** All chart‑backed quant widgets go to 🟧 **`@agentix/charts`**. Pure‑UI composites that don't render chart geometry stay in 🟦 **`@agentix/ui`** (KPI strips, parameter search forms, status cards, pure‑table widgets). When a quant chart is composed of `DataTable` + chart cells, the chart cells are charts; the surrounding table is UI.

### Quant‑specific charts (composed on top of Section 1 primitives)

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 67 | 🔴 P0 | **`EquityCurve`** | 🟧 Charts | Cumulative return / NAV line — spine of every quant view | `LineChart` | S | Nothing quant without it. |
| 68 | 🟠 P1 | **`DrawdownCurve` / `UnderwaterPlot`** | 🟧 Charts | Negative‑area chart of drawdowns over time | `AreaChart` | S | Reuses LineChart geometry. |
| 69 | 🟠 P1 | **`RollingMetricChart`** | 🟧 Charts | Rolling Sharpe / vol / beta / correlation | `LineChart` | S | Horizon slider optional. |
| 70 | 🟠 P1 | **`ReturnsHistogram`** | 🟧 Charts | Daily return distribution with normal overlay | `Histogram` | S | Composes #6. |
| 71 | 🟠 P1 | **`MonthlyReturnsHeatmap`** | 🟧 Charts | Calendar‑style red‑green monthly returns | `Heatmap` | S | Icons from `Heatmap`. |
| 72 | 🟠 P1 | **`CorrelationMatrix`** | 🟧 Charts | NxN correlation heatmap | `Heatmap` | S | Axis labels + divergent scale. |
| 73 | 🟠 P1 | **`FactorScatterPlot`** | 🟧 Charts | Factor exposure scatter with regression + R² | `ScatterPlot` | S | Composes #4. |
| 74 | 🟡 P2 | **`QQPlot` / `NormalProbabilityPlot`** | 🟧 Charts | Returns vs normal quantiles | `ScatterPlot` | S | |
| 75 | 🟡 P2 | **`VolatilityConeChart`** | 🟧 Charts | Realized vol with forward vol cone | `LineChart` | M | |
| 76 | 🟡 P2 | **`TermStructureChart`** | 🟧 Charts | Yield curve, IV term structure | `LineChart` | S | |
| 77 | 🟡 P2 | **`MonteCarloFanChart`** | 🟧 Charts | Equity curve with percentile bands | `LineChart` | M | |
| 78 | 🟡 P2 | **`ReturnsByGroupBoxPlot`** | 🟧 Charts | Returns by sector / regime / decile | `BoxPlot` | S | |
| 79 | 🟡 P2 | **`FactorExposureBars`** | 🟧 Charts | Bar plot of portfolio exposure across factors | `BarChart` | S | |
| 80 | 🟡 P2 | **`BetaDecompositionChart`** | 🟧 Charts | Stacked bars decomposing returns into factors | `BarChart` | S | |
| 81 | 🟢 P3 | **`SurfaceChart`** (reuse #10) | 🟧 Charts | Implied vol surface | `Heatmap` | M | |
| 82 | 🟢 P3 | **`ConfusionMatrix`** | 🟧 Charts | ML classifier auditor | `Heatmap` | S | |
| 83 | 🟢 P3 | **`CalibrationCurve`** | 🟧 Charts | Predicted vs empirical prob | `ScatterPlot` | S | |
| 84 | 🟢 P3 | **`LiftCurve` / `CumGains`** | 🟧 Charts | Model lift for classifier research | `LineChart` | S | |

### Signal & alpha research

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 85 | 🟠 P1 | **`SignalHeatmap`** | 🟧 Charts | Signal strength x instrument x time | `Heatmap` | S | |
| 86 | 🟠 P1 | **`QuantileSpreadChart`** | 🟧 Charts | Long top decile − short bottom decile cumulative | `LineChart` | S | The signal efficacy chart. |
| 87 | 🟠 P1 | **`ICBars` / `InformationCoefficientPlot`** | 🟧 Charts | Monthly IC bars | `BarChart` | S | Canonical "is signal alive?" view. |
| 88 | 🟡 P2 | **`SignalDecayChart`** | 🟧 Charts | Signal vs forward return at horizons 1d/5d/10d/21d | `BarChart`/`LineChart` | S | |
| 89 | 🟡 P2 | **`RankerTable` / `LongShortList`** | 🟦 UI | Top/bottom N ranked instruments with z‑score + weight | `DataTable` | S | Pure table; no chart geometry. |
| 90 | 🟡 P2 | **`CrossSectionalScatter`** | 🟧 Charts | Signal vs fwd return colored by sector | `ScatterPlot` | S | |
| 91 | 🟡 P2 | **`FeatureImportanceBars`** | 🟧 Charts | ML feature importances with sign (SHAP‑like) | `BarChart` | S | |
| 92 | 🟡 P2 | **`SignalDistributionHistogram`** | 🟧 Charts | Dispersion & decay view | `Histogram` | S | |

### Risk views

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 93 | 🟠 P1 | **`RiskDecompositionDonut`** | 🟧 Charts | Systematic / idiosyncratic / factor / currency | `DonutChart` | S | |
| 94 | 🟠 P1 | **`LimitsDashboard` / `LimitGaugeCluster`** | 🟦 UI | Leverage / gross / concentration / VaR gauges cluster | `Gauge` | M | Pure composition of in‑UI `Gauge` primitives. |
| 95 | 🟡 P2 | **`MarginalRiskContribution`** | 🟧 Charts | Stacked bars of position contributions to vol | `BarChart` | S | |
| 96 | 🟡 P2 | **`StressTestTable`** | 🟦 UI | Scenario × P&L impact grid | `DataTable` | M | |
| 97 | 🟡 P2 | **`ScenarioShockBar`** | 🟧 Charts | Bar of P&L per unit shock to each factor | `BarChart` | S | |
| 98 | 🟡 P2 | **`VaRGrid` / `VaRDisplay`** | 🟦 UI | Parametric/historical/MC with confidence bands | — | M | Numbers + small bars; stays UI if no chart engine. |
| 99 | 🟡 P2 | **`ExpectedShortfallCard`** | 🟦 UI | CVaR + VaR side by side | — | S | |
| 100 | 🟡 P2 | **`GreekLettersDisplay`** | 🟦 UI | Delta / Gamma / Vega / Theta / Rho cluster | — | S | |
| 101 | 🟡 P2 | **`GreeksDecayChart`** | 🟧 Charts | Greek evolution over time/spot | `LineChart` | M | |
| 102 | 🟢 P3 | **`LiquidityHorizonBar`** | 🟧 Charts | Days‑to‑liquidate per position | `BarChart` | S | |
| 103 | 🟢 P3 | **`CounterpartyExposureTable`** | 🟦 UI | Netting set / exposure / CVA table | `DataTable` | M | |

### Performance attribution & KPIs

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 104 | 🔴 P0 | **`QuantMetricStrip` / `KpiRow`** | 🟦 UI | Horizontal `StatTile` strip for Sharpe/Sortino/maxDD/CAGR/Calmar/winRate | `StatTile`, `NumericText` | S | Backbone of every tearsheet. Pure composition of in‑UI primitives. |
| 105 | 🟡 P2 | **`PerformanceAttributionTable`** | 🟦 UI | Return decomposition across factors / sectors | `DataTable` | M | |
| 106 | 🟡 P2 | **`MetricWithTooltip`** | 🟦 UI | `StatTile` variant with help → tooltip explainer | `StatTile`, `Tooltip` | S | Onboarding‑friendly. |
| 107 | 🟡 P2 | **`MetricTable`** | 🟦 UI | Compact `key | value | benchmark | delta` fit report table | `DataTable` | S | |
| 108 | 🟡 P2 | **`SignalStrengthBar`** | 🟦 UI | Directional center‑origin bar of long/short score | — | S | Sibling of `SegmentedProgress`/`Progress`. |
| 109 | 🟡 P2 | **`PnLRatioBar`** | 🟦 UI | Win/loss profit factor viz | — | S | |
| 110 | 🟢 P3 | **`NumberStatPill`** | 🟦 UI | Pill `metric: value vs benchmark` | — | XS | |

### Backtest runs & management

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 111 | 🟠 P1 | **`BacktestRunCard`** | 🟦 UI | Run metadata card: strategy, date range, params, status | `Badge` | S | |
| 112 | 🟠 P1 | **`BacktestComparisonTable`** | 🟦 UI | Multi‑run side‑by‑side Sharpe/DD/CAGR/turnover | `DataTable` | S | |
| 113 | 🟡 P2 | **`ParameterSweepHeatmap`** | 🟧 Charts | 2D metric heatmap over (param_a, param_b) | `Heatmap` | M | |
| 114 | 🟡 P2 | **`WalkForwardResults`** | 🟧 Charts | IS vs OOS bars per segment | `BarChart` | S | |
| 115 | 🟡 P2 | **`StrategyList` / `StrategyCardGrid`** | 🟦 UI | Cards of strategy runs with status + AUM + Sharpe | — | S | |
| 116 | 🟡 P2 | **`StrategyRunsBrowser`** | 🟦 UI | Tree of backtest runs with param diff | `TreeView` | M | Depends on #32. |
| 117 | 🟡 P2 | **`StrategyParamsForm`** | 🟦 UI | Schema form for strategy config | `Form` | L | Depends on #20. |
| 118 | 🟡 P2 | **`ParameterComparisonTable`** | 🟦 UI | Diff two runs' params | `DataTable` | S | |
| 119 | 🟡 P2 | **`TradeLog` / `FilledTradesTable`** | 🟦 UI | Filled trades history with P&L/fees/slippage | `DataTable` | M | Differs from `TimeAndSales` (market tape). |
| 120 | 🟡 P2 | **`TradeMarkerOverlay`** | 🟧 Charts | Entry/exit markers atop price/equity chart | `LineChart` | M | |
| 121 | 🟡 P2 | **`PositionHeatmap`** | 🟧 Charts | Time × symbol heat of weight | `Heatmap` | M | |
| 122 | 🟡 P2 | **`TurnoverPlot`** | 🟧 Charts | Daily turnover line vs NAV | `LineChart` | S | |
| 123 | 🟡 P2 | **`SlippageCostBreakdown`** | 🟧 Charts | Stacked bars: spread, impact, fees, financing | `BarChart` | S | |
| 124 | 🟡 P2 | **`RegimeShadeOverlay`** | 🟧 Charts | Background regime shading on any chart | — | S | |
| 125 | 🟢 P3 | **`MonteCarloFanChart`** | 🟧 Charts | Same as #77 — quant usage | | | |
| 126 | 🟢 P3 | **`TearsheetExportButton`** | 🟦 UI | Export BacktestTearsheet to PDF/PNG | — | M | Trigger button is UI; consumer wires export lib. |

### Research / data exploration

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 127 | 🟡 P2 | **`DatasetPreviewTable`** | 🟦 UI | `DataTable` with dtype headers + sample controls | `DataTable` | M | "First 100 rows" explorer. |
| 128 | 🟡 P2 | **`FeatureTable` / `FeatureMetadataSidebar`** | 🟦 UI | Columns dtype, coverage, stationarity, missingness | — | M | Jupyter `describe` UI. |
| 129 | 🟡 P2 | **`TimeSeriesPicker`** | 🟦 UI | Multi series dropdown + range picker above chart | `MultiSelect`, `DateRangePicker` | M | |
| 130 | 🟡 P2 | **`CrossSectionalPicker`** | 🟦 UI | Universe + date slicer | `MultiSelect` | S | |
| 131 | 🟢 P3 | **`NotebookCellStyle` / `CellOutput`** | 🟦 UI | Embedded research cell card (code + output) | — | L | Could back AI companion features. |

### Quant infrastructure UI

| # | Rank | Component | Location | Use Case | Deps | Effort | Notes |
|---|------|-----------|----------|----------|------|--------|-------|
| 132 | 🟡 P2 | **`PipelineDAGView` / `JobGraph`** | 🟧 Charts | Show data pipeline flow | — | L | Chart geometry (node/link layout). |
| 133 | 🟡 P2 | **`JobRunRow` / `JobStatusTable`** | 🟦 UI | Pipeline status, duration, retries | `DataTable` | S | |
| 134 | 🟡 P2 | **`RuntimeMonitor`** | 🟧 Charts | CPU/mem/network strip for runs | `LineChart`/`BarChart` | M | |
| 135 | 🟡 P2 | **`UniverseSelector`** | 🟦 UI | Tree + multi‑select + filter for symbol universe | `TreeView`, `MultiSelect` | M | |
| 136 | 🟡 P2 | **`ParameterSearchForm`** | 🟦 UI | Search runs by strategy, date, params | `Form`, `DataTable` | S | |
| 137 | 🟢 P3 | **`VersionedRunsTree`** | 🟦 UI | Git‑like strategy version graph | `TreeView` | L | |
| 138 | 🟢 P3 | **`SymbolSearchCommand`** | 🟦 UI | Finance‑specific `CommandPalette` group | `CommandPalette` | S | |

---

## Section 6 — Composed Templates (Multi‑component reports)

**Packaging:** These are composed dashboards that draw on **both** packages. They likely live in a third `@agentix/templates` (or `@agentix/quant‑templates`) package, or in `src/templates/` for UI‑only ones. Each row marks the dominant dependency.

| # | Rank | Component | Location | Use Case | Composes | Effort | Notes |
|---|------|-----------|----------|----------|----------|--------|-------|
| 139 | 🔴 P0 | **`BacktestTearsheet`** | ⬜ Template | One‑page backtest report | #1, #3, #67, #68, #71, #72, #104 | L | The killer quant widget. Needs both UI & charts. |
| 140 | 🟠 P1 | **`AlphaTearsheet`** | ⬜ Template | Alpha research report (equity + IC + quantile spread) | #67, #87, #86 | L | Dominant dep: charts. |
| 141 | 🟠 P1 | **`RiskDashboard`** | ⬜ Template | Composed risk workspace with gauges + decomposition + VaR | #13, #93, #94, #98 | L | Mixes UI `Gauge` + charts `DonutChart`. |
| 142 | 🟠 P1 | **`SymbolDetailPage`** | ⬜ Template | Full symbol detail layout: shell + chart + book + blotter + news | #48, #49, #8, #42, #44, #66 | XL | Heavy chart dep. |
| 143 | 🟡 P2 | **`PortfolioDashboard`** | ⬜ Template | Composed portfolio view: KPIs + allocation + holdings + heatmap | `StatTile`, `DonutChart`, `HoldingsTable`, `Heatmap` | L | Mostly UI + one chart. |
| 144 | 🟡 P2 | **`QuantWorkspace`** | ⬜ Template | Tabs of tearsheet / risk / alpha / research notes | #139, #141, #140 | XL | Composition of templates. |
| 145 | 🟢 P3 | **`MonteCarloReport`** | ⬜ Template | MC simulation fan chart + percentile table + VaR | #77, #98 | L | Dominant dep: charts. |

---

## Suggested Build Order

A concrete sequencing that respects composition dependencies and unlocks the most user‑visible value fastest. **Phases that target 🟦 `@agentix/ui` can proceed now**; phases targeting 🟧 `@agentix/charts` block on creating the new package (see `docs/chart-library-strategy.md`).

### Phase A — UI chart primitives + form/text (🟦 `@agentix/ui`, ship now)
1. `Sparkline` (XS) — #1
2. `NumericText` / `PnLText` (XS) — #16
3. `TrendIndicator` (XS) — #17
4. `Typography` (XS) — #30
5. `Label` (XS) — #18
6. `Field` (S) — #19
7. `Kbd` (XS) — #21
8. `VisuallyHidden` (XS) — #22
9. `EmptyState` (S) — #23
10. `Gauge` (S) — #13
11. `SegmentedProgress` / `RangeBar` (S) — #38
12. `MiniBars` (XS) — sibling of `Sparkline`; not on the table but a natural fit.

### Phase B — UI financial primitives (🟦 `@agentix/ui`, ship now)
13. `SymbolHeader` (S) — #48
14. `QuoteStatsStrip` (S) — #49
15. `AccountStatsBar` (S) — #50
16. `OrderStatusBadge` (XS) — #53
17. `DateRangePicker` (M) — #36
18. `QuantMetricStrip` / `KpiRow` (S) — #104
19. `MetricWithTooltip` (S) — #106
20. `MetricTable` (S) — #107
21. `SignalStrengthBar` (S) — #108
22. `PnLRatioBar` (S) — #109
23. `WorkingOrdersList` (M) — #55
24. `TradeBlotter` (L) — #44
25. `WatchlistCard` / `MarketMoverCard` (S) — #56
26. `ScreenerBar` / `FilterChipRow` (M) — #57
27. `RangeSliderFilter` (S) — #58
28. `Form` (M) — #20
29. `TreeView` (M) — #32
30. `Sidebar` (M) — #31
31. `Collapsible` (XS) — #33
32. `AspectRatio` (XS) — #34
33. `WorkspaceTabs` (M) — #35
34. `TagInput` (S) — #24

### Phase C — Initialize 🟧 `@agentix/charts` package (BLOCKER for chart work)
35. Scaffold `charts/` workspace folder (pnpm workspaces, tsup, shared Storybook section).
36. Pick charting engine: `visx` for SVG primitives + optional `lightweight-charts` peer for canvas‑backed `CandlestickChart`.
37. Implement chart chrome: `ChartCard`, `ChartTooltip`, `ChartLegend`, `ChartGrid`.
38. Implement scale + axis utilities (linear, log, time, divergent color).

### Phase D — Chart foundation (🟧 `@agentix/charts`, after Phase C)
39. `Heatmap` (S) — #2
40. `LineChart`/`AreaChart` (M) — #3
41. `Histogram` (S) — #6
42. `BarChart` (S) — #5
43. `ScatterPlot` (M) — #4
44. `DonutChart` (S) — #7
45. `BoxPlot` (S) — #9
46. `Treemap` (M) — #12
47. `RadarChart` (S) — #11

### Phase E — Financial chart widgets (🟧 `@agentix/charts`)
48. `CandlestickChart` (L) — #8
49. `DepthChart` (M) — #42
50. `VolumeProfile` (M) — #45
51. `PriceTiersChart` (M) — #60

### Phase F — Quant chart widgets (🟧 `@agentix/charts`)
52. `EquityCurve` (S) — #67
53. `DrawdownCurve` (S) — #68
54. `RollingMetricChart` (S) — #69
55. `ReturnsHistogram` (S) — #70
56. `MonthlyReturnsHeatmap` (S) — #71
57. `CorrelationMatrix` (S) — #72
58. `FactorScatterPlot` (S) — #73
59. `QQPlot` (S) — #74
60. `VolatilityConeChart` (M) — #75
61. `TermStructureChart` (S) — #76
62. `MonteCarloFanChart` (M) — #77
63. `ReturnsByGroupBoxPlot` (S) — #78
64. `FactorExposureBars` (S) — #79
65. `BetaDecompositionChart` (S) — #80
66. `SignalHeatmap` (S) — #85
67. `QuantileSpreadChart` (S) — #86
68. `ICBars` (S) — #87
69. `SignalDecayChart` (S) — #88
70. `CrossSectionalScatter` (S) — #90
71. `FeatureImportanceBars` (S) — #91
72. `SignalDistributionHistogram` (S) — #92
73. `RiskDecompositionDonut` (S) — #93
74. `MarginalRiskContribution` (S) — #95
75. `ScenarioShockBar` (S) — #97
76. `GreeksDecayChart` (M) — #101
77. `LiquidityHorizonBar` (S) — #102
78. `ParameterSweepHeatmap` (M) — #113
79. `WalkForwardResults` (S) — #114
80. `TradeMarkerOverlay` (M) — #120
81. `PositionHeatmap` (M) — #121
82. `TurnoverPlot` (S) — #122
83. `SlippageCostBreakdown` (S) — #123
84. `RegimeShadeOverlay` (S) — #124

### Phase G — Quant reports (⬜ templates package, after Phase F)
85. **`BacktestTearsheet`** (L) — #139 ← milestone
86. `AlphaTearsheet` (L) — #140
87. `RiskDashboard` (L) — #141
88. `PortfolioDashboard` (L) — #143
89. `QuantWorkspace` (XL) — #144

### Phase H — Management & infra (mixed 🟦 UI + 🟧 charts)
90. `StrategyParamsForm` (L) — #117
91. `StrategyList` / `StrategyCardGrid` (S) — #115
92. `BacktestRunCard` (S) — #111
93. `BacktestComparisonTable` (S) — #112
94. `StrategyRunsBrowser` (M) — #116
95. `ParameterComparisonTable` (S) — #118
96. `TradeLog` / `FilledTradesTable` (M) — #119
97. `TearsheetExportButton` (M) — #126
98. `LimitsDashboard` (M) — #94
99. `VaRGrid` (M) — #98
100. `ExpectedShortfallCard` (S) — #99
101. `GreekLettersDisplay` (S) — #100
102. `StressTestTable` (M) — #96
103. `RebalanceTable` (M) — #51
104. `TaxLotTable` (M) — #52
105. `AllocationRebalanceSliders` (M) — #54

### Phase I — Management long tail (mixed)
106. `DatasetPreviewTable` (M) — #127
107. `FeatureTable` / `FeatureMetadataSidebar` (M) — #128
108. `TimeSeriesPicker` (M) — #129
109. `CrossSectionalPicker` (S) — #130
110. `UniverseSelector` (M) — #135
111. `ParameterSearchForm` (S) — #136
112. `JobRunRow` / `JobStatusTable` (S) — #133
113. `RuntimeMonitor` (M) — #134 (chart)
114. `PipelineDAGView` / `JobGraph` (L) — #132 (chart)
115. `VersionedRunsTree` (L) — #137
116. `SymbolSearchCommand` (S) — #138

### Phase J — Final long tail
117. `MarketViewLayout` (M) — #37
118. `SymbolDetailPage` (XL) — #142
119. `MonteCarloReport` (L) — #145
120. Options: `OptionsChain` (L) — #46, `MultiLegBuilder` (XL) — #47
121. `EmailClientLayout` (L) — #61
122. `NotebookCellStyle` (L) — #131
123. `ConfusionMatrix` (S) — #82
124. `CalibrationCurve` (S) — #83
125. `LiftCurve` (S) — #84
126. `SurfaceChart` (M) — #10 / #81
127. `SankeyChart` (L) — #14
128. `OTPInput` (S) — #25, `PhoneInput` (S) — #26, `FileUpload` (M) — #27, `MentionsInput` (M) — #28, `RichTextEditor` (XL) — #29
129. `PriceTicker` / `MarqueeTicker` (M) — #39
130. `Menubar` (M) — #40
131. `ColorPicker` (M) — #41
132. `RankerTable` (S) — #89
133. `NumberStatPill` (XS) — #110
134. `PerformanceAttributionTable` (M) — #105
135. `CounterpartyExposureTable` (M) — #103
136. `FilingsList` (S) — #62, `EarningsCalendar` (M) — #63, `EventTimeline` (M) — #64, `ResearchNoteCard` (S) — #65, `PressReleaseList` (S) — #66

---

## Cross‑Reference Notes

- Items already on `docs/roadmap/*`: `Typography` (📋), `Collapsible` (🟢), `Menubar` (🟢), `ColorPicker` (🟢), `RichTextEditor` (🟢), `AspectRatio` (🟢), `FileUpload` (🟢), `Progress (advanced)` (🟡). Those rows here update/restate those with finance/quant use cases.
- Items already implemented and referenced here as dependencies: `OrderBook`, `TimeAndSales`, `StatTile`, `DataTable`, `Card`, `Badge`, `Avatar`, `Switch`, `Slider`, `Tabs`, `Breadcrumb`, `Pagination`, `Carousel`, `Separator`, `Progress`, `Skeleton`, `Container`, `Grid`, `Flex`, `Resizable`, `ScrollArea`, `AlertDialog`, `DropdownMenu`, `ContextMenu`, `HoverCard`, `Tooltip`, `DatePicker`, `TimePicker`, `DateTimePicker`, `MultiSelect`, `Combobox`, `CommandPalette`, `ToggleGroup`, `Toolbar`, `Toast`.
- `Sparkline` is the single highest-ROI gap: it immediately fills a render slot already exposed in `StatTile` (`sparklineRenderSlot`) and closes visual needs across every dashboard and tearsheet. **In‑scope for `@agentix/ui` right now.**
- `BacktestTearsheet` is the single highest-ROI composition: with `EquityCurve` + `Heatmap` + `LineChart` in place, it ties three primitive charts into one killer quant widget. **Blocked** on `@agentix/charts` package (Phase C).

## Packaging Summary

Counts by destination (from the 145 table rows above):

| Package | Count | Representative items |
|---------|-------|---------------------|
| 🟦 `@agentix/ui` (in‑scope now) | ~75 | Sparkline, NumericText, TrendIndicator, Label, Field, Form, Typography, EmptyState, Gauge, SymbolHeader, QuoteStatsStrip, DateRangePicker, QuantMetricStrip, TradeBlotter, TreeView, Sidebar … |
| 🟧 `@agentix/charts` (future) | ~55 | LineChart, Heatmap, BarChart, Histogram, ScatterPlot, DonutChart, CandlestickChart, DepthChart, EquityCurve, DrawdownCurve, CorrelationMatrix, SignalHeatmap, ICBars, BacktestTearsheet dependencies … |
| ⬜ templates (third package or `src/templates/`) | ~15 | MarketViewLayout, EmailClientLayout, BacktestTearsheet, AlphaTearsheet, RiskDashboard, SymbolDetailPage, PortfolioDashboard, QuantWorkspace, MonteCarloReport … |

## Next Actions (recommended)

1. **Approve / amend `docs/chart-library-strategy.md`** as the boundary contract.
2. Begin **Phase A** in `@agentix/ui`: `Sparkline`, `NumericText`, `TrendIndicator`, `Typography`, `Label`, `Field`, `Kbd`, `VisuallyHidden`, `EmptyState`, `Gauge`, `SegmentedProgress`. All are in‑scope, low effort, no chart‑dependency.
3. Pick a date to start **Phase C** (scaffold `@agentix/charts` package) — that's the blocker for everything in Phases D–G.