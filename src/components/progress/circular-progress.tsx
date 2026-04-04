"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import {
  type ValueFormatter,
  type ProgressGradient,
  valueFormatters,
  getVariantStrokeClass,
} from "./progress-shared";

// ============================================================================
// Types
// ============================================================================

/**
 * Arc type for circular progress
 */
export type CircularArcType = "full" | "three-quarter" | "half" | "quarter";

/**
 * Line cap style for circular progress
 */
export type CircularLineCap = "round" | "butt" | "square";

// ============================================================================
// Variants
// ============================================================================

export const circularProgressVariants = cva(
  "relative inline-flex items-center justify-center",
  {
    variants: {
      size: {
        xs: "size-8",
        sm: "size-12",
        md: "size-16",
        lg: "size-24",
        xl: "size-32",
        "2xl": "size-40",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Props
// ============================================================================

export interface CircularProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof circularProgressVariants> {
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
   * Arc type determining how much of the circle is used
   * @default "full"
   */
  arcType?: CircularArcType;
  /**
   * Start angle in degrees (0 = top, 90 = right, etc.)
   * @default 0
   */
  startAngle?: number;
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
   * Stroke width of the progress arc
   * @default 4
   */
  strokeWidth?: number;
  /**
   * Line cap style for the progress arc
   * @default "round"
   */
  lineCap?: CircularLineCap;
  /**
   * Show value in center
   * @default false
   */
  showValue?: boolean;
  /**
   * Custom value formatter function
   */
  valueFormatter?: ValueFormatter;
  /**
   * Label text (shown below value or as only text)
   */
  label?: string;
  /**
   * Custom width (CSS value, overrides size)
   */
  width?: string;
  /**
   * Custom height (CSS value, overrides size)
   */
  height?: string;
  /**
   * Gradient configuration for the progress arc
   */
  gradient?: ProgressGradient;
  /**
   * Custom track color class
   */
  trackClassName?: string;
  /**
   * Custom progress arc class
   */
  progressClassName?: string;
  /**
   * Custom SVG path for non-standard shapes
   */
  customPath?: string;
  /**
   * Path length for custom paths
   */
  customPathLength?: number;
  /**
   * Children to render in the center
   */
  children?: React.ReactNode;
  /**
   * Accessible label for screen readers
   */
  "aria-label"?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CircularProgress - A circular progress indicator
 *
 * Displays progress as a circular arc with optional center content.
 * Supports full, three-quarter, half, and quarter arc types.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CircularProgress value={75} />
 *
 * // With value display
 * <CircularProgress value={75} showValue />
 *
 * // Half circle
 * <CircularProgress value={75} arcType="half" />
 *
 * // With gradient
 * <CircularProgress
 *   value={75}
 *   gradient={{
 *     stops: [
 *       { offset: "0%", color: "#3b82f6" },
 *       { offset: "100%", color: "#8b5cf6" }
 *     ]
 *   }}
 * />
 * ```
 */
export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      className,
      size,
      value,
      min = 0,
      max = 100,
      arcType = "full",
      startAngle = 0,
      variant = "default",
      indeterminate = false,
      strokeWidth = 4,
      lineCap = "round",
      showValue = false,
      valueFormatter = valueFormatters.percentage,
      label,
      width,
      height,
      gradient,
      trackClassName,
      progressClassName,
      customPath,
      customPathLength,
      children,
      "aria-label": ariaLabel,
      style,
      ...props
    },
    ref
  ) => {
    // Calculate percentage
    const percentage = indeterminate
      ? 0
      : Math.min(100, Math.max(0, ((value ?? 0) - min) / (max - min) * 100));

    // Generate unique ID for gradient
    const gradientId = React.useId();
    const actualGradientId = gradient?.id || `circular-progress-gradient-${gradientId}`;

    // Format the value for display
    const formattedValue = valueFormatter(value ?? 0, min, max);

    // SVG dimensions
    const viewBoxSize = 100;
    const center = viewBoxSize / 2;
    const radius = (viewBoxSize - strokeWidth) / 2;

    // Arc calculations based on type
    const arcDegrees: Record<CircularArcType, number> = {
      full: 360,
      "three-quarter": 270,
      half: 180,
      quarter: 90,
    };

    const totalArc = arcDegrees[arcType];
    const progressArc = (percentage / 100) * totalArc;

    // Generate arc path
    const generateArcPath = (arcDegrees: number, startDeg: number = 0): string => {
      if (customPath) return customPath;

      const startRadians = ((startDeg - 90) * Math.PI) / 180;
      const endRadians = ((startDeg - 90 + arcDegrees) * Math.PI) / 180;

      const startX = center + radius * Math.cos(startRadians);
      const startY = center + radius * Math.sin(startRadians);
      const endX = center + radius * Math.cos(endRadians);
      const endY = center + radius * Math.sin(endRadians);

      const largeArcFlag = arcDegrees > 180 ? 1 : 0;

      if (arcDegrees >= 360) {
        // Full circle needs two arcs
        const midX = center + radius * Math.cos(startRadians + Math.PI);
        const midY = center + radius * Math.sin(startRadians + Math.PI);
        return `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${midX} ${midY} A ${radius} ${radius} 0 1 1 ${startX} ${startY}`;
      }

      return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    };

    // Track path (full arc for the type)
    const trackPath = generateArcPath(totalArc, startAngle);

    // Progress path (partial arc based on value)
    const progressPath = generateArcPath(progressArc, startAngle);

    // Calculate path length for stroke-dasharray
    const circumference = customPathLength || 2 * Math.PI * radius;
    const arcLength = (totalArc / 360) * circumference;

    // Custom styles
    const customStyles: React.CSSProperties = {
      ...style,
      ...(width && { width }),
      ...(height && { height }),
    };

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel || label}
        aria-busy={indeterminate}
        data-slot="circular-progress"
        data-arc-type={arcType}
        data-indeterminate={indeterminate || undefined}
        className={cn(
          circularProgressVariants({ size }),
          className
        )}
        style={customStyles}
        {...props}
      >
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={cn(
            "w-full h-full",
            indeterminate && "animate-spin"
          )}
          style={{ transform: `rotate(${startAngle}deg)` }}
        >
          {/* Gradient definitions */}
          {gradient && (
            <defs>
              <linearGradient
                id={actualGradientId}
                gradientTransform={`rotate(${gradient.angle ?? 90})`}
              >
                {gradient.stops.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </linearGradient>
            </defs>
          )}

          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap={lineCap}
            className={cn(
              "text-secondary",
              trackClassName
            )}
          />

          {/* Progress arc */}
          {!indeterminate && (
            <path
              d={progressPath}
              fill="none"
              stroke={gradient ? `url(#${actualGradientId})` : "currentColor"}
              strokeWidth={strokeWidth}
              strokeLinecap={lineCap}
              className={cn(
                !gradient && getVariantStrokeClass(variant),
                "transition-all duration-300 ease-out motion-reduce:transition-none",
                progressClassName
              )}
              style={{
                transformOrigin: "center",
              }}
            />
          )}

          {/* Indeterminate animation */}
          {indeterminate && (
            <path
              d={trackPath}
              fill="none"
              stroke={gradient ? `url(#${actualGradientId})` : "currentColor"}
              strokeWidth={strokeWidth}
              strokeLinecap={lineCap}
              strokeDasharray={`${arcLength * 0.25} ${arcLength * 0.75}`}
              className={cn(
                !gradient && getVariantStrokeClass(variant),
                progressClassName
              )}
            />
          )}
        </svg>

        {/* Center content */}
        {(showValue || label || children) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {children || (
              <>
                {showValue && !indeterminate && (
                  <span className="text-lg font-semibold tabular-nums text-foreground">
                    {formattedValue}
                  </span>
                )}
                {label && (
                  <span className="text-xs text-muted-foreground">
                    {label}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";
