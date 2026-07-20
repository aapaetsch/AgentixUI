import * as React from "react";

import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------------------------------
 * VisuallyHidden
 * ------------------------------------------------------------------------------------------------*/

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Element type to render. @default "span" */
  as?: React.ElementType;
}

/**
 * `VisuallyHidden` — accessible content hidden from sighted users.
 *
 * Content is rendered into the accessibility tree (and read by screen readers)
 * but visually clipped to a 1×1 pixel. When the element receives focus it
 * reveals itself (the standard "skip to content" pattern), so it doubles as a
 * focus-skip helper.
 *
 * This mirrors the Radix `VisuallyHidden` utility but stays dependency-free:
 * the clip + focus-reveal pattern is driven purely by Tailwind utilities.
 *
 * @example
 * ```tsx
 * <VisuallyHidden as="label" htmlFor="search">Search</VisuallyHidden>
 * <VisuallyHidden as="a" href="#main" className="...">Skip to content</VisuallyHidden>
 * ```
 */
export const VisuallyHidden = React.forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Comp = "span", className, ...rest }, ref) => {
    const Component = Comp as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn(
          // Base: visually clip the element while keeping it in the a11y tree.
          "absolute w-[1px] h-[1px] overflow-hidden p-0 m-[-1px] border-0 clip-[rect(0,0,0,0)] whitespace-nowrap",
          // Reveal on focus so the primitive works for skip-link patterns.
          "focus:absolute focus:w-auto focus:h-auto focus:p-2 focus:m-0 focus:overflow-visible focus:whitespace-normal focus:clip-auto",
          className
        )}
        {...rest}
      />
    );
  }
);

VisuallyHidden.displayName = "VisuallyHidden";