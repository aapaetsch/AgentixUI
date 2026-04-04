"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { AnimatedChevron, type ChevronAnimationPreset } from "../animated-chevron";

/**
 * SelectTrigger variants using CVA
 * Size variants match Button component (xs, sm, md, lg, xl) using rem units
 */
const selectTriggerVariants = cva(
  [
    // Base styles
    "flex items-center justify-between gap-2",
    "w-full whitespace-nowrap rounded-[var(--radius)]",
    "border-2 border-border bg-transparent",
    "text-foreground data-[placeholder]:text-muted-foreground",
    "select-none cursor-pointer",
    // Focus styles - only border color change, no ring
    "outline-none",
    "focus-visible:border-ring",
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // Invalid state
    "aria-invalid:border-destructive",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Hover
    "hover:bg-accent hover:border-accent-foreground/20",
    // Icon styling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // Value text styling
    "[&>span]:line-clamp-1 [&>span]:text-left",
  ].join(" "),
  {
    variants: {
      /**
       * Size variants - reduced heights compared to MD3
       * xs: 1.5rem (24px), sm: 1.75rem (28px), md: 2rem (32px), lg: 2.25rem (36px), xl: 2.75rem (44px)
       */
      size: {
        xs: "h-[1.5rem] px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-[1.75rem] px-3 text-sm [&_svg]:size-4",
        md: "h-[2rem] px-3 text-sm [&_svg]:size-4",
        lg: "h-[2.25rem] px-4 text-base [&_svg]:size-5",
        xl: "h-[2.75rem] px-5 text-lg [&_svg]:size-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * SelectContent variants for the dropdown panel
 */
const selectContentVariants = cva(
  [
    // Base styles
    "relative z-50 overflow-hidden",
    "min-w-[8rem] rounded-[var(--radius)]",
    "border border-border bg-popover text-popover-foreground",
    "shadow-[var(--elevation-2)]",
    // M3 Motion for open/close
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ].join(" "),
  {
    variants: {
      position: {
        popper: [
          "data-[side=bottom]:translate-y-1",
          "data-[side=left]:-translate-x-1",
          "data-[side=right]:translate-x-1",
          "data-[side=top]:-translate-y-1",
        ].join(" "),
        "item-aligned": "",
      },
    },
    defaultVariants: {
      position: "popper",
    },
  }
);

/**
 * SelectItem variants
 */
const selectItemVariants = cva(
  [
    // Base styles
    "relative flex w-full cursor-pointer select-none items-center gap-2",
    "rounded-[var(--radius-sm)] py-1.5 pl-2 pr-8",
    "text-sm outline-none",
    // Focus styles
    "focus:bg-accent focus:text-accent-foreground",
    // Disabled state
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    // M3 Motion
    "transition-colors",
    "duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
    // SVG icon styling
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" ")
);

/**
 * SelectLabel variants for group labels
 */
const selectLabelVariants = cva(
  "px-2 py-1.5 text-xs font-semibold text-muted-foreground"
);

/**
 * SelectSeparator variants
 */
const selectSeparatorVariants = cva("-mx-1 my-1 h-px bg-border");

// ============================================================================
// Component Types
// ============================================================================

export interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {}

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  /**
   * Custom icon component to show in the trigger (defaults to ChevronDown)
   * Ignored when useAnimatedChevron is true
   */
  icon?: LucideIcon;
  /**
   * Whether to hide the dropdown icon
   * @default false
   */
  hideIcon?: boolean;
  /**
   * Use the AnimatedChevron component instead of a rotating icon
   * Provides a morphing animation effect
   * @default false
   */
  useAnimatedChevron?: boolean;
  /**
   * Animation preset for the AnimatedChevron
   * Only used when useAnimatedChevron is true
   * @default "smooth"
   */
  chevronAnimation?: ChevronAnimationPreset;
}

export interface SelectValueProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value> {}

export interface SelectContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, "position">,
    VariantProps<typeof selectContentVariants> {
  /**
   * The positioning mode of the select content.
   * - "popper": Uses Radix Popper for positioning relative to the trigger
   * - "item-aligned": Aligns the selected item with the trigger
   * @default "popper"
   */
  position?: "popper" | "item-aligned";
}

export interface SelectGroupProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group> {}

export interface SelectLabelProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {}

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {}

export interface SelectSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {}

export interface SelectScrollUpButtonProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> {}

export interface SelectScrollDownButtonProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> {}

// ============================================================================
// Context for tracking select open state (for AnimatedChevron)
// ============================================================================

interface SelectContextValue {
  open: boolean;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  return React.useContext(SelectContext);
}

// ============================================================================
// Components
// ============================================================================

/**
 * Select - Root component that wraps the select functionality
 *
 * @example
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
function Select({ open: controlledOpen, onOpenChange, ...props }: SelectProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SelectContext.Provider value={{ open }}>
      <SelectPrimitive.Root
        data-slot="select"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </SelectContext.Provider>
  );
}

/**
 * SelectGroup - Groups related items together
 */
function SelectGroup({ ...props }: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

/**
 * SelectValue - Displays the selected value or placeholder
 */
function SelectValue({ ...props }: SelectValueProps) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

/**
 * SelectTrigger - The button that opens the select dropdown
 *
 * @example
 * ```tsx
 * // Default with ChevronDown
 * <SelectTrigger size="md">
 *   <SelectValue placeholder="Select..." />
 * </SelectTrigger>
 *
 * // With custom icon
 * <SelectTrigger icon={ChevronsUpDown}>
 *   <SelectValue placeholder="Select..." />
 * </SelectTrigger>
 *
 * // Without icon
 * <SelectTrigger hideIcon>
 *   <SelectValue placeholder="Select..." />
 * </SelectTrigger>
 * ```
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      size,
      icon: Icon = ChevronDown,
      hideIcon = false,
      useAnimatedChevron = false,
      chevronAnimation = "smooth",
      ...props
    },
    ref
  ) => {
    const context = useSelectContext();
    const isOpen = context?.open ?? false;

    // Map select size to chevron size
    const chevronSizeMap: Record<string, "xs" | "sm" | "md" | "lg" | "xl"> = {
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "lg",
      xl: "xl",
    };
    const chevronSize = chevronSizeMap[size || "md"];

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        data-slot="select-trigger"
        className={cn(selectTriggerVariants({ size }), className)}
        {...props}
      >
        {children}
        {!hideIcon && (
          <SelectPrimitive.Icon asChild>
            {useAnimatedChevron ? (
              <AnimatedChevron
                open={isOpen}
                size={chevronSize}
                animation={chevronAnimation}
                className="opacity-50"
              />
            ) : (
              <Icon
                className={cn(
                  "shrink-0 opacity-50",
                  "transition-transform duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
                  // Rotate on open
                  "[[data-state=open]_&]:rotate-180"
                )}
              />
            )}
          </SelectPrimitive.Icon>
        )}
      </SelectPrimitive.Trigger>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

/**
 * SelectScrollUpButton - Scroll indicator for the top of the list
 */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  SelectScrollUpButtonProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

/**
 * SelectScrollDownButton - Scroll indicator for the bottom of the list
 */
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  SelectScrollDownButtonProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

/**
 * SelectContent - The dropdown panel containing the options
 *
 * @example
 * ```tsx
 * <SelectContent position="popper" side="bottom" align="start">
 *   <SelectItem value="1">Item 1</SelectItem>
 * </SelectContent>
 * ```
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      className,
      children,
      position = "popper",
      side = "bottom",
      sideOffset = 4,
      align = "start",
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        data-slot="select-content"
        position={position}
        side={side}
        sideOffset={sideOffset}
        align={align}
        className={cn(selectContentVariants({ position }), className)}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "max-h-[min(var(--radix-select-content-available-height),20rem)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = "SelectContent";

/**
 * SelectLabel - A label for a group of items
 *
 * @example
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Fruits</SelectLabel>
 *   <SelectItem value="apple">Apple</SelectItem>
 * </SelectGroup>
 * ```
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn(selectLabelVariants(), className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

/**
 * SelectItem - An individual selectable option
 *
 * @example
 * ```tsx
 * <SelectItem value="apple">Apple</SelectItem>
 * <SelectItem value="banana" disabled>Banana (Out of stock)</SelectItem>
 * ```
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(selectItemVariants(), className)}
    {...props}
  >
    <span className="absolute right-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText asChild>
      <span className="inline-flex items-center gap-2">{children}</span>
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

/**
 * SelectSeparator - A visual separator between items or groups
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn(selectSeparatorVariants(), className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  selectTriggerVariants,
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectSeparatorVariants,
};
