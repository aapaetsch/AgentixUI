# Toast Component

A flexible toast notification system with an imperative API for use outside React components and a hook-based API for React components.

## Installation

```bash
npm install @aidan/ui
```

## Quick Start

### 1. Add ToastProvider to your app root

```tsx
import { ToastProvider } from '@aidan/ui';

function App() {
  return (
    <ToastProvider position="bottom-right">
      <YourApp />
    </ToastProvider>
  );
}
```

### 2. Use toasts in your components

```tsx
import { useToast } from '@aidan/ui';

function MyComponent() {
  const { toast } = useToast();
  
  return (
    <button onClick={() => toast.success({ title: 'Saved!' })}>
      Save
    </button>
  );
}
```

### 3. Use toasts outside React (API utilities, etc.)

```tsx
import { toast } from '@aidan/ui';

// In a non-React file
async function fetchData() {
  try {
    const data = await api.getData();
    toast.success({ title: 'Data loaded!' });
    return data;
  } catch (error) {
    toast.error({ title: 'Failed to load data' });
    throw error;
  }
}
```

> **Important:** The `toast()` function requires a `ToastProvider` to be mounted somewhere in your React tree. For usage within React components, prefer `useToast()` hook.

## API Reference

### ToastProvider

Provider component that renders and manages toasts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `ToastPosition` | `"bottom-right"` | Where toasts appear |
| `duration` | `number` | `5000` | Default auto-dismiss time (ms) |
| `maxToasts` | `number` | `5` | Max visible toasts |
| `swipeDirection` | `"right" \| "left" \| "up" \| "down"` | `"right"` | Swipe to dismiss direction |
| `label` | `string` | `"Notifications"` | Screen reader label |

### toast() - Imperative API

```tsx
// Simple string
toast('Hello!');

// With options
toast({
  title: 'Event created',
  description: 'Monday at 6:00pm',
  variant: 'success',
  duration: 3000,
});

// Variant shortcuts
toast.success({ title: 'Done!' });
toast.warning({ title: 'Careful!' });
toast.error({ title: 'Failed!' });
toast.info({ title: 'FYI' });

// Control
const id = toast('Loading...');
toast.update(id, { title: 'Complete!', variant: 'success' });
toast.dismiss(id);
toast.dismissAll();
```

### useToast() - React Hook

```tsx
const { toast, toasts, dismiss, dismissAll } = useToast();
```

### ToastOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | auto | Unique identifier |
| `title` | `ReactNode` | - | Toast heading |
| `description` | `ReactNode` | - | Additional context |
| `variant` | `ToastVariant` | `"default"` | Visual style |
| `type` | `ToastType` | `"toast"` | Interaction model: "toast" (with buttons) or "snackbar" (info-only) |
| `duration` | `number` | `5000` | Auto-dismiss time (ms), use `Infinity` for persistent |
| `action` | `ToastActionConfig` | - | Action button (only for type="toast", max 2) |
| `secondaryAction` | `ToastActionConfig` | - | Secondary action button (only for type="toast") |
| `icon` | `ReactNode` | variant default | Custom icon |
| `avatar` | `ReactNode` | - | Avatar element |
| `dismissible` | `boolean` | `true` | Show close button |
| `onDismiss` | `(id: string) => void` | - | Called when dismissed |
| `onAutoClose` | `(id: string) => void` | - | Called on auto-close |
| `className` | `string` | - | Additional classes |

### ToastPosition

```tsx
type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
```

### ToastVariant

```tsx
type ToastVariant = "default" | "success" | "warning" | "destructive" | "info";
```

### ToastType

```tsx
type ToastType = "toast" | "snackbar";
```

**Toast vs Snackbar:**
- **"toast"** (default): Interactive notifications with up to 2 action buttons for user interaction
- **"snackbar"**: Information-only notifications without action buttons, simpler UI for passive feedback

## Examples

### With Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@aidan/ui';

toast({
  title: 'New message from Sarah',
  description: 'Hey! Are you free?',
  avatar: (
    <Avatar size="sm">
      <AvatarImage src="/sarah.jpg" alt="Sarah" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
});
```

### With Action Buttons

```tsx
// Single action
toast({
  type: 'toast',  // default type
  title: 'Item deleted',
  action: {
    label: 'Undo',
    onClick: () => restoreItem(),
  },
});

// Two actions (max 2 for type="toast")
toast({
  type: 'toast',
  title: 'New message',
  description: 'From: john@example.com',
  action: {
    label: 'Reply',
    onClick: () => replyToMessage(),
  },
  secondaryAction: {
    label: 'Archive',
    onClick: () => archiveMessage(),
  },
});
```

### Snackbar (Info-only)

```tsx
// Information-only notification, no action buttons
toast({
  type: 'snackbar',
  title: 'Connection restored',
  description: 'You are back online',
  variant: 'success',
});
```

### Async Pattern

```tsx
const id = toast({
  title: 'Uploading...',
  duration: Infinity,
  dismissible: false,
});

await uploadFile();

toast.update(id, {
  title: 'Upload complete!',
  variant: 'success',
  duration: 3000,
  dismissible: true,
});
```

## Primitive Components

For custom toast rendering, use the primitive components:

- `Toast` - Root toast element
- `ToastViewport` - Viewport container
- `ToastTitle` - Title text
- `ToastDescription` - Description text
- `ToastAction` - Action button
- `ToastClose` - Close button
- `ToastIcon` - Icon container
- `ToastContent` - Content wrapper

## Accessibility

- Toasts are announced to screen readers via ARIA live regions
- Keyboard navigation supported (Tab to action, Escape to dismiss)
- Swipe to dismiss on touch devices
- Automatic focus management