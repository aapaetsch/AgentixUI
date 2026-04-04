# Premium Stepper Component

Advanced stepper component with vertical orientation, non-linear navigation, and collapsible inline content.

## Installation

This is a **Premium** component. Ensure you have the required dependencies:

```bash
npm install @radix-ui/react-collapsible @radix-ui/react-slot class-variance-authority lucide-react
```

## Basic Usage

### Vertical Stepper with Inline Content

```tsx
import {
  PremiumStepper,
  PremiumStepperList,
  PremiumStepperItem,
  PremiumStepperTrigger,
  PremiumStepperIndicator,
  PremiumStepperLabel,
  PremiumStepperConnector,
  PremiumStepperContent,
} from "@agentix/ui/premium/stepper";

function VerticalStepperExample() {
  return (
    <PremiumStepper orientation="vertical" defaultActiveStep={0}>
      <PremiumStepperList>
        <PremiumStepperItem value="step1">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Account Setup</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            {/* Inline content - appears below the trigger */}
            <Input placeholder="Email" />
            <Input placeholder="Password" type="password" />
          </PremiumStepperContent>
        </PremiumStepperItem>

        <PremiumStepperConnector />

        <PremiumStepperItem value="step2">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Profile Details</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <Input placeholder="Full Name" />
            <Textarea placeholder="Bio" />
          </PremiumStepperContent>
        </PremiumStepperItem>

        <PremiumStepperConnector />

        <PremiumStepperItem value="step3">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Review & Submit</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <Button>Complete Setup</Button>
          </PremiumStepperContent>
        </PremiumStepperItem>
      </PremiumStepperList>
    </PremiumStepper>
  );
}
```

### Non-Linear Navigation

```tsx
<PremiumStepper orientation="vertical" nonLinear>
  {/* Users can click any step to navigate */}
</PremiumStepper>
```

### With Async Validation

```tsx
function ValidatedStepper() {
  const handleValidate = async (step: number): Promise<boolean> => {
    // Validate current step before allowing navigation
    const response = await fetch('/api/validate', {
      method: 'POST',
      body: JSON.stringify({ step, data: formData }),
    });
    
    return response.ok;
  };

  return (
    <PremiumStepper onStepValidate={handleValidate}>
      {/* Steps */}
    </PremiumStepper>
  );
}
```

### Custom Connectors

```tsx
<PremiumStepperConnector variant="dashed" />
<PremiumStepperConnector variant="gradient" />
<PremiumStepperConnector variant="solid" animated />
```

### Branching Flow

```tsx
function BranchingExample() {
  const [userType, setUserType] = useState<"student" | "professional" | null>(null);

  return (
    <PremiumStepper orientation="vertical" nonLinear>
      <PremiumStepperItem value="type-selection">
        <PremiumStepperTrigger>
          <PremiumStepperIndicator />
          <PremiumStepperLabel>Select User Type</PremiumStepperLabel>
        </PremiumStepperTrigger>
        <PremiumStepperContent>
          <Button onClick={() => setUserType("student")}>Student</Button>
          <Button onClick={() => setUserType("professional")}>Professional</Button>
        </PremiumStepperContent>
      </PremiumStepperItem>

      <PremiumStepperConnector />

      {userType === "student" && (
        <PremiumStepperItem value="student-info">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Student Information</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <Input placeholder="School Name" />
            <Input placeholder="Graduation Year" />
          </PremiumStepperContent>
        </PremiumStepperItem>
      )}

      {userType === "professional" && (
        <PremiumStepperItem value="professional-info">
          <PremiumStepperTrigger>
            <PremiumStepperIndicator />
            <PremiumStepperLabel>Professional Information</PremiumStepperLabel>
          </PremiumStepperTrigger>
          <PremiumStepperContent>
            <Input placeholder="Company" />
            <Input placeholder="Job Title" />
          </PremiumStepperContent>
        </PremiumStepperItem>
      )}
    </PremiumStepper>
  );
}
```

## Props

### PremiumStepper

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeStep` | `number` | - | Controlled active step (0-indexed) |
| `defaultActiveStep` | `number` | `0` | Default active step for uncontrolled mode |
| `onStepChange` | `(step: number) => void` | - | Callback when step changes |
| `linear` | `boolean` | `true` | Enforce sequential progression |
| `nonLinear` | `boolean` | `false` | Allow any-order navigation (overrides linear) |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Stepper orientation |
| `variant` | `"default" \| "outlined" \| "simple"` | `"default"` | Visual variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `alternativeLabel` | `boolean` | `false` | Place labels below indicators (horizontal only) |
| `onStepValidate` | `(step: number) => Promise<boolean> \| boolean` | - | Async validation before step change |

### PremiumStepperItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Unique step identifier |
| `disabled` | `boolean` | `false` | Disable this step |
| `optional` | `boolean` | `false` | Mark as optional |
| `completed` | `boolean` | - | Override completion state |
| `error` | `boolean` | `false` | Show error state |

### PremiumStepperConnector

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"solid" \| "dashed" \| "gradient"` | `"solid"` | Connector style |
| `animated` | `boolean` | `false` | Animate connector |
| `completed` | `boolean` | - | Override completion state |

### PremiumStepperContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Step value (required for horizontal) |
| `forceMount` | `boolean` | `false` | Keep mounted when inactive |
| `transitionDuration` | `number` | - | Transition duration in ms |

## Hook: `usePremiumStepperNavigation`

```tsx
const {
  activeStep,
  totalSteps,
  goToNext,
  goToPrevious,
  goToStep,
  canGoNext,
  canGoPrevious,
  isFirstStep,
  isLastStep,
  isStepCompleted,
} = usePremiumStepperNavigation();

// Use in navigation buttons
<Button onClick={goToPrevious} disabled={!canGoPrevious}>
  Previous
</Button>
<Button onClick={goToNext} disabled={!canGoNext}>
  Next
</Button>
```

## Variants

### Default
Filled circle indicators with solid connectors.

### Outlined
Outlined circle indicators that fill when completed.

### Simple
Minimal indicators with no background, text only.

## Accessibility

- Fully keyboard accessible (Tab, Enter, Space, Arrow keys)
- Screen reader support with proper ARIA roles and labels
- Focus management for collapsible content
- High contrast support for all states

## Best Practices

1. **Use Vertical for Complex Forms**: Better UX for mobile and content-heavy steps
2. **Validate Before Advancing**: Use `onStepValidate` for async validation
3. **Show Progress**: Use completion states and connectors to show progress
4. **Branch Wisely**: Keep branching flows simple to avoid confusing users
5. **Error Handling**: Show clear error states and validation messages

## Differences from Free Tier

| Feature | Free Tier | Premium Tier |
|---------|-----------|--------------|
| Orientation | Horizontal only | Horizontal + Vertical |
| Navigation | Linear only | Linear + Non-linear |
| Content | External panels | Inline collapsible + External |
| Connectors | Basic separator | Custom variants (solid/dashed/gradient) |
| Validation | Client-side only | Async validation support |
| Branching | Not supported | Full branching support |

## Examples

See Storybook for comprehensive examples:
- Vertical orientation
- Non-linear navigation
- Async validation
- Custom connectors
- Branching flows
- All variants and sizes
- Error and optional states
