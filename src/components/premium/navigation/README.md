# Premium Navigation Components

## Overview
Premium navigation components extend the free navigation tier with advanced selection animations, visual indicators, and submenu support. These components are designed for applications requiring rich navigation experiences with smooth transitions and nested menu structures.

## Components

### PremiumNavItem
Enhanced navigation item with selection animations and visual indicators.

**Features:**
- 5 selection variants (default, subtle, filled, bordered, ghost)
- 5 indicator types (none, left, right, top, bottom, dot)
- Badge support
- Active state management
- Full keyboard navigation
- Disabled state support

**Props:**
- `id` (string, required): Unique identifier for navigation
- `label` (string, required): Display text
- `icon` (ReactNode, optional): Leading icon
- `badge` (ReactNode, optional): Trailing badge
- `href` (string, optional): Navigation URL
- `variant` (string, optional): Selection style - "default" | "subtle" | "filled" | "bordered" | "ghost"
- `indicator` (string, optional): Visual indicator - "none" | "left" | "right" | "top" | "bottom" | "dot"
- `disabled` (boolean, optional): Disable interaction
- `className` (string, optional): Additional CSS classes

### PremiumNavItemWithSubmenu
Navigation item with expandable submenu using accordion functionality.

**Features:**
- Accordion-based expansion
- Custom expand/collapse icons
- AnimatedChevron integration
- Unlimited nesting levels
- Controlled and uncontrolled state support
- Visual left border indicator for submenu content

**Props:**
- All PremiumNavItem props (except orientation)
- `children` (ReactNode, required): Submenu items
- `defaultOpen` (boolean, optional): Start expanded (default: false)
- `defaultExpanded` (boolean, optional): Alias for defaultOpen (deprecated)
- `open` (boolean, optional): Controlled open state
- `expanded` (boolean, optional): Alias for open (deprecated)
- `onOpenChange` ((open: boolean) => void, optional): Callback when open state changes
- `expandIcon` (ReactNode, optional): Custom expand icon
- `collapseIcon` (ReactNode, optional): Custom collapse icon
- `animated` (boolean, optional): Use AnimatedChevron (default: true)
- `level` (number, optional): Nesting level for indentation (default: 0)

### PremiumSubmenuItem
Compact navigation item designed for submenu contexts with smaller sizing.

**Features:**
- Smaller height (36px vs 44px)
- Compact padding for visual hierarchy
- Simplified variant options
- Works seamlessly with PremiumNavItemWithSubmenu

**Props:**
- `id` (string, required): Unique identifier
- `label` (string, required): Display text
- `icon` (ReactNode, optional): Leading icon (size-4)
- `badge` (ReactNode, optional): Trailing badge
- `href` (string, optional): Navigation URL
- `active` (boolean, optional): Override active state
- `shape` (string, optional): "rectangular" | "pill" (default: rectangular)
- `variant` (string, optional): "default" | "subtle" | "ghost" (default: default)
- `indicator` (string, optional): "none" | "left" | "dot" (default: none)
- `disabled` (boolean, optional): Disable interaction
- `onNavigate` ((id: string) => void, optional): Navigation callback
- `className` (string, optional): Additional CSS classes

### PremiumNavSection
Groups navigation items with optional collapsible header.

**Features:**
- Section title
- Optional collapsible behavior with AnimatedChevron
- Visual separation
- Consistent spacing

**Props:**
- `title` (string, optional): Section heading
- `collapsible` (boolean, optional): Enable collapse behavior
- `defaultCollapsed` (boolean, optional): Start collapsed
- `children` (ReactNode, required): Navigation items
- `className` (string, optional): Additional CSS classes

## Usage Examples

### Basic Submenu with PremiumSubmenuItem
```tsx
import { 
  PremiumNavItemWithSubmenu, 
  PremiumSubmenuItem, 
  NavigationProvider 
} from "@agentix/ui";
import { Folder, FileText, Image } from "lucide-react";

<NavigationProvider defaultActiveItem="documents">
  <PremiumNavItemWithSubmenu
    id="files"
    label="Files"
    icon={<Folder />}
    animated
    defaultOpen
  >
    <PremiumSubmenuItem
      id="documents"
      label="Documents"
      icon={<FileText />}
    />
    <PremiumSubmenuItem
      id="images"
      label="Images"
      icon={<Image />}
    />
  </PremiumNavItemWithSubmenu>
</NavigationProvider>
```

### Custom Expand/Collapse Icons
```tsx
import { ChevronRight, ChevronDown, Plus, Minus } from "lucide-react";

<PremiumNavItemWithSubmenu
  id="settings"
  label="Settings"
  icon={<Settings />}
  expandIcon={<Plus className="size-4" />}
  collapseIcon={<Minus className="size-4" />}
  animated={false}
>
  <PremiumSubmenuItem id="profile" label="Profile" />
</PremiumNavItemWithSubmenu>
```

### Nested Submenus
```tsx
<PremiumNavItemWithSubmenu
  id="files"
  label="My Files"
  icon={<Folder />}
  animated
>
  <PremiumSubmenuItem id="docs" label="Documents" icon={<FileText />} />
  
  <PremiumNavItemWithSubmenu
    id="media"
    label="Media"
    icon={<FolderOpen />}
    animated
    level={1}  // Increase indentation
  >
    <PremiumSubmenuItem id="photos" label="Photos" icon={<Image />} />
    <PremiumSubmenuItem id="videos" label="Videos" icon={<Video />} />
  </PremiumNavItemWithSubmenu>
</PremiumNavItemWithSubmenu>
```

### Controlled State
```tsx
const [openMenu, setOpenMenu] = useState<string | null>(null);

<PremiumNavItemWithSubmenu
  id="files"
  label="Files"
  open={openMenu === "files"}
  onOpenChange={(open) => setOpenMenu(open ? "files" : null)}
>
  <PremiumSubmenuItem id="docs" label="Documents" />
</PremiumNavItemWithSubmenu>
```

### Sections with Submenus
```tsx
<PremiumNavSection title="Files">
  <PremiumNavItemWithSubmenu
    id="my-files"
    label="My Files"
    animated
  >
    <PremiumSubmenuItem id="docs" label="Documents" />
  </PremiumNavItemWithSubmenu>
</PremiumNavSection>
```

### With Badges
```tsx
<PremiumNavItemWithSubmenu
  id="mail"
  label="Mail"
  icon={<Mail />}
  badge={<span className="text-xs bg-destructive text-destructive-foreground px-1.5 rounded-full">5</span>}
  animated
  defaultOpen
>
  <PremiumSubmenuItem
    id="inbox"
    label="Inbox"
    icon={<Inbox />}
    badge={<span className="text-xs bg-primary text-primary-foreground px-1.5 rounded-full">3</span>}
  />
</PremiumNavItemWithSubmenu>
```

## Styling

### Size Comparison
| Property | PremiumNavItem | PremiumSubmenuItem |
|----------|----------------|---------------------|
| Height | 44px | 36px |
| Padding | 12px horizontal, 10px vertical | 8px horizontal, 6px vertical |
| Icon size | 20px (size-5) | 16px (size-4) |
| Gap | 12px (gap-3) | 8px (gap-2) |

### Variant Descriptions
| Variant | Description |
|---------|-------------|
| default | Background change on hover/active |
| subtle | Soft background with smooth transitions |
| filled | Solid background for active state (PremiumNavItem only) |
| bordered | Border highlight on active (PremiumNavItem only) |
| ghost | Minimal styling, text color changes only |

### Indicator Descriptions
| Indicator | Description |
|-----------|-------------|
| left | Vertical bar on left edge |
| right | Vertical bar on right edge (PremiumNavItem only) |
| top | Horizontal bar on top edge (PremiumNavItem only) |
| bottom | Horizontal bar on bottom edge (PremiumNavItem only) |
| dot | Small circular indicator |

## Accessibility
- Full keyboard navigation (Tab, Enter, Space, Arrow keys)
- ARIA labels and roles
- Screen reader announcements for state changes
- Focus visible styles
- Disabled state properly communicated
- `aria-expanded` attribute for submenu toggles
- `role="group"` for submenu content

## Dependencies
- `class-variance-authority`: Variant management
- `lucide-react`: Default icons
- Free tier: `NavigationProvider`, `useNavigation`, `Accordion`, `AnimatedChevron`, `NavBadge`

## Best Practices
1. Use `PremiumSubmenuItem` instead of `PremiumNavItem` inside submenus for proper sizing
2. Use consistent variant/indicator combinations across the app
3. Limit nesting depth to 3 levels for usability
4. Use `animated={true}` (default) for smooth chevron transitions
5. Use badges sparingly in submenus to avoid visual clutter
6. Test with keyboard navigation
7. Ensure adequate color contrast in all states
