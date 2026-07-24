import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// Define flex container variants
const flexVariants = cva("flex", {
  variants: {
    /**
     * Direction of flex items
     */
    direction: {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      col: "flex-col",
      "col-reverse": "flex-col-reverse",
    },
    /**
     * How flex items wrap
     */
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
    /**
     * Alignment of flex items along the main axis
     */
    justify: {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    /**
     * Alignment of flex items along the cross axis
     */
    align: {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    /**
     * Alignment of flex lines when wrapping
     */
    alignContent: {
      start: "content-start",
      end: "content-end",
      center: "content-center",
      between: "content-between",
      around: "content-around",
      evenly: "content-evenly",
      stretch: "content-stretch",
    },
    /**
     * Gap between flex items
     */
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      7: "gap-7",
      8: "gap-8",
      9: "gap-9",
      10: "gap-10",
      12: "gap-12",
      14: "gap-14",
      16: "gap-16",
      20: "gap-20",
      24: "gap-24",
      28: "gap-28",
      32: "gap-32",
    },
    /**
     * Horizontal gap between flex items (column gap)
     */
    gapX: {
      0: "gap-x-0",
      1: "gap-x-1",
      2: "gap-x-2",
      3: "gap-x-3",
      4: "gap-x-4",
      5: "gap-x-5",
      6: "gap-x-6",
      7: "gap-x-7",
      8: "gap-x-8",
      9: "gap-x-9",
      10: "gap-x-10",
      12: "gap-x-12",
      14: "gap-x-14",
      16: "gap-x-16",
      20: "gap-x-20",
      24: "gap-x-24",
      28: "gap-x-28",
      32: "gap-x-32",
    },
    /**
     * Vertical gap between flex items (row gap)
     */
    gapY: {
      0: "gap-y-0",
      1: "gap-y-1",
      2: "gap-y-2",
      3: "gap-y-3",
      4: "gap-y-4",
      5: "gap-y-5",
      6: "gap-y-6",
      7: "gap-y-7",
      8: "gap-y-8",
      9: "gap-y-9",
      10: "gap-y-10",
      12: "gap-y-12",
      14: "gap-y-14",
      16: "gap-y-16",
      20: "gap-y-20",
      24: "gap-y-24",
      28: "gap-y-28",
      32: "gap-y-32",
    },
  },
  defaultVariants: {
    direction: "row",
    wrap: "nowrap",
    justify: "start",
    align: "stretch",
  },
});

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants>,
    VariantProps<typeof flexItemVariants> {
  /**
   * If true, renders as inline-flex instead of flex
   */
  inline?: boolean;
  /**
   * Horizontal gap between flex items (column gap)
   * Use instead of gap when you need different horizontal and vertical spacing
   */
  gapX?: VariantProps<typeof flexVariants>["gapX"];
  /**
   * Vertical gap between flex items (row gap)
   * Use instead of gap when you need different horizontal and vertical spacing
   */
  gapY?: VariantProps<typeof flexVariants>["gapY"];
}

/**
 * Flex - A flexible container component for building layouts with flexbox
 *
 * The Flex component provides a convenient way to apply common flexbox properties
 * without writing verbose Tailwind classes. It supports all major flexbox properties
 * as props for better readability and consistency.
 *
 * It also supports flex item properties (grow, shrink, basis, alignSelf, order)
 * so it can be nested inside other flex containers.
 *
 * @example
 * ```tsx
 * // Basic flex row
 * <Flex gap={4}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 *
 * // Centered content
 * <Flex justify="center" align="center" className="h-32">
 *   <div>Centered content</div>
 * </Flex>
 *
 * // Nested flex containers
 * <Flex gap={4}>
 *   <Flex direction="col" grow={1} gap={2}>
 *     <div>Nested item 1</div>
 *     <div>Nested item 2</div>
 *   </Flex>
 * </Flex>
 * ```
 */
const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      inline = false,
      direction,
      wrap,
      justify,
      align,
      alignContent,
      gap,
      gapX,
      gapY,
      // Flex item props
      grow,
      shrink,
      basis,
      alignSelf,
      order,
      ...props
    },
    ref
  ) => {
    const containerClasses = flexVariants({
      direction,
      wrap,
      justify,
      align,
      alignContent,
      gap,
      gapX,
      gapY,
    });

    const itemClasses = flexItemVariants({
      grow,
      shrink,
      basis,
      alignSelf,
      order,
    });

    return (
      <div
        ref={ref}
        className={cn(
          inline ? containerClasses.replace("flex", "inline-flex") : containerClasses,
          itemClasses,
          className
        )}
        {...props}
      />
    );
  }
);

Flex.displayName = "Flex";

// Define flex item variants
const flexItemVariants = cva("", {
  variants: {
    /**
     * How the flex item grows relative to others
     */
    grow: {
      0: "grow-0",
      1: "grow",
      2: "grow-2",
      3: "grow-3",
      4: "grow-4",
      5: "grow-5",
    },
    /**
     * How the flex item shrinks relative to others
     */
    shrink: {
      0: "shrink-0",
      1: "shrink",
      2: "shrink-2",
      3: "shrink-3",
      4: "shrink-4",
      5: "shrink-5",
    },
    /**
     * Initial size of the flex item
     */
    basis: {
      auto: "basis-auto",
      full: "basis-full",
      fit: "basis-fit",
      min: "basis-min",
      max: "basis-max",
      "1/2": "basis-1/2",
      "1/3": "basis-1/3",
      "2/3": "basis-2/3",
      "1/4": "basis-1/4",
      "2/4": "basis-2/4",
      "3/4": "basis-3/4",
      "1/5": "basis-1/5",
      "2/5": "basis-2/5",
      "3/5": "basis-3/5",
      "4/5": "basis-4/5",
      "1/6": "basis-1/6",
      "2/6": "basis-2/6",
      "3/6": "basis-3/6",
      "4/6": "basis-4/6",
      "5/6": "basis-5/6",
      "1/12": "basis-1/12",
      "2/12": "basis-2/12",
      "3/12": "basis-3/12",
      "4/12": "basis-4/12",
      "5/12": "basis-5/12",
      "6/12": "basis-6/12",
      "7/12": "basis-7/12",
      "8/12": "basis-8/12",
      "9/12": "basis-9/12",
      "10/12": "basis-10/12",
      "11/12": "basis-11/12",
    },
    /**
     * Alignment of the flex item along the cross axis
     */
    alignSelf: {
      auto: "self-auto",
      start: "self-start",
      end: "self-end",
      center: "self-center",
      baseline: "self-baseline",
      stretch: "self-stretch",
    },
    /**
     * Order of the flex item
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
  defaultVariants: {
    grow: 0,
    shrink: 1,
  },
});

export interface FlexItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexItemVariants> {
  /**
   * If true, renders as a span instead of a div
   */
  inline?: boolean;
}

/**
 * FlexItem - A flex item component for controlling individual flex child properties
 *
 * The FlexItem component allows you to control individual properties of flex children
 * like grow, shrink, basis, alignment, and order.
 *
 * @example
 * ```tsx
 * <Flex gap={4}>
 *   <FlexItem grow={1}>This item grows</FlexItem>
 *   <FlexItem basis="1/4">This item takes 1/4 of the width</FlexItem>
 *   <FlexItem alignSelf="center">This item is center-aligned</FlexItem>
 * </Flex>
 * ```
 */
const FlexItem = React.forwardRef<HTMLDivElement, FlexItemProps>(
  (
    {
      className,
      inline: _inline = false,
      grow,
      shrink,
      basis,
      alignSelf,
      order,
      ...props
    },
    ref
  ) => {
    const classes = flexItemVariants({
      grow,
      shrink,
      basis,
      alignSelf,
      order,
    });

    return (
      <div
        ref={ref}
        className={cn(classes, className)}
        {...props}
      />
    );
  }
);

FlexItem.displayName = "FlexItem";

// ============================================================================
// FlexRow Component
// ============================================================================

export interface FlexRowProps
  extends Omit<FlexProps, "direction"> {
  /**
   * If true, reverses the row direction
   */
  reverse?: boolean;
}

/**
 * FlexRow - A convenience component for horizontal flex layouts
 *
 * FlexRow is a pre-configured Flex component with row direction.
 * Use the `reverse` prop to switch to row-reverse direction.
 *
 * Supports flex item properties (grow, shrink, basis, alignSelf, order)
 * so it can be nested inside other flex containers.
 *
 * @example
 * ```tsx
 * // Basic row layout
 * <FlexRow gap={4}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </FlexRow>
 *
 * // Nested inside FlexCol
 * <FlexCol gap={4}>
 *   <FlexRow gap={2} grow={1}>
 *     <div>Item 1</div>
 *     <div>Item 2</div>
 *   </FlexRow>
 *   <FlexRow gap={2}>
 *     <div>Item 3</div>
 *     <div>Item 4</div>
 *   </FlexRow>
 * </FlexCol>
 * ```
 */
const FlexRow = React.forwardRef<HTMLDivElement, FlexRowProps>(
  ({ reverse = false, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction={reverse ? "row-reverse" : "row"}
        {...props}
      />
    );
  }
);

FlexRow.displayName = "FlexRow";

// ============================================================================
// FlexCol Component
// ============================================================================

export interface FlexColProps
  extends Omit<FlexProps, "direction"> {
  /**
   * If true, reverses the column direction
   */
  reverse?: boolean;
}

/**
 * FlexCol - A convenience component for vertical flex layouts
 *
 * FlexCol is a pre-configured Flex component with column direction.
 * Use the `reverse` prop to switch to column-reverse direction.
 *
 * Supports flex item properties (grow, shrink, basis, alignSelf, order)
 * so it can be nested inside other flex containers.
 *
 * @example
 * ```tsx
 * // Basic column layout
 * <FlexCol gap={4}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </FlexCol>
 *
 * // Nested inside FlexRow
 * <FlexRow gap={4}>
 *   <FlexCol gap={2} basis="1/3">
 *     <div>Sidebar item 1</div>
 *     <div>Sidebar item 2</div>
 *   </FlexCol>
 *   <FlexCol gap={2} grow={1}>
 *     <div>Main content 1</div>
 *     <div>Main content 2</div>
 *   </FlexCol>
 * </FlexRow>
 * ```
 */
const FlexCol = React.forwardRef<HTMLDivElement, FlexColProps>(
  ({ reverse = false, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction={reverse ? "col-reverse" : "col"}
        {...props}
      />
    );
  }
);

FlexCol.displayName = "FlexCol";

export { Flex, FlexItem, FlexRow, FlexCol, flexVariants, flexItemVariants };