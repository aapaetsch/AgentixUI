import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
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
  usePaginationRange,
} from "./index";

/**
 * Pagination component for navigating through pages of content.
 *
 * ## Features
 * - Compound component pattern for flexible composition
 * - Responsive design with automatic page number hiding on mobile
 * - Support for both anchor links and button-based navigation
 * - Multiple size variants: `sm`, `md`, `lg`
 * - Multiple visual variants: `default`, `outline`
 * - Multiple shape variants: `default`, `round`, `square`
 * - Optional first/last page navigation buttons
 * - Page size selector component
 * - Smart pagination range calculation with ellipsis
 */
const meta: Meta<typeof Pagination> = {
  title: "Free/Navigation/Pagination",
  component: Pagination,
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

/**
 * Default pagination with basic page links
 */
export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * Pagination with button-based navigation (no href)
 */
export const WithButtons: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(2);
    const totalPages = 10;

    return (
      <div className="space-y-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                asButton
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[1, 2, 3, 4, 5].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  asButton
                  onClick={() => setCurrentPage(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                asButton
                onClick={() => setCurrentPage(totalPages)}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                asButton
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <p className="text-center text-sm text-muted-foreground">
          Current page: <strong>{currentPage}</strong>
        </p>
      </div>
    );
  },
};

// ============================================================================
// Variants
// ============================================================================

/**
 * Outline variant with border styling
 */
export const OutlineVariant: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" variant="outline" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" variant="outline">
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" variant="outline" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" variant="outline">
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" variant="outline" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * All available size variants
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Extra Small (small)</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" size="small" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="small">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="small" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="small">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" size="small" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Small (sm)</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" size="sm" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="sm">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="sm" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="sm">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" size="sm" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Medium (md) - Default</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" size="md" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="md">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="md" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="md">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" size="md" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Large (lg)</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" size="lg" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="lg">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="lg" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="lg">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" size="lg" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
};

/**
 * All available shape variants
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Default shape</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" shape="default" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" shape="default" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" shape="default">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" shape="default" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Round shape</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" shape="round" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" shape="round" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" shape="round">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" shape="round" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Square shape</p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" shape="square" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" shape="square" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" shape="square">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" shape="square" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ),
};

// ============================================================================
// First/Last Buttons
// ============================================================================

/**
 * Pagination with first and last page buttons
 */
export const WithFirstLast: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * First/Last with visible labels
 */
export const FirstLastWithLabels: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst href="#" showLabel />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast href="#" showLabel />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// ============================================================================
// Page Size Selector
// ============================================================================

/**
 * Page size selector component
 */
export const PageSizeSelector: Story = {
  render: function Render() {
    const [pageSize, setPageSize] = React.useState(10);

    return (
      <div className="space-y-4">
        <PaginationPageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <p className="text-sm text-muted-foreground">
          Items per page: <strong>{pageSize}</strong>
        </p>
      </div>
    );
  },
};

/**
 * Page size selector with custom options
 */
export const PageSizeSelectorCustomOptions: Story = {
  render: function Render() {
    const [pageSize, setPageSize] = React.useState(25);

    return (
      <PaginationPageSizeSelector
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 25, 50]}
        label="Items per page"
      />
    );
  },
};

/**
 * Page size selector sizes
 */
export const PageSizeSelectorSizes: Story = {
  render: function Render() {
    const [pageSize, setPageSize] = React.useState(10);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-16">Small:</span>
          <PaginationPageSizeSelector
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-16">Medium:</span>
          <PaginationPageSizeSelector
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            size="md"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-16">Large:</span>
          <PaginationPageSizeSelector
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            size="lg"
          />
        </div>
      </div>
    );
  },
};

// ============================================================================
// Responsive Pagination
// ============================================================================

/**
 * Pre-composed responsive pagination component
 */
export const Responsive: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(5);
    const totalPages = 20;

    return (
      <div className="space-y-4">
        <ResponsivePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <p className="text-center text-sm text-muted-foreground">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </p>
      </div>
    );
  },
};

/**
 * Responsive pagination with first/last buttons
 */
export const ResponsiveWithFirstLast: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(10);
    const totalPages = 50;

    return (
      <div className="space-y-4">
        <ResponsivePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showFirstLast
        />
        <p className="text-center text-sm text-muted-foreground">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </p>
      </div>
    );
  },
};

/**
 * Responsive pagination with outline variant
 */
export const ResponsiveOutline: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(3);

    return (
      <ResponsivePagination
        currentPage={currentPage}
        totalPages={15}
        onPageChange={setCurrentPage}
        variant="outline"
      />
    );
  },
};

/**
 * Responsive pagination with more siblings
 */
export const ResponsiveMoreSiblings: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(10);

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          siblingCount=2 (shows 2 pages on each side of current)
        </p>
        <ResponsivePagination
          currentPage={currentPage}
          totalPages={30}
          onPageChange={setCurrentPage}
          siblingCount={2}
        />
      </div>
    );
  },
};

/**
 * Responsive pagination - all sizes
 */
export const ResponsiveSizes: Story = {
  render: function Render() {
    const [page1, setPage1] = React.useState(3);
    const [page2, setPage2] = React.useState(3);
    const [page3, setPage3] = React.useState(3);

    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Small</p>
          <ResponsivePagination
            currentPage={page1}
            totalPages={10}
            onPageChange={setPage1}
            size="sm"
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Medium (default)</p>
          <ResponsivePagination
            currentPage={page2}
            totalPages={10}
            onPageChange={setPage2}
            size="md"
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Large</p>
          <ResponsivePagination
            currentPage={page3}
            totalPages={10}
            onPageChange={setPage3}
            size="lg"
          />
        </div>
      </div>
    );
  },
};

/**
 * Responsive pagination - all shapes
 */
export const ResponsiveShapes: Story = {
  render: function Render() {
    const [page1, setPage1] = React.useState(3);
    const [page2, setPage2] = React.useState(3);
    const [page3, setPage3] = React.useState(3);

    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Default shape</p>
          <ResponsivePagination
            currentPage={page1}
            totalPages={10}
            onPageChange={setPage1}
            shape="default"
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Round shape</p>
          <ResponsivePagination
            currentPage={page2}
            totalPages={10}
            onPageChange={setPage2}
            shape="round"
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Square shape</p>
          <ResponsivePagination
            currentPage={page3}
            totalPages={10}
            onPageChange={setPage3}
            shape="square"
          />
        </div>
      </div>
    );
  },
};

// ============================================================================
// Edge Cases
// ============================================================================

/**
 * Pagination with few pages (no ellipsis needed)
 */
export const FewPages: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(2);

    return (
      <div className="space-y-4">
        <ResponsivePagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
        <p className="text-center text-sm text-muted-foreground">
          With only 5 pages, no ellipsis is shown
        </p>
      </div>
    );
  },
};

/**
 * Single page (pagination hidden)
 */
export const SinglePage: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(1);

    return (
      <div className="space-y-4">
        <ResponsivePagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
        <p className="text-center text-sm text-muted-foreground">
          With only 1 page, pagination is hidden
        </p>
      </div>
    );
  },
};

/**
 * First page selected
 */
export const FirstPageSelected: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(1);

    return (
      <ResponsivePagination
        currentPage={currentPage}
        totalPages={20}
        onPageChange={setCurrentPage}
        showFirstLast
      />
    );
  },
};

/**
 * Last page selected
 */
export const LastPageSelected: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(20);

    return (
      <ResponsivePagination
        currentPage={currentPage}
        totalPages={20}
        onPageChange={setCurrentPage}
        showFirstLast
      />
    );
  },
};

// ============================================================================
// Real-World Examples
// ============================================================================

/**
 * Data table with pagination and page size selector
 */
export const DataTableExample: Story = {
  name: "Example: Data Table",
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const totalItems = 127;
    const totalPages = Math.ceil(totalItems / pageSize);

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    // Reset to page 1 when page size changes
    React.useEffect(() => {
      setCurrentPage(1);
    }, [pageSize]);

    return (
      <div className="w-full max-w-2xl space-y-4">
        {/* Mock table */}
        <div className="rounded-lg border">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-medium">Users</h3>
          </div>
          <div className="p-4 min-h-[200px] flex items-center justify-center text-muted-foreground">
            Showing items {startItem}-{endItem} of {totalItems}
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <PaginationPageSizeSelector
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            size="sm"
          />
          <ResponsivePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            size="sm"
          />
        </div>
      </div>
    );
  },
};

/**
 * Blog posts list with pagination
 */
export const BlogPostsExample: Story = {
  name: "Example: Blog Posts",
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = 12;

    return (
      <div className="w-full max-w-lg space-y-6">
        {/* Mock blog posts */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border">
              <h3 className="font-medium mb-1">
                Blog Post Title {(currentPage - 1) * 3 + i}
              </h3>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <ResponsivePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          variant="outline"
          shape="round"
        />
      </div>
    );
  },
};

/**
 * Product gallery with pagination
 */
export const ProductGalleryExample: Story = {
  name: "Example: Product Gallery",
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = 8;

    return (
      <div className="w-full max-w-2xl space-y-6">
        {/* Mock product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg border bg-muted/50 flex items-center justify-center text-muted-foreground"
            >
              Product {(currentPage - 1) * 8 + i + 1}
            </div>
          ))}
        </div>

        {/* Centered pagination */}
        <div className="flex justify-center">
          <ResponsivePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showFirstLast
          />
        </div>
      </div>
    );
  },
};

/**
 * Search results with pagination info
 */
export const SearchResultsExample: Story = {
  name: "Example: Search Results",
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const pageSize = 10;
    const totalResults = 234;
    const totalPages = Math.ceil(totalResults / pageSize);

    const startResult = (currentPage - 1) * pageSize + 1;
    const endResult = Math.min(currentPage * pageSize, totalResults);

    return (
      <div className="w-full max-w-xl space-y-4">
        {/* Results info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{startResult}-{endResult}</strong> of{" "}
            <strong>{totalResults}</strong> results
          </p>
        </div>

        {/* Mock search results */}
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="p-3 rounded border">
              <div className="flex items-center gap-2 mb-1">
                <div className="size-4 rounded bg-primary/20" />
                <span className="font-medium text-sm">
                  Result {startResult + i}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Search result description text here...
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <ResponsivePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          size="sm"
          siblingCount={2}
        />
      </div>
    );
  },
};

// ============================================================================
// Hook Demo
// ============================================================================

/**
 * Demonstrates the usePaginationRange hook
 */
export const HookDemo: Story = {
  name: "Hook: usePaginationRange",
  render: function Render() {
    const [currentPage, setCurrentPage] = React.useState(5);
    const [totalPages, setTotalPages] = React.useState(20);
    const [siblingCount, setSiblingCount] = React.useState(1);

    const range = usePaginationRange(currentPage, totalPages, siblingCount);

    return (
      <div className="space-y-6 w-full max-w-md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Current Page: {currentPage}
            </label>
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Total Pages: {totalPages}
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={totalPages}
              onChange={(e) => setTotalPages(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Sibling Count: {siblingCount}
            </label>
            <input
              type="range"
              min={0}
              max={3}
              value={siblingCount}
              onChange={(e) => setSiblingCount(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-muted/50">
          <p className="text-sm font-medium mb-2">Calculated Range:</p>
          <div className="flex flex-wrap gap-2">
            {range.map((item, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded text-sm ${
                  item === currentPage
                    ? "bg-primary text-primary-foreground"
                    : item === "ellipsis"
                    ? "text-muted-foreground"
                    : "bg-background border"
                }`}
              >
                {item === "ellipsis" ? "..." : item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Accessibility
// ============================================================================

/**
 * Shows keyboard navigation and focus states
 */
export const AccessibilityDemo: Story = {
  name: "Accessibility Features",
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tab through the pagination to see focus states. All elements have proper
        ARIA attributes.
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <ul className="text-xs text-muted-foreground space-y-1">
        <li>• <code>role="navigation"</code> on root element</li>
        <li>• <code>aria-label="pagination"</code> for screen readers</li>
        <li>• <code>aria-current="page"</code> on active page</li>
        <li>• <code>aria-disabled</code> on disabled buttons</li>
        <li>• <code>aria-hidden</code> on ellipsis (decorative)</li>
        <li>• Screen reader text for icon-only buttons</li>
      </ul>
    </div>
  ),
};
