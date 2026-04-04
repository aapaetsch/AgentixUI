# Tabs Components
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

A comprehensive tabs system following Material Design 3 patterns with shadcn/ui styling options. Built on Radix UI Tabs primitive for full accessibility support.

## Components

### Tabs
Root container that manages tab state and layout orientation.

### TabsList
Container for tab triggers with variant styling and size options.

### TabsTrigger
Individual tab button with icon support and animated indicator.

### TabsContent
Content panel that displays when its associated tab is active.

## Props

### Tabs Props
```typescript
interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  orientation?: "horizontal" | "vertical";  // Tab layout direction
  defaultValue?: string;                    // Default active tab (uncontrolled)
  value?: string;                           // Active tab (controlled)
  onValueChange?: (value: string) => void;  // Callback when tab changes
  activationMode?: "automatic" | "manual";  // Tab activation behavior
  className?: string;                       // Additional class names
}
```

### TabsList Props
```typescript
interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: "primary" | "secondary" | "pills" | "underline";  // Visual style
  size?: "sm" | "md" | "lg";                                  // Size variant
  orientation?: "horizontal" | "vertical";                    // Layout direction
  className?: string;                                         // Additional class names
}
```

### TabsTrigger Props
```typescript
interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: "primary" | "secondary" | "pills" | "underline";  // Visual style (match TabsList)
  size?: "sm" | "md" | "lg";                                  // Size variant
  orientation?: "horizontal" | "vertical";                    // Layout direction
  icon?: React.ReactNode;                                     // Optional leading icon
  value: string;                                              // Tab identifier (required)
  disabled?: boolean;                                         // Disable interaction
  className?: string;                                         // Additional class names
}
```

### TabsContent Props
```typescript
interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  size?: "sm" | "md" | "lg";   // Affects padding/margin
  value: string;              // Tab identifier (required)
  forceMount?: true;          // Keep mounted when inactive
  className?: string;         // Additional class names
}
```

## Dependencies

- `@radix-ui/react-tabs` - Core tabs primitive for accessibility and state management
- `class-variance-authority` - Variant management
- `../../lib/utils` - `cn()` utility for class merging

## Styling Decisions

### Variant Comparison

| Variant | Container | Indicator | Use Case |
|---------|-----------|-----------|----------|
| `primary` | Transparent + border | 3dp rounded bottom | Main navigation (MD3) |
| `secondary` | Transparent + border | 2dp full-width bottom | Sub-navigation (MD3) |
| `pills` | Muted background | Filled background | Segment controls (shadcn) |
| `underline` | Transparent + border | Border bottom | Simple tabs |

### Size Variants

| Size | List Height | Font Size | Icon Size |
|------|-------------|-----------|-----------|
| `sm` | 36-40px | text-xs | 16px |
| `md` | 40-48px | text-sm | 20px |
| `lg` | 48-64px | text-base | 24px |

### MD3 Specifications

**Primary Tabs:**
- Container height: 48dp (text only), 64dp (with icons)
- Active indicator: 3dp height, fully rounded top corners
- Indicator inset: 8dp from each side (24dp minimum width)
- Active color: Primary
- Inactive color: On-surface-variant

**Secondary Tabs:**
- Container height: 48dp
- Active indicator: 2dp height, full width
- Active indicator shape: 3, 3, 0, 0 corner radius
- Active color: On-surface
- Inactive color: On-surface-variant

### Motion & Animation

- **Duration**: 200ms standard (`--motion-duration-medium`)
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` (`--motion-easing-standard`)
- **Indicator**: Width/height animates from 0 to full
- **Content**: Opacity fade transition

### Vertical Orientation

When `orientation="vertical"`:
- Tabs layout changes to row (tabs on left, content on right)
- Active indicator moves from bottom to right edge
- Triggers align to start (left) instead of center
- Border changes from bottom to right

## Maintenance Notes

### Accessibility

- Full keyboard navigation via Radix UI
  - Arrow keys: Navigate between tabs
  - Enter/Space: Activate tab
  - Home/End: Jump to first/last tab
- Proper ARIA roles and attributes
- Focus ring visible on keyboard focus
- Screen reader announces tab state
- Disabled tabs are focusable but not activatable

### Variant Consistency

When using tabs, ensure the `variant`, `size`, and `orientation` props are consistent across `TabsList` and `TabsTrigger` components:

```tsx
// Correct: Matching variants
<TabsList variant="primary" size="md">
  <TabsTrigger variant="primary" size="md" value="tab1">Tab 1</TabsTrigger>
</TabsList>

// Incorrect: Mismatched variants
<TabsList variant="primary" size="md">
  <TabsTrigger variant="pills" size="lg" value="tab1">Tab 1</TabsTrigger>
</TabsList>
```

### Icon Usage

- Icons are optional via the `icon` prop on `TabsTrigger`
- Icons are sized automatically based on the `size` variant
- For icon-only tabs, add `aria-label` for accessibility
- MD3 recommends consistent icon usage (all tabs have icons or none)

### Edge Cases

- Empty tab content is valid but renders nothing
- `forceMount` on `TabsContent` keeps content in DOM (useful for forms)
- Disabled tabs maintain their position in tab order
- Controlled mode requires both `value` and `onValueChange`
- Default to first enabled tab if no `defaultValue` provided

### Performance

- Uses CSS transitions instead of JavaScript animations
- Content hidden with `display: none` when inactive (unless `forceMount`)
- Radix UI handles focus management efficiently
- No re-renders on hover/focus states

### CSS Variables Used

```css
--motion-duration-medium      /* 200ms - animation timing */
--motion-easing-standard      /* cubic-bezier(0.2, 0, 0, 1) */
--border                      /* Border color */
--muted                       /* Pills background */
--muted-foreground           /* Inactive text color */
--foreground                 /* Active text (secondary) */
--primary                    /* Active text/indicator (primary) */
--background                 /* Pills active background */
--accent                     /* Hover background */
--ring                       /* Focus ring color */
```

## Usage Examples

```tsx
// Basic usage
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>

// MD3 Primary with icons
<Tabs defaultValue="home">
  <TabsList variant="primary" size="lg">
    <TabsTrigger variant="primary" size="lg" value="home" icon={<Home />}>
      Home
    </TabsTrigger>
    <TabsTrigger variant="primary" size="lg" value="profile" icon={<User />}>
      Profile
    </TabsTrigger>
  </TabsList>
  <TabsContent value="home">Home content</TabsContent>
  <TabsContent value="profile">Profile content</TabsContent>
</Tabs>

// Shadcn pills style
<Tabs defaultValue="all">
  <TabsList variant="pills">
    <TabsTrigger variant="pills" value="all">All</TabsTrigger>
    <TabsTrigger variant="pills" value="active">Active</TabsTrigger>
    <TabsTrigger variant="pills" value="archived">Archived</TabsTrigger>
  </TabsList>
  <TabsContent value="all">All items</TabsContent>
</Tabs>

// Vertical orientation
<Tabs defaultValue="general" orientation="vertical">
  <TabsList variant="secondary" orientation="vertical">
    <TabsTrigger variant="secondary" orientation="vertical" value="general">
      General
    </TabsTrigger>
    <TabsTrigger variant="secondary" orientation="vertical" value="advanced">
      Advanced
    </TabsTrigger>
  </TabsList>
  <TabsContent value="general">General settings</TabsContent>
  <TabsContent value="advanced">Advanced settings</TabsContent>
</Tabs>

// Controlled state
const [tab, setTab] = useState("tab1");
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```


