# StrategyReport

Metric strip, optional chart slots, and supplied strategy-trade history.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
import { StrategyReport } from "aapaetsch-ui-kit/finance";

export function Example() {
  return (
    <StrategyReport
      metrics={[{ id: "return", label: "Return", value: "12.5%" }]}
      trades={[{ id: "trade-1", symbol: "DEMO", openedAt: "2026-10-26", side: "long", quantity: 10, entryPrice: 100 }]}
      locale="en-US"
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `metrics` | `StrategyMetric[]` | Required id/label/value; optional description |
| `trades` | `StrategyTrade[]` | Required trade records |
| `equityChart, drawdownChart` | `ReactNode` | Optional chart slots |
| `locale` | `string` | Optional number-format locale |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

StrategyTrade requires id, symbol, openedAt, side (long/short), quantity, and entryPrice; closedAt, exitPrice, and profitLoss are optional. Timestamp strings render verbatim. Missing close date displays Open; missing exit/P&L displays an em dash. Metrics are supplied string/number values. Provide chart components and styles separately. The host computes metrics/P&L and sorts/pages trades.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
