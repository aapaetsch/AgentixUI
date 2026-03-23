# Dialog Components
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A comprehensive modal dialog system built on Radix UI primitives with Material Design 3 styling, supporting multi-page navigation, nested dialogs, and responsive fullscreen mode.

## Components

| Component | Description |
|-----------|-------------|
| `Dialog` | Root component that manages dialog state and provides context for nested dialogs |
| `DialogTrigger` | Element that opens the dialog when clicked |
| `DialogPortal` | Renders dialog content in a React portal |
| `DialogOverlay` | Backdrop overlay with blur effect behind the dialog |
| `DialogContent` | Main dialog container with size and position variants |
| `DialogHeader` | Container for title and description |
| `DialogTitle` | Dialog heading (required for accessibility) |
| `DialogDescription` | Descriptive text below the title |
| `DialogFooter` | Container for action buttons |
| `DialogClose` | Element that closes the dialog when clicked |
| `DialogPages` | Multi-page content container with transitions |

## Props

### Dialog (Root)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `modal` | `boolean` | `true` | Whether the dialog is modal |

### DialogContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Dialog width variant |
| `position` | `"center" \| "top" \| "fullscreen"` | `"center"` | Dialog positioning |
| `showCloseButton` | `boolean` | `true` | Whether to show the close button |
| `closeButton` | `React.ReactNode` | - | Custom close button element |
| `onCloseClick` | `() => void` | - | Callback when close button is clicked |
| `preventBackgroundClose` | `boolean` | `false` | Prevents closing by clicking overlay or pressing Escape |

### DialogPages
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pages` | `DialogPage[]` | - | Array of page objects |
| `activePage` | `number \| string` | - | Current active page index or id |
| `transition` | `"slide" \| "fade" \| "none"` | `"slide"` | Transition type between pages |
| `direction` | `"forward" \| "backward"` | `"forward"` | Direction of slide transition |
| `transitionDuration` | `number` | `200` | Transition duration in milliseconds |
| `onTransitionEnd` | `() => void` | - | Callback when transition completes |

### DialogPage (object)
| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier for the page |
| `content` | `React.ReactNode` | Page content |
| `title` | `string` | Optional page title |
| `description` | `string` | Optional page description |

## Hooks

### useDialogPages
Hook for managing multi-page dialog navigation.

```tsx
const {
  activePage,    // Current page (number or string)
  direction,     // "forward" | "backward"
  nextPage,      // Go to next page
  previousPage,  // Go to previous page
  goToPage,      // Navigate to specific page
  isFirstPage,   // Boolean
  isLastPage,    // Boolean
  reset,         // Reset to initial page
} = useDialogPages({
  initialPage: 0,
  totalPages: 3,
  onPageChange: (page, direction) => {},
});
```

### useResponsiveDialog
Hook to determine if dialog should be fullscreen based on viewport.

```tsx
const { isMobile, position } = useResponsiveDialog(640); // breakpoint in px
// Returns: { isMobile: boolean, position: "fullscreen" | "center" }
```

## Dependencies

- `@radix-ui/react-dialog` - Core dialog primitive with accessibility
- `class-variance-authority` - CVA for variant management
- `lucide-react` - X icon for close button
- `../../lib/utils` - `cn()` utility function

## Styling Decisions

### Size Variants
| Size | Width | Use Case |
|------|-------|----------|
| `xs` | 320px | Simple alerts, confirmations |
| `sm` | 400px | Small forms, notifications |
| `md` | 500px | Standard dialogs (default) |
| `lg` | 640px | Complex forms, multi-column content |
| `xl` | 800px | Settings panels, data tables |
| `full` | 100% | Used internally with fullscreen position |

### Position Variants
| Position | Description | Animation |
|----------|-------------|-----------|
| `center` | Centered with translate | Scale in/out |
| `top` | Near top of viewport | Slide from top |
| `fullscreen` | Covers entire viewport | Fade only |

### Overlay Styling
- Background: `bg-black/50` (50% opacity black)
- Backdrop blur: `backdrop-blur-sm`
- Animation: Fade in/out

### Content Styling
- Background: `bg-background` (theme-aware)
- Border: `border-border`
- Shadow: `shadow-[var(--elevation-5)]` (M3 elevation)
- Border radius: `var(--radius-lg)` (except fullscreen)
- Padding: `p-6` (except fullscreen)

### Nested Dialog Z-Index
Each nesting level increases z-index by 10:
- Level 1: overlay z-50, content z-51
- Level 2: overlay z-60, content z-61
- Level 3: overlay z-70, content z-71

### CSS Variables Used
```css
--radius-lg
--radius-sm
--elevation-5
--motion-duration-medium
--motion-duration-short
--motion-easing-standard
--background
--foreground
--border
--muted-foreground
--ring
```

## Accessibility

- Uses Radix UI Dialog which provides:
  - Focus trapping within the dialog
  - Focus restoration when closed
  - Escape key to close
  - Click outside to close (modal mode)
  - Proper ARIA attributes
- `DialogTitle` is required for screen readers
- `DialogDescription` provides additional context
- Close button includes `sr-only` text

## Usage Examples

### Basic Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div>Content</div>
    <DialogFooter>
      <DialogClose asChild>
        <Button>Close</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Controlled Dialog
```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Controlled</DialogTitle>
    </DialogHeader>
    <Button onClick={() => setOpen(false)}>Close</Button>
  </DialogContent>
</Dialog>
```

### Responsive Fullscreen
```tsx
function ResponsiveDialog() {
  const { isMobile, position } = useResponsiveDialog(640);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent position={position}>
        {/* Content adapts to fullscreen on mobile */}
      </DialogContent>
    </Dialog>
  );
}
```

### Multi-Page Dialog
```tsx
function WizardDialog() {
  const { activePage, direction, nextPage, previousPage, isFirstPage, isLastPage } =
    useDialogPages({ totalPages: 3 });

  const pages = [
    { id: "step1", content: <Step1 /> },
    { id: "step2", content: <Step2 /> },
    { id: "step3", content: <Step3 /> },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Start Wizard</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogPages
          pages={pages}
          activePage={activePage}
          direction={direction}
          transition="slide"
        />
        <DialogFooter>
          <Button onClick={previousPage} disabled={isFirstPage}>Back</Button>
          <Button onClick={nextPage} disabled={isLastPage}>Next</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Nested Dialogs
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Parent</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Parent Dialog</DialogTitle>
    
    {/* Nested dialog */}
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Child</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogTitle>Child Dialog</DialogTitle>
      </DialogContent>
    </Dialog>
  </DialogContent>
</Dialog>
```

### Prevent Background Close
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent preventBackgroundClose showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>Action Required</DialogTitle>
      <DialogDescription>
        You must make a choice before this dialog can be closed.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="ghost">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button>Confirm</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Maintenance Notes

### Known Edge Cases
- Fullscreen position ignores size prop (uses full width/height)
- Nested dialogs should be used sparingly (max 2-3 levels recommended)
- Multi-page transitions require explicit direction for proper animation
- Form state in multi-page dialogs should be managed externally by the consumer

### Animation Classes
The component uses Tailwind's `animate-in`/`animate-out` classes which require `tailwindcss-animate` plugin:
- `fade-in-0`, `fade-out-0`
- `zoom-in-95`, `zoom-out-95`
- `slide-in-from-top-[5%]`, `slide-out-to-top-[5%]`

### Focus Management
- Focus is automatically trapped in the dialog
- First focusable element receives focus on open
- Focus returns to trigger on close
- For multi-page dialogs, consider managing focus on page change

### Responsive Considerations
- Use `useResponsiveDialog` hook for automatic fullscreen on mobile
- Fullscreen position removes padding - add padding to inner content
- Consider mobile keyboard when using forms in dialogs


