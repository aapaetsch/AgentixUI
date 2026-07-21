import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// ============================================================================
// Accordion Components
// ============================================================================

/**
 * Animation presets for the chevron rotation
 * - smooth: Default, gentle deceleration (MD3 standard)
 * - bounce: Slight overshoot for playful feel
 * - sharp: Quick and snappy for responsive UI
 */
export type ChevronAnimationPreset = "smooth" | "bounce" | "sharp";

/**
 * Chevron size variants matching button icon sizes
 */
const chevronSizeVariants = cva("shrink-0 pointer-events-none", {
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-4",
      md: "size-4",
      lg: "size-5",
      xl: "size-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * Accordion root component variants
 */
const accordionVariants = cva("", {
  variants: {
    variant: {
      default: "",
      bordered: "divide-y divide-border rounded-lg border",
      separated: "space-y-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * AccordionItem variants
 */
const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "border-b",
      bordered: "px-4",
      separated: "border rounded-lg px-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * AccordionTrigger variants
 */
const accordionTriggerVariants = cva(
  [
    "flex flex-1 items-center justify-between py-4",
    "text-sm font-medium text-left",
    "min-h-11 transition-[color,background-color] touch-manipulation",
    "hover:underline active:underline",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "py-3 text-sm",
        md: "py-4 text-sm",
        lg: "py-5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * AccordionContent variants
 */
const accordionContentVariants = cva(
  [
    "overflow-hidden text-sm",
    "data-[state=closed]:animate-accordion-up",
    "data-[state=open]:animate-accordion-down",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Accordion Root
// ============================================================================

type AccordionSingleProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  type: "single";
} & VariantProps<typeof accordionVariants>;

type AccordionMultipleProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  type: "multiple";
} & VariantProps<typeof accordionVariants>;

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

/**
 * Accordion - Collapsible content sections
 *
 * Wraps Radix UI Accordion with custom styling and animation support.
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content for section 1</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    data-slot="accordion"
    className={cn(accordionVariants({ variant }), className)}
    {...props}
  />
));
Accordion.displayName = "Accordion";

// ============================================================================
// Accordion Item
// ============================================================================

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {}

/**
 * AccordionItem - Individual accordion section container
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    data-slot="accordion-item"
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

// ============================================================================
// Accordion Trigger
// ============================================================================

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTriggerVariants> {
  /**
   * Custom icon to use instead of the default chevron
   */
  icon?: React.ReactNode;
  /**
   * Rotation angle for the custom icon when accordion is open
   * - 45: For Plus icon (+ rotates to ×)
   * - 90: For ChevronRight icon (> rotates to V)
   * - 180: Default rotation (V rotates to ^)
   * - "none": No rotation (for icons with their own animation like AnimatedChevron)
   * @default 180
   */
  iconRotation?: 45 | 90 | 180 | "none";
  /**
   * Whether to hide the chevron/icon completely
   * @default false
   */
  hideChevron?: boolean;
  /**
   * Animation preset for the default animated chevron
   * @default "smooth"
   */
  chevronAnimation?: ChevronAnimationPreset;
  /**
   * Size of the chevron icon
   * @default "md"
   */
  chevronSize?: "xs" | "sm" | "md" | "lg" | "xl";
}

/**
 * AccordionTrigger - Clickable header that toggles accordion content
 *
 * Features:
 * - Default: Uses AnimatedChevron with smooth pivot animation
 * - Custom icon: Rotates 180° when open (like standard shadcn behavior)
 * - Supports animation presets: smooth, bounce, sharp
 *
 * @example
 * ```tsx
 * // Default animated chevron
 * <AccordionTrigger>Section Title</AccordionTrigger>
 *
 * // With custom icon (rotates on open)
 * <AccordionTrigger icon={<PlusIcon />}>Section Title</AccordionTrigger>
 *
 * // With bounce animation
 * <AccordionTrigger chevronAnimation="bounce">Section Title</AccordionTrigger>
 * ```
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(
  (
    {
      className,
      children,
      size,
      icon,
      iconRotation = 180,
      hideChevron = false,
      chevronAnimation = "smooth",
      chevronSize = "md",
      ...props
    },
    ref
  ) => {
    // Determine rotation angle - use explicit prop or default to 180 for default chevron
    const rotation = icon ? iconRotation : 180;

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          data-slot="accordion-trigger"
          className={cn(
            accordionTriggerVariants({ size }),
            // Apply rotation to icon wrapper when open
            // "none" means the icon handles its own animation (like AnimatedChevron)
            rotation === 45 && "[&[data-state=open]>[data-slot=icon-wrapper]]:rotate-45",
            rotation === 90 && "[&[data-state=open]>[data-slot=icon-wrapper]]:rotate-90",
            rotation === 180 && "[&[data-state=open]>[data-slot=icon-wrapper]]:rotate-180",
            className
          )}
          {...props}
        >
          {children}
          {!hideChevron &&
            (icon ? (
              // Custom icon - uses rotation based on icon type
              <span
                data-slot="icon-wrapper"
                className={cn(
                  "shrink-0 text-muted-foreground",
                  "transition-transform duration-200",
                  "[&>svg]:size-4"
                )}
              >
                {icon}
              </span>
            ) : (
              // Default: Use ChevronDown icon with rotation (not AnimatedChevron for now)
              <span
                data-slot="icon-wrapper"
                className={cn(
                  "shrink-0 text-muted-foreground",
                  "transition-transform",
                  {
                    "duration-200": chevronAnimation === "smooth",
                    "duration-300": chevronAnimation === "bounce",
                    "duration-150": chevronAnimation === "sharp",
                  },
                  {
                    "[transition-timing-function:cubic-bezier(0,0,0,1)]": chevronAnimation === "smooth",
                    "[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]": chevronAnimation === "bounce",
                    "[transition-timing-function:cubic-bezier(0.4,0,0.2,1)]": chevronAnimation === "sharp",
                  }
                )}
              >
                <ChevronDown className={cn(chevronSizeVariants({ size: chevronSize }))} />
              </span>
            ))}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

// ============================================================================
// Accordion Content
// ============================================================================

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContentVariants> {}

/**
 * AccordionContent - Collapsible content area
 *
 * Uses existing tailwind accordion-up/accordion-down animations from config.
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, size, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    data-slot="accordion-content"
    className={cn(accordionContentVariants({ size }))}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

// ============================================================================
// Exports
// ============================================================================

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
  chevronSizeVariants,
};
