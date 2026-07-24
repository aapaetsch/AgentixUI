# Typography & NumericText

## Overview

`Typography` is a polymorphic text primitive that standardizes the MD3 type scale across the UI.
`NumericText` is the finance-specific renderer that standardizes right-aligned, tabular-figure
rendering with optional semantic P&L coloring.

## Installation

The components are exported from `aapaetsch-ui-kit`:

```tsx
import { Typography, NumericText } from "aapaetsch-ui-kit";
```

## Usage

### Typography

```tsx
<Typography variant="h2">Portfolio</Typography>
<Typography as="span" variant="caption">Updated 2m ago</Typography>
<Typography variant="overline" align="right">PORTFOLIO VALUE</Typography>
```

### NumericText

```tsx
<NumericText value={1234.56} format="currency" />
<NumericText value={1.84} format="percent" signed colorize />
<NumericText value={1_200_000} format="compact" />
<NumericText value={42} format="basisPoints" />
```

## Components

### Typography

Polymorphic content element. The `as` prop controls the rendered tag (defaults to `p`) and the
`variant` controls the visual type scale independently of the tag.

**Props**

```ts
interface TypographyProps<T extends React.ElementType = "p"> {
  as?: T;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle" | "body" | "caption" | "overline";
  align?: "left" | "center" | "right";
  truncate?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

### NumericText

Renders a formatted numeric value with `tabular-nums` on by default. When `colorize` is on,
positive values use `text-positive`, negative `text-negative`, and zero `text-foreground`. The
accessible label is the formatted string; when `colorize` is on, the label is prefixed with
"positive" / "negative" so screen-reader users get sign context without relying on color.

**Props**

```ts
interface NumericTextProps {
  value: number;
  format?: "currency" | "percent" | "number" | "compact" | "basisPoints";
  currency?: string;          // default "USD"
  signed?: boolean;
  precision?: number;
  colorize?: boolean;
  align?: "left" | "right";    // default "right"
  tabular?: boolean;           // default true
  monospace?: boolean;         // default false
  className?: string;
  ariaLabel?: string;
}
```

## Dependencies

- `class-variance-authority` — variant management
- `clsx` + `tailwind-merge` via `cn()` utility
- `lib/number-utils.ts` — formatting helpers
- `lib/color-utils.ts` — P&L color mapping

## Variants

`typographyVariants` exposes `variant`, `align`, and `truncate`.
`numericTextVariants` exposes `align` and `monospace`.

## Accessibility

- `NumericText` exposes its formatted value through `aria-label`. When `colorize` is on the label
  also includes the sign ("positive" / "negative") so sign information is not color-only.
- `Typography` forwards standard DOM attributes including `id`, `aria-*`, and `data-*`.

## Maintenance Notes

- `Typography` uses `React.forwardRef` with a generic `T` to remain polymorphic. Consumers passing
  exotic elements should keep the ref type compatible.
- Formatting never hardcodes color; all coloring is delegated to `pnlColorClass` which reads the
  semantic `--positive`/`--negative` tokens.