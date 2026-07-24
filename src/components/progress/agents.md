# Progress Components
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A comprehensive set of progress indicators including linear (horizontal/vertical) and circular variants with extensive customization options.

## File Structure

```
progress/
├── index.tsx           # Re-exports all components
├── progress-shared.ts  # Shared types, utilities, and useAnimatedProgress hook
├── linear-progress.tsx # LinearProgress component
├── circular-progress.tsx # CircularProgress component
├── skill-bar.tsx       # SkillBar component
├── progress-group.tsx  # ProgressGroup component
├── Progress.stories.tsx # Storybook stories
├── agents.md           # This file
└── README.md           # Human documentation
```

## Components

### LinearProgress
Horizontal or vertical progress bar with label and value display options.
**File:** `linear-progress.tsx`

### CircularProgress
Circular progress indicator with support for full, three-quarter, half, and quarter arcs.
**File:** `circular-progress.tsx`

### SkillBar
Specialized progress bar for displaying skill levels.
**File:** `skill-bar.tsx`

### ProgressGroup
Container for grouping multiple progress indicators.
**File:** `progress-group.tsx`

### useAnimatedProgress (Hook)
Hook for creating animated progress values with easing, looping, and manual control.
**File:** `progress-shared.ts`

## Props

### LinearProgress Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Current progress value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Bar orientation |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size preset |
| `variant` | `"default" \| "success" \| "warning" \| "error" \| "info"` | `"default"` | Color variant |
| `rounded` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"full"` | Border radius |
| `indeterminate` | `boolean` | `false` | Enable loading animation |
| `showValue` | `boolean` | `false` | Show value display |
| `valuePosition` | `"top" \| "bottom" \| "left" \| "right" \| "inside"` | `"right"` | Value placement |
| `valueFormatter` | `ValueFormatter` | `percentage` | Custom formatter function |
| `label` | `string` | - | Label text |
| `labelPosition` | `LabelPosition` | `"top"` | Label placement |
| `width` | `string` | - | Custom width (CSS value) |
| `height` | `string` | - | Custom height (CSS value) |
| `gradient` | `ProgressGradient` | - | Gradient configuration |
| `barClassName` | `string` | - | Custom class for progress bar fill |

### CircularProgress Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Current progress value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"` | Size preset |
| `arcType` | `"full" \| "three-quarter" \| "half" \| "quarter"` | `"full"` | Arc coverage |
| `startAngle` | `number` | `0` | Start angle in degrees |
| `variant` | `"default" \| "success" \| "warning" \| "error" \| "info"` | `"default"` | Color variant |
| `indeterminate` | `boolean` | `false` | Enable loading animation |
| `strokeWidth` | `number` | `4` | Arc stroke width |
| `lineCap` | `"round" \| "butt" \| "square"` | `"round"` | Line cap style |
| `showValue` | `boolean` | `false` | Show value in center |
| `valueFormatter` | `ValueFormatter` | `percentage` | Custom formatter function |
| `label` | `string` | - | Label text (below value) |
| `gradient` | `ProgressGradient` | - | Gradient configuration |
| `customPath` | `string` | - | Custom SVG path |
| `customPathLength` | `number` | - | Path length for custom paths |
| `children` | `ReactNode` | - | Custom center content |

### useAnimatedProgress Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `from` | `number` | `0` | Starting value |
| `to` | `number` | `100` | Target value |
| `duration` | `number` | `2000` | Duration in milliseconds |
| `loop` | `boolean` | `false` | Whether to loop the animation |
| `reverse` | `boolean` | `true` | Reverse direction on loop (ping-pong) |
| `easing` | `"linear" \| "easeIn" \| "easeOut" \| "easeInOut"` | `"easeInOut"` | Easing function |
| `autoStart` | `boolean` | `true` | Auto-start on mount |
| `onComplete` | `() => void` | - | Callback when animation completes |

### useAnimatedProgress Returns

| Property | Type | Description |
|----------|------|-------------|
| `value` | `number` | Current animated value |
| `isAnimating` | `boolean` | Whether animation is running |
| `start` | `() => void` | Start/resume animation |
| `pause` | `() => void` | Pause animation |
| `reset` | `() => void` | Reset to initial state |
| `setValue` | `(value: number) => void` | Set value directly (stops animation) |

## Dependencies

- `class-variance-authority` - Variant management
- `../../../lib/utils` - `cn()` utility for class merging

## Styling Decisions

### CVA Variants
- **LinearProgress**: Uses compound variants for size based on orientation (height for horizontal, width for vertical)
- **CircularProgress**: Size variants control the container dimensions, SVG scales to fill
- Both support multiple color variants (default, success, warning, error, info)

### SVG Implementation
- CircularProgress uses SVG paths for precise arc rendering
- Supports custom paths for non-standard shapes
- Gradients defined via SVG `<linearGradient>` elements
- Arc calculations handle all four arc types (full, three-quarter, half, quarter)

### Animation
- Default 300ms transition for value changes
- Respects `prefers-reduced-motion` via `motion-reduce:transition-none`
- Indeterminate mode uses CSS animations
- `useAnimatedProgress` hook uses `requestAnimationFrame` for smooth animation

### Accessibility
- Full ARIA support: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-busy` for indeterminate state
- `aria-label` for screen reader context
- Minimum 3:1 contrast ratio for progress indicators (WCAG AA)

## Usage Examples

```tsx
// Basic linear progress
<LinearProgress value={75} />

// With label and value
<LinearProgress value={75} label="Progress" showValue />

// Vertical orientation (requires explicit height)
<LinearProgress value={75} orientation="vertical" height="200px" />

// With gradient
<LinearProgress
  value={75}
  gradient={{
    stops: [
      { offset: "0%", color: "#3b82f6" },
      { offset: "100%", color: "#8b5cf6" }
    ]
  }}
/>

// Circular with value
<CircularProgress value={75} showValue />

// Half circle
<CircularProgress value={75} arcType="half" showValue label="Complete" />

// Circular with custom content
<CircularProgress value={75} size="xl">
  <div className="text-center">
    <div className="text-2xl font-bold">75</div>
    <div className="text-xs">Points</div>
  </div>
</CircularProgress>

// Skill bar
<SkillBar skill="React" value={90} level="Expert" />

// Progress group
<ProgressGroup>
  <SkillBar skill="React" value={90} />
  <SkillBar skill="TypeScript" value={85} />
</ProgressGroup>
```

### Animated Progress Examples

```tsx
import { useAnimatedProgress, LinearProgress, CircularProgress } from "aapaetsch-ui-kit";

// Auto-looping loading bar
function LoadingBar() {
  const { value } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 2000,
    loop: true,
  });
  return <LinearProgress value={value} />;
}

// Ping-pong effect
function PingPongProgress() {
  const { value } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 1500,
    loop: true,
    reverse: true,
    easing: "easeInOut",
  });
  return <LinearProgress value={value} />;
}

// Manual control
function ControlledProgress() {
  const { value, start, pause, reset, isAnimating } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 3000,
    autoStart: false,
    onComplete: () => console.log("Done!"),
  });
  
  return (
    <div>
      <LinearProgress value={value} />
      <button onClick={isAnimating ? pause : start}>
        {isAnimating ? "Pause" : "Start"}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// File upload simulation
function FileUpload() {
  const [isDone, setIsDone] = React.useState(false);
  const { value, start, reset } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 4000,
    autoStart: false,
    onComplete: () => setIsDone(true),
  });

  const handleUpload = () => {
    setIsDone(false);
    reset();
    start();
  };

  return (
    <div>
      <LinearProgress 
        value={value} 
        variant={isDone ? "success" : "default"}
        showValue
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

## Value Formatters

Built-in formatters available via `valueFormatters`:

```tsx
import { valueFormatters } from "./progress";

// Percentage: "75%"
valueFormatters.percentage(75, 0, 100)

// Raw value: "75"
valueFormatters.value(75, 0, 100)

// Fraction: "75/100"
valueFormatters.fraction(75, 0, 100)

// Decimal: "0.75"
valueFormatters.decimal(75, 0, 100)

// Custom
<LinearProgress
  value={75}
  valueFormatter={(v, min, max) => `${v}MB / ${max}MB`}
/>
```

## Maintenance Notes

### Edge Cases
- Handles values outside min/max range (clamps to 0-100%)
- Full circle arc requires special path handling (two arcs)
- Indeterminate mode hides value display
- Inside value position uses `mix-blend-difference` for visibility
- Vertical bars need explicit `height` prop or parent with defined height

### Performance
- React.memo can be used for static progress indicators
- SVG gradients use unique IDs via `React.useId()`
- Transitions disabled when reduced motion preferred
- `useAnimatedProgress` cleans up animation frames on unmount

### Future Considerations
- Buffer/secondary value support for streaming progress
- Tooltip value display option
- Step marks for discrete progress
- RTL support for horizontal progress


