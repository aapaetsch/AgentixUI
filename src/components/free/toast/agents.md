# Toast Component - Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Name
Toast / Notification / Snackbar

## Props Interface Summary

### ToastProvider
```tsx
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;        // "bottom-right" default
  duration?: number;               // 5000ms default
  maxToasts?: number;              // 5 default
  swipeDirection?: "right" | "left" | "up" | "down";
  label?: string;                  // "Notifications" for a11y
}
```

### ToastOptions (for toast() and useToast)
```tsx
interface ToastOptions {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  type?: "toast" | "snackbar";     // "toast" default - controls interaction model
  duration?: number;               // Use Infinity for persistent
  action?: ToastActionConfig;      // Only for type="toast"
  secondaryAction?: ToastActionConfig;  // Only for type="toast"
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  dismissible?: boolean;           // true default
  onDismiss?: (id: string) => void;
  onAutoClose?: (id: string) => void;
  className?: string;
}
```

### Toast Primitive
```tsx
interface ToastProps {
  variant?: ToastVariant;
  position?: ToastPosition;        // For animation direction
  // + Radix Toast.Root props
}
```

## Dependencies

- `@radix-ui/react-toast` - Accessible toast primitives
- `class-variance-authority` - Variant styling
- `lucide-react` - Icons (X, CheckCircle2, AlertTriangle, XCircle, Info)
- `../../../lib/utils` - cn() utility

## Architecture Decisions

### Store/Event Emitter Pattern with Context Scoping
The toast system uses a `ToastStore` class that:
1. Maintains an array of `ToastState` objects
2. Exposes `subscribe()` for React components to receive updates
3. Provides `add()`, `update()`, `dismiss()`, `dismissAll()` methods

**Scoping Strategy:**
- Each `ToastProvider` creates its own isolated `ToastStore` instance
- The store is provided via React Context (`ToastContext`)
- A global `defaultToastStore` singleton exists for imperative `toast()` calls outside any provider
- `useToast()` hook automatically uses the nearest context store if available, falling back to default

This enables:
- Isolated toast contexts in Storybook stories (toasts don't leak between stories)
- Multiple toast providers in the same app with independent state
- Imperative API still works globally for non-React code

### Imperative vs Hook API
- **`toast()`**: Imperative function that works anywhere (API utilities, event handlers, non-React code). Uses `defaultToastStore` singleton. Requires ToastProvider mounted in the app.
- **`useToast()`**: React hook that provides context-aware toast API. Uses the nearest `ToastProvider`'s store, or falls back to `defaultToastStore`. Preferred for React components.

### Toast vs Snackbar Types
- **type="toast"** (default): Interactive notifications supporting 1-2 action buttons. For user actions requiring response.
- **type="snackbar"**: Information-only notifications with no action buttons. For passive feedback that doesn't require interaction.

### Position-Based Animations
Animation classes are dynamically generated based on position:
- Side positions (left/right): slide from that side
- Center positions: slide from top/bottom edge

## Styling Decisions

### CVA Variants
- **variant**: 5 options with MD3-inspired colors
  - `default`: Inverted (bg-foreground, text-background)
  - `success`: Green with white text
  - `warning`: Amber with black text
  - `destructive`: Uses --destructive token
  - `info`: Blue with white text

### Position Variants
6-position grid covering all corners and center edges.

### Tailwind Direct Colors
Success/warning/info use direct Tailwind colors (green-600, amber-500, blue-600) rather than CSS variables because these are semantic toast-specific colors that don't need theming.

## Integration Points

### Avatar Integration
Toasts accept an `avatar` prop that renders any React element in place of the default icon. Works with the Avatar component:
```tsx
toast({
  avatar: <Avatar size="sm"><AvatarFallback>JD</AvatarFallback></Avatar>,
  title: "John sent a message",
});
```

### Button Integration
ToastAction uses variant-aware styling that adapts to the parent toast's variant class.

## Maintenance Notes

### Known Patterns
- Toast IDs are auto-generated with `toast-{timestamp}-{counter}` format
- Dismiss animation uses 200ms delay before removing from store
- `onAutoClose` is called when Radix auto-closes, `onDismiss` on any dismiss

### Edge Cases
- Duplicate IDs: Updates existing toast rather than creating new
- Infinity duration: Creates persistent toast that must be manually dismissed
- Action returning `false`: Prevents auto-dismiss after action click

### Testing Considerations
- Animation timing affects testing (200ms dismiss delay)
- Store is singleton - may need reset between tests
- Position tests need adequate viewport space

## File Structure
```
toast/
├── index.tsx          # Main implementation
├── Toast.stories.tsx  # Storybook stories
├── README.md          # User documentation
└── agents.md          # This file
```


