# Sheet

A Sheet is a slide-out panel that displays content from the edge of the screen. It extends the Dialog component to display content that complements the main content of the screen.

## Installation

The Sheet component is part of the `@aidan/ui` package and is available in the Free tier.

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@aidan/ui";
```

## Usage

### Basic Usage

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>
        Description text for the sheet.
      </SheetDescription>
    </SheetHeader>
    <div className="flex-1 px-6 py-4">
      Your content here
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline">Cancel</Button>
      </SheetClose>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Position Variants

The sheet can slide in from any edge of the screen:

```tsx
// Right (default)
<SheetContent position="right">...</SheetContent>

// Left - ideal for navigation menus
<SheetContent position="left">...</SheetContent>

// Top - ideal for notifications
<SheetContent position="top">...</SheetContent>

// Bottom (Drawer style) - ideal for mobile actions
<SheetContent position="bottom" showHandle>...</SheetContent>
```

### Size Variants

Control the sheet dimensions with size variants:

```tsx
<SheetContent size="xs">...</SheetContent>  // 280px width / 200px height
<SheetContent size="sm">...</SheetContent>  // 320-360px / 280px
<SheetContent size="md">...</SheetContent>  // 360-400px / 360px (default)
<SheetContent size="lg">...</SheetContent>  // 400-480px / 480px
<SheetContent size="xl">...</SheetContent>  // 480-600px / 600px
<SheetContent size="full">...</SheetContent> // 100%
```

Sizes apply as **width** for left/right positions and **height** for top/bottom positions.

### Controlled State

```tsx
const [open, setOpen] = React.useState(false);

<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent>...</SheetContent>
</Sheet>

// Open/close externally
<Button onClick={() => setOpen(true)}>Open</Button>
```

### Preventing Background Close

Prevent the sheet from closing when clicking outside or pressing Escape:

```tsx
<SheetContent preventBackgroundClose>
  <SheetHeader>
    <SheetTitle>Important Form</SheetTitle>
  </SheetHeader>
  {/* User must explicitly close via button */}
  <SheetFooter>
    <SheetClose asChild>
      <Button>Close</Button>
    </SheetClose>
  </SheetFooter>
</SheetContent>
```

### Hide Close Button

```tsx
<SheetContent showCloseButton={false}>
  {/* No X button in corner */}
</SheetContent>
```

### Custom Overlay Styling

```tsx
<SheetContent overlayClassName="bg-primary/30 backdrop-blur-md">
  {/* Custom overlay behind sheet */}
</SheetContent>
```

### Nested Sheets

Sheets can be nested with proper z-index stacking:

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open First</Button>
  </SheetTrigger>
  <SheetContent>
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Second</Button>
      </SheetTrigger>
      <SheetContent size="sm">
        Nested content
      </SheetContent>
    </Sheet>
  </SheetContent>
</Sheet>
```

## Props

### Sheet

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `modal` | `boolean` | `true` | Render as modal with overlay |

### SheetContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | Edge to slide from |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Sheet dimensions |
| `showCloseButton` | `boolean` | `true` | Show X close button |
| `closeButton` | `ReactNode` | - | Custom close button |
| `onCloseClick` | `() => void` | - | Callback when close clicked |
| `preventBackgroundClose` | `boolean` | `false` | Prevent overlay/Escape close |
| `showHandle` | `boolean` | `false` | Show drag handle (top/bottom only) |
| `overlayClassName` | `string` | - | Custom overlay classes |

### SheetHeader, SheetFooter

Standard `div` props for layout containers.

### SheetTitle, SheetDescription

Standard Radix Dialog Title/Description props.

### SheetTrigger, SheetClose

Standard Radix Dialog Trigger/Close props. Use `asChild` to render as a custom element.

## Accessibility

- **Focus Management**: Focus is trapped within the sheet when open
- **Keyboard Navigation**: `Tab` cycles through focusable elements, `Escape` closes
- **Screen Readers**: Proper ARIA labels via SheetTitle and SheetDescription
- **Focus Restoration**: Focus returns to trigger element on close

## Premium Features

For advanced features, see the Premium Sheet component:

- **Swipe-to-dismiss**: Close by swiping in the sheet's direction
- **Edge-pull gestures**: Open by pulling from screen edge
- **Snap points**: Partial opening states (25%, 50%, 75%)
- **Spring animations**: Physics-based motion
- **Custom gesture sensitivity**: Configure swipe thresholds
