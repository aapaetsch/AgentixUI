"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  type LucideIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../button";

// ============================================================================
// Toast Store - Event Emitter for Imperative API
// ============================================================================

/**
 * Toast position options
 * MD3 recommends bottom placement for mobile, flexible for desktop
 */
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Toast variant types following MD3 snackbar patterns
 */
export type ToastVariant =
  | "default"
  | "success"
  | "warning"
  | "destructive"
  | "info";

/**
 * Toast type - controls interaction model
 * - "toast": Interactive with up to 2 action buttons
 * - "snackbar": Information-only, no action buttons
 */
export type ToastType = "toast" | "snackbar";

/**
 * Action button configuration for toasts
 */
export interface ToastActionConfig {
  /** Button label text */
  label: string;
  /** Click handler - return false to prevent toast from closing */
  onClick: (event: React.MouseEvent) => void | boolean;
  /** Optional alt text for accessibility */
  altText?: string;
  /** Button color style variant (default: "tonal") */
  colorStyle?: "filled" | "tonal" | "outlined" | "text" | "destructive";
}

/**
 * Options for creating a toast notification
 */
export interface ToastOptions {
  /** Unique identifier (auto-generated if not provided) */
  id?: string;
  /** Toast title - brief, descriptive text */
  title?: React.ReactNode;
  /** Toast description - additional context */
  description?: React.ReactNode;
  /** Visual variant */
  variant?: ToastVariant;
  /** Toast type - "toast" (interactive with buttons) or "snackbar" (info-only) */
  type?: ToastType;
  /** Auto-dismiss duration in ms (default: 5000, use Infinity for persistent) */
  duration?: number;
  /** Action button configuration (only for type="toast", max 2 actions) */
  action?: ToastActionConfig;
  /** Secondary action button (only for type="toast") */
  secondaryAction?: ToastActionConfig;
  /** Custom icon to display (overrides variant default) */
  icon?: React.ReactNode;
  /** Show close button */
  dismissible?: boolean;
  /** Avatar element to display */
  avatar?: React.ReactNode;
  /** Callback when toast is dismissed */
  onDismiss?: (id: string) => void;
  /** Callback when toast auto-closes */
  onAutoClose?: (id: string) => void;
  /** Additional className for the toast */
  className?: string;
}

/**
 * Internal toast state with required id
 */
export interface ToastState extends Required<Pick<ToastOptions, "id">> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant: ToastVariant;
  type: ToastType;
  duration: number;
  action?: ToastActionConfig;
  secondaryAction?: ToastActionConfig;
  icon?: React.ReactNode;
  dismissible: boolean;
  avatar?: React.ReactNode;
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
  className?: string;
  open: boolean;
  createdAt: number;
}

type ToastStoreListener = (toasts: ToastState[]) => void;

/**
 * Toast Store - Singleton store for managing toast state
 *
 * This store uses an event emitter pattern to allow the imperative `toast()`
 * function to work outside of React components. The ToastProvider subscribes
 * to this store and renders the toasts.
 *
 * @example
 * ```tsx
 * // In a non-React file (e.g., API utility)
 * import { toast } from '@agentix/ui';
 *
 * async function fetchData() {
 *   try {
 *     const data = await api.getData();
 *     toast.success({ title: 'Data loaded!' });
 *     return data;
 *   } catch (error) {
 *     toast.error({ title: 'Failed to load data' });
 *     throw error;
 *   }
 * }
 * ```
 *
 * **Important:** The `toast()` function requires a `ToastProvider` to be
 * mounted somewhere in your React tree. For usage within React components,
 * prefer using the `useToast()` hook instead.
 */
class ToastStore {
  private toasts: ToastState[] = [];
  private listeners: Set<ToastStoreListener> = new Set();
  private idCounter = 0;

  private generateId(): string {
    return `toast-${Date.now()}-${++this.idCounter}`;
  }

  subscribe(listener: ToastStoreListener): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.toasts);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  getToasts(): ToastState[] {
    return [...this.toasts];
  }

  add(options: ToastOptions): string {
    const id = options.id ?? this.generateId();

    // Check if toast with this ID already exists
    const existingIndex = this.toasts.findIndex((t) => t.id === id);
    if (existingIndex !== -1) {
      // Update existing toast
      this.toasts[existingIndex] = {
        ...this.toasts[existingIndex],
        ...options,
        id,
        open: true,
        createdAt: Date.now(),
      };
    } else {
      // Add new toast
      const toastType = options.type ?? "toast";
      const newToast: ToastState = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "default",
        type: toastType,
        duration: options.duration ?? 5000,
        action: toastType === "toast" ? options.action : undefined,
        secondaryAction: toastType === "toast" ? options.secondaryAction : undefined,
        icon: options.icon,
        dismissible: options.dismissible ?? true,
        avatar: options.avatar,
        onDismiss: options.onDismiss,
        onAutoClose: options.onAutoClose,
        className: options.className,
        open: true,
        createdAt: Date.now(),
      };

      this.toasts.push(newToast);
    }

    this.notify();
    return id;
  }

  update(id: string, options: Partial<ToastOptions>): void {
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.toasts[index] = {
        ...this.toasts[index],
        ...options,
      };
      this.notify();
    }
  }

  dismiss(id: string): void {
    const toastItem = this.toasts.find((t) => t.id === id);
    if (toastItem) {
      toastItem.open = false;
      toastItem.onDismiss?.(id);
      this.notify();

      // Remove from array after animation
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
      }, 200);
    }
  }

  dismissAll(): void {
    this.toasts.forEach((toastItem) => {
      toastItem.open = false;
      toastItem.onDismiss?.(toastItem.id);
    });
    this.notify();

    setTimeout(() => {
      this.toasts = [];
      this.notify();
    }, 200);
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }
}

// Default singleton instance for imperative API
const defaultToastStore = new ToastStore();

// ============================================================================
// Toast Context for scoped stores
// ============================================================================

const ToastContext = React.createContext<ToastStore | null>(null);

// ============================================================================
// Imperative Toast API
// ============================================================================

/**
 * Default icons for each variant
 */
const variantIcons: Record<ToastVariant, LucideIcon> = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
  info: Info,
};

/**
 * Create a toast notification imperatively
 *
 * **Important:** This function requires a `ToastProvider` to be mounted
 * somewhere in your React tree. For usage within React components,
 * prefer using the `useToast()` hook instead.
 *
 * @param options - Toast configuration options
 * @returns Toast ID for programmatic control
 *
 * @example
 * ```tsx
 * // Basic usage
 * toast({ title: 'Hello!' });
 *
 * // With variant
 * toast({ title: 'Saved!', variant: 'success' });
 *
 * // With action
 * toast({
 *   title: 'Item deleted',
 *   action: { label: 'Undo', onClick: () => restoreItem() }
 * });
 * ```
 */
function createToast(options: ToastOptions | string): string {
  if (typeof options === "string") {
    return defaultToastStore.add({ title: options });
  }
  return defaultToastStore.add(options);
}

/**
 * Imperative toast API
 *
 * **Important:** Requires `ToastProvider` to be mounted in your React tree.
 * For usage within React components, prefer `useToast()` hook.
 *
 * @example
 * ```tsx
 * // Outside React
 * toast('Hello!');
 * toast.success({ title: 'Done!' });
 *
 * // Dismiss
 * const id = toast('Loading...');
 * toast.dismiss(id);
 * ```
 */
export const toast = Object.assign(createToast, {
  /**
   * Show a success toast
   */
  success: (options: Omit<ToastOptions, "variant"> | string): string => {
    if (typeof options === "string") {
      return defaultToastStore.add({ title: options, variant: "success" });
    }
    return defaultToastStore.add({ ...options, variant: "success" });
  },

  /**
   * Show a warning toast
   */
  warning: (options: Omit<ToastOptions, "variant"> | string): string => {
    if (typeof options === "string") {
      return defaultToastStore.add({ title: options, variant: "warning" });
    }
    return defaultToastStore.add({ ...options, variant: "warning" });
  },

  /**
   * Show an error/destructive toast
   */
  error: (options: Omit<ToastOptions, "variant"> | string): string => {
    if (typeof options === "string") {
      return defaultToastStore.add({ title: options, variant: "destructive" });
    }
    return defaultToastStore.add({ ...options, variant: "destructive" });
  },

  /**
   * Show an info toast
   */
  info: (options: Omit<ToastOptions, "variant"> | string): string => {
    if (typeof options === "string") {
      return defaultToastStore.add({ title: options, variant: "info" });
    }
    return defaultToastStore.add({ ...options, variant: "info" });
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (id: string): void => {
    defaultToastStore.dismiss(id);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: (): void => {
    defaultToastStore.dismissAll();
  },

  /**
   * Update an existing toast
   */
  update: (id: string, options: Partial<ToastOptions>): void => {
    defaultToastStore.update(id, options);
  },
});

// ============================================================================
// useToast Hook
// ============================================================================

export interface UseToastReturn {
  /** Show a toast notification */
  toast: typeof toast;
  /** Current toasts (for custom rendering) */
  toasts: ToastState[];
  /** Dismiss a specific toast */
  dismiss: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
}

/**
 * React hook for toast notifications
 *
 * Prefer this hook over the imperative `toast()` function when inside
 * React components for better integration with React's lifecycle.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { toast } = useToast();
 *
 *   const handleSave = () => {
 *     // ... save logic
 *     toast.success({ title: 'Saved successfully!' });
 *   };
 *
 *   return <Button onClick={handleSave}>Save</Button>;
 * }
 * ```
 */
export function useToast(): UseToastReturn {
  const contextStore = React.useContext(ToastContext);
  const store = contextStore ?? defaultToastStore;
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  React.useEffect(() => {
    return store.subscribe(setToasts);
  }, [store]);

  // Create context-aware toast API
  const contextAwareToast = React.useMemo(() => {
    const createToastFn = (options: ToastOptions | string): string => {
      if (typeof options === "string") {
        return store.add({ title: options });
      }
      return store.add(options);
    };

    return Object.assign(createToastFn, {
      success: (options: Omit<ToastOptions, "variant"> | string): string => {
        if (typeof options === "string") {
          return store.add({ title: options, variant: "success" });
        }
        return store.add({ ...options, variant: "success" });
      },
      warning: (options: Omit<ToastOptions, "variant"> | string): string => {
        if (typeof options === "string") {
          return store.add({ title: options, variant: "warning" });
        }
        return store.add({ ...options, variant: "warning" });
      },
      error: (options: Omit<ToastOptions, "variant"> | string): string => {
        if (typeof options === "string") {
          return store.add({ title: options, variant: "destructive" });
        }
        return store.add({ ...options, variant: "destructive" });
      },
      info: (options: Omit<ToastOptions, "variant"> | string): string => {
        if (typeof options === "string") {
          return store.add({ title: options, variant: "info" });
        }
        return store.add({ ...options, variant: "info" });
      },
      dismiss: (id: string): void => store.dismiss(id),
      dismissAll: (): void => store.dismissAll(),
      update: (id: string, options: Partial<ToastOptions>): void => store.update(id, options),
    });
  }, [store]);

  return {
    toast: contextAwareToast,
    toasts,
    dismiss: contextAwareToast.dismiss,
    dismissAll: contextAwareToast.dismissAll,
  };
}

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * Toast container variants following MD3 snackbar specs
 * - Height: 48px min (single line), 68px (two lines)
 * - Padding: 16px horizontal, 14px vertical
 * - Max width: 568px (desktop), full width with margins (mobile)
 */
const toastVariants = cva(
  [
    // Base styles
    "group pointer-events-auto relative flex w-full items-center gap-3",
    "overflow-hidden rounded-[var(--radius-md)]",
    "p-4 pr-8",
    // Elevation
    "shadow-[var(--elevation-3)]",
    // Swipe support
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=move]:transition-none",
    "data-[swipe=end]:animate-out",
    // Animation
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-80",
    // M3 Motion
    "duration-200 ease-[var(--motion-easing-standard)]",
    // Focus styles
    "outline-none",
    // Transition for hover effects
    "transition-shadow",
    "hover:shadow-[var(--elevation-4)]",
  ].join(" "),
  {
    variants: {
      /**
       * Visual variant following MD3 color system
       * Uses inverse surface colors for better visibility
       */
      variant: {
        default: [
          "bg-foreground text-background",
          "border border-foreground/10",
        ].join(" "),
        success: [
          "bg-green-600 text-white dark:bg-green-500",
          "border border-green-500/20",
        ].join(" "),
        warning: [
          "bg-amber-500 text-black dark:bg-amber-400",
          "border border-amber-400/20",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground",
          "border border-destructive/20",
        ].join(" "),
        info: [
          "bg-blue-600 text-white dark:bg-blue-500",
          "border border-blue-500/20",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Toast viewport variants for positioning
 */
const toastViewportVariants = cva(
  [
    "fixed z-[100] flex flex-col gap-2 p-4",
    "max-h-screen w-full",
    "md:max-w-[420px]",
    // Pointer events only on children
    "pointer-events-none",
    "[&>*]:pointer-events-auto",
  ].join(" "),
  {
    variants: {
      position: {
        "top-left": "top-0 left-0",
        "top-center": "top-0 left-1/2 -translate-x-1/2",
        "top-right": "top-0 right-0",
        "bottom-left": "bottom-0 left-0",
        "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
        "bottom-right": "bottom-0 right-0",
      },
    },
    defaultVariants: {
      position: "bottom-right",
    },
  }
);

/**
 * Animation variants based on position
 */
const getAnimationClasses = (position: ToastPosition): string => {
  const animations: Record<ToastPosition, string> = {
    "top-left": "data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full",
    "top-center": "data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-top-full",
    "top-right": "data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full",
    "bottom-left": "data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full",
    "bottom-center": "data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full",
    "bottom-right": "data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full",
  };
  return animations[position];
};

// ============================================================================
// Toast Components
// ============================================================================

export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>,
    VariantProps<typeof toastViewportVariants> {}

/**
 * ToastViewport - Container for rendering toasts
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, position, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    data-slot="toast-viewport"
    className={cn(toastViewportVariants({ position }), className)}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  /** Position for animation direction */
  position?: ToastPosition;
}

/**
 * Toast - Individual toast notification
 */
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, position = "bottom-right", ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      data-slot="toast"
      className={cn(
        toastVariants({ variant }),
        getAnimationClasses(position),
        className
      )}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

/**
 * ToastIcon - Icon container with variant-aware sizing
 */
export interface ToastIconProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
}

const ToastIcon = React.forwardRef<HTMLDivElement, ToastIconProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const Icon = variantIcons[variant];

    return (
      <div
        ref={ref}
        data-slot="toast-icon"
        className={cn("shrink-0 [&>svg]:size-5", className)}
        {...props}
      >
        {children ?? <Icon />}
      </div>
    );
  }
);
ToastIcon.displayName = "ToastIcon";

/**
 * ToastContent - Container for title and description
 */
const ToastContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="toast-content"
    className={cn("flex flex-1 flex-col gap-1", className)}
    {...props}
  />
));
ToastContent.displayName = "ToastContent";

/**
 * ToastTitle - Toast heading text
 */
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    data-slot="toast-title"
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

/**
 * ToastDescription - Toast body text
 */
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    data-slot="toast-description"
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

/**
 * ToastAction - Action button within toast
 */
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
    colorStyle?: "filled" | "tonal" | "outlined" | "text" | "destructive";
  }
>(({ className, colorStyle = "tonal", children, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    data-slot="toast-action"
    asChild
    {...props}
  >
    <Button
      size="sm"
      colorStyle={colorStyle}
      className={className}
    >
      {children}
    </Button>
  </ToastPrimitives.Action>
));
ToastAction.displayName = "ToastAction";

/**
 * ToastClose - Close button for dismissing toast
 */
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    data-slot="toast-close"
    className={cn(
      "absolute right-2 top-2 rounded-[var(--radius-sm)] p-1",
      "opacity-0 transition-opacity",
      "group-hover:opacity-100",
      "focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      // Default variant
      "group-[.default]:text-background/50 group-[.default]:hover:text-background",
      // Success variant
      "group-[.success]:text-white/50 group-[.success]:hover:text-white",
      // Warning variant
      "group-[.warning]:text-black/50 group-[.warning]:hover:text-black",
      // Destructive variant
      "group-[.destructive]:text-white/50 group-[.destructive]:hover:text-white",
      // Info variant
      "group-[.info]:text-white/50 group-[.info]:hover:text-white",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="size-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = "ToastClose";

// ============================================================================
// ToastProvider Component
// ============================================================================

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Default position for toasts */
  position?: ToastPosition;
  /** Default duration in ms */
  duration?: number;
  /** Maximum visible toasts */
  maxToasts?: number;
  /** Swipe direction for dismissing */
  swipeDirection?: "right" | "left" | "up" | "down";
  /** Label for screen readers */
  label?: string;
}

/**
 * ToastProvider - Context provider for toast notifications
 *
 * Mount this component at the root of your app to enable toast notifications.
 * Both the `toast()` imperative API and `useToast()` hook require this provider.
 *
 * @example
 * ```tsx
 * // In your app root
 * import { ToastProvider } from '@agentix/ui';
 *
 * function App() {
 *   return (
 *     <ToastProvider position="bottom-right">
 *       <YourApp />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export function ToastProvider({
  children,
  position = "bottom-right",
  duration = 5000,
  maxToasts = 5,
  swipeDirection = "right",
  label = "Notifications",
}: ToastProviderProps) {
  // Create a scoped store instance for this provider
  const store = React.useMemo(() => new ToastStore(), []);
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  React.useEffect(() => {
    return store.subscribe(setToasts);
  }, [store]);

  // Limit visible toasts
  const visibleToasts = toasts.slice(-maxToasts);

  // Determine flex direction based on position
  const isTop = position.startsWith("top");
  const flexDirection = isTop ? "flex-col" : "flex-col-reverse";

  return (
    <ToastContext.Provider value={store}>
      <ToastPrimitives.Provider
        swipeDirection={swipeDirection}
        label={label}
      >
        {children}
        <ToastViewport position={position} className={flexDirection}>
        {visibleToasts.map((toastState) => {
          // Get icon - either custom icon or variant default
          let iconElement: React.ReactNode = null;
          if (toastState.icon) {
            // Custom icon provided
            iconElement = toastState.icon;
          } else {
            // Use variant default icon
            const IconComponent = variantIcons[toastState.variant];
            iconElement = <IconComponent />;
          }

          return (
            <Toast
              key={toastState.id}
              variant={toastState.variant}
              position={position}
              open={toastState.open}
              duration={toastState.duration}
              onOpenChange={(open) => {
                if (!open) {
                  toastState.onAutoClose?.(toastState.id);
                  store.dismiss(toastState.id);
                }
              }}
              className={cn(toastState.variant, toastState.className)}
            >
              {/* Avatar */}
              {toastState.avatar && (
                <div className="shrink-0">{toastState.avatar}</div>
              )}

              {/* Icon */}
              {!toastState.avatar && iconElement && (
                <ToastIcon variant={toastState.variant}>
                  {iconElement}
                </ToastIcon>
              )}

              {/* Content */}
              <ToastContent>
                {toastState.title && (
                  <ToastTitle>{toastState.title}</ToastTitle>
                )}
                {toastState.description && (
                  <ToastDescription>{toastState.description}</ToastDescription>
                )}
              </ToastContent>

              {/* Actions - only render for type="toast", max 2 buttons */}
              {toastState.type === "toast" && (toastState.action || toastState.secondaryAction) && (
                <div className="flex gap-2 shrink-0">
                  {toastState.action && (
                    <ToastAction
                      altText={toastState.action.altText ?? toastState.action.label}
                      colorStyle={toastState.action.colorStyle ?? "tonal"}
                      onClick={(e) => {
                        const result = toastState.action?.onClick(e);
                        if (result !== false) {
                          store.dismiss(toastState.id);
                        }
                      }}
                    >
                      {toastState.action.label}
                    </ToastAction>
                  )}
                  {toastState.secondaryAction && (
                    <ToastAction
                      altText={toastState.secondaryAction.altText ?? toastState.secondaryAction.label}
                      colorStyle={toastState.secondaryAction.colorStyle ?? "tonal"}
                      onClick={(e) => {
                        const result = toastState.secondaryAction?.onClick(e);
                        if (result !== false) {
                          store.dismiss(toastState.id);
                        }
                      }}
                    >
                      {toastState.secondaryAction.label}
                    </ToastAction>
                  )}
                </div>
              )}

              {/* Close button */}
              {toastState.dismissible && <ToastClose />}
            </Toast>
          );
        })}
      </ToastViewport>
    </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
}

// ============================================================================
// Exports
// ============================================================================

export type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  ToastViewport,
  Toast,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  toastVariants,
  toastViewportVariants,
};