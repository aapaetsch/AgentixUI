# Toast / Notification Component Research

## Typical Use Cases for Toast Notifications in Web Applications

1. **System Feedback**
   - Confirmation of successful actions (e.g., "File uploaded successfully")
   - Error notifications (e.g., "Failed to save changes")
   - Warning messages (e.g., "Storage is almost full")

2. **User Action Results**
   - Form submission confirmations
   - Undo/redo operations
   - Copy/paste confirmations

3. **Contextual Information**
   - Feature announcements
   - Tips and suggestions
   - Progress updates for background tasks

4. **Communication Notifications**
   - Messages received
   - Mentions in collaborative tools
   - Comments on posts

## Industry Examples of Effective Toast Implementations

1. **Material Design (Google)**
   - Bottom-aligned notifications that don't interrupt user flow
   - Single action button (typically "Undo" or "Retry")
   - Auto-dismiss after 4-10 seconds
   - Consistent styling with clear text and appropriate contrast

2. **Microsoft Fluent UI**
   - Positionable notifications with multiple action options
   - Persistent and non-persistent variants
   - Integration with system notification center

3. **Atlassian Design System**
   - Context-specific notifications with clear hierarchy
   - Actionable notifications with primary and secondary actions
   - Dismissal options with persistence controls

4. **GitHub**
   - Contextual notifications for actions (e.g., branch deleted)
   - Undo capabilities for destructive actions
   - Non-intrusive positioning that doesn't block content

## Accessibility Considerations for Toasts

1. **Screen Reader Compatibility**
   - Use `role="alert"` for critical/time-sensitive notifications
   - Use `role="status"` for informational messages
   - Implement `aria-live` attributes appropriately (`polite` vs `assertive`)
   - Provide clear, concise text content
   - Ensure proper announcement timing (not too frequent)

2. **Keyboard Navigation**
   - Focus should not be stolen by toast notifications
   - Toasts with actions should be keyboard accessible
   - Escape key should dismiss toasts when focused
   - Clear focus indicators for interactive elements within toasts

3. **Visual Accessibility**
   - Sufficient color contrast (minimum 4.5:1 for text)
   - Appropriate sizing for touch targets (minimum 44px)
   - Clear visual hierarchy and readable text sizes
   - Consideration for users with motion sensitivity (reduced motion preferences)

4. **Timing and Duration**
   - Minimum 4 seconds duration for auto-dismiss toasts
   - Maximum 10 seconds for standard notifications
   - Option to pause timers on hover/focus
   - Persistent option for important notifications

## Anti-Patterns and When Not to Use Toasts

1. **Overuse and Interruption**
   - Don't use toasts for critical information requiring immediate attention (use modals)
   - Avoid frequent toasts that interrupt user workflow
   - Don't stack multiple toasts simultaneously
   - Avoid using toasts for complex interactions requiring user input

2. **Content and Design Issues**
   - Don't include too much text (should be brief and scannable)
   - Avoid generic messages like "Something happened" or "Error occurred"
   - Don't use toasts for navigation or as primary calls-to-action
   - Avoid toasts without clear actions when actions are expected

3. **Timing Problems**
   - Don't auto-dismiss toasts with important actions too quickly
   - Avoid showing toasts during critical user interactions
   - Don't show toasts immediately after page load without user context
   - Avoid inconsistent timing across different types of notifications

4. **Technical Anti-Patterns**
   - Don't use toasts for form validation errors (use inline validation)
   - Avoid toasts for information that needs to be retained (use persistent notifications)
   - Don't show toasts for actions the user didn't initiate
   - Avoid toasts for complex data that requires examination

## Common User Interaction Patterns with Toasts

1. **Consumption Patterns**
   - Users typically read toasts from left to right, top to bottom
   - Action buttons are usually clicked more frequently than dismiss buttons
   - Many users ignore toasts entirely if they appear frequently
   - Users expect consistent positioning of toasts

2. **Engagement Behaviors**
   - Hovering pauses auto-dismiss timers
   - Clicking outside dismisses non-persistent toasts
   - Keyboard users expect tab navigation through toast actions
   - Mobile users tap to interact with toast actions

3. **Expectations and Mental Models**
   - Users expect undo functionality for destructive actions
   - Immediate feedback is expected after triggering an action
   - Users expect similar styling and behavior across an application
   - Time-sensitive information should be clearly indicated
