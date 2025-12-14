# FAB (Floating Action Button) - Premium Component

Floating Action Buttons for primary screen actions following Material Design 3 specifications.

> ⭐ This is a Premium component available in the @aidan/ui Premium package.

## Installation

```bash
npm install @aidan/ui
```

## Usage

### FAB

```tsx
import { FAB } from '@aidan/ui';

// Basic FAB
<FAB icon={<PlusIcon />} label="Add item" />

// Large FAB
<FAB icon={<EditIcon />} size="lg" label="Edit" />

// Positioned FAB
<FAB 
  icon={<SettingsIcon />} 
  label="Settings" 
  position="bottom-right" 
/>
```

### ExtendedFAB

```tsx
import { ExtendedFAB } from '@aidan/ui';

// Extended FAB with label
<ExtendedFAB icon={<PlusIcon />} label="Create new" />

// Extended FAB with collapse on mobile
<ExtendedFAB 
  icon={<CreateIcon />} 
  label="Create new document" 
  collapseOnMobile 
/>
```

### FABMenu

```tsx
import { FABMenu } from '@aidan/ui';

const menuItems = [
  { id: "1", icon: <FileIcon />, label: "New file", onClick: () => console.log("New file") },
  { id: "2", icon: <FolderIcon />, label: "New folder", onClick: () => console.log("New folder") },
  { id: "3", icon: <UploadIcon />, label: "Upload", onClick: () => console.log("Upload") }
];

<FABMenu 
  icon={<PlusIcon />} 
  items={menuItems} 
  label="Create new" 
/>
```

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

## Styling

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

## Accessibility

- FABMenu trigger has `aria-expanded` and `aria-haspopup="menu"`
- Menu container has `role="menu"` with proper orientation
- Items have `role="menuitem"`
- Escape key closes menu and returns focus to trigger
- Click outside closes menu

## Dependencies

- `class-variance-authority` - Variant management
- `lucide-react` - Icons (used in stories)
- `@aidan/ui/lib/utils` - `cn()` utility

## License

MIT © Aidan