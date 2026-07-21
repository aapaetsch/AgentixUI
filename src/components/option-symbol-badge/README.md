# OptionSymbolBadge

Compact formatted token for an option contract, e.g. `SPY 12/19/25 412.5C`.

Composes the existing `Badge` for the call/put suffix (`success` → call, `destructive` → put) and a monospace body for the rest. Use it in options-chain tables, blotter rows, ticket summaries, and position cards.

## Usage

```tsx
<OptionSymbolBadge contract={contract} />

<OptionSymbolBadge root="SPY" expiry={Date.now()} strike={400} type="call" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `contract` | `OptionContract` | — | Full contract; when supplied, atom props are ignored. |
| `root` | `string` | — | Underlying ticker. Renders `—` when missing. |
| `expiry` | `number` | — | Expiration in epoch ms. Renders `—` when missing. |
| `strike` | `number` | — | Strike price. Renders `—` when missing. |
| `type` | `"call" \| "put"` | — | Call or put. |
| `dateFormat` | `string` | `"M/d/yy"` | `date-fns` format. |
| `monospace` | `boolean` | `true` | Tabular-nums alignment for dense tables. |
| `className` | `string` | — | Merged last via `cn()`. |

## Accessibility

The wrapping element has `role="img"` and an `aria-label` of the form
`"ROOT MM/DD/YY STRIKE {Call|Put}"` so the contract is announced as one unit.
The colored C/P `Badge` is `aria-hidden` to avoid double-announcing the type
(the `aria-label` already conveys it). Call/put is never indicated by color
alone — the visible `C`/`P` letter and the label both carry the semantics.