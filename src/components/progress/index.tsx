"use client";

// ============================================================================
// Progress Components - Main Entry Point
// ============================================================================

// Shared types, utilities, and hooks
export {
  valueFormatters,
  useAnimatedProgress,
  calculatePercentage,
  getVariantBgClass,
  getVariantStrokeClass,
} from "./progress-shared";

export type {
  ValueFormatter,
  LabelPosition,
  ValuePosition,
  GradientStop,
  ProgressGradient,
  ProgressBaseProps,
  UseAnimatedProgressOptions,
  UseAnimatedProgressReturn,
} from "./progress-shared";

// LinearProgress component
export {
  LinearProgress,
  linearProgressVariants,
  linearProgressBarVariants,
} from "./linear-progress";

export type { LinearProgressProps } from "./linear-progress";

// CircularProgress component
export {
  CircularProgress,
  circularProgressVariants,
} from "./circular-progress";

export type {
  CircularProgressProps,
  CircularArcType,
  CircularLineCap,
} from "./circular-progress";

// SkillBar component
export { SkillBar } from "./skill-bar";
export type { SkillBarProps } from "./skill-bar";

// ProgressGroup component
export { ProgressGroup, progressGroupGapVariants } from "./progress-group";
export type { ProgressGroupProps } from "./progress-group";
