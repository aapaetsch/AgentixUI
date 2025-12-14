# Input Component

## Purpose
A versatile input component offering two distinct visual styles:
1. **Input (Shadcn variant)**: Standard shadcn/ui styled input with optional static label
2. **OutlinedInput (MD3 variant)**: Material Design 3 outlined text field with floating label animation

## Props

### Input (Shadcn Variant)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"shadcn"` | `"shadcn"` | Visual variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the input |
| `error` | `boolean` | `false` | Error state styling |
| `warning` | `boolean` | `false` | Warning state styling |
| `label` | `string` | - | Label text above/beside input |
| `labelPosition` | `"top" \| "left"` | `"top"` | Label position |
| `required` | `boolean` | `false` | Shows * indicator |
| `containerClassName` | `string` | - | Class for container element |
| ...InputHTMLAttributes | - | - | All standard input props |

### OutlinedInput (MD3 Variant)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Floating label text |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size of the input |
| `error` | `boolean` | `false` | Error state styling |
| `warning` | `boolean` | `false` | Warning state styling |
| `required` | `boolean` | `false` | Shows * indicator in label |
| `containerClassName` | `string` | - | Class for container element |
| ...InputHTMLAttributes | - | - | All standard input props (except placeholder) |

## Dependencies
- `class-variance-authority` - CVA for variant management
- `../../lib/utils` - cn utility (clsx + tailwind-merge)

## Styling Decisions

### Shadcn Variant
- Follows standard shadcn/ui input patterns
- Uses focus ring with 3px ring and ring/50 opacity
- Static label positioned above or beside input
- Consistent with existing Textarea component styling

### MD3 Outlined Variant
- **Floating Label Animation**: Label uses CSS transforms for smooth animation
  - Empty & unfocused: Label centered inside input
  - Focused or has value: Label floats to top border with background color cutout
- **Border Treatment**: Container handles all border styling, input is borderless
- **Color System**: Uses project CSS variables (--ring, --destructive, --warning)
- **Motion**: Uses MD3 motion tokens (--motion-duration-medium, --motion-easing-standard)

### Size Specifications
| Size | Height (shadcn) | Height (outlined) | Font Size |
|------|-----------------|-------------------|-----------|
| sm | 2rem (32px) | 2.5rem (40px) | text-sm |
| md | 2.5rem (40px) | 3rem (48px) | text-sm |
| lg | 3rem (48px) | 3.5rem (56px) | text-base |

MD3 outlined variant has taller heights to accommodate the floating label space.

## Maintenance Notes

### Floating Label Implementation
- Uses `transform: scale()` and `translate()` for smooth animation
- Label has `bg-background` when floated to create border cutout effect
- Requires tracking both focus state and value presence
- Does not support placeholder text (label serves this purpose)

### State Management
- Both controlled and uncontrolled patterns supported
- OutlinedInput tracks internal value for label animation in uncontrolled mode
- Focus state tracked via onFocus/onBlur handlers

### Known Limitations
1. OutlinedInput does not support `placeholder` prop (intentional - label replaces placeholder)
2. File input styling may need additional work for OutlinedInput variant
3. Multi-line input not supported - use Textarea component instead

### Accessibility
- Uses semantic `<label>` elements
- `aria-invalid` set when in error state
- Required indicator is decorative (`aria-hidden="true"`)
- Focus states clearly visible with ring styling

## Usage Examples

```tsx
// Basic shadcn input
<Input placeholder="Enter email..." />

// With label
<Input label="Email" placeholder="example@email.com" />

// MD3 outlined with floating label
<OutlinedInput label="Email Address" />

// Error states
<Input error label="Invalid" />
<OutlinedInput error label="Email" />

// Form with both variants
<form>
  <OutlinedInput label="Username" required />
  <OutlinedInput label="Password" type="password" required />
</form>
```
