# Premium Toast Component - Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component Overview
The Premium Toast component extends the Free tier Toast with advanced features including promise-based loading states, undo functionality, priority queuing, sound notifications, and rich content support. It wraps the free toast implementation and adds a more developer-friendly API for complex notification scenarios.

## Props Summary

### PremiumToastProvider
- `children: ReactNode` - App content
- `position?: ToastPosition` - Default position (default: "bottom-right")
- `maxToasts?: number` - Maximum visible toasts (default: 5)
- `swipeDirection?: "right" | "left" | "up" | "down"` - Swipe direction for dismissing (default: "right")
- `enableSounds?: boolean` - Enable/disable sound notifications globally (default: false)

### PremiumToastOptions
Extends all `ToastOptions` from free tier, plus:
- `priority?: ToastPriority` - "low" | "normal" | "high" | "urgent" (default: "normal")
- `showProgress?: boolean` - Show progress bar for duration visualization
- `undo?: { label?: string; onUndo: () => void }` - Undo configuration
- `sound?: string` - Sound notification URL
- `content?: ReactNode` - Rich content component
- `action.colorStyle?: "filled" | "tonal" | "outlined" | "text" | "destructive"` - Button variant (default: "tonal")

### PromiseOptions
For `toast.promise()`:
- `loading: PremiumToastOptions` - Options for loading state
- `success: PremiumToastOptions` - Options for success state (title can be a function receiving promise result)
- `error: PremiumToastOptions` - Options for error state (title can be a function receiving error)

## API

### usePremiumToast Hook
Returns toast API with:
- `toast(options)` - Create toast
- `toast.success(options)` - Success variant shorthand
- `toast.error(options)` - Error variant shorthand
- `toast.warning(options)` - Warning variant shorthand
- `toast.info(options)` - Info variant shorthand
- `toast.promise(promise, options)` - Promise-based toast
- `toast.dismiss(id)` - Dismiss specific toast
- `toast.dismissAll()` - Dismiss all toasts
- `toast.update(id, options)` - Update existing toast

### Imperative API
`premiumToast` - Same API as hook, works outside React components.

## Dependencies
- Free tier `toast` component - Base functionality
- `lucide-react` - Loader2, RotateCcw icons
- All free tier toast dependencies (Radix UI, CVA, etc.)

## Styling Decisions

### Button Variants
Actions now support `colorStyle` prop:
- **tonal** (default): Semi-filled appearance
- **filled**: Solid background
- **outlined**: Bordered with transparent background
- **text**: No background or border
- **destructive**: Red/danger styling

This allows better visual hierarchy for action buttons in toasts.

### Undo Integration
- Undo action automatically becomes primary action
- If both `undo` and `action` are provided, action becomes secondary
- Undo button defaults to "tonal" style for visibility
- Undo callback doesn't auto-dismiss toast by default

### Promise Toast Pattern
- **Loading state**: Shows spinner icon, infinite duration, not dismissible
- **Success state**: Checkmark icon, 3s duration, dismissible
- **Error state**: Error icon, 5s duration, dismissible
- Seamlessly updates existing toast rather than creating new ones

## Architecture Decisions

### Why Extend Rather Than Replace
Premium toast wraps the free tier implementation rather than forking it:
1. **Consistency**: Both tiers use the same rendering logic
2. **Maintainability**: Bug fixes in free tier automatically apply to premium
3. **Bundle Size**: Premium tier only adds new features, doesn't duplicate code
4. **Backwards Compatibility**: Free tier toasts work inside PremiumToastProvider

### Promise API Design
The `toast.promise()` API is inspired by Sonner and React Hot Toast:
```tsx
await toast.promise(fetchData(), {
  loading: { title: 'Loading...' },
  success: { title: data => `Loaded ${data.count} items` },
  error: { title: err => err.message }
});
```

Benefits:
- Automatic state management
- Single toast ID throughout lifecycle
- Type-safe promise resolution
- Error handling built-in

### Undo Pattern
Undo functionality follows Material Design 3 patterns:
- Appears as primary action
- Doesn't auto-dismiss (gives user time to undo)
- Can be combined with other actions
- Callback-based for maximum flexibility

## Maintenance Notes

### Adding New Premium Features
When adding features to premium toast:
1. Check if it belongs in free tier instead
2. Ensure it wraps free tier, doesn't duplicate
3. Update both hook and imperative API
4. Add Storybook story demonstrating the feature
5. Document in README.md

### Sound Notifications
Sound URLs must be accessible and browser must allow audio playback. Failures are silently ignored to prevent breaking toasts. Consider:
- Only use for high-priority notifications
- Provide global disable option
- Keep sounds short (<500ms)
- Host sounds with your app assets

### Priority Queue (Future)
Currently `priority` prop is accepted but not implemented. Future implementation should:
- Queue toasts by priority level
- Show urgent toasts immediately
- Defer low priority toasts when queue is full
- Respect `maxToasts` limit per priority level

## Common Patterns

### Save with Undo
```tsx
toast.success({
  title: 'Changes saved',
  undo: {
    onUndo: () => revertChanges()
  }
});
```

### Upload with Progress
```tsx
await toast.promise(uploadFile(), {
  loading: { title: 'Uploading...', showProgress: true },
  success: { title: 'Upload complete!' },
  error: { title: 'Upload failed' }
});
```

### Delete with Confirmation
```tsx
await toast.promise(deleteItem(), {
  loading: { title: 'Deleting...' },
  success: {
    title: 'Deleted',
    undo: { onUndo: () => restoreItem() }
  },
  error: { title: 'Delete failed' }
});
```

### Custom Actions with Button Styles
```tsx
toast.info({
  title: 'New message',
  action: {
    label: 'Reply',
    colorStyle: 'filled',
    onClick: () => openReply()
  },
  secondaryAction: {
    label: 'Archive',
    colorStyle: 'text',
    onClick: () => archive()
  }
});
```


