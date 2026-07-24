# Alert Component

## Title
Alert - Non-modal notification element for inline informational messages

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "success" \| "warning" \| "info"` | `"default"` | Semantic variant for styling |
| `dismissible` | `boolean` | `false` | Whether the alert can be dismissed |
| `onDismiss` | `() => void` | - | Callback when alert is dismissed |
| `icon` | `React.ReactNode` | Variant icon | Custom icon to display |
| `showIcon` | `boolean` | `true` | Whether to show the default variant icon |
| `className` | `string` | - | Additional CSS classes |

### Sub-components
- **AlertTitle**: Title/heading of the alert
- **AlertDescription**: Detailed description text
- **AlertClose**: Close button (automatically added when `dismissible` is true)
- **AlertAction**: Container for action buttons

## Dependencies
- `class-variance-authority` - CVA for variant management
- `lucide-react` - Icons (AlertCircle, AlertTriangle, CheckCircle2, Info, X)

## Styling Decisions
1. **CSS Grid Layout**: Uses CSS grid with `has-[>svg]` selector for automatic icon layout handling
2. **Variant Colors**: Each variant uses semantic colors from the theme with proper transparency:
   - `default`: Card background with foreground text
   - `destructive`: Red tones with 10% background opacity
   - `success`: Green tones with 10% background opacity
   - `warning`: Amber tones with 10% background opacity
   - `info`: Blue tones with 10% background opacity
3. **Dark Mode**: Each variant has explicit dark mode color overrides
4. **Border Radius**: Uses `--radius-md` for consistent rounded corners
5. **Padding**: 1rem (p-4) for comfortable spacing

## Maintenance Notes
1. **Icon Sizing**: Icons are sized at 4x4 (1rem) with 0.5 translate-y for baseline alignment
2. **Dismissible Padding**: When dismissible, right padding increases to accommodate close button
3. **State Management**: Dismissible alerts use internal React state; parent can control visibility via conditional rendering
4. **Accessibility**: Uses `role="alert"` for screen reader announcements
5. **Description Muted**: AlertDescription applies `text-muted-foreground` but variant-specific overrides may apply

## Differences from Toast
| Aspect | Alert | Toast |
|--------|-------|-------|
| Position | Inline with content | Fixed corner overlay |
| Duration | Persistent | Auto-dismisses (default 5s) |
| Stacking | Single at a time | Multiple can stack |
| Interruptiveness | Non-interruptive | Non-interruptive |
| Use Case | Form validation, status | Feedback, confirmations |

## Usage Examples
```tsx
// Basic alert
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    Important information here.
  </AlertDescription>
</Alert>

// Dismissible with actions
<Alert variant="warning" dismissible onDismiss={handleDismiss}>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    Your session will expire soon.
  </AlertDescription>
  <AlertAction>
    <Button size="sm">Extend Session</Button>
  </AlertAction>
</Alert>
```
