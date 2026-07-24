"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * Skeleton base variants using CVA
 * Implements loading placeholder patterns with pulse and shimmer animations
 */
const skeletonVariants = cva(
  [
    "relative overflow-hidden",
    // Base colors - different in light/dark mode
    "bg-muted",
    // Ensure content is hidden
    "isolate",
  ].join(" "),
  {
    variants: {
      /**
       * Shape variants for different content types
       * - rect: Rectangular with rounded corners (default)
       * - circle: Circular for avatars
       * - pill: Rounded pill shape for buttons/badges
       * - text: Text-like with slight height for single lines
       */
      shape: {
        rect: "rounded-[var(--radius)]",
        circle: "rounded-full aspect-square",
        pill: "rounded-full",
        text: "rounded-[var(--radius-sm)]",
      },
      /**
       * Animation variants
       * - pulse: Gentle opacity pulsing (default)
       * - shimmer: Gradient sliding effect
       * - none: No animation (for static placeholders)
       */
      animation: {
        pulse: "animate-pulse",
        shimmer: "", // Shimmer handled with pseudo-element
        none: "",
      },
      /**
       * Size presets for common use cases
       * Matches component library sizing scale
       */
      size: {
        xs: "h-3", // 12px - small text
        sm: "h-4", // 16px - body text
        md: "h-5", // 20px - headings
        lg: "h-6", // 24px - large text
        xl: "h-8", // 32px - display text
        "2xl": "h-10", // 40px - avatar/icon
        "3xl": "h-12", // 48px - large avatar
        "4xl": "h-16", // 64px - hero elements
        full: "h-full", // Fill parent
        auto: "", // No height constraint
      },
    },
    compoundVariants: [
      // Circle shape should have equal width and height based on size
      { shape: "circle", size: "xs", className: "w-3" },
      { shape: "circle", size: "sm", className: "w-4" },
      { shape: "circle", size: "md", className: "w-5" },
      { shape: "circle", size: "lg", className: "w-6" },
      { shape: "circle", size: "xl", className: "w-8" },
      { shape: "circle", size: "2xl", className: "w-10" },
      { shape: "circle", size: "3xl", className: "w-12" },
      { shape: "circle", size: "4xl", className: "w-16" },
    ],
    defaultVariants: {
      shape: "rect",
      animation: "pulse",
      size: "md",
    },
  }
);

/**
 * Shimmer animation overlay styles
 * Creates a gradient that slides across the skeleton
 */
const shimmerOverlayStyles = [
  "absolute inset-0",
  "translate-x-[-100%]",
  "animate-[shimmer_2s_infinite]",
  // Gradient from transparent -> white/10% -> transparent
  "bg-gradient-to-r",
  "from-transparent",
  "via-white/20 dark:via-white/10",
  "to-transparent",
].join(" ");

// ============================================================================
// Types
// ============================================================================

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Width of the skeleton
   * Can be a Tailwind class (e.g., "w-32") or CSS value (e.g., "200px")
   */
  width?: string;
  /**
   * Height of the skeleton (overrides size variant)
   * Can be a Tailwind class (e.g., "h-8") or CSS value (e.g., "40px")
   */
  height?: string;
}

// ============================================================================
// Skeleton Component
// ============================================================================

/**
 * Skeleton - A loading placeholder component
 *
 * Displays animated placeholders while content is loading.
 * Supports pulse and shimmer animations with various shapes and sizes.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Skeleton className="w-32" />
 *
 * // Circle avatar placeholder
 * <Skeleton shape="circle" size="3xl" />
 *
 * // Shimmer animation
 * <Skeleton animation="shimmer" className="w-full h-40" />
 *
 * // Custom dimensions
 * <Skeleton width="200px" height="100px" />
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      shape,
      animation,
      size,
      width,
      height,
      style,
      ...props
    },
    ref
  ) => {
    // Build inline styles for custom width/height
    const customStyles: React.CSSProperties = {
      ...style,
    };

    // Handle custom width - check if it's a CSS value or Tailwind class
    if (width && !width.startsWith("w-")) {
      customStyles.width = width;
    }

    // Handle custom height - check if it's a CSS value or Tailwind class
    if (height && !height.startsWith("h-")) {
      customStyles.height = height;
    }

    return (
      <div
        ref={ref}
        data-slot="skeleton"
        role="status"
        aria-busy="true"
        aria-label="Loading..."
        className={cn(
          skeletonVariants({ shape, animation, size }),
          // Handle Tailwind width/height classes
          width?.startsWith("w-") && width,
          height?.startsWith("h-") && height,
          className
        )}
        style={Object.keys(customStyles).length > 0 ? customStyles : style}
        {...props}
      >
        {/* Shimmer overlay for shimmer animation */}
        {animation === "shimmer" && (
          <div
            className={shimmerOverlayStyles}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// ============================================================================
// SkeletonText Component
// ============================================================================

export interface SkeletonTextProps
  extends Omit<SkeletonProps, "shape" | "size"> {
  /**
   * Number of text lines to display
   * @default 3
   */
  lines?: number;
  /**
   * Gap between lines
   * @default "sm"
   */
  gap?: "xs" | "sm" | "md" | "lg";
  /**
   * Line height variant
   * @default "md"
   */
  lineHeight?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Whether the last line should be shorter (more natural text appearance)
   * @default true
   */
  lastLineShort?: boolean;
  /**
   * Width of the last line when lastLineShort is true
   * @default "60%"
   */
  lastLineWidth?: string;
}

/**
 * SkeletonText - Multi-line text placeholder
 *
 * Displays multiple skeleton lines to represent paragraph content.
 * Automatically makes the last line shorter for a natural text appearance.
 *
 * @example
 * ```tsx
 * // Basic paragraph placeholder
 * <SkeletonText lines={4} />
 *
 * // With larger gap
 * <SkeletonText lines={3} gap="md" />
 *
 * // Without short last line
 * <SkeletonText lines={5} lastLineShort={false} />
 * ```
 */
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    {
      className,
      lines = 3,
      gap = "sm",
      lineHeight = "md",
      lastLineShort = true,
      lastLineWidth = "60%",
      animation,
      ...props
    },
    ref
  ) => {
    const gapClasses = {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    };

    const lineHeightClasses = {
      xs: "h-3",
      sm: "h-4",
      md: "h-5",
      lg: "h-6",
      xl: "h-8",
    };

    return (
      <div
        ref={ref}
        data-slot="skeleton-text"
        role="status"
        aria-busy="true"
        aria-label="Loading text..."
        className={cn("flex flex-col", gapClasses[gap], className)}
        {...props}
      >
        {Array.from({ length: lines }).map((_, index) => {
          const isLastLine = index === lines - 1;
          const lineWidth = isLastLine && lastLineShort ? lastLineWidth : "100%";

          return (
            <Skeleton
              key={index}
              shape="text"
              animation={animation}
              className={cn(lineHeightClasses[lineHeight])}
              style={{ width: lineWidth }}
            />
          );
        })}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";

// ============================================================================
// SkeletonCard Component
// ============================================================================

export interface SkeletonCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Whether to show a media/image placeholder at the top
   * @default true
   */
  showMedia?: boolean;
  /**
   * Aspect ratio for the media placeholder
   * @default "video"
   */
  mediaAspectRatio?: "square" | "video" | "wide" | "tall";
  /**
   * Whether to show an avatar in the header
   * @default false
   */
  showAvatar?: boolean;
  /**
   * Avatar size
   * @default "md"
   */
  avatarSize?: "sm" | "md" | "lg";
  /**
   * Number of content text lines
   * @default 3
   */
  contentLines?: number;
  /**
   * Whether to show action buttons placeholder
   * @default false
   */
  showActions?: boolean;
  /**
   * Number of action buttons to show
   * @default 2
   */
  actionCount?: number;
  /**
   * Animation variant
   * @default "pulse"
   */
  animation?: "pulse" | "shimmer" | "none";
  /**
   * Card size variant for padding
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

/**
 * SkeletonCard - Complete card loading placeholder
 *
 * A pre-composed skeleton that mimics the structure of a typical card
 * with media, avatar, title, description, and action areas.
 *
 * @example
 * ```tsx
 * // Basic card skeleton
 * <SkeletonCard />
 *
 * // With avatar and actions
 * <SkeletonCard showAvatar showActions />
 *
 * // Without media
 * <SkeletonCard showMedia={false} contentLines={4} />
 *
 * // Shimmer animation
 * <SkeletonCard animation="shimmer" />
 * ```
 */
const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      className,
      showMedia = true,
      mediaAspectRatio = "video",
      showAvatar = false,
      avatarSize = "md",
      contentLines = 3,
      showActions = false,
      actionCount = 2,
      animation = "pulse",
      size = "md",
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      wide: "aspect-[2/1]",
      tall: "aspect-[3/4]",
    };

    const paddingClasses = {
      xs: "p-3",
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
      xl: "p-6",
    };

    const avatarSizeClasses = {
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
    };

    return (
      <div
        ref={ref}
        data-slot="skeleton-card"
        role="status"
        aria-busy="true"
        aria-label="Loading card..."
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-md)]",
          "bg-card border border-border",
          className
        )}
        {...props}
      >
        {/* Media placeholder */}
        {showMedia && (
          <Skeleton
            shape="rect"
            animation={animation}
            className={cn(
              "w-full rounded-none",
              aspectRatioClasses[mediaAspectRatio]
            )}
          />
        )}

        {/* Header with optional avatar */}
        <div className={cn("flex items-start gap-3", paddingClasses[size])}>
          {showAvatar && (
            <Skeleton
              shape="circle"
              animation={animation}
              className={avatarSizeClasses[avatarSize]}
            />
          )}
          <div className="flex-1 space-y-2">
            {/* Title line */}
            <Skeleton
              shape="text"
              animation={animation}
              className="h-5 w-3/4"
            />
            {/* Subtitle line */}
            <Skeleton
              shape="text"
              animation={animation}
              className="h-4 w-1/2"
            />
          </div>
        </div>

        {/* Content lines */}
        {contentLines > 0 && (
          <div className={cn(paddingClasses[size], "pt-0")}>
            <SkeletonText
              lines={contentLines}
              animation={animation}
              lineHeight="sm"
              gap="sm"
            />
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className={cn(
            "flex items-center justify-end gap-2",
            paddingClasses[size],
            "pt-0"
          )}>
            {Array.from({ length: actionCount }).map((_, index) => (
              <Skeleton
                key={index}
                shape="pill"
                animation={animation}
                className="h-9 w-20"
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

SkeletonCard.displayName = "SkeletonCard";

// ============================================================================
// SkeletonAvatar Component
// ============================================================================

export interface SkeletonAvatarProps
  extends Omit<SkeletonProps, "shape" | "size"> {
  /**
   * Avatar size matching library scale
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Shape of the avatar
   * @default "circle"
   */
  shape?: "circle" | "square";
}

/**
 * SkeletonAvatar - Avatar loading placeholder
 *
 * Pre-configured skeleton for avatar placeholders with proper sizing.
 *
 * @example
 * ```tsx
 * <SkeletonAvatar size="lg" />
 * <SkeletonAvatar shape="square" />
 * ```
 */
const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  (
    {
      className,
      size = "md",
      shape = "circle",
      animation,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: "size-6",
      sm: "size-8",
      md: "size-10",
      lg: "size-14",
      xl: "size-16",
    };

    const shapeClasses = {
      circle: "rounded-full",
      square: "rounded-[var(--radius)]",
    };

    return (
      <Skeleton
        ref={ref}
        data-slot="skeleton-avatar"
        shape="rect"
        animation={animation}
        className={cn(
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
        {...props}
      />
    );
  }
);

SkeletonAvatar.displayName = "SkeletonAvatar";

// ============================================================================
// SkeletonButton Component
// ============================================================================

export interface SkeletonButtonProps
  extends Omit<SkeletonProps, "shape" | "size"> {
  /**
   * Button size matching library scale
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Whether the button is icon-only (square)
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Button shape
   * @default "rect"
   */
  shape?: "rect" | "round";
}

/**
 * SkeletonButton - Button loading placeholder
 *
 * Pre-configured skeleton for button placeholders with proper sizing.
 *
 * @example
 * ```tsx
 * <SkeletonButton size="lg" />
 * <SkeletonButton iconOnly shape="round" />
 * ```
 */
const SkeletonButton = React.forwardRef<HTMLDivElement, SkeletonButtonProps>(
  (
    {
      className,
      size = "md",
      iconOnly = false,
      shape = "rect",
      animation,
      ...props
    },
    ref
  ) => {
    // Match Button component sizing
    const sizeClasses = {
      xs: iconOnly ? "size-[1.75rem]" : "h-[1.75rem] w-16",
      sm: iconOnly ? "size-[2rem]" : "h-[2rem] w-20",
      md: iconOnly ? "size-[2.25rem]" : "h-[2.25rem] w-24",
      lg: iconOnly ? "size-[2.75rem]" : "h-[2.75rem] w-28",
      xl: iconOnly ? "size-[3.25rem]" : "h-[3.25rem] w-32",
    };

    const shapeClasses = {
      rect: "rounded-[var(--radius)]",
      round: "rounded-full",
    };

    return (
      <Skeleton
        ref={ref}
        data-slot="skeleton-button"
        shape="rect"
        animation={animation}
        className={cn(
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
        {...props}
      />
    );
  }
);

SkeletonButton.displayName = "SkeletonButton";

// ============================================================================
// SkeletonInput Component
// ============================================================================

export interface SkeletonInputProps
  extends Omit<SkeletonProps, "shape" | "size"> {
  /**
   * Input size matching library scale
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to show a label placeholder above the input
   * @default false
   */
  showLabel?: boolean;
}

/**
 * SkeletonInput - Input field loading placeholder
 *
 * Pre-configured skeleton for input field placeholders.
 *
 * @example
 * ```tsx
 * <SkeletonInput showLabel />
 * <SkeletonInput size="lg" />
 * ```
 */
const SkeletonInput = React.forwardRef<HTMLDivElement, SkeletonInputProps>(
  (
    {
      className,
      size = "md",
      showLabel = false,
      animation,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-9",
      md: "h-10",
      lg: "h-11",
    };

    return (
      <div
        ref={ref}
        data-slot="skeleton-input"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {showLabel && (
          <Skeleton
            shape="text"
            animation={animation}
            className="h-4 w-24"
          />
        )}
        <Skeleton
          shape="rect"
          animation={animation}
          className={cn("w-full", sizeClasses[size])}
        />
      </div>
    );
  }
);

SkeletonInput.displayName = "SkeletonInput";

// ============================================================================
// Exports
// ============================================================================

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  skeletonVariants,
};
