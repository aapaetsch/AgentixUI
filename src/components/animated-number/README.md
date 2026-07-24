# AnimatedNumber

## Overview

`AnimatedNumber` smoothly interpolates between numeric values on update, rendering the formatted
result each frame. It powers KPI tiles and price tickers across the investment-ops dashboard.

## Installation

```tsx
import { AnimatedNumber } from "@agentix/ui";
```

## Usage

```tsx
import { formatCurrency } from "@agentix/ui";

<AnimatedNumber
  value={portfolioValue}
  format={(v) => formatCurrency(v, { precision: 2 })}
  duration={400}
  flashOnChange
/>
```

## Props

```ts
interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  duration?: number;           // ms, default 400
  easing?: (t: number) => number;
  flashOnChange?: boolean;
  flashColor?: "positive" | "negative" | "auto";
  reducedMotion?: boolean;
  align?: "left" | "right";     // default "right"
  className?: string;
  ariaLabel?: string;
}
```

## Behavior

- Animate from previous to next value via `requestAnimationFrame`; interpolate, format, render.
- `prefers-reduced-motion` jumps directly to the final value (no rAF loop).
- A visually-hidden `aria-live="polite"` region announces only the **settled** value, throttled
  so intermediate frames never reach assistive tech.
- Cancels the animation frame on unmount so no frames leak.
- Optional `flashOnChange` briefly tints the background `bg-positive/20` / `bg-negative/20` based
  on delta direction, cleared on the next frame.

## Dependencies

- `class-variance-authority` — variant management
- `clsx` + `tailwind-merge` via `cn()`

## Accessibility

- Announcements are throttled to the settled value only — never per frame.
- `prefers-reduced-motion` is respected by default; the `reducedMotion` prop forces the same path.
- The visible text carries the formatted value; the live region carries the announcement.

## Maintenance Notes

- The rAF id and announcement timer are tracked on refs and cleaned up on unmount.
- `format` is called on every frame. Keep it cheap; reuse the shared `lib/number-utils` formatters.
- `flashOnChange` is optional and intentionally lightweight. If more elaborate flash treatments
  are needed, add them behind a prop rather than altering the default behavior.