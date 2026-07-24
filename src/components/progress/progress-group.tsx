"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// ============================================================================
// Variants
// ============================================================================

export const progressGroupGapVariants = cva("flex", {
  variants: {
    gap: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    direction: {
      horizontal: "flex-row items-center",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    gap: "md",
    direction: "vertical",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface ProgressGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressGroupGapVariants> {
  /**
   * Gap between progress items
   * @default "md"
   */
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Layout direction
   * @default "vertical"
   */
  direction?: "horizontal" | "vertical";
}

// ============================================================================
// Component
// ============================================================================

/**
 * ProgressGroup - Container for multiple progress bars
 *
 * Groups progress bars with consistent spacing.
 *
 * @example
 * ```tsx
 * <ProgressGroup>
 *   <SkillBar skill="React" value={90} />
 *   <SkillBar skill="TypeScript" value={85} />
 *   <SkillBar skill="Node.js" value={75} />
 * </ProgressGroup>
 * ```
 */
export const ProgressGroup = React.forwardRef<HTMLDivElement, ProgressGroupProps>(
  ({ className, gap, direction, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="progress-group"
        className={cn(progressGroupGapVariants({ gap, direction }), className)}
        {...props}
      />
    );
  }
);

ProgressGroup.displayName = "ProgressGroup";
