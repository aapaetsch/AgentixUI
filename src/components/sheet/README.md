# Sheet

The Sheet component includes gesture support, spring animations, snap points, and enhanced customization for mobile-first interfaces that require fluid, physics-based interactions.

## Installation

The Sheet component is available from the unified `aapaetsch-ui-kit` package.

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
} from "aapaetsch-ui-kit";
```

## Features

✨ **Gesture Support**
- Swipe-to-dismiss in any direction
- Velocity-based closing animations
- Distance-based closing thresholds
- Configurable sensitivity

🎯 **Snap Points**
- Multiple snap positions (e.g., 25%, 50%, 75%, 100%)
- Smooth animations between snap points
- Customizable default snap position

🎨 **Animation Presets**
- `smooth` - Gentle deceleration (default)
- `stiff` - Quick and responsive
- `bounce` - Playful overshoot
- `elastic` - Springy feel
- `slow` - Slower motion
- `fast` - Rapid animation

⚙️ **Custom Spring Physics**
- Full control over tension, friction, and mass
- Physics-based animations via react-spring

📱 **Mobile Optimized**
- Touch-friendly drag handles
- Scroll locking for nested content
- Optimized for 60fps performance

## Usage

### Basic Swipe-to-Dismiss

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Swipeable Sheet</SheetTitle>
      <SheetDescription>
        Swipe right to close this sheet.
      </SheetDescription>
    </SheetHeader>
    <div className="flex-1 px-6 py-4">
      Your content here
    </div>
  </SheetContent>
</Sheet>
```

### With Snap Points

Create a bottom sheet with multiple snap positions:

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open Drawer</Button>
  </SheetTrigger>
  <SheetContent
    position="bottom"
    size="lg"
    showHandle
    snapPoints={[0.25, 0.5, 0.75, 1]}
    defaultSnapPoint={3}
    onSnapPointChange={(index) => console.log(`Snapped to ${index}`)}
  >
    <SheetHeader>
      <SheetTitle>Expandable Drawer</SheetTitle>
      <SheetDescription>
        Drag up/down to snap to different positions.
      </SheetDescription>
    </SheetHeader>
    <div className="flex-1 overflow-auto px-6 py-4">
      Scrollable content
    </div>
  </SheetContent>
</Sheet>
```

### Animation Types

Try different animation feels:

```tsx
// Bounce animation - playful
<SheetContent animationType="bounce">
  {/* Content */}
</SheetContent>

// Elastic animation - springy
<SheetContent animationType="elastic">
  {/* Content */}
</SheetContent>

// Stiff animation - quick
<SheetContent animationType="stiff">
  {/* Content */}
</SheetContent>
```

### Custom Spring Configuration

Fine-tune the animation physics:

```tsx
<SheetContent
  springConfig={{
    tension: 150,  // Lower = slower
    friction: 8,   // Lower = more bouncy
    mass: 1.5,     // Higher = more inertia
  }}
>
  {/* Content */}
</SheetContent>
```

### Gesture Sensitivity

Customize how easily the sheet closes:

```tsx
// Easy to close - light swipes dismiss
<SheetContent
  gestureSensitivity={{
    velocityThreshold: 0.2,
    distanceThreshold: 0.15,
  }}
>
  {/* Content */}
</SheetContent>

// Hard to close - requires more force
<SheetContent
  gestureSensitivity={{
    velocityThreshold: 1.0,
    distanceThreshold: 0.5,
  }}
>
  {/* Content */}
</SheetContent>

// Disable swipe gestures entirely
<SheetContent
  gestureSensitivity={{
    enableSwipe: false,
  }}
>
  {/* Content */}
</SheetContent>
```

### All Positions with Gestures

```tsx
<div className="flex gap-4">
  {["top", "right", "bottom", "left"].map((position) => (
    <Sheet key={position}>
      <SheetTrigger asChild>
        <Button>{position}</Button>
      </SheetTrigger>
      <SheetContent
        position={position}
        showHandle={position === "top" || position === "bottom"}
        animationType="elastic"
      >
        <SheetHeader>
          <SheetTitle>{position} Sheet</SheetTitle>
        </SheetHeader>
        <div className="flex-1 px-6 py-4">
          Swipe to close
        </div>
      </SheetContent>
    </Sheet>
  ))}
</div>
```

### Mobile Action Sheet

iOS/Android style action sheet:

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Share</Button>
  </SheetTrigger>
  <SheetContent
    position="bottom"
    size="sm"
    showHandle
    animationType="stiff"
    showCloseButton={false}
  >
    <div className="flex flex-col gap-1 p-2">
      <Button variant="ghost" className="justify-start gap-3 h-12">
        <span>📧</span> Share via Email
      </Button>
      <Button variant="ghost" className="justify-start gap-3 h-12">
        <span>🔗</span> Copy Link
      </Button>
      <Button variant="ghost" className="justify-start gap-3 h-12">
        <span>💬</span> Share to Slack
      </Button>
      <Separator className="my-2" />
      <SheetClose asChild>
        <Button variant="ghost">Cancel</Button>
      </SheetClose>
    </div>
  </SheetContent>
</Sheet>
```

### Music Player Style

Bottom sheet with expandable content:

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Now Playing</Button>
  </SheetTrigger>
  <SheetContent
    position="bottom"
    size="lg"
    showHandle
    snapPoints={[0.15, 0.6, 1]}
    defaultSnapPoint={1}
    animationType="smooth"
    showCloseButton={false}
  >
    {/* Album art, track info, controls */}
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
| `handleComponent` | `ReactNode` | - | Custom handle component |
| `overlayClassName` | `string` | - | Custom overlay classes |
| `animationType` | `"smooth" \| "stiff" \| "bounce" \| "elastic" \| "slow" \| "fast"` | `"smooth"` | Animation preset |
| `springConfig` | `SpringConfigOptions` | - | Custom spring physics |
| `gestureSensitivity` | `GestureSensitivity` | - | Gesture configuration |
| `snapPoints` | `number[]` | - | Snap positions (0-1) |
| `defaultSnapPoint` | `number` | last index | Initial snap point |
| `onSnapPointChange` | `(index: number) => void` | - | Snap change callback |
| `scrollLock` | `boolean` | `true` | Enable scroll locking |

### SpringConfigOptions

| Prop | Type | Description |
|------|------|-------------|
| `tension` | `number` | Spring tension (higher = faster) |
| `friction` | `number` | Spring friction (lower = more bouncy) |
| `mass` | `number` | Spring mass (higher = more inertia) |

### GestureSensitivity

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `velocityThreshold` | `number` | `0.5` | Min velocity to close (px/ms) |
| `distanceThreshold` | `number` | `0.3` | Distance to close (0-1) |
| `enableSwipe` | `boolean` | `true` | Enable swipe gesture |

## Animation Preset Values

| Preset | Tension | Friction | Mass | Feel |
|--------|---------|----------|------|------|
| `smooth` | 200 | 26 | 1 | Gentle deceleration |
| `stiff` | 400 | 30 | 1 | Quick and responsive |
| `bounce` | 300 | 10 | 1 | Playful overshoot |
| `elastic` | 200 | 12 | 1 | Springy feel |
| `slow` | 100 | 30 | 1 | Slower motion |
| `fast` | 400 | 40 | 1 | Rapid animation |

## Snap Points

Snap points are percentages of the sheet's dimension:
- `0` = Fully closed
- `0.25` = 25% open
- `0.5` = 50% open (half)
- `0.75` = 75% open
- `1` = 100% open (fully expanded)

Example: `snapPoints={[0.25, 0.5, 1]}` creates three snap positions at quarter, half, and full height.

## Accessibility

- **Focus Management**: Focus is trapped within the sheet when open
- **Keyboard Navigation**: `Tab` cycles through focusable elements, `Escape` closes (unless `preventBackgroundClose`)
- **Screen Readers**: Proper ARIA labels via SheetTitle and SheetDescription
- **Focus Restoration**: Focus returns to trigger element on close
- **Touch Targets**: Drag handles are sized for easy touch interaction

## Performance Tips

1. **Disable Swipe for Scrollable Content**: Set `enableSwipe: false` if the sheet contains primarily scrollable content
2. **Use Snap Points Sparingly**: Too many snap points can make the UX feel unpredictable
3. **Match Animation to Use Case**: Use `stiff` for quick interactions, `smooth` for longer content
4. **Optimize Content**: Use virtualization for long lists inside sheets
5. **Avoid Nested Gestures**: Be cautious with multiple swipeable elements inside a sheet

## Comparison with the Basic Sheet API

| Feature | Basic Sheet API | Current Sheet API |
|---------|-----------|--------------|
| Swipe-to-dismiss | ❌ | ✅ |
| Snap points | ❌ | ✅ |
| Animation presets | 2 basic | 6 advanced |
| Custom spring physics | ❌ | ✅ |
| Gesture sensitivity | ❌ | ✅ |
| Animation library | CSS transitions | react-spring |
| Touch optimizations | Basic | Advanced |
| Use case | General purpose | Mobile-first |

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Touch Devices**: Optimized for iOS and Android
- **Desktop**: Works with mouse, but primarily designed for touch
- **Pointer Events**: Uses pointer events for universal input support

## Dependencies

- `@radix-ui/react-dialog` - Dialog primitive
- `@use-gesture/react` - Gesture detection
- `@react-spring/web` - Spring animations
- `lucide-react` - Icons

