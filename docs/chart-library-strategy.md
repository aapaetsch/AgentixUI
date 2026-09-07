# Charting Library Strategy

> Decision record: how `aapaetsch-ui-kit` should relate to chart components.
> Status: **Implemented**. Last reviewed: 2026-08-19.

## TL;DR

Chart components ship in a **separate `aapaetsch-charts` package**. `aapaetsch-ui-kit` keeps
only tiny, dependency‑free, inline‑SVG "data‑viz primitives" that are visually and
functionally indistinguishable from UI primitives (Sparkline, Gauge, NumericText,
TrendIndicator, MiniBars, SegmentedProgress). Everything else — anything with axes,
ticks, legends, tooltips, crosshairs, color scales, or domain logic — lives in
`aapaetsch-charts`.

## Why split

1. **Different dependency profile.** `aapaetsch-ui-kit` is intentionally lightweight
   (`cn`, `clsx`, `tailwind-merge`, Radix primitives, `lucide-react`).
   Charts pull in scale/shape/axis code and specialized Canvas/WebGL renderers.
   Bundling chart weights into `aapaetsch-ui-kit` forces every
   consumer — settings pages, auth flows, marketing forms — to ship megabytes of
   code they never use.
2. **Different release cadence and maintenance burden.** Chart libraries churn
   frequently (recharts, visx, d3 modules); cross‑year upgrades often break code.
   Tying that churn to `aapaetsch-ui-kit` either stalls the UI lib or churns it
   unnecessarily.
3. **Different bundling concerns.** Charts benefit from optional peer‑dep chains,
   Canvas vs SVG switches, and code‑split boundaries that have nothing to do with
   `Button`/`Card`. Mixing the two complicates `tsup.config.ts` (already handling
   ESM + CJS dual output).
4. **Different skill sets and reviewers.** Good data‑viz cares about scales,
   accessibility, color‑blind palettes, performant geographic/polar projections,
   RTL axes, and number formatting — not the same concerns as Button/Badge/Card.
   Splitting keeps contributors focused.
5. **Consumer choice.** A pure‑form app should install only `aapaetsch-ui-kit`. A quant
   dashboard installs `aapaetsch-ui-kit` + `aapaetsch-charts` explicitly. Tree‑shaking
   isn't enough—large visualization and rendering runtimes do not always tree-shake fully.

## Industry precedent

| Org | UI package | Charts package |
|-----|------------|----------------|
| shadcn/ui | `@/components/ui/*` | `@/components/charts/*` (optional wrappers over `recharts`, not part of core) |
| MUI | `@mui/material` | `@mui/x-charts` (formerly pro/premium) |
| Mantine | `@mantine/core` | `@mantine/charts` (built on `recharts` + `visx`) |
| Ant Design | `antd` | `@ant-design/charts` (built on G2/G6) |
| Radix Primitives | `@radix-ui/*` | (none) — `visx`, `recharts`, `victory` live outside Radix |

All of them separate chart code from UI primitives for the same reasons in §1.

## Boundary contract

```
aapaetsch-charts  →  aapaetsch-ui-kit  (charts consumes UI primitives, tokens, cn)
aapaetsch-ui-kit ✗  aapaetsch-charts    (UI MUST NOT depend on charts)
```

- `aapaetsch-charts` consumes from `aapaetsch-ui-kit`: `cn()`, `Tooltip`, `Popover`,
  `Card`, `Grid`, `Flex`, theme tokens from `globals.css`, and the in‑scope
  primitives (`Sparkline`, `NumericText`, `TrendIndicator`, `MiniBars`, `Gauge`,
  `SegmentedProgress`).
- `aapaetsch-ui-kit` never imports from `aapaetsch-charts`.
- `globals.css` remains the **single source of truth** for theming. Charts define
  zero CSS variables of their own; they read tokens defined by the UI kit.
- Charts MAY define new CSS variables for chart‑specific concerns (e.g.
  `--chart-1`…`--chart-5`), but those live in `aapaetsch-ui-kit`'s `globals.css` so the
  UI kit stays the single owner of visual identity across both packages.

## What stays in `aapaetsch-ui-kit`

The inline‑SVG / text‑with‑shape primitives. Rule of thumb: **if it has axes,
ticks, a legend, a tooltip, hover crosshairs, a color‑scale mapping, or domain
logic, it goes to charts. If it's a single decorative SVG that just renders a
number or a path, it stays in the UI kit.**

| Component | Why it belongs in `aapaetsch-ui-kit` |
|-----------|--------------------------------|
| `Sparkline` | One inline SVG `<path>`, no axes/scales. Slots into `StatTile`. |
| `NumericText` / `PnLText` | Text primitive; colorizes a number. |
| `TrendIndicator` | Icon + text (`▲ +1.24%`), not a chart. |
| `MiniBars` | One‑row SVG histogram; same weight as a `Spinner`. |
| `Gauge` (single needle) | Semicircle / circular gauge. Sibling of `Progress`. |
| `SegmentedProgress` / `RangeBar` | Bars; same family as `Progress`. |
| `Heatmap` (inline, ≤ ~100 cells) | Borderline. **Defer to charts** if it needs axes, color legends, or row/col labels. A small decorative tile‑grid stays here. |
| `DonutChart` (decorative, no legend/tooltip) | Borderline. **Default to charts** unless trivially small and purely decorative. |

Default: when in doubt, **put it in `aapaetsch-charts`**. We can always pull a tiny
version back into `aapaetsch-ui-kit` if it proves to be a UI primitive.

## What goes to `aapaetsch-charts`

From the `docs/finance-quant-component-roadmap.md`, the following are deferred to
`aapaetsch-charts`:

- **Foundational chart primitives:** `LineChart`, `AreaChart`, `BarChart`,
  `Histogram`, `ScatterPlot`, `BoxPlot`, `Treemap`, `SurfaceChart`,
  `SankeyChart`, `RadarChart`, `DonutChart` (full), `Heatmap` (full).
- **Financial microstructure charts:** `CandlestickChart`, `DepthChart`,
  `VolumeProfile`, `PriceLadder` (chart‑grade).
- **Quant charts:** `EquityCurve`, `DrawdownCurve`, `RollingMetricChart`,
  `ReturnsHistogram`, `MonthlyReturnsHeatmap`, `CorrelationMatrix`,
  `FactorScatterPlot`, `QQPlot`, `VolatilityCone`, `TermStructure`,
  `MonteCarloFan`, `ReturnsByGroupBoxPlot`, `SignalHeatmap`, `QuantileSpreadChart`,
  `ICBars`, `SignalDecayChart`, `RankerTable` (table, but chart‑used),
  `CrossSectionalScatter`, `FeatureImportanceBars`, `SignalDistributionHistogram`,
  `ConfusionMatrix`, `CalibrationCurve`, `LiftCurve`, `MonteCarloFanChart`
  (chart view).
- **Quant reports (composed):** `BacktestTearsheet`, `AlphaTearsheet`,
  `RiskDashboard` — arguable a third tier (`@agentix/templates` or
  `@agentix/quant-reports`), but charting code is at least half of their weight;
  start them inside `aapaetsch-charts` and split later if it becomes necessary.
- **Generic chart chrome:** `ChartCard`, `ChartTooltip`, `ChartLegend`,
  `ChartGrid`, color‑scale helpers, axis/tick utilities.

## Repo structure

Monorepo with npm workspaces. Charts live in a sibling folder, mirroring
`src/`'s conventions. Single Git repo, single PR can refactor tokens in
`aapaetsch-ui-kit` and update all consumers in `aapaetsch-charts` in one commit.

```
Aidans-React-UI/
├── src/                      # aapaetsch-ui-kit       (existing)
│   ├── components/
│   ├── templates/investment-ops/
│   ├── lib/
│   ├── styles/
│   ├── globals.css           # owns CSS variables; both packages consume
│   └── index.ts
└── charts/                   # aapaetsch-charts
    ├── src/
    │   ├── primitives/        # Line, Area, Bar, Histogram, Scatter, BoxPlot
    │   ├── scales/           # linear, log, time, divergent color
    │   ├── axis/             # Axis, Grid, Ticks, AxisLabel
    │   ├── tooltip/          # Recharts-backed, theme-aware ChartTooltip
    │   ├── chrome/           # ChartCard, ChartLegend, ChartGrid
    │   ├── heatmap/          # Heatmap + color legends
    │   ├── donut/            # DonutChart + legend
    │   ├── financial/        # Candlestick, Depth, VolumeProfile, TermStructure
    │   ├── quant/            # Equity, Drawdown, Rolling, Correlation, IC, QuantileSpread
    │   ├── reports/          # BacktestTearsheet, AlphaTearsheet, RiskDashboard
    │   └── index.ts
    ├── package.json
    ├── tsup.config.ts
    ├── tsconfig.json
    └── stories/              # own Storybook section or subapp
```

The chart surface is split into `aapaetsch-charts` for Recharts-backed SVG
primitives/compositions and `aapaetsch-charts-market` for the opt-in first-party
Canvas 2D + SVG market engine. General chart consumers do not pay for or evaluate
the market engine.

## Tooling decisions

- **Charts engine:** Recharts v3 is selected for SVG primitives, following the
  current shadcn chart composition model. `aapaetsch-charts` provides shared
  chrome and typed convenience charts without hiding Recharts exports from
  advanced consumers. `aapaetsch-charts-market` supplies the implemented,
  dependency-free Canvas engine for candlestick, OHLC bar, line, area and baseline
  market views.
- **Color scales:** use the shared `--chart-1`…`--chart-5` palette plus small,
  dependency-free sequential/divergent interpolation helpers where needed.
- **Tooltips:** use Recharts positioning with theme-aware content primitives
  that read the UI kit's surface, border, text, and chart tokens.
- **Storybook:** shared Storybook workspace; add a `Charts/` section alongside
  the existing `Components/`/`Templates/` tree.
- **Package entrypoints:** dual entrypoints — `aapaetsch-charts` (general) and
  `aapaetsch-charts/quant` (quant‑domain widgets), mirroring the existing
  `finance.ts` secondary entrypoint pattern in `src/`.

## Current implementation

The initial chart system is implemented across two npm workspaces:

- `aapaetsch-charts` provides shared Recharts chrome, ten foundational charts,
  financial and quantitative compositions, report composition, root and
  `./quant` entrypoints, tests, declarations, and shared Storybook coverage.
- `aapaetsch-charts-market` provides the ESM-only first-party Canvas 2D + SVG engine,
  five market-series modes, indicators, drawings, overlays, controls,
  synchronized workspaces, persistence migrations, accessibility fallbacks,
  performance tests, and Storybook coverage.

Heavy chart code remains outside `aapaetsch-ui-kit`; the UI package owns the
shared design tokens and does not import either chart package.

## Resolved decisions

- Candlestick and technical-analysis rendering uses the isolated first-party
  `aapaetsch-charts-market` engine. General SVG
  charts remain in the Recharts-backed `aapaetsch-charts` package.
- The initial `Tearsheet` report composition remains in `aapaetsch-charts` with
  replaceable content slots. A third report package is unnecessary at the
  current size.
- Both chart packages live and build independently inside this npm-workspace
  monorepo. Their versions and publishing cadence can diverge from the core UI
  kit without moving to separate repositories.

## Review triggers

Reopen this decision if any of these happen:

- A chart needs depth that depends on chart code; would force `aapaetsch-ui-kit` to
  depend on `aapaetsch-charts`.
- `aapaetsch-charts` releases start forcing unrelated breaking changes in
  `aapaetsch-ui-kit`.
- Bundle size of `aapaetsch-ui-kit` (compressed) grows beyond ~30KB due to chart
  imports sneaking in.
- A second domain (e.g. maps / geo) emerges, suggesting we split again into
  `aapaetsch-charts-geo` or similar.

## Changelog

| Date       | Change                                                              |
|------------|---------------------------------------------------------------------|
| 2026-08-19 | Created the npm workspace package with Recharts v3, shared chrome, LineChart, AreaChart, BarChart, tests, builds, and Storybook integration. |
| 2026-07-19 | Initial decision record created. Charts to a separate package; inline primitives kept in UI. |
