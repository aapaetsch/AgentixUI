# TradeBlotter

Read-only table of execution records.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
import { TradeBlotter } from "aapaetsch-ui-kit/finance";

export function Example() {
  return (
    <TradeBlotter
      executions={[{ id: "fill-1", symbol: "DEMO", side: "buy", quantity: 10, price: 100, executedAt: "2026-10-28T14:30:00Z", venue: "NASDAQ" }]}
      locale="en-US"
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `executions` | `TradeExecution[]` | Required id/symbol/side/quantity/price/executedAt; optional venue |
| `locale` | `string` | Optional Intl date/number locale |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

Pass valid timestamps: Intl formatting can throw for invalid dates. Dates use the runtime time zone; locale changes formatting, not zone. Quantities/prices are formatted as numbers, without automatic currency symbols. Missing venue displays an em dash. Input order is preserved; sort/page large histories in the host. A hidden caption identifies the table.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
