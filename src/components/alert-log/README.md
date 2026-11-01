# AlertLog

Read-only history of triggered alert events.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
import { AlertLog } from "aapaetsch-ui-kit/finance";

export function Example() {
  return (
    <AlertLog
      events={[{ id: "event-1", ruleId: "rule-1", symbol: "DEMO", message: "Price above 100", triggeredAt: "2026-10-28T14:30:00Z", value: 101 }]}
      locale="en-US"
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `events` | `AlertEvent[]` | Required events: id, ruleId, symbol, message, triggeredAt, value |
| `locale` | `string` | Optional Intl locale; runtime default when omitted |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

Supply valid ISO timestamps and finite numeric values. Invalid dates can throw during Intl formatting. Rows preserve input order; sort/page history upstream. The table includes a hidden caption and horizontally scrolls on narrow screens.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
