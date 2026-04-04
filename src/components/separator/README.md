# Separator

A visual divider that separates content into logical sections.

## Features

- Horizontal and vertical orientations
- Custom color support
- Custom opacity support
- Accessible by default
- Built with Radix UI primitives

## Installation

The Separator component ships with the unified component library and is available when you install the package.

## Usage

```tsx
import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | The orientation of the separator |
| `color` | `string` | `undefined` | Custom color class (e.g., "bg-red-500") |
| `opacity` | `number` | `undefined` | Custom opacity value (0-1) |
| `decorative` | `boolean` | `true` | Whether the separator is purely decorative |

### Additional Props

The Separator component accepts all valid props for HTML `div` elements, which are passed to the underlying Radix UI Separator primitive.

## Examples

### Basic Usage

```tsx
<Separator />
```

### Vertical Separator

```tsx
<Separator orientation="vertical" />
```

### Custom Color

```tsx
<Separator color="bg-blue-500" />
```

### Custom Opacity

```tsx
<Separator opacity={0.5} />
```

### With Custom Styling

```tsx
<Separator className="my-4 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
```
