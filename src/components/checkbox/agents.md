# Checkbox
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A Material Design 3 compliant checkbox component with proper state layer ripple effects.

Built on top of Radix UI Checkbox primitive with full accessibility support.

## Features

- **Material Design 3 Compliant**: Follows MD3 specifications exactly
- **State Layer Ripple**: 40dp circular state layer around the 18dp checkbox for proper ripple effects
- **Controlled & Uncontrolled**: Supports both controlled and uncontrolled modes
- **Indeterminate State**: Can display indeterminate state with minus icon
- **Label Support**: Built-in label with configurable positioning (left/right)
- **Error State**: Visual error state with appropriate MD3 error colors
- **Disabled State**: Proper disabled state handling with 38% opacity
- **Size Variants**: Small (16px), Medium (18px, default), Large (24px)
- **Accessible**: Fully accessible with keyboard navigation and ARIA attributes
- **Animations**: Smooth check icon and ripple animations

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` \| `"indeterminate"` | - | The controlled checked state of the checkbox |
| `defaultChecked` | `boolean` \| `"indeterminate"` | - | The default checked state when initially rendered |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | - | Event handler called when the checked state changes |
| `disabled` | `boolean` | - | When true, prevents user interaction with the checkbox |
| `error` | `boolean` | `false` | If true, displays the checkbox in an error state |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | The size of the checkbox |
| `label` | `string` | - | The label text to display next to the checkbox |
| `labelPosition` | `"left"` \| `"right"` | `"right"` | The position of the label relative to the checkbox |
| `className` | `string` | - | Additional class names to apply to the container element |

## Examples

### Basic Usage

```tsx
<Checkbox label="Accept terms and conditions" />
```

### Controlled Component

```tsx
const [checked, setChecked] = React.useState(false);

<Checkbox 
  label="Subscribe to newsletter" 
  checked={checked} 
  onCheckedChange={setChecked} 
/>
```

### Indeterminate State

```tsx
<Checkbox 
  label="Select all" 
  checked="indeterminate" 
/>
```

### Error State

```tsx
<Checkbox 
  label="This field is required" 
  error 
/>
```

### Label Position

```tsx
<Checkbox 
  label="Left label" 
  labelPosition="left" 
/>
```

### Size Variants

```tsx
<Checkbox label="Small" size="sm" />
<Checkbox label="Medium" size="md" />
<Checkbox label="Large" size="lg" />
```

### Disabled State

```tsx
<Checkbox 
  label="Disabled checkbox" 
  disabled 
/>
```

### Without Label

```tsx
<Checkbox defaultChecked />
```

## Dependencies

- `@radix-ui/react-checkbox` - Accessible checkbox primitive
- `class-variance-authority` - Variant management
- `lucide-react` - Check and Minus icons

## Styling Decisions

### Material Design 3 Specifications
- **Container Size**: 18dp (default), with 16dp (sm) and 24dp (lg) variants
- **Container Corner Shape**: 2dp (rounded-sm)
- **State Layer Size**: 40dp circular area around checkbox for ripple
- **Border Width**: 2dp for unselected, 0dp for selected
- **Target Size**: 48dp minimum touch target

### Colors (MD3 Token Mapping)
- **Unselected Outline**: `on-surface-variant` → `muted-foreground/70`
- **Selected Container**: `primary`
- **Selected Icon**: `on-primary` → `primary-foreground`
- **Error Outline/Container**: `error` → `destructive`
- **Disabled Opacity**: 38%

### State Layer Opacity (MD3 Interaction States)
- **Hover**: 8% opacity
- **Focus**: 12% opacity  
- **Pressed**: 12% opacity with ripple animation

### Animations
- **Ripple**: 400ms cubic-bezier(0.4, 0, 0.2, 1) - expands from center
- **Check Icon**: 150ms scale animation on state change
- **State Transitions**: Uses MD3 motion tokens

## Maintenance Notes

- The component uses a two-layer structure: outer state layer (for ripple) and inner checkbox container
- Label is wrapped in a `<label>` element for proper click-to-toggle behavior
- The ripple effect is triggered on click and animates the full state layer area
- Error state changes both border color (unselected) and background color (selected)
- Indeterminate state uses the Minus icon from lucide-react


