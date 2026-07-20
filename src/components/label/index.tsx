"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * Props for the {@link Label} component.
 *
 * Extends the standard HTML `<label>` element attributes so consumers can
 * pass `htmlFor`, `form`, and any other native label attributes directly.
 */
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

/**
 * A styled form label conforming to the shadcn/ui visual language.
 *
 * Renders a native `<label>` element with a compact, medium-weight typography
 * treatment and peer-disabled styling for use alongside form controls that
 * render a disabled peer sibling (e.g. `<Input disabled />`).
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" disabled />
 * ```
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
export default Label;