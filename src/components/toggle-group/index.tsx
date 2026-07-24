import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * ------------------------------------------------------------------------------------------------*/

export const toggleGroupVariants = cva(
  [
    "group/toggle flex items-stretch rounded-md border border-border bg-background",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      // No `min-h-*` here: height is driven by item vertical padding so the
      // bar hugs its content. `items-stretch` keeps all items equal height,
      // and the container grows naturally when an item wraps to two lines.
      size: {
        xs: "text-xs",
        sm: "text-xs",
        md: "text-sm",
        lg: "text-sm",
      },
      variant: {
        default: "",
        outline: "bg-transparent",
      },
      // `lines` advertises the expected maximum number of wrapped text lines
      // so items can opt into wrapping typography via the `group/toggle`
      // named group. It does NOT reserve extra vertical space — the container
      // grows naturally to fit the tallest item's content, and `items-stretch`
      // keeps all items uniformly tall. This avoids whitespace under
      // single-line toggles when `lines={2}` is set but content fits on one line.
      lines: {
        1: "",
        2: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      lines: 1,
    },
  }
);

export const toggleGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 font-medium",
    "flex-1 text-center leading-tight whitespace-nowrap",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "border-r border-border last:border-r-0",
    // When the parent ToggleGroup opts into two-line wrapping, switch to
    // `pre-line` so explicit newlines (`iron\ncondor`) and natural wraps both
    // render on a second row. Height is driven by content, not a forced min-h.
    "group-data-[lines=2]/toggle:whitespace-pre-line",
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
      // Vertical padding sets the item height (content-driven). The group
      // container hugs the tallest item via `items-stretch`, so there is no
      // extra whitespace inside the bar.
      size: {
        xs: "text-xs px-2 py-1",
        sm: "text-xs px-2.5 py-1.5",
        md: "text-sm px-3 py-2",
        lg: "text-sm px-4 py-2.5",
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
  /**
   * Expected maximum number of stacked text lines per item. When set to `2`,
   * items enable text wrapping (e.g. "iron" / "condor") and the group grows
   * to fit the wrapped content. Defaults to `1`.
   */
  lines?: 1 | 2;
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
      lines,
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
        // `data-lines` is read by the item variant via `group-data-[lines=2]`
        // so items opt into wrapping typography only when the group expects it.
        data-lines={lines ?? 1}
        className={cn(toggleGroupVariants({ variant, size, lines }), className)}
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