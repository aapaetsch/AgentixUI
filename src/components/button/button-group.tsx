import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// ============================================================================
// Types
// ============================================================================

/**
 * Size options matching MD3 Expressive button group specifications
 * - xs: Extra small (32dp height, 18dp/4.5 gap)
 * - sm: Small (36dp height, 12dp/3 gap)
 * - md: Medium (40dp height, 8dp/2 gap) - default
 * - lg: Large (48dp height, 8dp/2 gap)
 * - xl: Extra large (56dp height, 8dp/2 gap)
 */
type ButtonGroupSize = "xs" | "sm" | "md" | "lg" | "xl";

// ============================================================================
// ButtonGroup Context
// ============================================================================

interface ButtonGroupContextValue {
  orientation: "horizontal" | "vertical";
  styleVariant: "shadcn" | "md3";
  size: ButtonGroupSize;
}

const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null);

function useButtonGroup() {
  return React.useContext(ButtonGroupContext);
}

// ============================================================================
// ButtonGroup Variants
// ============================================================================

/**
 * ButtonGroup variants using CVA
 * Supports both shadcn/ui style (gap-based) and MD3 style (with proper spacing per size)
 * 
 * MD3 Standard Button Group Spacing (from Expressive Button Groups spec):
 * - XS: 18dp (gap-[1.125rem])
 * - S: 12dp (gap-3)
 * - M/L/XL: 8dp (gap-2)
 */
const buttonGroupVariants = cva(
  [
    "inline-flex items-center",
  ].join(" "),
  {
    variants: {
      /**
       * Gap between buttons (shadcn style)
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
      /**
       * Style variant
       * - shadcn: Standard gap-based grouping following shadcn/ui patterns
       * - md3: Material Design 3 Expressive with proper spacing based on size
       */
      styleVariant: {
        shadcn: "",
        md3: "",
      },
      /**
       * Size (for MD3 style - determines gap spacing)
       */
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    compoundVariants: [
      // MD3 gap spacing per size
      { styleVariant: "md3", size: "xs", className: "gap-[1.125rem]" }, // 18dp
      { styleVariant: "md3", size: "sm", className: "gap-3" }, // 12dp
      { styleVariant: "md3", size: "md", className: "gap-2" }, // 8dp
      { styleVariant: "md3", size: "lg", className: "gap-2" }, // 8dp
      { styleVariant: "md3", size: "xl", className: "gap-2" }, // 8dp
    ],
    defaultVariants: {
      gap: "sm",
      orientation: "horizontal",
      styleVariant: "shadcn",
      size: "md",
    },
  }
);

// ============================================================================
// ButtonGroupSeparator Component (shadcn pattern)
// ============================================================================

const buttonGroupSeparatorVariants = cva(
  [
    "shrink-0",
    "bg-border",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "h-4 w-px",
        vertical: "h-px w-4",
      },
    },
    defaultVariants: {
      orientation: "vertical", // Default to vertical line for horizontal groups
    },
  }
);

export interface ButtonGroupSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupSeparatorVariants> {}

/**
 * ButtonGroupSeparator - A visual separator between buttons in a group
 * 
 * Following shadcn/ui patterns, this provides visual division between buttons
 * when they don't have their own borders (e.g., secondary, ghost variants).
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="secondary">Copy</Button>
 *   <ButtonGroupSeparator />
 *   <Button variant="secondary">Paste</Button>
 * </ButtonGroup>
 * ```
 */
const ButtonGroupSeparator = React.forwardRef<HTMLDivElement, ButtonGroupSeparatorProps>(
  ({ className, orientation, ...props }, ref) => {
    const context = useButtonGroup();
    // If inside ButtonGroup, infer orientation (separator is perpendicular to group)
    const resolvedOrientation = orientation ?? 
      (context?.orientation === "vertical" ? "horizontal" : "vertical");

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={resolvedOrientation}
        data-slot="button-group-separator"
        className={cn(
          buttonGroupSeparatorVariants({ orientation: resolvedOrientation }),
          className
        )}
        {...props}
      />
    );
  }
);
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

// ============================================================================
// ButtonGroupText Component (shadcn pattern)
// ============================================================================

export interface ButtonGroupTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * When true, renders as its child element (useful for labels)
   */
  asChild?: boolean;
}

/**
 * ButtonGroupText - Text element within a button group
 * 
 * Use this to display text labels within a button group, following shadcn/ui patterns.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <ButtonGroupText>Label:</ButtonGroupText>
 *   <Button>Action</Button>
 * </ButtonGroup>
 * 
 * // With asChild for custom elements like Label
 * <ButtonGroup>
 *   <ButtonGroupText asChild>
 *     <Label htmlFor="input">Name</Label>
 *   </ButtonGroupText>
 *   <Input id="input" />
 * </ButtonGroup>
 * ```
 */
const ButtonGroupText = React.forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="button-group-text"
        className={cn(
          "inline-flex items-center px-3 text-sm text-muted-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
ButtonGroupText.displayName = "ButtonGroupText";

// ============================================================================
// ButtonGroup Component
// ============================================================================

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  /**
   * Button elements
   */
  children: React.ReactNode;
  /**
   * Size preset (for MD3 style - determines gap spacing)
   * - xs: 18dp gap
   * - sm: 12dp gap
   * - md/lg/xl: 8dp gap
   * @default "md"
   */
  size?: ButtonGroupSize;
}

/**
 * ButtonGroup - A container for grouping related buttons
 * 
 * Supports two style variants:
 * - **shadcn**: Standard gap-based grouping with separator support
 * - **md3**: Material Design 3 Expressive style with proper spacing per size
 *
 * MD3 Standard Button Group Spacing:
 * - XS: 18dp gap
 * - S: 12dp gap
 * - M/L/XL: 8dp gap
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ButtonGroup>
 *   <Button colorStyle="outlined">Left</Button>
 *   <Button colorStyle="outlined">Middle</Button>
 *   <Button colorStyle="outlined">Right</Button>
 * </ButtonGroup>
 * 
 * // With separator (shadcn pattern)
 * <ButtonGroup>
 *   <Button variant="secondary">Copy</Button>
 *   <ButtonGroupSeparator />
 *   <Button variant="secondary">Paste</Button>
 * </ButtonGroup>
 * 
 * // Vertical orientation
 * <ButtonGroup orientation="vertical">
 *   <Button>Top</Button>
 *   <Button>Bottom</Button>
 * </ButtonGroup>
 * 
 * // MD3 style with size
 * <ButtonGroup styleVariant="md3" size="sm">
 *   <Button colorStyle="filled">Primary</Button>
 *   <IconButton><Plus /></IconButton>
 * </ButtonGroup>
 * ```
 */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, gap, orientation = "horizontal", styleVariant = "shadcn", size = "md", children, ...props }, ref) => {
    const contextValue: ButtonGroupContextValue = {
      orientation: orientation ?? "horizontal",
      styleVariant: styleVariant ?? "shadcn",
      size: size ?? "md",
    };

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-slot="button-group"
          data-orientation={orientation}
          data-style-variant={styleVariant}
          data-size={size}
          className={cn(
            buttonGroupVariants({ 
              gap: styleVariant === "md3" ? "none" : gap, 
              orientation, 
              styleVariant,
              size: styleVariant === "md3" ? size : undefined,
            }),
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

export { 
  ButtonGroup, 
  ButtonGroupSeparator, 
  ButtonGroupText, 
  buttonGroupVariants,
  buttonGroupSeparatorVariants,
  useButtonGroup,
};
