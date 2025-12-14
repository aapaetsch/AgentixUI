"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "../../../lib/utils";

// ============================================================================
// Variants
// ============================================================================

const sheetOverlayVariants = cva(
  [
    "fixed inset-0 z-50",
    "bg-black/50 backdrop-blur-sm",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ].join(" ")
);

const sheetContentVariants = cva(
  [
    "fixed z-50",
    "bg-background border border-border",
    "shadow-[var(--elevation-5)]",
    "outline-none",
    "w-full",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
  ].join(" "),
  {
    variants: {
      position: {
        top: [
          "inset-x-0 top-0",
          "rounded-b-[var(--radius-xl)]",
          "border-b",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ].join(" "),
        right: [
          "inset-y-0 right-0 h-full",
          "border-l",
          "sm:w-auto",
          "rounded-l-[var(--radius-xl)]",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0",
          "rounded-t-[var(--radius-xl)]",
          "border-t",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ].join(" "),
        left: [
          "inset-y-0 left-0 h-full",
          "border-r",
          "sm:w-auto",
          "rounded-r-[var(--radius-xl)]",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ].join(" "),
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        full: "",
      },
      animationType: {
        smooth: "duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
        stiff: "duration-[var(--motion-duration-short)] ease-[var(--motion-easing-emphasized)]",
      },
    },
    compoundVariants: [
      { position: "right", size: "xs", className: "max-w-[18rem]" },
      { position: "right", size: "sm", className: "max-w-[20rem]" },
      { position: "right", size: "md", className: "max-w-[24rem]" },
      { position: "right", size: "lg", className: "max-w-[28rem]" },
      { position: "right", size: "xl", className: "max-w-[32rem]" },
      { position: "right", size: "full", className: "max-w-full" },

      { position: "left", size: "xs", className: "max-w-[18rem]" },
      { position: "left", size: "sm", className: "max-w-[20rem]" },
      { position: "left", size: "md", className: "max-w-[24rem]" },
      { position: "left", size: "lg", className: "max-w-[28rem]" },
      { position: "left", size: "xl", className: "max-w-[32rem]" },
      { position: "left", size: "full", className: "max-w-full" },

      { position: "top", size: "xs", className: "h-[35vh]" },
      { position: "top", size: "sm", className: "h-[45vh]" },
      { position: "top", size: "md", className: "h-[55vh]" },
      { position: "top", size: "lg", className: "h-[65vh]" },
      { position: "top", size: "xl", className: "h-[80vh]" },
      { position: "top", size: "full", className: "h-screen" },

      { position: "bottom", size: "xs", className: "h-[35vh]" },
      { position: "bottom", size: "sm", className: "h-[45vh]" },
      { position: "bottom", size: "md", className: "h-[55vh]" },
      { position: "bottom", size: "lg", className: "h-[65vh]" },
      { position: "bottom", size: "xl", className: "h-[80vh]" },
      { position: "bottom", size: "full", className: "h-screen" },
    ],
    defaultVariants: {
      position: "right",
      size: "md",
      animationType: "smooth",
    },
  }
);

const sheetHeaderVariants = cva(
  [
    "flex flex-col gap-2",
    "text-left",
  ].join(" ")
);

const sheetFooterVariants = cva(
  [
    "flex flex-col-reverse gap-3",
    "sm:flex-row sm:justify-end sm:gap-2",
  ].join(" ")
);

const sheetTitleVariants = cva(
  [
    "text-lg font-semibold leading-none tracking-tight",
  ].join(" ")
);

const sheetHandleVariants = cva(
  [
    "mx-auto",
    "h-1.5 w-12",
    "shrink-0 rounded-full",
    "bg-muted-foreground/30",
  ].join(" "),
  {
    variants: {
      position: {
        top: "mb-4 mt-2",
        bottom: "mb-2 mt-4",
        left: "hidden",
        right: "hidden",
      },
    },
    defaultVariants: {
      position: "bottom",
    },
  }
);

const sheetDescriptionVariants = cva(
  [
    "text-sm text-muted-foreground",
  ].join(" ")
);

// ============================================================================
// Types
// ============================================================================

export interface SheetProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>, "modal"> {
  /**
   * Control whether focus is trapped and background is inert
   * @default true
   */
  modal?: boolean;
  /**
   * Alias for `open` to align with design system naming
   */
  isOpen?: boolean;
}

export interface SheetTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {}

export interface SheetPortalProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal> {}

export interface SheetOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {
  /**
   * Custom classes for the overlay element
   */
  overlayClassName?: string;
  /**
   * Render a close button in the top corner
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Custom close button content
   */
  closeButton?: React.ReactNode;
  /**
   * Callback when close button is clicked
   */
  onCloseClick?: () => void;
  /**
   * Prevents closing the sheet by clicking the overlay or pressing Escape.
   * @default false
   */
  preventBackgroundClose?: boolean;
  /**
   * Whether to show the drag handle for touch devices (only visible for top/bottom positions)
   * @default false
   */
  showHandle?: boolean;
  /**
   * Custom handle component
   */
  handleComponent?: React.ReactNode;
}

export interface SheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface SheetFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface SheetTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

export interface SheetDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

export type DrawerProps = SheetProps;

// ============================================================================
// Context
// ============================================================================

interface SheetContextValue {
  level: number;
  modal: boolean;
}

const SheetContext = React.createContext<SheetContextValue>({ level: 0, modal: true });

function useSheetContext() {
  return React.useContext(SheetContext);
}

// ============================================================================
// Components
// ============================================================================

function Sheet({ isOpen, open, onOpenChange, modal = true, children, ...props }: SheetProps) {
  const parent = useSheetContext();
  const level = parent.level + 1;
  const resolvedOpen = isOpen ?? open;

  return (
    <SheetContext.Provider value={{ level, modal }}>
      <DialogPrimitive.Root
        data-slot="sheet"
        open={resolvedOpen}
        onOpenChange={onOpenChange}
        modal={modal}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </SheetContext.Provider>
  );
}

const SheetTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  SheetTriggerProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    data-slot="sheet-trigger"
    className={cn(className)}
    {...props}
  />
));
SheetTrigger.displayName = "SheetTrigger";

function SheetPortal({ ...props }: SheetPortalProps) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  SheetOverlayProps
>(({ className, ...props }, ref) => {
  const { level, modal } = useSheetContext();

  if (!modal) return null;

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="sheet-overlay"
      data-sheet-level={level}
      className={cn(sheetOverlayVariants(), className)}
      style={{ zIndex: 50 + (level - 1) * 10 }}
      {...props}
    />
  );
});
SheetOverlay.displayName = "SheetOverlay";

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      className,
      children,
      position,
      size,
      animationType,
      overlayClassName,
      showCloseButton = true,
      closeButton,
      onCloseClick,
      preventBackgroundClose = false,
      showHandle = false,
      handleComponent,
      onInteractOutside,
      onEscapeKeyDown,
      ...props
    },
    ref
  ) => {
    const { level, modal } = useSheetContext();

    // Handle interaction outside prevention
    const handleInteractOutside = React.useCallback(
      (event: React.ComponentProps<typeof DialogPrimitive.Content>["onInteractOutside"] extends ((e: infer E) => void) | undefined ? E : never) => {
        if (preventBackgroundClose) {
          event.preventDefault();
        }
        onInteractOutside?.(event);
      },
      [preventBackgroundClose, onInteractOutside]
    );

    // Handle escape key prevention
    const handleEscapeKeyDown = React.useCallback(
      (event: React.ComponentProps<typeof DialogPrimitive.Content>["onEscapeKeyDown"] extends ((e: infer E) => void) | undefined ? E : never) => {
        if (preventBackgroundClose) {
          event.preventDefault();
        }
        onEscapeKeyDown?.(event);
      },
      [preventBackgroundClose, onEscapeKeyDown]
    );

    return (
      <SheetPortal>
        {modal && <SheetOverlay className={overlayClassName} />}
        <DialogPrimitive.Content
          ref={ref}
          data-slot="sheet-content"
          data-sheet-level={level}
          data-position={position}
          className={cn(
            sheetContentVariants({ position, size, animationType }),
            className
          )}
          style={{ zIndex: 50 + (level - 1) * 10 + 1 }}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
          {...props}
        >
          {/* Handle for touch devices */}
          {showHandle && (position === "top" || position === "bottom") && (
            handleComponent || (
              <div
                data-slot="sheet-handle"
                className={cn(sheetHandleVariants({ position }))}
              />
            )
          )}

          <div className="flex h-full w-full flex-col gap-4 p-6">
            {children}
          </div>
          {showCloseButton && (
            closeButton || (
              <DialogPrimitive.Close
                data-slot="sheet-close"
                className="absolute right-4 top-4 rounded-[var(--radius-sm)] opacity-70 transition-opacity duration-[var(--motion-duration-short)] ease-[var(--motion-easing-standard)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={onCloseClick}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )
          )}
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(sheetHeaderVariants(), className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(sheetFooterVariants(), className)}
      {...props}
    />
  );
}

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  SheetTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn(sheetTitleVariants(), className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  SheetDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn(sheetDescriptionVariants(), className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

const SheetClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    data-slot="sheet-close"
    className={cn(className)}
    {...props}
  />
));
SheetClose.displayName = "SheetClose";

const Drawer = (props: DrawerProps) => {
  return <Sheet {...props} />;
};

// ============================================================================
// Exports
// ============================================================================

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Drawer,
  sheetOverlayVariants,
  sheetContentVariants,
  sheetHeaderVariants,
  sheetFooterVariants,
  sheetTitleVariants,
  sheetDescriptionVariants,
  sheetHandleVariants,
};
