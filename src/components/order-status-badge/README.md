# OrderStatusBadge

Text badge for a supplied order lifecycle state.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
import { OrderStatusBadge } from "aapaetsch-ui-kit/finance";

export function Example() {
  return <OrderStatusBadge status="partiallyFilled" />;
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `status` | `OrderStatus` | Required: pending, working, partiallyFilled, filled, cancelled, rejected |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

Status determines the visible label and semantic classes. orderStatusBadgeVariants is exported for compatible custom styling. Although the variant helper defaults to pending, the component requires an explicit status. Text conveys meaning alongside color. Span attributes are forwarded; the badge does not announce changes automatically.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
