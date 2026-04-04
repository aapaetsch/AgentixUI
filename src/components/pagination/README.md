# Pagination Components

A comprehensive pagination system following shadcn/ui patterns with responsive behavior, multiple variants, and smart page range calculation.

## Components

### Pagination
Root navigation container for pagination elements.

### PaginationContent
Ordered list container for pagination items.

### PaginationItem
List item wrapper for individual pagination elements.

### PaginationLink
Clickable link for page navigation. Supports both anchor (`<a>`) and button modes.

### PaginationPrevious
Previous page navigation button with chevron icon.

### PaginationNext
Next page navigation button with chevron icon.

### PaginationFirst
First page navigation button with double chevron icon.

### PaginationLast
Last page navigation button with double chevron icon.

### PaginationEllipsis
Ellipsis indicator for skipped pages.

### PaginationPageSizeSelector
Dropdown component to change items per page.

### ResponsivePagination
Pre-composed pagination with automatic responsive behavior and smart page range calculation.

## Installation

```bash
npm install @aidan/ui
```

## Usage

### Basic Pagination

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@aidan/ui';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
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
```

### Button-Based Navigation

```tsx
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@aidan/ui';

function MyPagination() {
  const [page, setPage] = useState(1);
  const totalPages = 10;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            asButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-disabled={page === 1}
          />
        </PaginationItem>
        {[1, 2, 3].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              asButton
              onClick={() => setPage(p)}
              isActive={p === page}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            asButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
```

### Responsive Pagination (Recommended)

The `ResponsivePagination` component handles page range calculation, ellipsis placement, and mobile responsiveness automatically.

```tsx
import { useState } from 'react';
import { ResponsivePagination } from '@aidan/ui';

function MyPagination() {
  const [page, setPage] = useState(1);

  return (
    <ResponsivePagination
      currentPage={page}
      totalPages={20}
      onPageChange={setPage}
    />
  );
}
```

### With First/Last Buttons

```tsx
<ResponsivePagination
  currentPage={page}
  totalPages={50}
  onPageChange={setPage}
  showFirstLast
/>
```

### With Page Size Selector

```tsx
import { useState } from 'react';
import { ResponsivePagination, PaginationPageSizeSelector } from '@aidan/ui';

function DataTablePagination() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 127;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="flex items-center justify-between">
      <PaginationPageSizeSelector
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <ResponsivePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Using the usePaginationRange Hook

```tsx
import { usePaginationRange } from '@aidan/ui';

function CustomPagination({ currentPage, totalPages }) {
  const range = usePaginationRange(currentPage, totalPages, 1);
  
  // range = [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]
  
  return (
    <div>
      {range.map((item, index) => (
        item === 'ellipsis' 
          ? <span key={index}>...</span>
          : <button key={index}>{item}</button>
      ))}
    </div>
  );
}
```

## Props

### Pagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional class name |

### PaginationLink

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | `false` | Whether this is the current page |
| `variant` | `"default" \| "outline"` | `"default"` | Visual variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `shape` | `"default" \| "round" \| "square"` | `"default"` | Shape variant |
| `asButton` | `boolean` | `false` | Render as button instead of anchor |
| `onClick` | `function` | - | Click handler (for button mode) |
| `href` | `string` | - | URL for anchor mode |

### PaginationPrevious / PaginationNext

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"Previous"` / `"Next"` | Label text |
| `showLabel` | `boolean` | `true` | Whether to show the label |
| All PaginationLink props | - | - | Inherits all PaginationLink props |

### PaginationFirst / PaginationLast

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"First"` / `"Last"` | Label text |
| `showLabel` | `boolean` | `false` | Whether to show the label |
| All PaginationLink props | - | - | Inherits all PaginationLink props |

### PaginationEllipsis

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `className` | `string` | - | Additional class name |

### PaginationPageSizeSelector

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageSize` | `number` | - | Current page size |
| `onPageSizeChange` | `(pageSize: number) => void` | - | Callback when page size changes |
| `pageSizeOptions` | `number[]` | `[10, 20, 30, 50, 100]` | Available options |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `label` | `string` | `"Rows per page"` | Label text |
| `showLabel` | `boolean` | `true` | Whether to show the label |

### ResponsivePagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | - | Current page (1-indexed) |
| `totalPages` | `number` | - | Total number of pages |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes |
| `siblingCount` | `number` | `1` | Pages to show on each side of current |
| `showFirstLast` | `boolean` | `false` | Show first/last buttons |
| `showLabelsOnMobile` | `boolean` | `false` | Show prev/next labels on mobile |
| `variant` | `"default" \| "outline"` | `"default"` | Visual variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `shape` | `"default" \| "round" \| "square"` | `"default"` | Shape variant |

## Hooks

### usePaginationRange

Calculates the pagination range with ellipsis placement.

```tsx
const range = usePaginationRange(
  currentPage,  // Current page (1-indexed)
  totalPages,   // Total number of pages
  siblingCount  // Number of siblings (default: 1)
);
// Returns: (number | "ellipsis")[]
```

## Variants

### Visual Variants

| Variant | Description |
|---------|-------------|
| `default` | Ghost-style with hover background |
| `outline` | Border with hover background |

### Size Variants

| Size | Height | Description |
|------|--------|-------------|
| `sm` | 32px | Compact size |
| `md` | 36px | Default size |
| `lg` | 40px | Larger size |

### Shape Variants

| Shape | Description |
|-------|-------------|
| `default` | Standard rounded corners |
| `round` | Fully rounded (pill shape) |
| `square` | Less rounded corners |

## Responsive Behavior

The `ResponsivePagination` component automatically adapts to screen size:

- **Desktop**: Shows page numbers with ellipsis as needed
- **Mobile**: Hides page numbers and shows "X / Y" indicator

Labels on Previous/Next buttons are hidden on mobile by default (can be enabled with `showLabelsOnMobile`).

## Accessibility

- Uses semantic `<nav>` element with `role="navigation"`
- Includes `aria-label="pagination"` on root
- Active page marked with `aria-current="page"`
- Disabled states use `aria-disabled`
- Ellipsis has `aria-hidden` (decorative)
- Icon-only buttons have screen reader text
- Full keyboard navigation support

## Dependencies

- `lucide-react` - Icons (ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal)
- `class-variance-authority` - Variant management
- `@aidan/ui/button` - Button styles
- `@aidan/ui/select` - Page size selector

## License

MIT © Aidan
