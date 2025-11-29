import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * ConnectedButtonGroup context
 */
interface ConnectedButtonGroupContextValue {
  colorStyle: "filled" | "tonal" | "outlined" | null;
  size: "xs" | "sm" | "md" | "lg" | "xl" | null;
  selectionMode: "single" | "multiple";
  selectedValues: Set<string>;
  onValueChange: (value: string) => void;
}

const ConnectedButtonGroupContext = React.createContext<ConnectedButtonGroupContextValue | null>(null);

function useConnectedButtonGroup() {
  const context = React.useContext(ConnectedButtonGroupContext);
  if (!context) {
    throw new Error("ConnectedButtonGroupItem must be used within a ConnectedButtonGroup");
  }
  return context;
}

/**
 * ConnectedButtonGroup container variants
 */
const connectedButtonGroupVariants = cva(
  [
    "inline-flex items-stretch",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      colorStyle: {
        filled: "",
        tonal: "",
        outlined: "border border-border",
      },
      size: {
        xs: "h-7 rounded-[var(--radius-sm)]",
        sm: "h-8 rounded-[var(--radius)]",
        md: "h-9 rounded-[var(--radius)]",
        lg: "h-11 rounded-[var(--radius-md)]",
        xl: "h-13 rounded-[var(--radius-lg)]",
      },
    },
    defaultVariants: {
      colorStyle: "outlined",
      size: "md",
    },
  }
);

/**
 * ConnectedButtonGroupItem variants
 */
const connectedButtonGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-medium select-none",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:z-10 focus-visible:relative",
    "disabled:pointer-events-none disabled:opacity-50",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // SVG icon sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // Divider between items
    "border-r last:border-r-0",
  ].join(" "),
  {
    variants: {
      colorStyle: {
        filled: "",
        tonal: "",
        outlined: "",
      },
      size: {
        xs: "px-2.5 text-xs [&_svg]:size-3.5",
        sm: "px-3 text-sm [&_svg]:size-4",
        md: "px-4 text-sm [&_svg]:size-4",
        lg: "px-5 text-base [&_svg]:size-5",
        xl: "px-6 text-lg [&_svg]:size-6",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Filled - unselected
      {
        colorStyle: "filled",
        selected: false,
        className: "bg-muted text-muted-foreground hover:bg-muted/80 border-r-muted-foreground/20",
      },
      // Filled - selected
      {
        colorStyle: "filled",
        selected: true,
        className: "bg-primary text-primary-foreground hover:bg-primary/90 border-r-primary-foreground/20",
      },
      // Tonal - unselected
      {
        colorStyle: "tonal",
        selected: false,
        className: "bg-muted text-muted-foreground hover:bg-muted/80 border-r-muted-foreground/20",
      },
      // Tonal - selected
      {
        colorStyle: "tonal",
        selected: true,
        className: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-r-secondary-foreground/20",
      },
      // Outlined - unselected
      {
        colorStyle: "outlined",
        selected: false,
        className: "bg-transparent text-foreground hover:bg-accent border-r-border",
      },
      // Outlined - selected
      {
        colorStyle: "outlined",
        selected: true,
        className: "bg-accent text-accent-foreground border-r-border",
      },
    ],
    defaultVariants: {
      colorStyle: "outlined",
      size: "md",
      selected: false,
    },
  }
);

export interface ConnectedButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof connectedButtonGroupVariants> {
  /**
   * Selection mode
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
   * Button group items
   */
  children: React.ReactNode;
}

/**
 * ConnectedButtonGroup - Segmented buttons with merged borders and selection state
 *
 * @example
 * ```tsx
 * // Single select
 * <ConnectedButtonGroup value={view} onValueChange={setView}>
 *   <ConnectedButtonGroupItem value="grid">Grid</ConnectedButtonGroupItem>
 *   <ConnectedButtonGroupItem value="list">List</ConnectedButtonGroupItem>
 * </ConnectedButtonGroup>
 *
 * // Multiple select
 * <ConnectedButtonGroup selectionMode="multiple" value={filters} onValueChange={setFilters}>
 *   <ConnectedButtonGroupItem value="active">Active</ConnectedButtonGroupItem>
 *   <ConnectedButtonGroupItem value="completed">Completed</ConnectedButtonGroupItem>
 * </ConnectedButtonGroup>
 * ```
 */
const ConnectedButtonGroup = React.forwardRef<HTMLDivElement, ConnectedButtonGroupProps>(
  (
    {
      className,
      colorStyle,
      size,
      selectionMode = "single",
      value: controlledValue,
      defaultValue,
      onValueChange,
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
      colorStyle: colorStyle ?? null,
      size: size ?? null,
      selectionMode,
      selectedValues,
      onValueChange: handleValueChange,
    };

    return (
      <ConnectedButtonGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-slot="connected-button-group"
          className={cn(connectedButtonGroupVariants({ colorStyle, size }), className)}
          {...props}
        >
          {children}
        </div>
      </ConnectedButtonGroupContext.Provider>
    );
  }
);
ConnectedButtonGroup.displayName = "ConnectedButtonGroup";

export interface ConnectedButtonGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Value for this item (used for selection)
   */
  value: string;
}

/**
 * ConnectedButtonGroupItem - Individual item within a ConnectedButtonGroup
 */
const ConnectedButtonGroupItem = React.forwardRef<HTMLButtonElement, ConnectedButtonGroupItemProps>(
  ({ className, value, children, onClick, ...props }, ref) => {
    const { colorStyle, size, selectedValues, onValueChange } = useConnectedButtonGroup();
    const isSelected = selectedValues.has(value);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onValueChange(value);
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        data-slot="connected-button-group-item"
        data-state={isSelected ? "on" : "off"}
        aria-pressed={isSelected}
        className={cn(
          connectedButtonGroupItemVariants({
            colorStyle: colorStyle ?? "outlined",
            size: size ?? "md",
            selected: isSelected,
          }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ConnectedButtonGroupItem.displayName = "ConnectedButtonGroupItem";

export {
  ConnectedButtonGroup,
  ConnectedButtonGroupItem,
  connectedButtonGroupVariants,
  connectedButtonGroupItemVariants,
};
