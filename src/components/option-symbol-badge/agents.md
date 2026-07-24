# OptionSymbolBadge

Renders a compact option-contract token `ROOT MM/DD/YY STRIKE{C|P}` with a colored call/put `Badge` suffix. Optionally annotates with order-action badge, currency symbol / currency code, and per-share premium.

## Props
- `contract?: OptionContract` — full contract; atom props are ignored when supplied.
- `root?`, `expiry?`, `strike?`, `type?` — atom form.
- `dateFormat?: string` — `date-fns` pattern. @default `"M/d/yy"`.
- `monospace?: boolean` — tabular alignment for chain tables. @default `true`.
- `typeFormat?: "short" | "long"` — `C/P` vs `Call/Put`. @default `"short"`.
- `action?: "BTO" | "BTC" | "STO" | "STC"` — optional order-action badge.
- `actionVariant?: BadgeVariant` — override for action badge. Default: openers = `secondary`, closers = `outline`.
- `actionPosition?: "before" | "after"` — where the action badge renders. @default `"before"`.
- `hideTypeBadge?: boolean` — hide the call/put suffix badge. @default `false`.
- `currencySymbol?: string` — prefix on the strike (e.g. `"$"`).
- `currencyString?: string` — currency-code suffix after the strike (e.g. `"USD"`, `"USDC"`).
- `premium?: number` — per-share premium shown as `@ currencySymbol value`.
- `className?: string` — merged last via `cn()`.

## Dependencies
- `Badge` + `badgeVariants` (existing, reused — never extended).
- `date-fns` via `lib/date-utils` `formatDate` + `DATE_FORMATS`.
- `lib/finance-types` `OptionContract`, `OptionType`.
- `class-variance-authority` `VariantProps` for `actionVariant`.

## Styling Decisions
Put/Call color is *composed*, not added as new `Badge` variants — `success` → call, `destructive` → put (per the workspace rule that templates/composites never extend the primitive system). Body is monospace tabular-nums by default so strikes align in dense tables.

The `action` badge is also composed from existing variants (openers `BTO`/`STO` → `secondary`, closers `BTC`/`STC` → `outline`) so no new primitive variants are introduced. Callers may override via `actionVariant`.

The `currencyString` suffix is rendered with `text-muted-foreground` and a non-breaking space separator so it never wraps to its own line in dense tables. The `premium` block uses `@` as a muted separator and `formatPremium` always renders two fractional digits (per-share prices are conventionally quoted with cents).

## Maintenance Notes
- Missing-field fallback is uniform: `—` for missing `root`, `expiry`, and `strike` (strike no longer coerces to `0`).
- Strike format uses between 0 and 2 fractional digits via `toLocaleString`; only applied when `strike` is a number.
- `formatExpiry` goes through `lib/date-utils` `formatDate`, which guards invalid `Date` objects and returns `""` (rendered as `—` here when `expiry` is absent).
- The `aria-label` string is composed of all visible pieces (action, root, date, currency-prefixed strike, currency code, type, optional `at <premium> premium`) and announced as one unit. Currency symbol, currency code, `@` separator, and the inner C/P `Badge` are all `aria-hidden`.
- `OptionSymbolBadge` is a plain function component (no `forwardRef`). The wrapping `<span>` is purely presentational; if a future consumer needs ref forwarding (e.g. for focus management in a scanner), promote to `React.forwardRef<HTMLSpanElement, OptionSymbolBadgeProps>` at that time.
- Do not promote put/call colors — or the action-badge variant mapping — into `Badge` variants without a workspace-wide decision.