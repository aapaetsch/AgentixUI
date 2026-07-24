"use client";

import * as React from "react";
import {
  Group as RRPGroup,
  Panel as RRPPanel,
  Separator as RRPSeparator,
  useDefaultLayout,
  type GroupProps as RRPGroupProps,
  type PanelProps as RRPPanelProps,
  type SeparatorProps as RRPSeparatorProps,
  type LayoutStorage,
  type Layout,
  type LayoutChangedMeta,
} from "react-resizable-panels";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, ChevronDown, GripVertical } from "lucide-react";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * ResizableHandle variants
 * ------------------------------------------------------------------------------------------------*/

export const resizableHandleVariants = cva(
  [
    "group relative flex items-center justify-center shrink-0 select-none touch-none",
    "before:absolute before:content-['']",
    "transition-[background-color,width,height] duration-[var(--motion-duration-short)]",
    "ease-[var(--motion-easing-standard)]",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        line: "bg-border hover:bg-primary/40 data-[active]:bg-primary/60",
        bar: "bg-border rounded-full hover:bg-accent data-[active]:bg-primary/60",
        grip: "bg-border hover:bg-accent/40 data-[active]:bg-accent/20",
      },
      direction: {
        horizontal: "w-px h-full cursor-col-resize before:-inset-x-[1.375rem] before:inset-y-0 data-[active]:w-0.5",
        vertical: "h-px w-full cursor-row-resize before:inset-x-0 before:-inset-y-[1.375rem] data-[active]:h-0.5",
      },
    },
    compoundVariants: [
      { variant: "bar", direction: "horizontal", className: "w-1.5 data-[active]:w-2" },
      { variant: "bar", direction: "vertical", className: "h-1.5 data-[active]:h-2" },
    ],
    defaultVariants: {
      variant: "line",
      direction: "horizontal",
    },
  }
);

/* -------------------------------------------------------------------------------------------------
 * Resizable (Group)
 * ------------------------------------------------------------------------------------------------*/

export interface ResizableProps
  extends Omit<RRPGroupProps, "orientation" | "id">,
    VariantProps<typeof resizableHandleVariants> {
  direction: "horizontal" | "vertical";
  /** Optional unique id; enables layout persistence via `useDefaultLayout`. */
  autoSaveId?: string;
  /** Pluggable storage backend for layout persistence (defaults to localStorage). */
  storage?: LayoutStorage;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Resizable - Root context provider for resizable pane layouts.
 *
 * Wraps `react-resizable-panels`'s `Group` with library styling and typed props.
 * Layout persistence is optional via `autoSaveId`; storage access is SSR-guarded.
 *
 * @example
 * ```tsx
 * <Resizable direction="horizontal" autoSaveId="main-layout">
 *   <ResizablePanel defaultSize="25%"><LeftRail /></ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel><Center /></ResizablePanel>
 * </Resizable>
 * ```
 */
export function Resizable({
  direction,
  autoSaveId,
  storage,
  className,
  children,
  ...props
}: ResizableProps) {
  // Optional layout persistence. SSR-safe: skip when no id or non-browser.
  const canPersist =
    typeof autoSaveId === "string" &&
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined";

  const resolvedStorage = storage ?? (canPersist ? window.localStorage : undefined);

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: autoSaveId ?? "",
    storage: resolvedStorage as LayoutStorage | undefined,
    onlySaveAfterUserInteractions: true,
  }) as {
    defaultLayout: Layout | undefined;
    onLayoutChanged: (layout: Layout, meta: LayoutChangedMeta) => void;
  };

  return (
    <RRPGroup
      orientation={direction}
      className={cn("flex", direction === "vertical" ? "flex-col" : "flex-row", className)}
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      {...props}
    >
      {children}
    </RRPGroup>
  );
}
Resizable.displayName = "Resizable";

/* -------------------------------------------------------------------------------------------------
 * ResizablePanel
 * ------------------------------------------------------------------------------------------------*/

export interface ResizablePanelProps extends Omit<RRPPanelProps, "id"> {
  /** Uniquely identifies the panel within the group; required for layout persistence. */
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * ResizablePanel - A single resizable pane inside a `Resizable` group.
 *
 * @example
 * ```tsx
 * <ResizablePanel id="left" defaultSize="25%" minSize="10" collapsible>
 *   <LeftRail />
 * </ResizablePanel>
 * ```
 */
export function ResizablePanel({
  id,
  className,
  children,
  ...props
}: ResizablePanelProps) {
  return (
    <RRPPanel id={id} className={cn("overflow-hidden", className)} {...props}>
      {children}
    </RRPPanel>
  );
}
ResizablePanel.displayName = "ResizablePanel";

/* -------------------------------------------------------------------------------------------------
 * ResizableHandle
 * ------------------------------------------------------------------------------------------------*/

export interface ResizableHandleProps
  extends Omit<RRPSeparatorProps, "className">,
    VariantProps<typeof resizableHandleVariants> {
  /** Handle shape/visual style. @default "line" */
  variant?: "line" | "bar" | "grip";
  /** Direction of the parent group; drives ARIA orientation and size utilities. */
  direction: "horizontal" | "vertical";
  /** Disable the handle (prevents resizing but keeps the visual divider). */
  disabled?: boolean;
  /** Callback fired when dragging state changes. */
  onDragging?: (isDragging: boolean) => void;
  className?: string;
}

/**
 * ResizableHandle - Draggable splitter between two `ResizablePanel`s.
 *
 * Keyboard: ArrowKeys resize by 1%, Shift+Arrow by 10%, Enter toggles collapse
 * (handled by `react-resizable-panels`). The handle exposes
 * `role="separator"` and `aria-orientation` via the underlying primitive.
 *
 * @example
 * ```tsx
 * <ResizableHandle direction="horizontal" variant="grip" />
 * ```
 */
export function ResizableHandle({
  variant = "line",
  direction,
  disabled,
  onDragging,
  className,
  ...props
}: ResizableHandleProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDraggingChange = React.useCallback(
    (next: boolean) => {
      setIsDragging(next);
      onDragging?.(next);
    },
    [onDragging]
  );

  return (
    <RRPSeparator
      className={cn(resizableHandleVariants({ variant, direction }), className)}
      data-active={isDragging ? "true" : undefined}
      disabled={disabled}
      // The primitive already emits pointer/keyboard events; we surface a
      // convenience drag-state flag via `data-active` for visual styling.
      onPointerDown={() => handleDraggingChange(true)}
      onPointerUp={() => handleDraggingChange(false)}
      onKeyDown={() => {
        /* keyboard resize handled by the library */
      }}
      {...props}
    >
      {variant === "grip" ? (
        <span className="text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100 group-data-[active=true]:opacity-100 flex items-center justify-center">
          {direction === "horizontal" ? (
            <GripVertical className="size-3.5" />
          ) : (
            <GripVertical className="size-3.5 rotate-90" />
          )}
        </span>
      ) : null}

      {/* Collapsed affordance: a chevron hint that appears when disabled (i.e. collapsed). */}
      {disabled ? (
        <span className="text-muted-foreground flex items-center">
          {direction === "horizontal" ? (
            <ChevronRight className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
        </span>
      ) : null}
    </RRPSeparator>
  );
}
ResizableHandle.displayName = "ResizableHandle";

// Backwards-compat alias used in the dashboard shell.
export { Resizable as ResizablePanelGroup };

// Re-export the underlying types for advanced consumers.
export type { LayoutStorage, Layout, LayoutChangedMeta };
