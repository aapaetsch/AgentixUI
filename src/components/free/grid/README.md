# Grid Component

A flexible CSS Grid layout container with preset column counts (1-12), gap, and padding options. Includes a `GridItem` sub-component for precise item placement and individual spacing control.

## Installation

The Grid component is part of the `@aidan/ui` library. Import it directly:

```tsx
import { Grid, GridItem } from "@aidan/ui";
```

## Usage

### Basic Grid

```tsx
<Grid cols={3} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### Responsive Grid

Use Tailwind responsive classes via the `className` prop:

```tsx
<Grid cols={1} gap="md" className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>
```

### With GridItem for Spanning

```tsx
<Grid cols={4} gap="md">
  <GridItem colSpan={2}>Spans 2 columns</GridItem>
  <div>Normal item</div>
  <div>Normal item</div>
  <GridItem colSpan="full">Full-width item</GridItem>
</Grid>
```

### Arbitrary Column Count

For column counts beyond 12, use Tailwind's arbitrary value syntax:

```tsx
<Grid className="grid-cols-[repeat(13,minmax(0,1fr))]" gap="sm">
  {/* 13 column grid */}
</Grid>
```

### Grid with Padding

```tsx
<Grid cols={3} gap="md" padding="lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### Independent Gap and Padding

```tsx
<Grid cols={3} gapX="xl" gapY="sm" paddingX="lg" paddingY="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### GridItem with Individual Padding

```tsx
<Grid cols={3} gap="md">
  <GridItem padding="lg">Item with large padding</GridItem>
  <GridItem padding="sm">Item with small padding</GridItem>
  <GridItem paddingX="xl" paddingY="xs">Custom padding</GridItem>
</Grid>
```

### Dashboard Layout Example

```tsx
<Grid cols={12} gap="md">
  {/* Full-width header */}
  <GridItem colSpan="full">
    <header>Header</header>
  </GridItem>

  {/* Sidebar spanning 2 rows */}
  <GridItem colSpan={3} rowSpan={2}>
    <nav>Sidebar</nav>
  </GridItem>

  {/* Main content */}
  <GridItem colSpan={9}>
    <main>Content</main>
  </GridItem>

  {/* Stats row */}
  <GridItem colSpan={9}>
    <Grid cols={3} gap="md">
      <div>Stat 1</div>
      <div>Stat 2</div>
      <div>Stat 3</div>
    </Grid>
  </GridItem>
</Grid>
```

## Components

### Grid

The main container component that sets up the CSS Grid layout.

### GridItem

Optional wrapper for grid items that need custom placement or spacing.

## Grid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `1-12 \| "none"` | `1` | Number of columns |
| `gap` | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | `"md"` | Gap between items |
| `gapX` | Same as gap | - | Horizontal gap (overrides gap) |
| `gapY` | Same as gap | - | Vertical gap (overrides gap) |
| `padding` | Same as gap | - | Padding around the grid |
| `paddingX` | Same as gap | - | Horizontal padding |
| `paddingY` | Same as gap | - | Vertical padding |
| `flow` | `"row" \| "col" \| "dense" \| "row-dense" \| "col-dense"` | - | Grid auto flow direction |
| `alignItems` | `"start" \| "center" \| "end" \| "stretch" \| "baseline"` | - | Vertical alignment of items |
| `justifyItems` | `"start" \| "center" \| "end" \| "stretch"` | - | Horizontal alignment of items |
| `alignContent` | `"start" \| "center" \| "end" \| "stretch" \| "between" \| "around" \| "evenly"` | - | Align content (multiple rows) |
| `justifyContent` | `"start" \| "center" \| "end" \| "stretch" \| "between" \| "around" \| "evenly"` | - | Justify content (multiple columns) |
| `asChild` | `boolean` | `false` | Render as child element |
| `className` | `string` | - | Additional Tailwind classes (for responsive breakpoints, arbitrary values) |

## GridItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colSpan` | `1-12 \| "full" \| "auto"` | - | Number of columns to span |
| `rowSpan` | `1-6 \| "full" \| "auto"` | - | Number of rows to span |
| `colStart` | `1-13 \| "auto"` | - | Column start position |
| `colEnd` | `1-13 \| "auto"` | - | Column end position |
| `rowStart` | `1-7 \| "auto"` | - | Row start position |
| `rowEnd` | `1-7 \| "auto"` | - | Row end position |
| `alignSelf` | `"auto" \| "start" \| "center" \| "end" \| "stretch" \| "baseline"` | - | Override vertical alignment for this item |
| `justifySelf` | `"auto" \| "start" \| "center" \| "end" \| "stretch"` | - | Override horizontal alignment for this item |
| `padding` | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | - | Padding for this item |
| `paddingX` | Same as padding | - | Horizontal padding |
| `paddingY` | Same as padding | - | Vertical padding |
| `order` | `"first" \| "last" \| "none" \| 1-12` | - | Item order |
| `asChild` | `boolean` | `false` | Render as child element |
| `className` | `string` | - | Additional classes |

## Gap Size Reference

| Value | Tailwind Class | Size |
|-------|---------------|------|
| `none` | `gap-0` | 0 |
| `xs` | `gap-1` | 0.25rem (4px) |
| `sm` | `gap-2` | 0.5rem (8px) |
| `md` | `gap-4` | 1rem (16px) |
| `lg` | `gap-6` | 1.5rem (24px) |
| `xl` | `gap-8` | 2rem (32px) |
| `2xl` | `gap-10` | 2.5rem (40px) |
| `3xl` | `gap-12` | 3rem (48px) |

## Styling

### Custom Styles

The Grid and GridItem components accept a `className` prop for custom styling:

```tsx
<Grid cols={3} gap="md" className="bg-muted/30 rounded-lg">
  <GridItem className="bg-primary/10 rounded-md">Custom styled item</GridItem>
</Grid>
```

### Responsive Breakpoints

Use Tailwind responsive prefixes in the `className` prop:

```tsx
// Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols
<Grid cols={1} className="sm:grid-cols-2 lg:grid-cols-4">
  {/* items */}
</Grid>

// Responsive gap
<Grid cols={3} gap="sm" className="lg:gap-8">
  {/* items */}
</Grid>
```

## Accessibility

- The Grid component uses semantic `<div>` elements by default
- Use `asChild` prop to render as a different element when needed
- Grid layout maintains source order for screen readers
- Use `order` prop on GridItem sparingly as it affects visual order only, not DOM order

## Related Components

- [Flex](../flex/README.md) - Flexbox layout component
- [Container](../container/README.md) - Max-width container component
- [Card](../card/README.md) - Content container that works well in grids
