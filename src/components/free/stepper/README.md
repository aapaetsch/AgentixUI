# Stepper

A multi-step workflow component for guiding users through sequential processes like forms, wizards, and onboarding flows.

## Features

- **Linear & Non-linear modes** - Enforce sequential progression or allow free navigation
- **Multiple variants** - Default (filled), Outlined, and Simple styles
- **Size options** - Small, Medium, and Large sizes
- **Step states** - Active, Completed, Error, Disabled, and Optional
- **Custom icons** - Use any icon in step indicators
- **Controlled & Uncontrolled** - Flexible state management
- **Navigation hook** - Built-in `useStepperNavigation()` for easy controls
- **Accessible** - Full keyboard navigation and ARIA support

## Installation

The Stepper component is part of the `@aidan/ui` package:

```tsx
import {
  Stepper,
  StepperList,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperLabel,
  StepperSeparator,
  StepperContent,
  StepperNavigation,
  useStepperNavigation,
} from "@aidan/ui";
```

## Basic Usage

```tsx
<Stepper defaultActiveStep={0}>
  <StepperList>
    <StepperItem value="step1">
      <StepperTrigger>
        <StepperIndicator />
        <StepperLabel>Account</StepperLabel>
      </StepperTrigger>
    </StepperItem>
    <StepperSeparator />
    <StepperItem value="step2">
      <StepperTrigger>
        <StepperIndicator />
        <StepperLabel>Profile</StepperLabel>
      </StepperTrigger>
    </StepperItem>
    <StepperSeparator />
    <StepperItem value="step3">
      <StepperTrigger>
        <StepperIndicator />
        <StepperLabel>Review</StepperLabel>
      </StepperTrigger>
    </StepperItem>
  </StepperList>
  
  <StepperContent value="step1">Account setup form...</StepperContent>
  <StepperContent value="step2">Profile details...</StepperContent>
  <StepperContent value="step3">Review & submit...</StepperContent>
</Stepper>
```

## With Navigation Buttons

Use the `useStepperNavigation()` hook to create navigation controls:

```tsx
function NavigationButtons() {
  const { goToNext, goToPrevious, canGoNext, canGoPrevious, isLastStep } =
    useStepperNavigation();

  return (
    <StepperNavigation>
      <Button variant="outline" onClick={goToPrevious} disabled={!canGoPrevious}>
        Back
      </Button>
      <Button onClick={goToNext} disabled={!canGoNext}>
        {isLastStep ? "Finish" : "Next"}
      </Button>
    </StepperNavigation>
  );
}

// Inside Stepper:
<Stepper defaultActiveStep={0}>
  {/* ...steps... */}
  <NavigationButtons />
</Stepper>
```

## Variants

### Default (Filled)
```tsx
<Stepper variant="default">
  {/* ... */}
</Stepper>
```

### Outlined
```tsx
<Stepper variant="outlined">
  {/* ... */}
</Stepper>
```

### Simple
```tsx
<Stepper variant="simple">
  {/* ... */}
</Stepper>
```

## Sizes

```tsx
<Stepper size="sm">...</Stepper>
<Stepper size="md">...</Stepper>  {/* default */}
<Stepper size="lg">...</Stepper>
```

## Step States

### Completed Step
```tsx
<StepperItem value="step1" completed>
  {/* ... */}
</StepperItem>
```

### Error Step
```tsx
<StepperItem value="step2" error>
  <StepperTrigger>
    <StepperIndicator />
    <StepperLabel description="Please fix the errors">
      Step 2
    </StepperLabel>
  </StepperTrigger>
</StepperItem>
```

### Optional Step
```tsx
<StepperItem value="step2" optional>
  {/* Shows "Optional" below the label */}
</StepperItem>
```

### Disabled Step
```tsx
<StepperItem value="step2" disabled>
  {/* Cannot be clicked */}
</StepperItem>
```

## Custom Icons

```tsx
<StepperIndicator>
  <User className="size-4" />
</StepperIndicator>
```

## With Descriptions

```tsx
<StepperLabel description="Enter your shipping address">
  Shipping Details
</StepperLabel>
```

## Controlled Mode

```tsx
const [activeStep, setActiveStep] = useState(0);

<Stepper
  activeStep={activeStep}
  onStepChange={setActiveStep}
>
  {/* ... */}
</Stepper>
```

## Non-Linear Mode

Allow users to click any step to navigate:

```tsx
<Stepper linear={false}>
  {/* All steps are clickable */}
</Stepper>
```

## API Reference

### Stepper

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeStep` | `number` | - | Controlled active step (0-indexed) |
| `defaultActiveStep` | `number` | `0` | Uncontrolled default step |
| `onStepChange` | `(step: number) => void` | - | Callback when step changes |
| `linear` | `boolean` | `true` | Enforce sequential progression |
| `variant` | `"default" \| "outlined" \| "simple"` | `"default"` | Visual variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of stepper |

### StepperItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Unique step identifier |
| `disabled` | `boolean` | `false` | Disable this step |
| `optional` | `boolean` | `false` | Mark as optional |
| `completed` | `boolean` | - | Override completion state |
| `error` | `boolean` | `false` | Show error state |

### StepperTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Use Radix Slot pattern |

### StepperIndicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom icon or content |

### StepperLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `description` | `ReactNode` | - | Optional subtitle |
| `children` | `ReactNode` | **required** | Label text |

### StepperContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Matches StepperItem value |
| `forceMount` | `boolean` | `false` | Keep mounted when inactive |

### useStepperNavigation()

Hook for navigation controls. Must be used inside a Stepper component.

```tsx
const {
  activeStep,      // Current step index
  totalSteps,      // Total number of steps
  goToNext,        // Function to go to next step
  goToPrevious,    // Function to go to previous step
  goToStep,        // Function to go to specific step
  canGoNext,       // Boolean: can navigate forward
  canGoPrevious,   // Boolean: can navigate backward
  isFirstStep,     // Boolean: is first step
  isLastStep,      // Boolean: is last step
  isStepCompleted, // Function: check if step is completed
} = useStepperNavigation();
```

## Accessibility

- Uses `role="tablist"` for the step list
- Uses `role="tab"` for step triggers
- Uses `role="tabpanel"` for step content
- Supports keyboard navigation (Tab, Enter, Space)
- Provides proper `aria-selected` and `aria-disabled` attributes
- Focus indicators on interactive elements
