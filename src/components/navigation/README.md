# Navigation Components

A comprehensive navigation system for React applications featuring Navbar, Navrail, and Navdrawer components with shared context for unified state management.

## Installation

The navigation components are included in the `aapaetsch-ui-kit` package. Ensure you have the required dependencies:

```bash
npm install @radix-ui/react-dialog @radix-ui/react-slot lucide-react
```

## Quick Start

```tsx
import {
  NavigationProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  Navrail,
  NavrailContent,
  Navdrawer,
  NavdrawerContent,
  NavItem,
  NavSection,
} from "aapaetsch-ui-kit";
import { Home, Settings, Users } from "lucide-react";

function App() {
  return (
    <NavigationProvider defaultActiveItem="home">
      {/* Top navigation bar */}
      <Navbar>
        <NavbarBrand>My App</NavbarBrand>
        <NavbarActions>
          <Avatar />
        </NavbarActions>
      </Navbar>

      <div className="flex">
        {/* Sidebar navigation (desktop) */}
        <Navrail>
          <NavrailContent>
            <NavSection>
              <NavItem id="home" label="Home" icon={<Home />} />
              <NavItem id="users" label="Users" icon={<Users />} />
              <NavItem id="settings" label="Settings" icon={<Settings />} />
            </NavSection>
          </NavrailContent>
        </Navrail>

        {/* Main content */}
        <main className="flex-1 p-6">
          Your content here
        </main>
      </div>

      {/* Mobile drawer (controlled by Navbar menu button) */}
      <Navdrawer>
        <NavdrawerContent>
          <NavSection>
            <NavItem id="home" label="Home" icon={<Home />} />
            <NavItem id="users" label="Users" icon={<Users />} />
          </NavSection>
        </NavdrawerContent>
      </Navdrawer>
    </NavigationProvider>
  );
}
```

## Components

### NavigationProvider

The root context provider for managing navigation state across all navigation components.

```tsx
<NavigationProvider
  defaultActiveItem="home"
  onActiveItemChange={(id) => console.log("Active:", id)}
  defaultCollapsed={false}
  onCollapsedChange={(collapsed) => console.log("Collapsed:", collapsed)}
  defaultMobileOpen={false}
  onMobileOpenChange={(open) => console.log("Mobile open:", open)}
>
  {children}
</NavigationProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultActiveItem` | `string` | - | Initial active navigation item ID |
| `activeItem` | `string` | - | Controlled active item ID |
| `onActiveItemChange` | `(id: string) => void` | - | Callback when active item changes |
| `defaultCollapsed` | `boolean` | `false` | Initial collapsed state for navrail |
| `collapsed` | `boolean` | - | Controlled collapsed state |
| `onCollapsedChange` | `(collapsed: boolean) => void` | - | Callback when collapsed state changes |
| `defaultMobileOpen` | `boolean` | `false` | Initial mobile drawer open state |
| `mobileOpen` | `boolean` | - | Controlled mobile drawer state |
| `onMobileOpenChange` | `(open: boolean) => void` | - | Callback when mobile drawer state changes |

### Navbar

Horizontal top navigation bar with branding, navigation items, and actions.

```tsx
<Navbar 
  variant="default" // "default" | "prominent" | "dense" | "centered" | "split"
  sticky
  bordered
  elevated
>
  <NavbarBrand>
    <Logo />
    <span>My App</span>
  </NavbarBrand>
  <NavbarContent>
    <NavItem id="home" label="Home" />
    <NavItem id="about" label="About" />
  </NavbarContent>
  <NavbarActions>
    <Button>Sign In</Button>
  </NavbarActions>
</Navbar>
```

#### Navbar Variants

| Variant | Description |
|---------|-------------|
| `default` | Standard 64px height navigation |
| `prominent` | Larger 96px height with extra content area |
| `dense` | Compact 48px height for space-constrained views |
| `centered` | Navigation items centered, branding left, actions right |
| `split` | Navigation items split around center |

### Navrail

Vertical sidebar navigation that stays visible on desktop.

```tsx
<Navrail 
  variant="standard" // "standard" | "compact" | "mini" | "floating" | "inset"
  position="left" // "left" | "right"
  collapsible
>
  <NavrailHeader>
    <Logo />
    <span>Workspace</span>
    <NavrailCollapseButton />
  </NavrailHeader>
  <NavrailContent>
    <NavSection title="Main">
      <NavItem id="dashboard" label="Dashboard" icon={<BarChart />} />
    </NavSection>
  </NavrailContent>
  <NavrailFooter>
    <NavItem id="settings" label="Settings" icon={<Settings />} />
  </NavrailFooter>
</Navrail>
```

#### Navrail Variants

| Variant | Description |
|---------|-------------|
| `standard` | Full-width (240px) with text labels |
| `compact` | Icons-only (72px) |
| `mini` | Narrow (56px) icons, expands on hover |
| `floating` | Detached with rounded corners and elevation |
| `inset` | Inset from edges with margin |

### Navdrawer

Slide-in drawer for mobile navigation or secondary menus.

```tsx
<Navdrawer 
  open={isOpen}
  onOpenChange={setIsOpen}
  modal // Block background interaction
>
  <NavdrawerContent 
    anchor="left" // "left" | "right"
    size="md" // "xs" | "sm" | "md" | "lg" | "xl" | "full"
  >
    <NavdrawerHeader>
      <NavdrawerTitle>Menu</NavdrawerTitle>
    </NavdrawerHeader>
    <NavSection>
      <NavItem id="home" label="Home" icon={<Home />} />
    </NavSection>
    <NavdrawerFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </NavdrawerFooter>
  </NavdrawerContent>
</Navdrawer>
```

### NavItem

Individual navigation item with icon, label, and badge support.

```tsx
<NavItem
  id="inbox"
  label="Inbox"
  icon={<Inbox />}
  badge={<NavBadge variant="primary">5</NavBadge>}
  href="/inbox" // Optional: renders as anchor link
  active // Override active state
/>
```

### NavSection

Group of navigation items with optional title.

```tsx
<NavSection 
  title="Main Navigation"
  collapsible
  defaultCollapsed={false}
>
  <NavItem id="home" label="Home" />
  <NavItem id="about" label="About" />
</NavSection>
```

### NavDivider

Visual separator between sections.

```tsx
<NavSection>...</NavSection>
<NavDivider />
<NavSection>...</NavSection>
```

### NavBadge

Notification or status badge for nav items.

```tsx
<NavItem
  id="messages"
  label="Messages"
  badge={<NavBadge variant="destructive">New</NavBadge>}
/>
```

#### NavBadge Variants

| Variant | Description |
|---------|-------------|
| `default` | Muted background |
| `primary` | Primary color background |
| `destructive` | Destructive/red background |
| `outline` | Outlined style |

## Hooks

### useNavigation

Access navigation context within components.

```tsx
function MyComponent() {
  const { activeItem, setActiveItem, collapsed, mobileOpen } = useNavigation();
  
  return (
    <button onClick={() => setActiveItem("home")}>
      Go Home
    </button>
  );
}
```

### useNavigationOptional

Same as `useNavigation` but returns `undefined` if no provider exists (doesn't throw).

## Responsive Behavior

The navigation system is designed with mobile-first responsive behavior:

- **Mobile (< 768px):** Navrail is hidden, Navbar shows hamburger menu, Navdrawer is primary navigation
- **Tablet (768px+):** Navrail becomes visible, can be collapsed
- **Desktop (1024px+):** Full navigation visible with optimal spacing

## Accessibility

- All navigation components use proper ARIA landmarks (`role="navigation"`)
- Active items use `aria-current="page"`
- Collapsible sections use `aria-expanded`
- Full keyboard navigation support (Tab, Enter/Space, Escape)
- Focus management for drawer open/close

## Examples

### E-commerce Site

```tsx
<NavigationProvider>
  <Navbar variant="centered" elevated>
    <NavbarBrand>
      <ShoppingBag /> Store
    </NavbarBrand>
    <NavbarContent position="center">
      <NavItem id="products" label="Products" />
      <NavItem id="categories" label="Categories" />
      <NavItem id="deals" label="Deals" badge={<NavBadge variant="destructive">Sale</NavBadge>} />
    </NavbarContent>
    <NavbarActions>
      <IconButton><Search /></IconButton>
      <IconButton><ShoppingCart /></IconButton>
    </NavbarActions>
  </Navbar>
</NavigationProvider>
```

### Admin Dashboard

```tsx
<NavigationProvider defaultActiveItem="dashboard">
  <div className="flex h-screen">
    <Navrail variant="floating">
      <NavrailHeader>
        <Settings /> Admin
      </NavrailHeader>
      <NavrailContent>
        <NavSection>
          <NavItem id="dashboard" label="Dashboard" icon={<BarChart />} />
          <NavItem id="users" label="Users" icon={<Users />} />
          <NavItem id="content" label="Content" icon={<FileText />} />
        </NavSection>
      </NavrailContent>
    </Navrail>
    <main className="flex-1 p-6">Dashboard content</main>
  </div>
</NavigationProvider>
```

## Theming

All components use CSS variables for theming:

```css
:root {
  --primary: /* Active item color */;
  --accent: /* Hover state color */;
  --border: /* Border and divider color */;
  --muted-foreground: /* Section headers */;
  --elevation-2: /* Navbar shadow */;
  --elevation-5: /* Drawer shadow */;
}
```

## Navigation Submenus

Navigation components with submenu support are available in the unified library. These provide:

- Expandable submenu support with smooth animations
- Custom icons for expand/collapse states
- Nested submenu support (unlimited depth)
- Animated chevron transitions
- Enhanced styling variants

Navigation submenu components are available from `aapaetsch-ui-kit`:

```tsx
import {
  NavItem,
  NavItemWithSubmenu,
  NavSection,
} from "aapaetsch-ui-kit";

function NavigationWithSubmenus() {
  return (
    <Navrail>
      <NavrailContent>
        <NavSection title="Files">
          <NavItemWithSubmenu
            id="documents"
            label="Documents"
            icon={<Folder />}
            animated
          >
            <NavItem
              id="reports"
              label="Reports"
              icon={<FileText />}
            />
            <NavItem
              id="contracts"
              label="Contracts"
              icon={<FileText />}
            />
          </NavItemWithSubmenu>
        </NavSection>
      </NavrailContent>
    </Navrail>
  );
}
```

## TypeScript

All components are fully typed. Import types as needed:

```tsx
import type {
  NavigationProviderProps,
  NavbarProps,
  NavrailProps,
  NavdrawerProps,
  NavItemProps,
  NavSectionProps,
} from "aapaetsch-ui-kit";
```

