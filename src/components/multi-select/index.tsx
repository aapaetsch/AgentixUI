"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "../../lib/utils";
import { Chip, type ChipColor, type ChipVariant } from "../chip";
import { Checkbox } from "../checkbox";
import { Spinner } from "../spinner";

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * MultiSelect root variants
 */
const multiSelectVariants = cva(
  [
    "relative w-full",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * MultiSelect trigger variants
 */
const multiSelectTriggerVariants = cva(
  [
    // Base styles
    "flex w-full items-center justify-between gap-2",
    "rounded-[var(--radius)]",
    "border-2 border-border bg-transparent",
    "text-foreground",
    // Focus styles
    "outline-none",
    "focus:border-ring",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Invalid state
    "data-[invalid=true]:border-destructive",
    // M3 Motion
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    // Hover
    "hover:border-accent-foreground/20",
    // Cursor
    "cursor-pointer",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "min-h-9 px-2 py-1 text-base",
        sm: "min-h-10 px-3 py-1.5 text-base",
        md: "min-h-11 px-3 py-2 text-base",
        lg: "min-h-[3rem] px-4 py-2.5 text-base",
        xl: "min-h-[3.5rem] px-5 py-3 text-lg",
      },
      variant: {
        default: "",
        outlined: "border-primary",
        filled: "bg-muted border-transparent",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

/**
 * MultiSelect content (dropdown) variants
 */
const multiSelectContentVariants = cva(
  [
    "z-50 overflow-hidden",
    "rounded-[var(--radius)]",
    "border border-border bg-popover text-popover-foreground",
    "shadow-lg",
    // Animation
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=top]:slide-in-from-bottom-2",
    // Transform origin
    "origin-[var(--radix-popover-content-transform-origin)]",
    // Backdrop blur
    "backdrop-blur-sm",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "min-w-[180px]",
        sm: "min-w-[200px]",
        md: "min-w-[220px]",
        lg: "min-w-[260px]",
        xl: "min-w-[300px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * MultiSelect item variants
 */
const multiSelectItemVariants = cva(
  [
    "relative flex w-full cursor-pointer select-none items-center gap-2",
    "rounded-[var(--radius-sm)] py-2 px-3",
    "text-sm outline-none",
    // Hover/focus states
    "hover:bg-accent/50",
    "focus:bg-accent focus:text-accent-foreground",
    // Selected state
    "data-[selected=true]:bg-primary/10",
    // Disabled state
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
    // M3 Motion
    "transition-all duration-150 ease-in",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "py-1 px-2 text-sm min-h-11",
        sm: "py-1.5 px-2.5 text-sm min-h-11",
        md: "py-2 px-3 text-sm min-h-11",
        lg: "py-2.5 px-3.5 text-base min-h-[48px]",
        xl: "py-3 px-4 text-lg min-h-[56px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * MultiSelect group variants
 */
const multiSelectGroupVariants = cva(
  [
    "py-1",
  ].join(" "),
  {
    variants: {
      depth: {
        0: "",
        1: "pl-4",
        2: "pl-8",
        3: "pl-12",
      },
    },
    defaultVariants: {
      depth: 0,
    },
  }
);

/**
 * MultiSelect label variants
 */
const multiSelectLabelVariants = cva(
  [
    "px-3 py-1.5",
    "text-xs font-semibold uppercase tracking-wider",
    "text-muted-foreground",
  ].join(" "),
  {
    variants: {
      depth: {
        0: "",
        1: "pl-7",
        2: "pl-11",
        3: "pl-15",
      },
    },
    defaultVariants: {
      depth: 0,
    },
  }
);

/**
 * MultiSelect search input variants
 */
const multiSelectSearchInputVariants = cva(
  [
    "flex w-full",
    "bg-transparent",
    "text-foreground placeholder:text-muted-foreground",
    "outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "h-9 text-base",
        sm: "h-10 text-base",
        md: "h-11 text-base",
        lg: "h-10 text-base",
        xl: "h-11 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

interface MultiSelectOption<T = string> {
  /** Unique value for the option */
  value: T;
  /** Display label for the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Optional description/secondary text */
  description?: string;
  /** Group name this option belongs to */
  group?: string;
  /** Subgroup name within the group */
  subgroup?: string;
}

interface MultiSelectProps<T = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof multiSelectTriggerVariants> {
  /** Array of options to display */
  options: MultiSelectOption<T>[];
  /** Currently selected values (controlled) */
  value?: T[];
  /** Default selected values (uncontrolled) */
  defaultValue?: T[];
  /** Callback when values change */
  onValueChange?: (values: T[]) => void;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Placeholder text when no items selected */
  placeholder?: string;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Whether the multi-select is disabled */
  disabled?: boolean;
  /** Whether to show error/invalid state */
  invalid?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether to show "Select All" option */
  showSelectAll?: boolean;
  /** Label for select all checkbox */
  selectAllLabel?: string;
  /** Whether to show checkmark icon for selected items */
  showSelectedIcon?: boolean;
  /** Maximum number of visible tags before showing count */
  maxVisibleTags?: number;
  /** Visual variant used for selected chips rendered in the trigger */
  chipVariant?: ChipVariant;
  /** Semantic color used for selected chips rendered in the trigger */
  chipColor?: ChipColor;
  /** Custom filter function */
  filterOption?: (option: MultiSelectOption<T>, search: string) => boolean;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback to load more items (for infinite scroll) */
  loadMore?: () => Promise<void>;
  /** Whether there are more items to load */
  hasMore?: boolean;
  /** Custom renderer for option items */
  customRenderer?: (option: MultiSelectOption<T>, isSelected: boolean) => React.ReactNode;
  /** Name for form submission */
  name?: string;
  /** Whether to enable virtualization (auto-enabled for 50+ options) */
  virtualize?: boolean;
  /** Width of the dropdown (matches trigger by default) */
  dropdownWidth?: string | number;
  /** Additional class for the trigger */
  triggerClassName?: string;
  /** Additional class for the content/dropdown */
  contentClassName?: string;
}

// ============================================================================
// Context
// ============================================================================

interface MultiSelectContextValue<T = string> {
  value: T[];
  onValueChange: (values: T[]) => void;
  options: MultiSelectOption<T>[];
  filteredOptions: MultiSelectOption<T>[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  showSelectedIcon: boolean;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  highlightedIndex: number | null;
  setHighlightedIndex: (index: number | null) => void;
  toggleOption: (optionValue: T) => void;
  isSelected: (optionValue: T) => boolean;
  customRenderer?: (option: MultiSelectOption<T>, isSelected: boolean) => React.ReactNode;
}

const MultiSelectContext = React.createContext<MultiSelectContextValue<unknown> | null>(null);

function useMultiSelectContext<T = string>() {
  const context = React.useContext(MultiSelectContext);
  if (!context) {
    throw new Error("MultiSelect compound components must be used within a MultiSelect");
  }
  return context as MultiSelectContextValue<T>;
}

// ============================================================================
// Components
// ============================================================================

/**
 * MultiSelect - A multi-selection component with tag display
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   options={[
 *     { value: "apple", label: "Apple" },
 *     { value: "banana", label: "Banana" },
 *   ]}
 *   placeholder="Select fruits..."
 *   onValueChange={(values) => console.log(values)}
 * />
 * ```
 */
function MultiSelectRoot<T = string>(
  {
    className,
    options,
    value: controlledValue,
    defaultValue = [],
    onValueChange,
    onOpenChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    disabled = false,
    invalid = false,
    error,
    showSelectAll = false,
    selectAllLabel = "Select all",
    showSelectedIcon = true,
    maxVisibleTags = 10,
    chipVariant = "input",
    chipColor = "default",
    filterOption,
    isLoading = false,
    loadMore,
    hasMore = false,
    customRenderer,
    name,
    size = "md",
    variant = "default",
    virtualize,
    dropdownWidth,
    triggerClassName,
    contentClassName,
    ...props
  }: MultiSelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  // State
  const [uncontrolledValue, setUncontrolledValue] = React.useState<T[]>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(null);

  // Refs
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Determine if controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  // Default filter function
  const defaultFilter = React.useCallback(
    (option: MultiSelectOption<T>, query: string) => {
      const searchLower = query.toLowerCase();
      return (
        option.label.toLowerCase().includes(searchLower) ||
        (typeof option.value === "string" &&
          option.value.toLowerCase().includes(searchLower)) ||
        (option.description?.toLowerCase().includes(searchLower) ?? false) ||
        (option.group?.toLowerCase().includes(searchLower) ?? false)
      );
    },
    []
  );

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    const filterFn = filterOption || defaultFilter;
    return options.filter((option) => filterFn(option, searchQuery));
  }, [options, searchQuery, filterOption, defaultFilter]);

  // Determine if virtualization should be enabled
  const shouldVirtualize = virtualize ?? filteredOptions.length > 50;

  // Handle value change
  const handleValueChange = React.useCallback(
    (newValues: T[]) => {
      if (!isControlled) {
        setUncontrolledValue(newValues);
      }
      onValueChange?.(newValues);
    },
    [isControlled, onValueChange]
  );

  // Toggle option selection
  const toggleOption = React.useCallback(
    (optionValue: T) => {
      const isSelected = value.some(
        (v) => JSON.stringify(v) === JSON.stringify(optionValue)
      );
      if (isSelected) {
        handleValueChange(
          value.filter((v) => JSON.stringify(v) !== JSON.stringify(optionValue))
        );
      } else {
        handleValueChange([...value, optionValue]);
      }
    },
    [value, handleValueChange]
  );

  // Check if option is selected
  const isSelected = React.useCallback(
    (optionValue: T) => {
      return value.some(
        (v) => JSON.stringify(v) === JSON.stringify(optionValue)
      );
    },
    [value]
  );

  // Handle open state change
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      onOpenChange?.(newOpen);
      if (newOpen) {
        // Focus search input when opening
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      } else {
        // Clear search when closing
        setSearchQuery("");
        setHighlightedIndex(null);
      }
    },
    [onOpenChange]
  );

  // Handle select all
  const handleSelectAll = React.useCallback(() => {
    const enabledOptions = filteredOptions.filter((opt) => !opt.disabled);
    const allSelected = enabledOptions.every((opt) => isSelected(opt.value));

    if (allSelected) {
      // Deselect all filtered options
      const filteredValues = enabledOptions.map((opt) => opt.value);
      handleValueChange(
        value.filter(
          (v) =>
            !filteredValues.some(
              (fv) => JSON.stringify(fv) === JSON.stringify(v)
            )
        )
      );
    } else {
      // Select all filtered options that aren't already selected
      const newValues = [...value];
      enabledOptions.forEach((opt) => {
        if (!isSelected(opt.value)) {
          newValues.push(opt.value);
        }
      });
      handleValueChange(newValues);
    }
  }, [filteredOptions, value, isSelected, handleValueChange]);

  // Check if all filtered options are selected
  const allFilteredSelected = React.useMemo(() => {
    const enabledOptions = filteredOptions.filter((opt) => !opt.disabled);
    return (
      enabledOptions.length > 0 &&
      enabledOptions.every((opt) => isSelected(opt.value))
    );
  }, [filteredOptions, isSelected]);

  // Handle clear all
  const handleClearAll = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleValueChange([]);
    },
    [handleValueChange]
  );

  // Remove single tag
  const handleRemoveTag = React.useCallback(
    (optionValue: T, e: React.MouseEvent) => {
      e.stopPropagation();
      toggleOption(optionValue);
    },
    [toggleOption]
  );

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open) {
            handleOpenChange(true);
          } else {
            setHighlightedIndex((prev) => {
              const max = filteredOptions.length - 1;
              if (prev === null) return 0;
              return prev < max ? prev + 1 : prev;
            });
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (open) {
            setHighlightedIndex((prev) => {
              if (prev === null) return filteredOptions.length - 1;
              return prev > 0 ? prev - 1 : prev;
            });
          }
          break;
        case "Enter":
        case " ":
          if (open && highlightedIndex !== null) {
            e.preventDefault();
            const option = filteredOptions[highlightedIndex];
            if (option && !option.disabled) {
              toggleOption(option.value);
            }
          } else if (!open && e.key === "Enter") {
            e.preventDefault();
            handleOpenChange(true);
          }
          break;
        case "Escape":
          e.preventDefault();
          handleOpenChange(false);
          triggerRef.current?.focus();
          break;
        case "Backspace":
          if (searchQuery === "" && value.length > 0) {
            // Remove last selected item
            handleValueChange(value.slice(0, -1));
          }
          break;
        case "a":
        case "A":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleSelectAll();
          }
          break;
      }
    },
    [
      disabled,
      open,
      filteredOptions,
      highlightedIndex,
      searchQuery,
      value,
      handleOpenChange,
      toggleOption,
      handleValueChange,
      handleSelectAll,
    ]
  );

  // Infinite scroll observer
  React.useEffect(() => {
    if (!loadMore || !hasMore || isLoading || !open) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading, open]);

  // Get selected options for display
  const selectedOptions = React.useMemo(() => {
    return value
      .map((v) => options.find((opt) => JSON.stringify(opt.value) === JSON.stringify(v)))
      .filter(Boolean) as MultiSelectOption<T>[];
  }, [value, options]);

  // Group options by group and subgroup
  const groupedOptions = React.useMemo(() => {
    const groups = new Map<string, Map<string, MultiSelectOption<T>[]>>();
    const ungrouped: MultiSelectOption<T>[] = [];

    filteredOptions.forEach((option) => {
      if (option.group) {
        if (!groups.has(option.group)) {
          groups.set(option.group, new Map());
        }
        const group = groups.get(option.group)!;
        const subgroupKey = option.subgroup || "__default__";
        if (!group.has(subgroupKey)) {
          group.set(subgroupKey, []);
        }
        group.get(subgroupKey)!.push(option);
      } else {
        ungrouped.push(option);
      }
    });

    return { groups, ungrouped };
  }, [filteredOptions]);

  // Context value
  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange: handleValueChange,
      options,
      filteredOptions,
      searchQuery,
      setSearchQuery,
      open,
      setOpen: handleOpenChange,
      disabled,
      showSelectedIcon,
      size: size || "md",
      highlightedIndex,
      setHighlightedIndex,
      toggleOption,
      isSelected,
      customRenderer,
    }),
    [
      value,
      handleValueChange,
      options,
      filteredOptions,
      searchQuery,
      open,
      handleOpenChange,
      disabled,
      showSelectedIcon,
      size,
      highlightedIndex,
      toggleOption,
      isSelected,
      customRenderer,
    ]
  );

  // Error ID for accessibility
  const errorId = error ? `${name || "multi-select"}-error` : undefined;

  return (
    <MultiSelectContext.Provider value={contextValue as MultiSelectContextValue<unknown>}>
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <div
          ref={ref}
          className={cn(multiSelectVariants({ size }), className)}
          data-slot="multi-select"
          {...props}
        >
          {/* Hidden input for form submission */}
          {name && (
            <input
              type="hidden"
              name={name}
              value={JSON.stringify(value)}
            />
          )}

          {/* Trigger */}
          <PopoverPrimitive.Trigger asChild>
            <button
              ref={triggerRef}
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-multiselectable="true"
              aria-invalid={invalid || undefined}
              aria-errormessage={errorId}
              disabled={disabled}
              className={cn(
                multiSelectTriggerVariants({ size, variant }),
                triggerClassName
              )}
              data-invalid={invalid || undefined}
              onKeyDown={handleKeyDown}
            >
              {/* Selected tags or placeholder */}
              <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-hidden">
                {selectedOptions.length === 0 ? (
                  <span className="text-muted-foreground">{placeholder}</span>
                ) : selectedOptions.length <= maxVisibleTags ? (
                  selectedOptions.map((option) => (
                    <Chip
                      key={String(option.value)}
                      variant={chipVariant}
                      color={chipColor}
                      size="sm"
                      dismissible
                      onDismiss={() => toggleOption(option.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="max-w-[150px]"
                    >
                      <span className="truncate">{option.label}</span>
                    </Chip>
                  ))
                ) : (
                  <>
                    {selectedOptions.slice(0, maxVisibleTags).map((option) => (
                      <Chip
                        key={String(option.value)}
                        variant={chipVariant}
                        color={chipColor}
                        size="sm"
                        dismissible
                        onDismiss={() => toggleOption(option.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[150px]"
                      >
                        <span className="truncate">{option.label}</span>
                      </Chip>
                    ))}
                    <span className="text-sm text-muted-foreground">
                      +{selectedOptions.length - maxVisibleTags} more
                    </span>
                  </>
                )}
              </div>

              {/* Clear button */}
              {value.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className={cn(
                    "flex items-center justify-center shrink-0",
                    "text-muted-foreground hover:text-foreground",
                    "transition-colors duration-150",
                    "rounded-full p-0.5 hover:bg-muted/80"
                  )}
                  aria-label="Clear all selections"
                >
                  <X className="size-4" />
                </button>
              )}

              {/* Chevron */}
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground",
                  "transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </button>
          </PopoverPrimitive.Trigger>

          {/* Error message */}
          {error && (
            <p
              id={errorId}
              className="mt-1 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Dropdown content */}
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              sideOffset={4}
              className={cn(
                multiSelectContentVariants({ size }),
                contentClassName
              )}
              style={{
                width: dropdownWidth || "var(--radix-popover-trigger-width)",
              }}
              onKeyDown={handleKeyDown}
            >
              {/* Search input */}
              <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(multiSelectSearchInputVariants({ size }))}
                  aria-label="Search options"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Select all option */}
              {showSelectAll && filteredOptions.length > 0 && (
                <div className="border-b border-border">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className={cn(
                      multiSelectItemVariants({ size }),
                      "w-full"
                    )}
                  >
                    <Checkbox
                      checked={allFilteredSelected}
                      onCheckedChange={handleSelectAll}
                      size="sm"
                      className="pointer-events-none"
                    />
                    <span className="font-medium">{selectAllLabel}</span>
                  </button>
                </div>
              )}

              {/* Options list */}
              <div
                ref={scrollContainerRef}
                className="max-h-[300px] overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
                role="listbox"
                aria-multiselectable="true"
              >
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {searchQuery
                      ? `No results for "${searchQuery}"`
                      : "No options available"}
                  </div>
                ) : shouldVirtualize ? (
                  <VirtualizedOptions<T>
                    options={filteredOptions}
                    scrollContainerRef={scrollContainerRef}
                  />
                ) : (
                  <>
                    {/* Ungrouped options */}
                    {groupedOptions.ungrouped.map((option, index) => (
                      <MultiSelectItem
                        key={String(option.value)}
                        option={option}
                        index={index}
                      />
                    ))}

                    {/* Grouped options */}
                    {Array.from(groupedOptions.groups.entries()).map(
                      ([groupName, subgroups]) => (
                        <MultiSelectGroup key={groupName} label={groupName}>
                          {Array.from(subgroups.entries()).map(
                            ([subgroupName, subgroupOptions]) =>
                              subgroupName === "__default__" ? (
                                subgroupOptions.map((option, idx) => (
                                  <MultiSelectItem
                                    key={String(option.value)}
                                    option={option}
                                    index={idx}
                                  />
                                ))
                              ) : (
                                <MultiSelectGroup
                                  key={subgroupName}
                                  label={subgroupName}
                                  depth={1}
                                >
                                  {subgroupOptions.map((option, idx) => (
                                    <MultiSelectItem
                                      key={String(option.value)}
                                      option={option}
                                      index={idx}
                                      depth={1}
                                    />
                                  ))}
                                </MultiSelectGroup>
                              )
                          )}
                        </MultiSelectGroup>
                      )
                    )}
                  </>
                )}

                {/* Infinite scroll sentinel */}
                {hasMore && (
                  <div ref={loadMoreRef} className="py-2 text-center">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="sm" />
                        <span className="text-sm text-muted-foreground">
                          Loading more...
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => loadMore?.()}
                        className="text-sm text-primary hover:underline"
                      >
                        Load more
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Loading overlay */}
              {isLoading && filteredOptions.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                  <Spinner size="md" />
                </div>
              )}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </div>
      </PopoverPrimitive.Root>
    </MultiSelectContext.Provider>
  );
}

/**
 * Virtualized options list for large datasets
 */
function VirtualizedOptions<T>({
  options,
  scrollContainerRef,
}: {
  options: MultiSelectOption<T>[];
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const option = options[virtualRow.index];
        return (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <MultiSelectItem option={option} index={virtualRow.index} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * MultiSelectGroup - Container for grouped options
 */
interface MultiSelectGroupProps {
  /** Group label */
  label: string;
  /** Nesting depth (0, 1, 2, or 3) */
  depth?: 0 | 1 | 2 | 3;
  /** Child elements */
  children: React.ReactNode;
}

function MultiSelectGroup({
  label,
  depth = 0,
  children,
}: MultiSelectGroupProps) {
  const labelId = React.useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cn(multiSelectGroupVariants({ depth }))}
    >
      <div
        id={labelId}
        className={cn(multiSelectLabelVariants({ depth }))}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

/**
 * MultiSelectItem - Individual option item
 */
interface MultiSelectItemProps<T = string> {
  /** The option to render */
  option: MultiSelectOption<T>;
  /** Index in the list (for highlighting) */
  index: number;
  /** Nesting depth */
  depth?: number;
}

function MultiSelectItem<T = string>({
  option,
  index,
  depth = 0,
}: MultiSelectItemProps<T>) {
  const {
    toggleOption,
    isSelected,
    showSelectedIcon,
    size,
    highlightedIndex,
    setHighlightedIndex,
    customRenderer,
  } = useMultiSelectContext<T>();

  const selected = isSelected(option.value);
  const highlighted = highlightedIndex === index;

  const handleClick = React.useCallback(() => {
    if (!option.disabled) {
      toggleOption(option.value);
    }
  }, [option.disabled, option.value, toggleOption]);

  // Custom renderer
  if (customRenderer) {
    return (
      <div
        role="option"
        aria-selected={selected}
        aria-disabled={option.disabled}
        data-selected={selected}
        data-disabled={option.disabled}
        data-highlighted={highlighted}
        className={cn(
          multiSelectItemVariants({ size }),
          highlighted && "bg-accent",
          depth > 0 && `pl-${4 + depth * 4}`
        )}
        onClick={handleClick}
        onMouseEnter={() => setHighlightedIndex(index)}
        onMouseLeave={() => setHighlightedIndex(null)}
      >
        {customRenderer(option, selected)}
      </div>
    );
  }

  return (
    <div
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled}
      data-selected={selected}
      data-disabled={option.disabled}
      data-highlighted={highlighted}
      className={cn(
        multiSelectItemVariants({ size }),
        highlighted && "bg-accent",
        depth > 0 && `pl-${4 + depth * 4}`
      )}
      onClick={handleClick}
      onMouseEnter={() => setHighlightedIndex(index)}
      onMouseLeave={() => setHighlightedIndex(null)}
    >
      {/* Checkbox or check icon */}
      {showSelectedIcon && (
        <span
          className={cn(
            "flex items-center justify-center size-4 shrink-0",
            selected ? "text-primary" : "text-transparent"
          )}
        >
          <Check className="size-4" />
        </span>
      )}

      {/* Icon */}
      {option.icon && (
        <span className="shrink-0">{option.icon}</span>
      )}

      {/* Label and description */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="truncate">{option.label}</span>
        {option.description && (
          <span className="text-xs text-muted-foreground truncate">
            {option.description}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * MultiSelectSeparator - Visual separator between options or groups
 */
function MultiSelectSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("border-b border-border my-2", className)}
      {...props}
    />
  );
}

// ============================================================================
// Forward ref wrapper with generic support
// ============================================================================

const MultiSelect = React.forwardRef(MultiSelectRoot) as <T = string>(
  props: MultiSelectProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

// ============================================================================
// Exports
// ============================================================================

export {
  MultiSelect,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectSeparator,
  useMultiSelectContext,
  multiSelectVariants,
  multiSelectTriggerVariants,
  multiSelectContentVariants,
  multiSelectItemVariants,
  multiSelectGroupVariants,
  multiSelectLabelVariants,
  multiSelectSearchInputVariants,
};

export type {
  MultiSelectOption,
  MultiSelectProps,
  MultiSelectGroupProps,
  MultiSelectItemProps,
};
