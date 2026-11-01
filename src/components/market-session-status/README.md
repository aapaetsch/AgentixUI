# MarketSessionStatus

Display a supplied exchange-session state and optional transition text.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
import { MarketSessionStatus } from "aapaetsch-ui-kit/finance";

export function Example() {
  return <MarketSessionStatus state="open" nextTransition="Closes at 16:00 ET" />;
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `state` | `MarketSessionState` | Required: preMarket, open, afterHours, closed, or halted |
| `nextTransition` | `string` | Optional display text; rendered verbatim |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

The host computes exchange calendars, time zones, holidays, and live transitions. This component starts no timers and parses no dates. The colored dot is decorative; visible text names the state. Forwarded attributes apply to the span root.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
