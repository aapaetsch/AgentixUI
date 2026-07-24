# Typography + NumericText — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview

`Typography` is a polymorphic text primitive standardizing the MD3 type scale. `NumericText` is a
finance-specific renderer for right-aligned, tabular-figure numerics with optional semantic P&L
coloring. It is the single entry point used across the investment-ops dashboard for any numeric
display.

## Props Summary

### Typography
- `as`: polymorphic element (default `"p"`)
- `variant`: `h1`–`h6` | `subtitle` | `body` | `caption` | `overline`
- `align`: `left` | `center` | `right`
- `truncate`: boolean
- `className`, `children`

### NumericText
- `value: number`
- `format`: `currency` | `percent` | `number` | `compact` | `basisPoints`
- `currency`: ISO code (default `"USD"`)
- `signed`, `precision`, `colorize`
- `align`: `left` | `right` (default `right`)
- `tabular` (default `true`), `monospace` (default `false`)
- `ariaLabel`: override for the accessible label

## Dependencies

- `class-variance-authority` — variant management
- `clsx` + `tailwind-merge` via `cn()`
- `aapaetsch-ui-kit` `lib/number-utils.ts` (formatters)
- `aapaetsch-ui-kit` `lib/color-utils.ts` (`pnlColorClass`)

## Styling Decisions

- `tabular-nums` is on by default so numeric columns align across rows.
- `colorize` maps to `text-positive` / `text-negative` / `text-foreground` via `pnlColorClass`,
  reading the semantic CSS tokens. No raw finance green/red is hard-coded.
- Right alignment is the default because finance columns are almost universally right-aligned.

## Maintenance Notes

- `Typography` is generic over `T extends React.ElementType`; the forwardRef cast keeps the public
  type usable. If you change the rendering strategy, verify the ref typing still compiles for
  `as="h2"` and `as="span"`.
- `NumericText` formatting delegates to `lib/number-utils.ts`; any new numeric format must be added
  there first and then surfaced as a `NumericFormat` union member.
- When `colorize` is on the `aria-label` is prefixed with "positive" / "negative" to keep sign
  information accessible without relying on color.
- `Typography` does not currently merge `Slot`; it renders `Comp` directly to preserve ref typing.
  If `asChild` support becomes necessary, re-introduce `Slot` carefully.