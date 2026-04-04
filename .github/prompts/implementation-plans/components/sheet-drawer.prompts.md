# Sheet and Drawer Component Implementation Plan

This plan outlines the implementation of both Sheet and Drawer components for the @agentix/ui React component library with comprehensive gesture support including swipe-to-dismiss and edge-pull gestures.

## Key Decisions

1. **Single Implementation with Variants**: Both Sheet and Drawer will be implemented as a single unified component with position variants. A Drawer will simply be a bottom-positioned Sheet (Sheet with `position="bottom"`), following Material Design conventions where drawers are a subtype of sheets.

2. **Unified Implementation**: All Sheet functionality is now consolidated into a single implementation with all features available:
   - **Core functionality**: Basic variants (position, size)
   - **Advanced features**: Gesture support, custom animations, snap points, and enhanced customization
   - **Implementation Approach**: Single component with full feature set, no tier separation

3. **Gesture Types to Implement**:
   - Swipe-to-dismiss (all directions)
   - Edge-pull gestures (pull from edge to open)
   - Velocity-based closing animations
   - Snap points for partial openings
   - Momentum-based scrolling within content

4. **Animation Types**:
   - Standard smooth (default)
   - Bounce (with spring physics)
   - Elastic (bounces back when pulled beyond limits)
   - Stiff (snappy movements)
   - Slow/Fast variants (duration-based)

## Implementation Steps

### Phase 1: Foundation and Core Implementation

1. Install required dependencies:
   - `@use-gesture/react` for gesture handling
   - `@react-spring/web` for animations
   - (Already have `@radix-ui/react-dialog`)

2. Create component directory structure:
   - `src/components/sheet/` - Full implementation
   
3. Implement base Sheet component:
   - Position variants: top, right, bottom, left
   - Size variants: xs, sm, md, lg, xl, full
   - Modal and non-modal modes
   - Basic accessibility features

4. Implement gesture support using `useDrag` hook:
   - Swipe-to-dismiss functionality
   - Edge detection for pull gestures
   - Velocity calculations
   - Boundary constraints

5. Implement animation system using react-spring:
   - Configurable spring physics
   - Multiple animation presets
   - Transition orchestration

### Phase 2: Advanced Features and Enhancements

1. Add advanced gesture features:
   - Snap points support
   - Nested scroll handling
   - Momentum-based content scrolling
   - Custom gesture sensitivity

2. Implement premium animations:
   - Custom spring configurations
   - Advanced easing functions
   - Multi-stage animations

3. Add enhanced customization options:
   - Custom handle components
   - Content containers with scroll locking
   - Nested sheet support

### Phase 3: Documentation and Testing

1. Create comprehensive Storybook stories:
   - Basic usage examples
   - All position variants
   - Gesture interaction demos
   - Animation type demonstrations
   - Nested sheet examples
   - Edge case scenarios

2. Write detailed documentation:
   - README.md with API reference
   - agents.md with implementation details
   - Migration guide from other libraries

3. Implement proper testing:
   - Accessibility compliance testing
   - Keyboard navigation tests
   - Gesture interaction tests
   - Cross-browser compatibility

## Component Architecture

### Shared Core Structure

TheSheet component will follow this architecture:

```tsx
// Unified Sheet component with the full feature set
const Sheet = (props) => {
   const { isOpen, close, ...sheetProps } = useSheetCore(props)

   return <SheetWithGestures {...sheetProps} />
}
```

### Unified Implementation

We'll keep a single export surface for all sheet functionality:

1. **Single Component Export** (`src/components/sheet/index.tsx`):
    - Core positioning and animation
    - Gesture support hooks
    - Advanced customization options
    - Full public API surface

This approach avoids code duplication because:
- All sheet behavior lives in one implementation
- Shared utilities and hooks are imported from a common location
- Consumers use one canonical API instead of tiered variants

## Component Spacing, Sizing, Effects & Animation Guidelines

### Spacing & Layout
- **Spacing scale**: Use Tailwind spacing scale (rem-based: 0.25rem increments)
- **Internal padding**: 1.5rem default for content areas, 1rem for header/footer
- **External spacing**: 0 (components overlay content), with configurable overlay gap
- **Layout rules**: Full content width, position-dependent height/width

### Sizing
- **Component height/width**: Position-dependent (100% viewport height for top/bottom, variable width for left/right)
- **Min/max constraints**: Min 280px width, max 360px for side sheets on desktop, 100% on mobile
- **Breakpoint behavior**: 
  - Mobile (sm): Always full screen
  - Tablet/desktop (md+): Side sheets for left/right, partial height for top/bottom

### Effects
- **Shadows**: Elevation levels matching MD3 (shadow-lg for default, shadow-xl for focused)
- **Borders**: Configurable border using theme colors, rounded-lg corners for floating variants
- **Blurs/overlays**: Backdrop blur for modal variants, customizable overlay opacity (40-80%)

### Animation & Transitions
- **Motion guidelines**: Configurable duration (150-300ms) with MD3 easing (cubic-bezier(0.4, 0, 0.2, 1))
- **Transition properties**: Transform for slide animations, opacity for backdrop fade
- **Interactive feedback**: Scale transform on close button hover
- **Open/close motion**: Slide from edge with backdrop fade-in/out
- **Gesture animations**: Spring physics with configurable tension and friction

## Technical Concerns

### Gesture Performance
- **Optimizations**: Use passive event listeners for touch events to improve scroll performance and prevent jank.
- **Throttling**: Throttle rapid gesture updates using `requestAnimationFrame` to avoid excessive re-renders.
- **Boundary Checks**: Implement efficient boundary checks to prevent unnecessary calculations during gestures.

### Animation Performance
- **Spring Physics**: Use `react-spring`'s `config` prop to optimize spring physics (e.g., `tension`, `friction`) for smooth animations.
- **Hardware Acceleration**: Ensure animations use CSS `transform` and `opacity` for hardware acceleration.
- **Debouncing**: Debounce rapid animation updates to prevent performance bottlenecks.

### Nested Scroll Handling
- **Scroll Locking**: Use `overscroll-behavior: contain` to prevent scroll bleed when nested scrolling is detected.
- **Momentum-Based Scrolling**: Implement momentum-based scrolling for content within sheets using `react-spring`'s physics.
- **Gesture Prioritization**: Prioritize vertical scrolling over swipe-to-dismiss for nested content.

### Z-Index Management
- **Stacking Context**: Use a fixed z-index increment (e.g., `1000 + index`) for nested sheets to ensure proper stacking.
- **Focus Management**: Ensure focus trapping works correctly across nested sheets by managing `tabIndex` and `aria-hidden` attributes.

## Feature Set

### Core Features
- **Position Variants**: `top`, `right`, `bottom`, `left`.
- **Size Variants**: `xs`, `sm`, `md`, `lg`, `xl`, `full`.
- **Animation Types**: `smooth` (default), `stiff`.
- **Modal Modes**: Modal and non-modal modes.
- **Basic Accessibility**: Keyboard navigation, focus trapping, ARIA attributes.
- **Responsive Behavior**: Fullscreen on mobile, partial height/width on desktop.

### Advanced Features
- **Gestures**: Swipe-to-dismiss, edge-pull, and velocity-based closing.
- **Snap Points**: Customizable snap points (e.g., `[0.25, 0.5, 0.75]`).
- **Animation Types**: `bounce`, `elastic`, `slow`, `fast`, and custom spring configurations.
- **Custom Handles**: Custom handle components for edge-pull gestures.
- **Gesture Sensitivity**: Configurable sensitivity (e.g., `swipeThreshold`, `edgePullSensitivity`).
- **Nested Sheets**: Support for stacked sheets with proper focus and z-index management.
- **Scroll Locking**: Prevent scroll bleed in nested content.

## Component API

### Shared Props
- `isOpen`: Boolean to control the visibility of the sheet.
- `onOpenChange`: Callback when the sheet's visibility changes.
- `position`: Position of the sheet (`top` | `right` | `bottom` | `left`).
- `size`: Size of the sheet (`xs` | `sm` | `md` | `lg` | `xl` | `full`).
- `className`: Custom CSS classes for the sheet.
- `children`: Content of the sheet.
- `modal`: Boolean to enable/disable modal mode (default: `true`).
- `overlayClassName`: Custom CSS classes for the overlay.
- `animationType`: Type of animation (`smooth` | `stiff` | `bounce` | `elastic` | `slow` | `fast`).

### Advanced Props
- `snapPoints`: Array of numbers (e.g., `[0.25, 0.5, 0.75]`) to define snap points.
- `gestureSensitivity`: Object to configure gesture sensitivity (e.g., `{ swipeThreshold: 100, edgePullSensitivity: 0.5 }`).
- `springConfig`: Custom spring configuration for animations (e.g., `{ tension: 200, friction: 20 }`).
- `handleComponent`: Custom handle component for edge-pull gestures.
- `scrollLock`: Boolean to enable/disable scroll locking for nested content (default: `true`).

## Edge Cases and Solutions

### Gesture Conflicts
- **Issue**: Swipe-to-dismiss conflicts with nested scroll gestures.
- **Solution**: Prioritize vertical scrolling over swipe-to-dismiss when nested content is scrollable. Use velocity thresholds to distinguish between gestures.

### Nested Sheets
- **Issue**: Focus management and z-index stacking in nested sheets.
- **Solution**: Use a fixed z-index increment for each nested sheet and ensure focus trapping works across all levels.

### Keyboard Navigation
- **Issue**: Keyboard navigation in nested sheets may break focus trapping.
- **Solution**: Manage `tabIndex` and `aria-hidden` attributes dynamically to ensure focus stays within the active sheet.

### Mobile vs. Desktop Interactions
- **Issue**: Edge-pull gestures may not work on desktop or touchscreen devices.
- **Solution**: Enable edge-pull gestures only on touch devices and provide a fallback handle for desktop users.

### Performance on Low-End Devices
- **Issue**: Gestures and animations may lag on low-end devices.
- **Solution**: Optimize animations with `requestAnimationFrame` and use passive event listeners for touch events.

## Further Considerations

1. **Dependencies**: 
   - Core: `@radix-ui/react-dialog`, `class-variance-authority`
   - Gestures: `@use-gesture/react`
   - Animations: `@react-spring/web`

2. **Accessibility**: 
   - Full keyboard navigation
   - Focus trapping
   - Proper ARIA attributes
   - Screen reader support

3. **Performance**: 
   - Optimized animations with CSS transforms
   - Lazy mounting
   - Virtualization for large content

4. **Design-system consistency**: 
   - Match existing dialog and popover styling conventions
   - Follow MD3 motion patterns
   - Consistent with existing component APIs

5. **Responsive behavior**: 
   - Mobile-first approach
   - Responsive variants
   - Fullscreen fallback

6. **Gesture Customization**: 
   - Configurable sensitivity
   - Velocity thresholds
   - Snap points

7. **Nested Components**: 
   - Support for stacked sheets
   - Proper z-index management
   - Focus management across nested sheets

## Export Strategy

Use a single canonical export:

1. `src/components/sheet/` - Contains the complete implementation
2. `src/index.ts` - Re-exports the canonical sheet API

```ts
// In src/index.ts
export {
   Sheet,
   SheetTrigger,
   SheetPortal,
   SheetContent,
   SheetHeader,
   SheetFooter,
   SheetTitle,
   SheetDescription,
   SheetClose,
} from "./components/sheet"
```

This allows users to:
- Import one canonical sheet API
- Access both core and advanced capabilities without tiered exports
- Benefit from a single maintained implementation