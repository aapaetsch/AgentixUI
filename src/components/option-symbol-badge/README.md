# OptionSymbolBadge

Compact formatted token for an option contract, e.g. `SPY 12/19/25 412.5C`.

Composes the existing `Badge` for the call/put suffix (`success` → call, `destructive` → put) and a monospace body for the rest. Use it in options-chain tables, blotter rows, ticket summaries, and position cards. Supports optional order-action tags (`BTO`/`BTC`/`STO`/`STC`), currency-symbol/currency-code annotation, and a per-share premium.

## Usage

```tsx
<OptionSymbolBadge contract={contract} />

<OptionSymbolBadge root="SPY" expiry={Date.now()} strike={400} type="call" />

<OptionSymbolBadge
  root="SPY"
  expiry={Date.now()}
  strike={400}
  type="call"
  action="BTO"
  typeFormat="long"
  currencySymbol="$"
  currencyString="USD"
  premium={3.25}
/>
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
| `typeFormat` | `"short" \| "long"` | `"short"` | `C/P` vs `Call/Put` type badge label. |
| `action` | `"BTO" \| "BTC" \| "STO" \| "STC"` | — | Order-action badge. |
| `actionVariant` | `BadgeVariant` | openers `secondary`, closers `outline` | Override for action badge variant. |
| `actionPosition` | `"before" \| "after"` | `"before"` | Side of the contract body for the action badge. |
| `hideTypeBadge` | `boolean` | `false` | Hide the call/put suffix badge. |
| `currencySymbol` | `string` | — | Prefix on the strike (e.g. `"$"`). |
| `currencyString` | `string` | — | Currency-code suffix after the strike (e.g. `"USD"`, `"USDC"`). |
| `premium` | `number` | — | Per-share premium / fill renderd as `@ currencySymbol value`. |
| `className` | `string` | — | Merged last via `cn()`. |

## Accessibility

The wrapping element has `role="img"` and an `aria-label` summarizing all visible pieces (action, root, date, currency-prefixed strike, currency code, type, optional premium) so the contract is announced as one unit. The colored C/P `Badge`, currency symbol, currency code, and `@` separator are all `aria-hidden` to avoid double-announcing. Call/put is never indicated by color alone — the visible `C`/`P` or `Call`/`Put` letter and the label both carry the semantics.