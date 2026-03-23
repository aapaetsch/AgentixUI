# FAB (Floating Action Button)
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

Floating Action Buttons for primary screen actions following Material Design 3 specifications.

## Components

### FAB
Icon-only floating action button in 3 sizes.

### ExtendedFAB
FAB with icon and text label for clearer actions.

### FABMenu
Expandable FAB that reveals 2-6 action items.

## Props

### FAB Props
```typescript
interface FABProps {
  icon: React.ReactNode;           // Required icon element
  label?: string;                  // Accessibility label (aria-label)
  colorStyle?: 'filled' | 'tonal' | 'elevated' | 'outlined' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';       // 40px | 56px | 96px
  shape?: 'round' | 'pill' | 'rect';
  position?: 'none' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  positionStyle?: React.CSSProperties;  // Custom positioning overrides
}
```

### ExtendedFAB Props
```typescript
interface ExtendedFABProps {
  icon: React.ReactNode;           // Required icon element
  label: string;                   // Required text label
  colorStyle?: 'filled' | 'tonal' | 'elevated' | 'outlined' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';       // 48px | 56px | 72px height
  shape?: 'round' | 'pill' | 'rect';
  position?: 'none' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  positionStyle?: React.CSSProperties;
  collapseOnMobile?: boolean;      // Hide label on sm breakpoint
}
```

### FABMenu Props
```typescript
interface FABMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface FABMenuProps {
  icon: React.ReactNode;           // Trigger icon
  openIcon?: React.ReactNode;      // Icon when open (optional)
  items: FABMenuItem[];            // 2-6 menu items recommended
  direction?: 'up' | 'down' | 'left' | 'right';
  open?: boolean;                  // Controlled state
  onOpenChange?: (open: boolean) => void;
  label?: string;                  // Accessibility label
  itemColorStyle?: 'filled' | 'tonal' | 'elevated' | 'tertiary';
  // Inherits FAB props: colorStyle, size, shape, position
}
```

## Dependencies
- `class-variance-authority` - Variant management
- `lucide-react` - Icons (used in stories)
- `../../lib/utils` - `cn()` utility

## Styling Decisions

### Color Styles
| Style | Container | Icon/Text | Use Case |
|-------|-----------|-----------|----------|
| `filled` | Primary | On Primary | Default, highest emphasis |
| `tonal` | Secondary | On Secondary | Medium emphasis |
| `elevated` | Surface container | Primary | Lifted appearance |
| `outlined` | Transparent + border | Foreground | Low emphasis |
| `tertiary` | Tertiary | On Tertiary | Accent/brand color |

### Sizes (FAB)
| Size | Dimensions | Icon Size | Use Case |
|------|------------|-----------|----------|
| `sm` | 40×40px | 20px | Secondary actions |
| `md` | 56×56px | 24px | Primary actions (default) |
| `lg` | 96×96px | 36px | High emphasis primary |

### Sizes (ExtendedFAB)
| Size | Height | Icon Size | Font |
|------|--------|-----------|------|
| `sm` | 48px | 20px | text-sm |
| `md` | 56px | 24px | text-base |
| `lg` | 72px | 28px | text-lg |

### Shape Variants
- `round`/`pill`: Fully rounded corners (circular for square FABs)
- `rect`: Rounded corners that scale with size (12px/16px/28px)

### M3 Motion
- **Duration**: 200ms standard, 300ms emphasized
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` standard
- **Shape morph**: Round → more square on press
- **Scale**: 95% on active state
- **Staggered**: Menu items animate with 50ms delay each

### Elevation Shadows
- Level 2: Resting state (tonal)
- Level 3: Resting state (filled, elevated, tertiary)
- Level 4: Hover state
- Level 2: Pressed state

## Maintenance Notes

### Positioning
- Use `position` prop for quick fixed positioning
- Use `positionStyle` for custom offsets when `position !== 'none'`
- In Storybook, use container positioning instead of fixed for demos

### FABMenu Accessibility
- Trigger has `aria-expanded` and `aria-haspopup="menu"`
- Menu container has `role="menu"` with proper orientation
- Items have `role="menuitem"`
- Escape key closes menu and returns focus to trigger
- Click outside closes menu

### Edge Cases
- FABMenu supports controlled and uncontrolled modes
- ExtendedFAB `collapseOnMobile` hides label below `sm` breakpoint
- Icon-only FABs should always have `label` prop for accessibility
- Menu items: 2-6 recommended, more may cause layout issues

### CSS Variables Used
```css
--elevation-1 through --elevation-5
--motion-duration-short/medium/long
--motion-easing-standard/emphasized
--radius-md/lg/xl/full
--tertiary, --tertiary-foreground
--surface-container-low, --surface-container
```


