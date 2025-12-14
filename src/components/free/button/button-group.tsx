import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

/**
 * ButtonGroup variants using CVA
 * Standard container for grouped buttons with gap
 */
const buttonGroupVariants = cva(
  [
    "inline-flex items-center",
  ].join(" "),
  {
    variants: {
      /**
       * Gap between buttons
       */
      gap: {
        none: "gap-0",
        xs: "gap-0.5",
        sm: "gap-1",
        md: "gap-2",
        lg: "gap-3",
      },
      /**
       * Orientation
       */
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      gap: "sm",
      orientation: "horizontal",
    },
  }
);

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  /**
   * Button elements
   */
  children: React.ReactNode;
}

/**
 * ButtonGroup - A container for grouping related buttons
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button colorStyle="outlined">Left</Button>
 *   <Button colorStyle="outlined">Middle</Button>
 *   <Button colorStyle="outlined">Right</Button>
 * </ButtonGroup>
 * ```
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, gap, orientation, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        data-slot="button-group"
        className={cn(buttonGroupVariants({ gap, orientation }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup, buttonGroupVariants };
