# Premium Sheet 💎

The Premium Sheet extends the base Sheet component with advanced gesture support, spring animations, snap points, and enhanced customization. Perfect for mobile-first interfaces that require fluid, physics-based interactions.

## Installation

The Premium Sheet component is part of the `@aidan/ui` Premium tier.

```tsx
import {
  PremiumSheet,
  PremiumSheetTrigger,
  PremiumSheetContent,
  PremiumSheetHeader,
  PremiumSheetFooter,
  PremiumSheetTitle,
  PremiumSheetDescription,
  PremiumSheetClose,
} from "@aidan/ui/premium";
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
<PremiumSheet>
  <PremiumSheetTrigger asChild>
    <Button>Open Sheet</Button>
  </PremiumSheetTrigger>
  <PremiumSheetContent>
    <PremiumSheetHeader>
      <PremiumSheetTitle>Swipeable Sheet</PremiumSheetTitle>
      <PremiumSheetDescription>
        Swipe right to close this sheet.
      </PremiumSheetDescription>
    </PremiumSheetHeader>
    <div className="flex-1 px-6 py-4">
      Your content here
    </div>
  </PremiumSheetContent>
</PremiumSheet>
```

### With Snap Points

Create a bottom sheet with multiple snap positions:

```tsx
<PremiumSheet>
  <PremiumSheetTrigger asChild>
    <Button>Open Drawer</Button>
  </PremiumSheetTrigger>
  <PremiumSheetContent
    position="bottom"
    size="lg"
    showHandle
    snapPoints={[0.25, 0.5, 0.75, 1]}
    defaultSnapPoint={3}
    onSnapPointChange={(index) => console.log(`Snapped to ${index}`)}
  >
    <PremiumSheetHeader>
      <PremiumSheetTitle>Expandable Drawer</PremiumSheetTitle>
      <PremiumSheetDescription>
        Drag up/down to snap to different positions.
      </PremiumSheetDescription>
    </PremiumSheetHeader>
    <div className="flex-1 overflow-auto px-6 py-4">
      Scrollable content
    </div>
  </PremiumSheetContent>
</PremiumSheet>
```

### Animation Types

Try different animation feels:

```tsx
// Bounce animation - playful
<PremiumSheetContent animationType="bounce">
  {/* Content */}
</PremiumSheetContent>

// Elastic animation - springy
<PremiumSheetContent animationType="elastic">
  {/* Content */}
</PremiumSheetContent>

// Stiff animation - quick
<PremiumSheetContent animationType="stiff">
  {/* Content */}
</PremiumSheetContent>
```

### Custom Spring Configuration

Fine-tune the animation physics:

```tsx
<PremiumSheetContent
  springConfig={{
    tension: 150,  // Lower = slower
    friction: 8,   // Lower = more bouncy
    mass: 1.5,     // Higher = more inertia
  }}
>
  {/* Content */}
</PremiumSheetContent>
```

### Gesture Sensitivity

Customize how easily the sheet closes:

```tsx
// Easy to close - light swipes dismiss
<PremiumSheetContent
  gestureSensitivity={{
    velocityThreshold: 0.2,
    distanceThreshold: 0.15,
  }}
>
  {/* Content */}
</PremiumSheetContent>

// Hard to close - requires more force
<PremiumSheetContent
  gestureSensitivity={{
    velocityThreshold: 1.0,
    distanceThreshold: 0.5,
  }}
>
  {/* Content */}
</PremiumSheetContent>

// Disable swipe gestures entirely
<PremiumSheetContent
  gestureSensitivity={{
    enableSwipe: false,
  }}
>
  {/* Content */}
</PremiumSheetContent>
```

### All Positions with Gestures

```tsx
<div className="flex gap-4">
  {["top", "right", "bottom", "left"].map((position) => (
    <PremiumSheet key={position}>
      <PremiumSheetTrigger asChild>
        <Button>{position}</Button>
      </PremiumSheetTrigger>
      <PremiumSheetContent
        position={position}
        showHandle={position === "top" || position === "bottom"}
        animationType="elastic"
      >
        <PremiumSheetHeader>
          <PremiumSheetTitle>{position} Sheet</PremiumSheetTitle>
        </PremiumSheetHeader>
        <div className="flex-1 px-6 py-4">
          Swipe to close
        </div>
      </PremiumSheetContent>
    </PremiumSheet>
  ))}
</div>
```

### Mobile Action Sheet

iOS/Android style action sheet:

```tsx
<PremiumSheet>
  <PremiumSheetTrigger asChild>
    <Button>Share</Button>
  </PremiumSheetTrigger>
  <PremiumSheetContent
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
      <PremiumSheetClose asChild>
        <Button variant="ghost">Cancel</Button>
      </PremiumSheetClose>
    </div>
  </PremiumSheetContent>
</PremiumSheet>
```

### Music Player Style

Bottom sheet with expandable content:

```tsx
<PremiumSheet>
  <PremiumSheetTrigger asChild>
    <Button>Now Playing</Button>
  </PremiumSheetTrigger>
  <PremiumSheetContent
    position="bottom"
    size="lg"
    showHandle
    snapPoints={[0.15, 0.6, 1]}
    defaultSnapPoint={1}
    animationType="smooth"
    showCloseButton={false}
  >
    {/* Album art, track info, controls */}
  </PremiumSheetContent>
</PremiumSheet>
```

## Props

### PremiumSheet

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |

### PremiumSheetContent

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
- **Screen Readers**: Proper ARIA labels via PremiumSheetTitle and PremiumSheetDescription
- **Focus Restoration**: Focus returns to trigger element on close
- **Touch Targets**: Drag handles are sized for easy touch interaction

## Performance Tips

1. **Disable Swipe for Scrollable Content**: Set `enableSwipe: false` if the sheet contains primarily scrollable content
2. **Use Snap Points Sparingly**: Too many snap points can make the UX feel unpredictable
3. **Match Animation to Use Case**: Use `stiff` for quick interactions, `smooth` for longer content
4. **Optimize Content**: Use virtualization for long lists inside sheets
5. **Avoid Nested Gestures**: Be cautious with multiple swipeable elements inside a sheet

## Comparison with Free Tier

| Feature | Free Tier | Premium Tier |
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
