# Popover

A popover is a non-modal dialog that floats around a trigger element. It's commonly used for displaying additional information, forms, or actions related to a UI element.

## Features

- **Click-triggered**: Opens on click, closes on click outside or escape key
- **Positioning**: Flexible positioning with automatic collision detection
- **Size variants**: Multiple size options (xs, sm, md, lg, xl, auto)
- **Arrow support**: Optional arrow pointing to the trigger
- **Controlled/Uncontrolled**: Works in both modes
- **Accessible**: Full keyboard navigation and screen reader support
- **Animated**: Smooth enter/exit animations

## Installation

The Popover component requires the Radix UI Popover primitive:

```bash
npm install @radix-ui/react-popover
```

## Usage

### Basic Popover

```tsx
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@aidan/ui";

<Popover>
  <PopoverTrigger asChild>
    <Button>Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content goes here.</p>
  </PopoverContent>
</Popover>
```

### With Arrow

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open with arrow</Button>
  </PopoverTrigger>
  <PopoverContent showArrow>
    <p>This popover has an arrow pointing to the trigger.</p>
  </PopoverContent>
</Popover>
```

### Positioning

Control the position of the popover relative to the trigger:

```tsx
<PopoverContent side="top">Top</PopoverContent>
<PopoverContent side="right">Right</PopoverContent>
<PopoverContent side="bottom">Bottom</PopoverContent>
<PopoverContent side="left">Left</PopoverContent>
```

Control alignment within the positioned side:

```tsx
<PopoverContent align="start">Align start</PopoverContent>
<PopoverContent align="center">Align center</PopoverContent>
<PopoverContent align="end">Align end</PopoverContent>
```

### Size Variants

```tsx
<PopoverContent size="xs">Extra small</PopoverContent>
<PopoverContent size="sm">Small</PopoverContent>
<PopoverContent size="md">Medium (default)</PopoverContent>
<PopoverContent size="lg">Large</PopoverContent>
<PopoverContent size="xl">Extra large</PopoverContent>
<PopoverContent size="auto">Auto width</PopoverContent>
```

### With Close Button

```tsx
import { PopoverClose } from "@aidan/ui";

<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Content with close button</p>
    <PopoverClose asChild>
      <Button variant="outline">Close</Button>
    </PopoverClose>
  </PopoverContent>
</Popover>
```

### Controlled Mode

```tsx
function ControlledExample() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Toggle</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Controlled popover</p>
      </PopoverContent>
    </Popover>
  );
}
```

### Custom Anchor

Position the popover relative to a different element than the trigger:

```tsx
<Popover>
  <PopoverAnchor asChild>
    <div className="anchor-element">Anchor point</div>
  </PopoverAnchor>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Anchored to the div, not the button</p>
  </PopoverContent>
</Popover>
```

## Components

### Popover

The root component that manages popover state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `modal` | `boolean` | `false` | Whether to render as modal |

### PopoverTrigger

The element that toggles the popover.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props with child element |

### PopoverContent

The floating content container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "auto"` | `"md"` | Size variant |
| `showArrow` | `boolean` | `false` | Show arrow pointing to trigger |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment on the side |

### PopoverArrow

Optional arrow element for custom arrow styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Arrow size |

### PopoverClose

Element that closes the popover when clicked.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props with child element |

### PopoverAnchor

Optional element to anchor the popover to instead of the trigger.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props with child element |

## Accessibility

The Popover component follows the [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/):

- Trigger is focusable and activates popover with Enter or Space
- Focus is trapped within the popover when open
- Escape key closes the popover
- Click outside closes the popover
- Focus returns to trigger when closed
- Proper ARIA attributes are applied

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open/close popover when trigger is focused |
| `Escape` | Close popover |
| `Tab` | Navigate between focusable elements |

## Styling

The component uses CSS variables from the design system:

- `--popover` / `--popover-foreground`: Background and text colors
- `--border`: Border color
- `--radius`: Border radius

Override styles using the `className` prop:

```tsx
<PopoverContent className="bg-secondary">
  Custom styled content
</PopoverContent>
```

## Related Components

- [Tooltip](../tooltip/README.md) - For hover/focus information
- [Dialog](../dialog/README.md) - For modal dialogs
- [Select](../select/README.md) - For dropdown selection
