# Table Component

## Title
Table

## Props
- `Table`: standard table element props plus `containerClassName` for styling the scroll wrapper around the table.
- `TableHeader`, `TableBody`, `TableFooter`: semantic section wrappers with standard HTML section attributes.
- `TableRow`: row props with hover and selected-state styling via `data-state="selected"`.
- `TableHead`: header cell props built on `th`, including checkbox alignment helpers.
- `TableCell`: body cell props built on `td`, including checkbox alignment helpers.
- `TableCaption`: caption props with muted supporting text styling.

## Exported Surface
- The folder exports only thin table primitives: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption`.
- `DataTable` composes these primitives from a different folder. Keep this file behavior-free so it remains reusable for plain tabular layouts.

## Dependencies
- React
- `src/lib/utils.ts`

## Styling Decisions
- The root wraps the table in a dedicated `overflow-x-auto` container so wide datasets remain usable without forcing every consumer to remember the same wrapper markup.
- Header, body, footer, and cell primitives keep styling intentionally light: spacing, alignment, borders, and selection states live here, while sorting, pagination, and virtualization stay in higher-level components.
- Checkbox-related selectors are built into header and cell classes so selection columns align correctly without custom per-table overrides.
- Selected row styling uses the same low-contrast primary tint pattern as the rest of the library, which keeps it compatible with striped, hoverable, and interactive table compositions.

## Maintenance Notes
- Keep this primitive thin; behavioral logic belongs in higher-level components such as `DataTable`.
- If spacing or border treatment changes, update the shared primitives here first and only add per-consumer overrides when a specific product surface needs them.
- Avoid coupling this file to TanStack Table, sorting state, or row virtualization so the component remains useful for plain data display and non-grid content.
- Changes to the wrapper structure can affect Storybook examples and `DataTable`, because that component relies on the outer scroll container rather than adding its own.
