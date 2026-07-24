# TrendIndicator

## Overview
A small text primitive that renders a signed value with a directional arrow icon and
semantic coloring. Designed for stat tiles, watchlist rows, and any surface that needs a
compact up/down signal.

## Installation
```tsx
import { TrendIndicator } from "aapaetsch-ui-kit";
```

## Usage
```tsx
<TrendIndicator value={1.24} signed />
<TrendIndicator value={-0.42} displayValue="-0.42%" />
<TrendIndicator value={0} showArrow={false} />
<TrendIndicator value={Number.NaN} />
```

## Props
```ts
interface TrendIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  displayValue?: string;
  direction?: "up" | "down" | "auto"; // default "auto"
  size?: "xs" | "sm" | "md";           // default "sm"
  showArrow?: boolean;                  // default true
  signed?: boolean;                      // default false
}
```

## Behavior
- `value` drives color via `pnlColorClass`: positive → `text-positive`, negative →
  `text-negative`, zero / NaN → `text-muted-foreground`.
- Arrow icon: `ArrowUp` for positive, `ArrowDown` for negative, `Minus` for zero / NaN
  (or when `direction` overrides to a neutral state).
- `displayValue` overrides the formatted text; `signed` only affects the fallback formatter.