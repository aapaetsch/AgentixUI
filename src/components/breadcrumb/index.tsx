"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "../sheet";
import { Button } from "../button";

// ============================================================================
// Variants
// ============================================================================

/**
 * Breadcrumb container variants using CVA
 */
const breadcrumbVariants = cva(["relative"]);

/**
 * BreadcrumbList variants using CVA
 * Horizontal flex container for breadcrumb items
 */
const breadcrumbListVariants = cva([
  "flex flex-wrap items-center",
  "gap-1.5",
  "break-words",
  "text-sm text-muted-foreground",
  "sm:gap-2.5",
]);

/**
 * BreadcrumbItem variants using CVA
 */
const breadcrumbItemVariants = cva([
  "inline-flex items-center gap-1.5",
]);

/**
 * BreadcrumbLink variants using CVA
 * Styling for navigable breadcrumb links
 */
const breadcrumbLinkVariants = cva([
  "transition-colors duration-[var(--motion-duration-short)]",
  "hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "focus-visible:ring-offset-2 focus-visible:rounded-sm",
]);

/**
 * BreadcrumbPage variants using CVA
 * Styling for the current page indicator
 */
const breadcrumbPageVariants = cva([
  "font-normal text-foreground",
]);

/**
 * BreadcrumbSeparator variants using CVA
 */
const breadcrumbSeparatorVariants = cva([
  "[&>svg]:w-3.5 [&>svg]:h-3.5",
], {
  variants: {
    /**
     * Separator type variants
     */
    type: {
      chevron: "",
      slash: "",
      arrow: "",
      dot: "",
      custom: "",
    },
  },
  defaultVariants: {
    type: "chevron",
  },
});

/**
 * BreadcrumbEllipsis variants using CVA
 */
const breadcrumbEllipsisVariants = cva([
  "flex items-center justify-center",
  "h-9 w-9",
]);

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  /**
   * Custom separator element to use between breadcrumb items
   * @default <ChevronRight />
   */
  separator?: React.ReactNode;
}

export interface BreadcrumbListProps
  extends React.ComponentPropsWithoutRef<"ol"> {}

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithoutRef<"li"> {}

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<"a"> {
  /**
   * Whether to render as a child component using Slot
   * @default false
   */
  asChild?: boolean;
}

export interface BreadcrumbPageProps
  extends React.ComponentPropsWithoutRef<"span"> {}

export interface BreadcrumbSeparatorProps
  extends React.ComponentPropsWithoutRef<"li">,
    VariantProps<typeof breadcrumbSeparatorVariants> {}

export interface BreadcrumbEllipsisProps
  extends React.ComponentPropsWithoutRef<"span"> {}

export interface BreadcrumbItemData {
  /**
   * The URL to navigate to
   */
  href?: string;
  /**
   * The label to display
   */
  label: string;
}

export interface ResponsiveBreadcrumbProps
  extends Omit<BreadcrumbProps, "children"> {
  /**
   * Array of breadcrumb items to display
   */
  items: BreadcrumbItemData[];
  /**
   * Number of items to always display (first + last N items)
   * @default 3
   */
  itemsToDisplay?: number;
  /**
   * Breakpoint at which to switch from drawer (mobile) to popover (desktop)
   * @default 768
   */
  breakpoint?: number;
  /**
   * Title for the mobile drawer
   * @default "Navigate to"
   */
  drawerTitle?: string;
  /**
   * Description for the mobile drawer
   * @default "Select a page to navigate to."
   */
  drawerDescription?: string;
  /**
   * Custom link component to use for rendering links
   * @default "a"
   */
  linkComponent?: React.ElementType;
}

// ============================================================================
// Context
// ============================================================================

interface BreadcrumbContextValue {
  separator: React.ReactNode;
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  separator: <ChevronRight />,
});

function useBreadcrumbContext() {
  return React.useContext(BreadcrumbContext);
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to determine if viewport is mobile based on breakpoint
 * @param breakpoint - The breakpoint in pixels to determine mobile vs desktop
 * @returns Object with isDesktop boolean
 */
export function useResponsiveBreadcrumb(breakpoint: number = 768) {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    // Initial check
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, [breakpoint]);

  return { isDesktop };
}

// ============================================================================
// Components
// ============================================================================

/**
 * Breadcrumb - Root navigation component for breadcrumb trails
 *
 * A navigation component that helps users understand their location within
 * a website's hierarchy and navigate back to parent pages.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current Page</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, separator = <ChevronRight />, children, ...props }, ref) => {
    return (
      <BreadcrumbContext.Provider value={{ separator }}>
        <nav
          ref={ref}
          aria-label="breadcrumb"
          data-slot="breadcrumb"
          className={cn(breadcrumbVariants(), className)}
          {...props}
        >
          {children}
        </nav>
      </BreadcrumbContext.Provider>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

/**
 * BreadcrumbList - Ordered list container for breadcrumb items
 *
 * @example
 * ```tsx
 * <BreadcrumbList>
 *   <BreadcrumbItem>...</BreadcrumbItem>
 * </BreadcrumbList>
 * ```
 */
const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(breadcrumbListVariants(), className)}
      {...props}
    />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

/**
 * BreadcrumbItem - List item wrapper for breadcrumb content
 *
 * @example
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 * </BreadcrumbItem>
 * ```
 */
const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn(breadcrumbItemVariants(), className)}
      {...props}
    />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

/**
 * BreadcrumbLink - Navigable link within a breadcrumb
 *
 * Supports the `asChild` pattern for composition with router links.
 *
 * @example
 * ```tsx
 * // Standard anchor
 * <BreadcrumbLink href="/products">Products</BreadcrumbLink>
 *
 * // With router Link component
 * <BreadcrumbLink asChild>
 *   <Link href="/products">Products</Link>
 * </BreadcrumbLink>
 * ```
 */
const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        data-slot="breadcrumb-link"
        className={cn(breadcrumbLinkVariants(), className)}
        {...props}
      />
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

/**
 * BreadcrumbPage - Current page indicator (non-navigable)
 *
 * Uses `aria-current="page"` for accessibility.
 *
 * @example
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbPage>Current Page</BreadcrumbPage>
 * </BreadcrumbItem>
 * ```
 */
const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn(breadcrumbPageVariants(), className)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";

/**
 * BreadcrumbSeparator - Visual separator between breadcrumb items
 *
 * Uses the separator from context by default, but can be overridden with children.
 * Supports multiple separator types: chevron, slash, arrow, dot, or custom.
 *
 * @example
 * ```tsx
 * // Default (chevron from context)
 * <BreadcrumbSeparator />
 *
 * // Custom separator
 * <BreadcrumbSeparator>/</BreadcrumbSeparator>
 *
 * // Custom icon
 * <BreadcrumbSeparator>
 *   <ArrowRight className="h-4 w-4" />
 * </BreadcrumbSeparator>
 * ```
 */
const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, type, children, ...props }, ref) => {
  const { separator } = useBreadcrumbContext();

  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn(breadcrumbSeparatorVariants({ type }), className)}
      {...props}
    >
      {children ?? separator}
    </li>
  );
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/**
 * BreadcrumbEllipsis - Ellipsis indicator for collapsed breadcrumb items
 *
 * Used when there are too many breadcrumb items to display and some are hidden.
 * Typically wrapped in a trigger for a dropdown or drawer.
 *
 * @example
 * ```tsx
 * <BreadcrumbItem>
 *   <DropdownMenuTrigger>
 *     <BreadcrumbEllipsis />
 *     <span className="sr-only">Toggle menu</span>
 *   </DropdownMenuTrigger>
 * </BreadcrumbItem>
 * ```
 */
const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-ellipsis"
    className={cn(breadcrumbEllipsisVariants(), className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
));
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

/**
 * ResponsiveBreadcrumb - Smart breadcrumb that adapts to viewport size
 *
 * Automatically collapses middle items when there are too many, showing them
 * in a popover (desktop) or drawer (mobile).
 *
 * @example
 * ```tsx
 * const items = [
 *   { href: "/", label: "Home" },
 *   { href: "/docs", label: "Documentation" },
 *   { href: "/docs/components", label: "Components" },
 *   { label: "Breadcrumb" }, // No href = current page
 * ];
 *
 * <ResponsiveBreadcrumb items={items} />
 *
 * // With custom link component (e.g., Next.js Link)
 * <ResponsiveBreadcrumb items={items} linkComponent={Link} />
 * ```
 */
function ResponsiveBreadcrumb({
  items,
  itemsToDisplay = 3,
  breakpoint = 768,
  separator,
  drawerTitle = "Navigate to",
  drawerDescription = "Select a page to navigate to.",
  linkComponent: LinkComponent = "a",
  className,
  ...props
}: ResponsiveBreadcrumbProps) {
  const [open, setOpen] = React.useState(false);
  const { isDesktop } = useResponsiveBreadcrumb(breakpoint);

  // Always show first item and last (itemsToDisplay - 1) items
  const shouldCollapse = items.length > itemsToDisplay;
  const hiddenItems = shouldCollapse ? items.slice(1, -(itemsToDisplay - 1)) : [];
  const visibleEndItems = shouldCollapse
    ? items.slice(-(itemsToDisplay - 1))
    : items.slice(1);

  return (
    <Breadcrumb separator={separator} className={className} {...props}>
      <BreadcrumbList>
        {/* First item - always visible */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <LinkComponent href={items[0]?.href ?? "/"}>
              {items[0]?.label}
            </LinkComponent>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Collapsed items with ellipsis */}
        {shouldCollapse && (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    className="flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    aria-label="Show hidden breadcrumbs"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    size="auto"
                    className="p-2 min-w-40"
                  >
                    <div className="grid gap-1">
                      {hiddenItems.map((item, index) => (
                        <LinkComponent
                          key={index}
                          href={item.href ?? "#"}
                          className="block px-3 py-2 text-sm rounded-[var(--radius)] hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </LinkComponent>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Sheet open={open} onOpenChange={setOpen}>
                  <Button
                    colorStyle="ghost"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => setOpen(true)}
                    aria-label="Show hidden breadcrumbs"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </Button>
                  <SheetContent position="bottom" size="sm" showHandle>
                    <SheetHeader>
                      <SheetTitle>{drawerTitle}</SheetTitle>
                      <SheetDescription>{drawerDescription}</SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-1 py-4">
                      {hiddenItems.map((item, index) => (
                        <LinkComponent
                          key={index}
                          href={item.href ?? "#"}
                          className="block py-2 text-sm hover:text-foreground transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </LinkComponent>
                      ))}
                    </div>
                    <SheetClose asChild>
                      <Button colorStyle="outlined" className="w-full">
                        Close
                      </Button>
                    </SheetClose>
                  </SheetContent>
                </Sheet>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Visible end items */}
        {visibleEndItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  asChild
                  className="max-w-20 truncate md:max-w-none"
                >
                  <LinkComponent href={item.href}>{item.label}</LinkComponent>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < visibleEndItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
ResponsiveBreadcrumb.displayName = "ResponsiveBreadcrumb";

// ============================================================================
// Exports
// ============================================================================

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  ResponsiveBreadcrumb,
  breadcrumbVariants,
  breadcrumbListVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbPageVariants,
  breadcrumbSeparatorVariants,
  breadcrumbEllipsisVariants,
};
