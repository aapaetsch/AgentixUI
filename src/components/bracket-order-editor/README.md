# BracketOrderEditor

Controlled entry, take-profit, and stop-loss editor with a risk/reward summary.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
"use client";
import { useState } from "react";
import { BracketOrderEditor, type BracketOrderValue } from "aapaetsch-ui-kit/finance";

export function Example() {
  const [order, setOrder] = useState<BracketOrderValue>({ symbol: "DEMO", side: "buy", quantity: 10, entryPrice: 100, takeProfitPrice: 110, stopLossPrice: 95 });
  return <BracketOrderEditor value={order} onValueChange={setOrder} currency="USD" locale="en-US" />;
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `value` | `BracketOrderValue` | Required symbol, side, quantity, entryPrice, takeProfitPrice, stopLossPrice |
| `onValueChange` | `(value: BracketOrderValue) => void` | Required; full updated value |
| `currency` | `string` | USD; valid Intl currency code |
| `locale` | `string` | Optional Intl locale |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

Side is buy or sell. Displayed risk is abs(entryPrice − stopLossPrice) × quantity; reward is abs(takeProfitPrice − entryPrice) × quantity. These summaries do not validate price ordering or include fees, slippage, or contract multipliers. Validate quantities/prices and submit orders in the host. Native numeric inputs convert empty text to zero.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
