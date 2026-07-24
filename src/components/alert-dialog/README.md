# AlertDialog

A modal dialog that interrupts users with critical content requiring a response. Unlike regular Dialog, AlertDialog cannot be dismissed by clicking outside or pressing Escape - the user must explicitly choose an action.

## Installation

The AlertDialog component requires the `@radix-ui/react-alert-dialog` package, which is included with `aapaetsch-ui-kit`.

```bash
npm install aapaetsch-ui-kit
```

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "aapaetsch-ui-kit";
```

### Basic Usage

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button colorStyle="outlined">Show Dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Destructive Action

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button colorStyle="destructive">Delete Account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Account</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete your account? All of your data will
        be permanently removed. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction colorStyle="destructive">
        Delete Account
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Controlled State

```tsx
function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteItem();
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              colorStyle="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

## API Reference

### AlertDialog

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `defaultOpen` | `boolean` | `false` | Default open state |

### AlertDialogTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto child element |
| `className` | `string` | - | Additional CSS classes |

### AlertDialogContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `forceMount` | `boolean` | - | Force mount for animation control |

### AlertDialogHeader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertDialogFooter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertDialogTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertDialogDescription

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertDialogAction

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorStyle` | `"filled" \| "tonal" \| "elevated" \| "outlined" \| "text" \| "destructive" \| "ghost" \| "link"` | `"filled"` | Button color style |
| `className` | `string` | - | Additional CSS classes |

### AlertDialogCancel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Accessibility

- Follows WAI-ARIA Alert Dialog design pattern
- Focus is automatically trapped within the dialog
- Focus returns to trigger element when closed
- Screen readers announce the title and description
- Cannot be closed with Escape key (requires explicit action)
- Cannot be closed by clicking outside (requires explicit action)

## Comparison with Other Components

| Feature | AlertDialog | Dialog | Toast |
|---------|-------------|--------|-------|
| Modal | Yes | Yes | No |
| Blocks interaction | Yes | Yes | No |
| Requires action | Yes | No | No |
| Can be escaped | No | Yes | Yes |
| Click outside closes | No | Yes | N/A |
| Auto-dismisses | No | No | Yes |
| Use case | Critical confirmations | General modals | Feedback |

## Best Practices

1. **Use for critical actions**: Reserve AlertDialog for actions that require explicit confirmation
2. **Be specific**: Clearly describe what will happen when the user confirms
3. **Provide context**: Explain any consequences of the action
4. **Use appropriate button color styles**: Use `colorStyle="destructive"` for destructive actions
5. **Don't overuse**: Too many alert dialogs can frustrate users
