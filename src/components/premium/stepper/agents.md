# Premium Stepper
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview

The Premium Stepper extends the basic stepper with advanced features including vertical orientation, non-linear navigation, inline collapsible content, custom connectors, and async validation.

## Architecture

### Sub-components

- `PremiumStepper` - Root container with context provider
- `PremiumStepperList` - Container for step items
- `PremiumStepperItem` - Individual step with Radix Collapsible support
- `PremiumStepperTrigger` - Clickable step header
- `PremiumStepperIndicator` - Visual indicator (number/icon/check)
- `PremiumStepperLabel` - Step title and description
- `PremiumStepperConnector` - Custom connector with variants
- `PremiumStepperContent` - Inline collapsible or external content

## Dependencies

- `@radix-ui/react-collapsible` - Collapsible content for vertical orientation
- `@radix-ui/react-slot` - Slot pattern for custom trigger elements
- `class-variance-authority` - Variant management
- `lucide-react` - Icons (Check, AlertCircle, ChevronRight)

## Key Features

### 1. Vertical Orientation

Vertical layout with inline collapsible content powered by Radix Collapsible primitive.

```tsx
<PremiumStepper orientation="vertical">
  <PremiumStepperList>
    <PremiumStepperItem value="step1">
      <PremiumStepperTrigger>
        <PremiumStepperIndicator />
        <PremiumStepperLabel>Step 1</PremiumStepperLabel>
      </PremiumStepperTrigger>
      <PremiumStepperContent>
        Inline content appears here
      </PremiumStepperContent>
    </PremiumStepperItem>
  </PremiumStepperList>
</PremiumStepper>
```

### 2. Non-Linear Navigation

Allow users to navigate to any step regardless of order.

```tsx
<PremiumStepper nonLinear>
  {/* Users can click any step */}
</PremiumStepper>
```

### 3. Async Validation

Validate steps before allowing navigation.

```tsx
const handleValidate = async (step: number) => {
  const isValid = await validateStepData(step);
  return isValid;
};

<PremiumStepper onStepValidate={handleValidate}>
  {/* Steps */}
</PremiumStepper>
```

### 4. Custom Connectors

Three built-in connector variants:
- `solid` - Solid line (default)
- `dashed` - Dashed line
- `gradient` - Gradient effect

```tsx
<PremiumStepperConnector variant="dashed" />
```

### 5. Branching Flows

Conditionally render steps based on user choices.

```tsx
const [accountType, setAccountType] = useState<"personal" | "business">(null);

<PremiumStepper orientation="vertical" nonLinear>
  <PremiumStepperItem value="choose-type">
    {/* User selects accountType */}
  </PremiumStepperItem>
  
  {accountType === "personal" && (
    <PremiumStepperItem value="personal-details">
      {/* Personal form */}
    </PremiumStepperItem>
  )}
  
  {accountType === "business" && (
    <PremiumStepperItem value="business-details">
      {/* Business form */}
    </PremiumStepperItem>
  )}
</PremiumStepper>
```

## Styling Decisions

### Vertical Orientation

- Uses Radix Collapsible for smooth expand/collapse animations
- Content indented with `ml-11` to align with label text
- Connector positioned at `ml-4` to align with indicator center

### Animations

- Accordion-style animations for vertical content (`animate-accordion-up/down`)
- Fade-in for horizontal content panels
- Smooth transitions on state changes (200ms, standard easing)

### Responsive Considerations

Vertical orientation is particularly well-suited for mobile viewports as it:
- Reduces horizontal scrolling
- Provides more vertical space for content
- Shows only active step content (collapsed others)

## Accessibility

- `role="tablist"` on StepperList
- `role="tab"` on StepperTrigger
- `role="tabpanel"` on StepperContent
- `aria-selected` for active state
- `aria-disabled` for disabled steps
- Collapsible content properly hidden from screen readers when collapsed

## Performance Considerations

- Collapsible content is unmounted when closed (controlled by Radix)
- Use `forceMount` prop if content must stay in DOM
- Async validation can be throttled/debounced if needed

## Maintenance Notes

### Adding New Connector Variants

Add to `premiumStepperConnectorVariants` in CVA:

```typescript
variant: {
  solid: "...",
  dashed: "...",
  gradient: "...",
  custom: "your-custom-classes",
}
```

### Extending Validation

The `onStepValidate` callback can be extended to:
- Call APIs
- Check form validity
- Show loading states
- Display error messages

### Known Edge Cases

1. **Vertical + Horizontal Mix**: Not supported - orientation applies to all steps
2. **Dynamic Step Insertion**: Steps must be registered on mount; dynamic insertion may cause re-indexing issues
3. **Async Race Conditions**: Multiple rapid clicks during validation may cause state conflicts - consider debouncing

## Future Enhancements

- Progress bar overlay
- Step completion percentages
- Mobile-optimized gestures (swipe navigation)
- Step history/undo functionality
- Keyboard shortcuts (Ctrl+Arrow to skip steps)


