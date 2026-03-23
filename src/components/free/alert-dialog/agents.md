# AlertDialog Component

## Title
AlertDialog - Modal dialog for critical confirmations requiring user response

## Props

### AlertDialog
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |

### AlertDialogContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `forceMount` | `boolean` | - | Force mount when more control is needed |

### AlertDialogAction
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorStyle` | `"filled" \| "tonal" \| "elevated" \| "outlined" \| "text" \| "destructive" \| "ghost" \| "link"` | `"filled"` | Button color style |
| `className` | `string` | - | Additional CSS classes |

### AlertDialogCancel
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Dependencies
- `@radix-ui/react-alert-dialog` - Accessible dialog primitive
- `class-variance-authority` - CVA for variant management
- `../button` - Button component for action styling

## Styling Decisions
1. **Overlay**: Uses backdrop blur and semi-transparent black (`bg-black/50 backdrop-blur-sm`)
2. **Content Positioning**: Centered using transform translate for cross-browser compatibility
3. **Elevation**: Uses `--elevation-5` for prominent shadow
4. **Border Radius**: Uses `--radius-lg` for consistency with other modals
5. **Animation**: Fade + zoom effect using Tailwind animate classes
6. **Responsive**: Max-width adjusts on mobile (`max-w-[calc(100%-2rem)] sm:max-w-lg`)

## Maintenance Notes
1. **Cannot be dismissed by clicking overlay**: Unlike Dialog, AlertDialog requires explicit action
2. **Cannot be closed with Escape**: Must use Cancel or Action button
3. **Focus Trapping**: Radix handles focus trapping automatically
4. **Button Styling**: Uses existing Button variants for consistency
5. **Accessibility**: Follows WAI-ARIA Alert Dialog pattern

## Differences from Dialog
| Aspect | AlertDialog | Dialog |
|--------|-------------|--------|
| Purpose | Critical confirmations | General modals |
| Dismissal | Explicit action only | Click outside, Escape |
| Escape Key | Disabled | Closes dialog |
| Overlay Click | Disabled | Closes dialog |
| Use Case | Destructive actions | Forms, content |

## Usage Examples
```tsx
// Basic confirmation
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button>Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction colorStyle="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Controlled state
const [open, setOpen] = useState(false);
<AlertDialog open={open} onOpenChange={setOpen}>
  ...
</AlertDialog>
```
