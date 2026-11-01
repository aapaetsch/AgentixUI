# aapaetsch-charts

Theme-aware React charts for dashboards and quantitative reports, built on Recharts and UI-kit tokens. Technical candlesticks and drawings belong to [market charts](../charts-market/README.md).

## Installation and first chart

```bash
npm install aapaetsch-charts@beta aapaetsch-ui-kit@beta react@19 react-dom@19
```

React and React DOM 18 or 19 and the UI kit are peers. Recharts is installed as a runtime dependency; install it explicitly if your app also imports its primitives. Import both stylesheets once:

```tsx
import "aapaetsch-ui-kit/globals.css";
import "aapaetsch-charts/styles.css";
import { LineChart } from "aapaetsch-charts";

export function RevenueChart() {
  return <LineChart
    aria-label="Monthly revenue in dollars"
    data={[{ month: "Jan", revenue: 42 }, { month: "Feb", revenue: 58 }]}
    xKey="month"
    series={[{ dataKey: "revenue", label: "Revenue" }]}
    valueFormatter={value => `$${value.toFixed(0)}`}
  />;
}
```

Compiled CSS is included: host Tailwind scanning is unnecessary. Containers need measurable width; use `min-w-0` on grid/flex children. Charts set their own height in numeric CSS pixels. Next.js chart imports belong in client components; stylesheet imports belong in the root layout. ESM, CommonJS, and declarations are supplied.

## Component directory

Each guide includes examples, props/defaults, and data limitations.

| Component | Purpose |
| --- | --- |
| [ChartContainer and chrome](src/components/chart-container/README.md) | Custom Recharts compositions, cards, legends, tooltips |
| [LineChart](src/components/line-chart/README.md) | Multiple time/category series |
| [AreaChart](src/components/area-chart/README.md) | Overlapping or stacked areas |
| [BarChart](src/components/bar-chart/README.md) | Grouped or stacked comparisons |
| [Heatmap](src/components/heatmap/README.md) | Categorical value cells |
| [Histogram](src/components/histogram/README.md) | Observation distributions |
| [ScatterPlot](src/components/scatter-plot/README.md) | Numeric x/y relationships |
| [DonutChart](src/components/donut-chart/README.md) | Parts of a whole |
| [BoxPlot](src/components/box-plot/README.md) | Five-number summaries |
| [Treemap](src/components/treemap/README.md) | Hierarchical proportions |
| [RadarChart](src/components/radar-chart/README.md) | Comparable factor profiles |
| [DepthChart](src/components/depth-chart/README.md) | Cumulative bid/ask depth |
| [VolumeProfile](src/components/volume-profile/README.md) | Supplied buy/sell volume by price |
| [EquityCurve](src/components/equity-curve/README.md) | Strategy/benchmark equity |
| [DrawdownChart](src/components/drawdown-chart/README.md) | Decline from running equity peak |
| [RollingMetricChart](src/components/rolling-metric-chart/README.md) | Precomputed rolling statistics |
| [ReturnsChart](src/components/returns-chart/README.md) | Signed period returns |
| [CorrelationMatrix](src/components/correlation-matrix/README.md) | Supplied correlations |
| [SignalChart](src/components/signal-chart/README.md) | Price and supplied signals |
| [RiskChart](src/components/risk-chart/README.md) | Factors and optional limits |
| [Tearsheet](src/components/tearsheet/README.md) | Composable report layout |

All components use the root entry. `aapaetsch-charts/quant` exports EquityCurve, DrawdownChart, RollingMetricChart, ReturnsChart, CorrelationMatrix, SignalChart, RiskChart, Tearsheet, their types, and drawdown/correlation helpers. DepthChart and VolumeProfile use the root.

## Shared Cartesian API

LineChart, AreaChart, and BarChart share these props:

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `data` | `ChartDatum[]` | Required; records with string, number, null, or undefined values |
| `xKey` | `string` | Required category/time property |
| `series` | `ChartSeries[]` | Required numeric property definitions |
| `aria-label` | `string` | Required meaningful name, ideally including units |
| `height` | `number` | 288 CSS px |
| `showGrid` | `boolean` | true |
| `showTooltip` | `boolean` | true |
| `showLegend` | `boolean` | More than one visible series |
| `xTickFormatter` | `(value: string or number) => string` | Optional x-axis formatter |
| `valueFormatter` | `(value: number) => string` | Optional y-axis/tooltip formatter |
| `className` | `string` | Optional root classes merged last |

Each series requires `dataKey`, and accepts `label`, `color` (CSS color), and `hide`. Labels fall back to keys, colors cycle through shared tokens, and Cartesian series default to visible. RadarChart accepts the metadata type but does not apply `hide`; filter its series upstream.

## Data, themes, and accessibility

Supply finite numbers and sort time records upstream. Line and area charts connect null values; use a custom composition if missing values must produce visible breaks. The package never fetches data. Drawdown, histogram binning, and depth accumulation have explicit helpers; rolling metrics and correlations are supplied by the consumer.

The UI kit owns `--chart-1` through `--chart-5` and semantic positive/negative colors. Import UI CSS before chart CSS and app overrides. Apply `.dark` and theme variables at the document root.

Charts require an accessible name and most Recharts compositions enable its accessibility layer. Provide a nearby table or textual findings when exact values matter. The custom SVG BoxPlot provides summary labeling rather than point-by-point keyboard navigation. Plotted-series animation is disabled.

## Troubleshooting and development

- Blank chart: check parent width, numeric height, data keys, and finite values.
- Wrong styling: import both stylesheets and check inherited theme variables.
- Missing export: check the documented entrypoint and installed version.
- Large input: aggregate/downsample upstream; inputs are not virtualized.

Run from the repository root:

```bash
npm ci
npm run build
npm run storybook
npm run test --workspace aapaetsch-charts
npm run typecheck --workspace aapaetsch-charts
npm run build-storybook
```

The aggregate build builds icons first. See the [documentation index](../docs/README.md) for framework integration and source/release status.
