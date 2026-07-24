import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

// ============================================================================
// Types
// ============================================================================

type ColorStyle = "filled" | "tonal";
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type DefaultShape = "round" | "square";

// ============================================================================
// ConnectedButtonGroup Context
// ============================================================================

interface ConnectedButtonGroupContextValue {
  colorStyle: ColorStyle | null;
  size: Size | null;
  defaultShape: DefaultShape;
  selectionMode: "single" | "multiple";
  selectedValues: Set<string>;
  onValueChange: (value: string) => void;
  showSelectedIcon: boolean;
}

const ConnectedButtonGroupContext = React.createContext<ConnectedButtonGroupContextValue | null>(null);

function useConnectedButtonGroup() {
  const context = React.useContext(ConnectedButtonGroupContext);
  if (!context) {
    throw new Error("ConnectedButtonGroupItem must be used within a ConnectedButtonGroup");
  }
  return context;
}

// ============================================================================
// ConnectedButtonGroup Container Variants
// ============================================================================

/**
 * ConnectedButtonGroup container variants following MD3 Expressive Button Groups specs
 * 
 * MD3 Key Design Features:
 * - 2dp inner padding at every size (gap between segments)
 * - Round shape: Fully rounded outer corners (pill shape)
 * - Square shape: Corner radii per size (XS:4dp, S:8dp, M:8dp, L:16dp, XL:20dp)
 * - Shape morphing: Selected buttons change from round→square or square→round
 * 
 * Reference: https://m3.material.io/components/button-groups/specs
 */
const connectedButtonGroupVariants = cva(
  [
    "inline-flex items-stretch",
    "p-0.5", // MD3: 2dp inner padding at every size
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      colorStyle: {
        filled: "bg-[hsl(var(--surface-container))]",
        tonal: "bg-[hsl(var(--surface-container))]",
        outlined: "bg-transparent border border-[hsl(var(--outline-variant))]",
      },
      /**
       * Size variants following MD3 specifications
       * Heights: XS:32dp, S:36dp, M:40dp, L:48dp, XL:56dp
       */
      size: {
        xs: "h-8",      // 32dp
        sm: "h-9",      // 36dp
        md: "h-10",     // 40dp (MD3 default)
        lg: "h-12",     // 48dp
        xl: "h-14",     // 56dp
      },
      /**
       * Default shape for the button group
       * - round: Fully rounded outer corners (pill shape) - default
       * - square: Corner radii based on size
       */
      defaultShape: {
        round: "rounded-full",
        square: "", // Corner radius handled by compound variants
      },
    },
    compoundVariants: [
      // Square shape corner radii per size (XS:4dp, S:8dp, M:8dp, L:16dp, XL:20dp)
      { defaultShape: "square", size: "xs", className: "rounded-[0.25rem]" },   // 4dp
      { defaultShape: "square", size: "sm", className: "rounded-[0.5rem]" },    // 8dp
      { defaultShape: "square", size: "md", className: "rounded-[0.5rem]" },    // 8dp
      { defaultShape: "square", size: "lg", className: "rounded-[1rem]" },      // 16dp
      { defaultShape: "square", size: "xl", className: "rounded-[1.25rem]" },   // 20dp
    ],
    defaultVariants: {
      colorStyle: "filled",
      size: "md",
      defaultShape: "round",
    },
  }
);

// ============================================================================
// ConnectedButtonGroupItem Variants
// ============================================================================

/**
 * ConnectedButtonGroupItem variants following MD3 Expressive Button Groups specs
 * 
 * MD3 Key Design Features:
 * - Shape morphing on selection (round → square or square → round)
 * - Inner corner radii when round container: XS:4dp, S:8dp, M:8dp, L:16dp, XL:20dp
 * - Selected state: Secondary container background
 * - Unselected state: Transparent background
 * - State layers for hover/focus/pressed (8%/12%/12%)
 * - No internal dividers (container provides visual separation via padding)
 * 
 * Reference: https://m3.material.io/components/button-groups/specs
 */
const connectedButtonGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-medium select-none",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:z-10 focus-visible:relative",
    "disabled:pointer-events-none disabled:opacity-50",
    // M3 Motion for shape morphing
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // SVG icon sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // Flex grow to fill available space equally
    "flex-1",
    // Full height within container
    "h-full",
  ].join(" "),
  {
    variants: {
      colorStyle: {
        filled: "",
        tonal: "",
      },
      size: {
        xs: "px-3 text-xs [&_svg]:size-3.5 min-w-[2.5rem]",  // 40dp min for touch target
        sm: "px-3 text-sm [&_svg]:size-4 min-w-[2.5rem]",
        md: "px-4 text-sm [&_svg]:size-4",
        lg: "px-5 text-base [&_svg]:size-5",
        xl: "px-6 text-lg [&_svg]:size-6",
      },
      selected: {
        true: "",
        false: "",
      },
      /**
       * Default shape from parent - determines base rounding
       */
      defaultShape: {
        round: "",
        square: "",
      },
    },
    compoundVariants: [
      // ========================================================================
      // ROUND Container - Inner corners are square by default
      // Inner corner radii: XS:4dp, S:8dp, M:8dp, L:16dp, XL:20dp
      // Selected: morphs to round (pill)
      // ========================================================================
      { defaultShape: "round", selected: false, size: "xs", className: "rounded-[0.25rem]" },
      { defaultShape: "round", selected: false, size: "sm", className: "rounded-[0.5rem]" },
      { defaultShape: "round", selected: false, size: "md", className: "rounded-[0.5rem]" },
      { defaultShape: "round", selected: false, size: "lg", className: "rounded-[1rem]" },
      { defaultShape: "round", selected: false, size: "xl", className: "rounded-[1.25rem]" },
      // Round container - selected morphs to pill
      { defaultShape: "round", selected: true, className: "rounded-full" },
      
      // ========================================================================
      // SQUARE Container - Inner corners match outer by default
      // Selected: morphs to round (pill)
      // ========================================================================
      { defaultShape: "square", selected: false, size: "xs", className: "rounded-[0.125rem]" },
      { defaultShape: "square", selected: false, size: "sm", className: "rounded-[0.375rem]" },
      { defaultShape: "square", selected: false, size: "md", className: "rounded-[0.375rem]" },
      { defaultShape: "square", selected: false, size: "lg", className: "rounded-[0.75rem]" },
      { defaultShape: "square", selected: false, size: "xl", className: "rounded-[1rem]" },
      // Square container - selected morphs to round
      { defaultShape: "square", selected: true, className: "rounded-full" },
      
      // ========================================================================
      // Unselected Items - MD3 style (common for both filled and tonal)
      // ========================================================================
      {
        colorStyle: ["filled", "tonal"],
        selected: false,
        className: [
          "bg-transparent text-[hsl(var(--on-surface))]",
          "hover:bg-[hsl(var(--on-surface)/0.08)]",
          "focus-visible:bg-[hsl(var(--on-surface)/0.12)]",
          "active:bg-[hsl(var(--on-surface)/0.12)]",
        ].join(" "),
      },
      
      // ========================================================================
      // Filled Style - Selected items have more prominent backgrounds
      // ========================================================================
      {
        colorStyle: "filled",
        selected: true,
        className: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "focus-visible:bg-primary/95",
          "active:bg-primary/80",
        ].join(" "),
      },
      
      // ========================================================================
      // Tonal Style - Selected items have softer backgrounds
      // ========================================================================
      {
        colorStyle: "tonal",
        selected: true,
        className: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "focus-visible:bg-secondary/90",
          "active:bg-secondary/70",
        ].join(" "),
      },
    ],
    defaultVariants: {
      colorStyle: "filled",
      size: "md",
      selected: false,
      defaultShape: "round",
    },
  }
);

// ============================================================================
// ConnectedButtonGroup Props & Component
// ============================================================================

export interface ConnectedButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof connectedButtonGroupVariants> {
  /**
   * Selection mode
   * - single: Only one item can be selected at a time
   * - multiple: Multiple items can be selected
   */
  selectionMode?: "single" | "multiple";
  /**
   * Controlled selected value(s)
   */
  value?: string | string[];
  /**
   * Default selected value(s) (uncontrolled)
   */
  defaultValue?: string | string[];
  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * Whether to show a check icon for selected items
   * MD3 spec: When using both icons AND text, the icon becomes a checkmark when selected
   * @default true
   */
  showSelectedIcon?: boolean;
  /**
   * Button group items
   */
  children: React.ReactNode;
}

/**
 * ConnectedButtonGroup - MD3 Expressive Button Groups with selection state
 * 
 * Follows Material Design 3 Expressive Button Groups specifications:
 * - 2dp inner padding at every size (gap between segments)
 * - Shape morphing: Selected buttons change from round→square or square→round
 * - Round shape: Fully rounded outer corners (pill), inner corners are square
 * - Square shape: Corner radii based on size
 * - Check icon for selected items (when using icon + label)
 * - State layers for hover/focus/pressed (8%/12%/12%)
 * 
 * Best Practices (per MD3 guidelines):
 * - Use for single or multi-select patterns with toggle buttons
 * - Keep labels short and consistent in length
 * - Don't mix icon-only with text labels
 * - Connected groups should span container width
 * - Replaces the deprecated Segmented Button
 *
 * @example
 * ```tsx
 * // Single select with round shape (default)
 * <ConnectedButtonGroup value={view} onValueChange={setView}>
 *   <ConnectedButtonGroupItem value="grid" icon={<Grid />}>
 *     Grid
 *   </ConnectedButtonGroupItem>
 *   <ConnectedButtonGroupItem value="list" icon={<List />}>
 *     List
 *   </ConnectedButtonGroupItem>
 * </ConnectedButtonGroup>
 *
 * // Square shape with shape morphing
 * <ConnectedButtonGroup defaultShape="square" value={size} onValueChange={setSize}>
 *   <ConnectedButtonGroupItem value="s">S</ConnectedButtonGroupItem>
 *   <ConnectedButtonGroupItem value="m">M</ConnectedButtonGroupItem>
 *   <ConnectedButtonGroupItem value="l">L</ConnectedButtonGroupItem>
 * </ConnectedButtonGroup>
 *
 * // Multiple select (text formatting)
 * <ConnectedButtonGroup selectionMode="multiple" value={formats} onValueChange={setFormats}>
 *   <ConnectedButtonGroupItem value="bold" icon={<Bold />} />
 *   <ConnectedButtonGroupItem value="italic" icon={<Italic />} />
 * </ConnectedButtonGroup>
 * ```
 */
const ConnectedButtonGroup = React.forwardRef<HTMLDivElement, ConnectedButtonGroupProps>(
  (
    {
      className,
      colorStyle,
      size,
      defaultShape = "round",
      selectionMode = "single",
      value: controlledValue,
      defaultValue,
      onValueChange,
      showSelectedIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    // Initialize internal state
    const getInitialValue = (): Set<string> => {
      if (controlledValue !== undefined) {
        return new Set(Array.isArray(controlledValue) ? controlledValue : [controlledValue]);
      }
      if (defaultValue !== undefined) {
        return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
      }
      return new Set();
    };

    const [internalValue, setInternalValue] = React.useState<Set<string>>(getInitialValue);
    const isControlled = controlledValue !== undefined;
    const selectedValues = isControlled
      ? new Set(Array.isArray(controlledValue) ? controlledValue : [controlledValue])
      : internalValue;

    const handleValueChange = (value: string) => {
      let newValues: Set<string>;

      if (selectionMode === "single") {
        newValues = new Set([value]);
      } else {
        newValues = new Set(selectedValues);
        if (newValues.has(value)) {
          newValues.delete(value);
        } else {
          newValues.add(value);
        }
      }

      if (!isControlled) {
        setInternalValue(newValues);
      }

      const result = selectionMode === "single"
        ? Array.from(newValues)[0] ?? ""
        : Array.from(newValues);
      onValueChange?.(result);
    };

    const contextValue: ConnectedButtonGroupContextValue = {
      colorStyle: (colorStyle ?? "filled") as ColorStyle,
      size: size ?? null,
      defaultShape: defaultShape ?? "round",
      selectionMode,
      selectedValues,
      onValueChange: handleValueChange,
      showSelectedIcon,
    };

    return (
      <ConnectedButtonGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-slot="connected-button-group"
          data-shape={defaultShape}
          className={cn(
            connectedButtonGroupVariants({ colorStyle, size, defaultShape }),
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ConnectedButtonGroupContext.Provider>
    );
  }
);
ConnectedButtonGroup.displayName = "ConnectedButtonGroup";

// ============================================================================
// ConnectedButtonGroupItem Props & Component
// ============================================================================

export interface ConnectedButtonGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Value for this item (used for selection)
   */
  value: string;
  /**
   * Icon to display (will be replaced by check icon when selected if both icon and text are present)
   */
  icon?: React.ReactNode;
}

/**
 * ConnectedButtonGroupItem - Individual segment within a ConnectedButtonGroup
 * 
 * MD3 Expressive Behavior:
 * - Shape morphing: Selected items change shape (round→square or square→round)
 * - When an item has both icon AND text: the icon is replaced by a checkmark when selected
 * - When an item has icon-only: no checkmark replacement, just shape/color change
 * - When an item has text-only: no checkmark, just shape/color change
 */
const ConnectedButtonGroupItem = React.forwardRef<HTMLButtonElement, ConnectedButtonGroupItemProps>(
  ({ className, value, icon, children, onClick, ...props }, ref) => {
    const { colorStyle, size, defaultShape, selectedValues, onValueChange, showSelectedIcon } = useConnectedButtonGroup();
    const isSelected = selectedValues.has(value);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onValueChange(value);
      onClick?.(event);
    };

    // Determine if we have both icon and text children
    const hasIcon = icon !== undefined;
    const hasTextChildren = React.Children.toArray(children).some(
      child => typeof child === 'string' || typeof child === 'number'
    );
    const shouldShowCheckIcon = showSelectedIcon && isSelected && hasIcon && hasTextChildren;

    return (
      <button
        ref={ref}
        type="button"
        data-slot="connected-button-group-item"
        data-state={isSelected ? "on" : "off"}
        aria-pressed={isSelected}
        className={cn(
          connectedButtonGroupItemVariants({
            colorStyle: (colorStyle ?? "filled") as ColorStyle,
            size: size ?? "md",
            selected: isSelected,
            defaultShape: defaultShape ?? "round",
          }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* MD3: Show check icon when selected (if has both icon and text) */}
        {shouldShowCheckIcon ? (
          <Check className="shrink-0" aria-hidden="true" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);
ConnectedButtonGroupItem.displayName = "ConnectedButtonGroupItem";

// ============================================================================
// Exports
// ============================================================================

export {
  ConnectedButtonGroup,
  ConnectedButtonGroupItem,
  connectedButtonGroupVariants,
  connectedButtonGroupItemVariants,
  useConnectedButtonGroup,
};
