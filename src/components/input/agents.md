# Input Component
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Purpose
A versatile input component offering two distinct visual styles:
1. **Input (Shadcn variant)**: Standard shadcn/ui styled input with optional static label
2. **OutlinedInput (MD3 variant)**: Material Design 3 outlined text field with floating label animation

Note: The base `inputVariants` class includes `peer`, which enables the shadcn
`peer-disabled:*` pattern on sibling components (e.g. `<Label>` renders
`peer-disabled:cursor-not-allowed peer-disabled:opacity-70`). Keep `peer` on the
input element so the pattern stays active for every Label paired with Input.

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


