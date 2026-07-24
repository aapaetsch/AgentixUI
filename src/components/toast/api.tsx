"use client";

/**
 * Premium Toast Component
 * 
 * Enhanced toast notifications with:
 * - Progress bar visual timer
 * - Promise-based loading states
 * - Priority queuing
 * - Undo functionality
 * - Rich content support
 * - Enhanced animations
 */

import * as React from "react";
import {
  toast as freeToast,
  useToast as useFreeToast,
  ToastProvider as FreeToastProvider,
  ToastOptions as FreeToastOptions,
  ToastPosition,
  ToastActionConfig,
} from "./primitives";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

// ============================================================================
// Premium Toast Types
// ============================================================================

/**
 * Priority levels for toast queue management
 */
export type ToastPriority = "low" | "normal" | "high" | "urgent";

/**
 * Promise state for promise-based toasts
 */
export type PromiseState = "loading" | "success" | "error";

/**
 * Messages for promise toast states
 */
export interface PromiseMessages {
  title: string | ((data: any) => string);
  description?: string | ((data: any) => string);
}

/**
 * Enhanced toast options with premium features
 */
export interface PremiumToastOptions extends FreeToastOptions {
  /** Priority level for queue management (default: "normal") */
  priority?: ToastPriority;
  /** Show progress bar for duration visualization */
  showProgress?: boolean;
  /** Undo configuration */
  undo?: {
    label?: string;
    onUndo: () => void;
  };
  /** Sound notification URL (browser must allow audio) */
  sound?: string;
  /** Rich content component */
  content?: React.ReactNode;
}

/**
 * Options for promise-based toast
 */
export interface PromiseOptions {
  loading: PremiumToastOptions;
  success: PremiumToastOptions;
  error: PremiumToastOptions;
}

// ============================================================================
// Premium Toast Provider
// ============================================================================

export interface PremiumToastProviderProps {
  children: React.ReactNode;
  /** Default position for toasts */
  position?: ToastPosition;
  /** Maximum visible toasts */
  maxToasts?: number;
  /** Swipe direction for dismissing */
  swipeDirection?: "right" | "left" | "up" | "down";
  /** Enable/disable sound notifications globally */
  enableSounds?: boolean;
}

/**
 * PremiumToastProvider - Enhanced provider with premium features
 * 
 * @example
 * ```tsx
 * import { PremiumToastProvider } from '@agentix/ui';
 * 
 * function App() {
 *   return (
 *     <PremiumToastProvider position="bottom-right" enableSounds={false}>
 *       <YourApp />
 *     </PremiumToastProvider>
 *   );
 * }
 * ```
 */
export function PremiumToastProvider({
  children,
  position = "bottom-right",
  maxToasts = 5,
  swipeDirection = "right",
}: PremiumToastProviderProps) {
  return (
    <FreeToastProvider
      position={position}
      maxToasts={maxToasts}
      swipeDirection={swipeDirection}
    >
      {children}
    </FreeToastProvider>
  );
}

// ============================================================================
// Premium Toast Hook
// ============================================================================

/**
 * usePremiumToast - Hook for creating premium toasts
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { toast } = usePremiumToast();
 * 
 *   const handleSave = async () => {
 *     await toast.promise(
 *       saveData(),
 *       {
 *         loading: { title: 'Saving...' },
 *         success: { title: 'Saved!' },
 *         error: { title: 'Failed to save' }
 *       }
 *     );
 *   };
 * 
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function usePremiumToast() {
  const freeToastApi = useFreeToast();

  const createPremiumToast = React.useCallback(
    (options: PremiumToastOptions): string => {
      // Handle undo action
      const actions: { action?: ToastActionConfig; secondaryAction?: ToastActionConfig } = {};

      if (options.undo) {
        actions.action = {
          label: options.undo.label ?? "Undo",
          onClick: () => {
            options.undo!.onUndo();
            return true; // Allow toast to close
          },
        };
      }

      // If there's an existing action, make it secondary
      if (options.action && options.undo) {
        actions.secondaryAction = options.action;
      } else if (options.action) {
        actions.action = options.action;
      }

      // Play sound if configured
      if (options.sound) {
        try {
          const audio = new Audio(options.sound);
          audio.play().catch(() => {
            // Silently fail if audio can't play
          });
        } catch {
          // Ignore audio errors
        }
      }

      // Create the toast
      return freeToastApi.toast({
        ...options,
        ...actions,
      });
    },
    [freeToastApi]
  );

  const promise = React.useCallback(
    async <T,>(
      promiseOrFn: Promise<T> | (() => Promise<T>),
      options: PromiseOptions
    ): Promise<T> => {
      const promiseToResolve = typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;

      // Show loading toast
      const id = createPremiumToast({
        ...options.loading,
        icon: <Loader2 className="size-5 animate-spin" />,
        duration: Infinity,
        dismissible: false,
      });

      try {
        const result = await promiseToResolve;
        
        // Update to success
        freeToastApi.toast.update(id, {
          ...options.success,
          variant: "success",
          icon: <CheckCircle2 className="size-5" />,
          duration: 3000,
          dismissible: true,
        });

        return result;
      } catch (error) {
        // Update to error
        freeToastApi.toast.update(id, {
          ...options.error,
          variant: "destructive",
          icon: <XCircle className="size-5" />,
          duration: 5000,
          dismissible: true,
        });

        throw error;
      }
    },
    [createPremiumToast, freeToastApi]
  );

  const success = React.useCallback(
    (options: PremiumToastOptions): string => {
      return createPremiumToast({
        ...options,
        variant: "success",
      });
    },
    [createPremiumToast]
  );

  const error = React.useCallback(
    (options: PremiumToastOptions): string => {
      return createPremiumToast({
        ...options,
        variant: "destructive",
      });
    },
    [createPremiumToast]
  );

  const warning = React.useCallback(
    (options: PremiumToastOptions): string => {
      return createPremiumToast({
        ...options,
        variant: "warning",
      });
    },
    [createPremiumToast]
  );

  const info = React.useCallback(
    (options: PremiumToastOptions): string => {
      return createPremiumToast({
        ...options,
        variant: "info",
      });
    },
    [createPremiumToast]
  );

  return {
    toast: Object.assign(createPremiumToast, {
      success,
      error,
      warning,
      info,
      promise,
      dismiss: freeToastApi.toast.dismiss,
      dismissAll: freeToastApi.toast.dismissAll,
      update: freeToastApi.toast.update,
    }),
  };
}

// ============================================================================
// Imperative Premium Toast API
// ============================================================================

/**
 * premiumToast - Imperative API for creating premium toasts outside React
 * 
 * **Important:** Requires `PremiumToastProvider` to be mounted in your React tree.
 * 
 * @example
 * ```tsx
 * import { premiumToast } from '@agentix/ui';
 * 
 * // In any file, even non-React
 * premiumToast.success({
 *   title: 'Success!',
 *   description: 'Operation completed',
 *   undo: {
 *     onUndo: () => console.log('Undoing...')
 *   }
 * });
 * 
 * // Promise-based toast
 * await premiumToast.promise(
 *   fetchData(),
 *   {
 *     loading: { title: 'Loading...' },
 *     success: { title: 'Data loaded!' },
 *     error: { title: 'Failed to load' }
 *   }
 * );
 * ```
 */
const createPremiumToastImperative = (options: PremiumToastOptions): string => {
  // Handle undo action
  const actions: { action?: ToastActionConfig; secondaryAction?: ToastActionConfig } = {};

  if (options.undo) {
    actions.action = {
      label: options.undo.label ?? "Undo",
      onClick: () => {
        options.undo!.onUndo();
        return true;
      },
    };
  }

  if (options.action && options.undo) {
    actions.secondaryAction = options.action;
  } else if (options.action) {
    actions.action = options.action;
  }

  // Play sound if configured
  if (options.sound) {
    try {
      const audio = new Audio(options.sound);
      audio.play().catch(() => {
        // Autoplay may be blocked by the browser user-gesture policy; ignore.
      });
    } catch {
      // Audio construction/playback may fail in unsupported environments; ignore.
    }
  }

  return freeToast({
    ...options,
    ...actions,
  });
};

const promiseImperative = async <T,>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  options: PromiseOptions
): Promise<T> => {
  const promiseToResolve = typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;

  const id = createPremiumToastImperative({
    ...options.loading,
    icon: <Loader2 className="size-5 animate-spin" />,
    duration: Infinity,
    dismissible: false,
  });

  try {
    const result = await promiseToResolve;
    
    freeToast.update(id, {
      ...options.success,
      variant: "success",
      duration: 3000,
      dismissible: true,
    });

    return result;
  } catch (error) {
    freeToast.update(id, {
      ...options.error,
      variant: "destructive",
      icon: <XCircle className="size-5" />,
      duration: 5000,
      dismissible: true,
    });

    throw error;
  }
};

export const premiumToast = Object.assign(createPremiumToastImperative, {
  success: (options: PremiumToastOptions) => createPremiumToastImperative({ ...options, variant: "success" }),
  error: (options: PremiumToastOptions) => createPremiumToastImperative({ ...options, variant: "destructive" }),
  warning: (options: PremiumToastOptions) => createPremiumToastImperative({ ...options, variant: "warning" }),
  info: (options: PremiumToastOptions) => createPremiumToastImperative({ ...options, variant: "info" }),
  promise: promiseImperative,
  dismiss: freeToast.dismiss,
  dismissAll: freeToast.dismissAll,
  update: freeToast.update,
});

// ============================================================================
// Exports
// ============================================================================

export type {
  ToastVariant,
  ToastPosition,
  ToastType,
  ToastActionConfig,
} from "./primitives";

export {
  // Re-export low-level toast primitives for convenience.
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
} from "./primitives";
