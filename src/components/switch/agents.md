# Switch Component
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A switch component that follows Material Design 3 patterns with optional icon support in the handle.

## Props

```typescript
interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  uncheckedIcon?: React.ReactNode;  // Icon to display when switch is unchecked
  checkedIcon?: React.ReactNode;    // Icon to display when switch is checked
  size?: "sm" | "md" | "lg";        // Size variant (default: "md")
  className?: string;               // Additional class names for track
  thumbClassName?: string;          // Additional class names for thumb
}
```

## Dependencies

- `@radix-ui/react-switch` - Core switch primitive for accessibility
- `class-variance-authority` - Variant management
- `../../lib/utils` - `cn()` utility for class merging

## Styling Decisions

### Size Variants (MD3 Spec)

| Size | Track (H × W) | Handle (unchecked) | Handle (checked) | State Layer |
|------|---------------|--------------------|--------------------|-------------|
| sm   | 24px × 40px   | 14px               | 18px               | 36px        |
| md   | 32px × 52px   | 16px               | 24px               | 40px        |
| lg   | 40px × 64px   | 20px               | 28px               | 48px        |

**Note:** When icons are provided, the thumb always uses the checked (larger) size in both states for visual consistency.

### Color System

**Track:**
- Unchecked: `--surface-container-high` with `muted-foreground/50` border
- Checked: `--primary` background and border

**Thumb:**
- Unchecked: `muted-foreground/70` (matches outline)
- Checked: `--primary-foreground` (white on primary)

**State Layer (Hover/Focus/Active):**
- Unchecked: `foreground/8%` hover, `foreground/10%` focus/active
- Checked: `primary/8%` hover, `primary/10%` focus/active

**Disabled:**
- 38% opacity (MD3 spec)
- `cursor-not-allowed`

### Motion & Animation

- **Duration**: 200ms standard (`--motion-duration-medium`)
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` (`--motion-easing-standard`)
- **Handle Movement**: Smooth translation with size transition
- **Ripple Effect**: 400ms expand animation (reusing checkbox animation)
- **Icon Transition**: 100ms opacity fade (`--motion-duration-short`)

### Icons

- Size: 12px (sm), 16px (md), 20px (lg)
- Position: Centered in handle
- Transition: Opacity fade when state changes
- Color: Inherit from parent (use `text-primary` for checked, `text-background` for unchecked)

## Maintenance Notes

### Accessibility

- Full keyboard navigation support (Space/Enter to toggle)
- Proper ARIA attributes via Radix UI `@radix-ui/react-switch`
- 40dp minimum touch target (state layer)
- Focus ring visible on keyboard focus (`ring-[3px] ring-ring/50`)
- Screen reader announces state changes automatically

### Edge Cases

- Icons are optional - component works without them
- When icons are provided, thumb maintains larger size in both states
- Ripple effect is triggered on mouse down for natural interaction
- Disabled state prevents all interactions and ripple effects
- State layer follows thumb position as it moves
- Supports both controlled and uncontrolled modes

### Performance

- Uses `React.forwardRef` for ref forwarding
- Only renders icon containers when icons are provided
- CSS animations instead of JavaScript for better performance
- Class merging with `cn()` for efficient class application
- Internal state tracking for uncontrolled component mode

### Known Limitations

- Icons must be sized appropriately (use the size from `switchIconVariants`)
- Ripple effect reuses checkbox animation keyframes
- No custom color variants beyond MD3 theme system
- State layer positioning is calculated based on size variant

## Usage Examples

```tsx
// Basic usage
<Switch />

// With icons (recommended pattern)
<Switch
  checkedIcon={<Check className="text-primary" />}
  uncheckedIcon={<X className="text-background" />}
/>

// Controlled
const [checked, setChecked] = useState(false);
<Switch checked={checked} onCheckedChange={setChecked} />

// Different sizes
<Switch size="sm" />
<Switch size="md" />
<Switch size="lg" />

// In a form/settings context
<div className="flex items-center justify-between">
  <label htmlFor="notifications">Notifications</label>
  <Switch id="notifications" />
</div>
```


