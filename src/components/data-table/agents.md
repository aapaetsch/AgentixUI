# DataTable Component

## Title
DataTable

## Props
- `DataTable`: generic TanStack-powered table with `columns`, `data`, optional `caption`, empty-state messaging, and `tableClassName` and `className` overrides.
- Toolbar props: `searchColumn`, `searchPlaceholder`, `toolbarFilters`, `toolbarContent`, and `showColumnVisibility`.
- Selection and actions: `enableRowSelection`, `rowActions`, and `rowActionsLabel`.
- Detail rows: `renderSubRow` and `isRowExpanded` render consumer-controlled expanded content below standard rows.
- Presentation controls: `size`, `variant`, `stickyHeader`, `showPagination`, `pageSizeOptions`, and `initialPageSize`.
- Virtualization controls: `virtualize`, `virtualizationHeight`, and `virtualizationOverscan`.
- Controlled state props: `sorting`, `columnFilters`, `columnVisibility`, `rowSelection`, and `pagination`, each with matching change callbacks and uncontrolled defaults.
- Exported helpers: `DataTableColumnHeader`, `DataTableToolbar`, `DataTablePagination`, `DataTableRowActions`, and `dataTableSurfaceVariants`.

## Internal Types
- `DataTableRowAction<TData>` describes per-row action metadata and handlers.
- `DataTableToolbarFilter` and `DataTableToolbarFilterOption` drive select-style toolbar filters.
- `DataTableColumnMeta<TData>` extends TanStack column metadata with `label`, alignment, visibility, search, filter, and cell formatting hints.

## Dependencies
- `@tanstack/react-table`
- `@tanstack/react-virtual`
- Internal `Button`, `Checkbox`, `DropdownMenu`, `Input`, `Select`, and `Table` components
- `class-variance-authority`
- `src/lib/utils.ts`

## Styling Decisions
- The outer surface uses the same radius, border, and background tokens as the rest of the library so it can sit beside cards, sheets, and popovers without looking foreign.
- Toolbar controls are composed from existing `Input`, `Button`, `Select`, and `DropdownMenu` primitives instead of data-table-specific variants, which keeps filtering and visibility controls visually aligned with the rest of the kit.
- Density is controlled through header and cell padding helpers rather than alternate markup paths. That keeps the standard and virtualized renderers visually synchronized.
- Striping is optional and deliberately subtle so hover, selection, and action affordances remain stronger than decorative treatment.
- Expanded subrows span all visible columns. Virtualization is disabled when a subrow renderer is supplied because row heights become variable.

## Maintenance Notes
- Keep TanStack-specific state logic in `index.tsx`; presentational helpers such as pagination and row actions should stay thin.
- Column metadata is extended through module augmentation in `types.ts`; if new per-column behaviors are added, document them there first so both consumer types and internal helpers stay aligned.
- The virtualization path intentionally renders through `DataTableVirtualized` instead of the standard `TableBody` flow. Any changes to row height, header padding, or sticky behavior must be verified in both render paths.
- Row actions are injected as an extra column and selection is injected as a leading checkbox column. Changes to either helper affect column counts, visibility handling, and empty-state colspan logic.
