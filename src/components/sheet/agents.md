# Sheet Component - Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview
The Sheet component extends the basic sheet API with advanced gesture support, spring animations, snap points, and enhanced customization. It is built on top of @use-gesture/react and @react-spring/web for fluid, physics-based interactions optimized for mobile and touch devices.

## Props Summary

### PremiumSheet (Root)
- Extends `@radix-ui/react-dialog` Root props
- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - Callback when open state changes
- `defaultOpen?: boolean` - Uncontrolled default open state

### PremiumSheetContent
Extends the basic SheetContent API with gesture-aware features:

**Position & Size:**
- `position?: "top" | "right" | "bottom" | "left"` - Edge from which sheet slides (default: "right")
- `size?: "xs" | "sm" | "md" | "lg" | "xl" | "full"` - Sheet dimensions (default: "md")

**Appearance:**
- `showCloseButton?: boolean` - Show the X close button (default: true)
- `closeButton?: ReactNode` - Custom close button
- `onCloseClick?: () => void` - Callback when close button clicked
- `preventBackgroundClose?: boolean` - Prevent closing via overlay/Escape (default: false)
- `showHandle?: boolean` - Show drag handle for touch (default: false, only visible for top/bottom)
- `handleComponent?: ReactNode` - Custom handle component
- `overlayClassName?: string` - Custom overlay styling

**Animation:**
- `animationType?: "smooth" | "stiff" | "bounce" | "elastic" | "slow" | "fast"` - Animation preset (default: "smooth")
- `springConfig?: SpringConfigOptions` - Custom spring configuration (overrides animationType)
  - `tension?: number` - Spring tension (higher = faster)
  - `friction?: number` - Spring friction (lower = more bouncy)
  - `mass?: number` - Spring mass (higher = more inertia)

**Gestures:**
- `gestureSensitivity?: GestureSensitivity` - Gesture configuration
  - `velocityThreshold?: number` - Minimum velocity to trigger close in pixels/ms (default: 0.5)
  - `distanceThreshold?: number` - Distance threshold as percentage of sheet dimension (default: 0.3)
  - `enableSwipe?: boolean` - Enable/disable swipe gesture (default: true)

**Snap Points:**
- `snapPoints?: number[]` - Snap points as percentages (0-1) of sheet dimension
- `defaultSnapPoint?: number` - Initial snap point index (default: last index)
- `onSnapPointChange?: (index: number) => void` - Callback when snap point changes

**Scroll:**
- `scrollLock?: boolean` - Enable scroll locking for nested scrollable content (default: true)

### Other Components
- `PremiumSheetHeader`, `PremiumSheetFooter`: Standard `HTMLDivElement` props
- `PremiumSheetTitle`, `PremiumSheetDescription`, `PremiumSheetClose`, `PremiumSheetTrigger`: Extend respective Radix Dialog primitive props

## Dependencies
- `@radix-ui/react-dialog` - Core dialog/sheet primitive
- `@use-gesture/react` - Gesture handling (drag, swipe)
- `@react-spring/web` - Physics-based spring animations
- `class-variance-authority` - Variant management
- `lucide-react` - Close icon
- `tailwind-merge` via `cn()` - Class merging

## Styling Decisions

### Animation Presets
Six built-in animation presets using react-spring configs:
1. **smooth** (default): tension: 200, friction: 26 - Gentle deceleration
2. **stiff**: tension: 400, friction: 30 - Quick and responsive
3. **bounce**: tension: 300, friction: 10 - Playful overshoot
4. **elastic**: tension: 200, friction: 12 - Springy feel
5. **slow**: tension: 100, friction: 30 - Slower motion
6. **fast**: tension: 400, friction: 40 - Rapid animation

### Gesture Implementation
Uses `@use-gesture/react`'s `useDrag` hook with:
- **Axis-aware movement**: Tracks x for left/right, y for top/bottom
- **Directional constraints**: Only allows movement in close direction
- **Resistance**: Applies 0.3x resistance when pulling past open position
- **Velocity-based closing**: Closes on high-velocity swipes
- **Distance-based closing**: Closes when dragged past threshold

### Snap Points
- Represented as percentages (0-1) of sheet dimension
- 0 = fully closed, 1 = fully open
- Example: [0.25, 0.5, 0.75, 1] creates 4 snap positions
- Uses `getClosestSnapPoint` utility to find nearest snap on release
- Animates smoothly between snap points using spring physics

### Z-Index Management
- Base z-index: 50
- Nested sheets increment by 10 per level
- Overlay and content stack correctly with proper separation

## Maintenance Notes

### Edge Cases Handled
1. **Gesture Conflicts**: Prioritizes vertical scroll over swipe-to-dismiss in scrollable content
2. **Nested Sheets**: Context-based level tracking ensures proper stacking
3. **Animation Cleanup**: Uses `isMountedRef` to prevent state updates after unmount
4. **Scroll Lock**: Uses CSS `overscroll-contain` to prevent scroll bleed
5. **Touch Optimization**: Uses `touch-none` class to prevent default touch behaviors

### Known Limitations
1. **Edge-Pull Gestures**: Not implemented in current version (requires window-level gesture detection)
2. **Momentum Scrolling**: Basic implementation; complex inertia-based scrolling reserved for future enhancement
3. **Custom Transitions**: Limited to spring animations; other transition types (fade, scale) not supported

### Performance Considerations
- Uses `immediate: true` during active drag for 60fps tracking
- Passive event listeners for touch events
- `requestAnimationFrame` via react-spring's internal optimization
- Memoized callbacks to prevent unnecessary re-renders

### Relationship to the Basic Sheet API
This Sheet implementation is a complete reimplementation with gesture support rather than a thin extension of the basic sheet API. Key differences:
- **Animation**: CSS transitions (Free) vs. spring animations (Premium)
- **Gestures**: None (Free) vs. full swipe/drag support (Premium)
- **Snap Points**: Not available (Free) vs. full support (Premium)
- **Use Case**: General purpose (Free) vs. mobile-optimized (Premium)

### Testing Considerations
- Test all animation presets for visual quality
- Test swipe gestures in all four positions
- Test snap points with various configurations
- Test nested sheets with different animation types
- Verify velocity and distance thresholds work correctly
- Test on touch devices (mobile, tablets)
- Verify keyboard navigation still works (Tab, Escape)
- Test preventBackgroundClose with gestures disabled

## Related Components
- `Sheet` (basic API) - Basic sheet without gestures
- `Dialog` - Full modal dialog (centered)
- `Popover` - Small floating content

## Usage Examples

### Basic Swipe-to-Dismiss
```tsx
<PremiumSheet>
  <PremiumSheetTrigger asChild>
    <Button>Open Sheet</Button>
  </PremiumSheetTrigger>
  <PremiumSheetContent>
    <PremiumSheetHeader>
      <PremiumSheetTitle>Swipeable Sheet</PremiumSheetTitle>
    </PremiumSheetHeader>
    <div className="flex-1 px-6 py-4">
      Content here
    </div>
  </PremiumSheetContent>
</PremiumSheet>
```

### With Snap Points
```tsx
<PremiumSheetContent
  position="bottom"
  showHandle
  snapPoints={[0.25, 0.5, 1]}
  defaultSnapPoint={2}
>
  {/* Content */}
</PremiumSheetContent>
```

### Custom Animation
```tsx
<PremiumSheetContent
  animationType="bounce"
  springConfig={{
    tension: 150,
    friction: 8,
    mass: 1.5,
  }}
>
  {/* Content */}
</PremiumSheetContent>
```

### Custom Gesture Sensitivity
```tsx
<PremiumSheetContent
  gestureSensitivity={{
    velocityThreshold: 1.0,
    distanceThreshold: 0.5,
    enableSwipe: true,
  }}
>
  {/* Content */}
</PremiumSheetContent>
```



