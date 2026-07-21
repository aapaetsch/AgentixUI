# TrendIndicator — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview
`TrendIndicator` is a tiny signed-value text primitive. It renders a directional arrow icon
(`ArrowUp` / `ArrowDown` / `Minus` from `lucide-react`) alongside a colorized text label. Color
is derived from the sign of `value` via `pnlColorClass`, keeping the visual language consistent
with `NumericText` and the rest of the finance surfaces.

## Props
```ts
interface TrendIndicatorProps extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof trendIndicatorVariants> {
  value: number;                 // Number used to derive direction
  displayValue?: string;         // Optional pre-formatted text; falls back to Intl.NumberFormat
  direction?: "up" | "down" | "auto";  // auto derives from sign(value). default "auto"
  size?: "xs" | "sm" | "md" | "lg" | "xl";      // default "sm"
  showArrow?: boolean;           // default true
  signed?: boolean;               // prefix "+" on positives (only when displayValue is not supplied)
  weight?: "normal" | "medium" | "semibold" | "bold";  // default "medium"
}
```

## Dependencies
- `class-variance-authority` — size variants (`trendIndicatorVariants`)
- `lucide-react` — `ArrowUp`, `ArrowDown`, `Minus`
- `../../lib/utils` — `cn()`
- `../../lib/color-utils` — `pnlColorClass`

## Styling Decisions
- Color reuses the semantic `text-positive` / `text-negative` / `text-muted-foreground` tokens
  via `pnlColorClass(value)`. Zero / NaN maps to `text-muted-foreground` so "no change" reads as
  neutral rather than default foreground.
- `tabular-nums` is enabled in the base CVA class so trends align in numeric columns.
- Arrow icon size scales with the `size` variant via `[&>svg]:size-*` utilities.
- Color is never the only signal: the arrow icon (and optional `+` sign) carry direction too.

## Maintenance Notes
- When `displayValue` is provided, `signed` has no effect on the visible text (only on the
  derived color via `value`). This is intentional — callers asking for a custom string own the
  formatting.
- `Number.NaN` renders as the literal `"NaN"` when no `displayValue` is supplied and uses the
  neutral color + `Minus` icon. If a different "no data" rendering is needed, pass
  `displayValue="—"` (or similar).
- `direction` is additive, not exclusive: it only changes the icon + fallback color when the
  value's own sign disagrees. `value` still drives the color via `pnlColorClass`.