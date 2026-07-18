import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search, X } from "lucide-react";

import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "../dialog";
import { ScrollArea } from "../scroll-area";
import { Spinner } from "../spinner";

/* -------------------------------------------------------------------------------------------------
 * Context
 * ------------------------------------------------------------------------------------------------*/

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = React.createContext<CommandPaletteContextValue | null>(null);

/**
 * Access the command palette open state and programmatic open/close.
 *
 * @example
 * ```tsx
 * const { open, setOpen } = useCommandPalette();
 * setOpen(true);
 * ```
 */
export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within a <CommandPalette>");
  }
  return ctx;
}

/* -------------------------------------------------------------------------------------------------
 * CommandPalette (root dialog)
 * ------------------------------------------------------------------------------------------------*/

export interface CommandPaletteProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Keyboard shortcut to toggle the palette; `false` disables auto-registration. @default "cmd+k" */
  shortcut?: string | false;
  /** Placeholder text for the search input. @default "Search…" */
  placeholder?: string;
  /** Empty-state message. @default "No results found." */
  emptyMessage?: string;
  /** Toggle client-side filtering, or supply a custom filter function. @default true */
  filter?: boolean | ((value: string, search: string) => number);
  /** Loop selection with arrow keys. @default true */
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * CommandPalette - Keyboard-first search and action launcher (⌘K / Ctrl+K).
 *
 * Wraps `cmdk` inside the library `Dialog` and `ScrollArea` for consistent styling
 * and a11y. Provides a context for programmatic open/close via `useCommandPalette`.
 *
 * @example
 * ```tsx
 * <CommandPalette shortcut="cmd+k">
 *   <CommandGroup heading="Symbols">
 *     <CommandItem value="AAPL" label="Apple Inc." onSelect={...} />
 *   </CommandGroup>
 * </CommandPalette>
 * ```
 */
export function CommandPalette({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  shortcut = "cmd+k",
  placeholder = "Search…",
  emptyMessage = "No results found.",
  filter = true,
  loop = true,
  className,
  children,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // Register the keyboard shortcut (consumer-configurable; no Electron-specific wiring).
  React.useEffect(() => {
    if (shortcut === false) return;
    const handler = (e: KeyboardEvent) => {
      if (matchesShortcut(e, shortcut)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcut, open, setOpen]);

  const ctxValue = React.useMemo<CommandPaletteContextValue>(
    () => ({ open, setOpen }),
    [open, setOpen]
  );

  return (
    <CommandPaletteContext.Provider value={ctxValue}>
      <CommandPrimitive.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        shouldFilter={typeof filter === "boolean" ? filter : true}
        filter={typeof filter === "function" ? filter : undefined}
        loop={loop}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogPortal>
            <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
            <DialogContent
              className={cn(
                "fixed left-1/2 top-[18%] z-50 -translate-x-1/2 translate-y-0",
                "w-[90vw] max-w-xl p-0",
                "rounded-md border bg-popover text-popover-foreground shadow-lg",
                "focus:outline-none",
                className
              )}
            >
              <CommandPrimitive
                shouldFilter={typeof filter === "boolean" ? filter : true}
                filter={typeof filter === "function" ? filter : undefined}
                loop={loop}
                className="flex flex-col gap-2 p-2"
              >
                <CommandInput placeholder={placeholder} />
                <CommandList emptyMessage={emptyMessage}>{children}</CommandList>
              </CommandPrimitive>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </CommandPrimitive.Dialog>
    </CommandPaletteContext.Provider>
  );
}
CommandPalette.displayName = "CommandPalette";

/* -------------------------------------------------------------------------------------------------
 * CommandInput
 * ------------------------------------------------------------------------------------------------*/

export interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  className?: string;
}

/** Search input for the command palette. Wraps `cmdk` Input with a search icon. */
export const CommandInput = React.forwardRef<
  HTMLInputElement,
  CommandInputProps
>(function CommandInput({ className, ...props }, ref) {
  return (
    <div className="flex items-center gap-2 border-b px-2 py-1.5">
      <Search className="size-4 text-muted-foreground" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    </div>
  );
});

/* -------------------------------------------------------------------------------------------------
 * CommandList / CommandEmpty / CommandLoading
 * ------------------------------------------------------------------------------------------------*/

export interface CommandListProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {
  emptyMessage?: string;
  className?: string;
}

/** Scrollable results container. Uses `ScrollArea` so it matches the kit. */
export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  function CommandList({ emptyMessage, className, children, ...props }, ref) {
    return (
      <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-80 overflow-hidden rounded-md", className)}
        {...props}
      >
        <ScrollArea className="h-full max-h-80">
          {children}
          {emptyMessage ? (
            <CommandPrimitive.Empty>{emptyMessage}</CommandPrimitive.Empty>
          ) : null}
        </ScrollArea>
      </CommandPrimitive.List>
    );
  }
);

/** Empty-state fallback. */
export const CommandEmpty = CommandPrimitive.Empty;

/** Loading indicator shown while async items are being fetched. */
export function CommandLoading({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground", className)}>
      <Spinner className="size-3.5" />
      {children ?? "Loading…"}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * CommandGroup / CommandItem / CommandSeparator
 * ------------------------------------------------------------------------------------------------*/

export interface CommandGroupProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> {}

/** Labeled section (e.g. Symbols / Actions / Recent). */
export const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  function CommandGroup({ heading, className, ...props }, ref) {
    return (
      <CommandPrimitive.Group
        ref={ref}
        heading={undefined}
        className={cn("[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className)}
        {...props}
      >
        {heading ? (
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {heading}
          </div>
        ) : null}
        {props.children}
      </CommandPrimitive.Group>
    );
  }
);

export interface CommandItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>, "value" | "onSelect"> {
  /** Search value (may differ from label). */
  value: string;
  /** Visible label. */
  label: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional keyboard shortcut hint shown on the right. */
  shortcut?: string;
  /** Optional metadata slot (e.g. a ticker preview). */
  metadata?: React.ReactNode;
  /** Whether this item is disabled. */
  disabled?: boolean;
  /** Called when the item is selected. */
  onSelect?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

/** Selectable row. */
export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  function CommandItem(
    { value, label, icon, shortcut, metadata, disabled, onSelect, className, children, ...props },
    ref
  ) {
    return (
      <CommandPrimitive.Item
        ref={ref}
        value={value}
        disabled={disabled}
        onSelect={onSelect}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
          "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
          "cursor-default",
          className
        )}
        {...props}
      >
        {icon ? <span className="size-4 text-muted-foreground">{icon}</span> : null}
        <span className="flex-1 text-foreground">{children ?? label}</span>
        {metadata ? <span className="text-xs text-muted-foreground">{metadata}</span> : null}
        {shortcut ? (
          <span className="ml-auto text-xs text-muted-foreground">{shortcut}</span>
        ) : null}
      </CommandPrimitive.Item>
    );
  }
);

/** Divider between groups. */
export const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(function CommandSeparator(props, ref) {
  return (
    <CommandPrimitive.Separator
      ref={ref}
      alwaysRender
      className="h-px bg-border"
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * CommandPaletteTrigger
 * ------------------------------------------------------------------------------------------------*/

export interface CommandPaletteTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

/** Trigger button that opens the palette programmatically. */
export const CommandPaletteTrigger = React.forwardRef<
  HTMLButtonElement,
  CommandPaletteTriggerProps
>(function CommandPaletteTrigger({ onClick, children, ...props }, ref) {
  const { setOpen } = useCommandPalette();
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        setOpen(true);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Shortcut matching helper
 * ------------------------------------------------------------------------------------------------*/

function matchesShortcut(e: KeyboardEvent, shortcut: string): boolean {
  const parts = shortcut.toLowerCase().split("+");
  const key = parts[parts.length - 1];
  const requireMeta = parts.includes("cmd") || parts.includes("ctrl") || parts.includes("meta");
  const requireShift = parts.includes("shift");
  const requireAlt = parts.includes("alt");

  const metaMatch =
    (e.metaKey && (parts.includes("cmd") || parts.includes("meta"))) ||
    (e.ctrlKey && parts.includes("ctrl"));

  return (
    e.key.toLowerCase() === key &&
    (!requireMeta || metaMatch) &&
    (!requireShift || e.shiftKey) &&
    (!requireAlt || e.altKey)
  );
}