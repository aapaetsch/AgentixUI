# LegBuilderRow

Broker-specific terminology and rules belong in the public formatters, labels, visibility flags, quantity bounds, disabled state, and slot classes—not hard-coded forks.

One reversible Buy/Sell × Call/Put × strike × qty row of a multi-leg order.

Broker-specific terminology and rules belong in the public formatters, labels, visibility flags, quantity bounds, disabled state, and slot classes—not hard-coded forks.

## Props
- `value: OptionLeg` (controlled).
- `onChange: (leg) => void`.
- `strikes: number[]` — available strikes for the chosen expiry (filter
  upstream by expiry if needed).
- `expiries?: number[]` — epoch ms; when omitted the expiry select is hidden.
- `onDelete?`, `onDuplicate?`, `disableDelete?`.
- `compact?: boolean` — @default `false`.
- `className?: string`.

## Dependencies
- `ToggleGroup` (Buy/Sell, Call/Put), `ComboBox` (strike), `InputIncrementor`
  (contracts), `Button` (delete/duplicate), `lucide-react` icons.
- `lib/finance-types` `OptionLeg`, `OptionType`.

## Styling Decisions
- Buy/Sell + Call/Put toggle items use `data-[state=on]:bg-positive` /
  `bg-negative` to match `order-ticket.tsx`'s side styling — consistent with
  the rest of the investment-ops templates.
- Contracts `InputIncrementor` keeps the magnitude; sign is derived from
  `side` so `value.contracts` always reflects direction.

## Side / Contracts Sign Sync (invariant)
- `value.contracts` is **signed**: positive for buy, negative for sell (see
  `OptionLeg` in `lib/finance-types`).
- When the user flips the Buy/Sell `ToggleGroup`, the row **also flips the
  sign of `contracts`** in the emitted `onChange` so the invariant
  (`Math.sign(contracts) === side === "buy" ? +1 : -1`) always holds.
  Switching side with `contracts === 0` leaves it at `0`.
- The `InputIncrementor` always renders `Math.abs(value.contracts)` and its
  `onValueChange` re-applies the sign from `value.side`, so manual qty edits
  can never desync from the side either.

## Maintenance Notes
- Expiry is currently a native `<select>` to keep the row compact; if you need
  the styled `Select` primitive, swap it in.
- `ComboBox` `value` is generic `number`, so the strike value passes through
  without string coercion.
- Contracts are always positive in the input; `onChange` flips the sign based
  on `side` so downstream Greeks math can use the signed `contracts`.
