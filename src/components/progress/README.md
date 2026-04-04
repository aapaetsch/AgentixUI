# Progress Components

A comprehensive set of progress indicators for displaying completion status, skill levels, and loading states.

## Installation

The Progress components are part of the `@aidan/ui` library. Import them from the main package:

```tsx
import { 
  LinearProgress, 
  CircularProgress, 
  SkillBar, 
  ProgressGroup,
  valueFormatters,
  useAnimatedProgress
} from "@aidan/ui";
```

## Components

### LinearProgress

A horizontal or vertical progress bar with extensive customization options.

```tsx
// Basic usage
<LinearProgress value={75} />

// With label and value display
<LinearProgress 
  value={75} 
  label="Upload Progress" 
  showValue 
/>

// Vertical orientation
<LinearProgress 
  value={75} 
  orientation="vertical" 
  height="200px" 
/>

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

// Indeterminate loading state
<LinearProgress indeterminate label="Loading..." />
```

### CircularProgress

A circular progress indicator supporting full, three-quarter, half, and quarter arcs.

```tsx
// Basic usage
<CircularProgress value={75} />

// With value display
<CircularProgress value={75} showValue />

// With label
<CircularProgress value={75} showValue label="Complete" />

// Half circle
<CircularProgress value={75} arcType="half" showValue />

// Three-quarter arc
<CircularProgress value={75} arcType="three-quarter" showValue />

// Quarter arc
<CircularProgress value={75} arcType="quarter" showValue />

// With custom content in center
<CircularProgress value={75} size="xl">
  <div className="text-center">
    <div className="text-2xl font-bold">75</div>
    <div className="text-xs text-muted-foreground">Points</div>
  </div>
</CircularProgress>

// With gradient
<CircularProgress
  value={75}
  gradient={{
    stops: [
      { offset: "0%", color: "#22c55e" },
      { offset: "100%", color: "#15803d" }
    ]
  }}
/>
```

### SkillBar

A specialized progress bar optimized for displaying skill levels.

```tsx
// Basic skill bar
<SkillBar skill="React" value={90} />

// With skill level label
<SkillBar skill="TypeScript" value={85} level="Expert" />

// With color variant
<SkillBar skill="Node.js" value={75} level="Intermediate" variant="success" />
```

### ProgressGroup

A container for grouping multiple progress indicators with consistent spacing.

```tsx
// Vertical skill list
<ProgressGroup>
  <SkillBar skill="React" value={90} level="Expert" />
  <SkillBar skill="TypeScript" value={85} level="Advanced" />
  <SkillBar skill="Node.js" value={75} level="Intermediate" />
</ProgressGroup>

// Horizontal circular indicators
<ProgressGroup direction="horizontal" gap="lg">
  <CircularProgress value={25} showValue label="Q1" />
  <CircularProgress value={50} showValue label="Q2" />
  <CircularProgress value={75} showValue label="Q3" />
  <CircularProgress value={100} showValue label="Q4" variant="success" />
</ProgressGroup>
```

## Value Formatting

Customize how values are displayed using built-in or custom formatters:

```tsx
import { valueFormatters } from "@aidan/ui";

// Percentage (default): "75%"
<LinearProgress value={75} showValue valueFormatter={valueFormatters.percentage} />

// Raw value: "75"
<LinearProgress value={75} showValue valueFormatter={valueFormatters.value} />

// Fraction: "75/100"
<LinearProgress value={75} showValue valueFormatter={valueFormatters.fraction} />

// Decimal: "0.75"
<LinearProgress value={75} showValue valueFormatter={valueFormatters.decimal} />

// Custom formatter
<LinearProgress
  value={750}
  max={1000}
  showValue
  valueFormatter={(value, min, max) => `${value}MB / ${max}MB`}
/>
```

## Variants

Both LinearProgress and CircularProgress support color variants:

- `default` - Primary color
- `success` - Green
- `warning` - Yellow
- `error` - Red/Destructive
- `info` - Blue

```tsx
<LinearProgress value={75} variant="success" />
<CircularProgress value={75} variant="error" showValue />
```

## Sizes

### LinearProgress Sizes

Sizes control the bar height (horizontal) or width (vertical):

- `xs` - 4px
- `sm` - 8px
- `md` - 12px (default)
- `lg` - 16px
- `xl` - 24px

### CircularProgress Sizes

- `xs` - 32px
- `sm` - 48px
- `md` - 64px (default)
- `lg` - 96px
- `xl` - 128px
- `2xl` - 160px

## Arc Types (CircularProgress)

Control how much of the circle is used:

- `full` - Complete 360° circle (default)
- `three-quarter` - 270° arc
- `half` - 180° arc
- `quarter` - 90° arc

Use `startAngle` to rotate the arc:

```tsx
// Half circle starting from bottom
<CircularProgress value={75} arcType="half" startAngle={180} />
```

## Line Caps (CircularProgress)

Control the stroke end style:

- `round` - Rounded ends (default)
- `butt` - Flat ends
- `square` - Square ends extending past the endpoint

## Gradients

Apply gradient fills to progress indicators:

```tsx
const gradient = {
  stops: [
    { offset: "0%", color: "#3b82f6" },
    { offset: "50%", color: "#8b5cf6" },
    { offset: "100%", color: "#ec4899" }
  ],
  angle: 90 // Optional rotation in degrees
};

<LinearProgress value={75} gradient={gradient} />
<CircularProgress value={75} gradient={gradient} />
```

## Accessibility

All progress components include full ARIA support:

- `role="progressbar"` for semantic meaning
- `aria-valuenow` for current value
- `aria-valuemin` and `aria-valuemax` for range
- `aria-label` for screen reader context
- `aria-busy` for indeterminate states

The components respect `prefers-reduced-motion` by disabling transitions when reduced motion is preferred.

## Animated Progress

The `useAnimatedProgress` hook creates animated progress values with easing, looping, and manual control. Perfect for loading indicators, file uploads, and animated dashboards.

### Basic Animated Loading Bar

```tsx
import { useAnimatedProgress, LinearProgress } from "@aidan/ui";

function LoadingBar() {
  const { value } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 2000,
    loop: true,
  });

  return <LinearProgress value={value} showValue />;
}
```

### Ping-Pong Effect

```tsx
function PingPongLoader() {
  const { value } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 1500,
    loop: true,
    reverse: true, // Goes back and forth
    easing: "easeInOut",
  });

  return <LinearProgress value={value} />;
}
```

### Controlled Animation

```tsx
function ControlledProgress() {
  const { value, start, pause, reset, isAnimating } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 3000,
    autoStart: false,
    onComplete: () => console.log("Animation complete!"),
  });

  return (
    <div>
      <LinearProgress value={value} showValue />
      <button onClick={isAnimating ? pause : start}>
        {isAnimating ? "Pause" : "Start"}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### File Upload Simulation

```tsx
function FileUpload() {
  const [isDone, setIsDone] = React.useState(false);
  const { value, start, reset } = useAnimatedProgress({
    from: 0,
    to: 100,
    duration: 4000,
    autoStart: false,
    easing: "linear",
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
        valueFormatter={(v) => isDone ? "Complete!" : `${Math.round(v)}%`}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
```

### Hook Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `from` | `number` | `0` | Starting value |
| `to` | `number` | `100` | Target value |
| `duration` | `number` | `2000` | Duration in milliseconds |
| `loop` | `boolean` | `false` | Whether to loop the animation |
| `reverse` | `boolean` | `true` | Reverse direction on loop |
| `easing` | `string` | `"easeInOut"` | Easing: `linear`, `easeIn`, `easeOut`, `easeInOut` |
| `autoStart` | `boolean` | `true` | Auto-start on mount |
| `onComplete` | `() => void` | - | Called when animation completes |

### Hook Returns

| Property | Type | Description |
|----------|------|-------------|
| `value` | `number` | Current animated value |
| `isAnimating` | `boolean` | Whether animation is running |
| `start` | `() => void` | Start/resume the animation |
| `pause` | `() => void` | Pause the animation |
| `reset` | `() => void` | Reset to initial state |
| `setValue` | `(value: number) => void` | Set value directly (stops animation) |

## Examples

### Dashboard Storage Indicator

```tsx
<LinearProgress
  value={73}
  showValue
  label="73GB of 100GB used"
  labelPosition="top"
  valueFormatter={(v, min, max) => `${max - v}GB remaining`}
  gradient={{
    stops: [
      { offset: "0%", color: "#3b82f6" },
      { offset: "100%", color: "#8b5cf6" }
    ]
  }}
/>
```

### Game Character Stats

```tsx
<div className="flex gap-4">
  <CircularProgress value={85} showValue label="HP" variant="error" size="lg" />
  <CircularProgress value={60} showValue label="MP" variant="info" size="lg" />
  <CircularProgress value={45} showValue label="XP" variant="success" size="lg" />
</div>
```

### Project Milestones

```tsx
<ProgressGroup direction="horizontal" gap="lg">
  <CircularProgress value={100} showValue label="Design" variant="success" />
  <CircularProgress value={100} showValue label="Development" variant="success" />
  <CircularProgress value={75} showValue label="Testing" variant="warning" />
  <CircularProgress value={25} showValue label="Launch" />
</ProgressGroup>
```

## API Reference

See the [agents.md](./agents.md) file for complete prop documentation.
