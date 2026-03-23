"use client";

import * as React from "react";

// ============================================================================
// Shared Types & Utilities
// ============================================================================

/**
 * Value formatter function type
 * Used to customize how values are displayed
 */
export type ValueFormatter = (value: number, min: number, max: number) => string;

/**
 * Default value formatters
 */
export const valueFormatters = {
  /** Display as percentage (e.g., "75%") */
  percentage: (value: number, min: number, max: number): string => {
    const percent = ((value - min) / (max - min)) * 100;
    return `${Math.round(percent)}%`;
  },
  /** Display raw value (e.g., "75") */
  value: (value: number): string => `${value}`,
  /** Display as fraction (e.g., "75/100") */
  fraction: (value: number, _min: number, max: number): string => `${value}/${max}`,
  /** Display as decimal (e.g., "0.75") */
  decimal: (value: number, min: number, max: number): string => {
    const decimal = (value - min) / (max - min);
    return decimal.toFixed(2);
  },
} as const;

/**
 * Label position options
 */
export type LabelPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "inside"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/**
 * Value display position options
 */
export type ValuePosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "inside"
  | "tooltip";

/**
 * Gradient definition
 */
export interface GradientStop {
  offset: string;
  color: string;
}

export interface ProgressGradient {
  id?: string;
  type?: "linear" | "radial";
  angle?: number;
  stops: GradientStop[];
}

/**
 * Common progress base props shared by all progress components
 */
export interface ProgressBaseProps {
  /**
   * Current value of the progress
   */
  value?: number;
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  /**
   * Color variant
   * @default "default"
   */
  variant?: "default" | "success" | "warning" | "error" | "info";
  /**
   * Whether the progress is indeterminate (loading animation)
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Show value display
   * @default false
   */
  showValue?: boolean;
  /**
   * Custom value formatter function
   */
  valueFormatter?: ValueFormatter;
  /**
   * Label text
   */
  label?: string;
  /**
   * Gradient configuration for the progress indicator
   */
  gradient?: ProgressGradient;
  /**
   * Accessible label for screen readers
   */
  "aria-label"?: string;
}

// ============================================================================
// useAnimatedProgress Hook
// ============================================================================

export interface UseAnimatedProgressOptions {
  /**
   * Starting value
   * @default 0
   */
  from?: number;
  /**
   * Target value
   * @default 100
   */
  to?: number;
  /**
   * Duration in milliseconds
   * @default 2000
   */
  duration?: number;
  /**
   * Whether to loop the animation
   * @default false
   */
  loop?: boolean;
  /**
   * Whether to reverse when looping (ping-pong effect)
   * @default true
   */
  reverse?: boolean;
  /**
   * Easing function
   * @default "easeInOut"
   */
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  /**
   * Whether to auto-start the animation
   * @default true
   */
  autoStart?: boolean;
  /**
   * Callback when animation completes (not called if looping)
   */
  onComplete?: () => void;
}

export interface UseAnimatedProgressReturn {
  /** Current animated value */
  value: number;
  /** Whether animation is currently running */
  isAnimating: boolean;
  /** Start/resume the animation */
  start: () => void;
  /** Pause the animation */
  pause: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Set value directly (stops animation) */
  setValue: (value: number) => void;
}

/**
 * useAnimatedProgress - Hook for creating animated progress values
 *
 * Creates a smoothly animated value that can be used with progress components.
 * Supports looping, easing, and manual control.
 *
 * @example
 * ```tsx
 * // Basic loading animation
 * const { value } = useAnimatedProgress({ duration: 3000 });
 * return <LinearProgress value={value} />;
 *
 * // Looping animation
 * const { value } = useAnimatedProgress({ loop: true, reverse: true });
 * return <CircularProgress value={value} />;
 *
 * // Manual control
 * const { value, start, pause, reset } = useAnimatedProgress({ autoStart: false });
 * ```
 */
export function useAnimatedProgress(
  options: UseAnimatedProgressOptions = {}
): UseAnimatedProgressReturn {
  const {
    from = 0,
    to = 100,
    duration = 2000,
    loop = false,
    reverse = true,
    easing = "easeInOut",
    autoStart = true,
    onComplete,
  } = options;

  const [value, setValueState] = React.useState(from);
  const [isAnimating, setIsAnimating] = React.useState(autoStart);
  
  const animationRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number>(0);
  const pausedAtRef = React.useRef<number>(0);
  const directionRef = React.useRef<1 | -1>(1);

  // Easing functions
  const easingFunctions = React.useMemo(() => ({
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  }), []);

  const animate = React.useCallback((timestamp: number) => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp - pausedAtRef.current;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunctions[easing](progress);

    const range = to - from;
    let currentValue: number;

    if (directionRef.current === 1) {
      currentValue = from + range * easedProgress;
    } else {
      currentValue = to - range * easedProgress;
    }

    setValueState(currentValue);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (loop) {
        startTimeRef.current = 0;
        pausedAtRef.current = 0;
        if (reverse) {
          directionRef.current = directionRef.current === 1 ? -1 : 1;
        }
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onComplete?.();
      }
    }
  }, [from, to, duration, loop, reverse, easing, easingFunctions, onComplete]);

  const start = React.useCallback(() => {
    setIsAnimating(true);
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const pause = React.useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      pausedAtRef.current = performance.now() - startTimeRef.current;
      setIsAnimating(false);
    }
  }, []);

  const reset = React.useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = 0;
    pausedAtRef.current = 0;
    directionRef.current = 1;
    setValueState(from);
    setIsAnimating(false);
  }, [from]);

  const setValue = React.useCallback((newValue: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnimating(false);
    setValueState(newValue);
  }, []);

  // Auto-start effect
  React.useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoStart, start]);

  return {
    value,
    isAnimating,
    start,
    pause,
    reset,
    setValue,
  };
}

// ============================================================================
// Shared Utilities
// ============================================================================

/**
 * Calculate percentage from value within a range
 */
export function calculatePercentage(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/**
 * Variant colors mapping for consistent color usage
 */
export const variantColorMap = {
  default: "primary",
  success: "green-500",
  warning: "yellow-500",
  error: "destructive",
  info: "blue-500",
} as const;

/**
 * Get background class for a variant
 */
export function getVariantBgClass(variant: keyof typeof variantColorMap): string {
  const mapping: Record<string, string> = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-destructive",
    info: "bg-blue-500",
  };
  return mapping[variant] || mapping.default;
}

/**
 * Get stroke class for a variant
 */
export function getVariantStrokeClass(variant: keyof typeof variantColorMap): string {
  const mapping: Record<string, string> = {
    default: "stroke-primary",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    error: "stroke-destructive",
    info: "stroke-blue-500",
  };
  return mapping[variant] || mapping.default;
}
