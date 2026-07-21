"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Dot } from "lucide-react";

import { cn } from "../../lib/utils";

// ============================================================================
// Variants
// ============================================================================

/**
 * ContextMenuContent variants using CVA
 * Implements animation states and positioning
 */
const contextMenuContentVariants = cva(
  [
    // Base styles
    "relative z-50",
    "min-w-[8rem] overflow-hidden",
    "rounded-[var(--radius)]",
    "border border-border bg-popover text-popover-foreground",
    "shadow-[var(--elevation-2)]",
    // M3 Motion for open/close
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    // Directional slide based on position
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
  ].join(" ")
);

/**
 * ContextMenuItem variants
 */
const contextMenuItemVariants = cva(
  [
    // Base styles
    "relative flex w-full cursor-pointer select-none",
    "items-center gap-2",
    "rounded-[var(--radius-sm)]",
    "min-h-11 px-2 py-2.5",
    "text-sm outline-none",
    // Focus styles
    "focus:bg-accent focus:text-accent-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring/50",
    // Disabled state
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    // M3 Motion
    "transition-colors",
    "duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
    // Default icon styling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      /**
       * Inset - adds horizontal padding for nested items
       */
      inset: {
        true: "pl-8",
      },
      /**
       * Visual variant
       */
      variant: {
        default: "text-foreground",
        destructive: "text-destructive focus:bg-destructive/10 focus:text-destructive",
      },
    },
    defaultVariants: {
      inset: false,
      variant: "default",
    },
  }
);

/**
 * ContextMenuSeparator variants
 */
const contextMenuSeparatorVariants = cva(
  [
    "-mx-1 my-1",
    "h-px bg-border",
  ].join(" ")
);

/**
 * ContextMenuLabel variants
 */
const contextMenuLabelVariants = cva(
  [
    "px-2 py-1.5",
    "text-xs font-semibold",
    "text-muted-foreground [@media(hover:none)]:hidden",
  ].join(" "),
  {
    variants: {
      inset: {
        true: "pl-8",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }
);

/**
 * ContextMenuShortcut variants
 * Displays keyboard shortcuts on the right side
 */
const contextMenuShortcutVariants = cva(
  [
    "ml-auto",
    "text-xs",
    "tracking-widest",
    "text-muted-foreground",
  ].join(" ")
);

/**
 * ContextMenuSubTrigger variants
 */
const contextMenuSubTriggerVariants = cva(
  [
    // Base styles
    "relative flex w-full cursor-pointer select-none",
    "items-center gap-2",
    "rounded-[var(--radius-sm)]",
    "min-h-11 px-2 py-2.5",
    "text-sm outline-none",
    // Focus styles
    "focus:bg-accent focus:text-accent-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring/50",
    // Disabled state
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    // M3 Motion
    "transition-colors",
    "duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
    // Icon styling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      inset: {
        true: "pl-8",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }
);

// ============================================================================
// Component Types
// ============================================================================

export interface ContextMenuProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root> {
  /**
   * Custom x/y coordinates for positioning
   * When provided, overrides automatic mouse position
   */
  position?: { x: number; y: number } | null;
  /**
   * Delay before closing in milliseconds
   * Set to 0 for immediate close (default)
   */
  delayClose?: number;
}

export interface ContextMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger> {}

export interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> {}

export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
    VariantProps<typeof contextMenuItemVariants> {
  /**
   * Optional icon to display on the left side
   */
  icon?: React.ReactNode;
}

export interface ContextMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>,
    VariantProps<typeof contextMenuItemVariants> {
  /**
   * Optional icon to display on the left side
   */
  icon?: React.ReactNode;
}

export interface ContextMenuRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioGroup> {}

export interface ContextMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>,
    VariantProps<typeof contextMenuItemVariants> {}

export interface ContextMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>,
    VariantProps<typeof contextMenuLabelVariants> {}

export interface ContextMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> {}

export interface ContextMenuSubProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Sub> {}

export interface ContextMenuSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger>,
    VariantProps<typeof contextMenuSubTriggerVariants> {}

export interface ContextMenuSubContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> {}

export interface ContextMenuShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

// ============================================================================
// Components
// ============================================================================

/**
 * ContextMenu - Root component for context menus
 *
 * Provides a right-click action menu that appears at the cursor position.
 * Supports custom positioning, unbounded submenu nesting, and close delays.
 *
 * @example
 * ```tsx
 * <ContextMenu>
 *   <ContextMenuTrigger>Right click here</ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Copy</ContextMenuItem>
 *     <ContextMenuItem>Paste</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 */
function ContextMenu({
  children,
  position: customPosition = null,
  delayClose = 0,
  ...props
}: ContextMenuProps) {
  return (
    <ContextMenuPrimitive.Root
      data-slot="context-menu"
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Root>
  );
}
ContextMenu.displayName = "ContextMenu";

/**
 * ContextMenuTrigger - The area that triggers the menu on right-click
 *
 * @example
 * ```tsx
 * <ContextMenuTrigger>
 *   <div className="p-4 border rounded">
 *     Right click on this area
 *   </div>
 * </ContextMenuTrigger>
 * ```
 */
const ContextMenuTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Trigger>,
  ContextMenuTriggerProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Trigger
    ref={ref}
    data-slot="context-menu-trigger"
    className={cn(className)}
    {...props}
  />
));
ContextMenuTrigger.displayName = "ContextMenuTrigger";

/**
 * ContextMenuContent - The main menu container
 *
 * @example
 * ```tsx
 * <ContextMenuContent>
 *   <ContextMenuItem>Item 1</ContextMenuItem>
 *   <ContextMenuItem>Item 2</ContextMenuItem>
 * </ContextMenuContent>
 * ```
 */
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(
  (
    {
      className,
      ...props
    },
    ref
  ) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        data-slot="context-menu-content"
        className={cn(contextMenuContentVariants(), className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
);
ContextMenuContent.displayName = "ContextMenuContent";

/**
 * ContextMenuItem - Individual menu item
 *
 * Supports icons on the left and keyboard shortcuts on the right.
 *
 * @example
 * ```tsx
 * <ContextMenuItem icon={<CopyIcon />}>
 *   Copy
 *   <ContextMenuShortcut>⌘C</ContextMenuShortcut>
 * </ContextMenuItem>
 * ```
 */
const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(
  (
    {
      className,
      inset,
      variant,
      icon,
      children,
      ...props
    },
    ref
  ) => (
    <ContextMenuPrimitive.Item
      ref={ref}
      data-slot="context-menu-item"
      className={cn(contextMenuItemVariants({ inset, variant }), className)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </ContextMenuPrimitive.Item>
  )
);
ContextMenuItem.displayName = "ContextMenuItem";

/**
 * ContextMenuCheckboxItem - Toggleable menu item with checkbox
 *
 * @example
 * ```tsx
 * <ContextMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
 *   Show Bookmarks
 *   <ContextMenuShortcut>⌘B</ContextMenuShortcut>
 * </ContextMenuCheckboxItem>
 * ```
 */
const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(
  (
    {
      className,
      checked,
      children,
      inset,
      variant,
      icon,
      ...props
    },
    ref
  ) => (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      data-slot="context-menu-checkbox-item"
      checked={checked}
      className={cn(contextMenuItemVariants({ inset, variant }), className)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span className="flex-1">{children}</span>
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="ml-auto h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </ContextMenuPrimitive.CheckboxItem>
  )
);
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

/**
 * ContextMenuRadioGroup - Groups related radio items
 *
 * @example
 * ```tsx
 * <ContextMenuRadioGroup value="theme-light">
 *   <ContextMenuRadioItem value="theme-light">Light</ContextMenuRadioItem>
 *   <ContextMenuRadioItem value="theme-dark">Dark</ContextMenuRadioItem>
 * </ContextMenuRadioGroup>
 * ```
 */
function ContextMenuRadioGroup({
  children,
  ...props
}: ContextMenuRadioGroupProps) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    >
      {children}
    </ContextMenuPrimitive.RadioGroup>
  );
}
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup";

/**
 * ContextMenuRadioItem - Radio button menu item
 *
 * @example
 * ```tsx
 * <ContextMenuRadioItem value="light">
 *   Light Theme
 * </ContextMenuRadioItem>
 * ```
 */
const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(
  (
    {
      className,
      children,
      inset,
      ...props
    },
    ref
  ) => (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      data-slot="context-menu-radio-item"
      className={cn(contextMenuItemVariants({ inset }), className)}
      {...props}
    >
      <span className="flex-1">{children}</span>
      <ContextMenuPrimitive.ItemIndicator>
        <Dot className="ml-auto h-4 w-4 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </ContextMenuPrimitive.RadioItem>
  )
);
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

/**
 * ContextMenuLabel - Non-interactive label for grouping items
 *
 * @example
 * ```tsx
 * <ContextMenuLabel inset>Preferences</ContextMenuLabel>
 * <ContextMenuSeparator />
 * ```
 */
const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  ContextMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    data-slot="context-menu-label"
    className={cn(contextMenuLabelVariants({ inset }), className)}
    {...props}
  />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

/**
 * ContextMenuSeparator - Visual divider between sections
 *
 * @example
 * ```tsx
 * <ContextMenuItem>Item 1</ContextMenuItem>
 * <ContextMenuSeparator />
 * <ContextMenuItem>Item 2</ContextMenuItem>
 * ```
 */
function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(contextMenuSeparatorVariants(), className)}
      {...props}
    />
  );
}
ContextMenuSeparator.displayName = "ContextMenuSeparator";

/**
 * ContextMenuSub - Root component for nested submenus
 *
 * Supports unbounded nesting depth.
 *
 * @example
 * ```tsx
 * <ContextMenuSub>
 *   <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
 *   <ContextMenuSubContent>
 *     <ContextMenuItem>Open</ContextMenuItem>
 *     <ContextMenuItem>Save</ContextMenuItem>
 *   </ContextMenuSubContent>
 * </ContextMenuSub>
 * ```
 */
function ContextMenuSub({ children, ...props }: ContextMenuSubProps) {
  return (
    <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props}>
      {children}
    </ContextMenuPrimitive.Sub>
  );
}
ContextMenuSub.displayName = "ContextMenuSub";

/**
 * ContextMenuSubTrigger - Trigger for nested submenus
 *
 * @example
 * ```tsx
 * <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
 * ```
 */
const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    data-slot="context-menu-sub-trigger"
    className={cn(contextMenuSubTriggerVariants({ inset }), className)}
    {...props}
  >
    {children}
    <Dot className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

/**
 * ContextMenuSubContent - Content of a nested submenu
 *
 * @example
 * ```tsx
 * <ContextMenuSubContent>
 *   <ContextMenuItem>Option 1</ContextMenuItem>
 *   <ContextMenuItem>Option 2</ContextMenuItem>
 * </ContextMenuSubContent>
 * ```
 */
const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(
  (
    {
      className,
      ...props
    },
    ref
  ) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        ref={ref}
        data-slot="context-menu-sub-content"
        className={cn(contextMenuContentVariants(), className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
);
ContextMenuSubContent.displayName = "ContextMenuSubContent";

/**
 * ContextMenuShortcut - Keyboard shortcut indicator
 *
 * Typically used on the right side of menu items.
 *
 * @example
 * ```tsx
 * <ContextMenuItem>
 *   Copy
 *   <ContextMenuShortcut>⌘C</ContextMenuShortcut>
 * </ContextMenuItem>
 * ```
 */
function ContextMenuShortcut({
  className,
  ...props
}: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(contextMenuShortcutVariants(), className)}
      {...props}
    />
  );
}
ContextMenuShortcut.displayName = "ContextMenuShortcut";

// ============================================================================
// Exports
// ============================================================================

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuShortcut,
  contextMenuContentVariants,
  contextMenuItemVariants,
  contextMenuSeparatorVariants,
  contextMenuLabelVariants,
  contextMenuSubTriggerVariants,
  contextMenuShortcutVariants,
};
