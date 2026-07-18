import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * ------------------------------------------------------------------------------------------------*/

export const toggleGroupVariants = cva(
  [
    "flex items-start rounded-md border border-border bg-background",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "h-6 text-xs",
        sm: "h-7 text-xs",
        md: "h-8 text-sm",
        lg: "h-9 text-sm",
      },
      variant: {
        default: "",
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export const toggleGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 px-3 font-medium",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "border-r border-border last:border-r-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        ].join(" "),
        outline: [
          "bg-transparent text-muted-foreground hover:bg-accent/50",
          "data-[state=on]:border-primary data-[state=on]:bg-accent/30 data-[state=on]:text-foreground",
        ].join(" "),
      },
      size: {
        xs: "text-xs px-2",
        sm: "text-xs px-2.5",
        md: "text-sm px-3",
        lg: "text-sm px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ToggleGroupProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
      "type"
    >,
    VariantProps<typeof toggleGroupVariants> {
  type: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  disabled?: boolean;
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * ToggleGroup - Segmented control for single or multi selection.
 *
 * Wraps `@radix-ui/react-toggle-group` with library styling and typed props.
 * Renders connected buttons with shared borders. Active items use
 * `bg-primary text-primary-foreground` for the `default` variant and a
 * bordered accent background for the `outline` variant.
 *
 * @example
 * ```tsx
 * <ToggleGroup type="single" defaultValue="1D" size="sm">
 *   <ToggleGroupItem value="1D">1D</ToggleGroupItem>
 *   <ToggleGroupItem value="1W">1W</ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */
export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(
  (
    {
      type,
      value,
      defaultValue,
      onValueChange,
      disabled,
      loop,
      variant,
      size,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const rootProps = {
      type,
      value,
      defaultValue,
      onValueChange,
      disabled,
      loop,
      ...props,
    } as unknown as React.ComponentPropsWithoutRef<
      typeof ToggleGroupPrimitive.Root
    >;

    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn(toggleGroupVariants({ variant, size }), className)}
        {...rootProps}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

/* -------------------------------------------------------------------------------------------------
 * ToggleGroupItem
 * ------------------------------------------------------------------------------------------------*/

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleGroupItemVariants> {
  value: string;
  disabled?: boolean;
  className?: string;
}

/**
 * ToggleGroupItem - A single item within a `ToggleGroup`.
 *
 * @example
 * ```tsx
 * <ToggleGroupItem value="1D">1D</ToggleGroupItem>
 * ```
 */
export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(
  ({ variant, size, className, children, ...props }, ref) => (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleGroupItemVariants({ variant, size: size ?? "md" }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
);
ToggleGroupItem.displayName = "ToggleGroupItem";