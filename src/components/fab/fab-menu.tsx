import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { fabVariants } from "./index";

/**
 * FAB Menu Item variants
 */
const fabMenuItemVariants = cva(
  [
    "inline-flex items-center gap-3",
    "font-medium select-none whitespace-nowrap",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    "active:scale-95",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      colorStyle: {
        filled: [
          "bg-primary text-primary-foreground",
          "shadow-[var(--elevation-2)]",
          "hover:shadow-[var(--elevation-3)] hover:bg-primary/90",
        ].join(" "),
        tonal: [
          "bg-secondary text-secondary-foreground",
          "shadow-[var(--elevation-2)]",
          "hover:shadow-[var(--elevation-3)] hover:bg-secondary/80",
        ].join(" "),
        elevated: [
          "bg-[hsl(var(--surface-container-low))] text-primary",
          "shadow-[var(--elevation-2)]",
          "hover:shadow-[var(--elevation-3)] hover:bg-[hsl(var(--surface-container))]",
        ].join(" "),
        tertiary: [
          "bg-[hsl(var(--tertiary))] text-[hsl(var(--tertiary-foreground))]",
          "shadow-[var(--elevation-2)]",
          "hover:shadow-[var(--elevation-3)] hover:bg-[hsl(var(--tertiary))]/90",
        ].join(" "),
      },
      size: {
        sm: "h-10 px-3 text-sm rounded-full [&_svg]:size-5",
        md: "h-12 px-4 text-sm rounded-full [&_svg]:size-5",
      },
    },
    defaultVariants: {
      colorStyle: "tonal",
      size: "sm",
    },
  }
);

export interface FABMenuItem {
  /**
   * Unique identifier for the menu item
   */
  id: string;
  /**
   * Icon to display
   */
  icon: React.ReactNode;
  /**
   * Label text
   */
  label: string;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
}

export interface FABMenuProps
  extends VariantProps<typeof fabVariants> {
  /**
   * Icon to display when menu is closed
   */
  icon: React.ReactNode;
  /**
   * Icon to display when menu is open (optional, defaults to a close/X icon rotation)
   */
  openIcon?: React.ReactNode;
  /**
   * Menu items (2-6 items recommended)
   */
  items: FABMenuItem[];
  /**
   * Direction the menu expands
   */
  direction?: "up" | "down" | "left" | "right";
  /**
   * Controlled open state
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Accessible label for the FAB trigger
   */
  label?: string;
  /**
   * Color style for menu items (inherits from FAB if not specified)
   */
  itemColorStyle?: VariantProps<typeof fabMenuItemVariants>["colorStyle"];
  /**
   * Custom positioning styles when position is set to a fixed value
   */
  positionStyle?: React.CSSProperties;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * FABMenu - Floating Action Button with expandable menu
 *
 * Opens from a FAB to display 2-6 related actions.
 * Follows Material Design 3 specifications with staggered animations.
 *
 * @example
 * ```tsx
 * <FABMenu
 *   icon={<PlusIcon />}
 *   label="Actions"
 *   position="bottom-right"
 *   items={[
 *     { id: '1', icon: <FileIcon />, label: 'New file', onClick: () => {} },
 *     { id: '2', icon: <FolderIcon />, label: 'New folder', onClick: () => {} },
 *   ]}
 * />
 * ```
 */
const FABMenu = React.forwardRef<HTMLDivElement, FABMenuProps>(
  (
    {
      className,
      colorStyle = "filled",
      size = "md",
      shape = "round",
      position = "none",
      positionStyle,
      icon,
      openIcon,
      items,
      direction = "up",
      open: controlledOpen,
      onOpenChange,
      label,
      itemColorStyle,
      style,
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const menuRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
      const newOpen = !isOpen;
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    const handleClose = () => {
      if (!isControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    };

    const handleItemClick = (item: FABMenuItem) => {
      if (!item.disabled) {
        item.onClick?.();
        handleClose();
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        handleClose();
        triggerRef.current?.focus();
      }
    };

    // Close on outside click
    React.useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          handleClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Direction-based positioning
    const directionClasses = {
      up: "flex-col-reverse bottom-full mb-3",
      down: "flex-col top-full mt-3",
      left: "flex-row-reverse right-full mr-3",
      right: "flex-row left-full ml-3",
    };

    const positionClasses = {
      none: "",
      "bottom-right": "fixed bottom-4 right-4 z-50",
      "bottom-left": "fixed bottom-4 left-4 z-50",
      "top-right": "fixed top-4 right-4 z-50",
      "top-left": "fixed top-4 left-4 z-50",
    };

    const combinedStyle =
      position !== "none" && positionStyle
        ? { ...style, ...positionStyle }
        : style;

    // Determine effective item color style
    const effectiveItemColorStyle = itemColorStyle ?? "tonal";

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex",
          positionClasses[position ?? "none"],
          className
        )}
        style={combinedStyle}
        onKeyDown={handleKeyDown}
      >
        {/* Menu items container */}
        <div
          ref={menuRef}
          className={cn(
            "absolute flex gap-3 items-center z-50",
            directionClasses[direction],
            // Animation
            "transition-all duration-[var(--motion-duration-long)] ease-[var(--motion-easing-emphasized)]",
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          role="menu"
          aria-orientation={
            direction === "up" || direction === "down"
              ? "vertical"
              : "horizontal"
          }
          aria-hidden={!isOpen}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => handleItemClick(item)}
              className={cn(
                fabMenuItemVariants({
                  colorStyle: effectiveItemColorStyle,
                  size: size === "lg" ? "md" : "sm",
                }),
                // Staggered animation delay
                "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-emphasized)]",
                isOpen
                  ? "translate-y-0 opacity-100"
                  : direction === "up"
                    ? "translate-y-4 opacity-0"
                    : direction === "down"
                      ? "-translate-y-4 opacity-0"
                      : direction === "left"
                        ? "translate-x-4 opacity-0"
                        : "-translate-x-4 opacity-0"
              )}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
              }}
              aria-label={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* FAB Trigger */}
        <button
          ref={triggerRef}
          type="button"
          data-slot="fab-menu-trigger"
          aria-label={label}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={handleToggle}
          className={cn(
            fabVariants({ colorStyle, size, shape, position: "none" }),
            // Rotation animation for icon
            "transition-transform duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
            isOpen && "rotate-45"
          )}
        >
          {isOpen && openIcon ? openIcon : icon}
        </button>
      </div>
    );
  }
);
FABMenu.displayName = "FABMenu";

export { FABMenu, fabMenuItemVariants };
