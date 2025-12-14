# Button Components

A comprehensive button system following Material Design 3 patterns with M3 motion, shape morphing, and consistent styling.

## Components

### Button
Standard button with multiple styles, sizes, and shapes.

### IconButton  
Dedicated icon-only button with width variants.

### ToggleButton
Button with pressed/selected state and shape morphing.

### ToggleIconButton
Icon button with toggle state and optional pressed icon.

### SplitButton
Button with primary action and dropdown trigger.

### ButtonGroup
Standard container for grouped buttons with configurable gap.

### ConnectedButtonGroup
Segmented buttons with merged borders and single/multi-select.

## Installation

```bash
npm install @aidan/ui
```

## Usage

### Button

```tsx
import { Button } from '@aidan/ui';

// Standard button
<Button>Click me</Button>

// Filled button
<Button colorStyle="filled">Filled Button</Button>

// Outlined button
<Button colorStyle="outlined">Outlined Button</Button>

// Icon button
<Button iconOnly>
  <HeartIcon />
</Button>
```

### IconButton

```tsx
import { IconButton } from '@aidan/ui';

<IconButton aria-label="Favorite">
  <HeartIcon />
</IconButton>
```

### ToggleButton

```tsx
import { ToggleButton } from '@aidan/ui';

<ToggleButton pressed={isSelected} onPressedChange={setSelected}>
  Toggle
</ToggleButton>
```

### ToggleIconButton

```tsx
import { ToggleIconButton } from '@aidan/ui';

<ToggleIconButton 
  icon={<BookmarkIcon />} 
  pressedIcon={<BookmarkFilledIcon />}
  aria-label="Bookmark"
  pressed={isBookmarked}
  onPressedChange={setBookmarked}
/>
```

### SplitButton

```tsx
import { SplitButton } from '@aidan/ui';

<SplitButton
  onAction={() => console.log("Primary action")}
  onDropdownClick={() => console.log("Dropdown clicked")}
>
  Save
</SplitButton>
```

### ButtonGroup

```tsx
import { ButtonGroup, Button } from '@aidan/ui';

<ButtonGroup>
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</ButtonGroup>
```

### ConnectedButtonGroup

```tsx
import { ConnectedButtonGroup, ConnectedButtonGroupItem } from '@aidan/ui';

<ConnectedButtonGroup value={selectedValue} onValueChange={setSelectedValue}>
  <ConnectedButtonGroupItem value="first">First</ConnectedButtonGroupItem>
  <ConnectedButtonGroupItem value="second">Second</ConnectedButtonGroupItem>
  <ConnectedButtonGroupItem value="third">Third</ConnectedButtonGroupItem>
</ConnectedButtonGroup>
```

## Props

### Button Props

```typescript
interface ButtonProps {
  colorStyle?: 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text' | 'destructive' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // 28px | 32px | 36px | 44px | 52px
  shape?: 'round' | 'rect' | 'square';
  iconOnly?: boolean;       // Makes button square for icon-only use
  asChild?: boolean;        // Render as child element (for links)
  loading?: boolean;        // When true, the button is disabled and shows a loading spinner
  loadingText?: string;     // Text to show when loading (replaces children)
}
```

### IconButton Props

```typescript
interface IconButtonProps {
  colorStyle?: 'filled' | 'tonal' | 'outlined' | 'standard';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  width?: 'narrow' | 'default' | 'wide';
  shape?: 'round' | 'rect' | 'square';
  'aria-label': string;     // Required for accessibility
  loading?: boolean;        // When true, the button is disabled and shows a loading spinner
}
```

### ToggleButton Props

```typescript
interface ToggleButtonProps {
  colorStyle?: 'filled' | 'tonal' | 'outlined';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'round' | 'rect';  // Morphs between states
  pressed?: boolean;         // Controlled state
  defaultPressed?: boolean;  // Uncontrolled default
  onPressedChange?: (pressed: boolean) => void;
}
```

### ToggleIconButton Props

```typescript
interface ToggleIconButtonProps {
  icon: React.ReactNode;           // Icon when not pressed
  pressedIcon?: React.ReactNode;   // Icon when pressed (optional)
  colorStyle?: 'filled' | 'tonal' | 'outlined' | 'standard';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'round' | 'rect';
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  'aria-label': string;
}
```

### SplitButton Props

```typescript
interface SplitButtonProps {
  colorStyle?: 'elevated' | 'filled' | 'tonal' | 'outlined';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;         // Content for the main action button
  onAction?: () => void;             // Primary action click
  onDropdownClick?: () => void;      // Dropdown trigger click
  dropdownOpen?: boolean;            // Controls chevron rotation and trigger shape
  dropdownIcon?: React.ReactNode;    // Custom dropdown icon
  actionDisabled?: boolean;
  dropdownDisabled?: boolean;
  dropdownLabel?: string;            // Accessibility label
  className?: string;                // Additional class names
}
```

### ButtonGroup Props

```typescript
interface ButtonGroupProps {
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}
```

### ConnectedButtonGroup Props

```typescript
interface ConnectedButtonGroupProps {
  colorStyle?: 'filled' | 'tonal' | 'outlined';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  selectionMode?: 'single' | 'multiple';
  value?: string | string[];         // Controlled selection
  defaultValue?: string | string[];  // Uncontrolled default
  onValueChange?: (value: string | string[]) => void;
}

interface ConnectedButtonGroupItemProps {
  value: string;  // Selection value
}
```

## Styling Decisions

### Color Styles
| Style | Container | Text | Use Case |
|-------|-----------|------|----------|
| `filled` | Primary | On Primary | Primary actions |
| `tonal` | Secondary | On Secondary | Secondary actions |
| `elevated` | Surface + shadow | Primary | Lifted appearance |
| `outlined` | Transparent + border | Foreground | Tertiary actions |
| `text` | Transparent | Primary | Low-emphasis |
| `destructive` | Destructive | On Destructive | Dangerous actions |
| `ghost` | Transparent | Foreground | Minimal UI |
| `link` | Transparent | Primary + underline | Navigation |

### Sizes
| Size | Height | Font | Icon | Use Case |
|------|--------|------|------|----------|
| `xs` | 28px | text-xs | 14px | Compact UI |
| `sm` | 32px | text-sm | 16px | Secondary |
| `md` | 36px | text-sm | 16px | Default |
| `lg` | 44px | text-base | 20px | Emphasized |
| `xl` | 52px | text-lg | 24px | Hero buttons |

### Shape Variants
- `round`: Fully rounded (pill shape), morphs to less round on active
- `rect`: Standard rounded corners, scales with size
- `square`: Less rounded, more angular appearance

### M3 Motion
- **Duration**: 200ms standard
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)`
- **Scale**: 98% on active (2% shrink)
- **Shape morph**: Toggle buttons change shape between pressed states

### Toggle Shape Morphing
| Shape | Unpressed | Pressed |
|-------|-----------|---------|
| `round` | `rounded-full` | `rounded-lg` |
| `rect` | `rounded-md` | `rounded-lg` |

## Accessibility

- `Button` with `iconOnly` should have `aria-label`
- `IconButton` requires `aria-label` prop
- `ToggleButton` uses `aria-pressed` automatically
- `SplitButton` dropdown has `aria-expanded` and `aria-haspopup`
- `ConnectedButtonGroup` items have `aria-pressed`

## Dependencies

- `@radix-ui/react-slot` - Polymorphic component (Button only)
- `class-variance-authority` - Variant management
- `lucide-react` - Icons (SplitButton chevron, stories)
- `@aidan/ui/lib/utils` - `cn()` utility

## License

MIT © Aidan