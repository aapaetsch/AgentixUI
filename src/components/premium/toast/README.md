# Premium Toast

Enhanced toast notifications with promise-based loading states, undo functionality, and advanced features.

## Features

- ✅ **Promise-based toasts** - Automatic loading → success/error transitions
- ✅ **Undo functionality** - Built-in undo support for reversible actions
- ✅ **Custom button styles** - Configurable action button variants
- ✅ **Sound notifications** - Optional audio feedback (browser-dependent)
- ✅ **Priority queuing** - Priority levels for toast management (API ready)
- ✅ **Rich content** - Support for custom React components
- ✅ All free tier features included

## Installation

```bash
npm install @aidan/ui
```

## Quick Start

### 1. Add Provider

```tsx
import { PremiumToastProvider } from '@aidan/ui';

function App() {
  return (
    <PremiumToastProvider position="bottom-right">
      <YourApp />
    </PremiumToastProvider>
  );
}
```

### 2. Use in Components

```tsx
import { usePremiumToast } from '@aidan/ui';

function MyComponent() {
  const { toast } = usePremiumToast();

  const handleDelete = () => {
    toast.success({
      title: 'Item deleted',
      undo: {
        onUndo: () => restoreItem()
      }
    });
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## Promise-based Toasts

Automatically manage loading, success, and error states:

```tsx
const { toast } = usePremiumToast();

const handleUpload = async () => {
  await toast.promise(
    uploadFile(),
    {
      loading: { 
        title: 'Uploading file...',
        description: 'Please wait'
      },
      success: { 
        title: (data) => `${data.fileName} uploaded!`,
        description: 'File is now available'
      },
      error: { 
        title: (error) => `Upload failed: ${error.message}`,
        description: 'Please try again'
      }
    }
  );
};
```

The toast automatically:
- Shows loading spinner
- Updates to success with checkmark
- Or updates to error with error icon
- Maintains same toast ID throughout

## Undo Functionality

Add undo capability to any toast:

```tsx
toast.success({
  title: 'Changes saved',
  description: 'Your settings have been updated',
  undo: {
    label: 'Undo', // Optional, defaults to "Undo"
    onUndo: () => {
      revertChanges();
      toast.info({ title: 'Changes reverted' });
    }
  }
});
```

### Combining Undo with Actions

```tsx
toast({
  title: 'Message sent',
  undo: {
    onUndo: () => unsendMessage()
  },
  action: {
    label: 'View',
    onClick: () => openMessage()
  }
});
```

The undo button becomes the primary action, and your custom action becomes secondary.

## Custom Button Styles

Customize action button appearance:

```tsx
toast.info({
  title: 'Update available',
  action: {
    label: 'Update Now',
    colorStyle: 'filled', // or 'tonal', 'outlined', 'text', 'destructive'
    onClick: () => startUpdate()
  }
});
```

Available styles:
- `tonal` (default) - Semi-filled appearance
- `filled` - Solid background
- `outlined` - Bordered with transparent background
- `text` - No background or border
- `destructive` - Red/danger styling

## API Reference

### usePremiumToast()

Hook for creating premium toasts in React components.

```tsx
const { toast } = usePremiumToast();
```

#### Methods

##### `toast(options)`

Create a toast notification.

```tsx
const id = toast({
  title: 'Notification',
  description: 'Optional description',
  variant: 'default' | 'success' | 'warning' | 'destructive' | 'info',
  type: 'toast' | 'snackbar',
  duration: 5000,
  undo: {
    label: 'Undo',
    onUndo: () => {}
  },
  action: {
    label: 'Action',
    colorStyle: 'tonal',
    onClick: () => {}
  }
});
```

##### `toast.promise(promise, options)`

Create promise-based toast with automatic state management.

```tsx
await toast.promise(
  fetchData(),
  {
    loading: { title: 'Loading...' },
    success: { title: 'Success!' },
    error: { title: 'Error!' }
  }
);
```

##### `toast.success(options)`

Shorthand for success variant.

```tsx
toast.success({ title: 'Saved!' });
```

##### `toast.error(options)` / `toast.warning(options)` / `toast.info(options)`

Similar shorthands for other variants.

##### `toast.dismiss(id)`

Dismiss a specific toast.

```tsx
const id = toast({ title: 'Notification' });
toast.dismiss(id);
```

##### `toast.dismissAll()`

Dismiss all toasts.

##### `toast.update(id, options)`

Update an existing toast.

```tsx
const id = toast({ title: 'Processing...' });
toast.update(id, { title: 'Complete!', variant: 'success' });
```

### Imperative API

Use outside React components:

```tsx
import { premiumToast } from '@aidan/ui';

// In any file
premiumToast.success({
  title: 'API call successful',
  undo: {
    onUndo: () => console.log('Undo')
  }
});

// Promise toast
await premiumToast.promise(
  fetch('/api/data'),
  {
    loading: { title: 'Fetching...' },
    success: { title: 'Data loaded!' },
    error: { title: 'Failed to load' }
  }
);
```

## PremiumToastOptions

All options from free tier toast, plus:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `priority` | `"low" \| "normal" \| "high" \| "urgent"` | `"normal"` | Priority level for queue management |
| `showProgress` | `boolean` | `false` | Show progress bar for duration |
| `undo` | `{ label?: string; onUndo: () => void }` | - | Undo configuration |
| `sound` | `string` | - | Sound notification URL |
| `content` | `ReactNode` | - | Rich content component |
| `action.colorStyle` | `ButtonColorStyle` | `"tonal"` | Button style variant |

## Common Patterns

### Save with Undo

```tsx
const handleSave = () => {
  const previousData = data;
  setData(newData);

  toast.success({
    title: 'Changes saved',
    undo: {
      onUndo: () => {
        setData(previousData);
        toast.info({ title: 'Changes reverted' });
      }
    }
  });
};
```

### Delete with Promise and Undo

```tsx
const handleDelete = async () => {
  const previousItem = item;

  await toast.promise(
    deleteItem(item.id),
    {
      loading: { title: 'Deleting...' },
      success: {
        title: 'Item deleted',
        undo: {
          onUndo: async () => {
            await restoreItem(previousItem);
            toast.info({ title: 'Item restored' });
          }
        }
      },
      error: { title: 'Delete failed' }
    }
  );
};
```

### Multi-step Process

```tsx
const handleProcess = async () => {
  // Step 1
  const id = toast({ title: 'Step 1: Validating...' });
  
  await validate();
  toast.update(id, { title: 'Step 2: Processing...' });
  
  await process();
  toast.update(id, { 
    title: 'Complete!',
    variant: 'success',
    duration: 3000
  });
};
```

## Accessibility

Premium toast maintains all free tier accessibility features:

- ARIA live regions for screen readers
- Keyboard navigation (Tab, Enter, Escape)
- Focus management
- Semantic HTML
- Motion-safe animations

## Migration from Free Tier

Premium toast is a drop-in replacement:

```tsx
// Before (Free tier)
import { ToastProvider, useToast } from '@aidan/ui';

// After (Premium tier)
import { PremiumToastProvider, usePremiumToast } from '@aidan/ui';

// All free tier features still work
const { toast } = usePremiumToast();
toast.success({ title: 'Success!' }); // Same API
```

Just add premium-specific features as needed:

```tsx
// Now with undo
toast.success({ 
  title: 'Success!',
  undo: { onUndo: () => {} }
});
```

## Browser Support

- Modern browsers with ES6+ support
- Sound notifications require user interaction (browser security)
- All features gracefully degrade

## TypeScript

Fully typed with TypeScript. All types are exported:

```tsx
import type {
  PremiumToastOptions,
  PromiseOptions,
  ToastPriority,
  PromiseState
} from '@aidan/ui';
```
