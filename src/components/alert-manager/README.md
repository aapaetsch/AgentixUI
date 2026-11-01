# AlertManager

Controlled rule list with enable, edit, and delete actions.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
"use client";
import { useState } from "react";
import { AlertManager, type AlertRule } from "aapaetsch-ui-kit/finance";

export function Example() {
  const [rules, setRules] = useState<AlertRule[]>([{ id: "rule-1", symbol: "DEMO", field: "price", operator: "greaterThan", threshold: 100, enabled: true }]);
  return (
    <AlertManager
      rules={rules}
      onEnabledChange={(id, enabled) => setRules(rules.map(rule => rule.id === id ? { ...rule, enabled } : rule))}
      onEdit={rule => console.log("Edit", rule.id)}
      onDelete={rule => setRules(rules.filter(item => item.id !== rule.id))}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `rules` | `AlertRule[]` | Required rules in display order |
| `onEnabledChange` | `(id: string, enabled: boolean) => void` | Optional; host must update rules |
| `onEdit, onDelete` | `(rule: AlertRule) => void` | Optional action intents |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

The component never evaluates rules or persists edits. Actions remain visible when callbacks are omitted, but do nothing. This example removes a row locally; production deletion/confirmation policy belongs to the host. Switches have symbol-specific accessible names.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
