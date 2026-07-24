"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, Menu, X, PanelLeftClose, PanelLeft } from "lucide-react";

import { cn } from "../../lib/utils";

// ============================================================================
// Navigation Context
// ============================================================================

interface NavigationContextValue {
  /** Currently active navigation item ID */
  activeItem: string | undefined;
  /** Set the active navigation item */
  setActiveItem: (id: string) => void;
  /** Whether the navrail is collapsed (icons only) */
  collapsed: boolean;
  /** Set the collapsed state of the navrail */
  setCollapsed: (collapsed: boolean) => void;
  /** Whether the mobile drawer is open */
  mobileOpen: boolean;
  /** Set the mobile drawer open state */
  setMobileOpen: (open: boolean) => void;
}

const NavigationContext = React.createContext<NavigationContextValue | undefined>(undefined);

/**
 * Hook to access navigation context
 */
function useNavigation() {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

/**
 * Hook to optionally access navigation context (doesn't throw if not found)
 */
function useNavigationOptional() {
  return React.useContext(NavigationContext);
}

// ============================================================================
// Navigation Provider
// ============================================================================

export interface NavigationProviderProps {
  children: React.ReactNode;
  /** Default active item ID */
  defaultActiveItem?: string;
  /** Controlled active item ID */
  activeItem?: string;
  /** Callback when active item changes */
  onActiveItemChange?: (id: string) => void;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Default mobile open state */
  defaultMobileOpen?: boolean;
  /** Controlled mobile open state */
  mobileOpen?: boolean;
  /** Callback when mobile open state changes */
  onMobileOpenChange?: (open: boolean) => void;
}

function NavigationProvider({
  children,
  defaultActiveItem,
  activeItem: controlledActiveItem,
  onActiveItemChange,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  defaultMobileOpen = false,
  mobileOpen: controlledMobileOpen,
  onMobileOpenChange,
}: NavigationProviderProps) {
  const [internalActiveItem, setInternalActiveItem] = React.useState<string | undefined>(defaultActiveItem);
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const [internalMobileOpen, setInternalMobileOpen] = React.useState(defaultMobileOpen);

  const activeItem = controlledActiveItem ?? internalActiveItem;
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const mobileOpen = controlledMobileOpen ?? internalMobileOpen;

  const setActiveItem = React.useCallback((id: string) => {
    setInternalActiveItem(id);
    onActiveItemChange?.(id);
  }, [onActiveItemChange]);

  const setCollapsed = React.useCallback((value: boolean) => {
    setInternalCollapsed(value);
    onCollapsedChange?.(value);
  }, [onCollapsedChange]);

  const setMobileOpen = React.useCallback((value: boolean) => {
    setInternalMobileOpen(value);
    onMobileOpenChange?.(value);
  }, [onMobileOpenChange]);

  const contextValue = React.useMemo(() => ({
    activeItem,
    setActiveItem,
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
  }), [activeItem, setActiveItem, collapsed, setCollapsed, mobileOpen, setMobileOpen]);

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

// ============================================================================
// Navbar Variants
// ============================================================================

const navbarVariants = cva(
  [
    "flex items-center w-full pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
    "bg-background",
    "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "h-16 px-4 gap-4",
        prominent: "h-24 px-6 gap-6 flex-wrap",
        dense: "h-12 px-4 gap-3",
        centered: "h-16 px-4 gap-4 justify-between",
        split: "h-16 px-4 gap-4",
      },
      sticky: {
        true: "sticky top-0 z-40",
        false: "",
      },
      bordered: {
        true: "border-b border-border",
        false: "",
      },
      elevated: {
        true: "shadow-[var(--elevation-2)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      sticky: false,
      bordered: true,
      elevated: false,
    },
  }
);

// ============================================================================
// Navbar Components
// ============================================================================

export interface NavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  /** Callback when mobile menu button is clicked */
  onMobileMenuClick?: () => void;
  /** Show the mobile menu button */
  showMobileMenuButton?: boolean;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, variant, sticky, bordered, elevated, onMobileMenuClick, showMobileMenuButton = true, children, ...props }, ref) => {
    const navigationContext = useNavigationOptional();

    const handleMobileMenuClick = React.useCallback(() => {
      if (onMobileMenuClick) {
        onMobileMenuClick();
      } else if (navigationContext) {
        navigationContext.setMobileOpen(!navigationContext.mobileOpen);
      }
    }, [onMobileMenuClick, navigationContext]);

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Main navigation"
        data-slot="navbar"
        className={cn(navbarVariants({ variant, sticky, bordered, elevated }), className)}
        {...props}
      >
        {showMobileMenuButton && (
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center",
              "size-11 rounded-[var(--radius)]",
              "text-foreground",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-colors duration-[var(--motion-duration-short)]",
              "lg:hidden"
            )}
            onClick={handleMobileMenuClick}
            aria-label="Toggle navigation menu"
            aria-expanded={navigationContext?.mobileOpen ?? false}
          >
            <Menu className="size-5" />
          </button>
        )}
        {children}
      </nav>
    );
  }
);
Navbar.displayName = "Navbar";

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use slot pattern for custom element */
  asChild?: boolean;
}

const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        data-slot="navbar-brand"
        className={cn("flex items-center gap-2 shrink-0", className)}
        {...props}
      />
    );
  }
);
NavbarBrand.displayName = "NavbarBrand";

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Position of content within navbar */
  position?: "start" | "center" | "end";
}

const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps>(
  ({ className, position = "start", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="navbar-content"
        data-position={position}
        className={cn(
          "flex items-center gap-1",
          position === "start" && "justify-start",
          position === "center" && "flex-1 justify-center",
          position === "end" && "ml-auto justify-end",
          className
        )}
        {...props}
      />
    );
  }
);
NavbarContent.displayName = "NavbarContent";

export interface NavbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavbarActions = React.forwardRef<HTMLDivElement, NavbarActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="navbar-actions"
        className={cn("flex items-center gap-2 ml-auto", className)}
        {...props}
      />
    );
  }
);
NavbarActions.displayName = "NavbarActions";

// ============================================================================
// Navrail Variants
// ============================================================================

const navrailVariants = cva(
  [
    "flex flex-col",
    "bg-background",
    "transition-all duration-[var(--motion-duration-medium)] ease-[var(--motion-easing-standard)]",
    "h-full",
    "shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        standard: "w-60 border-r border-border",
        compact: "w-[4.5rem] border-r border-border",
        mini: "w-[3.5rem] border-r border-border hover:w-60 group/navrail",
        floating: [
          "w-60 m-3 rounded-[var(--radius-lg)]",
          "border border-border",
          "shadow-[var(--elevation-3)]",
        ].join(" "),
        inset: "w-60 mx-3 my-3",
      },
      position: {
        left: "",
        right: "order-last",
      },
      collapsible: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Collapsed state sizing
      { collapsible: true, variant: "standard", className: "data-[collapsed=true]:w-[4.5rem]" },
      { collapsible: true, variant: "floating", className: "data-[collapsed=true]:w-[4.5rem]" },
      { collapsible: true, variant: "inset", className: "data-[collapsed=true]:w-[4.5rem]" },
    ],
    defaultVariants: {
      variant: "standard",
      position: "left",
      collapsible: false,
    },
  }
);

// ============================================================================
// Navrail Components
// ============================================================================

export interface NavrailProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navrailVariants> {
  /** Default collapsed state (uncontrolled) */
  defaultCollapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;
}

const Navrail = React.forwardRef<HTMLElement, NavrailProps>(
  ({ 
    className, 
    variant, 
    position, 
    collapsible,
    defaultCollapsed,
    children, 
    ...props 
  }, ref) => {
    const navigationContext = useNavigationOptional();
    const collapsed = navigationContext?.collapsed ?? defaultCollapsed ?? false;

    return (
      <aside
        ref={ref}
        role="navigation"
        aria-label="Side navigation"
        data-slot="navrail"
        data-collapsed={collapsed}
        data-variant={variant}
        className={cn(
          navrailVariants({ variant, position, collapsible }),
          "hidden md:flex",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Navrail.displayName = "Navrail";

export interface NavrailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavrailHeader = React.forwardRef<HTMLDivElement, NavrailHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="navrail-header"
        className={cn(
          "flex items-center gap-2 px-4 py-4",
          "border-b border-border",
          "shrink-0",
          className
        )}
        {...props}
      />
    );
  }
);
NavrailHeader.displayName = "NavrailHeader";

export interface NavrailContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavrailContent = React.forwardRef<HTMLDivElement, NavrailContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="navrail-content"
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden",
          "py-2",
          className
        )}
        {...props}
      />
    );
  }
);
NavrailContent.displayName = "NavrailContent";

export interface NavrailFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavrailFooter = React.forwardRef<HTMLDivElement, NavrailFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="navrail-footer"
        className={cn(
          "flex items-center gap-2 px-4 py-4",
          "border-t border-border",
          "mt-auto shrink-0",
          className
        )}
        {...props}
      />
    );
  }
);
NavrailFooter.displayName = "NavrailFooter";

export interface NavrailCollapseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Override the collapsed state indicator */
  collapsed?: boolean;
}

const NavrailCollapseButton = React.forwardRef<HTMLButtonElement, NavrailCollapseButtonProps>(
  ({ className, collapsed: collapsedProp, onClick, ...props }, ref) => {
    const navigationContext = useNavigationOptional();
    const collapsed = collapsedProp ?? navigationContext?.collapsed ?? false;

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (navigationContext) {
          navigationContext.setCollapsed(!collapsed);
        }
        onClick?.(e);
      },
      [navigationContext, collapsed, onClick]
    );

    return (
      <button
        ref={ref}
        type="button"
        data-slot="navrail-collapse-button"
        className={cn(
          "inline-flex items-center justify-center",
          "size-11 rounded-[var(--radius)]",
          "text-muted-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "transition-colors duration-[var(--motion-duration-short)]",
          "ml-auto",
          className
        )}
        onClick={handleClick}
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        aria-expanded={!collapsed}
        {...props}
      >
        {collapsed ? (
          <PanelLeft className="size-4" />
        ) : (
          <PanelLeftClose className="size-4" />
        )}
      </button>
    );
  }
);
NavrailCollapseButton.displayName = "NavrailCollapseButton";

// ============================================================================
// Navdrawer Variants
// ============================================================================

const navdrawerOverlayVariants = cva(
  [
    "fixed inset-0 z-50 overscroll-contain touch-none",
    "bg-black/50 backdrop-blur-sm",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ].join(" ")
);

const navdrawerContentVariants = cva(
  [
    "fixed z-50 inset-y-0 h-dvh overscroll-contain pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
    "flex flex-col",
    "bg-background",
    "shadow-[var(--elevation-5)]",
    "outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "duration-[var(--motion-duration-long)] ease-[var(--motion-easing-standard)]",
  ].join(" "),
  {
    variants: {
      anchor: {
        left: [
          "left-0",
          "border-r border-border",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ].join(" "),
        right: [
          "right-0",
          "border-l border-border",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ].join(" "),
      },
      size: {
        xs: "w-[15rem]",
        sm: "w-[18rem]",
        md: "w-[20rem]",
        lg: "w-[24rem]",
        xl: "w-[28rem]",
        full: "w-full",
      },
    },
    defaultVariants: {
      anchor: "left",
      size: "md",
    },
  }
);

// ============================================================================
// Navdrawer Components
// ============================================================================

export interface NavdrawerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>, "modal">,
    VariantProps<typeof navdrawerContentVariants> {
  /** Whether the drawer is open */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the drawer blocks interaction with background */
  modal?: boolean;
}

const NavdrawerContext = React.createContext<{
  anchor?: "left" | "right";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
}>({});

function Navdrawer({ open, onOpenChange, modal = true, anchor, size, children, ...props }: NavdrawerProps) {
  const navigationContext = useNavigationOptional();
  
  const resolvedOpen = open ?? navigationContext?.mobileOpen ?? false;
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      onOpenChange?.(newOpen);
      navigationContext?.setMobileOpen(newOpen);
    },
    [onOpenChange, navigationContext]
  );

  return (
    <NavdrawerContext.Provider value={{ anchor: anchor ?? undefined, size: size ?? undefined }}>
      <DialogPrimitive.Root
        data-slot="navdrawer"
        open={resolvedOpen}
        onOpenChange={handleOpenChange}
        modal={modal}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </NavdrawerContext.Provider>
  );
}

export interface NavdrawerTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {}

const NavdrawerTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  NavdrawerTriggerProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    data-slot="navdrawer-trigger"
    className={cn(className)}
    {...props}
  />
));
NavdrawerTrigger.displayName = "NavdrawerTrigger";

export interface NavdrawerPortalProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal> {}

function NavdrawerPortal({ ...props }: NavdrawerPortalProps) {
  return <DialogPrimitive.Portal data-slot="navdrawer-portal" {...props} />;
}

export interface NavdrawerOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const NavdrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  NavdrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="navdrawer-overlay"
    className={cn(navdrawerOverlayVariants(), className)}
    {...props}
  />
));
NavdrawerOverlay.displayName = "NavdrawerOverlay";

export interface NavdrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof navdrawerContentVariants> {
  /** Show the close button */
  showCloseButton?: boolean;
  /** Custom class for the overlay */
  overlayClassName?: string;
}

const NavdrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  NavdrawerContentProps
>(({ className, children, anchor: anchorProp, size: sizeProp, showCloseButton = true, overlayClassName, ...props }, ref) => {
  const context = React.useContext(NavdrawerContext);
  const anchor = anchorProp ?? context.anchor ?? "left";
  const size = sizeProp ?? context.size ?? "md";
  
  return (
    <NavdrawerPortal>
      <NavdrawerOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="navdrawer-content"
        className={cn(navdrawerContentVariants({ anchor, size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="navdrawer-close"
            className={cn(
              "absolute right-4 top-4",
              "inline-flex items-center justify-center",
              "size-11 rounded-[var(--radius)]",
              "text-muted-foreground",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-colors duration-[var(--motion-duration-short)]"
            )}
          >
            <X className="size-4" />
            <span className="sr-only">Close navigation</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </NavdrawerPortal>
  );
});
NavdrawerContent.displayName = "NavdrawerContent";

export interface NavdrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavdrawerHeader = React.forwardRef<HTMLDivElement, NavdrawerHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navdrawer-header"
      className={cn(
        "flex items-center gap-2 px-4 py-4",
        "border-b border-border",
        "shrink-0",
        className
      )}
      {...props}
    />
  )
);
NavdrawerHeader.displayName = "NavdrawerHeader";

export interface NavdrawerTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

const NavdrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  NavdrawerTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="navdrawer-title"
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
NavdrawerTitle.displayName = "NavdrawerTitle";

export interface NavdrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavdrawerFooter = React.forwardRef<HTMLDivElement, NavdrawerFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navdrawer-footer"
      className={cn(
        "flex items-center gap-2 px-4 py-4",
        "border-t border-border",
        "mt-auto shrink-0",
        className
      )}
      {...props}
    />
  )
);
NavdrawerFooter.displayName = "NavdrawerFooter";

const NavdrawerClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    data-slot="navdrawer-close"
    className={cn(className)}
    {...props}
  />
));
NavdrawerClose.displayName = "NavdrawerClose";

// ============================================================================
// Shared Navigation Item Variants
// ============================================================================

const navItemVariants = cva(
  [
    "flex items-center gap-3",
    "w-full px-3 py-2.5",
    "rounded-[var(--radius)]",
    "text-sm font-medium",
    "text-foreground",
    "outline-none",
    "select-none",
    "transition-all duration-[var(--motion-duration-short)] ease-[var(--motion-easing-standard)]",
    "cursor-pointer",
    // Hover state
    "hover:bg-accent hover:text-accent-foreground",
    // Focus visible
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    // Active/pressed
    "active:scale-[0.98]",
    // Disabled state
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // Icon sizing
    "[&_svg]:size-5 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      active: {
        true: "bg-primary/10 text-primary hover:bg-primary/15",
        false: "",
      },
      collapsed: {
        true: "justify-center px-0",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
    },
  }
);

const navSectionVariants = cva(
  [
    "flex flex-col gap-0.5",
    "px-2 py-2",
  ].join(" ")
);

const navSectionHeaderVariants = cva(
  [
    "px-3 py-2",
    "text-xs font-medium uppercase tracking-wider",
    "text-muted-foreground",
    "select-none",
  ].join(" ")
);

const navDividerVariants = cva(
  [
    "h-px",
    "mx-2 my-2",
    "bg-border",
  ].join(" ")
);

// ============================================================================
// Shared Navigation Components
// ============================================================================

export interface NavItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "id">,
    VariantProps<typeof navItemVariants> {
  /** Unique identifier for the item */
  id: string;
  /** Display label */
  label: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Link href (makes item an anchor) */
  href?: string;
  /** Badge content */
  badge?: React.ReactNode;
  /** Use slot pattern */
  asChild?: boolean;
}

const NavItem = React.forwardRef<HTMLButtonElement, NavItemProps>(
  ({ className, id, label, icon, href, badge, active: activeProp, collapsed: collapsedProp, asChild = false, onClick, ...props }, ref) => {
    const navigationContext = useNavigationOptional();
    const isActive = activeProp ?? (navigationContext?.activeItem === id);
    const isCollapsed = collapsedProp ?? navigationContext?.collapsed ?? false;

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        navigationContext?.setActiveItem(id);
        onClick?.(e);
      },
      [navigationContext, id, onClick]
    );

    const content = (
      <>
        {icon}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-left">{label}</span>
            {badge && (
              <span className="shrink-0">{badge}</span>
            )}
          </>
        )}
      </>
    );

    if (href && !asChild) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          data-slot="nav-item"
          data-active={isActive}
          aria-current={isActive ? "page" : undefined}
          className={cn(navItemVariants({ active: isActive, collapsed: isCollapsed }), className)}
          onClick={handleClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        data-slot="nav-item"
        data-active={isActive}
        aria-current={isActive ? "page" : undefined}
        className={cn(navItemVariants({ active: isActive, collapsed: isCollapsed }), className)}
        onClick={handleClick}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
NavItem.displayName = "NavItem";

export interface NavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title (optional) */
  title?: string;
  /** Whether the section is collapsible */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
}

const NavSection = React.forwardRef<HTMLDivElement, NavSectionProps>(
  ({ className, title, collapsible = false, defaultCollapsed = false, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(!defaultCollapsed);
    const navigationContext = useNavigationOptional();
    const isCollapsed = navigationContext?.collapsed ?? false;

    return (
      <div
        ref={ref}
        data-slot="nav-section"
        className={cn(navSectionVariants(), className)}
        {...props}
      >
        {title && !isCollapsed && (
          collapsible ? (
            <button
              type="button"
              className={cn(
                navSectionHeaderVariants(),
                "flex items-center justify-between w-full",
                "cursor-pointer hover:text-foreground",
                "transition-colors duration-[var(--motion-duration-short)]"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <span>{title}</span>
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-[var(--motion-duration-short)]",
                  isOpen && "rotate-90"
                )}
              />
            </button>
          ) : (
            <div className={navSectionHeaderVariants()}>{title}</div>
          )
        )}
        {(!collapsible || isOpen) && (
          <div className="flex flex-col gap-0.5">
            {children}
          </div>
        )}
      </div>
    );
  }
);
NavSection.displayName = "NavSection";

export interface NavDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavDivider = React.forwardRef<HTMLDivElement, NavDividerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="nav-divider"
      role="separator"
      className={cn(navDividerVariants(), className)}
      {...props}
    />
  )
);
NavDivider.displayName = "NavDivider";

export interface NavBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant */
  variant?: "default" | "primary" | "destructive" | "outline";
}

const NavBadge = React.forwardRef<HTMLSpanElement, NavBadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      data-slot="nav-badge"
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-5 h-5 px-1.5",
        "rounded-full",
        "text-xs font-medium",
        variant === "default" && "bg-muted text-muted-foreground",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground",
        variant === "outline" && "border border-border text-foreground",
        className
      )}
      {...props}
    />
  )
);
NavBadge.displayName = "NavBadge";

// ============================================================================
// Exports
// ============================================================================

export {
  // Context & Provider
  NavigationProvider,
  useNavigation,
  useNavigationOptional,
  // Navbar
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  // Navrail
  Navrail,
  NavrailHeader,
  NavrailContent,
  NavrailFooter,
  NavrailCollapseButton,
  // Navdrawer
  Navdrawer,
  NavdrawerTrigger,
  NavdrawerPortal,
  NavdrawerOverlay,
  NavdrawerContent,
  NavdrawerHeader,
  NavdrawerTitle,
  NavdrawerFooter,
  NavdrawerClose,
  // Shared
  NavItem,
  NavSection,
  NavDivider,
  NavBadge,
  // Variants
  navbarVariants,
  navrailVariants,
  navdrawerOverlayVariants,
  navdrawerContentVariants,
  navItemVariants,
  navSectionVariants,
  navSectionHeaderVariants,
  navDividerVariants,
};
