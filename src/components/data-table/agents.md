# DataTable Component

## Title
DataTable

## Props
- `columns`, `data`: TanStack column definitions and row data
- `searchColumn`, `searchPlaceholder`: built-in text filtering hook-up for one primary search field
- `toolbarFilters`: optional select-based column filters
- `enableRowSelection`: injects the checkbox selection column
- `rowActions`: static or row-derived action definitions rendered through `DropdownMenu`
- `showColumnVisibility`, `showPagination`, `toolbarContent`: optional UI controls around the table
- `virtualize`, `virtualizationHeight`, `virtualizationOverscan`: row virtualization controls
- `size`, `variant`, `stickyHeader`: density and presentation settings
- Controlled state props: `sorting`, `columnFilters`, `columnVisibility`, `rowSelection`, `pagination` plus matching change callbacks

## Dependencies
- `@tanstack/react-table`
- `@tanstack/react-virtual`
- Internal `Button`, `Checkbox`, `DropdownMenu`, `Input`, `Select`, and `Table` components
- `class-variance-authority`
- `src/lib/utils.ts`

## Styling Decisions
- The outer surface uses the same radius, border, and background tokens as the rest of the library so it can sit beside cards, sheets, and popovers without looking foreign.
- Toolbar controls are intentionally composed from existing free-tier inputs and buttons instead of introducing data-table-specific variants.
- Density is managed through row and header padding classes only, which keeps the primitive table structure intact and avoids special-case layout code.
- Row striping is optional and subtle so selection and hover states remain visually stronger than the decorative treatment.

## Maintenance Notes
- Keep TanStack-specific state logic in `index.tsx`; presentational helpers such as pagination and row actions should stay thin.
- Column metadata is extended through module augmentation in `types.ts`; if new per-column behaviors are added, document them there first.
- The virtualization path intentionally handles layout separately from the standard table path. Changes to header or cell sizing need to be tested in both modes.
- When adding row actions, prefer static data passed in from the consumer rather than coupling the table to app-specific side effects.
