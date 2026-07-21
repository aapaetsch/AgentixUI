# ExpiryBadge

Color-graded expiration pill for open option positions.

Consumers may override classification, per-band variants, DTE rendering, visible date/day parts, pulse behavior, sizing, and the accessible label.

## Props
- `expiry: number` — epoch ms.
- `daysToExpiry?: number` — derived from `expiry` vs `Date.now()` when omitted; clamped to `>= 0`.
- `thresholds?: readonly number[]` — `[far, near, imminent]` days, descending. @default `[30, 7, 1]`.
  Bands (boundaries inclusive at the upper neighbor):
  - `dte > far` → `far`
  - `near < dte <= far` → `near`
  - `imminent < dte <= near` → `imminent`
  - `0 <= dte <= imminent` → `expiring`
- `band?: "far" | "near" | "imminent" | "expiring"` — override the auto band.
- `showDate?: boolean` (@default `false`) — render the formatted date.
- `showDays?: boolean` (@default `true`) — render the `Dd`/`Dh` pill.
  - Both true → `"<date> <dlabel>"` (date + days pill).
  - `showDays` only → `"<dlabel>"`.
  - `showDate` only → `"<date>"`.
  - Both false → falls back to `"<dlabel>"` so the badge is never empty.
- `dateFormat?: string` — `date-fns` pattern. @default `"M/d/yy"`.
- `pulseOnExpiring?: boolean` — @default `true`.
- `size?: "medium" | "large"` — forwarded to the underlying `Badge` (the `small` dot is excluded since the badge must render text). @default `"medium"`.
- `className?: string` — merged last via `cn()`.

## Dependencies
- `Badge` (existing; variants `outline` / `warning` / `destructive`). `Badge` extends `React.HTMLAttributes<HTMLSpanElement>`, so `aria-label` is forwarded to the rendered `<span>` via `{...props}`.
- `date-fns` via `lib/date-utils` (`formatDate` guards invalid dates → `""`).

## Styling Decisions
- Bands map to existing `Badge` variants, no new variants added.
- Size is pluggable via the `size` prop (only `medium`/`large` are accepted; `small` is a dot-only indicator and incompatible with visible text).
- `expiring` band uses `animate-pulse` for at-a-glance urgency (only when `pulseOnExpiring` is true).
- Color is never the only signal — the accessible `aria-label` always announces what is visible.

## Accessibility Notes
- `aria-label` is built from the **actually-visible** content:
  - Both date + days → `Expires <date> in <dlabel>`.
  - Days only → `Expires in <dlabel>`.
  - Date only → `Expires <date>`.
- This intentionally avoids announcing the days label when `showDays=false` (the previous implementation always said "in <dlabel>" even when only the date was visible).

## Maintenance Notes
- `bandForDte` is pure; exported for tests.
- `<1d` renders hours (`Dh`) to differentiate intra-day expiry from same-day.
- `dte` is clamped to `>= 0` so already-expired contracts render as `expiring` / `0d` rather than negative.
- Boundary behavior is intentional and matches the docs (e.g. `dte === 30` → `near`, `dte === 7` → `imminent`, `dte === 1` → `expiring`).
