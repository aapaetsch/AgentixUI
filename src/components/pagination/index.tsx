"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "../button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

// ============================================================================
// Variants
// ============================================================================

/**
 * Pagination container variants using CVA
 */
const paginationVariants = cva([
  "mx-auto flex w-full justify-center",
]);

/**
 * PaginationContent variants using CVA
 */
const paginationContentVariants = cva([
  "flex flex-row items-center gap-2",
]);

/**
 * PaginationItem variants using CVA
 */
const paginationItemVariants = cva([
  "inline-flex",
]);

/**
 * PaginationLink variants using CVA
 * Uses button variants for consistent styling
 */
const paginationLinkVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-medium select-none",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "transition-all",
    "duration-[var(--motion-duration-medium)]",
    "ease-[var(--motion-easing-standard)]",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "shrink-0",
  ].join(" "),
  {
    variants: {
      /**
       * Visual style variants
       */
      variant: {
        default: [
          "bg-transparent text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
        ].join(" "),
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
          "active:bg-accent/80",
        ].join(" "),
      },
      /**
       * Active state for current page
       */
      isActive: {
        true: "",
        false: "",
      },
      /**
       * Size variants
       */
      size: {
        small: "h-7 min-w-7 px-1.5 text-xs [&_svg]:size-3",
        sm: "h-8 min-w-8 px-2 text-xs [&_svg]:size-3.5",
        md: "h-11 min-w-11 px-3 text-sm [&_svg]:size-4",
        lg: "h-12 min-w-12 px-3.5 text-base [&_svg]:size-5",
      },
      /**
       * Shape variants
       */
      shape: {
        default: "rounded-[var(--radius)]",
        round: "rounded-full",
        square: "rounded-[var(--radius-sm)]",
      },
    },
    compoundVariants: [
      // Active state for default variant
      {
        variant: "default",
        isActive: true,
        className: "bg-accent text-accent-foreground font-semibold",
      },
      // Active state for outline variant
      {
        variant: "outline",
        isActive: true,
        className: "border-primary bg-primary/10 text-primary font-semibold",
      },
    ],
    defaultVariants: {
      variant: "default",
      isActive: false,
      size: "md",
      shape: "default",
    },
  }
);

/**
 * PaginationEllipsis variants using CVA
 */
const paginationEllipsisVariants = cva([
  "flex items-center justify-center",
  "text-muted-foreground",
], {
  variants: {
    size: {
      sm: "size-8 [&_svg]:size-3.5",
      md: "size-9 [&_svg]:size-4",
      lg: "size-10 [&_svg]:size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface PaginationProps extends React.ComponentPropsWithoutRef<"nav"> {}

export interface PaginationContentProps
  extends React.ComponentPropsWithoutRef<"ul"> {}

export interface PaginationItemProps
  extends React.ComponentPropsWithoutRef<"li"> {}

export interface PaginationLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VariantProps<typeof paginationLinkVariants> {
  /**
   * Whether to render as a button instead of an anchor
   * @default false
   */
  asButton?: boolean;
  /**
   * Click handler for button mode
   */
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

export interface PaginationPreviousProps
  extends Omit<PaginationLinkProps, "children"> {
  /**
   * Custom label text
   * @default "Previous"
   */
  label?: string;
  /**
   * Whether to show the label text
   * @default true
   */
  showLabel?: boolean;
}

export interface PaginationNextProps
  extends Omit<PaginationLinkProps, "children"> {
  /**
   * Custom label text
   * @default "Next"
   */
  label?: string;
  /**
   * Whether to show the label text
   * @default true
   */
  showLabel?: boolean;
}

export interface PaginationFirstProps
  extends Omit<PaginationLinkProps, "children"> {
  /**
   * Custom label text
   * @default "First"
   */
  label?: string;
  /**
   * Whether to show the label text
   * @default false
   */
  showLabel?: boolean;
}

export interface PaginationLastProps
  extends Omit<PaginationLinkProps, "children"> {
  /**
   * Custom label text
   * @default "Last"
   */
  label?: string;
  /**
   * Whether to show the label text
   * @default false
   */
  showLabel?: boolean;
}

export interface PaginationEllipsisProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof paginationEllipsisVariants> {}

export interface PaginationPageSizeSelectorProps {
  /**
   * Current page size
   */
  pageSize: number;
  /**
   * Callback when page size changes
   */
  onPageSizeChange: (pageSize: number) => void;
  /**
   * Available page size options
   * @default [10, 20, 30, 50, 100]
   */
  pageSizeOptions?: number[];
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Label text
   * @default "Rows per page"
   */
  label?: string;
  /**
   * Whether to show the label
   * @default true
   */
  showLabel?: boolean;
  /**
   * Additional class name
   */
  className?: string;
}

export interface ResponsivePaginationProps {
  /**
   * Current page (1-indexed)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Number of sibling pages to show on each side of current page
   * @default 1
   */
  siblingCount?: number;
  /**
   * Whether to show first/last page buttons
   * @default false
   */
  showFirstLast?: boolean;
  /**
   * Whether to show the previous/next labels on small screens
   * @default false
   */
  showLabelsOnMobile?: boolean;
  /**
   * Visual variant
   * @default "default"
   */
  variant?: "default" | "outline";
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Shape variant
   * @default "default"
   */
  shape?: "default" | "round" | "square";
  /**
   * Additional class name
   */
  className?: string;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to calculate pagination range with ellipsis
 * @param currentPage - Current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @param siblingCount - Number of siblings on each side of current page
 * @returns Array of page numbers and ellipsis markers
 */
export function usePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | "ellipsis")[] {
  return React.useMemo(() => {
    // Total page numbers to show (first + last + current + siblings + 2 ellipses)
    const totalPageNumbers = siblingCount * 2 + 5;

    // Case 1: Total pages is less than the page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left ellipsis, but right ellipsis
    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "ellipsis" as const, totalPages];
    }

    // Case 3: Left ellipsis, no right ellipsis
    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, "ellipsis" as const, ...rightRange];
    }

    // Case 4: Both ellipses
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [
      firstPageIndex,
      "ellipsis" as const,
      ...middleRange,
      "ellipsis" as const,
      lastPageIndex,
    ];
  }, [currentPage, totalPages, siblingCount]);
}

// ============================================================================
// Components
// ============================================================================

/**
 * Pagination - Root navigation component for page navigation
 *
 * A navigation component that helps users navigate through pages of content.
 *
 * @example
 * ```tsx
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="#" />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="#" isActive>1</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="#">2</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationEllipsis />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext href="#" />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 * ```
 */
const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn(paginationVariants(), className)}
      {...props}
    />
  )
);
Pagination.displayName = "Pagination";

/**
 * PaginationContent - Container for pagination items
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="pagination-content"
    className={cn(paginationContentVariants(), className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

/**
 * PaginationItem - Wrapper for individual pagination elements
 */
const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="pagination-item"
      className={cn(paginationItemVariants(), className)}
      {...props}
    />
  )
);
PaginationItem.displayName = "PaginationItem";

/**
 * PaginationLink - Clickable link for page navigation
 */
const PaginationLink = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationLinkProps
>(
  (
    {
      className,
      isActive,
      variant,
      size,
      shape,
      asButton = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      paginationLinkVariants({ variant, isActive, size, shape }),
      className
    );

    if (asButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive ? "" : undefined}
          className={classes}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          {...(props as React.ComponentPropsWithoutRef<"button">)}
        />
      );
    }

    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive ? "" : undefined}
        className={classes}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...(props as React.ComponentPropsWithoutRef<"a">)}
      />
    );
  }
);
PaginationLink.displayName = "PaginationLink";

/**
 * PaginationPrevious - Previous page navigation link
 */
const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationPreviousProps
>(
  (
    {
      className,
      label = "Previous",
      showLabel = true,
      size,
      ...props
    },
    ref
  ) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size={size}
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeft />
      <span className={cn(!showLabel && "sr-only", showLabel && "hidden sm:block")}>
        {label}
      </span>
    </PaginationLink>
  )
);
PaginationPrevious.displayName = "PaginationPrevious";

/**
 * PaginationNext - Next page navigation link
 */
const PaginationNext = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationNextProps
>(
  (
    {
      className,
      label = "Next",
      showLabel = true,
      size,
      ...props
    },
    ref
  ) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size={size}
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <span className={cn(!showLabel && "sr-only", showLabel && "hidden sm:block")}>
        {label}
      </span>
      <ChevronRight />
    </PaginationLink>
  )
);
PaginationNext.displayName = "PaginationNext";

/**
 * PaginationFirst - First page navigation link
 */
const PaginationFirst = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationFirstProps
>(
  (
    {
      className,
      label = "First",
      showLabel = false,
      size,
      ...props
    },
    ref
  ) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to first page"
      size={size}
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronsLeft />
      <span className={cn(!showLabel && "sr-only", showLabel && "hidden sm:block")}>
        {label}
      </span>
    </PaginationLink>
  )
);
PaginationFirst.displayName = "PaginationFirst";

/**
 * PaginationLast - Last page navigation link
 */
const PaginationLast = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationLastProps
>(
  (
    {
      className,
      label = "Last",
      showLabel = false,
      size,
      ...props
    },
    ref
  ) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to last page"
      size={size}
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <span className={cn(!showLabel && "sr-only", showLabel && "hidden sm:block")}>
        {label}
      </span>
      <ChevronsRight />
    </PaginationLink>
  )
);
PaginationLast.displayName = "PaginationLast";

/**
 * PaginationEllipsis - Ellipsis indicator for skipped pages
 */
const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(({ className, size, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden
    data-slot="pagination-ellipsis"
    className={cn(paginationEllipsisVariants({ size }), className)}
    {...props}
  >
    <MoreHorizontal />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";

/**
 * PaginationPageSizeSelector - Dropdown to change items per page
 */
function PaginationPageSizeSelector({
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  size = "md",
  label = "Rows per page",
  showLabel = true,
  className,
}: PaginationPageSizeSelectorProps) {
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-base",
  };

  return (
    <div
      data-slot="pagination-page-size-selector"
      className={cn("flex items-center gap-2", className)}
    >
      {showLabel && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {label}
        </span>
      )}
      <Select
        value={String(pageSize)}
        onValueChange={(value) => onPageSizeChange(Number(value))}
      >
        <SelectTrigger className={cn("w-[70px]", sizeClasses[size])}>
          <SelectValue placeholder={String(pageSize)} />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
PaginationPageSizeSelector.displayName = "PaginationPageSizeSelector";

/**
 * ResponsivePagination - Pre-composed pagination with responsive behavior
 *
 * Automatically calculates page ranges with ellipsis and handles
 * responsive display of page numbers.
 *
 * @example
 * ```tsx
 * const [page, setPage] = useState(1);
 *
 * <ResponsivePagination
 *   currentPage={page}
 *   totalPages={20}
 *   onPageChange={setPage}
 * />
 * ```
 */
function ResponsivePagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = false,
  showLabelsOnMobile = false,
  variant = "default",
  size = "md",
  shape = "default",
  className,
}: ResponsivePaginationProps) {
  const paginationRange = usePaginationRange(currentPage, totalPages, siblingCount);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Don't render if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* First page button */}
        {showFirstLast && (
          <PaginationItem>
            <PaginationFirst
              asButton
              onClick={() => handlePageChange(1)}
              aria-disabled={isFirstPage}
              className={cn(isFirstPage && "pointer-events-none opacity-50")}
              variant={variant}
              size={size}
              shape={shape}
            />
          </PaginationItem>
        )}

        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            asButton
            onClick={() => handlePageChange(currentPage - 1)}
            aria-disabled={isFirstPage}
            className={cn(isFirstPage && "pointer-events-none opacity-50")}
            variant={variant}
            size={size}
            shape={shape}
            showLabel={showLabelsOnMobile ? true : undefined}
          />
        </PaginationItem>

        {/* Page numbers - hidden on very small screens */}
        <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-1">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis size={size} />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  asButton
                  onClick={() => handlePageChange(pageNumber)}
                  isActive={pageNumber === currentPage}
                  variant={variant}
                  size={size}
                  shape={shape}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        </div>

        {/* Mobile page indicator */}
        <PaginationItem className="sm:hidden">
          <span className="px-3 text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
        </PaginationItem>

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            asButton
            onClick={() => handlePageChange(currentPage + 1)}
            aria-disabled={isLastPage}
            className={cn(isLastPage && "pointer-events-none opacity-50")}
            variant={variant}
            size={size}
            shape={shape}
            showLabel={showLabelsOnMobile ? true : undefined}
          />
        </PaginationItem>

        {/* Last page button */}
        {showFirstLast && (
          <PaginationItem>
            <PaginationLast
              asButton
              onClick={() => handlePageChange(totalPages)}
              aria-disabled={isLastPage}
              className={cn(isLastPage && "pointer-events-none opacity-50")}
              variant={variant}
              size={size}
              shape={shape}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
ResponsivePagination.displayName = "ResponsivePagination";

// ============================================================================
// Exports
// ============================================================================

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  PaginationPageSizeSelector,
  ResponsivePagination,
  paginationVariants,
  paginationContentVariants,
  paginationItemVariants,
  paginationLinkVariants,
  paginationEllipsisVariants,
};
