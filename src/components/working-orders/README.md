# WorkingOrders

Supplied orders with lifecycle badges and modify/cancel actions.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
import { WorkingOrders } from "aapaetsch-ui-kit/finance";

export function Example() {
  return (
    <WorkingOrders
      orders={[{ id: "order-1", symbol: "DEMO", side: "buy", type: "limit", quantity: 10, filledQuantity: 2, limitPrice: 100, status: "partiallyFilled" }]}
      onModify={order => console.log("Modify", order.id)}
      onCancel={order => console.log("Cancel", order.id)}
      locale="en-US"
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `orders` | `WorkingOrder[]` | Required order records |
| `onModify, onCancel` | `(order: WorkingOrder) => void` | Optional action intents |
| `locale` | `string` | Optional number-format locale |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

WorkingOrder requires id, symbol, side (buy/sell), type (market/limit/stop/stopLimit), quantity, filledQuantity, and status. limitPrice, stopPrice, and submittedAt are optional. Price shows limitPrice, otherwise stopPrice, otherwise Market. Actions remain visible for all supplied statuses and are inert without callbacks. The host enforces permissions/state validity, submits broker requests, and updates orders after confirmation. Rows preserve input order.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
