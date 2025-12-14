# Textarea

A flexible, accessible textarea component with optional auto-resize, character counter, and built-in label support.

## Installation

```bash
npm install @aidan/ui
```

## Usage

```tsx
import { Textarea, TextareaWithCounter } from '@aidan/ui';

// Basic usage
<Textarea placeholder="Enter your message..." />

// With label
<Textarea label="Description" placeholder="Enter a description..." />

// Required field
<Textarea label="Bio" required placeholder="Tell us about yourself..." />

// Label position left
<Textarea label="Notes" labelPosition="left" placeholder="Enter notes..." />

// Auto-resize
<Textarea 
  autoResize 
  minRows={3} 
  maxRows={10} 
  placeholder="Type to see the textarea grow..." 
/>

// Validation states
<Textarea label="Message" error placeholder="This field has an error" />
<Textarea label="Note" warning placeholder="This field has a warning" />

// With character counter
<TextareaWithCounter
  label="Message"
  placeholder="Enter your message..."
  maxLength={200}
/>

// Counter with warning threshold
<TextareaWithCounter
  label="Bio"
  placeholder="Tell us about yourself..."
  maxLength={150}
  warningAt={120}
  required
/>

// Counter with auto-resize
<TextareaWithCounter
  label="Feedback"
  placeholder="Share your feedback..."
  maxLength={500}
  warningAt={400}
  autoResize
  minRows={3}
  maxRows={10}
/>
```

## Features

- **Size Variants**: Small, Medium (default), and Large sizes for different use cases
- **Auto-Resize**: Dynamically adjusts height based on content with optional min/max row bounds
- **Character Counter**: Compound component `TextareaWithCounter` with warning and error thresholds
- **Label Support**: Built-in label with configurable positioning (top/left) and required indicator
- **Validation States**: Error and warning border states for form feedback
- **Accessible**: Proper ARIA attributes and keyboard interaction
- **Motion**: Smooth transitions using MD3 motion tokens

## Props

### Textarea

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | The size of the textarea |
| `error` | `boolean` | `false` | If true, displays destructive/error border styling |
| `warning` | `boolean` | `false` | If true, displays warning border styling (amber) |
| `label` | `string` | - | The label text to display |
| `labelPosition` | `"top"` \| `"left"` | `"top"` | Position of the label relative to the textarea |
| `required` | `boolean` | `false` | If true, shows a red asterisk (*) after the label |
| `autoResize` | `boolean` | `false` | If true, textarea height adjusts to content |
| `minRows` | `number` | - | Minimum number of rows when autoResize is enabled |
| `maxRows` | `number` | - | Maximum number of rows when autoResize is enabled |
| `containerClassName` | `string` | - | Additional classes for the container element |
| `className` | `string` | - | Additional classes for the textarea element |
| `disabled` | `boolean` | - | Disables the textarea |
| `placeholder` | `string` | - | Placeholder text |

### TextareaWithCounter

Extends all `TextareaProps` plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | **required** | Maximum character count for the counter |
| `showCount` | `boolean` | `true` | Whether to display the character count |
| `countPosition` | `"bottom-left"` \| `"bottom-right"` | `"bottom-right"` | Position of the counter text |
| `warningAt` | `number` | - | Character count threshold to trigger warning border |

## Styling

### Size Variants

- **Small (sm)**: `min-h-[4rem]`, `px-2.5 py-1.5`, `text-sm`
- **Medium (md)**: `min-h-[5rem]`, `px-3 py-2`, `text-sm` (default)
- **Large (lg)**: `min-h-[6rem]`, `px-4 py-2.5`, `text-base`

### Border States

- **Default**: `border-border` - standard input border color
- **Warning**: `border-warning` - amber/yellow border (uses new `--warning` CSS variable)
- **Error**: `border-destructive` - red border for validation errors
- **Error takes precedence** over warning when both are true

### Focus Styling

- Uses `ring-[3px]` with 50% opacity for focus ring
- Border color changes to `ring` (default), `warning`, or `destructive` on focus
- Follows shadcn/ui focus patterns

### Resize Handle

- Native resize handle is **hidden by default** (`resize-none`)
- Auto-resize provides a better UX for dynamic height adjustment

### Motion

- Transitions use MD3 motion tokens: `duration-[var(--motion-duration-medium)]` (200ms)
- Easing: `ease-[var(--motion-easing-standard)]`

### Counter Styling

- Counter text uses `text-muted-foreground` and stays this color regardless of state
- Only the **border** changes color for warning/error states
- Uses `tabular-nums` for consistent number width

## Accessibility

- Proper ARIA attributes for screen readers
- Keyboard navigation support
- Focus states clearly visible
- Required fields indicated with asterisk

## Dependencies

- `class-variance-authority` - Variant management
- `@aidan/ui/lib/utils` - Class name merging

## License

MIT © Aidan