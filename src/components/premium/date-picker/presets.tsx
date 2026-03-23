"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";
import { Button } from "../../free/button";
import {
  type DatePreset,
  type DateRange,
  evaluatePreset,
} from "../../../lib/date-utils";

// ============================================================================
// Presets Variants
// ============================================================================

/**
 * Presets container variants
 */
const presetsVariants = cva(["flex flex-wrap gap-2"].join(" "), {
  variants: {
    /**
     * Layout direction
     */
    direction: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    /**
     * Size variants
     */
    size: {
      compact: "",
      default: "",
      spacious: "",
    },
  },
  defaultVariants: {
    direction: "horizontal",
    size: "default",
  },
});

// ============================================================================
// Component Types
// ============================================================================

export interface PresetsProps extends VariantProps<typeof presetsVariants> {
  /**
   * Array of preset options
   */
  presets: DatePreset[];
  /**
   * Currently selected value (for highlighting active preset)
   */
  selected?: Date | DateRange;
  /**
   * Callback when a preset is selected
   */
  onSelect?: (value: Date | DateRange) => void;
  /**
   * Additional class name
   */
  className?: string;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Presets - Quick selection buttons for common date/date range values
 *
 * @example
 * ```tsx
 * const presets = [
 *   { label: "Today", value: new Date() },
 *   { label: "Yesterday", value: () => subDays(new Date(), 1) },
 * ];
 *
 * <Presets
 *   presets={presets}
 *   selected={selectedDate}
 *   onSelect={setSelectedDate}
 * />
 * ```
 */
function Presets({
  className,
  direction = "horizontal",
  size = "default",
  presets,
  selected,
  onSelect,
}: PresetsProps) {
  // Determine button size based on preset size
  const buttonSize = size === "compact" ? "xs" : size === "spacious" ? "md" : "sm";

  // Check if a preset matches the current selection
  const isPresetActive = (preset: DatePreset): boolean => {
    if (!selected) return false;

    const presetValue = evaluatePreset(preset);

    // Handle DateRange
    if ("from" in presetValue && selected && "from" in selected) {
      const presetRange = presetValue as DateRange;
      const selectedRange = selected as DateRange;
      return (
        presetRange.from?.getTime() === selectedRange.from?.getTime() &&
        presetRange.to?.getTime() === selectedRange.to?.getTime()
      );
    }

    // Handle Date
    if (presetValue instanceof Date && selected instanceof Date) {
      // Compare just the date part for single dates
      return (
        presetValue.getFullYear() === selected.getFullYear() &&
        presetValue.getMonth() === selected.getMonth() &&
        presetValue.getDate() === selected.getDate()
      );
    }

    return false;
  };

  const handlePresetClick = (preset: DatePreset) => {
    if (preset.disabled) return;
    const value = evaluatePreset(preset);
    onSelect?.(value);
  };

  return (
    <div className={cn(presetsVariants({ direction, size }), className)}>
      {presets.map((preset, index) => {
        const isActive = isPresetActive(preset);

        return (
          <Button
            key={`${preset.label}-${index}`}
            colorStyle={isActive ? "filled" : "outlined"}
            size={buttonSize}
            disabled={preset.disabled}
            onClick={() => handlePresetClick(preset)}
            className={cn(
              "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
              // Stagger entrance animation
              index > 0 && "animate-in fade-in-0 slide-in-from-left-1",
              index === 1 && "animation-delay-50",
              index === 2 && "animation-delay-100",
              index >= 3 && "animation-delay-150"
            )}
          >
            {preset.label}
          </Button>
        );
      })}
    </div>
  );
}
Presets.displayName = "Presets";

// ============================================================================
// Exports
// ============================================================================

export { Presets, presetsVariants };
