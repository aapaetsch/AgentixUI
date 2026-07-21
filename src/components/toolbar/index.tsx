import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";

/* -------------------------------------------------------------------------------------------------
 * Variants
 * ------------------------------------------------------------------------------------------------*/

export const toolbarVariants = cva(
  [
    "flex items-center gap-0.5 p-1 rounded-md border border-border bg-background",
    "transition-colors",
  ].join(" "),
  {
    variants: {},
    defaultVariants: {},
  }
);

export const toolbarButtonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 rounded",
    "text-muted-foreground",
    "hover:bg-accent hover:text-accent-foreground active:bg-accent/70",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      active: {
        true: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        false: "",
      },
      size: {
        sm: "size-10 text-xs",
        md: "size-11 text-sm",
        lg: "size-12 text-sm",
      },
    },
    compoundVariants: [
      // Active outline variant keeps the primary bg but borders subtly.
      { active: true, className: "" },
    ],
    defaultVariants: {
      active: false,
      size: "md",
    },
  }
);

/* -------------------------------------------------------------------------------------------------
 * Toolbar
 * ------------------------------------------------------------------------------------------------*/

export interface ToolbarProps
  extends React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root> {
  /** Optional accessible label. */
  "aria-label"?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Toolbar - Dense horizontal (or vertical) action strip for desktop data-heavy surfaces.
 *
 * Wraps `@radix-ui/react-toolbar` with kit styling. Handles roving tabindex and keyboard
 * navigation; `ToggleGroup`-style selections should be added via the `ToolbarToggleGroup`
 * sub-component which composes the Phase 1 `ToggleGroup` rather than re-implementing a
 * selection model.
 *
 * @example
 * ```tsx
 * <Toolbar>
 *   <ToolbarButton tooltip="Refresh"><RotateCw /></ToolbarButton>
 *   <ToolbarSeparator />
 *   <ToolbarLabel>View</ToolbarLabel>
 * </Toolbar>
 * ```
 */
export const Toolbar = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Root>,
  ToolbarProps
>(function Toolbar({ orientation = "horizontal", className, children, ...props }, ref) {
  return (
    <ToolbarPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn(
        toolbarVariants(),
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    >
      {children}
    </ToolbarPrimitive.Root>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ToolbarButton
 * ------------------------------------------------------------------------------------------------*/

export interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>,
    VariantProps<typeof toolbarButtonVariants> {
  /** Active/toggled visual state. */
  active?: boolean;
  /** Optional tooltip shown on hover. */
  tooltip?: string;
  /** Tooltip side. @default "bottom" */
  tooltipSide?: "top" | "bottom" | "left" | "right";
  className?: string;
  children?: React.ReactNode;
}

/**
 * ToolbarButton - Action button for a `Toolbar`.
 *
 * When `tooltip` is provided, wraps the button in the kit `Tooltip` so help text appears on hover.
 */
export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(function ToolbarButton(
  { active, size = "md", tooltip, tooltipSide = "bottom", className, children, "aria-label": ariaLabel, ...props },
  ref
) {
  const button = (
    <ToolbarPrimitive.Button
      ref={ref}
      aria-label={ariaLabel ?? tooltip}
      className={cn(toolbarButtonVariants({ active, size }), className)}
      {...(props as React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>)}
    >
      {children}
    </ToolbarPrimitive.Button>
  );

  if (!tooltip) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggle (toggleable button)
 * ------------------------------------------------------------------------------------------------*/

export interface ToolbarToggleProps
  extends React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>,
    VariantProps<typeof toolbarButtonVariants> {
  /** Whether the toggle is in the on (active) state. */
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** ToolbarToggle - a button with an explicit on/off active visual state. */
export const ToolbarToggle = React.forwardRef<
  HTMLButtonElement,
  ToolbarToggleProps
>(function ToolbarToggle({ active, size = "md", className, children, ...props }, ref) {
  return (
    <ToolbarPrimitive.Button
      ref={ref}
      className={cn(toolbarButtonVariants({ active, size }), className)}
      {...(props as React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>)}
    >
      {children}
    </ToolbarPrimitive.Button>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ToolbarToggleGroup — compose Phase 1 ToggleGroup
 * ------------------------------------------------------------------------------------------------*/

import { ToggleGroup, ToggleGroupItem, type ToggleGroupProps, type ToggleGroupItemProps } from "../toggle-group";

export interface ToolbarToggleGroupProps extends Omit<ToggleGroupProps, "className"> {
  className?: string;
}

/**
 * ToolbarToggleGroup - single/multi toggle group inside a toolbar.
 *
 * Composes the Phase 1 `ToggleGroup` rather than re-implementing a second selection model.
 * Pass `ToggleGroupItem`s as children exactly as you would for a standalone `ToggleGroup`.
 */
export function ToolbarToggleGroup({ className, children, ...props }: ToolbarToggleGroupProps) {
  return (
    <ToggleGroup className={cn("border-0 bg-transparent p-0", className)} {...props}>
      {children}
    </ToggleGroup>
  );
}

export { ToggleGroupItem as ToolbarToggleItem };
export type { ToggleGroupItemProps as ToolbarToggleItemProps };

/* -------------------------------------------------------------------------------------------------
 * ToolbarSeparator / ToolbarLabel
 * ------------------------------------------------------------------------------------------------*/

export interface ToolbarSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator> {
  className?: string;
}

/** Visual divider between toolbar sections. Direction-aware. */
export const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  ToolbarSeparatorProps
>(function ToolbarSeparator({ className, ...props }, ref) {
  return (
    <ToolbarPrimitive.Separator
      ref={ref}
      orientation="horizontal"
      className={cn(
        // horizontal toolbar → vertical separator; vertical toolbar → horizontal separator
        "bg-border shrink-0",
        "[data-orientation=horizontal] & w-px h-6",
        "[data-orientation=vertical] & h-px w-full",
        className
      )}
      {...props}
    />
  );
});

export interface ToolbarLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children?: React.ReactNode;
}

/** Labeled region within a toolbar (e.g., a small section title). */
export function ToolbarLabel({ className, children, ...props }: ToolbarLabelProps) {
  return (
    <span
      className={cn("px-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    >
      {children}
    </span>
  );
}
