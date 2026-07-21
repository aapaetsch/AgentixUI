# OptionSymbolBadge

Renders a compact option-contract token `ROOT MM/DD/YY STRIKE{C|P}` with a colored call/put `Badge` suffix.

## Props
- `contract?: OptionContract` — full contract; atoms below are ignored when supplied.
- `root?`, `expiry?`, `strike?`, `type?` — atom form.
- `dateFormat?: string` — `date-fns` pattern. @default `"M/d/yy"`.
- `monospace?: boolean` — tabular alignment for chain tables. @default `true`.
- `className?: string` — merged last via `cn()`.

## Dependencies
- `Badge` (existing, reused — never extended).
- `date-fns` via `lib/date-utils` `formatDate` + `DATE_FORMATS`.
- `lib/finance-types` `OptionContract`, `OptionType`.

## Styling Decisions
Put/Call color is *composed*, not added as new `Badge` variants — `success` → call, `destructive` → put (per the workspace rule that templates/composites never extend the primitive system). Body is monospace tabular-nums by default so strikes align in dense tables.

## Maintenance Notes
- Missing-field fallback is uniform: `—` for missing `root`, `expiry`, and `strike` (strike no longer coerces to `0`).
- Strike format uses between 0 and 2 fractional digits via `toLocaleString`; only applied when `strike` is a number.
- `formatExpiry` goes through `lib/date-utils` `formatDate`, which guards invalid `Date` objects and returns `""` (rendered as `—` here when `expiry` is absent).
- The wrapping `<span>` carries `role="img"` + an `aria-label` summarizing the full contract, so screen readers announce it as one unit. The inner C/P `Badge` is `aria-hidden` to avoid double-announcing type.
- `OptionSymbolBadge` is a plain function component (no `forwardRef`). The wrapping `<span>` is purely presentational and is not focused or measured in tables; if a future consumer needs ref forwarding (e.g. for focus management in a scanner), promote to `React.forwardRef<HTMLSpanElement, OptionSymbolBadgeProps>` at that time.
- Do not promote put/call colors into `Badge` variants without a workspace-wide decision.