# Spinner
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

An animated loading indicator component following M3 design patterns with support for both classic circular spinners and Material Design 3's morphing shape animation.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "md3"` | `"default"` | Spinner variant - default circular or MD3 morphing shape |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"` | Size of the spinner (MD3 spec: 24px-240px) |
| `contained` | `boolean` | `false` | Show container background (MD3 contained variant) |
| `label` | `string` | `"Loading"` | Accessible label for screen readers |
| `className` | `string` | - | Additional CSS classes |

## Dependencies

- `class-variance-authority` - Variant management
- `../../lib/utils` - `cn()` utility

## Styling Decisions

### Default Variant
- Uses SVG-based spinner for crisp rendering at all sizes
- Inherits color from parent via `currentColor` for easy theming
- Two-part design with faded track (25% opacity) and active arc (75% opacity)
- Uses CSS `animate-spin` for smooth rotation animation

### MD3 Variant
- Implements the official Material Design 3 loading indicator specification
- Uses SMIL SVG animation to morph between 7 unique Material 3 shapes:
  1. **Circle** - Perfect circle (starting shape)
  2. **Clover4Leaf** - Four-leaf clover with rounded lobes
  3. **Flower** - Organic flower-like shape with 4 petals
  4. **Cookie4Sided** - Soft, puffy four-sided shape
  5. **Puffy** - Pillowed, organic blob
  6. **PuffyDiamond** - Soft diamond shape
  7. **Clover8Leaf** - Eight-leaf clover (circle-like)
- Includes circular background container (opacity 0.15) per MD3 specification
- Uses 14 keyframes (2 per shape transition) for smooth, fluid morphing
- Animation uses cubic-bezier(0.2, 0, 0, 1) easing for Material motion
- 1.4s morph cycle with additional slow rotation (2.8s) for visual interest

### Contained Configuration
- When `contained={true}`, wraps the indicator in a circular background
- Container uses `bg-primary-container` color
- Indicator changes to `text-on-primary-container` for proper contrast
- Container is 1.25x the indicator size for proper spacing (follows MD3 spec)
- Recommended when placing over other content or for pull-to-refresh behavior

### Size Scale
Follows Material Design 3 specifications (24dp - 240dp):
- `xs`: 24px (6rem) - Minimum MD3 size
- `sm`: 32px (8rem) - Compact contexts
- `md`: 48px (12rem) - Default MD3 size
- `lg`: 96px (24rem) - Large windows
- `xl`: 128px (32rem) - Extra large windows
- `2xl`: 240px (60rem) - Maximum MD3 size

## Usage

```tsx
// Default spinner
<Spinner />
<Spinner size="lg" />

// MD3 morphing variant
<Spinner variant="md3" />
<Spinner variant="md3" size="lg" />

// MD3 with container (for pull-to-refresh or over content)
<Spinner variant="md3" contained />

// With text
<div className="flex items-center gap-2">
  <Spinner variant="md3" />
  <span>Loading...</span>
</div>

// Custom color
<Spinner variant="md3" className="text-destructive" />
```

## Accessibility

- Uses `role="status"` for screen readers
- `aria-label` provides context (defaults to "Loading")
- Ensures 3:1 contrast ratio when using proper theme colors
- When contained, the container provides additional visual contrast

## MD3 Design Rationale

The MD3 variant was implemented to match Material Design 3's loading indicator specifications:

1. **7 Unique Shapes**: Uses actual Material 3 shape library shapes (Circle, Clover4Leaf, Flower, Cookie4Sided, Puffy, PuffyDiamond, Clover8Leaf)
2. **Circular Background**: Always includes a subtle background container (15% opacity) per MD3 specs
3. **SVG Path Morphing**: Uses SMIL `<animate>` element with 14 keyframes for smooth transitions
4. **Smooth Easing**: Uses cubic-bezier(0.2, 0, 0, 1) for standard Material motion
5. **Duration**: 1.4s morph cycle matches MD3's recommended timing for short processes (200ms - 5s)
6. **Rotation**: Additional 2.8s rotation animation adds visual interest
7. **Fluidity**: 2 keyframes per shape transition (14 total) ensures organic, fluid morphing
8. **Flexibility**: Works in both default and contained configurations
9. **Scalability**: Supports full MD3 size range (24dp - 240dp)

## Maintenance Notes

- Each shape in `md3ShapePathsSmooth` array uses bezier curves for organic forms
- All shapes are centered at (24, 24) in a 48x48 viewBox
- The shapes use 14 keyframes (2 per transition) for smooth morphing
- Unique IDs are generated using `React.useId()` to prevent clip-path conflicts
- Animation uses `keyTimes` and `keySplines` with Material easing (0.2, 0, 0, 1)
- Circular background is always present with 15% opacity
- The `contained` prop only affects the default variant - MD3 always has its own background


