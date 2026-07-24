import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronRight, Slash, ArrowRight, Circle } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  ResponsiveBreadcrumb,
} from ".";

/**
 * A breadcrumb component is a navigation aid that helps users understand their
 * current location within a website's hierarchy and navigate back to parent pages.
 *
 * ## Features
 * - Semantic HTML with proper ARIA attributes
 * - Custom separators (chevron, slash, arrow, dot, or custom)
 * - Responsive behavior with automatic collapsing
 * - Support for router links via `asChild` pattern
 * - Mobile-friendly drawer for collapsed items
 * - Accessible by default with `aria-current="page"` for current page
 *
 * ## Usage
 *
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
const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  subcomponents: {
    BreadcrumbList: BreadcrumbList as React.ComponentType<unknown>,
    BreadcrumbItem: BreadcrumbItem as React.ComponentType<unknown>,
    BreadcrumbLink: BreadcrumbLink as React.ComponentType<unknown>,
    BreadcrumbPage: BreadcrumbPage as React.ComponentType<unknown>,
    BreadcrumbSeparator: BreadcrumbSeparator as React.ComponentType<unknown>,
    BreadcrumbEllipsis: BreadcrumbEllipsis as React.ComponentType<unknown>,
    ResponsiveBreadcrumb: ResponsiveBreadcrumb as React.ComponentType<unknown>,
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Electronics</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const TwoLevels: Story = {
  parameters: {
    docs: {
      description: {
        story: "Simple two-level breadcrumb with home and current page.",
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// ============================================================================
// Separator Variants
// ============================================================================

export const SlashSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use a slash as the separator by passing a custom separator to the Breadcrumb component.",
      },
    },
  },
  render: () => (
    <Breadcrumb separator={<Slash className="h-4 w-4" />}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const ArrowSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use an arrow as the separator for a different visual style.",
      },
    },
  },
  render: () => (
    <Breadcrumb separator={<ArrowRight className="h-3.5 w-3.5" />}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const DotSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use dots as separators for a minimal look.",
      },
    },
  },
  render: () => (
    <Breadcrumb separator={<Circle className="h-1 w-1 fill-current" />}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>My Post</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const TextSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use plain text as the separator.",
      },
    },
  },
  render: () => (
    <Breadcrumb separator="/">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/about">About</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Team</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const CustomSeparatorPerItem: Story = {
  parameters: {
    docs: {
      description: {
        story: "Override the separator for individual items by passing children to BreadcrumbSeparator.",
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ArrowRight className="h-3.5 w-3.5" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// ============================================================================
// With Ellipsis
// ============================================================================

export const WithEllipsis: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use BreadcrumbEllipsis to indicate collapsed items in a long breadcrumb trail.",
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// ============================================================================
// Responsive Breadcrumb
// ============================================================================

const responsiveItems = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Documentation" },
  { href: "/docs/building", label: "Building Your Application" },
  { href: "/docs/data", label: "Data Fetching" },
  { label: "Caching and Revalidating" },
];

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ResponsiveBreadcrumb automatically collapses middle items when there are too many. Shows a popover on desktop and a drawer on mobile. Resize the viewport to see the behavior change.",
      },
    },
    layout: "padded",
  },
  render: () => (
    <div className="w-full max-w-xl">
      <ResponsiveBreadcrumb items={responsiveItems} />
    </div>
  ),
};

export const ResponsiveWithMoreItems: Story = {
  parameters: {
    docs: {
      description: {
        story: "ResponsiveBreadcrumb with many items, showing more collapsed items in the dropdown/drawer.",
      },
    },
    layout: "padded",
  },
  render: () => (
    <div className="w-full max-w-xl">
      <ResponsiveBreadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          { href: "/products/electronics", label: "Electronics" },
          { href: "/products/electronics/computers", label: "Computers" },
          { href: "/products/electronics/computers/laptops", label: "Laptops" },
          { href: "/products/electronics/computers/laptops/gaming", label: "Gaming" },
          { label: "ASUS ROG Strix" },
        ]}
      />
    </div>
  ),
};

export const ResponsiveWithCustomItemsToDisplay: Story = {
  parameters: {
    docs: {
      description: {
        story: "Customize the number of visible items with the `itemsToDisplay` prop.",
      },
    },
    layout: "padded",
  },
  render: () => (
    <div className="w-full max-w-xl space-y-4">
      <div>
        <p className="text-muted-foreground text-sm mb-2">itemsToDisplay=2 (First + Last)</p>
        <ResponsiveBreadcrumb items={responsiveItems} itemsToDisplay={2} />
      </div>
      <div>
        <p className="text-muted-foreground text-sm mb-2">itemsToDisplay=4 (First + Last 3)</p>
        <ResponsiveBreadcrumb items={responsiveItems} itemsToDisplay={4} />
      </div>
    </div>
  ),
};

export const ResponsiveWithSlashSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story: "ResponsiveBreadcrumb with a custom slash separator.",
      },
    },
    layout: "padded",
  },
  render: () => (
    <div className="w-full max-w-xl">
      <ResponsiveBreadcrumb
        items={responsiveItems}
        separator={<Slash className="h-4 w-4" />}
      />
    </div>
  ),
};

export const ResponsiveWithCustomDrawerText: Story = {
  parameters: {
    docs: {
      description: {
        story: "Customize the drawer title and description for mobile view.",
      },
    },
    layout: "padded",
  },
  render: () => (
    <div className="w-full max-w-xl">
      <ResponsiveBreadcrumb
        items={responsiveItems}
        drawerTitle="Go to page"
        drawerDescription="Choose a page from the navigation path."
      />
    </div>
  ),
};

export const ResponsiveShortPath: Story = {
  parameters: {
    docs: {
      description: {
        story: "When there are fewer items than `itemsToDisplay`, no collapsing occurs.",
      },
    },
    layout: "padded",
  },
  render: () => (
    <div className="w-full max-w-xl">
      <ResponsiveBreadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
          { label: "Electronics" },
        ]}
      />
    </div>
  ),
};

// ============================================================================
// Deep Hierarchy Example
// ============================================================================

export const DeepHierarchy: Story = {
  parameters: {
    docs: {
      description: {
        story: "A deeply nested breadcrumb trail showing full path without collapsing.",
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products/electronics">Electronics</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products/electronics/computers">Computers</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Laptops</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// ============================================================================
// Truncation Example
// ============================================================================

export const WithTruncation: Story = {
  parameters: {
    docs: {
      description: {
        story: "Long breadcrumb labels are automatically truncated to maintain layout. Truncation applies to both links and the current page.",
      },
    },
  },
  render: () => (
    <div className="w-72">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="max-w-24 truncate">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/category" className="max-w-24 truncate">
              Very Long Category Name That Should Truncate
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-24 truncate">
              Another Very Long Page Title Here
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
};

// ============================================================================
// Custom Styling
// ============================================================================

export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story: "Customize the appearance using className props on each component.",
      },
    },
  },
  render: () => (
    <Breadcrumb className="bg-muted/50 p-3 rounded-lg">
      <BreadcrumbList className="text-xs gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-muted-foreground/50" />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/docs"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Documentation
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-muted-foreground/50" />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold">
            Components
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
