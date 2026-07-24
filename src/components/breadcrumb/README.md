# Breadcrumb

A breadcrumb navigation component that helps users understand their location within a website's hierarchy and navigate back to parent pages.

## Features

- **Semantic HTML**: Uses `<nav>` and `<ol>` for proper document structure
- **Accessible**: Includes `aria-current="page"` and `aria-label` for screen readers
- **Custom separators**: Support for chevron, slash, arrow, dot, or custom separators
- **Responsive**: Built-in responsive variant that collapses items on smaller screens
- **Router integration**: Works with Next.js Link, React Router, or any router via `asChild`
- **Mobile-friendly**: Uses drawer for collapsed items on mobile devices

## Installation

The Breadcrumb component requires the following dependencies:

```bash
npm install @radix-ui/react-slot lucide-react
```

## Usage

### Basic Breadcrumb

```tsx
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage,
  BreadcrumbSeparator 
} from "aapaetsch-ui-kit";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Electronics</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Next.js Link

```tsx
import Link from 'next/link';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/">Home</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Custom Separators

#### Global Separator

Set a separator for all items via the `Breadcrumb` component:

```tsx
import { Slash, ArrowRight, Circle } from "lucide-react";

// Slash separator
<Breadcrumb separator={<Slash className="h-4 w-4" />}>
  ...
</Breadcrumb>

// Arrow separator
<Breadcrumb separator={<ArrowRight className="h-3.5 w-3.5" />}>
  ...
</Breadcrumb>

// Dot separator
<Breadcrumb separator={<Circle className="h-1 w-1 fill-current" />}>
  ...
</Breadcrumb>

// Text separator
<Breadcrumb separator="/">
  ...
</Breadcrumb>
```

#### Per-Item Separator

Override individual separators by passing children to `BreadcrumbSeparator`:

```tsx
<BreadcrumbSeparator>
  <ArrowRight className="h-3.5 w-3.5" />
</BreadcrumbSeparator>
```

### With Ellipsis

Show collapsed items indicator:

```tsx
import { BreadcrumbEllipsis } from "aapaetsch-ui-kit";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Responsive Breadcrumb

Automatically collapses middle items on smaller screens. Shows a popover on desktop and drawer on mobile:

```tsx
import { ResponsiveBreadcrumb } from "aapaetsch-ui-kit";

const items = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Documentation" },
  { href: "/docs/building", label: "Building Your Application" },
  { href: "/docs/data", label: "Data Fetching" },
  { label: "Caching and Revalidating" }, // No href = current page
];

<ResponsiveBreadcrumb items={items} />
```

#### With Custom Link Component

```tsx
import Link from 'next/link';

<ResponsiveBreadcrumb
  items={items}
  linkComponent={Link}
/>
```

#### Customize Items to Display

```tsx
// Show first item + last 1 item (default is 3)
<ResponsiveBreadcrumb items={items} itemsToDisplay={2} />

// Show first item + last 3 items
<ResponsiveBreadcrumb items={items} itemsToDisplay={4} />
```

#### With Custom Separator

```tsx
import { Slash } from "lucide-react";

<ResponsiveBreadcrumb
  items={items}
  separator={<Slash className="h-4 w-4" />}
/>
```

#### Custom Drawer Text

```tsx
<ResponsiveBreadcrumb
  items={items}
  drawerTitle="Go to page"
  drawerDescription="Choose a page from the navigation path."
/>
```

### Truncated Labels

Apply truncation classes for long labels:

```tsx
<BreadcrumbLink href="/category" className="max-w-24 truncate">
  Very Long Category Name That Should Truncate
</BreadcrumbLink>
```

## Components

### Breadcrumb

The root navigation container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `separator` | `ReactNode` | `<ChevronRight />` | Separator element for all items |
| `className` | `string` | - | Additional CSS classes |

### BreadcrumbList

Ordered list container for items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### BreadcrumbItem

List item wrapper.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### BreadcrumbLink

Navigable link element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render as child component |
| `href` | `string` | - | Navigation destination |
| `className` | `string` | - | Additional CSS classes |

### BreadcrumbPage

Current page indicator (non-navigable).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### BreadcrumbSeparator

Visual separator between items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"chevron" \| "slash" \| "arrow" \| "dot" \| "custom"` | `"chevron"` | Separator type |
| `children` | `ReactNode` | - | Custom separator (overrides context) |
| `className` | `string` | - | Additional CSS classes |

### BreadcrumbEllipsis

Ellipsis indicator for collapsed items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### ResponsiveBreadcrumb

Smart breadcrumb with automatic collapsing.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | Required | Array of `{ href?, label }` |
| `itemsToDisplay` | `number` | `3` | Number of visible items |
| `breakpoint` | `number` | `768` | Mobile/desktop breakpoint (px) |
| `separator` | `ReactNode` | `<ChevronRight />` | Separator element |
| `drawerTitle` | `string` | `"Navigate to"` | Mobile drawer title |
| `drawerDescription` | `string` | `"Select a page..."` | Mobile drawer description |
| `linkComponent` | `ElementType` | `"a"` | Custom link component |

### useResponsiveBreadcrumb

Hook to detect viewport size for custom implementations.

```tsx
const { isDesktop } = useResponsiveBreadcrumb(768);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `breakpoint` | `number` | `768` | Breakpoint in pixels |

| Return | Type | Description |
|--------|------|-------------|
| `isDesktop` | `boolean` | Whether viewport is >= breakpoint |

## Accessibility

The Breadcrumb component follows [WAI-ARIA Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/):

- Uses `<nav>` element with `aria-label="breadcrumb"`
- Uses ordered list (`<ol>`) for semantic structure
- Current page has `aria-current="page"`
- Separators have `aria-hidden="true"`
- Ellipsis has screen reader text

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate between links |
| `Enter` / `Space` | Activate link or open dropdown |
| `Escape` | Close dropdown/drawer |

## Styling

The component uses CSS variables from the design system:

- `--foreground` / `--muted-foreground`: Text colors
- `--ring`: Focus ring color
- `--radius`: Border radius
- `--motion-duration-short`: Transition timing

Override styles using the `className` prop:

```tsx
<Breadcrumb className="bg-muted p-4 rounded-lg">
  <BreadcrumbList className="text-xs">
    ...
  </BreadcrumbList>
</Breadcrumb>
```

## Related Components

- [Tabs](../tabs/README.md) - For lateral navigation within a page
- [Stepper](../stepper/README.md) - For step-by-step workflows
- [Popover](../popover/README.md) - Used internally for desktop dropdown
- [Sheet](../sheet/README.md) - Used internally for mobile drawer
