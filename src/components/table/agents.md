# Table Component

## Title
Table

## Props
- `Table`: standard table props plus `containerClassName` for the horizontal scroll wrapper
- `TableHeader`, `TableBody`, `TableFooter`: section element props
- `TableRow`: row props
- `TableHead`: header cell props
- `TableCell`: data cell props
- `TableCaption`: caption props

## Dependencies
- React
- `src/lib/utils.ts`

## Styling Decisions
- The root wraps the table in a horizontal overflow container to keep large tables usable on smaller viewports.
- Row and cell styles stay intentionally restrained so display tables and advanced table-like components can both reuse the primitive.
- Selected-row styling matches the same subtle primary tint used elsewhere in the library.

## Maintenance Notes
- Keep this primitive thin; behavioral logic belongs in higher-level components such as `DataTable`.
- If spacing needs to change, update the primitive once and let advanced components override via `className` only when necessary.
- Avoid coupling this file to TanStack Table so it remains useful for plain data display.
