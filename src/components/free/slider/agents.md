# Slider Component (Free Tier)
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A slider component for selecting values from a range following Material Design 3 specifications.

## Components

### Slider
A versatile slider supporting single value or range selection with MD3 animations.

## Props

```typescript
interface SliderProps extends Omit<SliderPrimitive.RootProps, "orientation"> {
  orientation?: "horizontal" | "vertical";  // Slider orientation
  size?: "xs" | "sm" | "md";  // Size variant (default: "xs")
  trackClassName?: string;  // Additional track styles
  rangeClassName?: string;  // Additional range styles
  thumbClassName?: string;  // Additional thumb styles
  
  // Inherited from Radix Slider
  defaultValue?: number[];  // Initial value(s)
  value?: number[];  // Controlled value(s)
  min?: number;  // Minimum value (default: 0)
  max?: number;  // Maximum value (default: 100)
  step?: number;  // Step increment (default: 1)
  disabled?: boolean;  // Disabled state
  onValueChange?: (value: number[]) => void;  // Value change callback
  onValueCommit?: (value: number[]) => void;  // Final value callback
}
```

## Dependencies
- `@radix-ui/react-slider` - Accessible slider primitive
- `class-variance-authority` - Variant management
- `../../../lib/utils` - `cn()` utility

## Styling Decisions

### MD3 Specification Compliance

#### Track Sizes (Height/Width)
| Size | Track | Track Shape |
|------|-------|-------------|
| `xs` | 16dp  | 8dp radius  |
| `sm` | 24dp  | 8dp radius  |
| `md` | 40dp  | 12dp radius |

#### Handle Sizes (Bar Shape - MD3 Default)
| Size | Width | Height |
|------|-------|--------|
| `xs` | 4dp   | 44dp   |
| `sm` | 4dp   | 44dp   |
| `md` | 4dp   | 52dp   |

#### Press Animation
- **Bar handles**: Narrow from 4dp to 2dp width when pressed OR dragged (MD3 spec)
- Implemented via `pressedThumb` state tracking across pointer down/up events

#### Track Gap Styling
- Visual gap between handle and track edges using margins and border-radius
- Gap is 1.5x handle width (6px for 4px handle) consistent across all sizes
- Inner corners use 4px radius for tighter appearance where range meets handle

### Color Roles (MD3)
- **Active track**: `primary`
- **Inactive track**: `secondary` (secondary-container)
- **Handle**: `primary` (solid filled)

### Accessibility
- Full keyboard navigation (Arrow keys, Home, End, PageUp/PageDown)
- ARIA slider role with proper value announcements
- Focus visible states
- Touch-friendly hit targets

## Maintenance Notes

### Range Slider
- **Left side**: Uses same background color as track with proper rounded corners
- **Active range**: Primary color filling between thumb positions
- **Gap from handles**: Inactive track has 6px gap from handles
- **Vertical orientation**: Bottom (start) gets curved corners, top (end) flat

### Known Limitations
- Vertical orientation requires explicit height via className
- Mouse events use pointer events per Radix recommendation
- No value indicators (see Premium Slider for this feature)
- No stop indicators (see Premium Slider for this feature)
- No circular or knobless handle shapes (see Premium Slider)
- Only xs, sm, md sizes (see Premium Slider for lg, xl)

## Premium Tier Features

For advanced features, use the Premium Slider component which includes:
- Circular and knobless handle shapes
- Large (lg) and Extra Large (xl) sizes
- Value indicators with custom formatting
- Stop indicators for discrete steps
- Inset icons (MD3 feature for md, lg, xl sizes)
- State layer hover effects

## Usage Examples

```tsx
// Basic slider (XS size default)
<Slider defaultValue={[50]} />

// Range slider
<Slider defaultValue={[25, 75]} />

// Different sizes
<Slider defaultValue={[50]} size="md" />

// Discrete steps
<Slider defaultValue={[50]} step={10} />

// Vertical orientation
<Slider
  defaultValue={[50]}
  orientation="vertical"
  className="h-48"
/>

// Controlled component
const [value, setValue] = useState([50]);
<Slider
  value={value}
  onValueChange={setValue}
  onValueCommit={(v) => console.log('Final:', v)}
/>
```


