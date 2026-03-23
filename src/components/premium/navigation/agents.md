# Premium Navigation Components
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Component: PremiumNavItem

### Purpose
Advanced navigation item with multiple selection animation variants and visual indicators for premium user experiences.

### Props Interface
```typescript
interface PremiumNavItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  href?: string;
  variant?: "default" | "subtle" | "filled" | "bordered" | "ghost";
  indicator?: "none" | "left" | "right" | "bottom" | "top" | "dot";
  disabled?: boolean;
  className?: string;
}
```

### Dependencies
- `class-variance-authority` (v0.7.1): CVA variant system for premiumNavItemVariants
- `lucide-react`: Icon library (used in stories, not required)
- Free tier: NavigationProvider context, useNavigation hook

### Styling Decisions
**CVA Variants:**
- `variant`: Controls overall selection style
  - `default`: Standard background hover/active
  - `subtle`: Soft transitions with muted colors
  - `filled`: Solid primary background when active
  - `bordered`: Thin border highlight on active
  - `ghost`: Minimal styling with hover text changes

- `indicator`: Adds visual selection markers
  - `left`: 3px left border in primary color
  - `right`: 3px right border in primary color
  - `bottom`: 2px bottom border in primary color
  - `top`: 2px top border in primary color
  - `dot`: 6px circular indicator (left positioned)

**Animation Strategy:**
- All transitions use `transition-colors duration-200` for smooth color changes
- Hover states provide immediate visual feedback
- Active states are more prominent than hover
- Disabled states reduce opacity to 50%

**Accessibility:**
- Uses `button` element with proper ARIA attributes
- Active state announced via `aria-current="page"`
- Disabled state uses `aria-disabled`
- Focus-visible styles for keyboard navigation
- Supports href for navigation links

### Maintenance Notes
**Known Edge Cases:**
1. Multiple indicators + variants may conflict visually - test combinations carefully
2. Badge positioning may need adjustment with certain indicators
3. Long labels may wrap awkwardly - consider truncation or tooltip
4. Icon sizes should be consistent (size-4 recommended)

---

## Component: PremiumNavItemWithSubmenu

### Purpose
Navigation item with accordion-based submenu expansion, supporting custom icons and unlimited nesting.

### Props Interface
```typescript
interface PremiumNavItemWithSubmenuProps extends PremiumNavItemProps {
  children: React.ReactNode;
  defaultOpen?: boolean;       // Primary prop
  defaultExpanded?: boolean;   // Alias for defaultOpen (deprecated)
  open?: boolean;              // Controlled open state
  expanded?: boolean;          // Alias for open (deprecated)
  onOpenChange?: (open: boolean) => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  animated?: boolean;          // Use AnimatedChevron
  level?: number;              // Nesting level for indentation
}
```

### Dependencies
- Free tier: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- Free tier: `AnimatedChevron` component
- All PremiumNavItem dependencies

### Styling Decisions
**Accordion Integration:**
- Uses unstyled Accordion components with custom styling
- Trigger styled to match PremiumNavItem appearance
- Content uses left padding based on level for visual hierarchy
- Left border indicator (border-l border-border/50) for submenu content
- Smooth expand/collapse with accordion animations

**Icon Strategy:**
1. Custom Icons: Use provided expandIcon/collapseIcon props
2. AnimatedChevron: Pass `animated={true}` to use built-in component
3. Default: Falls back to static ChevronRight with rotation

**Nesting Support:**
- `level` prop controls indentation (pl-4 + level * 4)
- Each nesting level adds consistent indentation
- No limit on nesting depth (though 3 levels recommended for UX)

### Maintenance Notes
**Known Edge Cases:**
1. Deeply nested menus (>3 levels) may become hard to navigate
2. AnimatedChevron positioning may need adjustment with certain layouts
3. Submenu content may overflow container - test with long labels
4. Default expanded state doesn't persist across rerenders without controlled state

**Integration Points:**
- Reuses existing Accordion component logic
- Inherits NavigationProvider context for active state
- Compatible with all PremiumNavItem variants and indicators

---

## Component: PremiumSubmenuItem

### Purpose
Smaller, compact navigation item designed specifically for submenu contexts with proper visual hierarchy.

### Props Interface
```typescript
interface PremiumSubmenuItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  href?: string;
  active?: boolean;
  shape?: "rectangular" | "pill";
  variant?: "default" | "subtle" | "ghost";
  indicator?: "none" | "left" | "dot";
  disabled?: boolean;
  onNavigate?: (id: string) => void;
  className?: string;
}
```

### Styling Decisions
**Size Differences from PremiumNavItem:**
- Height: 36px (vs 44px for main nav items)
- Padding: 8px horizontal, 6px vertical (reduced)
- Icon size: 16px (size-4) vs 20px (size-5)
- Gap: 8px (gap-2) vs 12px (gap-3)

**CVA Variants:**
- `shape`: rectangular (default) or pill
- `variant`: default, subtle, ghost (fewer than PremiumNavItem)
- `indicator`: none, left, dot (simplified set)

**Visual Hierarchy:**
- Lighter text color (foreground/60-70%)
- Smaller active state background
- Reduced padding for compact appearance
- Works within border-l container of parent submenu

### Maintenance Notes
**Usage Pattern:**
- Always use inside PremiumNavItemWithSubmenu
- Not recommended for top-level navigation
- Badge support included but should be used sparingly in submenus

---

## Component: PremiumNavSection

### Purpose
Groups related navigation items with optional title and collapsible behavior.

### Props Interface
```typescript
interface PremiumNavSectionProps {
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### Dependencies
- `class-variance-authority`: Minimal styling
- `AnimatedChevron`: For collapsible sections

### Styling Decisions
**Section Title:**
- Small uppercase text (text-xs uppercase)
- Muted foreground color
- Font weight semibold for emphasis
- Bottom margin for spacing

**Collapsible Behavior:**
- Uses AnimatedChevron for consistent animation
- Title becomes clickable toggle when collapsible
- Content animates smoothly

### Maintenance Notes
**Usage Patterns:**
1. Static sections: Just pass title and children
2. Collapsible sections: Enable `collapsible` prop
3. Default collapsed: Use `defaultCollapsed` with `collapsible`

---

## General Architecture Notes

### State Management
- Uses NavigationProvider context for active item tracking
- Accordion handles expand/collapse state internally
- Controlled state available via open/onOpenChange props
- Both controlled and uncontrolled patterns supported

### Theme Integration
- Uses CSS variables from globals.css (--primary, --muted, etc.)
- Respects light/dark mode automatically
- All colors reference theme tokens
- rem-based spacing for scalability

### Component Composition
```
PremiumNavSection
  ├── PremiumNavItemWithSubmenu (can contain any level of nesting)
  │     ├── PremiumSubmenuItem (preferred for submenu items)
  │     └── PremiumNavItemWithSubmenu (nested)
  │           └── PremiumSubmenuItem
  └── PremiumNavItem
```

### Keyboard Navigation
- Tab: Move between items
- Enter/Space: Activate item or toggle submenu
- Arrow keys: Navigate within submenu
- Escape: Close submenu (accordion behavior)


