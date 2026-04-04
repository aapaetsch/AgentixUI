# Table

A lightweight table primitive for structured data display. This component mirrors the library's existing styling tokens and works as the foundation for the premium `DataTable` component.

## Features

- Responsive horizontal scrolling wrapper
- Styled header, row, cell, footer, and caption primitives
- Minimal, reusable API based on semantic HTML table elements

## Basic Usage

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aidan/ui";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
      <TableCell>ada@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Notes

- Use this primitive when you only need presentational table markup.
- For sorting, filtering, pagination, selection, or virtualization, use the premium `DataTable` component.
- `containerClassName` can be used to tune the outer overflow wrapper without affecting the table element itself.
