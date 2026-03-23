# Stepper - Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview
Multi-step workflow component for guiding users through sequential processes like forms, wizards, and onboarding flows.

## Props Summary

### Stepper (Root)
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
| `value` | `string` | required | Unique step identifier |
| `disabled` | `boolean` | `false` | Disable this step |
| `optional` | `boolean` | `false` | Mark as optional |
| `completed` | `boolean` | - | Override completion state |
| `error` | `boolean` | `false` | Show error state |

### StepperTrigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Use Slot pattern |

### StepperIndicator
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Custom icon/content |

### StepperLabel
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `description` | `ReactNode` | - | Optional subtitle |

### StepperContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Matches StepperItem value |
| `forceMount` | `boolean` | `false` | Keep mounted when inactive |

## Dependencies
- `@radix-ui/react-slot` - For asChild pattern
- `class-variance-authority` - For CVA variants
- `lucide-react` - Icons (Check, AlertCircle)

## Styling Decisions

### Variant System
- **default**: Filled circles with primary color for active/completed
- **outlined**: Border-only circles, fills on completion
- **simple**: Minimal, text-based indicators

### Size System
- **sm**: 24px indicators, xs text
- **md**: 32px indicators, sm text
- **lg**: 40px indicators, base text

### State Colors
- Active: Primary color
- Completed: Primary color with check icon
- Error: Destructive color with AlertCircle icon
- Disabled: 50% opacity

### Animation
- Uses CSS variables for consistent motion:
  - `--motion-duration-medium` (200ms)
  - `--motion-easing-standard`

## Architecture

### Context System
Two nested contexts:
1. **StepperContext**: Root-level state (activeStep, navigation logic)
2. **StepperItemContext**: Per-item state (value, index, status flags)

### Component Hierarchy
```
Stepper (Provider)
├── StepperList (Container)
│   ├── StepperItem (Provider)
│   │   └── StepperTrigger
│   │       ├── StepperIndicator
│   │       └── StepperLabel
│   └── StepperSeparator
├── StepperContent (multiple)
└── StepperNavigation (optional)
```

### Navigation Hook
`useStepperNavigation()` provides:
- `goToNext()`, `goToPrevious()`, `goToStep(n)`
- `canGoNext`, `canGoPrevious`
- `isFirstStep`, `isLastStep`
- `activeStep`, `totalSteps`

## Accessibility

### ARIA Attributes
- `role="tablist"` on StepperList
- `role="tab"` on StepperTrigger
- `role="tabpanel"` on StepperContent
- `aria-selected` for active state
- `aria-disabled` for disabled steps

### Keyboard Navigation
- Tab: Move focus between triggers
- Enter/Space: Activate focused step
- Focus indicators on triggers

## Maintenance Notes

### Known Edge Cases
1. **Dynamic steps**: Adding/removing steps at runtime updates stepOrder correctly
2. **Controlled mode**: When `activeStep` prop changes, internal state syncs
3. **Linear mode**: Forward navigation requires current step completion
4. **Separator completion**: Auto-detects based on previous step state

### Future Considerations (Premium tier)
1. Vertical orientation with inline content
2. Non-linear branching flows
3. Async validation before step change
4. Custom connector components
5. Spring animations for transitions

### Testing Checklist
- [ ] Controlled and uncontrolled modes
- [ ] Linear vs non-linear navigation
- [ ] Step states (active, completed, error, disabled, optional)
- [ ] Keyboard accessibility
- [ ] Screen reader announcements
- [ ] All size/variant combinations


