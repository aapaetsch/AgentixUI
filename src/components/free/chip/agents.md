# Chip Components

A Material Design 3 compliant chip component system with four chip types: assist, filter, input, and suggestion.

## Components

### Chip
Main chip component supporting all four MD3 chip types with optional icons and interactive states.

### ChipGroup
Container component for organizing multiple chips with proper spacing and optional wrapping.

## Props

### Chip Props
```typescript
interface ChipProps {
  variant?: 'assist' | 'filter' | 'input' | 'suggestion';
  size?: 'sm' | 'md' | 'lg';
  elevated?: boolean;              // Shadow elevation (assist/suggestion only)
  asChild?: boolean;               // Polymorphic component support
  leadingIcon?: React.ReactNode;   // Icon before label
  trailingIcon?: React.ReactNode;  // Icon after label
  selected?: boolean;              // Selection state (filter/input)
  onSelectedChange?: (selected: boolean) => void;  // Selection callback
  dismissible?: boolean;           // Show dismiss button (input only)
  onDismiss?: () => void;          // Dismiss callback
  dismissLabel?: string;           // Aria label for dismiss button
  showCheckmark?: boolean;         // Show checkmark when selected (filter)
}
```

### ChipGroup Props
```typescript
interface ChipGroupProps {
  spacing?: 'sm' | 'md' | 'lg';    // Gap between chips
  wrap?: boolean;                   // Allow wrapping to next line
}
```

## Dependencies
- `@radix-ui/react-slot` - Polymorphic component (asChild prop)
- `class-variance-authority` - Variant management
- `lucide-react` - X and Check icons
- `../../lib/utils` - `cn()` utility

## Styling Decisions

### Variants
| Variant | Container | Text | Use Case |
|---------|-----------|------|----------|
| `assist` | Outlined/Elevated | On Surface | Actions, triggers |
| `filter` | Outlined → Filled | On Surface/Secondary | Toggleable filters |
| `input` | Outlined | On Surface Variant | Tags, recipients |
| `suggestion` | Outlined/Elevated | On Surface Variant | Prompts, suggestions |

### Sizes (Custom, MD3 specifies only 32dp)
| Size | Height | Icon Size | Use Case |
|------|--------|-----------|----------|
| `sm` | 28px | 16px | Compact layouts |
| `md` | 32px | 18px | Default, MD3 compliant |
| `lg` | 36px | 20px | Touch-friendly, emphasis |

### MD3 Features Implemented

1. **Four Chip Types**
   - Assist: Help users enter information or trigger actions
   - Filter: Toggleable chips for filtering content
   - Input: Represent discrete information (dismissible)
   - Suggestion: Suggest actions or options

2. **Selection States**
   - Filter chips toggle between selected/unselected
   - Selected state shows checkmark icon
   - Background changes to secondary-container when selected

3. **Dismissible Input Chips**
   - X button appears on right side
   - Keyboard accessible (Enter/Space to dismiss)
   - Proper focus management

4. **Icon Support**
   - Leading icons (left side)
   - Trailing icons (right side)
   - Both icons simultaneously
   - Proper spacing per MD3 (8dp between elements)

5. **Elevated Variant**
   - Optional shadow for assist and suggestion chips
   - Subtle elevation on hover

6. **Interaction States**
   - Hover: 8% surface overlay
   - Active/Pressed: 12% surface overlay
   - Focus: Visible ring indicator
   - Disabled: Reduced opacity

### CSS Variables Used
- `--motion-duration-medium` - Transition timing
- `--motion-easing-standard` - Easing function

## Maintenance Notes

### Accessibility
- Uses native button element with proper role
- Filter chips use role="checkbox" with aria-checked
- Dismiss buttons have aria-label
- Full keyboard navigation support
- Focus visible states for all interactive elements

### Keyboard Navigation
- Tab: Navigate between chips
- Enter/Space: Activate chip (toggle filter, click assist/suggestion)
- Enter/Space on dismiss: Remove input chip

### Edge Cases
- Empty children renders as empty chip
- Elevated prop ignored for filter/input chips
- Dismiss button replaces trailing icon for input chips
- Checkmark replaces leading icon when filter is selected (both shown if leadingIcon provided)

### Performance
- Uses React.forwardRef for ref forwarding
- Callbacks memoized with useCallback
- Minimal re-renders through controlled/uncontrolled pattern
