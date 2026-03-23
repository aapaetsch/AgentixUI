# Pagination Component - Agent Notes
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Overview
A comprehensive pagination component system following shadcn/ui patterns with compound component architecture, responsive design, and smart page range calculation.

## Components

### Pagination
Root navigation container (`<nav>`).

### PaginationContent
Unordered list container (`<ul>`) for pagination items.

### PaginationItem
List item wrapper (`<li>`) for individual elements.

### PaginationLink
Clickable page link - supports both anchor and button modes.

### PaginationPrevious / PaginationNext
Navigation buttons with chevron icons.

### PaginationFirst / PaginationLast
Jump to first/last page buttons with double chevron icons.

### PaginationEllipsis
Visual indicator for skipped pages.

### PaginationPageSizeSelector
Dropdown for changing items per page (separate component).

### ResponsivePagination
Pre-composed component with automatic responsive behavior.

## Props Summary

### PaginationLink
```typescript
interface PaginationLinkProps {
  isActive?: boolean;              // Current page indicator
  variant?: "default" | "outline"; // Visual style
  size?: "sm" | "md" | "lg";       // 32px | 36px | 40px
  shape?: "default" | "round" | "square";
  asButton?: boolean;              // Render as button vs anchor
  onClick?: MouseEventHandler;
  href?: string;
}
```

### ResponsivePagination
```typescript
interface ResponsivePaginationProps {
  currentPage: number;             // 1-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;           // Pages beside current (default: 1)
  showFirstLast?: boolean;         // Show first/last buttons
  showLabelsOnMobile?: boolean;    // Show prev/next labels on mobile
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  shape?: "default" | "round" | "square";
}
```

### PaginationPageSizeSelector
```typescript
interface PaginationPageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];      // Default: [10, 20, 30, 50, 100]
  size?: "sm" | "md" | "lg";
  label?: string;                  // Default: "Rows per page"
  showLabel?: boolean;             // Default: true
}
```

## Dependencies
- `lucide-react` - Icons (ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal)
- `class-variance-authority` - Variant management
- `../button` - Button variants for styling
- `../select` - Page size selector dropdown
- `../../../lib/utils` - `cn()` utility

## Styling Decisions

### Visual Variants
| Variant | Background | Border | Active State |
|---------|------------|--------|--------------|
| `default` | Transparent → accent | None | Accent bg + semibold |
| `outline` | Transparent → accent | Border | Primary border + tint |

### Size Specifications
| Size | Height | Min-Width | Icon Size | Font |
|------|--------|-----------|-----------|------|
| `sm` | 32px | 32px | 14px | text-xs |
| `md` | 36px | 36px | 16px | text-sm |
| `lg` | 40px | 40px | 20px | text-base |

### Shape Variants
- `default`: `rounded-[var(--radius)]`
- `round`: `rounded-full`
- `square`: `rounded-[var(--radius-sm)]`

### Motion
- Duration: `var(--motion-duration-medium)` (200ms)
- Easing: `var(--motion-easing-standard)`
- Active scale: 0.98

### Responsive Behavior
- Desktop: Full page numbers with ellipsis
- Mobile (`<sm`): Hides page numbers, shows "X / Y" text
- Labels hidden on mobile by default

## Hooks

### usePaginationRange
Calculates smart page range with ellipsis placement.

```typescript
function usePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | "ellipsis")[]
```

**Algorithm:**
1. If total pages ≤ total displayable numbers, show all
2. Otherwise, calculate left/right sibling indices
3. Determine ellipsis placement based on distance from edges
4. Return array with numbers and "ellipsis" markers

## Maintenance Notes

### Accessibility
- Root element: `<nav role="navigation" aria-label="pagination">`
- Active page: `aria-current="page"`
- Disabled buttons: `aria-disabled="true"`
- Ellipsis: `aria-hidden="true"` (decorative)
- Icon-only buttons have `<span className="sr-only">` text

### Edge Cases
- Single page: `ResponsivePagination` returns `null`
- Page out of bounds: Clamped to valid range
- Page size change: Consumer should reset to page 1

### Button vs Anchor Mode
- `asButton={false}` (default): Renders `<a>` with `href`
- `asButton={true}`: Renders `<button>` with `onClick`
- Mixed refs handled via type assertion

### CSS Variables Used
```css
--radius
--radius-sm
--motion-duration-medium
--motion-easing-standard
--ring (focus state)
```

## File Structure
```
src/components/free/pagination/
├── index.tsx              # Main implementation
├── Pagination.stories.tsx # Storybook stories
├── README.md              # User documentation
└── agents.md              # This file
```

## Usage Patterns

### Basic (Links)
```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="/page/1" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/page/2" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="/page/3" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

### Controlled (Buttons)
```tsx
const [page, setPage] = useState(1);

<ResponsivePagination
  currentPage={page}
  totalPages={20}
  onPageChange={setPage}
/>
```

### With Page Size Selector
```tsx
<div className="flex items-center justify-between">
  <PaginationPageSizeSelector
    pageSize={pageSize}
    onPageSizeChange={setPageSize}
  />
  <ResponsivePagination
    currentPage={page}
    totalPages={Math.ceil(total / pageSize)}
    onPageChange={setPage}
  />
</div>
```


