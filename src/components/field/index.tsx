"use client";

import * as React from "react";

import { cn } from "../../lib/utils";
import { Label, type LabelProps } from "../label";

// ============================================================================
// Field
// ============================================================================

/**
 * Props for the {@link Field} wrapper.
 *
 * The wrapper renders a `<div>` with vertical spacing (`space-y-2`) and an
 * optional `isInvalid` flag for purely visual invalid styling. Accessibility
 * wiring (e.g. `aria-invalid` on the control) is the consumer's
 * responsibility; see `agents.md` for the recommended pattern.
 */
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, toggles `data-invalid="true"` on the wrapper for styling hooks. */
  isInvalid?: boolean;
}

/**
 * A semantic grouping wrapper for a form field: label, description, control,
 * and error message. Renders a `<div class="space-y-2">` and forwards refs.
 *
 * @example
 * ```tsx
 * <Field>
 *   <FieldLabel htmlFor="email">Email</FieldLabel>
 *   <FieldDescription>Used for sign-in only.</FieldDescription>
 *   <Input id="email" type="email" />
 *   <FieldError error={maybeError} />
 * </Field>
 * ```
 */
const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, isInvalid, ...props }, ref) => (
    <div
      ref={ref}
      data-invalid={isInvalid ? "true" : undefined}
      className={cn("space-y-2", className)}
      {...props}
    />
  )
);
Field.displayName = "Field";

// ============================================================================
// FieldLabel
// ============================================================================

/**
 * Props for {@link FieldLabel}. Aliases {@link LabelProps} so the label can be
 * used standalone or as part of a `Field` composition.
 */
export type FieldLabelProps = LabelProps;

/**
 * A label intended for use inside a {@link Field}. Re-exports `Label`
 * verbatim so consumers can keep a single import surface for field labels.
 */
const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => (
    // `Label` already merges `className` via `cn()`, so pass it through directly.
    <Label ref={ref} className={className} {...props} />
  )
);
FieldLabel.displayName = "FieldLabel";

// ============================================================================
// FieldDescription
// ============================================================================

/**
 * Props for {@link FieldDescription}. Extends native `<p>` attributes.
 */
export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/**
 * A help-text paragraph rendered below (or above) the control. Uses muted
 * foreground so it reads as secondary, supporting copy.
 */
const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

// ============================================================================
// FieldError
// ============================================================================

/**
 * Props for {@link FieldError}.
 */
export interface FieldErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Error message text. When provided (and non-empty), children are ignored
   * and this string is rendered. When absent, children render if present.
   */
  error?: string;
}

/**
 * An error message paragraph for a form field. Styled with the destructive
 * token. Rendering rules:
 *
 * - If `error` is a non-empty string, render `<p>{error}</p>` (ignoring children).
 * - Otherwise, render children if present.
 * - Otherwise, render nothing.
 */
const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, error, children, ...props }, ref) => {
    const content = error ?? children;
    if (content === undefined || content === null || content === "") {
      return null;
    }
    return (
      <p
        ref={ref}
        role="alert"
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {content}
      </p>
    );
  }
);
FieldError.displayName = "FieldError";

// ============================================================================
// FieldContent
// ============================================================================

/**
 * Props for {@link FieldContent}. Extends native `<div>` attributes.
 */
export type FieldContentProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * A small grouping container (`<div class="space-y-1">`) used to bundle the
 * label + description above the control, or to otherwise create a tight
 * vertical cluster within a {@link Field}.
 */
const FieldContent = React.forwardRef<HTMLDivElement, FieldContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props} />
  )
);
FieldContent.displayName = "FieldContent";

// ============================================================================
// Exports
// ============================================================================

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
};
export type { LabelProps } from "../label";