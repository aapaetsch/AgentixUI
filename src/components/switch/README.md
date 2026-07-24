# Switch Component

A switch component that follows Material Design 3 patterns with optional icon support in the handle.

## Installation

```bash
npm install aapaetsch-ui-kit
```

## Usage

```tsx
import { Switch } from 'aapaetsch-ui-kit';

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

## Styling

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
- **Easing**: `cubic-bezier(0.2, 0, 0.1)` (`--motion-easing-standard`)
- **Handle Movement**: Smooth translation with size transition
- **Ripple Effect**: 400ms expand animation (reusing checkbox animation)
- **Icon Transition**: 100ms opacity fade (`--motion-duration-short`)

### Icons

- Size: 12px (sm), 16px (md), 20px (lg)
- Position: Centered in handle
- Transition: Opacity fade when state changes
- Color: Inherit from parent (use `text-primary` for checked, `text-background` for unchecked)

## Accessibility

- Full keyboard navigation support (Space/Enter to toggle)
- Proper ARIA attributes via Radix UI `@radix-ui/react-switch`
- 40dp minimum touch target (state layer)
- Focus ring visible on keyboard focus (`ring-[3px] ring-ring/50`)
- Screen reader announces state changes automatically

## Dependencies

- `@radix-ui/react-switch` - Core switch primitive for accessibility
- `class-variance-authority` - Variant management
- `aapaetsch-ui-kit/lib/utils` - `cn()` utility for class merging

## License

MIT © Aidan