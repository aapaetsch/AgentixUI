# Accordion Components
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A comprehensive accordion system built on Radix UI primitives, featuring custom easing presets and Material Design 3 motion patterns.

## Components

### Accordion
Root container that manages expansion state (single or multiple).

### AccordionItem
Individual accordion section wrapper.

### AccordionTrigger
Clickable header that toggles content visibility with chevron indicator.

### AccordionContent
Collapsible content area with smooth expand/collapse animations.

## Related Components
- **AnimatedChevron** - For a morphing chevron animation (in `src/components/AnimatedChevron`)

## Props

### Accordion Props
```typescript
interface AccordionProps {
  type: 'single' | 'multiple';    // Single or multiple items open
  collapsible?: boolean;          // Allow closing all (single mode)
  value?: string | string[];      // Controlled state
  defaultValue?: string | string[]; // Uncontrolled default
  onValueChange?: (value: string | string[]) => void;
  variant?: 'default' | 'bordered' | 'separated';
  className?: string;
}
```

### AccordionItem Props
```typescript
interface AccordionItemProps {
  value: string;                  // Unique identifier
  variant?: 'default' | 'bordered' | 'separated';
  disabled?: boolean;
  className?: string;
}
```

### AccordionTrigger Props
```typescript
interface AccordionTriggerProps {
  size?: 'sm' | 'md' | 'lg';     // Trigger size
  icon?: React.ReactNode;        // Custom icon (rotates 180°)
  hideChevron?: boolean;         // Hide indicator completely
  chevronAnimation?: 'smooth' | 'bounce' | 'sharp'; // Animation preset
  chevronSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Icon size
  className?: string;
}
```

### AccordionContent Props
```typescript
interface AccordionContentProps {
  size?: 'sm' | 'md' | 'lg';     // Content text size
  className?: string;
}
```

## Dependencies
- `@radix-ui/react-accordion` - Accessible accordion primitives
- `class-variance-authority` - Variant management
- `lucide-react` - Fallback ChevronDown icon
- `../../lib/utils` - `cn()` utility

## Styling Decisions

### Variants
| Variant | Container | Items | Use Case |
|---------|-----------|-------|----------|
| `default` | No container | Bottom border | Standard lists |
| `bordered` | Rounded border | Dividers + padding | Contained sections |
| `separated` | Spacing | Individual borders | Card-like items |

### Sizes
| Size | Trigger Padding | Font Size | Use Case |
|------|-----------------|-----------|----------|
| `sm` | py-3 | text-sm | Compact/dense UI |
| `md` | py-4 | text-sm | Default |
| `lg` | py-5 | text-base | Prominent sections |

### Chevron Sizes (matches button icons)
| Size | Dimension | Use Case |
|------|-----------|----------|
| `xs` | 14px (3.5) | Compact UI |
| `sm` | 16px (4) | Secondary |
| `md` | 16px (4) | Default |
| `lg` | 20px (5) | Emphasized |
| `xl` | 24px (6) | Large triggers |

### Animation Presets
| Preset | Duration | Easing | Feel |
|--------|----------|--------|------|
| `smooth` | 200ms | `cubic-bezier(0, 0, 0, 1)` | Gentle deceleration (MD3) |
| `bounce` | 300ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot |
| `sharp` | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Quick and snappy |

### Content Animation
Uses existing Tailwind accordion animations:
- `animate-accordion-down`: Expand from 0 to full height
- `animate-accordion-up`: Collapse from full height to 0
- Duration: 200ms with ease-out

## Maintenance Notes

### Accessibility
- Built on Radix UI accordion primitives (WAI-ARIA compliant)
- Proper `aria-expanded` state on triggers
- `aria-controls` linking trigger to content
- Keyboard navigation (Enter, Space, Arrow keys)
- Focus management between items

### AnimatedChevron Reusability
The `AnimatedChevron` component is exported independently for use in:
- Dropdown menus
- Expandable navigation items
- Collapsible sidebars
- Tree view components
- Any toggle/expand UI pattern

### Custom Icon Behavior
When `icon` prop is provided to `AccordionTrigger`:
- The custom icon receives standard 180° rotation animation
- This matches shadcn/ui behavior
- AnimatedChevron is not rendered

### CSS Variables Used
```css
/* Animation timing (from globals.css) */
--motion-duration-medium: 200ms;
--chevron-duration-smooth: var(--motion-duration-medium);
--chevron-duration-bounce: 300ms;
--chevron-duration-sharp: 150ms;
--chevron-easing-smooth: cubic-bezier(0, 0, 0, 1);
--chevron-easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--chevron-easing-sharp: cubic-bezier(0.4, 0, 0.2, 1);

/* Content animation (from tailwind.config.js) */
--radix-accordion-content-height
```

### Edge Cases
- `type="single"` with `collapsible={false}` keeps one item always open
- `type="multiple"` ignores `collapsible` prop
- Custom icons should be SVG or icon components for proper rotation

### Chevron vs AnimatedChevron
The AccordionTrigger uses a **rotating ChevronDown icon** by default, which is different from the standalone **AnimatedChevron** component:
- **AccordionTrigger default**: Lucide ChevronDown icon that rotates 180°
- **AnimatedChevron**: Standalone component with morphing SVG path animation

If you want the morphing chevron animation in your accordion, you can pass the AnimatedChevron as a custom icon:
```tsx
import { AnimatedChevron } from '@aidan/ui';

// Note: You'd need to manage the open state to pass to AnimatedChevron
<AccordionTrigger icon={<AnimatedChevron open={isOpen} />}>
  Title
</AccordionTrigger>
```


