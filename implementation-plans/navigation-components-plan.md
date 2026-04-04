# Navigation Components Implementation Plan

## Overview
This plan outlines the implementation of three core navigation components for the agentixUI library:
1. Navbar - Horizontal top navigation bar
2. Navrail - Vertical sidebar navigation rail
3. Navdrawer - Slide-in navigation drawer for mobile/responsive views

These components will follow Material Design 3 guidelines while incorporating Tailwind Catalyst patterns and shadcn/ui conventions, ensuring consistency with the existing component library.

## Component Structure & Variants

### Navbar
#### Core Functionality
- Horizontal navigation bar that stays fixed at the top of the viewport
- Responsive behavior (collapses to hamburger menu on smaller screens)
- Supports branding, navigation items, and action elements
- Integrates with Navdrawer for mobile experiences

#### Variants
1. **Default** - Standard navigation bar with logo, navigation links, and actions
2. **Prominent** - Larger height with additional content area (subtitle, search, etc.)
3. **Dense** - Reduced height for applications requiring more screen space
4. **Centered** - Navigation items centered with branding on left and actions on right
5. **Split** - Navigation items split between left and right of the center

#### Props Interface
```typescript
interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'prominent' | 'dense' | 'centered' | 'split';
  sticky?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  onMobileMenuClick?: () => void;
}
```

### Navrail
#### Core Functionality
- Vertical sidebar navigation that typically remains visible
- Supports navigation groups, collapsible sections, and persistent actions
- Responsive behavior (collapses to icons-only or hides entirely on smaller screens)
- Integrates with Navbar and Navdrawer for consistent navigation experience

#### Variants
1. **Standard** - Full-width navigation rail with text labels and icons
2. **Compact** - Icons-only navigation for minimal space usage
3. **Mini** - Narrow rail showing icons with text labels on hover
4. **Floating** - Detached rail with rounded corners and elevation
5. **Inset** - Rail inset from edges for custom layouts

#### Props Interface
```typescript
interface NavrailProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'standard' | 'compact' | 'mini' | 'floating' | 'inset';
  position?: 'left' | 'right';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}
```

### Navdrawer
#### Core Functionality
- Slide-in panel for navigation that overlays content
- Typically used for mobile navigation and temporary views
- Supports modal and non-modal variations
- Integrates with Navbar hamburger menu or dedicated trigger

#### Variants
1. **Standard** - Full-height drawer sliding from screen edge
2. **Modal** - Overlay that prevents interaction with background content
3. **Non-modal** - Allows interaction with background content
4. **Dismissible** - Can be closed by clicking overlay or pressing escape
5. **Permanent** - Always visible drawer that pushes content (desktop)

#### Props Interface
```typescript
interface NavdrawerProps {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'standard' | 'modal' | 'non-modal' | 'dismissible' | 'permanent';
  anchor?: 'left' | 'right';
  modal?: boolean;
  dismissible?: boolean;
  showOverlay?: boolean;
}
```

## Component Architecture & Technical Implementation

### Shared Context
```typescript
interface NavigationContextProps {
  activeItem?: string;
  setActiveItem: (id: string) => void;
  collapsed?: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NavigationContext = React.createContext<NavigationContextProps | undefined>(undefined);
```

### Sub-components
Each navigation component will include the following sub-components:

1. **NavItem** - Individual navigation item with icon and label
2. **NavSection** - Group of related navigation items with optional header
3. **NavHeader** - Section header with optional actions
4. **NavFooter** - Persistent footer area with actions
5. **NavDivider** - Visual separator between sections

#### NavItem Props
```typescript
interface NavItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  className?: string;
}
```

#### NavSection Props
```typescript
interface NavSectionProps {
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}
```

## Styling & Theming Strategy

### CSS Variables
All components will use the existing CSS variables defined in `src/globals.css`:
- `--primary`, `--primary-foreground` for active states
- `--background`, `--foreground` for base styling
- `--muted`, `--muted-foreground` for secondary content
- `--border` for dividers and borders
- `--radius` for border-radius consistency

### CVA Variants
Each component will use `class-variance-authority` for consistent variant styling:

```typescript
const navbarVariants = cva(
  "flex items-center w-full border-b",
  {
    variants: {
      variant: {
        default: "h-16 px-4",
        prominent: "h-24 px-6",
        dense: "h-12 px-4",
        centered: "h-16 px-4 justify-between",
        split: "h-16 px-4"
      },
      bordered: {
        true: "border-border",
        false: "border-transparent"
      },
      elevated: {
        true: "shadow-sm",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      bordered: true,
      elevated: false
    }
  }
);
```

## Responsive Behavior

### Breakpoints
- **sm (640px)**: Mobile-first design, Navdrawer primary navigation
- **md (768px)**: Expanded capabilities, Navrail becomes visible
- **lg (1024px)**: Full navigation components visible with enhanced interactions
- **xl (1280px)**: Additional spacing and content optimizations

### Mobile Priority
1. Navdrawer as primary navigation method
2. Hamburger menu in Navbar triggers Navdrawer
3. Navrail hidden or collapsed by default

### Desktop Priority
1. Navrail visible as primary navigation
2. Navbar for branding and top-level actions
3. Navdrawer for supplementary navigation or temporary views

## Accessibility Implementation

### Keyboard Navigation
- Full keyboard navigation support using tab order
- Arrow key navigation within navigation sections
- Enter/space to activate items
- Escape key to close drawers

### ARIA Attributes
- `role="navigation"` for navigation landmarks
- `aria-current="page"` for active navigation items
- `aria-expanded` for collapsible sections
- `aria-label` or `aria-labelledby` for all navigation regions

### Focus Management
- Focus trapping in modal Navdrawer
- Focus restoration when closing components
- Visible focus indicators for all interactive elements

## Animation & Transitions

### Navdrawer
- Slide-in animation with easing function
- Overlay fade-in with backdrop blur
- Duration: 250ms for open/close transitions

### Navrail
- Collapse/expand width transition
- Icon label fade in/out
- Duration: 200ms for state changes

### General Interactions
- Hover states with subtle background transitions
- Active state with clear visual indication
- Focus rings with visible contrast

## Integration with Existing Components

### Dependencies
- `@radix-ui/react-dialog` for Navdrawer modal behavior
- `lucide-react` for standard icons
- `class-variance-authority` for variant styling
- Existing Button component for action items
- Existing Sheet component as basis for Navdrawer

### Component Composition
```tsx
// Example composition
<NavigationProvider>
  <Navbar 
    variant="default" 
    onMobileMenuClick={() => setMobileOpen(true)}
  >
    <Logo />
    <NavSection>
      <NavItem id="home" label="Home" icon={<HomeIcon />} href="/" />
      <NavItem id="about" label="About" icon={<InfoIcon />} href="/about" />
    </NavSection>
    <Actions>
      <Button variant="ghost" size="icon">
        <SettingsIcon />
      </Button>
    </Actions>
  </Navbar>
  
  <Navrail 
    variant="standard" 
    collapsible 
    defaultCollapsed={false}
  >
    <NavHeader title="Main Menu" />
    <NavSection title="Navigation">
      <NavItem id="dashboard" label="Dashboard" icon={<LayoutDashboardIcon />} />
      <NavItem id="analytics" label="Analytics" icon={<BarChartIcon />} />
    </NavSection>
    <NavFooter>
      <NavItem id="settings" label="Settings" icon={<SettingsIcon />} />
    </NavFooter>
  </Navrail>
  
  <Navdrawer 
    open={mobileOpen} 
    onOpenChange={setMobileOpen}
    variant="modal"
  >
    <NavHeader title="Menu" />
    <NavSection>
      <NavItem id="home" label="Home" icon={<HomeIcon />} href="/" />
      <NavItem id="about" label="About" icon={<InfoIcon />} href="/about" />
    </NavSection>
  </Navdrawer>
</NavigationProvider>
```

## Component Spacing, Sizing, Effects & Animation Guidelines

### Spacing & Layout
- **Spacing scale**: Use Tailwind spacing scale (1-8) with 4px base (rem units)
- **Internal padding**: Navbar items 12px horizontal, 8px vertical; Navrail items 16px horizontal, 12px vertical
- **External spacing**: Navbar has full viewport width with optional gutters; Navrail has optional margin for floating variant
- **Layout rules**: Flex-based layouts with proper alignment; Navbar uses space-between for centered variant

### Sizing
- **Component height/width**: 
  - Navbar: Default 64px (4rem), Dense 48px (3rem), Prominent 96px (6rem)
  - Navrail: Standard 240px (15rem) width, Compact 72px (4.5rem)
  - Navdrawer: Standard 300px (18.75rem) width
- **Min/max constraints**: 
  - Navbar min-height enforced, max-width container-based (1440px default)
  - Navrail min-width 56px (3.5rem) when collapsed, max-width 400px
  - Navdrawer min-width 240px, max-width 50% of viewport
- **Responsive behavior**:
  - sm: Navbar full-width, Navrail hidden, Navdrawer primary
  - md: Navbar full-width, Navrail visible, Navdrawer supplementary
  - lg: All components visible with optimized spacing

### Effects
- **Shadows**: Navbar elevated variant uses subtle shadow (0 1px 2px rgba(0,0,0,0.05))
- **Borders**: 
  - Navbar border uses --border color at 1px thickness
  - Navrail divider uses --border with 1px thickness
  - Navdrawer overlay uses semi-transparent black (rgba(0,0,0,0.5))
- **Blurs/overlays**: Navdrawer modal variant includes backdrop blur (1px) and overlay opacity (0.5)

### Animation & Transitions
- **Motion guidelines**: 
  - Standard easing (cubic-bezier(0.4, 0, 0.2, 1))
  - Duration: 200ms for hover states, 250ms for open/close
- **Transition properties**: 
  - Transform for slide animations
  - Opacity for fade effects
  - Width for collapse/expand
- **Interactive feedback**: 
  - Hover: Background color transition with scale transform (1.02x)
  - Active: Background color change with pressed state shadow
  - Focus: Visible ring with offset using --ring color
- **Open/close motion**: 
  - Navdrawer: Slide from edge with overlay fade
  - Navrail: Width transition with content fade
  - Navbar items: Staggered item appearance on load

## Further Considerations

### Performance Optimization
- Use React.memo for NavItem to prevent unnecessary re-renders
- Implement virtualized rendering for large navigation lists
- Lazy load icon components when possible
- Optimize animations with transform properties

### Theming Extensibility
- Ensure all components work with CSS variable theming
- Support dark mode variations
- Allow custom styling through className prop
- Provide CSS variable hooks for brand customization

### Internationalization
- Support RTL layouts for right-to-left languages
- Ensure text truncation works with various languages
- Support icon mirroring for RTL when appropriate

### Test Coverage
- Unit tests for all component variants
- Accessibility testing with automated tools
- Responsive behavior testing across breakpoints
- Integration tests for context provider and state management

## Required Clarifications (one round only)

1. Should the Navigation components integrate with a routing library (like React Router) or remain agnostic to routing implementation?

2. What specific Material Design 3 navigation patterns should be prioritized in the implementation?

3. How should the components handle dynamic navigation items (e.g., user-specific menu items based on permissions)?