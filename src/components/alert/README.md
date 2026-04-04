# Alert

A non-modal notification element for displaying informational messages inline with content. Unlike Toast components which are temporary and appear in corners, Alert is inline with content and persists until dismissed or removed.

## Installation

The Alert component is part of the `@agentix/ui` package. No additional dependencies are required.

```bash
npm install @agentix/ui
```

## Usage

```tsx
import { Alert, AlertTitle, AlertDescription } from "@agentix/ui";
```

### Basic Alert

```tsx
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the CLI.
  </AlertDescription>
</Alert>
```

### Variants

The Alert component comes with five semantic variants:

```tsx
// Default
<Alert variant="default">
  <AlertTitle>Default Alert</AlertTitle>
  <AlertDescription>This is the default alert variant.</AlertDescription>
</Alert>

// Info
<Alert variant="info">
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>Here's some helpful information.</AlertDescription>
</Alert>

// Success
<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>

// Warning
<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please review before continuing.</AlertDescription>
</Alert>

// Destructive
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

### Dismissible Alert

```tsx
<Alert 
  variant="info" 
  dismissible 
  onDismiss={() => console.log("Alert dismissed")}
>
  <AlertTitle>Dismissible Alert</AlertTitle>
  <AlertDescription>
    Click the X button to dismiss this alert.
  </AlertDescription>
</Alert>
```

### Custom Icon

```tsx
import { Terminal } from "lucide-react";

<Alert icon={<Terminal className="size-4" />}>
  <AlertTitle>Terminal Command</AlertTitle>
  <AlertDescription>
    Run <code>npm install</code> to install dependencies.
  </AlertDescription>
</Alert>
```

### Without Icon

```tsx
<Alert showIcon={false}>
  <AlertTitle>No Icon Alert</AlertTitle>
  <AlertDescription>
    This alert has no icon for a cleaner look.
  </AlertDescription>
</Alert>
```

### With Action Buttons

```tsx
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@agentix/ui";
import { Button } from "@agentix/ui";

<Alert variant="warning">
  <AlertTitle>Unsaved Changes</AlertTitle>
  <AlertDescription>
    You have unsaved changes that will be lost if you leave this page.
  </AlertDescription>
  <AlertAction>
    <Button size="sm" colorStyle="outlined">Discard</Button>
    <Button size="sm">Save Changes</Button>
  </AlertAction>
</Alert>
```

## API Reference

### Alert

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "success" \| "warning" \| "info"` | `"default"` | The visual variant of the alert |
| `dismissible` | `boolean` | `false` | Whether the alert can be dismissed |
| `onDismiss` | `() => void` | - | Callback when alert is dismissed |
| `icon` | `React.ReactNode` | Variant default | Custom icon to display |
| `showIcon` | `boolean` | `true` | Whether to show the variant's default icon |
| `className` | `string` | - | Additional CSS classes |

### AlertTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertDescription

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertAction

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Accessibility

- Uses `role="alert"` for screen reader announcements
- Dismissible alerts include an accessible close button with `aria-label`
- Proper color contrast ratios for all variants
- Focus management for interactive elements

## Comparison with Other Components

| Feature | Alert | Toast | Dialog |
|---------|-------|-------|--------|
| Modal | No | No | Yes |
| Position | Inline | Fixed corner | Centered overlay |
| Duration | Persistent | Auto-dismisses | Until closed |
| Blocks interaction | No | No | Yes |
| Use case | Status, validation | Feedback | Confirmations |

## Best Practices

1. **Use appropriate variants**: Match the variant to the message severity
2. **Keep titles concise**: Use short, descriptive titles
3. **Provide actionable content**: When possible, include actions users can take
4. **Don't overuse**: Too many alerts can overwhelm users
5. **Consider dismissibility**: Make alerts dismissible when the information is not critical
