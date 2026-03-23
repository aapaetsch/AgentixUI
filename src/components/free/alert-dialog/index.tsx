"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";
import { buttonVariants } from "../button";

// ============================================================================
// Variants
// ============================================================================

/**
 * AlertDialog overlay variants
 * Implements backdrop with blur and animations
 */
const alertDialogOverlayVariants = cva(
  [
    "fixed inset-0 z-50",
    "bg-black/50 backdrop-blur-sm",
    // M3 Motion for open/close
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ].join(" ")
);

/**
 * AlertDialog content variants
 * Implements size variants and animations
 */
const alertDialogContentVariants = cva(
  [
    // Base styles
    "fixed z-50",
    "grid w-full gap-4",
    "border border-border bg-background",
    "shadow-[var(--elevation-5)]",
    "outline-none",
    // Positioning
    "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    // Sizing
    "max-w-[calc(100%-2rem)] sm:max-w-lg",
    "rounded-[var(--radius-lg)] p-6",
    // M3 Motion for open/close
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "duration-[var(--motion-duration-medium)]",
  ].join(" ")
);

/**
 * AlertDialog header variants
 */
const alertDialogHeaderVariants = cva(
  [
    "flex flex-col gap-2",
    "text-center sm:text-left",
  ].join(" ")
);

/**
 * AlertDialog footer variants
 */
const alertDialogFooterVariants = cva(
  [
    "flex flex-col-reverse gap-2",
    "sm:flex-row sm:justify-end",
  ].join(" ")
);

/**
 * AlertDialog title variants
 */
const alertDialogTitleVariants = cva(
  [
    "text-lg font-semibold",
  ].join(" ")
);

/**
 * AlertDialog description variants
 */
const alertDialogDescriptionVariants = cva(
  [
    "text-sm text-muted-foreground",
  ].join(" ")
);

// ============================================================================
// Types
// ============================================================================

export interface AlertDialogProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root> {}

export interface AlertDialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger> {}

export interface AlertDialogPortalProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal> {}

export interface AlertDialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> {}

export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {}

export interface AlertDialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface AlertDialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface AlertDialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> {}

export interface AlertDialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> {}

export interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  /**
   * The visual color style of the action button
   * @default "filled"
   */
  colorStyle?: "filled" | "tonal" | "elevated" | "outlined" | "text" | "destructive" | "ghost" | "link";
}

export interface AlertDialogCancelProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> {}

// ============================================================================
// Components
// ============================================================================

/**
 * AlertDialog - A modal dialog that interrupts users with critical content requiring a response
 *
 * Unlike regular Dialog (which is for general-purpose modals),
 * AlertDialog is specifically designed for critical confirmations that require
 * an explicit user response before proceeding.
 *
 * Unlike Toast (which is temporary and non-blocking),
 * AlertDialog blocks all interaction until the user responds.
 *
 * Unlike Alert (which is inline and informational),
 * AlertDialog is modal and demands immediate attention.
 *
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="destructive">Delete Account</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 *       <AlertDialogDescription>
 *         This action cannot be undone. This will permanently delete your
 *         account and remove your data from our servers.
 *       </AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction>Continue</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
function AlertDialog({ ...props }: AlertDialogProps) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

/**
 * AlertDialogTrigger - Element that opens the alert dialog
 */
const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  AlertDialogTriggerProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Trigger
    ref={ref}
    data-slot="alert-dialog-trigger"
    className={cn(className)}
    {...props}
  />
));
AlertDialogTrigger.displayName = "AlertDialogTrigger";

/**
 * AlertDialogPortal - Renders alert dialog in a React portal
 */
function AlertDialogPortal({ ...props }: AlertDialogPortalProps) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

/**
 * AlertDialogOverlay - Backdrop overlay behind the alert dialog
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  AlertDialogOverlayProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    data-slot="alert-dialog-overlay"
    className={cn(alertDialogOverlayVariants(), className)}
    {...props}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

/**
 * AlertDialogContent - The main alert dialog container
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      data-slot="alert-dialog-content"
      className={cn(alertDialogContentVariants(), className)}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = "AlertDialogContent";

/**
 * AlertDialogHeader - Container for alert dialog title and description
 */
function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(alertDialogHeaderVariants(), className)}
      {...props}
    />
  );
}

/**
 * AlertDialogFooter - Container for alert dialog actions
 */
function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(alertDialogFooterVariants(), className)}
      {...props}
    />
  );
}

/**
 * AlertDialogTitle - The alert dialog heading
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn(alertDialogTitleVariants(), className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

/**
 * AlertDialogDescription - Descriptive text below the title
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn(alertDialogDescriptionVariants(), className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

/**
 * AlertDialogAction - Primary action button that confirms the action
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, colorStyle = "filled", ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    data-slot="alert-dialog-action"
    className={cn(buttonVariants({ colorStyle }), className)}
    {...props}
  />
));
AlertDialogAction.displayName = "AlertDialogAction";

/**
 * AlertDialogCancel - Secondary action button that cancels/dismisses
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    data-slot="alert-dialog-cancel"
    className={cn(buttonVariants({ colorStyle: "outlined" }), className)}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

// ============================================================================
// Exports
// ============================================================================

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  alertDialogOverlayVariants,
  alertDialogContentVariants,
  alertDialogHeaderVariants,
  alertDialogFooterVariants,
  alertDialogTitleVariants,
  alertDialogDescriptionVariants,
};
