# Charts Package

`@agentix/charts` is a separately consumable npm workspace inside this
repository. It depends on the UI kit for shared Card primitives, `cn()`, and the
theme contract in `src/globals.css`; the UI kit does not depend on charts.

## Package foundation — ✅ Complete

| Capability | Status | Notes |
|---|---|---|
| npm workspace and package manifest | ✅ Complete | Independent `@agentix/charts` package with ESM, CJS, and declaration exports for root and `./quant` entrypoints |
| Build and typecheck | ✅ Complete | Dedicated tsup and TypeScript configs integrated into root scripts |
| Unit testing | ✅ Complete | Dedicated Vitest/jsdom project integrated into the root test command |
| Storybook | ✅ Complete | `Charts/` stories discovered by the shared Storybook workspace |
| Engine | ✅ Complete | Recharts v3, externalized from the package bundle; shadcn-style composition |
| Theme contract | ✅ Complete | Reads `--chart-1`…`--chart-5` and all surface/text/border tokens from the UI kit |
| Accessibility baseline | ✅ Complete | Required accessible names plus Recharts `accessibilityLayer` enabled by default |

## Chart chrome — ✅ Complete

`ChartContainer`, `ChartCard`, `ChartGrid`, `ChartXAxis`, `ChartYAxis`,
`ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, and
`ChartLegendContent`.

## Foundational charts

| Component | Status | Variants |
|---|---|---|
| `LineChart` | ✅ Complete | Multi-series, dots, formatters, optional grid/tooltip/legend |
| `AreaChart` | ✅ Complete | Overlapping and stacked multi-series |
| `BarChart` | ✅ Complete | Grouped and stacked multi-series |
| `Heatmap` | ✅ Complete | Categorical axes, continuous opacity encoding and tooltip |
| `Histogram` | ✅ Complete | Continuous bins and formatted ranges |
| `ScatterPlot` | ✅ Complete | Multi-series and size encoding |
| `DonutChart` | ✅ Complete | Tooltip, legend and center-label support |
| `BoxPlot` | ✅ Complete | Responsive five-number distribution summary |
| `Treemap` | ✅ Complete | Hierarchical area encoding |
| `RadarChart` | ✅ Complete | Multi-series polar comparison |

## Financial and quantitative compositions — ✅ Complete

`DepthChart`, `VolumeProfile`, `EquityCurve`, `DrawdownChart`,
`RollingMetricChart`, `ReturnsChart`, `CorrelationMatrix`, `SignalChart`,
`RiskChart`, and the replaceable-slot `Tearsheet` composition. Market
candlesticks remain exclusively in `@agentix/charts-market`.

Every public chart has an accessible name, Storybook coverage, colocated
README and `agents.md` guidance. Package gates cover ESM/CommonJS/declarations,
typecheck, component tests, and quantitative calculation tests.
