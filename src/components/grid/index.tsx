import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

// ============================================================================
// Grid Variants
// ============================================================================

/**
 * Grid container variants using CVA
 * Provides flexible CSS Grid layout with column presets, gap, and padding options
 */
const gridVariants = cva(
  [
    // Base styles
    "grid w-full",
  ].join(" "),
  {
    variants: {
      /**
       * Number of columns in the grid (1-10 presets)
       * Use className for arbitrary values (e.g., grid-cols-[13])
       */
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        7: "grid-cols-7",
        8: "grid-cols-8",
        9: "grid-cols-9",
        10: "grid-cols-10",
        11: "grid-cols-11",
        12: "grid-cols-12",
        none: "grid-cols-none",
      },
      /**
       * Gap between grid items
       */
      gap: {
        none: "gap-0",
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        "2xl": "gap-10",
        "3xl": "gap-12",
      },
      /**
       * Row gap (overrides gap for rows)
       */
      gapX: {
        none: "gap-x-0",
        xs: "gap-x-1",
        sm: "gap-x-2",
        md: "gap-x-4",
        lg: "gap-x-6",
        xl: "gap-x-8",
        "2xl": "gap-x-10",
        "3xl": "gap-x-12",
      },
      /**
       * Column gap (overrides gap for columns)
       */
      gapY: {
        none: "gap-y-0",
        xs: "gap-y-1",
        sm: "gap-y-2",
        md: "gap-y-4",
        lg: "gap-y-6",
        xl: "gap-y-8",
        "2xl": "gap-y-10",
        "3xl": "gap-y-12",
      },
      /**
       * Padding around the grid container
       */
      padding: {
        none: "p-0",
        xs: "p-1",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
        "2xl": "p-10",
        "3xl": "p-12",
      },
      /**
       * Horizontal padding
       */
      paddingX: {
        none: "px-0",
        xs: "px-1",
        sm: "px-2",
        md: "px-4",
        lg: "px-6",
        xl: "px-8",
        "2xl": "px-10",
        "3xl": "px-12",
      },
      /**
       * Vertical padding
       */
      paddingY: {
        none: "py-0",
        xs: "py-1",
        sm: "py-2",
        md: "py-4",
        lg: "py-6",
        xl: "py-8",
        "2xl": "py-10",
        "3xl": "py-12",
      },
      /**
       * Grid auto flow
       */
      flow: {
        row: "grid-flow-row",
        col: "grid-flow-col",
        dense: "grid-flow-dense",
        "row-dense": "grid-flow-row-dense",
        "col-dense": "grid-flow-col-dense",
      },
      /**
       * Align items vertically within grid cells
       */
      alignItems: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      /**
       * Justify items horizontally within grid cells
       */
      justifyItems: {
        start: "justify-items-start",
        center: "justify-items-center",
        end: "justify-items-end",
        stretch: "justify-items-stretch",
      },
      /**
       * Align content (multiple rows)
       */
      alignContent: {
        start: "content-start",
        center: "content-center",
        end: "content-end",
        stretch: "content-stretch",
        between: "content-between",
        around: "content-around",
        evenly: "content-evenly",
      },
      /**
       * Justify content (multiple columns)
       */
      justifyContent: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        stretch: "justify-stretch",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "md",
    },
  }
);

// ============================================================================
// GridItem Variants
// ============================================================================

/**
 * GridItem variants for controlling individual grid cell behavior
 */
const gridItemVariants = cva(
  [
    // Base styles - none needed as items inherit from grid
  ].join(" "),
  {
    variants: {
      /**
       * Column span (how many columns the item spans)
       */
      colSpan: {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        7: "col-span-7",
        8: "col-span-8",
        9: "col-span-9",
        10: "col-span-10",
        11: "col-span-11",
        12: "col-span-12",
        full: "col-span-full",
        auto: "col-auto",
      },
      /**
       * Row span (how many rows the item spans)
       */
      rowSpan: {
        1: "row-span-1",
        2: "row-span-2",
        3: "row-span-3",
        4: "row-span-4",
        5: "row-span-5",
        6: "row-span-6",
        full: "row-span-full",
        auto: "row-auto",
      },
      /**
       * Column start position
       */
      colStart: {
        1: "col-start-1",
        2: "col-start-2",
        3: "col-start-3",
        4: "col-start-4",
        5: "col-start-5",
        6: "col-start-6",
        7: "col-start-7",
        8: "col-start-8",
        9: "col-start-9",
        10: "col-start-10",
        11: "col-start-11",
        12: "col-start-12",
        13: "col-start-13",
        auto: "col-start-auto",
      },
      /**
       * Column end position
       */
      colEnd: {
        1: "col-end-1",
        2: "col-end-2",
        3: "col-end-3",
        4: "col-end-4",
        5: "col-end-5",
        6: "col-end-6",
        7: "col-end-7",
        8: "col-end-8",
        9: "col-end-9",
        10: "col-end-10",
        11: "col-end-11",
        12: "col-end-12",
        13: "col-end-13",
        auto: "col-end-auto",
      },
      /**
       * Row start position
       */
      rowStart: {
        1: "row-start-1",
        2: "row-start-2",
        3: "row-start-3",
        4: "row-start-4",
        5: "row-start-5",
        6: "row-start-6",
        7: "row-start-7",
        auto: "row-start-auto",
      },
      /**
       * Row end position
       */
      rowEnd: {
        1: "row-end-1",
        2: "row-end-2",
        3: "row-end-3",
        4: "row-end-4",
        5: "row-end-5",
        6: "row-end-6",
        7: "row-end-7",
        auto: "row-end-auto",
      },
      /**
       * Self alignment (overrides parent alignItems for this item)
       */
      alignSelf: {
        auto: "self-auto",
        start: "self-start",
        center: "self-center",
        end: "self-end",
        stretch: "self-stretch",
        baseline: "self-baseline",
      },
      /**
       * Justify self (overrides parent justifyItems for this item)
       */
      justifySelf: {
        auto: "justify-self-auto",
        start: "justify-self-start",
        center: "justify-self-center",
        end: "justify-self-end",
        stretch: "justify-self-stretch",
      },
      /**
       * Padding for the grid item
       */
      padding: {
        none: "p-0",
        xs: "p-1",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
        "2xl": "p-10",
        "3xl": "p-12",
      },
      /**
       * Horizontal padding
       */
      paddingX: {
        none: "px-0",
        xs: "px-1",
        sm: "px-2",
        md: "px-4",
        lg: "px-6",
        xl: "px-8",
        "2xl": "px-10",
        "3xl": "px-12",
      },
      /**
       * Vertical padding
       */
      paddingY: {
        none: "py-0",
        xs: "py-1",
        sm: "py-2",
        md: "py-4",
        lg: "py-6",
        xl: "py-8",
        "2xl": "py-10",
        "3xl": "py-12",
      },
      /**
       * Order in the grid
       */
      order: {
        first: "order-first",
        last: "order-last",
        none: "order-none",
        1: "order-1",
        2: "order-2",
        3: "order-3",
        4: "order-4",
        5: "order-5",
        6: "order-6",
        7: "order-7",
        8: "order-8",
        9: "order-9",
        10: "order-10",
        11: "order-11",
        12: "order-12",
      },
    },
    defaultVariants: {},
  }
);

// ============================================================================
// Grid Component
// ============================================================================

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  /**
   * When true, renders as child element (useful for custom containers)
   */
  asChild?: boolean;
}

/**
 * Grid - A flexible CSS Grid layout container
 *
 * Provides preset column counts (1-12) with gap and padding options.
 * For arbitrary column counts, use the className prop with Tailwind classes.
 *
 * @example
 * // Basic 3-column grid
 * <Grid cols={3} gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 *
 * @example
 * // Responsive grid using className
 * <Grid cols={1} className="sm:grid-cols-2 lg:grid-cols-3" gap="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 *
 * @example
 * // Grid with arbitrary column count (13 columns)
 * <Grid className="grid-cols-[repeat(13,minmax(0,1fr))]" gap="md">
 *   ...
 * </Grid>
 *
 * @example
 * // Grid with padding and custom alignment
 * <Grid cols={4} gap="lg" padding="xl" alignItems="center">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Grid>
 */
const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols,
      gap,
      gapX,
      gapY,
      padding,
      paddingX,
      paddingY,
      flow,
      alignItems,
      justifyItems,
      alignContent,
      justifyContent,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-slot="grid"
        className={cn(
          gridVariants({
            cols,
            gap,
            gapX,
            gapY,
            padding,
            paddingX,
            paddingY,
            flow,
            alignItems,
            justifyItems,
            alignContent,
            justifyContent,
          }),
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = "Grid";

// ============================================================================
// GridItem Component
// ============================================================================

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
  /**
   * When true, renders as child element
   */
  asChild?: boolean;
}

/**
 * GridItem - A grid item wrapper for controlling placement and span
 *
 * Provides control over column/row span, start/end positions, and alignment.
 * Can be used to create complex grid layouts with precise item placement.
 *
 * @example
 * // Item spanning 2 columns
 * <Grid cols={4}>
 *   <GridItem colSpan={2}>Spans 2 columns</GridItem>
 *   <GridItem>Normal item</GridItem>
 *   <GridItem>Normal item</GridItem>
 * </Grid>
 *
 * @example
 * // Item with specific position
 * <Grid cols={3}>
 *   <GridItem colStart={2} colSpan={2}>Starts at column 2</GridItem>
 * </Grid>
 *
 * @example
 * // Item with padding and alignment
 * <Grid cols={3}>
 *   <GridItem padding="lg" alignSelf="center">
 *     Centered with padding
 *   </GridItem>
 * </Grid>
 *
 * @example
 * // Full-width item in a grid
 * <Grid cols={4}>
 *   <GridItem colSpan="full">Full-width header</GridItem>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 *   <div>Item 4</div>
 * </Grid>
 */
const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      className,
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      alignSelf,
      justifySelf,
      padding,
      paddingX,
      paddingY,
      order,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-slot="grid-item"
        className={cn(
          gridItemVariants({
            colSpan,
            rowSpan,
            colStart,
            colEnd,
            rowStart,
            rowEnd,
            alignSelf,
            justifySelf,
            padding,
            paddingX,
            paddingY,
            order,
          }),
          className
        )}
        {...props}
      />
    );
  }
);

GridItem.displayName = "GridItem";

// ============================================================================
// Exports
// ============================================================================

export { Grid, GridItem, gridVariants, gridItemVariants };
