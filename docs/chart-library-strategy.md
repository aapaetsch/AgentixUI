# Charting Library Strategy

> Decision record: how `@agentix/ui` should relate to chart components.
> Status: **Active**. Last reviewed: 2026-07-19.

## TL;DR

Chart components ship in a **separate `@agentix/charts` package**. `@agentix/ui` keeps
only tiny, dependency‑free, inline‑SVG "data‑viz primitives" that are visually and
functionally indistinguishable from UI primitives (Sparkline, Gauge, NumericText,
TrendIndicator, MiniBars, SegmentedProgress). Everything else — anything with axes,
ticks, legends, tooltips, crosshairs, color scales, or domain logic — lives in
`@agentix/charts`.

## Why split

1. **Different dependency profile.** `@agentix/ui` is intentionally lightweight
   (`cn`, `clsx`, `tailwind-merge`, Radix primitives, `lucide-react`).
   Charts pull in scale/shape/axis code (D3 modules, `visx`, `lightweight-charts`,
   possibly Canvas/WebGL). Bundling chart weights into `@agentix/ui` forces every
   consumer — settings pages, auth flows, marketing forms — to ship megabytes of
   code they never use.
2. **Different release cadence and maintenance burden.** Chart libraries churn
   frequently (recharts, visx, d3 modules); cross‑year upgrades often break code.
   Tying that churn to `@agentix/ui` either stalls the UI lib or churns it
   unnecessarily.
3. **Different bundling concerns.** Charts benefit from optional peer‑dep chains,
   Canvas vs SVG switches, and code‑split boundaries that have nothing to do with
   `Button`/`Card`. Mixing the two complicates `tsup.config.ts` (already handling
   ESM + CJS dual output).
4. **Different skill sets and reviewers.** Good data‑viz cares about scales,
   accessibility, color‑blind palettes, performant geographic/polar projections,
   RTL axes, and number formatting — not the same concerns as Button/Badge/Card.
   Splitting keeps contributors focused.
5. **Consumer choice.** A pure‑form app should install only `@agentix/ui`. A quant
   dashboard installs `@agentix/ui` + `@agentix/charts` explicitly. Tree‑shaking
   isn't enough — `lightweight-charts` alone is ~150KB even when unused, and
   canvas/WebGL runtimes don't tree‑shake fully.

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
@agentix/charts  →  @agentix/ui    (charts consumes ui primitives, tokens, cn)
@agentix/ui     ✗  @agentix/charts (ui MUST NOT depend on charts)
```

- `@agentix/charts` consumes from `@agentix/ui`: `cn()`, `Tooltip`, `Popover`,
  `Card`, `Grid`, `Flex`, theme tokens from `globals.css`, and the in‑scope
  primitives (`Sparkline`, `NumericText`, `TrendIndicator`, `MiniBars`, `Gauge`,
  `SegmentedProgress`).
- `@agentix/ui` never imports from `@agentix/charts`.
- `globals.css` remains the **single source of truth** for theming. Charts define
  zero CSS variables of their own; they read tokens defined by the UI kit.
- Charts MAY define new CSS variables for chart‑specific concerns (e.g.
  `--chart-1`…`--chart-5`), but those live in `@agentix/ui`'s `globals.css` so the
  UI kit stays the single owner of visual identity across both packages.

## What stays in `@agentix/ui`

The inline‑SVG / text‑with‑shape primitives. Rule of thumb: **if it has axes,
ticks, a legend, a tooltip, hover crosshairs, a color‑scale mapping, or domain
logic, it goes to charts. If it's a single decorative SVG that just renders a
number or a path, it stays in the UI kit.**

| Component | Why it belongs in `@agentix/ui` |
|-----------|--------------------------------|
| `Sparkline` | One inline SVG `<path>`, no axes/scales. Slots into `StatTile`. |
| `NumericText` / `PnLText` | Text primitive; colorizes a number. |
| `TrendIndicator` | Icon + text (`▲ +1.24%`), not a chart. |
| `MiniBars` | One‑row SVG histogram; same weight as a `Spinner`. |
| `Gauge` (single needle) | Semicircle / circular gauge. Sibling of `Progress`. |
| `SegmentedProgress` / `RangeBar` | Bars; same family as `Progress`. |
| `Heatmap` (inline, ≤ ~100 cells) | Borderline. **Defer to charts** if it needs axes, color legends, or row/col labels. A small decorative tile‑grid stays here. |
| `DonutChart` (decorative, no legend/tooltip) | Borderline. **Default to charts** unless trivially small and purely decorative. |

Default: when in doubt, **put it in `@agentix/charts`**. We can always pull a tiny
version back into `@agentix/ui` if it proves to be a UI primitive.

## What goes to `@agentix/charts`

From the `docs/finance-quant-component-roadmap.md`, the following are deferred to
`@agentix/charts`:

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
  start them inside `@agentix/charts` and split later if it becomes necessary.
- **Generic chart chrome:** `ChartCard`, `ChartTooltip`, `ChartLegend`,
  `ChartGrid`, color‑scale helpers, axis/tick utilities.

## Repo structure

Monorepo with pnpm workspaces. Charts live in a sibling folder, mirroring
`src/`'s conventions. Single Git repo, single PR can refactor tokens in
`@agentix/ui` and update all consumers in `@agentix/charts` in one commit.

```
Aidans-React-UI/
├── src/                      # @agentix/ui            (existing)
│   ├── components/
│   ├── templates/investment-ops/
│   ├── lib/
│   ├── styles/
│   ├── globals.css           # owns CSS variables; both packages consume
│   └── index.ts
└── charts/                   # @agentix/charts        (NEW, future task)
    ├── src/
    │   ├── primitives/        # Line, Area, Bar, Histogram, Scatter, BoxPlot
    │   ├── scales/           # linear, log, time, divergent color
    │   ├── axis/             # Axis, Grid, Ticks, AxisLabel
    │   ├── tooltip/          # ChartTooltip (composes ui Popover/Tooltip)
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

If raw bundle size ever becomes a problem (e.g. canvas/WebGL added), split charts
into `@agentix/charts` (SVG primitives) + `@agentix/charts-canvas`
(`lightweight-charts`-backed heavy charts) — consumers opt in explicitly.

## Tooling decisions to make in the charts package

These are deferred to a follow‑up planning task; captured here so they aren't
lost.

- **Charts engine:** `visx` (composable D3) vs `recharts` (opinionated) vs
  `lightweight-charts` (Canvas financial charts). Recommendation:
  start `visx` for SVG primitives, add `lightweight-charts` as an optional
  peer for canvas‑backed candlestick/depth.
- **Color scales:** own minimal divergent/sequential scales via D3
  interpolators (`d3-scale-chromatic`) — keep intermediate maps.
- **Tooltips:** wrap `@agentix/ui`'s `Popover` / `Tooltip` rather than reinvent
  them, so charts inherit same a11y + animation semantics.
- **Storybook:** shared Storybook workspace; add a `Charts/` section alongside
  the existing `Components/`/`Templates/` tree.
- **Package entrypoints:** dual entrypoints — `@agentix/charts` (general) and
  `@agentix/charts/quant` (quant‑domain widgets), mirroring the existing
  `finance.ts` secondary entrypoint pattern in `src/`.

## What we will do now (in this phase)

1. Lock in this strategy as a decision record (this file).
2. Update `docs/finance-quant-component-roadmap.md` to clearly split items
   between "ship in `@agentix/ui` (now)" and "defer to `@agentix/charts`
   (future)" — this becomes the source of truth for future sessions.
3. Continue the in‑scope Phase B work in `@agentix/ui`:
   - `Sparkline`, `NumericText`, `TrendIndicator`, `Typography`, `Label`,
     `Field`, `Kbd`, `VisuallyHidden`, `EmptyState`, `MiniBars`, `Gauge`,
     `SegmentedProgress`.
4. **Do NOT begin heavy chart implementation** in `src/components/`. If a chart
   component is needed urgently before `@agentix/charts` exists, build it in a
   consumer app and lift it into `@agentix/charts` later — never into
   `@agentix/ui`'s root `index.ts`.

## Open questions

- [ ] Do we want `lightweight-charts` for candlestick/depth (Canvas, performant)
      or stick with SVG (visx) for everything? Affects shared Storybook and peer
      dep footprint.
- [ ] Should quant‑domain reports (`BacktestTearsheet`, etc.) live inside
      `@agentix/charts` or in a third `@agentix/templates-quant` package? Defer
      the decision until we have the first report scaffolded.
- [ ] Should `@agentix/charts` publish independently or as part of
      `@agentix/ui`'s npm release tag? Monorepo or polyrepo? (Recommendation
      in §"Repo structure": monorepo.)

## Review triggers

Reopen this decision if any of these happen:

- A chart needs depth that depends on chart code; would force `@agentix/ui` to
  depend on `@agentix/charts`.
- `@agentix/charts` releases start forcing unrelated breaking changes in
  `@agentix/ui`.
- Bundle size of `@agentix/ui` (compressed) grows beyond ~30KB due to chart
  imports sneaking in.
- A second domain (e.g. maps / geo) emerges, suggesting we split again into
  `@agentix/charts-geo` or similar.

## Changelog

| Date       | Change                                                              |
|------------|---------------------------------------------------------------------|
| 2026-07-19 | Initial decision record created. Charts to a separate package; inline primitives kept in UI. |