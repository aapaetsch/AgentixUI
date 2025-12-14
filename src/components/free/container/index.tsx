import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";

// ============================================================================
// Container Variants
// ============================================================================

/**
 * Container variants using CVA
 * Implements responsive max-width constraints with optional centering and padding
 * 
 * Breakpoints follow Tailwind defaults:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1400px (matches project tailwind.config.js)
 * - full: no max-width constraint
 * 
 * Padding follows MD3 layout guidelines:
 * - Compact (<600dp): 16dp margins
 * - Medium+ (600dp+): 24dp margins
 */
const containerVariants = cva(
  [
    // Base styles
    "w-full",
  ].join(" "),
  {
    variants: {
      /**
       * Maximum width constraint
       * Controls how wide the container can grow
       */
      maxWidth: {
        sm: "max-w-screen-sm",     // 640px
        md: "max-w-screen-md",     // 768px
        lg: "max-w-screen-lg",     // 1024px
        xl: "max-w-screen-xl",     // 1280px
        "2xl": "max-w-[1400px]",   // 1400px (matches tailwind config)
        full: "max-w-none",        // No constraint
      },
      /**
       * Horizontal padding variants
       * - none: No padding
       * - tight: 1rem (16px) - compact layouts
       * - normal: 1.5rem mobile, 2rem desktop - standard layouts
       * - wide: 2rem mobile, 3rem desktop - spacious layouts
       */
      padding: {
        none: "",
        tight: "px-4",
        normal: "px-4 sm:px-6 lg:px-8",
        wide: "px-6 sm:px-8 lg:px-12",
      },
      /**
       * Center the container horizontally
       */
      center: {
        true: "mx-auto",
        false: "",
      },
      /**
       * Background variant using MD3 surface container colors
       * - transparent: No background (default)
       * - surface: Uses --surface color
       * - container: Uses --surface-container color
       * - containerLow: Uses --surface-container-low color
       * - containerHigh: Uses --surface-container-high color
       */
      background: {
        transparent: "",
        surface: "bg-[hsl(var(--surface))]",
        container: "bg-[hsl(var(--surface-container))]",
        containerLow: "bg-[hsl(var(--surface-container-low))]",
        containerHigh: "bg-[hsl(var(--surface-container-high))]",
      },
    },
    defaultVariants: {
      maxWidth: "2xl",
      padding: "normal",
      center: true,
      background: "transparent",
    },
  }
);

// ============================================================================
// Container Component
// ============================================================================

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /**
   * When true, renders as child element (useful for semantic HTML like main, section)
   */
  asChild?: boolean;
}

/**
 * Container - A responsive layout wrapper for page content
 *
 * Provides consistent max-width constraints, padding, and optional centering
 * for page-level content. Follows MD3 layout guidelines for margins.
 *
 * @example
 * ```tsx
 * // Basic centered container with default max-width
 * <Container>
 *   <h1>Page Content</h1>
 * </Container>
 *
 * // Full-width container with no centering
 * <Container maxWidth="full" center={false}>
 *   <Banner />
 * </Container>
 *
 * // Narrow container for reading content
 * <Container maxWidth="md" padding="wide">
 *   <article>Long form content...</article>
 * </Container>
 *
 * // As semantic element
 * <Container asChild>
 *   <main>Main content</main>
 * </Container>
 *
 * // With background
 * <Container background="container">
 *   <section>Featured content</section>
 * </Container>
 * ```
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      maxWidth,
      padding,
      center,
      background,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-slot="container"
        className={cn(
          containerVariants({ maxWidth, padding, center, background }),
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

// ============================================================================
// Exports
// ============================================================================

export { Container, containerVariants };
