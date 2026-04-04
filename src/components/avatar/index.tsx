import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ============================================================================
// Avatar Component
// ============================================================================

/**
 * Avatar variants using CVA
 * Implements size and shape variants with MD3 motion patterns
 */
const avatarVariants = cva(
  [
    // Base styles
    "relative flex shrink-0 overflow-hidden",
    // Transition for smooth animations
    "transition-[transform,opacity,box-shadow]",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants matching library scale
       * xs: 24px, sm: 32px, md: 40px, lg: 56px, xl: 64px
       */
      size: {
        xs: "size-6 text-[10px]", // 24px
        sm: "size-8 text-xs", // 32px
        md: "size-10 text-sm", // 40px
        lg: "size-14 text-base", // 56px
        xl: "size-16 text-lg", // 64px
      },
      /**
       * Shape variants
       * circle: Fully rounded (default)
       * square: Rounded corners matching size
       */
      shape: {
        circle: "rounded-full",
        square: "", // Handled by compound variants
      },
    },
    compoundVariants: [
      // Square shape radius scales with size
      { shape: "square", size: "xs", className: "rounded-[var(--radius-sm)]" },
      { shape: "square", size: "sm", className: "rounded-[var(--radius)]" },
      { shape: "square", size: "md", className: "rounded-[var(--radius)]" },
      { shape: "square", size: "lg", className: "rounded-[var(--radius-md)]" },
      { shape: "square", size: "xl", className: "rounded-[var(--radius-lg)]" },
    ],
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

/**
 * Avatar - A visual representation of a user or entity
 *
 * Built on Radix UI Avatar primitive with extended size and shape variants.
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/user.png" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 *
 * <Avatar size="lg" shape="square">
 *   <AvatarImage src="/company.png" alt="Company" />
 *   <AvatarFallback>AC</AvatarFallback>
 * </Avatar>
 * ```
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, shape, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    className={cn(avatarVariants({ size, shape }), className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// ============================================================================
// AvatarImage Component
// ============================================================================

export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {}

/**
 * AvatarImage - The image displayed within an Avatar
 *
 * Automatically handles loading states and falls back to AvatarFallback on error.
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// ============================================================================
// AvatarFallback Component
// ============================================================================

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {}

/**
 * AvatarFallback - Displayed when avatar image is unavailable
 *
 * Typically contains user initials or a default icon.
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center",
      "bg-muted text-muted-foreground font-medium",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// ============================================================================
// AvatarGroup Component
// ============================================================================

const avatarGroupVariants = cva("flex items-center", {
  variants: {
    /**
     * Orientation of the avatar stack
     */
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    /**
     * Spacing between avatars (negative for overlap)
     */
    spacing: {
      none: "",
      tight: "", // Handled by compound variants
      normal: "", // Handled by compound variants
      loose: "", // Handled by compound variants
    },
  },
  compoundVariants: [
    // Horizontal spacing
    { orientation: "horizontal", spacing: "tight", className: "-space-x-3" },
    { orientation: "horizontal", spacing: "normal", className: "-space-x-2" },
    { orientation: "horizontal", spacing: "loose", className: "-space-x-1" },
    { orientation: "horizontal", spacing: "none", className: "gap-1" },
    // Vertical spacing
    { orientation: "vertical", spacing: "tight", className: "-space-y-3" },
    { orientation: "vertical", spacing: "normal", className: "-space-y-2" },
    { orientation: "vertical", spacing: "loose", className: "-space-y-1" },
    { orientation: "vertical", spacing: "none", className: "gap-1" },
  ],
  defaultVariants: {
    orientation: "horizontal",
    spacing: "normal",
  },
});

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupVariants> {
  /**
   * Maximum number of avatars to display
   * Additional avatars will be shown as a count indicator
   */
  max?: number;
  /**
   * Size of the ring around each avatar in the group
   * @default 2
   */
  ringWidth?: 1 | 2 | 3 | 4;
  /**
   * Size passed to overflow count avatar
   * Should match the size of avatars in the group
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Shape passed to overflow count avatar
   * Should match the shape of avatars in the group
   */
  shape?: "circle" | "square";
}

/**
 * AvatarGroup - Display a collection of avatars with overlap styling
 *
 * Automatically adds ring separators and supports overflow indication.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar><AvatarImage src="/user1.png" /><AvatarFallback>U1</AvatarFallback></Avatar>
 *   <Avatar><AvatarImage src="/user2.png" /><AvatarFallback>U2</AvatarFallback></Avatar>
 *   <Avatar><AvatarImage src="/user3.png" /><AvatarFallback>U3</AvatarFallback></Avatar>
 *   <Avatar><AvatarImage src="/user4.png" /><AvatarFallback>U4</AvatarFallback></Avatar>
 * </AvatarGroup>
 * ```
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      orientation,
      spacing,
      max,
      ringWidth = 2,
      size = "md",
      shape = "circle",
      children,
      ...props
    },
    ref
  ) => {
    const childArray = React.Children.toArray(children);
    const totalCount = childArray.length;
    const displayCount = max ? Math.min(max, totalCount) : totalCount;
    const overflowCount = max ? totalCount - max : 0;

    // Ring width classes
    const ringClasses = {
      1: "ring-1 ring-background",
      2: "ring-2 ring-background",
      3: "ring-[3px] ring-background",
      4: "ring-4 ring-background",
    };

    // Clone children with ring styling
    const visibleChildren = childArray.slice(0, displayCount).map((child) => {
      if (React.isValidElement<AvatarProps>(child)) {
        return React.cloneElement(child, {
          className: cn(ringClasses[ringWidth], child.props.className),
        });
      }
      return child;
    });

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`Avatar group of ${totalCount} users`}
        className={cn(avatarGroupVariants({ orientation, spacing }), className)}
        {...props}
      >
        {visibleChildren}
        {overflowCount > 0 && (
          <Avatar
            size={size}
            shape={shape}
            className={cn(ringClasses[ringWidth])}
          >
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              +{overflowCount}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

// ============================================================================
// AvatarBadge Component
// ============================================================================

const avatarBadgeVariants = cva(
  [
    "absolute flex items-center justify-center",
    "rounded-full border-2 border-background",
    // Transition for animations
    "transition-[transform,opacity]",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      /**
       * Position of the badge
       */
      position: {
        "top-right": "top-0 right-0 translate-x-1/4 -translate-y-1/4",
        "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4",
        "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
        "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
      },
      /**
       * Size of the badge dot
       * Scales with avatar size
       */
      size: {
        xs: "size-2",
        sm: "size-2.5",
        md: "size-3",
        lg: "size-3.5",
        xl: "size-4",
      },
      /**
       * Status color variants
       */
      status: {
        online: "bg-green-500",
        offline: "bg-gray-400",
        busy: "bg-red-500",
        away: "bg-amber-500",
        default: "bg-primary",
      },
    },
    defaultVariants: {
      position: "bottom-right",
      size: "md",
      status: "default",
    },
  }
);

export interface AvatarBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarBadgeVariants> {
  /**
   * Whether the badge is visible
   * @default true
   */
  visible?: boolean;
  /**
   * Animation type for entrance/exit
   * @default "scale"
   */
  animation?: "scale" | "fade" | "none";
  /**
   * Whether the badge should pulse (for online status, etc.)
   * @default false
   */
  pulse?: boolean;
}

/**
 * AvatarBadge - Status indicator badge for avatars
 *
 * Must be used as a child of Avatar component.
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/user.png" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 *   <AvatarBadge status="online" />
 * </Avatar>
 *
 * <Avatar>
 *   <AvatarImage src="/user.png" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 *   <AvatarBadge status="online" pulse />
 * </Avatar>
 * ```
 */
const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  (
    {
      className,
      position,
      size,
      status,
      visible = true,
      animation = "scale",
      pulse = false,
      ...props
    },
    ref
  ) => {
    const animationClasses = {
      scale: visible
        ? "scale-100 opacity-100"
        : "scale-0 opacity-0 pointer-events-none",
      fade: visible ? "opacity-100" : "opacity-0 pointer-events-none",
      none: visible ? "" : "hidden",
    };

    return (
      <span
        ref={ref}
        role="status"
        aria-label={status ? `Status: ${status}` : undefined}
        className={cn(
          avatarBadgeVariants({ position, size, status }),
          animationClasses[animation],
          pulse && "animate-pulse",
          className
        )}
        {...props}
      />
    );
  }
);
AvatarBadge.displayName = "AvatarBadge";

// ============================================================================
// AnimatedAvatar Component
// ============================================================================

export interface AnimatedAvatarProps extends AvatarProps {
  /**
   * Whether the avatar is visible
   * @default true
   */
  visible?: boolean;
  /**
   * Animation type for entrance/exit
   * @default "scale"
   */
  animation?: "scale" | "fade" | "slide";
}

/**
 * AnimatedAvatar - Avatar with built-in entrance/exit animations
 *
 * @example
 * ```tsx
 * <AnimatedAvatar visible={isVisible} animation="scale">
 *   <AvatarImage src="/user.png" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </AnimatedAvatar>
 * ```
 */
const AnimatedAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AnimatedAvatarProps
>(({ className, visible = true, animation = "scale", ...props }, ref) => {
  const animationClasses = {
    scale: visible
      ? "scale-100 opacity-100"
      : "scale-0 opacity-0 pointer-events-none",
    fade: visible ? "opacity-100" : "opacity-0 pointer-events-none",
    slide: visible
      ? "translate-y-0 opacity-100"
      : "-translate-y-2 opacity-0 pointer-events-none",
  };

  return (
    <Avatar
      ref={ref}
      className={cn(animationClasses[animation], className)}
      {...props}
    />
  );
});
AnimatedAvatar.displayName = "AnimatedAvatar";

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarBadge,
  AnimatedAvatar,
  avatarVariants,
  avatarGroupVariants,
  avatarBadgeVariants,
};
