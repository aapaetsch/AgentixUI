# @aidan/ui Component Library Roadmap

> **Business Model:** Freemium component library with Free, Premium, and Enterprise tiers.

---

## Tier Definitions

| Tier | Price | Target Audience | Component Types |
|------|-------|-----------------|-----------------|
| **Free** | $0 | Hobbyists, students, OSS projects | Core UI primitives, basic components |
| **Premium** | $XX/mo or $XX one-time | Professional developers, startups | Advanced components, complex patterns |
| **Enterprise** | $XXX+ | Teams, agencies | Templates, page layouts, admin dashboards |

---

## Free Tier Components

> Core primitives that form the foundation of any application. Always free.

### Base Components

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **Button** | ✅ Complete | `Button`, `IconButton`, `ToggleButton`, `ToggleIconButton`, `SplitButton`, `ButtonGroup`, `ConnectedButtonGroup` | Full button system |
| **Input** | ✅ Complete | Text input with icons, validation states, sizes | - |
| **Select** | ✅ Complete | Full Radix-based select with groups, labels, separators | Form control |
| **Switch** | ✅ Complete | Toggle switch with size variants | Basic form control |
| **Checkbox** | ✅ Complete | Single checkbox with indeterminate support | Basic form control |
| **Textarea** | ✅ Complete | Multi-line text input with auto-resize | - |
| **Radio** | ✅ Complete | Radio group with variants | Radix Radio Group |
| **Typography** | 📋 Planned | Headings, paragraphs, prose styling | - |
| **Badge** | ✅ Complete | `Badge`, `BadgeAnchor`, `AnimatedBadge` | Notification badges |
| **Chip** | ✅ Complete | `Chip`, `ChipGroup`, `ClosableChip` | Removable tags, filters, and status chips |
| **Avatar** | ✅ Complete | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarBadge`, `AnimatedAvatar` | User representation |

### Layout Components

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **Card** | ✅ Complete | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Content container |
| **Container** | ✅ Complete | `Container` with maxWidth, padding, center, background variants | Page wrapper |
| **Grid** | ✅ Complete | `Grid`, `GridItem` with cols (1-12), gap, padding, flow, alignment variants | Layout utility |
| **Flex** | ✅ Complete | `Flex`, `FlexRow`, `FlexCol`, `FlexItem` with direction, wrap, gap, align, justify variants | Layout utility |

### Utility Components

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **Dialog / Modal** | ✅ Complete | Modal with sizes, close button, overlay | Radix Dialog |
| **Popover** | ✅ Complete | Click-triggered floating content | Radix Popover |
| **Tooltip** | ✅ Complete | Hover/focus information popover | Radix Tooltip |
| **Tabs** | ✅ Complete | Tab navigation with variants | Radix Tabs |
| **Accordion** | ✅ Complete | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | Content disclosure |
| **Toast / Notification (basic)** | ✅ Complete | `toast()`, `useToast()`, `ToastProvider`, 5 variants, 6 positions, Avatar/Button integration | Store pattern with imperative API |
| **Slider (basic)** | 📋 Planned | Single-thumb, vertical/horizontal, value indicator variant | Basic slider planned for Free; advanced/range features in Premium
| **Breadcrumb** | 📋 Planned | Path/hierarchy navigation | Moved to Free tier
| **Pagination** | 📋 Planned | Page navigation controls | Moved to Free tier
| **Stepper (basic)** | 📋 Planned | Linear/basic stepper for simple multi-step flows | Complex/non-linear variants reserved for Premium
| **Navigation Menu** | 📋 Planned | Dropdown/navigation menu | Moved to Free tier
| **Sheet / Drawer (basic)** | ✅ Complete | Slide-out panel with position variants, modal/non-modal modes, basic focus/scroll locking | Core sheet functionality in Free tier
| **Skeleton** | ✅ Complete | `Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonAvatar`, `SkeletonButton`, `SkeletonInput` | Loading placeholders with pulse/shimmer animations

### Internal/Utility (Free)

| Component | Status | Notes |
|-----------|--------|-------|
| **AnimatedChevron** | ✅ Complete | Multiple animation presets, used by Accordion |
| **Spinner** | ✅ Complete | Loading indicator, multiple sizes |
| **Separator** | ✅ Complete | Visual divider with orientation, color, and opacity |

---

## Premium Tier Components 💎

> Advanced components with complex interactions, state management, or third-party dependencies.

### Implemented

| Component | Status | Variants/Sub-components | Notes |
|-----------|--------|------------------------|-------|
| **FAB** | ✅ Complete | `FAB`, `ExtendedFAB`, `FABMenu` | Material Design floating action buttons |
| **ComboBox** | ✅ Complete | `ComboBox`, `OutlinedComboBox` | Searchable select with virtualization, async loading, MD3 variants |
| **Slider** | ✅ Complete | Advanced slider: range, step variants, icon/thumb variants, MD3 animations | Radix Slider |
| **Premium Sheet** | ✅ Complete | `PremiumSheet` with swipe-to-dismiss gestures, spring animations, snap points | Advanced gesture support for mobile-first UIs |
| **Premium Toast** | ✅ Complete | `PremiumToastProvider`, `usePremiumToast`, `promise()` toasts, undo functionality | Promise-based loading states, undo actions, enhanced button variants |

### Planned

| Component | Priority | Description | Dependencies |
|-----------|----------|-------------|--------------|
| **Data Table** | 🔴 High | Sortable, filterable, paginated table with virtualization | TanStack Table |
| **Command Palette** | 🟢 Low | Searchable command menu (⌘K) for power users | cmdk |
| **Date Picker** | 🔴 High | Calendar date selection with localization and keyboard support | react-day-picker |
| **Time Picker** | 🔴 High | Advanced time selection controls and variants | - |
| **Date Range Picker** | 🔴 High | Date range selection, presets, and validations | react-day-picker |
| **Multi-Select** | 🔴 High | Virtualized/async multi-select with tags | - |
| **Stepper** | 🟡 Medium | Complex/non-linear steppers, branching flows and progress states | - |
| **Alert** | 🟡 Medium | Informational/warning messages | - |
| **Alert Dialog** | 🟡 Medium | Confirmation dialogs with strict accessibility | Radix Alert Dialog |

| **Context Menu** | 🟡 Medium | Right-click/context action menu with keyboard semantics | Radix Context Menu |
| **Hover Card** | 🟡 Medium | Hover preview card with accessible fallbacks | Radix Hover Card |
| **Dropdown Menu** | 🟡 Medium | Context/action menus with complex variants | Radix Dropdown Menu |
| **Progress** | 🟡 Medium | Complex/segmented determinate progress | - |
| **Collapsible** | 🟢 Low | Expandable section | Radix Collapsible |
| **Toggle Group** | 🟢 Low | Single/multi toggle selection | Radix Toggle Group |
| **Toolbar** | 🟢 Low | Action toolbar | Radix Toolbar |
| **Menubar** | 🟢 Low | Application menu bar (Electron/desktop enhancements as Premium) | Radix Menubar |
| **Resizable** | 🟢 Low | Resizable panels | react-resizable-panels |
| **Carousel** | 🟢 Low | Image/content carousel (Premium) | embla-carousel |
| **Color Picker** | 🟢 Low | Color selection (advanced variants in Premium) | - |
| **File Upload** | 🟢 Low | Drag & drop uploads; advanced/resumable features as Premium | - |
| **Rich Text Editor** | 🟢 Low | WYSIWYG editor | Tiptap or Slate |
| **Scroll Area** | 🟢 Low | Custom scrollbar container | Radix Scroll Area |
| **Aspect Ratio** | 🟢 Low | Maintain aspect ratio container | Radix Aspect Ratio |

### Enterprise Tier (Planned) 🏢

| Template/Component | Priority | Description |
|--------------------|----------|-------------|
| **Admin Dashboard Layout** | 🔴 High | Sidebar + header + content layout |
| **Auth Pages** | 🔴 High | Login, register, forgot password |
| **Settings Page** | 🟡 Medium | Multi-section settings layout |
| **Data Dashboard** | 🟡 Medium | Charts + cards + tables layout |
| **E-commerce Product Grid** | 🟡 Medium | Product listing with filters |
| **Chat Interface** | 🟡 Medium | AI/messaging chat UI |
| **Kanban Board** | 🟢 Low | Drag & drop task board |
| **Calendar View** | 🟢 Low | Month/week/day calendar |
| **Email Client Layout** | 🟢 Low | Three-panel email interface |
| **Documentation Layout** | 🟢 Low | Docs site with sidebar nav |

---

## Development Phases

### Phase 1: Foundation (Current) - Free Tier Focus
**Goal:** Complete all Free tier base components

- [x] Button system (complete)
- [x] Checkbox (complete)
- [x] Switch (complete)
- [x] Select (complete)
- [x] Badge (complete)
- [x] Avatar (complete)
- [x] Accordion (complete)
- [x] Spinner (complete)
- [x] Textarea (complete)
- [x] Input (complete)
- [x] Radio (complete)
- [ ] Typography

### Phase 2: Layout & Utility - Free Tier Focus
**Goal:** Complete layout helpers and utility components

- [x] Card (complete)
- [x] Container (complete)
- [x] Flex (complete)
- [x] Grid (complete)
- [x] Dialog / Modal (complete)
- [x] Popover (complete)
- [x] Tooltip (complete)
- [x] Tabs (complete)

### Phase 3: Premium Core
**Goal:** High-value premium components

- [x] FAB system (complete)
- [x] ComboBox/Autocomplete (complete)
- [x] Slider (advanced: range/step/icon variants)
- [x] Premium Sheet (swipe-to-dismiss, snap points, spring animations)
- [ ] Data Table
- [ ] Command Palette (low priority)
- [ ] Date Picker

### Phase 4: Premium Extended
**Goal:** Complete premium component library

- [ ] Time Picker / Date Range Picker
- [ ] Multi-Select
- [ ] Stepper (complex/non-linear variants)

### Phase 5: Enterprise Templates
**Goal:** Full page layouts and templates

- [ ] Admin Dashboard Layout
- [ ] Auth Pages
- [ ] Settings Page
- [ ] Data Dashboard

---

## Component Complexity Guidelines

**Free Tier Criteria:**
- Essential primitives needed in any application
- Single-purpose components
- Minimal configuration required
- Base form controls
- Basic layout utilities
- Core utility overlays (Dialog, Popover, Tooltip)

**Premium Tier Criteria:**
- Multi-feature components with complex state
- Significant development time investment
- Often requires third-party dependencies
- Advanced interactions (drag & drop, virtualization)
- Specialized use cases (data tables, date pickers)

**Enterprise Tier Criteria:**
- Full page layouts and templates
- Multiple components composed together
- Business-logic patterns included
- Comprehensive documentation & examples
- Real-world use case implementations

---

## Summary

| Tier | Implemented | Planned | Total |
|------|-------------|---------|-------|
| **Free** | 34 | 0 | 34 |
| **Premium** | 4 | 25 | 29 |
| **Enterprise** | 0 | 10 | 10 |

---

## Notes & Decisions

### Free Tier Rationale
These components are industry-standard primitives that users expect for free:
- **Base controls:** Button, Input, Select, Switch, Checkbox, Textarea, Radio
- **Display:** Typography, Badge, Avatar
- **Layout:** Card, Container, Grid/Flex
- **Utility overlays:** Dialog, Popover, Tooltip, Tabs, Accordion

### Premium Tier Rationale
- **FAB** → Material Design specific, specialized use case
- **Slider** → MD3 animations, range support, custom thumb icons, complex interactions
- **Data Table** → Complex, requires TanStack Table, significant dev time
- **Date Pickers** → Complex calendar logic, external dependencies
- **Command Palette** → Advanced pattern, requires cmdk

### Open Questions
- [ ] Pricing structure TBD ($X/mo vs one-time)
- [ ] Label component - include with Input or separate?
- [ ] Alert component - Free or Premium?

---

## Changelog

| Date | Change |
|------|--------|
| 2025-12-09 | Completed Toast component - Store/event emitter pattern with imperative `toast()` API, `useToast()` hook, 5 variants, 6 positions, Avatar/Button integration |
| 2025-12-08 | Completed Sheet/Drawer components - Free tier with basic functionality, Premium tier with gesture support, spring animations, and snap points |
| 2025-12-03 | Added Skeleton component to Free tier with pulse/shimmer animations, multiple variants (Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar, SkeletonButton, SkeletonInput) |
| 2025-12-03 | Began implementation of Sheet/Drawer components with gesture support in Premium tier |
| 2025-12-02 | Added Separator component to Free tier with orientation, color, and opacity support |
| 2025-01-XX | Added ComboBox component to Premium tier with virtualization, async loading, MD3 outlined variant |
| 2025-12-02 | Added Slider component to Premium tier with MD3 animations, range support, and three-state icon functionality |
| 2025-12-02 | Added Popover component with size variants and arrow support |
| 2025-12-02 | Added Grid layout component with GridItem sub-component |
| 2025-12-02 | Added Container and Flex layout components |
| 2025-12-01 | Updated roadmap to reflect implementation of Textarea, Card, Dialog, Tabs, Tooltip, Input, and Radio components |
| 2025-11-30 | Initial roadmap created |

---

# Aidan's React UI - Component Roadmap

## Toast/Notification Component Research

### Typical Use Cases for Toast Notifications in Web Applications

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

### Industry Examples of Effective Toast Implementations

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

### Accessibility Considerations for Toasts

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

### Anti-Patterns and When Not to Use Toasts

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

### Common User Interaction Patterns with Toasts

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

## Existing Components

### Free Components
- [x] Accordion
- [x] Animated Chevron
- [x] Avatar
- [x] Badge
- [x] Button
- [x] Card
- [x] Checkbox
- [x] Chip
- [x] Container
- [x] Dialog
- [x] Flex
- [x] Grid
- [x] Input
- [x] Popover
- [x] Radio
- [x] Select
- [x] Separator
- [x] Sheet
- [ ] Skeleton
- [ ] Spinner
- [ ] Switch
- [ ] Tabs
- [ ] Textarea
- [ ] Tooltip

### Premium Components
- [ ] Combobox
- [ ] FAB (Floating Action Button)
- [ ] Sheet (Enhanced)
- [ ] Slider

### Future Components Roadmap
- [ ] Toast/Notification
- [ ] Progress Indicators
- [ ] Breadcrumb
- [ ] Pagination
- [ ] Stepper/Wizard
- [ ] Data Table
- [ ] Carousel
- [ ] Tree View

