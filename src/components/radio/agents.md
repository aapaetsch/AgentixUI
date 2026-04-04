# RadioGroup & RadioGroupItem
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

Material Design 3 compliant radio button components with proper state layer ripple effects.

Built on top of Radix UI Radio Group primitive with full accessibility support.

## Features

- **Material Design 3 Compliant**: Follows MD3 specifications exactly
- **State Layer Ripple**: 40dp circular state layer around the 20dp radio button for proper ripple effects
- **Controlled & Uncontrolled**: Supports both controlled and uncontrolled modes
- **Label Support**: Built-in label with configurable positioning (left/right)
- **Orientation Support**: Vertical (default) and horizontal layouts
- **Disabled State**: Proper disabled state handling with 38% opacity
- **Size Variants**: Small (16px), Medium (20px, default), Large (24px)
- **Accessible**: Full keyboard navigation with roving tabindex and ARIA attributes
- **Animations**: Smooth indicator and ripple animations using existing animation utilities

## Props

### RadioGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The controlled value of the selected radio item |
| `defaultValue` | `string` | - | The default value when initially rendered (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Event handler called when the value changes |
| `disabled` | `boolean` | `false` | When true, prevents user interaction with all items |
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | The orientation of the radio group |
| `name` | `string` | - | The name of the group for form submission |
| `required` | `boolean` | `false` | Whether a selection is required |
| `loop` | `boolean` | `true` | Whether keyboard navigation should loop |

### RadioGroupItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | The unique value of the radio item |
| `disabled` | `boolean` | `false` | When true, prevents interaction with this item |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | The size of the radio button |
| `label` | `string` | - | The label text to display next to the radio button |
| `labelPosition` | `"left"` \| `"right"` | `"right"` | The position of the label relative to the radio |

## Examples

### Basic Usage

```tsx
<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
  <RadioGroupItem value="option3" label="Option 3" />
</RadioGroup>
```

### Controlled Component

```tsx
const [value, setValue] = React.useState("option1");

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
</RadioGroup>
```

### Horizontal Orientation

```tsx
<RadioGroup defaultValue="option1" orientation="horizontal">
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
</RadioGroup>
```

### Label Position

```tsx
<RadioGroupItem value="option1" label="Left label" labelPosition="left" />
```

### Size Variants

```tsx
<RadioGroupItem value="option1" label="Small" size="sm" />
<RadioGroupItem value="option2" label="Medium" size="md" />
<RadioGroupItem value="option3" label="Large" size="lg" />
```

### Disabled State

```tsx
// Disable entire group
<RadioGroup defaultValue="option1" disabled>
  <RadioGroupItem value="option1" label="Disabled" />
</RadioGroup>

// Disable individual item
<RadioGroupItem value="option1" label="Disabled" disabled />
```

### Without Label

```tsx
<RadioGroupItem value="option1" />
```

## Dependencies

- `@radix-ui/react-radio-group` - Accessible radio group primitive
- `class-variance-authority` - Variant management

## Styling Decisions

### Material Design 3 Specifications
- **Icon Size**: 20dp (default), with 16dp (sm) and 24dp (lg) variants
- **State Layer Size**: 40dp circular area around radio button for ripple
- **Border Width**: 2dp for outline
- **Target Size**: 48dp minimum touch target (achieved via state layer)

### Colors (MD3 Token Mapping)
- **Unselected Outline**: `on-surface-variant` → `muted-foreground/70`
- **Selected Outline & Indicator**: `primary`
- **Disabled Opacity**: 38%
- **Text Label**: `on-surface` → `foreground`

### State Layer Opacity (MD3 Interaction States)
- **Hover**: 8% opacity
- **Focus**: 10% opacity
- **Pressed**: 10% opacity with ripple animation

### Animations
- **Ripple**: 400ms cubic-bezier(0.4, 0, 0.2, 1) - reuses `animate-checkbox-ripple`
- **Indicator**: 150ms scale animation on state change - reuses `animate-checkbox-check`
- **State Transitions**: Uses MD3 motion tokens (`--motion-duration-medium`, `--motion-easing-standard`)

## Maintenance Notes

- The component uses a two-layer structure: outer state layer (for ripple) and inner radio container
- Label is wrapped in a `<label>` element for proper click-to-toggle behavior
- The ripple effect is triggered on click and animates the full state layer area
- Keyboard navigation uses roving tabindex (Tab moves in/out, Arrow keys navigate within group)
- The RadioGroupItem accesses context to determine if it's selected for proper state layer coloring
- Selected state changes border color to primary and shows the filled indicator circle

### Accessibility

- Full keyboard navigation support:
  - Tab: Moves focus into/out of radio group (focuses selected or first item)
  - Arrow Up/Down: Moves focus and selects previous/next item
  - Arrow Left/Right: Same as Up/Down
  - Space: Selects focused item (if not already selected)
- Proper ARIA roles and states via Radix UI primitives
- Screen reader announces selection changes automatically
- 40dp minimum touch target for mobile accessibility

### Edge Cases

- Items work without labels - just render the radio button
- Disabled items are skipped in keyboard navigation
- Loop navigation by default (last item → first item)
- Selected item receives focus when tabbing into group
- Orientation affects layout but not keyboard navigation behavior


