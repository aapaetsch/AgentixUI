# Tearsheet

Report layout that combines supplied metrics with replaceable chart/table slots.

## Usage

[Install the package and styles](../../../README.md#installation-and-first-chart) before using this component.

```tsx
import { Tearsheet, EquityCurve, DrawdownChart } from "aapaetsch-charts";

export function Example() {
  return (
    <Tearsheet
      title="Strategy review"
      metrics={[{ label: "Return", value: "12.5%", description: "Year to date" }]}
      equity={<EquityCurve aria-label="Equity" data={[{ date: "Jan", equity: 10000 }, { date: "Feb", equity: 11250 }]} xKey="date" />}
      drawdown={<DrawdownChart aria-label="Drawdown" data={[{ time: "Jan", equity: 10000 }, { time: "Feb", equity: 11250 }]} />}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `title` | `string` | Required report heading |
| `description` | `string` | Optional report context |
| `metrics` | `TearsheetMetric[]` | Required label/value with optional description |
| `equity` | `ReactNode` | Required chart/content slot |
| `drawdown` | `ReactNode` | Required chart/content slot |
| `returns, risk, trades` | `ReactNode` | Optional slots |
| `className` | `string` | Optional root classes merged last |
| `DOM attributes` | `HTMLAttributes<HTMLDivElement>` | Forwarded to the section root |

## Data and behavior

Values are supplied React content; the host computes/validates metrics. Equity/drawdown/returns/risk share a responsive two-column grid, while trades follows below. This layout has no chart-specific aria-label or height prop: name and size each supplied chart individually.

## Accessibility and examples

Use a meaningful report title and accessible names on supplied charts. The colocated Storybook stories show additional configurations; run `npm run storybook` from the repository root. See [shared setup and troubleshooting](../../../README.md#troubleshooting-and-development).
