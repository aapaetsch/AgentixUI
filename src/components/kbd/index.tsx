import * as React from "react";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Kbd
 * ------------------------------------------------------------------------------------------------*/

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * `Kbd` — inline keyboard key indicator.
 *
 * Renders an `<kbd>` element with the standard shadcn keyboard styling: a
 * small rounded border, subtle background, mono font, and muted text. Use it
 * inside tooltips, menu hints, or command palette rows to surface keyboard
 * shortcuts.
 *
 * For multi-key combos, render one `<Kbd>` per key (or pass the combo string
 * as children — both are valid; styling is identical).
 *
 * @example
 * ```tsx
 * <Kbd>⌘</Kbd>
 * <span className="flex items-center gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
 * <Kbd>Shift + Tab</Kbd>
 * ```
 */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, ...rest }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-muted-foreground",
        className
      )}
      {...rest}
    />
  )
);

Kbd.displayName = "Kbd";