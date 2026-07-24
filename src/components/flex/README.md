# Flex Components

Flexible container and item components for building layouts with flexbox.

## Overview

The Flex components provide a convenient way to apply common flexbox properties without writing verbose Tailwind classes. They support all major flexbox properties as props for better readability and consistency.

## Components

- `Flex` - Base flex container with full direction control
- `FlexRow` - Convenience component for horizontal layouts
- `FlexCol` - Convenience component for vertical layouts
- `FlexItem` - Flex item with grow, shrink, basis, and order control

## Installation

Flex components are part of the core library. No additional installation is required.

## Usage

### FlexRow (Horizontal Layout)

```tsx
import { FlexRow, FlexItem } from "aapaetsch-ui-kit";

// Basic row layout
<FlexRow gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</FlexRow>

// Reversed row
<FlexRow reverse gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</FlexRow>

// Centered row with space between
<FlexRow justify="between" align="center" gap={4}>
  <div>Left</div>
  <div>Right</div>
</FlexRow>
```

### FlexCol (Vertical Layout)

```tsx
import { FlexCol, FlexItem } from "aapaetsch-ui-kit";

// Basic column layout
<FlexCol gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</FlexCol>

// Reversed column
<FlexCol reverse gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</FlexCol>

// Card-style layout
<FlexCol gap={4} className="p-4 border rounded">
  <h3>Title</h3>
  <p>Content</p>
  <FlexRow gap={2}>
    <button>Cancel</button>
    <button>Save</button>
  </FlexRow>
</FlexCol>
```

### Nested Layouts

FlexRow and FlexCol support flex item props (`grow`, `shrink`, `basis`, `alignSelf`, `order`) so they can be nested inside each other without needing a wrapper:

```tsx
import { FlexRow, FlexCol } from "aapaetsch-ui-kit";

// Sidebar + Main content layout
<FlexRow gap={4}>
  <FlexCol basis="1/4" gap={2}>
    <div>Sidebar item 1</div>
    <div>Sidebar item 2</div>
  </FlexCol>
  <FlexCol grow={1} gap={2}>
    <div>Main content 1</div>
    <div>Main content 2</div>
  </FlexCol>
</FlexRow>

// Holy grail layout
<FlexCol className="h-screen">
  <FlexRow shrink={0} className="header">Header</FlexRow>
  <FlexRow grow={1}>
    <FlexCol basis="1/5" shrink={0}>Left Sidebar</FlexCol>
    <FlexCol grow={1}>Main Content</FlexCol>
    <FlexCol basis="1/5" shrink={0}>Right Sidebar</FlexCol>
  </FlexRow>
  <FlexRow shrink={0} className="footer">Footer</FlexRow>
</FlexCol>
```

### Base Flex Container

```tsx
import { Flex } from "aapaetsch-ui-kit";

// Full control over direction
<Flex direction="row" gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// Column with reverse
<Flex direction="col-reverse" gap={2}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

### Flex Items

```tsx
import { FlexRow, FlexItem } from "aapaetsch-ui-kit";

<FlexRow gap={4}>
  <FlexItem grow={1}>This item grows</FlexItem>
  <FlexItem basis="1/4">This item takes 1/4 of the width</FlexItem>
  <FlexItem alignSelf="center">This item is center-aligned</FlexItem>
</FlexRow>
```

## FlexRow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| reverse | `boolean` | `false` | If true, uses row-reverse direction |
| wrap | `nowrap` \| `wrap` \| `wrap-reverse` | `nowrap` | How flex items wrap |
| justify | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` | `start` | Alignment along main axis |
| align | `start` \| `end` \| `center` \| `baseline` \| `stretch` | `stretch` | Alignment along cross axis |
| alignContent | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` \| `stretch` | - | Alignment of wrapped lines |
| gap | `0-32` | - | Gap between flex items |
| gapX | `0-32` | - | Horizontal gap (column gap) |
| gapY | `0-32` | - | Vertical gap (row gap) |
| inline | `boolean` | `false` | If true, renders as inline-flex |
| grow | `0-5` | `0` | How the container grows when nested |
| shrink | `0-5` | `1` | How the container shrinks when nested |
| basis | `auto` \| `full` \| fractions | - | Initial size when nested |
| alignSelf | `auto` \| `start` \| `end` \| `center` \| `baseline` \| `stretch` | - | Self alignment when nested |
| order | `first` \| `last` \| `none` \| `1-12` | - | Order when nested |

## FlexCol Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| reverse | `boolean` | `false` | If true, uses col-reverse direction |
| wrap | `nowrap` \| `wrap` \| `wrap-reverse` | `nowrap` | How flex items wrap |
| justify | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` | `start` | Alignment along main axis |
| align | `start` \| `end` \| `center` \| `baseline` \| `stretch` | `stretch` | Alignment along cross axis |
| alignContent | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` \| `stretch` | - | Alignment of wrapped lines |
| gap | `0-32` | - | Gap between flex items |
| gapX | `0-32` | - | Horizontal gap (column gap) |
| gapY | `0-32` | - | Vertical gap (row gap) |
| inline | `boolean` | `false` | If true, renders as inline-flex |
| grow | `0-5` | `0` | How the container grows when nested |
| shrink | `0-5` | `1` | How the container shrinks when nested |
| basis | `auto` \| `full` \| fractions | - | Initial size when nested |
| alignSelf | `auto` \| `start` \| `end` \| `center` \| `baseline` \| `stretch` | - | Self alignment when nested |
| order | `first` \| `last` \| `none` \| `1-12` | - | Order when nested |

## Flex Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| direction | `row` \| `row-reverse` \| `col` \| `col-reverse` | `row` | Direction of flex items |
| wrap | `nowrap` \| `wrap` \| `wrap-reverse` | `nowrap` | How flex items wrap |
| justify | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` | `start` | Alignment along main axis |
| align | `start` \| `end` \| `center` \| `baseline` \| `stretch` | `stretch` | Alignment along cross axis |
| alignContent | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` \| `stretch` | - | Alignment of wrapped lines |
| gap | `0-32` | - | Gap between flex items |
| gapX | `0-32` | - | Horizontal gap (column gap) |
| gapY | `0-32` | - | Vertical gap (row gap) |
| inline | `boolean` | `false` | If true, renders as inline-flex |
| grow | `0-5` | `0` | How the container grows when nested |
| shrink | `0-5` | `1` | How the container shrinks when nested |
| basis | `auto` \| `full` \| fractions | - | Initial size when nested |
| alignSelf | `auto` \| `start` \| `end` \| `center` \| `baseline` \| `stretch` | - | Self alignment when nested |
| order | `first` \| `last` \| `none` \| `1-12` | - | Order when nested |

## FlexItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| grow | `0` \| `1` \| `2` \| `3` \| `4` \| `5` | `0` | How the flex item grows |
| shrink | `0` \| `1` \| `2` \| `3` \| `4` \| `5` | `1` | How the flex item shrinks |
| basis | `auto` \| `full` \| `fit` \| `min` \| `max` \| fractions | - | Initial size of the flex item |
| alignSelf | `auto` \| `start` \| `end` \| `center` \| `baseline` \| `stretch` | - | Alignment along cross axis |
| order | `first` \| `last` \| `none` \| `1-12` | - | Order of the flex item |
| inline | `boolean` | `false` | If true, renders as span |

## Examples

### Navigation Bar

```tsx
<FlexRow justify="between" align="center" className="p-4 border-b">
  <div className="font-bold">Logo</div>
  <FlexRow gap={4}>
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </FlexRow>
</FlexRow>
```

### Card Layout

```tsx
<FlexCol gap={4} className="p-4 border rounded shadow">
  <div className="h-32 bg-muted rounded" />
  <FlexCol gap={2}>
    <h3 className="font-semibold">Card Title</h3>
    <p className="text-muted-foreground">Card description goes here.</p>
  </FlexCol>
  <FlexRow gap={2} className="mt-auto">
    <button className="flex-1">Cancel</button>
    <button className="flex-1">Save</button>
  </FlexRow>
</FlexCol>
```

### Responsive Grid

```tsx
<FlexRow wrap="wrap" gap={4}>
  {items.map((item, index) => (
    <FlexItem 
      key={index} 
      basis="full" 
      className="sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.67rem)]"
    >
      <Card>{item.content}</Card>
    </FlexItem>
  ))}
</FlexRow>
```

### Wrap with Different Gaps

Use `gapX` and `gapY` for different horizontal and vertical spacing in wrapped layouts:

```tsx
// Tag cloud with uniform gap
<FlexRow wrap="wrap" gap={2}>
  {tags.map((tag) => (
    <span key={tag} className="px-3 py-1 bg-primary/10 rounded-full">
      {tag}
    </span>
  ))}
</FlexRow>

// Image gallery with different X/Y gaps
<FlexRow wrap="wrap" gapX={4} gapY={6}>
  {images.map((image) => (
    <div key={image.id} className="w-32 h-32">
      <img src={image.src} alt={image.alt} />
    </div>
  ))}
</FlexRow>
```

### Align Content for Wrapped Lines

Use `alignContent` to control how wrapped lines are distributed:

```tsx
// Wrapped items centered vertically
<FlexRow 
  wrap="wrap" 
  gap={2} 
  alignContent="center" 
  className="h-64"
>
  {items.map((item) => (
    <div key={item.id} className="w-16 h-16 bg-primary rounded" />
  ))}
</FlexRow>

// Wrapped items with space between lines
<FlexRow 
  wrap="wrap" 
  gap={2} 
  alignContent="between" 
  className="h-64"
>
  {items.map((item) => (
    <div key={item.id} className="w-16 h-16 bg-primary rounded" />
  ))}
</FlexRow>
```

## Customization

You can customize the Flex components by passing additional className props:

```tsx
<FlexRow 
  gap={4} 
  className="p-4 bg-muted rounded"
>
  <div>Content</div>
</FlexRow>
```

## Accessibility

The Flex components render as standard div elements and don't add any specific accessibility attributes. Ensure proper semantic HTML and ARIA attributes are used when building accessible layouts.