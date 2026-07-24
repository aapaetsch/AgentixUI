"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------------------------------*/

/** Default easing: ease-out cubic. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Detect the user's reduced-motion preference (SSR-safe). */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* -------------------------------------------------------------------------------------------------
 * AnimatedNumber
 * ------------------------------------------------------------------------------------------------*/

export interface AnimatedNumberProps
  extends VariantProps<typeof animatedNumberVariants> {
  /** Target value to animate toward. */
  value: number;
  /** Formatter applied to the interpolated value each frame. */
  format?: (value: number) => string;
  /** Animation duration in milliseconds. @default 400 */
  duration?: number;
  /** Easing function applied to the progress. @default easeOut */
  easing?: (t: number) => number;
  /** Flash the background briefly on change. @default false */
  flashOnChange?: boolean;
  /** Which token color to use for the flash; `"auto"` picks by delta sign. @default "auto" */
  flashColor?: "positive" | "negative" | "auto";
  /** Force reduced-motion behavior regardless of the media query. */
  reducedMotion?: boolean;
  /** Extra classes merged last via `cn()`. */
  className?: string;
  /** Accessible label for the settled value. */
  ariaLabel?: string;
}

export const animatedNumberVariants = cva(
  ["tabular-nums", "whitespace-nowrap"].join(" "),
  {
    variants: {
      align: {
        left: "text-left",
        right: "text-right",
      },
    },
    defaultVariants: {
      align: "right",
    },
  }
);

/**
 * AnimatedNumber - Smoothly interpolates between numeric values on update.
 *
 * Animates from the previously rendered value to the new `value` using
 * `requestAnimationFrame`. Respects `prefers-reduced-motion` (jump to final
 * value) and announces only the settled value via a throttled
 * `aria-live="polite"` region — never intermediate frames.
 *
 * Cancels any pending animation frame on unmount so no frames leak.
 *
 * @example
 * ```tsx
 * <AnimatedNumber value={1234.56} format={(v) => `$${v.toFixed(2)}`} />
 * ```
 */
export function AnimatedNumber({
  value,
  format = (v) => String(v),
  duration = 400,
  easing = easeOut,
  flashOnChange = false,
  flashColor = "auto",
  reducedMotion,
  align = "right",
  className,
  ariaLabel,
}: AnimatedNumberProps) {
  const fromRef = React.useRef(value);
  const [display, setDisplay] = React.useState(value);
  const [flashClass, setFlashClass] = React.useState<string | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);
  const liveRef = React.useRef<HTMLSpanElement | null>(null);
  const announceRef = React.useRef<number | null>(null);

  // Respect reduced-motion: either the explicit prop or the media query.
  const shouldReduce = reducedMotion ?? prefersReducedMotion();

  React.useEffect(() => {
    const from = fromRef.current;
    const to = value;

    // No-op when value is unchanged.
    if (from === to) return;

    // Reduced-motion path: jump directly to the final value.
    if (shouldReduce) {
      fromRef.current = to;
      setDisplay(to);
      scheduleAnnouncement(to);
      return;
    }

    startRef.current = null;

    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easing(progress);
      const next = from + (to - from) * eased;

      setDisplay(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        setDisplay(to);
        scheduleAnnouncement(to);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    // Optionally flash the background based on the delta direction.
    if (flashOnChange) {
      const dir = to - from;
      const color =
        flashColor === "auto"
          ? dir > 0
            ? "positive"
            : dir < 0
            ? "negative"
            : null
          : flashColor;
      if (color) {
        setFlashClass(color === "positive" ? "bg-positive/20" : "bg-negative/20");
        // Clear flash on the next frame; use rAF so it never fights the animation.
        const clearRaf = requestAnimationFrame(() => setFlashClass(null));
        return () => {
          if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
          cancelAnimationFrame(clearRaf);
        };
      }
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, easing, flashOnChange, flashColor, shouldReduce]);

  // Throttle the aria-live announcement so we only emit the settled value.
  const scheduleAnnouncement = React.useCallback((settled: number) => {
    if (announceRef.current !== null) {
      window.clearTimeout(announceRef.current);
    }
    announceRef.current = window.setTimeout(() => {
      if (liveRef.current) {
        liveRef.current.textContent =
          ariaLabel ?? format(settled);
      }
    }, 150);
  }, [ariaLabel, format]);

  // Cleanup any pending timer/frame on unmount.
  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (announceRef.current !== null) window.clearTimeout(announceRef.current);
    };
  }, []);

  const formatted = format(display);

  return (
    <span
      className={cn(
        animatedNumberVariants({ align }),
        flashClass,
        className
      )}
      aria-label={ariaLabel ?? formatted}
    >
      {formatted}
      {/* Visually-hidden live region announcing only settled values. */}
      <span
        ref={liveRef}
        aria-live="polite"
        className="sr-only"
      />
    </span>
  );
}

AnimatedNumber.displayName = "AnimatedNumber";