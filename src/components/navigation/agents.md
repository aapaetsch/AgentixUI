# Navigation Components - Agent Context
## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely, call the mcp server for component examples when adding new components and see how they are implemented in shadcn/ui.
- You should always create a **TODO LIST** by calling the todo list tool whenever you are given a new task to work on. You should update the TODO LIST as you make progress on the task. You will never forget to create or update the TODO LIST and you will not stop until the task and the TODO LIST is complete.
- After you complete a task involving code changes, you must call the `Dev Runner` subagent using the `agent/runSubagent` tool to run the build and Storybook to verify that everything works correctly. If there are any build or Storybook errors, you must fix them before marking the task as complete.
- As components are implemented, you must update their status in the `docs/ROADMAP.md` file to reflect current progress.
- **Inspiration:** Draw from **Google Material Design** and **Tailwind Catalyst** components for guidance on structure, spacing, and visual hierarchy.

## Overview
A comprehensive navigation system with three core components: Navbar, Navrail, and Navdrawer. All components share a unified context (`NavigationProvider`) for consistent state management across the application.

## Component Structure

### NavigationProvider
The root context provider that manages shared navigation state.

```tsx
interface NavigationContextValue {
  activeItem: string | undefined;
  setActiveItem: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}
```

### Navbar (Horizontal Top Navigation)
- **Variants:** `default`, `prominent`, `dense`, `centered`, `split`
- **Sub-components:** `NavbarBrand`, `NavbarContent`, `NavbarActions`
- **Features:** Sticky positioning, bordered/elevated styling, mobile menu integration

### Navrail (Vertical Sidebar)
- **Variants:** `standard`, `compact`, `mini`, `floating`, `inset`
- **Sub-components:** `NavrailHeader`, `NavrailContent`, `NavrailFooter`, `NavrailCollapseButton`
- **Features:** Collapsible, left/right positioning, responsive visibility (hidden on mobile)

### Navdrawer (Slide-in Panel)
- **Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `full`
- **Anchors:** `left`, `right`
- **Sub-components:** `NavdrawerContent`, `NavdrawerHeader`, `NavdrawerTitle`, `NavdrawerFooter`, `NavdrawerClose`
- **Features:** Modal overlay, smooth animations, integrated with NavigationProvider

### Shared Components
- **NavItem:** Individual navigation item with icon, label, badge support
- **NavSection:** Grouped navigation items with optional title and collapsible behavior
- **NavDivider:** Visual separator between sections
- **NavBadge:** Notification/status badge for nav items

## Premium Components (Coming Soon)
- **PremiumNavItemWithSubmenu:** Navigation item with expandable submenu support
- **Enhanced PremiumNavSection:** Section component with submenu capabilities

## Props Summary

### NavigationProvider
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultActiveItem` | `string` | - | Initial active item |
| `activeItem` | `string` | - | Controlled active item |
| `onActiveItemChange` | `(id: string) => void` | - | Active item change callback |
| `defaultCollapsed` | `boolean` | `false` | Initial collapsed state |
| `collapsed` | `boolean` | - | Controlled collapsed state |
| `onCollapsedChange` | `(collapsed: boolean) => void` | - | Collapse change callback |
| `defaultMobileOpen` | `boolean` | `false` | Initial mobile drawer state |
| `mobileOpen` | `boolean` | - | Controlled mobile drawer state |
| `onMobileOpenChange` | `(open: boolean) => void` | - | Mobile open change callback |

### NavItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique identifier |
| `label` | `string` | **required** | Display text |
| `icon` | `ReactNode` | - | Icon element |
| `href` | `string` | - | Link URL (renders as anchor) |
| `badge` | `ReactNode` | - | Badge content |
| `active` | `boolean` | - | Override active state |
| `collapsed` | `boolean` | - | Override collapsed display |
| `asChild` | `boolean` | `false` | Use slot pattern |

## Dependencies
- `@radix-ui/react-dialog` - For Navdrawer modal behavior
- `@radix-ui/react-slot` - For asChild pattern
- `class-variance-authority` - For variant styling
- `lucide-react` - For icons (Menu, X, ChevronLeft, ChevronRight, PanelLeft, PanelLeftClose)

## Styling Decisions

### CVA Variants
- **Navbar:** Height variants (64px default, 48px dense, 96px prominent), sticky/bordered/elevated modifiers
- **Navrail:** Width variants (240px standard, 72px compact, 56px mini), floating style with shadow/border-radius
- **Navdrawer:** Size variants for width, left/right anchor positioning
- **NavItem:** Active state with primary color, collapsed state centers icon

### CSS Variables Used
- `--motion-duration-short/medium/long` - Animation timing
- `--motion-easing-standard` - Animation easing
- `--radius` / `--radius-lg` - Border radius
- `--elevation-2/3/5` - Shadow levels
- `--border` - Border color
- `--primary` / `--primary-foreground` - Active state colors
- `--accent` / `--accent-foreground` - Hover state colors
- `--muted-foreground` - Secondary text

### Responsive Behavior
- Navbar shows mobile menu button on `lg:hidden`
- Navrail hidden on mobile with `hidden md:flex`
- Navdrawer designed for mobile slide-in navigation
- Collapsed state available for desktop space optimization

## Maintenance Notes

### Known Edge Cases
1. **Context Optional:** Components can work without `NavigationProvider` using internal state
2. **Controlled/Uncontrolled:** All state supports both modes
3. **Link vs Button:** `NavItem` with `href` renders as anchor, otherwise as button
4. **Accessibility:** ARIA attributes for navigation, current page, expanded state

### Animation Performance
- Uses `transform` for slide animations (GPU accelerated)
- `duration-[var(--motion-duration-long)]` for drawer open/close
- `duration-[var(--motion-duration-short)]` for hover states

### RTL Support
- Uses `left-0` / `right-0` for positioning (CSS handles RTL)
- `ChevronLeft` / `ChevronRight` icons may need mirroring for RTL

## Usage Patterns

### Basic Application Layout
```tsx
<NavigationProvider defaultActiveItem="home">
  <Navbar>
    <NavbarBrand>Logo</NavbarBrand>
    <NavbarContent>...</NavbarContent>
    <NavbarActions>...</NavbarActions>
  </Navbar>
  <div className="flex">
    <Navrail>
      <NavrailHeader>...</NavrailHeader>
      <NavrailContent>
        <NavSection>
          <NavItem id="home" label="Home" icon={<Home />} />
        </NavSection>
      </NavrailContent>
    </Navrail>
    <main>Content</main>
  </div>
  <Navdrawer>
    <NavdrawerContent>Mobile menu</NavdrawerContent>
  </Navdrawer>
</NavigationProvider>
```

### Mobile-First with Drawer
```tsx
<NavigationProvider>
  <Navbar showMobileMenuButton />
  <Navdrawer>
    <NavdrawerContent>
      <NavSection>
        <NavItem id="home" label="Home" />
      </NavSection>
    </NavdrawerContent>
  </Navdrawer>
</NavigationProvider>
```


