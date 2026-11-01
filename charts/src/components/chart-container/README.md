# ChartContainer and chart chrome

Compose custom Recharts charts with the same theme, tooltip, legend, and card conventions as the packaged components.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart). Install Recharts explicitly when importing its primitives in your application.

```tsx
import { Line, LineChart } from "recharts";
import { ChartCard, ChartContainer, ChartTooltip, ChartTooltipContent } from "aapaetsch-charts";

export function Example() {
  return <ChartCard title="Revenue" description="Monthly revenue in dollars">
    <ChartContainer
      aria-label="Monthly revenue"
      role="img"
      config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-1))" } }}
      style={{ height: 288 }}
    >
      <LineChart accessibilityLayer data={[{ month: "Jan", revenue: 42 }, { month: "Feb", revenue: 58 }]}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="revenue" stroke="var(--color-revenue)" isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  </ChartCard>;
}
```

## Container and card API

| Component / prop | Contract |
| --- | --- |
| ChartContainer.config | Required ChartConfig: series keys map to optional label (ReactNode), color (CSS string), and icon (component) |
| ChartContainer.children | Required single Recharts-compatible ResponsiveContainer child |
| ChartContainer.id | Optional identifier; otherwise generated with React.useId |
| ChartContainer.style | Root style, including a measurable height; named config colors create scoped --color-<key> variables |
| ChartContainer.className | Root classes merged last |
| ChartContainer DOM props/ref | Div attributes and HTMLDivElement ref are forwarded; set role/aria-label for custom charts |
| ChartCard.title | Required ReactNode heading |
| ChartCard.description | Optional ReactNode description |
| ChartCard.actions | Optional ReactNode action area |
| ChartCard.children | Required chart/content |
| ChartCard DOM props/ref | Div attributes, className, and ref forwarded through the UI-kit Card |

ChartContainer supplies its own ResponsiveContainer; do not nest another one. The default minimum height is 12rem, but provide an explicit height for predictable sizing. Parent width must be measurable.

## Tooltips, legends, and axes

| Export | Contract / defaults |
| --- | --- |
| ChartTooltip, ChartLegend | Recharts Tooltip and Legend aliases; use their native props |
| ChartGrid, ChartXAxis, ChartYAxis | Recharts CartesianGrid, XAxis, and YAxis aliases |
| ChartTooltipContent | Optional Recharts tooltip payload, className, valueFormatter; indicator defaults to dot (or line), hideLabel and hideIndicator default false |
| ChartLegendContent | Optional Recharts legend payload, className, nameKey; resolves labels and colored swatches from config |

Tooltip content returns nothing when inactive or without payload. Numeric formatting uses valueFormatter when supplied. Tooltip and legend content resolve labels/colors from config and require ChartContainer context. Their content components are passed to Recharts using its content prop.

## Accessibility and limitations

Enable Recharts accessibilityLayer on your custom chart, name the container, and provide a data table or textual findings when exact values matter. ChartCard's heading alone does not name the chart. The root merges standard DOM attributes, so use aria-describedby to connect explanatory text. The container provides layout and tokens, not data validation or series rendering.

See the colocated Storybook stories and [package troubleshooting](../../../README.md#troubleshooting-and-development).
