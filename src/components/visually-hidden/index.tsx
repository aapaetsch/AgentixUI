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
 * @remarks
 * `ref` is typed as `HTMLElement` because the rendered element is polymorphic
 * (via `as`). For `as="a"` use sites that need anchor-specific API access
 * (`HTMLAnchorElement` methods/properties), cast the ref via
 * `as HTMLAnchorElement`. A generic refactor that types the ref as
 * `React.ElementRef<T>` is tracked as a future improvement.
 *
 * @example
 * ```tsx
 * <VisuallyHidden as="label" htmlFor="search">Search</VisuallyHidden>
 * <VisuallyHidden as="a" href="#main" className="...">Skip to content</VisuallyHidden>
 * ```
 */
export const VisuallyHidden = React.forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Comp = "span", className, ...rest }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(
          // Base: visually clip the element while keeping it in the a11y tree.
          // `sr-only` uses Tailwind's built-in `clip-path: inset(50%)` pattern,
          // paired with `focus:not-sr-only` to reveal on focus (skip-link).
          "sr-only absolute",
          // Reveal on focus so the primitive works for skip-link patterns.
          "focus:not-sr-only focus:absolute focus:w-auto focus:h-auto focus:p-2 focus:m-0 focus:overflow-visible focus:whitespace-normal",
          className
        )}
        {...rest}
      />
    );
  }
);

VisuallyHidden.displayName = "VisuallyHidden";