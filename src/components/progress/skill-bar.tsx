"use client";

import * as React from "react";
import { LinearProgress, type LinearProgressProps } from "./linear-progress";

// ============================================================================
// Types
// ============================================================================

export interface SkillBarProps extends Omit<LinearProgressProps, "label" | "labelPosition"> {
  /**
   * Skill name
   */
  skill: string;
  /**
   * Skill level label (e.g., "Beginner", "Expert")
   */
  level?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * SkillBar - A specialized progress bar for displaying skills
 *
 * Pre-configured LinearProgress optimized for skill/competency display.
 *
 * @example
 * ```tsx
 * <SkillBar skill="React" value={90} level="Expert" />
 * <SkillBar skill="TypeScript" value={85} showValue />
 * ```
 */
export const SkillBar = React.forwardRef<HTMLDivElement, SkillBarProps>(
  (
    {
      skill,
      level,
      showValue = true,
      valuePosition = "right",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{skill}</span>
          {level && (
            <span className="text-xs text-muted-foreground">{level}</span>
          )}
        </div>
        <LinearProgress
          ref={ref}
          showValue={showValue}
          valuePosition={valuePosition}
          aria-label={`${skill} skill level`}
          {...props}
        />
      </div>
    );
  }
);

SkillBar.displayName = "SkillBar";
