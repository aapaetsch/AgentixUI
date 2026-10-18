# aapaetsch-charts

Accessible, theme-aware React charts for dashboards, finance applications, and
quantitative workspaces. The package lives beside `aapaetsch-ui-kit`, consumes
its components and CSS tokens, and keeps charting dependencies out of the core
UI bundle.

## Install

```bash
npm install aapaetsch-charts aapaetsch-ui-kit recharts
```

Import the UI kit's theme and the chart package's compiled utilities once in
the host application, then use a typed chart component:

```tsx
import "aapaetsch-ui-kit/globals.css";
import "aapaetsch-charts/styles.css";
```

```tsx
import { LineChart } from "aapaetsch-charts";

<LineChart
  aria-label="Monthly revenue"
  data={[{ month: "Jan", revenue: 42 }, { month: "Feb", revenue: 58 }]}
  xKey="month"
  series={[{ dataKey: "revenue", label: "Revenue" }]}
/>
```

The package surface includes shared chart chrome; `LineChart`, `AreaChart`,
`BarChart`, `Heatmap`, `Histogram`, `ScatterPlot`, `DonutChart`, `BoxPlot`,
`Treemap`, and `RadarChart`; plus `DepthChart`, `VolumeProfile`, `EquityCurve`,
`DrawdownChart`, `RollingMetricChart`, `ReturnsChart`, `CorrelationMatrix`,
`SignalChart`, `RiskChart`, and `Tearsheet` compositions.

Quantitative compositions are also available from the focused entrypoint:

```tsx
import { EquityCurve, Tearsheet } from "aapaetsch-charts/quant";
```

Market candlesticks and technical-analysis plugins live in the separate
`aapaetsch-charts-market` package.
