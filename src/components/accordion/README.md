# Accordion Components

A comprehensive accordion system built on Radix UI primitives, featuring custom easing presets and Material Design 3 motion patterns.

## Installation

```bash
npm install @agentix/ui
```

## Usage

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@agentix/ui';

// Basic accordion
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. It comes with default styles that match your design system.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## Components

### Accordion
Root container that manages expansion state (single or multiple).

### AccordionItem
Individual accordion section wrapper.

### AccordionTrigger
Clickable header that toggles content visibility with chevron indicator.

### AccordionContent
Collapsible content area with smooth expand/collapse animations.

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

## Styling

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

## Related Components

- **AnimatedChevron** - For a morphing chevron animation (in `src/components/AnimatedChevron`)

You can use the AnimatedChevron component in your accordion:

```tsx
import { AnimatedChevron } from '@agentix/ui';

// Note: You'd need to manage the open state to pass to AnimatedChevron
<AccordionTrigger icon={<AnimatedChevron open={isOpen} />}>
  Title
</AccordionTrigger>
```

## Accessibility

- Built on Radix UI accordion primitives (WAI-ARIA compliant)
- Proper `aria-expanded` state on triggers
- `aria-controls` linking trigger to content
- Keyboard navigation (Enter, Space, Arrow keys)
- Focus management between items

## Dependencies

- `@radix-ui/react-accordion` - Accessible accordion primitives
- `class-variance-authority` - Variant management
- `lucide-react` - Fallback ChevronDown icon
- `@agentix/ui/lib/utils` - `cn()` utility

## License

MIT © Aidan