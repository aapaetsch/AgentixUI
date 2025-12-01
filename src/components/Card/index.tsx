import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ============================================================================
// Card Variants
// ============================================================================

/**
 * Card container variants using CVA
 * Implements Material Design 3 card types: elevated, filled, outlined
 */
const cardVariants = cva(
  [
    // Base styles
    "relative flex flex-col overflow-hidden",
    // M3 Motion for elevation and state transitions
    "transition-[box-shadow,background-color,border-color,transform]",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      /**
       * Card type following MD3 specifications
       * - elevated: Surface container low + Level 1 elevation (1dp shadow)
       * - filled: Surface container highest + Level 0 elevation (no shadow)
       * - outlined: Surface + outline-variant border + Level 0 elevation
       * 
       * MD3 State Layer Opacities: hover=8%, focus=10%, press=10%, drag=16%
       * State layer uses on-surface color
       */
      variant: {
        elevated: [
          // MD3: surface-container-low + elevation level 1
          "bg-[hsl(var(--surface-container-low))]",
          "text-[hsl(var(--on-surface))]",
          // MD3 Level 1 elevation (1dp) - using shadow-md for visible elevation
          "shadow-md",
        ].join(" "),
        filled: [
          // MD3: surface-container-highest + elevation level 0 (no shadow)
          "bg-[hsl(var(--surface-container-highest))]",
          "text-[hsl(var(--on-surface))]",
        ].join(" "),
        outlined: [
          // MD3: surface + outline-variant border + elevation level 0
          "bg-[hsl(var(--surface))]",
          "text-[hsl(var(--on-surface))]",
          "border border-[hsl(var(--outline-variant))]",
        ].join(" "),
      },
      /**
       * Size variants controlling padding and border radius
       * xs: Compact cards, sm: Small, md: Default, lg: Large, xl: Hero cards
       */
      size: {
        xs: "rounded-[var(--radius)]",
        sm: "rounded-[var(--radius-md)]",
        md: "rounded-[var(--radius-md)]",
        lg: "rounded-[var(--radius-lg)]",
        xl: "rounded-[var(--radius-xl)]",
      },
      /**
       * Interactive mode for clickable cards
       * MD3 State Layer: hover=8%, focus=10%, press=10%
       * Uses pseudo-element for state layer overlay
       */
      interactive: {
        true: [
          "cursor-pointer",
          // State layer pseudo-element
          "before:absolute before:inset-0 before:z-0 before:rounded-[inherit]",
          "before:bg-[hsl(var(--on-surface))] before:opacity-0",
          "before:transition-opacity before:duration-[var(--motion-duration-medium)]",
          // Hover: 8% state layer
          "hover:before:opacity-[0.08]",
          // Focus: 10% state layer + focus ring
          "focus-visible:outline-none focus-visible:before:opacity-[0.1]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Press: 10% state layer + slight scale
          "active:before:opacity-[0.1] active:scale-[0.99]",
        ].join(" "),
        false: "",
      },
      /**
       * Dragged state for pick-up-and-move gesture
       * MD3: Level 4 elevation (8dp) + 16% state layer
       */
      dragged: {
        true: [
          // MD3 Level 4 elevation (8dp) + 16% state layer
          "shadow-xl scale-[1.02] z-50",
          "before:opacity-[0.16]",
        ].join(" "),
        false: "",
      },
      /**
       * Disabled state
       * MD3: 38% opacity for disabled containers
       */
      disabled: {
        true: "opacity-[0.38] pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      // Elevated + Interactive: Increase elevation on hover (Level 1 -> Level 2)
      {
        variant: "elevated",
        interactive: true,
        className: "hover:shadow-lg",
      },
    ],
    defaultVariants: {
      variant: "elevated",
      size: "md",
      interactive: false,
      dragged: false,
      disabled: false,
    },
  }
);

// ============================================================================
// Card Header Variants
// ============================================================================

const cardHeaderVariants = cva(
  [
    "flex flex-col gap-1.5",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "p-3",
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
        xl: "p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Card Title Variants
// ============================================================================

const cardTitleVariants = cva(
  [
    "font-semibold leading-none tracking-tight",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "text-sm",
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Card Description Variants
// ============================================================================

const cardDescriptionVariants = cva(
  [
    "text-muted-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm",
        xl: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Card Content Variants
// ============================================================================

const cardContentVariants = cva(
  [
    "flex-1",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "p-3 pt-0",
        sm: "p-3 pt-0",
        md: "p-4 pt-0",
        lg: "p-5 pt-0",
        xl: "p-6 pt-0",
      },
      /**
       * When true, content has full padding (not reduced top padding)
       * Use when card has no header
       */
      standalone: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { standalone: true, size: "xs", className: "pt-3" },
      { standalone: true, size: "sm", className: "pt-3" },
      { standalone: true, size: "md", className: "pt-4" },
      { standalone: true, size: "lg", className: "pt-5" },
      { standalone: true, size: "xl", className: "pt-6" },
    ],
    defaultVariants: {
      size: "md",
      standalone: false,
    },
  }
);

// ============================================================================
// Card Media Variants
// ============================================================================

const cardMediaVariants = cva(
  [
    "relative overflow-hidden",
    "bg-muted",
  ].join(" "),
  {
    variants: {
      /**
       * Media position in the card
       * - top: Media at the top, rounded corners on top only
       * - bottom: Media at the bottom, rounded corners on bottom only
       * - fill: Full card coverage (for background images)
       */
      position: {
        top: "",
        bottom: "",
        fill: "absolute inset-0",
      },
      /**
       * Aspect ratio presets
       */
      aspectRatio: {
        auto: "",
        square: "aspect-square",
        video: "aspect-video",
        wide: "aspect-[2/1]",
        tall: "aspect-[3/4]",
      },
    },
    defaultVariants: {
      position: "top",
      aspectRatio: "video",
    },
  }
);

// ============================================================================
// Card Actions Variants
// ============================================================================

const cardActionsVariants = cva(
  [
    "flex items-center gap-2",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "p-3 pt-0",
        sm: "p-3 pt-0",
        md: "p-4 pt-0",
        lg: "p-5 pt-0",
        xl: "p-6 pt-0",
      },
      /**
       * Actions alignment
       */
      align: {
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        between: "justify-between",
      },
    },
    defaultVariants: {
      size: "md",
      align: "end",
    },
  }
);

// ============================================================================
// Card Footer Variants
// ============================================================================

const cardFooterVariants = cva(
  [
    "flex items-center",
    "border-t border-border",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "p-3",
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
        xl: "p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Card Component
// ============================================================================

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * When true, renders as child element (useful for links/buttons)
   */
  asChild?: boolean;
}

/**
 * Card - A container component following Material Design 3 patterns
 *
 * Cards display content and actions about a single subject.
 * The card container is the only required element - all other sub-components are optional.
 *
 * @example
 * ```tsx
 * // Basic elevated card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content goes here</CardContent>
 * </Card>
 *
 * // Interactive card (clickable)
 * <Card interactive onClick={handleClick}>
 *   <CardContent>Click me</CardContent>
 * </Card>
 *
 * // Outlined card with actions
 * <Card variant="outlined">
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 *   <CardActions>
 *     <Button variant="text">Cancel</Button>
 *     <Button>Confirm</Button>
 *   </CardActions>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      dragged,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-slot="card"
        className={cn(
          cardVariants({ variant, size, interactive, dragged, disabled }),
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

// ============================================================================
// CardHeader Component
// ============================================================================

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {
  /**
   * Optional leading element (avatar, icon, thumbnail)
   */
  leading?: React.ReactNode;
  /**
   * Optional trailing element (icon button, overflow menu)
   */
  trailing?: React.ReactNode;
}

/**
 * CardHeader - Container for card header content
 *
 * Contains the headline, subhead, and optionally avatar/trailing actions.
 *
 * @example
 * ```tsx
 * <CardHeader
 *   leading={<Avatar><AvatarImage src="..." /></Avatar>}
 *   trailing={<IconButton><MoreVertical /></IconButton>}
 * >
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Description</CardDescription>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, leading, trailing, children, ...props }, ref) => {
    // If leading or trailing content, use row layout
    const hasExtras = leading || trailing;

    if (hasExtras) {
      return (
        <div
          ref={ref}
          data-slot="card-header"
          className={cn(
            cardHeaderVariants({ size }),
            "flex-row items-start gap-3",
            className
          )}
          {...props}
        >
          {leading && (
            <div data-slot="card-header-leading" className="shrink-0">
              {leading}
            </div>
          )}
          <div className="flex flex-1 flex-col gap-1.5 min-w-0">{children}</div>
          {trailing && (
            <div data-slot="card-header-trailing" className="shrink-0 -mt-1 -mr-1">
              {trailing}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(cardHeaderVariants({ size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// ============================================================================
// CardTitle Component
// ============================================================================

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {
  /**
   * When true, renders as child element
   */
  asChild?: boolean;
}

/**
 * CardTitle - Headline text for the card
 *
 * Communicates the subject of the card (photo album name, article title, etc.)
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3";

    return (
      <Comp
        ref={ref}
        data-slot="card-title"
        className={cn(cardTitleVariants({ size }), className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = "CardTitle";

// ============================================================================
// CardDescription Component
// ============================================================================

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof cardDescriptionVariants> {
  /**
   * When true, renders as child element
   */
  asChild?: boolean;
}

/**
 * CardDescription - Subhead or supporting text
 *
 * Smaller text elements like article byline, tagged location, or brief summary.
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      ref={ref}
      data-slot="card-description"
      className={cn(cardDescriptionVariants({ size }), className)}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

// ============================================================================
// CardContent Component
// ============================================================================

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

/**
 * CardContent - Main content area of the card
 *
 * Contains the primary content such as text, lists, or other components.
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, standalone, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn(cardContentVariants({ size, standalone }), className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = "CardContent";

// ============================================================================
// CardMedia Component
// ============================================================================

export interface CardMediaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardMediaVariants> {
  /**
   * Image source URL
   */
  src?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Object fit for the image
   */
  objectFit?: "cover" | "contain" | "fill" | "none";
}

/**
 * CardMedia - Media container for images, thumbnails, or videos
 *
 * MD3 Guidelines:
 * - Thumbnails: For avatars or logos
 * - Images: Photos, illustrations, graphics
 * - Videos: Embedded video content
 *
 * @example
 * ```tsx
 * // Image media
 * <CardMedia src="/image.jpg" alt="Description" aspectRatio="video" />
 *
 * // Custom content (video, illustration)
 * <CardMedia aspectRatio="wide">
 *   <video src="/video.mp4" />
 * </CardMedia>
 * ```
 */
const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  (
    {
      className,
      position,
      aspectRatio,
      src,
      alt,
      objectFit = "cover",
      children,
      ...props
    },
    ref
  ) => {
    const objectFitClasses = {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
    };

    return (
      <div
        ref={ref}
        data-slot="card-media"
        className={cn(cardMediaVariants({ position, aspectRatio }), className)}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || ""}
            className={cn(
              "w-full h-full",
              objectFitClasses[objectFit]
            )}
          />
        ) : (
          children
        )}
      </div>
    );
  }
);

CardMedia.displayName = "CardMedia";

// ============================================================================
// CardActions Component
// ============================================================================

export interface CardActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardActionsVariants> {}

/**
 * CardActions - Container for card action buttons
 *
 * MD3 Guidelines:
 * - Buttons for actions like "Learn more", "Add to cart"
 * - Icon buttons for actions like Save, Heart, Star rating
 * - Selection controls like chips, sliders, checkboxes
 */
const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className, size, align, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-actions"
        className={cn(cardActionsVariants({ size, align }), className)}
        {...props}
      />
    );
  }
);

CardActions.displayName = "CardActions";

// ============================================================================
// CardFooter Component
// ============================================================================

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

/**
 * CardFooter - Footer area separated by a divider
 *
 * Use for secondary information or actions that should be visually separated.
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn(cardFooterVariants({ size }), className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

// ============================================================================
// SwipeableCard Component
// ============================================================================

export interface SwipeableCardProps extends CardProps {
  /**
   * Callback when card is swiped to dismiss
   */
  onDismiss?: (direction: "left" | "right") => void;
  /**
   * Swipe threshold in pixels to trigger dismiss
   * @default 100
   */
  swipeThreshold?: number;
  /**
   * Whether swipe gestures are enabled
   * @default true
   */
  swipeEnabled?: boolean;
  /**
   * Allowed swipe directions
   * @default "both"
   */
  swipeDirection?: "left" | "right" | "both";
}

/**
 * SwipeableCard - Card with swipe-to-dismiss gesture support
 *
 * MD3 Guidelines:
 * - Swipe gesture can be performed on a single card at a time
 * - Can be used to dismiss a card or change its state (flag, archive)
 * - A card should only have one swipe action assigned
 *
 * @example
 * ```tsx
 * <SwipeableCard onDismiss={(dir) => console.log(`Swiped ${dir}`)}>
 *   <CardContent>Swipe me!</CardContent>
 * </SwipeableCard>
 * ```
 */
const SwipeableCard = React.forwardRef<HTMLDivElement, SwipeableCardProps>(
  (
    {
      className,
      onDismiss,
      swipeThreshold = 100,
      swipeEnabled = true,
      swipeDirection = "both",
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [offset, setOffset] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const cardRef = React.useRef<HTMLDivElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => cardRef.current!);

    const handleTouchStart = React.useCallback(
      (e: React.TouchEvent) => {
        if (!swipeEnabled) return;
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
      },
      [swipeEnabled]
    );

    const handleTouchMove = React.useCallback(
      (e: React.TouchEvent) => {
        if (!isDragging || !swipeEnabled) return;

        const currentX = e.touches[0].clientX;
        let delta = currentX - startX;

        // Restrict direction if needed
        if (swipeDirection === "left" && delta > 0) delta = 0;
        if (swipeDirection === "right" && delta < 0) delta = 0;

        setOffset(delta);
      },
      [isDragging, startX, swipeEnabled, swipeDirection]
    );

    const handleTouchEnd = React.useCallback(() => {
      if (!isDragging) return;
      setIsDragging(false);

      const absOffset = Math.abs(offset);

      if (absOffset >= swipeThreshold && onDismiss) {
        const direction = offset > 0 ? "right" : "left";
        onDismiss(direction);
      }

      setOffset(0);
    }, [isDragging, offset, swipeThreshold, onDismiss]);

    // Mouse events for desktop support
    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (!swipeEnabled) return;
        setIsDragging(true);
        setStartX(e.clientX);
      },
      [swipeEnabled]
    );

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent) => {
        if (!isDragging || !swipeEnabled) return;

        let delta = e.clientX - startX;

        // Restrict direction if needed
        if (swipeDirection === "left" && delta > 0) delta = 0;
        if (swipeDirection === "right" && delta < 0) delta = 0;

        setOffset(delta);
      },
      [isDragging, startX, swipeEnabled, swipeDirection]
    );

    const handleMouseUp = React.useCallback(() => {
      handleTouchEnd();
    }, [handleTouchEnd]);

    const handleMouseLeave = React.useCallback(() => {
      if (isDragging) {
        handleTouchEnd();
      }
    }, [isDragging, handleTouchEnd]);

    // Calculate opacity based on offset
    const opacity = Math.max(0, 1 - Math.abs(offset) / (swipeThreshold * 2));

    return (
      <Card
        ref={cardRef}
        className={cn(
          "touch-pan-y select-none",
          isDragging && "cursor-grabbing",
          className
        )}
        style={{
          ...style,
          transform: `translateX(${offset}px)`,
          opacity,
          transition: isDragging
            ? "none"
            : "transform var(--motion-duration-medium) var(--motion-easing-standard), opacity var(--motion-duration-medium) var(--motion-easing-standard)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

SwipeableCard.displayName = "SwipeableCard";

// ============================================================================
// ExpandableCard Component
// ============================================================================

export interface ExpandableCardProps extends CardProps {
  /**
   * Whether the card is expanded (controlled)
   */
  expanded?: boolean;
  /**
   * Default expanded state (uncontrolled)
   */
  defaultExpanded?: boolean;
  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Content to show when expanded
   */
  expandedContent?: React.ReactNode;
}

/**
 * ExpandableCard - Card with container transform expand animation
 *
 * MD3 Guidelines:
 * - Cards can use container transform transition to reveal additional content
 * - Reserve for hero moments meant to be expressive
 * - Don't scroll within a card; expand to reveal information instead
 *
 * @example
 * ```tsx
 * <ExpandableCard
 *   expanded={isExpanded}
 *   onExpandedChange={setIsExpanded}
 *   expandedContent={<ExpandedView />}
 * >
 *   <CardContent>Click to expand</CardContent>
 * </ExpandableCard>
 * ```
 */
const ExpandableCard = React.forwardRef<HTMLDivElement, ExpandableCardProps>(
  (
    {
      className,
      expanded: controlledExpanded,
      defaultExpanded = false,
      onExpandedChange,
      expandedContent,
      children,
      interactive = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] =
      React.useState(defaultExpanded);

    const isExpanded = controlledExpanded ?? internalExpanded;

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e);

        if (controlledExpanded === undefined) {
          setInternalExpanded(!internalExpanded);
        }
        onExpandedChange?.(!isExpanded);
      },
      [onClick, controlledExpanded, internalExpanded, isExpanded, onExpandedChange]
    );

    // Store original position for container transform
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [originRect, setOriginRect] = React.useState<DOMRect | null>(null);

    React.useEffect(() => {
      if (isExpanded && cardRef.current) {
        setOriginRect(cardRef.current.getBoundingClientRect());
      }
    }, [isExpanded]);

    // Merge refs
    React.useImperativeHandle(ref, () => cardRef.current!);

    if (isExpanded && expandedContent) {
      return (
        <>
          {/* Placeholder to maintain layout */}
          <div
            style={{
              width: originRect?.width,
              height: originRect?.height,
            }}
            aria-hidden
          />
          {/* Expanded overlay */}
          <div
            className={cn(
              "fixed inset-0 z-50",
              "bg-background",
              "animate-in fade-in-0 zoom-in-95",
              "duration-[var(--motion-duration-long)]"
            )}
            onClick={handleClick}
            role="dialog"
            aria-modal="true"
          >
            <div className="h-full overflow-auto">{expandedContent}</div>
          </div>
        </>
      );
    }

    return (
      <Card
        ref={cardRef}
        className={className}
        interactive={interactive}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

ExpandableCard.displayName = "ExpandableCard";

// ============================================================================
// Exports
// ============================================================================

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
  CardFooter,
  SwipeableCard,
  ExpandableCard,
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardMediaVariants,
  cardActionsVariants,
  cardFooterVariants,
};
