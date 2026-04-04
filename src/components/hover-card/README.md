# HoverCard

A popup component that displays rich content when hovering over a trigger element. Supports both hover and click trigger modes with automatic touch device detection.

## Installation

The HoverCard component is part of the `@agentix/ui` library. Ensure you have the library installed:

```bash
npm install @agentix/ui
```

## Usage

```tsx
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@agentix/ui";

export function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">The React Framework</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
```

## Features

- **Hover Mode**: Opens on hover with configurable delays
- **Click Mode**: Opens on click with close button for touch devices
- **Auto Touch Detection**: Automatically switches to click mode on touch devices
- **Size Variants**: Aligned with Card component sizing (xs, sm, md, lg, xl)
- **Arrow Support**: Optional arrow pointing to trigger
- **Scrollable Content**: Support for max-height with internal scrolling
- **Fully Accessible**: Keyboard navigation and screen reader support

## API Reference

### HoverCard

The root component that manages hover card state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `triggerMode` | `"hover" \| "click"` | `"hover"` | Interaction mode for opening |
| `forceTriggerMode` | `boolean` | `false` | Force mode regardless of device |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size variant |
| `showCloseButton` | `boolean` | Auto | Show close button |
| `openDelay` | `number` | `700` | Delay before opening (ms) |
| `closeDelay` | `number` | `300` | Delay before closing (ms) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | State change callback |

### HoverCardTrigger

The element that triggers the hover card.

```tsx
<HoverCardTrigger asChild>
  <Button>Hover me</Button>
</HoverCardTrigger>
```

Use `asChild` to merge props with your own element instead of wrapping in a span.

### HoverCardContent

The popup content container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | Inherits | Override size |
| `showArrow` | `boolean` | `false` | Show arrow |
| `maxHeight` | `"none" \| "auto" \| string` | `"none"` | Max height with scroll |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Position side |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment |
| `sideOffset` | `number` | `4` | Distance from trigger |

### HoverCardArrow

Optional arrow pointing to the trigger (can use `showArrow` on content instead).

### HoverCardClose

Close button component, automatically shown in click mode.

## Examples

### With Arrow

```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <Button>Hover me</Button>
  </HoverCardTrigger>
  <HoverCardContent showArrow>
    <p>Content with an arrow pointing to the trigger.</p>
  </HoverCardContent>
</HoverCard>
```

### Click Mode

```tsx
<HoverCard triggerMode="click">
  <HoverCardTrigger asChild>
    <Button>Click to open</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    <p>Click outside or use close button to dismiss.</p>
  </HoverCardContent>
</HoverCard>
```

### Different Sizes

```tsx
<HoverCard size="lg">
  <HoverCardTrigger asChild>
    <Button>Large Card</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    <p>This card uses the large size variant with more padding.</p>
  </HoverCardContent>
</HoverCard>
```

### Scrollable Content

```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <Button>View Long Content</Button>
  </HoverCardTrigger>
  <HoverCardContent maxHeight="200px">
    {/* Long content that will scroll */}
  </HoverCardContent>
</HoverCard>
```

### Positioning

```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <Button>Right Side</Button>
  </HoverCardTrigger>
  <HoverCardContent side="right" align="start">
    <p>Positioned on the right, aligned to start.</p>
  </HoverCardContent>
</HoverCard>
```

### Controlled State

```tsx
function ControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(!open)}>Toggle</Button>
      <HoverCard open={open} onOpenChange={setOpen}>
        <HoverCardTrigger asChild>
          <span className="underline cursor-pointer">Controlled</span>
        </HoverCardTrigger>
        <HoverCardContent>
          <p>Externally controlled hover card.</p>
        </HoverCardContent>
      </HoverCard>
    </>
  );
}
```

### User Profile Preview

```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@username</Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-80">
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="/avatar.png" />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">@username</h4>
        <p className="text-sm text-muted-foreground">
          Software developer and open source enthusiast.
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="mr-1 h-3 w-3" />
          Joined January 2023
        </div>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

## When to Use

| Component | Use Case |
|-----------|----------|
| **HoverCard** | Rich content previews (user profiles, products) |
| **Tooltip** | Brief hints, icon labels |
| **Popover** | Interactive content, forms |
| **Dialog** | Modal interactions requiring focus trap |

## Accessibility

- Full keyboard navigation support
- Proper ARIA attributes
- Focus management
- Screen reader announcements
- Escape key to close in click mode

## Touch Device Behavior

On touch devices (detected via `@media (hover: none)`):
- Automatically switches to click mode
- Shows close button for easy dismissal
- Can be overridden with `forceTriggerMode={true}`
