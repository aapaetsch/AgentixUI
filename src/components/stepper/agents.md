# Stepper
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview

The Stepper extends the base stepper API with advanced features including vertical orientation, non-linear navigation, inline collapsible content, custom connectors, and async validation.

## Architecture

### Sub-components

- `Stepper` - Root container with context provider
- `StepperList` - Container for step items
- `StepperItem` - Individual step with Radix Collapsible support
- `StepperTrigger` - Clickable step header
- `StepperIndicator` - Visual indicator (number/icon/check)
- `StepperLabel` - Step title and description
- `StepperConnector` - Custom connector with variants
- `StepperContent` - Inline collapsible or external content

## Dependencies

- `@radix-ui/react-collapsible` - Collapsible content for vertical orientation
- `@radix-ui/react-slot` - Slot pattern for custom trigger elements
- `class-variance-authority` - Variant management
- `lucide-react` - Icons (Check, AlertCircle, ChevronRight)

## Key Features

### 1. Vertical Orientation

Vertical layout with inline collapsible content powered by Radix Collapsible primitive.

```tsx
<Stepper orientation="vertical">
  <StepperList>
    <StepperItem value="step1">
      <StepperTrigger>
        <StepperIndicator />
        <StepperLabel>Step 1</StepperLabel>
      </StepperTrigger>
      <StepperContent>
        Inline content appears here
      </StepperContent>
    </StepperItem>
  </StepperList>
</Stepper>
```

### 2. Non-Linear Navigation

Allow users to navigate to any step regardless of order.

```tsx
<Stepper nonLinear>
  {/* Users can click any step */}
</Stepper>
```

### 3. Async Validation

Validate steps before allowing navigation.

```tsx
const handleValidate = async (step: number) => {
  const isValid = await validateStepData(step);
  return isValid;
};

<Stepper onStepValidate={handleValidate}>
  {/* Steps */}
</Stepper>
```

### 4. Custom Connectors

Three built-in connector variants:
- `solid` - Solid line (default)
- `dashed` - Dashed line
- `gradient` - Gradient effect

```tsx
<StepperConnector variant="dashed" />
```

### 5. Branching Flows

Conditionally render steps based on user choices.

```tsx
const [accountType, setAccountType] = useState<"personal" | "business">(null);

<Stepper orientation="vertical" nonLinear>
  <StepperItem value="choose-type">
    {/* User selects accountType */}
  </StepperItem>
  
  {accountType === "personal" && (
    <StepperItem value="personal-details">
      {/* Personal form */}
    </StepperItem>
  )}
  
  {accountType === "business" && (
    <StepperItem value="business-details">
      {/* Business form */}
    </StepperItem>
  )}
</Stepper>
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
# Stepper

## Title
Stepper

## Props
- `Stepper`: root container with controlled or uncontrolled `activeStep`, `linear` and `nonLinear` navigation rules, `orientation`, `variant`, `size`, `alternativeLabel`, optional `connector`, and async `onStepValidate` support.
- `StepperList`: flex wrapper for the registered step items.
- `StepperItem`: requires a stable `value`; also accepts `disabled`, `optional`, `completed`, and `error` flags that feed the shared context.
- `StepperTrigger`: step activation control with optional `asChild`; reads active, completed, disabled, and error state from context.
- `StepperIndicator`: visual indicator for number, circle, or completion and error icons; inherits step state and supports size and variant styling.
- `StepperLabel`: title and optional description wrapper for each step label.
- `StepperConnector`: connector line between steps with built-in `solid`, `dashed`, and `gradient` variants.
- `StepperContent`: step body area; in vertical mode it renders through Radix Collapsible and supports `forceMount`.
- `useStepperNavigation` and `useStepperContext`: helper hooks for advanced orchestration.

## Dependencies
- `@radix-ui/react-collapsible` for vertical inline content.
- `@radix-ui/react-slot` for `asChild` trigger composition.
- `class-variance-authority` for root, item, trigger, indicator, label, connector, and content variants.
- `lucide-react` for `Check`, `Circle`, `AlertCircle`, and `ChevronRight` icons.
- `src/lib/utils.ts` for `cn()` class merging.

## Styling Decisions
- The public package exports the canonical `Stepper` and related `Stepper*` names from `src/index.ts`. Prefer those names in docs and examples.
- Horizontal and vertical layouts share the same registration and state model. Vertical mode uses collapsible content and indented connectors; horizontal mode keeps content separate and focuses on label alignment.
- Indicator, connector, and label variants are split into separate CVA definitions so consumers can swap size or visual emphasis without rewriting the whole stepper shell.
- Motion relies on the same accordion and standard easing tokens used elsewhere in the library so expansion, activation, and connector transitions stay consistent with dialogs and accordions.

## Maintenance Notes
- Step registration is order-based. Dynamic insertion or removal can change indexes, so consumer code should key steps by a stable `value` and avoid reshuffling mounted items unless that behavior is intentional.
- `onStepValidate` runs before navigation and may be async. Rapid repeated clicks can produce overlapping validations, so loading guards or debouncing belong in the consuming flow if the validation is expensive.
- `StepperItem` state is inferred from context unless explicitly overridden through item props. If completion logic changes, update both the item registration data and the helper predicates in the root context.
- If you add new connector or indicator variants, update both the CVA exports and the root package aliases in `src/index.ts` so the public `stepper*Variants` surface remains complete.
2. **Dynamic Step Insertion**: Steps must be registered on mount; dynamic insertion may cause re-indexing issues

3. **Async Race Conditions**: Multiple rapid clicks during validation may cause state conflicts - consider debouncing


