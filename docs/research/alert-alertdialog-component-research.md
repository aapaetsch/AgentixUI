# Alert and Alert Dialog Components Research

## Overview

This document provides research findings on how shadcn/ui implements Alert and Alert Dialog components, their differences from Toast components, and best practices for implementation.

## Alert Component

### Definition and Purpose

The Alert component in shadcn/ui is a non-modal dialog that displays important information without interrupting the user's workflow. It's typically used for:

- Informational messages
- Warning notifications
- Error messages
- Success confirmations

### Structure and Props

Based on shadcn/ui implementation:

#### Main Components
1. `Alert` - The container element
2. `AlertTitle` - The title/heading of the alert
3. `AlertDescription` - The detailed description of the alert

#### Props
- `variant`: Controls the styling variant
  - `default`: Standard informational alert
  - `destructive`: Error/warning alert with destructive styling

### Implementation Details

From shadcn/ui source code analysis:
- Built using `class-variance-authority` (CVA) for variant management
- Uses Tailwind CSS classes for styling
- Implements proper accessibility attributes
- Supports icons through children composition
- Can be used as a controlled or uncontrolled component

### Example Usage

```tsx
<Alert variant="default | destructive">
  <Terminal className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>
```

## Alert Dialog Component

### Definition and Purpose

The Alert Dialog component is a modal dialog that interrupts the user with important content and expects a response. It's commonly used for:

- Confirmation prompts (delete, save, etc.)
- Critical alerts requiring user action
- Irreversible action warnings

### Structure and Props

Based on shadcn/ui implementation:

#### Main Components
1. `AlertDialog` - Root component
2. `AlertDialogTrigger` - Trigger element to open the dialog
3. `AlertDialogPortal` - Portal for rendering the dialog
4. `AlertDialogOverlay` - Background overlay
5. `AlertDialogContent` - Main dialog content
6. `AlertDialogHeader` - Header section containing title and description
7. `AlertDialogFooter` - Footer section containing actions
8. `AlertDialogTitle` - Dialog title
9. `AlertDialogDescription` - Dialog description
10. `AlertDialogAction` - Primary action button
11. `AlertDialogCancel` - Cancel/close button

### Implementation Details

From shadcn/ui source code analysis:
- Built on top of Radix UI's react-alert-dialog primitive
- Implements proper keyboard navigation (Esc to close, etc.)
- Supports focus trapping
- Uses Tailwind CSS classes for styling
- Implements proper accessibility attributes including ARIA roles
- Manages screen reader announcements with Title and Description components
- Provides automatic focus management

### Example Usage

```tsx
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
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

## Differences Between Alert, Alert Dialog, and Toast

### Alert vs Alert Dialog vs Toast

| Aspect | Alert | Alert Dialog | Toast (Sonner) |
|--------|-------|--------------|----------------|
| Modality | Non-modal | Modal | Non-modal |
| Interruption | Low - passive notification | High - blocks interaction | Low - passive notification |
| User Action | None required | Required (confirmation) | Optional (dismissal) |
| Duration | Persistent until closed manually | Until user acts | Auto-dismisses |
| Use Cases | Status updates, info, warnings | Confirmations, critical actions | System notifications, feedback |
| Position | Inline with content | Center overlay | Bottom/right corner |
| Dismissal | Usually none | Via buttons | Auto or manual |

## Accessibility Considerations

### Alert Dialog Accessibility

Based on Radix UI accessibility guidelines:

1. **ARIA Compliance**: Adheres to the Alert and Message Dialogs WAI-ARIA design pattern
2. **Screen Reader Support**: Properly manages screen reader announcements with Title and Description components
3. **Keyboard Navigation**:
   - Space/Enter: Opens/closes the dialog
   - Tab: Moves focus to the next focusable element
   - Shift + Tab: Moves focus to the previous focusable element
   - Esc: Closes the dialog and moves focus to the trigger element
4. **Focus Management**: 
   - Automatic focus trapping within dialog
   - Focus restoration to trigger on close

### Alert Accessibility

Although Radix UI doesn't have a dedicated Alert component, shadcn's implementation follows accessibility best practices:

1. **Role attribute**: Should use `role="alert"` or `role="status"` depending on importance
2. **Proper labeling**: Clear titles and descriptions
3. **Color contrast**: Adequate contrast ratios for readability
4. **Non-decorative icons**: Icons should convey meaning or be hidden from screen readers

### Toast Accessibility (Sonner)

Since shadcn has deprecated its native Toast for Sonner:

1. **Live Regions**: Properly announces messages with aria-live
2. **Timing**: Appropriate duration for reading content
3. **Dismissal**: Easy to dismiss with keyboard
4. **Focus management**: Doesn't interrupt user workflow

## Best Practices and Design Patterns

### Component Design Patterns

1. **Composition over inheritance**: Use composable sub-components
2. **Controlled/uncontrolled pattern**: Allow both controlled and uncontrolled usage
3. **Consistent API**: Follow established React patterns for similar components
4. **Accessibility-first**: Implement proper ARIA attributes and keyboard handling

### Styling Patterns

1. **Variant System**: Use CVA for consistent variant management
2. **Tailwind Utilities**: Leverage Tailwind's utility-first approach
3. **CSS Variables**: Use CSS variables for theming
4. **Override Support**: Accept className prop for customization

### Props Design

1. **Explicit interfaces**: Define clear TypeScript interfaces
2. **Sensible defaults**: Provide reasonable default values
3. **DOM forwarding**: Forward relevant DOM props to root elements
4. **Event callback naming**: Use consistent naming patterns (onValueChange, etc.)

## Implementation Recommendations

Based on shadcn/ui patterns and Radix UI practices:

### For Alert Component:

1. Create simple div-based component with variant styling
2. Support title and description slots
3. Allow icon composition through children
4. Implement proper accessibility attributes (role="alert/status")
5. Use CVA for variant management

### For Alert Dialog Component:

1. Build on Radix UI AlertDialog primitive
2. Implement all core components (Content, Header, Footer, etc.)
3. Ensure proper keyboard navigation and focus management
4. Use CVA for consistent styling
5. Implement proper ARIA attributes
6. Support controlled and uncontrolled usage patterns
7. Provide sensible defaults for common use cases

### General Guidelines:

1. Follow shadcn's design system (consistent spacing, colors, typography)
2. Implement responsive behaviors
3. Test with various screen readers
4. Ensure proper color contrast ratios
5. Support both light and dark modes
6. Provide clear documentation with examples
7. Implement comprehensive Storybook stories for variants

## References

- [shadcn/ui Alert Documentation](https://ui.shadcn.com/docs/components/alert)
- [shadcn/ui Alert Dialog Documentation](https://ui.shadcn.com/docs/components/alert-dialog)
- [shadcn/ui Sonner Documentation](https://ui.shadcn.com/docs/components/sonner)
- [Radix UI Alert Dialog Accessibility](https://www.radix-ui.com/docs/primitives/components/alert-dialog#accessibility)
- [Radix UI Toast Accessibility](https://www.radix-ui.com/docs/primitives/components/toast#accessibility)