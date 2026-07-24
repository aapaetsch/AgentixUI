"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import {
  type ValueFormatter,
  type LabelPosition,
  type ValuePosition,
  type ProgressGradient,
  valueFormatters,
} from "./progress-shared";

// ============================================================================
// Variants
// ============================================================================

export const linearProgressVariants = cva(
  [
    "relative overflow-hidden",
    "bg-secondary",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "w-full",
        vertical: "h-full",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    compoundVariants: [
      // Horizontal sizes
      { orientation: "horizontal", size: "xs", className: "h-1" },
      { orientation: "horizontal", size: "sm", className: "h-2" },
      { orientation: "horizontal", size: "md", className: "h-3" },
      { orientation: "horizontal", size: "lg", className: "h-4" },
      { orientation: "horizontal", size: "xl", className: "h-6" },
      // Vertical sizes
      { orientation: "vertical", size: "xs", className: "w-1" },
      { orientation: "vertical", size: "sm", className: "w-2" },
      { orientation: "vertical", size: "md", className: "w-3" },
      { orientation: "vertical", size: "lg", className: "w-4" },
      { orientation: "vertical", size: "xl", className: "w-6" },
    ],
    defaultVariants: {
      orientation: "horizontal",
      size: "md",
      rounded: "full",
    },
  }
);

export const linearProgressBarVariants = cva(
  [
    "transition-all duration-300 ease-out",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "h-full",
        vertical: "w-full absolute bottom-0",
      },
      variant: {
        default: "bg-primary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-destructive",
        info: "bg-blue-500",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "default",
      rounded: "full",
    },
  }
);

const linearProgressIndeterminateVariants = cva(
  [
    "absolute",
    "animate-indeterminate",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "h-full top-0 left-0",
        vertical: "w-full left-0 bottom-0",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface LinearProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof linearProgressVariants> {
  /**
   * Current value of the progress bar
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
   * Position of the value display
   * @default "right"
   */
  valuePosition?: ValuePosition;
  /**
   * Custom value formatter function
   */
  valueFormatter?: ValueFormatter;
  /**
   * Label text
   */
  label?: string;
  /**
   * Position of the label
   * @default "top"
   */
  labelPosition?: LabelPosition;
  /**
   * Custom width (CSS value)
   */
  width?: string;
  /**
   * Custom height (CSS value)
   */
  height?: string;
  /**
   * Gradient configuration for the progress bar
   */
  gradient?: ProgressGradient;
  /**
   * Custom class for the progress bar fill
   */
  barClassName?: string;
  /**
   * Accessible label for screen readers
   */
  "aria-label"?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * LinearProgress - A horizontal or vertical progress bar
 *
 * Displays progress as a filled bar with optional labels and value display.
 * Supports solid colors and gradients.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LinearProgress value={75} />
 *
 * // With label and value
 * <LinearProgress value={75} label="Progress" showValue />
 *
 * // Vertical orientation
 * <LinearProgress value={75} orientation="vertical" height="200px" />
 *
 * // With gradient
 * <LinearProgress
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
export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>(
  (
    {
      className,
      orientation = "horizontal",
      size,
      rounded,
      value,
      min = 0,
      max = 100,
      variant = "default",
      indeterminate = false,
      showValue = false,
      valuePosition = "right",
      valueFormatter = valueFormatters.percentage,
      label,
      labelPosition = "top",
      width,
      height,
      gradient,
      barClassName,
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
    const actualGradientId = gradient?.id || `progress-gradient-${gradientId}`;

    // Format the value for display
    const formattedValue = valueFormatter(value ?? 0, min, max);

    // Determine layout based on orientation
    const isHorizontal = orientation === "horizontal";
    const isVertical = orientation === "vertical";

    // Custom styles for the progress track
    const trackStyles: React.CSSProperties = {
      ...style,
    };

    // For vertical, we need height on the track
    if (isVertical) {
      trackStyles.height = height || "100%";
      if (width) trackStyles.width = width;
    } else {
      // For horizontal, width goes on the track
      if (width) trackStyles.width = width;
      if (height) trackStyles.height = height;
    }

    // Render the progress bar with optional gradient
    const renderProgressBar = () => {
      const barStyle: React.CSSProperties = isHorizontal
        ? { width: `${percentage}%` }
        : { height: `${percentage}%` };

      if (gradient) {
        return (
          <>
            <svg width="0" height="0" className="absolute">
              <defs>
                {gradient.type === "radial" ? (
                  <radialGradient id={actualGradientId}>
                    {gradient.stops.map((stop, index) => (
                      <stop
                        key={index}
                        offset={stop.offset}
                        stopColor={stop.color}
                      />
                    ))}
                  </radialGradient>
                ) : (
                  <linearGradient
                    id={actualGradientId}
                    gradientTransform={`rotate(${gradient.angle ?? (isHorizontal ? 90 : 0)})`}
                  >
                    {gradient.stops.map((stop, index) => (
                      <stop
                        key={index}
                        offset={stop.offset}
                        stopColor={stop.color}
                      />
                    ))}
                  </linearGradient>
                )}
              </defs>
            </svg>
            <div
              className={cn(
                linearProgressBarVariants({ orientation, rounded }),
                barClassName
              )}
              style={{
                ...barStyle,
                background: `linear-gradient(${gradient.angle ?? (isHorizontal ? 90 : 0)}deg, ${gradient.stops.map(s => s.color).join(", ")})`,
              }}
            />
          </>
        );
      }

      return (
        <div
          className={cn(
            linearProgressBarVariants({ orientation, variant, rounded }),
            barClassName
          )}
          style={barStyle}
        />
      );
    };

    // Render indeterminate animation
    const renderIndeterminate = () => {
      if (!indeterminate) return null;

      return (
        <div
          className={cn(
            linearProgressIndeterminateVariants({ orientation }),
            gradient
              ? ""
              : linearProgressBarVariants({ variant }).split(" ").filter(c => c.startsWith("bg-")).join(" ")
          )}
          style={
            gradient
              ? {
                  background: `linear-gradient(${gradient.angle ?? (isHorizontal ? 90 : 0)}deg, ${gradient.stops.map(s => s.color).join(", ")})`,
                }
              : undefined
          }
        />
      );
    };

    // Render label
    const renderLabel = () => {
      if (!label) return null;
      return (
        <span className="text-sm font-medium text-foreground shrink-0">
          {label}
        </span>
      );
    };

    // Render value
    const renderValue = () => {
      if (!showValue || indeterminate) return null;
      return (
        <span className="text-sm tabular-nums text-muted-foreground shrink-0">
          {formattedValue}
        </span>
      );
    };

    // Progress track element
    const progressTrack = (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel || label}
        aria-busy={indeterminate}
        data-slot="progress"
        data-orientation={orientation}
        data-indeterminate={indeterminate || undefined}
        className={cn(
          linearProgressVariants({ orientation, size, rounded }),
          isVertical && "min-h-[4rem]",
          className
        )}
        style={trackStyles}
        {...props}
      >
        {indeterminate ? renderIndeterminate() : renderProgressBar()}

        {/* Inside value */}
        {showValue && valuePosition === "inside" && !indeterminate && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-foreground mix-blend-difference">
            {formattedValue}
          </span>
        )}
      </div>
    );

    // Simple case: no label, no value display, or inside value
    const hasExternalLabel = label && labelPosition !== "inside";
    const hasExternalValue = showValue && valuePosition !== "inside" && !indeterminate;

    if (!hasExternalLabel && !hasExternalValue) {
      return progressTrack;
    }

    // Vertical orientation with labels/values
    if (isVertical) {
      const hasLeftContent = (label && labelPosition === "left") || (showValue && valuePosition === "left" && !indeterminate);
      const hasRightContent = (label && labelPosition === "right") || (showValue && valuePosition === "right" && !indeterminate);
      const hasTopContent = (label && ["top", "top-left", "top-right"].includes(labelPosition)) || (showValue && valuePosition === "top" && !indeterminate);
      const hasBottomContent = (label && ["bottom", "bottom-left", "bottom-right"].includes(labelPosition)) || (showValue && valuePosition === "bottom" && !indeterminate);

      return (
        <div className={cn(
          "inline-flex gap-2",
          (hasTopContent || hasBottomContent) ? "flex-col items-center" : "flex-row items-center"
        )}>
          {hasTopContent && (
            <div className="flex flex-col items-center gap-1">
              {label && ["top", "top-left", "top-right"].includes(labelPosition) && renderLabel()}
              {showValue && valuePosition === "top" && !indeterminate && renderValue()}
            </div>
          )}
          <div className="flex items-center gap-2">
            {hasLeftContent && (
              <div className="flex flex-col gap-1">
                {label && labelPosition === "left" && renderLabel()}
                {showValue && valuePosition === "left" && !indeterminate && renderValue()}
              </div>
            )}
            {progressTrack}
            {hasRightContent && (
              <div className="flex flex-col gap-1">
                {label && labelPosition === "right" && renderLabel()}
                {showValue && valuePosition === "right" && !indeterminate && renderValue()}
              </div>
            )}
          </div>
          {hasBottomContent && (
            <div className="flex flex-col items-center gap-1">
              {label && ["bottom", "bottom-left", "bottom-right"].includes(labelPosition) && renderLabel()}
              {showValue && valuePosition === "bottom" && !indeterminate && renderValue()}
            </div>
          )}
        </div>
      );
    }

    // Horizontal orientation with labels/values
    const hasTopLabel = label && ["top", "top-left", "top-right"].includes(labelPosition);
    const hasBottomLabel = label && ["bottom", "bottom-left", "bottom-right"].includes(labelPosition);
    const hasLeftLabel = label && labelPosition === "left";
    const hasRightLabel = label && labelPosition === "right";

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Header row: labels and/or value on top */}
        {(hasTopLabel || (showValue && valuePosition === "top" && !indeterminate)) && (
          <div className={cn(
            "flex items-center",
            labelPosition === "top-right" ? "justify-end" : 
            labelPosition === "top-left" ? "justify-start" :
            (hasTopLabel && showValue && valuePosition === "top") ? "justify-between" : "justify-start"
          )}>
            {hasTopLabel && renderLabel()}
            {showValue && valuePosition === "top" && !indeterminate && renderValue()}
          </div>
        )}

        {/* Main row: optional left label, progress bar, optional right label/value */}
        <div className="flex items-center gap-2 w-full">
          {hasLeftLabel && renderLabel()}
          {showValue && valuePosition === "left" && !indeterminate && renderValue()}
          <div className="flex-1 min-w-0">
            {progressTrack}
          </div>
          {showValue && valuePosition === "right" && !indeterminate && renderValue()}
          {hasRightLabel && renderLabel()}
        </div>

        {/* Footer row: labels and/or value on bottom */}
        {(hasBottomLabel || (showValue && valuePosition === "bottom" && !indeterminate)) && (
          <div className={cn(
            "flex items-center",
            labelPosition === "bottom-right" ? "justify-end" : 
            labelPosition === "bottom-left" ? "justify-start" :
            (hasBottomLabel && showValue && valuePosition === "bottom") ? "justify-between" : "justify-start"
          )}>
            {hasBottomLabel && renderLabel()}
            {showValue && valuePosition === "bottom" && !indeterminate && renderValue()}
          </div>
        )}
      </div>
    );
  }
);

LinearProgress.displayName = "LinearProgress";
