# Tabs Components

A comprehensive tabs system following Material Design 3 patterns with shadcn/ui styling options. Built on Radix UI Tabs primitive for full accessibility support.

## Installation

```bash
npm install @aidan/ui
```

## Usage

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@aidan/ui';

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

## Styling

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

## Accessibility

- Full keyboard navigation via Radix UI
  - Arrow keys: Navigate between tabs
  - Enter/Space: Activate tab
  - Home/End: Jump to first/last tab
- Proper ARIA roles and attributes
- Focus ring visible on keyboard focus
- Screen reader announces tab state
- Disabled tabs are focusable but not activatable

## Dependencies

- `@radix-ui/react-tabs` - Core tabs primitive for accessibility and state management
- `class-variance-authority` - Variant management
- `@aidan/ui/lib/utils` - `cn()` utility for class merging

## License

MIT © Aidan