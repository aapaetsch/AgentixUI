# AnimatedNumber — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview

`AnimatedNumber` animates between numeric values using `requestAnimationFrame`. It is the KPI/ticker
primitive used by every rolling numeric surface in the investment-ops dashboard.

## Props Summary

- `value: number` — target value.
- `format?: (value: number) => string` — applied each frame (default `String`).
- `duration?: number` — ms, default 400.
- `easing?: (t: number) => number` — default `easeOut`.
- `flashOnChange?: boolean` — brief bg flash on update (default false).
- `flashColor?: "positive" | "negative" | "auto"` — default `"auto"`.
- `reducedMotion?: boolean` — force reduced-motion path.
- `align?: "left" | "right"` — default `right`.
- `className`, `ariaLabel`.

## Dependencies

- `class-variance-authority`
- `clsx` + `tailwind-merge` via `cn()`
- `lib/number-utils.ts` formatters are recommended for the `format` prop

## Styling Decisions

- `tabular-nums` is on by default so animated digits stay aligned column-wise.
- Flash colors use the semantic `bg-positive/20` / `bg-negative/20` tokens, not hardcoded colors.
- Right alignment is the default because KPI tiles and tickers are right-aligned.

## Maintenance Notes

- rAF id and announcement timer live on refs; both are cleaned up on unmount.
- `aria-live="polite"` region is visually hidden; only the settled value is announced (throttled
  to ~150ms). Never announce intermediate frames.
- `prefers-reduced-motion` is detected lazily (SSR-safe). The `reducedMotion` prop forces the path.
- Keep `format` cheap — it runs every frame. Prefer the shared numeric formatters.