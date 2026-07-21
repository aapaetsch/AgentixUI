# LegBuilderRow

A single row of a multi-leg option order ticket — Buy/Sell × Call/Put × strike
× contracts, with optional duplicate/delete actions. Compose 1–N of these
inside a `MultiLegOrderTicket`.

The row supports optional side/type visibility, disabled state, contract min/max/step, strike and expiry formatters, user-facing label overrides, and per-slot classes. This keeps the default compact ticket useful while allowing broker terminology and lot rules to be supplied by the consuming app.

## Usage

```tsx
<LegBuilderRow
  value={leg}
  onChange={setLeg}
  strikes={[380, 390, 400, 410, 420]}
  onDelete={() => removeLeg(leg.id)}
  onDuplicate={() => duplicateLeg(leg.id)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `OptionLeg` | — | Controlled leg value. |
| `onChange` | `(leg) => void` | — | Update callback. |
| `strikes` | `number[]` | — | Available strikes. |
| `expiries` | `number[]` | — | Available expiries (epoch ms). |
| `onDelete` | `() => void` | — | Delete this leg. |
| `onDuplicate` | `() => void` | — | Duplicate this leg. |
| `disableDelete` | `boolean` | — | Disable delete. |
| `compact` | `boolean` | `false` | Dense mode for wide tickets. |
| `className` | `string` | — | Merged last via `cn()`. |

## Invariants

- **Signed contracts:** `value.contracts` is positive for `side: "buy"` and
  negative for `side: "sell"`. Flipping the Buy/Sell toggle automatically
  flips the sign of `contracts` so the two can never disagree. The contracts
  input always shows the magnitude (`Math.abs`).
- **Expiry select:** a native `<select>` is used intentionally to keep the
  row compact (see `agents.md`); swap in the styled `Select` primitive if you
  need full theming.
