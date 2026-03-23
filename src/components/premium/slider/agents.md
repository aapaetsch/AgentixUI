# Premium Slider Component
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

Premium tier slider component for selecting values from a range following Material Design 3 specifications. Extends the free tier slider with additional sizes, handle shapes, value indicators, stop indicators, and inset icons.

## Tier Architecture

### Free Tier (Base)
The free tier slider (`src/components/free/slider`) provides:
- **Sizes**: xs, sm, md (track heights 16dp, 24dp, 40dp)
- **Handle**: Bar shape only (4dp width, MD3 default)
- **Features**: Press animation, gap styling, range support

### Premium Tier (Extended)
The premium slider extends the free tier with:
- **Additional Sizes**: lg (56dp), xl (96dp)
- **Handle Shapes**: bar, circular, knobless
- **Value Indicators**: Always, hover, or never visible
- **Stop Indicators**: Visual dots for discrete steps
- **Inset Icons**: Icons within the track (md, lg, xl sizes)

## Components

### PremiumSlider
A versatile slider supporting single value or range selection with MD3 animations and premium features.

## Props

```typescript
interface PremiumSliderProps extends Omit<SliderPrimitive.RootProps, "orientation"> {
  orientation?: "horizontal" | "vertical";  // Slider orientation
  size?: "xs" | "sm" | "md" | "lg" | "xl";  // Size variant (default: "xs")
  handleShape?: "bar" | "circular" | "knobless";  // Handle shape (default: "bar" for MD3)
  showValueIndicator?: "always" | "hover" | "never";  // Value indicator visibility
  valueIndicatorSize?: "sm" | "md" | "lg";  // Value indicator size (default: "md")
  formatValue?: (value: number) => string;  // Custom value formatter
  showStops?: boolean;  // Show stop indicators for discrete steps
  insetIcon?: React.ReactNode;  // Icon in track (M, L, XL sizes only)
  insetIconAtMin?: React.ReactNode;  // Alternate icon when at minimum
  insetIconAtMax?: React.ReactNode;  // Alternate icon when at maximum
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
| Size | Track | Track Shape | Inset Icon |
|------|-------|-------------|------------|
| `xs` | 16dp  | 8dp radius  | ❌ |
| `sm` | 24dp  | 8dp radius  | ❌ |
| `md` | 40dp  | 12dp radius | ✅ 24dp |
| `lg` | 56dp  | 16dp radius | ✅ 24dp |
| `xl` | 96dp  | 28dp radius | ✅ 32dp |

#### Handle Sizes (Bar Shape - MD3 Default)
| Size | Width | Height |
|------|-------|--------|
| `xs` | 4dp   | 44dp   |
| `sm` | 4dp   | 44dp   |
| `md` | 4dp   | 52dp   |
| `lg` | 4dp   | 68dp   |
| `xl` | 4dp   | 108dp  |

#### Circular Handle Sizes (xs only)
| Size | Diameter |
|------|----------|
| `xs` | 20dp     |

#### Knobless Variant
No visible handle - the track itself is interactive. Available for all sizes.

#### Press Animation
- **Bar handles**: Narrow from 4dp to 2dp width when pressed OR dragged (MD3 spec)
- **Circular handles**: Scale down to 90% when pressed (xs only)
- **Knobless**: No visible handle to animate
- Implemented via `pressedThumb` state tracking across pointer down/up events

#### Circular Handle Positioning (xs only)
- The circular knob is positioned left with negative transform
- This ensures the end of the bar (active range) is centered on the knob
- Uses `-translate-x-1/2` for precise centering

#### Track Gap Styling
- Visual gap between handle and track edges using margins and border-radius
- Gap is 1.5x handle width (6px for 4px handle) consistent across all sizes
- Inner corners use 2px radius for tighter appearance where range meets handle

#### Handle Corner Radius
- Bar handles use 2px (`[0.125rem]`) radius for tighter top/bottom corners
- No visible focus ring - handle maintains appearance when focused

### Color Roles (MD3)
- **Active track**: `primary`
- **Inactive track**: `secondary` (secondary-container)
- **Handle**: `primary` (solid filled)
- **Value indicator**: `foreground` bg with `background` text (inverse surface)
- **Stop indicators inactive**: `muted-foreground` (on-secondary-container)
- **Stop indicators active**: `primary-foreground` (on-primary)
- **Inset icon (active track)**: `primary-foreground`
- **Inset icon (inactive track)**: `muted-foreground`

### Value Indicator (MD3)
- **Sizes**: sm (32×32dp), md (44×48dp - default), lg (48×56dp)
- Shape: Full rounded (pill)
- Position: Above (horizontal) or right (vertical)

### Stop Indicators (MD3)
- Size: 4dp (consistent across all sizes)
- Shape: Circle (rounded-full)
- Color changes based on active range

### MD3 Motion Patterns
- **Duration**: 200ms (reduced from variable for consistency)
- **Handle press**: Width narrows from 4dp → 2dp
- **State layer**: Opacity transitions on hover/focus/active

### Inset Icon Behavior
- Only available for M, L, XL sizes (track thickness ≥ 40dp)
- Icon positioned at start of active track
- When value is low (< 15%), icon moves to inactive track
- Optional alternate icon at minimum value (e.g., mute icon for volume)
- NOT recommended for range or centered sliders

### Accessibility
- Full keyboard navigation (Arrow keys, Home, End, PageUp/PageDown)
- ARIA slider role with proper value announcements
- Focus visible states with ring styling
- Touch-friendly hit targets via state layer

## Maintenance Notes

### Range Slider
- **Left side**: Uses same background color as track with proper rounded corners
- **Active range**: Primary color filling between thumb positions
- **No touching handle**: Inactive track has gap from handles
- **Vertical orientation**: Bottom (start) gets curved corners, top (end) flat

### Discrete Steps
- Set `step` prop for increment amount
- Enable `showStops` to display dot indicators
- Stops change color when within active range

### Inset Icons
- Only works with single-value sliders (not range)
- Use `insetIconAtMin` for alternate icons at zero (e.g., mute)
- Use `insetIconAtMax` for alternate icons at maximum value (e.g., full brightness)
- Icons from lucide-react work well
- Not supported for xs/sm sizes
- Icons transition smoothly between states with 0.2s ease-out animation

### Known Limitations
- Vertical orientation requires explicit height via className
- Mouse events use pointer events per Radix recommendation
- Stop indicators use inline styles for dynamic positioning
- Centered slider type not yet implemented

## Usage Examples

```tsx
// Basic slider (XS size default)
<PremiumSlider defaultValue={[50]} />

// Range slider
<PremiumSlider defaultValue={[25, 75]} />

// Circular handle variant (xs only)
<PremiumSlider defaultValue={[50]} size="xs" handleShape="circular" />

// Knobless variant (all sizes)
<PremiumSlider defaultValue={[50]} handleShape="knobless" />

// With value indicator
<PremiumSlider
  defaultValue={[50]}
  showValueIndicator="always"
  formatValue={(v) => `${v}%`}
/>

// Large value indicator
<PremiumSlider
  defaultValue={[50]}
  showValueIndicator="always"
  valueIndicatorSize="lg"
/>

// Discrete with stops
<PremiumSlider defaultValue={[50]} step={10} showStops />

// Vertical orientation
<PremiumSlider
  defaultValue={[50]}
  orientation="vertical"
  className="h-48"
/>

// With inset icon (MD3 feature)
<PremiumSlider
  defaultValue={[50]}
  size="md"
  insetIcon={<Volume2 />}
  insetIconAtMin={<VolumeX />}
/>

// XL hero slider
<PremiumSlider
  defaultValue={[50]}
  size="xl"
  insetIcon={<SunMedium />}
/>

// Controlled component
const [value, setValue] = useState([50]);
<PremiumSlider
  value={value}
  onValueChange={setValue}
  onValueCommit={(v) => console.log('Final:', v)}
/>
```

## See Also

- **Free Tier Slider**: `src/components/free/slider` - Basic slider with xs, sm, md sizes
- For basic slider needs without premium features, use the free tier slider directly


