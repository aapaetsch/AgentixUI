import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Inbox } from "lucide-react";

import { cn } from "../../lib/utils";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * EmptyState icon size variants.
 * Controls the rendered icon's width/height based on the `size` prop.
 */
const emptyStateIconVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "h-7 w-7",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * EmptyState title typography variants.
 * Provides a minimal, restrained type scale for the title across `size`s.
 */
const emptyStateTitleVariants = cva("text-foreground", {
  variants: {
    size: {
      sm: "text-base font-medium",
      md: "text-lg font-medium",
      lg: "text-xl font-medium",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ============================================================================
// Types
// ============================================================================

/**
 * Props for the {@link EmptyState} component.
 *
 * EmptyState is a composite display used to fill a list, grid, or table
 * when there is no data. It renders a centered stack: an optional icon,
 * a title, an optional description, and an optional CTA action.
 */
export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof emptyStateIconVariants>,
    VariantProps<typeof emptyStateTitleVariants> {
  /**
   * Icon slot rendered at the top of the stack.
   *
   * Pass `null` or `false` to omit the icon entirely. When omitted (left
   * `undefined`), a neutral `Inbox` icon from `lucide-react` is rendered
   * using the size-appropriate muted styling.
   */
  icon?: React.ReactNode;
  /**
   * Title rendered under the icon. Defaults to `"Nothing here"` when not
   * provided.
   */
  title?: React.ReactNode;
  /**
   * Secondary copy rendered under the title. When omitted, no description
   * block is rendered.
   */
  description?: React.ReactNode;
  /**
   * Optional CTA rendered below the description. Typically a `Button`.
   */
  action?: React.ReactNode;
  /**
   * Size preset controlling the icon and title typography scale.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
}

// ============================================================================
// Component
// ============================================================================

/**
 * EmptyState — a composite display primitive for representing the absence
 * of data in a list, grid, or table.
 *
 * The component renders a centered vertical stack with ample whitespace:
 * `icon → title → description → action`, with consistent spacing between
 * each slot. All visual styling is muted by default so the empty state
 * remains unobtrusive.
 *
 * The default icon, title, and action slots are intentionally minimal —
 * only the icon and title have defaults, and `description`/`action` are
 * only rendered when provided.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Search className="h-10 w-10 text-muted-foreground" />}
 *   title="No results"
 *   description="Try adjusting your filters."
 *   action={<Button>Add new</Button>}
 * />
 * ```
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title = "Nothing here",
      description,
      action,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    // Render the icon slot. `null` and `false` explicitly hide the icon;
    // `undefined` falls back to the default `Inbox` icon.
    const renderIcon = () => {
      if (icon === null || icon === false) return null;
      if (icon === undefined) {
        return <Inbox className={cn(emptyStateIconVariants({ size }))} />;
      }
      return icon;
    };

    const iconNode = renderIcon();

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-6 text-center",
          className
        )}
        {...props}
      >
        {iconNode}

        {/* Tighter spacing between title/description */}
        <div className="flex flex-col items-center gap-1">
          <h3
            className={cn(emptyStateTitleVariants({ size }))}
          >
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {/* Looser spacing before the CTA */}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export { emptyStateIconVariants, emptyStateTitleVariants };