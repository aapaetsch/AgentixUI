# AlertRuleEditor

Edit one host-controlled alert rule.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
"use client";
import { useState } from "react";
import { AlertRuleEditor, type AlertRule } from "aapaetsch-ui-kit/finance";

export function Example() {
  const [rule, setRule] = useState<AlertRule>({ id: "rule-1", symbol: "DEMO", field: "price", operator: "greaterThan", threshold: 100, enabled: true });
  return <AlertRuleEditor value={rule} onValueChange={setRule} />;
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `value` | `AlertRule` | Required complete rule |
| `onValueChange` | `(value: AlertRule) => void` | Required; receives the full updated rule |
| `fields` | `Array<{ id: string; label: string }>` | Defaults to price (Last price) and volume (Volume) |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

Symbols are uppercased as typed. Operators are greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, and equal. Threshold input converts text with Number; an empty field becomes zero. Validate finite values, symbols, and field/operator compatibility before saving. ID/enabled state is preserved; this editor does not toggle or evaluate the rule.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
