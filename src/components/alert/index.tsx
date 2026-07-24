"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";

// ============================================================================
// Variants
// ============================================================================

/**
 * Alert variants using CVA
 * Implements semantic color variants and optional dismissible styling
 */
const alertVariants = cva(
  [
    // Base styles - using CSS grid for icon/content layout
    "relative w-full rounded-[var(--radius-md)] border px-4 py-3 text-sm",
    // Grid layout for icon + content
    "grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr]",
    "has-[>svg]:gap-x-3 gap-y-0.5 items-start",
    // Icon styling
    "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    // Transition for interactive feedback
    "transition-colors duration-[var(--motion-duration-short)]",
  ].join(" "),
  {
    variants: {
      /**
       * Semantic variant for different alert types
       */
      variant: {
        default: [
          "bg-card text-card-foreground border-border",
          "[&>svg]:text-foreground",
        ].join(" "),
        destructive: [
          "bg-destructive/10 text-destructive border-destructive/30",
          "[&>svg]:text-destructive",
          "*:data-[slot=alert-description]:text-destructive/90",
        ].join(" "),
        success: [
          "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
          "[&>svg]:text-green-600 dark:[&>svg]:text-green-400",
          "*:data-[slot=alert-description]:text-green-700/90 dark:*:data-[slot=alert-description]:text-green-400/90",
        ].join(" "),
        warning: [
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
          "[&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
          "*:data-[slot=alert-description]:text-amber-700/90 dark:*:data-[slot=alert-description]:text-amber-400/90",
        ].join(" "),
        info: [
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
          "[&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
          "*:data-[slot=alert-description]:text-blue-700/90 dark:*:data-[slot=alert-description]:text-blue-400/90",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Alert title variants
 */
const alertTitleVariants = cva(
  [
    "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
  ].join(" ")
);

/**
 * Alert description variants
 */
const alertDescriptionVariants = cva(
  [
    "col-start-2 grid justify-items-start gap-1 text-sm",
    "[&_p]:leading-relaxed",
  ].join(" ")
);

/**
 * Alert close button variants
 */
const alertCloseVariants = cva(
  [
    "absolute right-1 top-1 flex size-11 items-center justify-center",
    "rounded-[var(--radius-sm)] p-1",
    "opacity-70 transition-opacity",
    "hover:opacity-100 active:opacity-100",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "disabled:pointer-events-none",
  ].join(" ")
);

/**
 * Alert action variants
 */
const alertActionVariants = cva(
  [
    "col-start-2 mt-2 flex gap-2",
  ].join(" ")
);

// ============================================================================
// Types
// ============================================================================

export type AlertVariant = "default" | "destructive" | "success" | "warning" | "info";

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /**
   * Whether the alert can be dismissed
   * @default false
   */
  dismissible?: boolean;
  /**
   * Callback when the alert is dismissed
   */
  onDismiss?: () => void;
  /**
   * Custom icon to display (overrides variant default)
   */
  icon?: React.ReactNode;
  /**
   * Whether to show the default variant icon
   * @default true
   */
  showIcon?: boolean;
}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface AlertCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface AlertActionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// ============================================================================
// Default Icons Map
// ============================================================================

const variantIcons: Record<AlertVariant, LucideIcon> = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

// ============================================================================
// Components
// ============================================================================

/**
 * Alert - A non-modal notification element for displaying informational messages
 *
 * Unlike Toast components (which are temporary and appear in corners),
 * Alert is inline with content and persists until dismissed or removed.
 * Unlike Dialog (which is modal and blocks interaction),
 * Alert is non-interruptive and allows continued user interaction.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>
 *     You can add components and dependencies to your app using the CLI.
 *   </AlertDescription>
 * </Alert>
 *
 * // With variant
 * <Alert variant="destructive">
 *   <AlertCircle className="size-4" />
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>
 *     Your session has expired. Please log in again.
 *   </AlertDescription>
 * </Alert>
 *
 * // Dismissible
 * <Alert variant="success" dismissible onDismiss={() => console.log('dismissed')}>
 *   <CheckCircle2 className="size-4" />
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 * </Alert>
 * ```
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      dismissible = false,
      onDismiss,
      icon,
      showIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = React.useCallback(() => {
      setIsVisible(false);
      onDismiss?.();
    }, [onDismiss]);

    if (!isVisible) {
      return null;
    }

    // Get the default icon for the variant
    const DefaultIcon = variantIcons[variant ?? "default"];
    const iconElement = icon ?? (showIcon ? <DefaultIcon /> : null);

    return (
      <div
        ref={ref}
        role="alert"
        data-slot="alert"
        className={cn(
          alertVariants({ variant }),
          dismissible && "pr-10",
          className
        )}
        {...props}
      >
        {iconElement}
        {children}
        {dismissible && (
          <AlertClose onClick={handleDismiss} />
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

/**
 * AlertTitle - The title/heading of the alert
 */
const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn(alertTitleVariants(), className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

/**
 * AlertDescription - The detailed description of the alert
 */
const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(alertDescriptionVariants(), "text-muted-foreground", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";

/**
 * AlertClose - Close button for dismissing the alert
 */
const AlertClose = React.forwardRef<HTMLButtonElement, AlertCloseProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-slot="alert-close"
      className={cn(alertCloseVariants(), className)}
      aria-label="Dismiss alert"
      {...props}
    >
      <X className="size-4" />
    </button>
  )
);
AlertClose.displayName = "AlertClose";

/**
 * AlertAction - Container for action buttons within an alert
 */
const AlertAction = React.forwardRef<HTMLDivElement, AlertActionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-action"
      className={cn(alertActionVariants(), className)}
      {...props}
    />
  )
);
AlertAction.displayName = "AlertAction";

// ============================================================================
// Exports
// ============================================================================

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertClose,
  AlertAction,
  alertVariants,
  alertTitleVariants,
  alertDescriptionVariants,
  alertCloseVariants,
  alertActionVariants,
};
