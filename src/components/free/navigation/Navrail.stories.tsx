import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  Users,
  BarChart3,
  FileText,
  HelpCircle,
  LogOut,
  Package,
  ShoppingCart,
  CreditCard,
  Layers,
  Folder,
} from "lucide-react";

import {
  NavigationProvider,
  Navrail,
  NavrailHeader,
  NavrailContent,
  NavrailFooter,
  NavrailCollapseButton,
  NavItem,
  NavSection,
  NavDivider,
  NavBadge,
} from "./index";
import { Button } from "../button";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Free/Navigation/Navrail",
  component: Navrail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Vertical sidebar navigation with sections and collapsible states.

## Variants
- **standard**: Full-width sidebar with labels
- **compact**: Icons-only compact width
- **mini**: Minimal width with icons
- **floating**: Elevated with rounded corners
- **inset**: Inset from container edges
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navrail>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Sample Data
// ============================================================================

const sideNavItems = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 /> },
  { id: "projects", label: "Projects", icon: <Folder /> },
  { id: "documents", label: "Documents", icon: <FileText /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 /> },
  { id: "team", label: "Team", icon: <Users /> },
];

const ecommerceNavItems = [
  { id: "products", label: "Products", icon: <Package /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart />, badge: "3" },
  { id: "customers", label: "Customers", icon: <Users /> },
  { id: "payments", label: "Payments", icon: <CreditCard /> },
];

// ============================================================================
// Stories
// ============================================================================

export const Standard: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="dashboard">
      <div className="flex h-[500px] border rounded-lg overflow-hidden">
        <Navrail variant="standard">
          <NavrailHeader>
            <Layers className="size-6 text-primary" />
            <span className="font-semibold">Workspace</span>
          </NavrailHeader>
          <NavrailContent>
            <NavSection title="Main">
              {sideNavItems.map((item) => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </NavSection>
            <NavDivider />
            <NavSection title="Settings">
              <NavItem id="settings" label="Settings" icon={<Settings />} />
              <NavItem id="help" label="Help & Support" icon={<HelpCircle />} />
            </NavSection>
          </NavrailContent>
          <NavrailFooter>
            <Avatar size="sm">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@example.com</p>
            </div>
            <Button colorStyle="ghost" iconOnly size="sm">
              <LogOut className="size-4" />
            </Button>
          </NavrailFooter>
        </Navrail>
        <main className="flex-1 p-6 bg-muted/20">
          <h1 className="text-xl font-semibold">Main Content</h1>
          <p className="text-muted-foreground mt-2">
            This is the main content area alongside the navigation rail.
          </p>
        </main>
      </div>
    </NavigationProvider>
  ),
};

export const Compact: Story = {
  name: "Compact (Icons Only)",
  render: () => (
    <NavigationProvider defaultActiveItem="inbox" defaultCollapsed>
      <div className="flex h-[500px] border rounded-lg overflow-hidden">
        <Navrail variant="compact">
          <NavrailContent>
            <NavSection>
              <NavItem id="home" label="Home" icon={<Home />} />
              <NavItem id="inbox" label="Inbox" icon={<Inbox />} badge={<NavBadge variant="primary">5</NavBadge>} />
              <NavItem id="calendar" label="Calendar" icon={<Calendar />} />
              <NavItem id="search" label="Search" icon={<Search />} />
            </NavSection>
            <NavDivider />
            <NavSection>
              <NavItem id="settings" label="Settings" icon={<Settings />} />
            </NavSection>
          </NavrailContent>
        </Navrail>
        <main className="flex-1 p-6 bg-muted/20">
          <h1 className="text-xl font-semibold">Compact Navigation</h1>
          <p className="text-muted-foreground mt-2">
            Icons-only navigation for maximum content space.
          </p>
        </main>
      </div>
    </NavigationProvider>
  ),
};

export const Floating: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="products">
      <div className="flex h-[500px] bg-muted/30 overflow-hidden">
        <Navrail variant="floating">
          <NavrailHeader>
            <ShoppingCart className="size-6 text-primary" />
            <span className="font-semibold">E-Commerce</span>
          </NavrailHeader>
          <NavrailContent>
            <NavSection>
              {ecommerceNavItems.map((item) => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge && <NavBadge variant="primary">{item.badge}</NavBadge>}
                />
              ))}
            </NavSection>
          </NavrailContent>
          <NavrailFooter>
            <NavItem id="settings" label="Settings" icon={<Settings />} />
          </NavrailFooter>
        </Navrail>
        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold">Floating Navigation</h1>
          <p className="text-muted-foreground mt-2">
            A floating navigation rail with rounded corners and elevation.
          </p>
        </main>
      </div>
    </NavigationProvider>
  ),
};

export const Mini: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="home">
      <div className="flex h-[500px] border rounded-lg overflow-hidden">
        <Navrail variant="mini">
          <NavrailContent>
            <NavSection>
              <NavItem id="home" label="Home" icon={<Home />} />
              <NavItem id="inbox" label="Inbox" icon={<Inbox />} badge={<NavBadge variant="primary">3</NavBadge>} />
              <NavItem id="calendar" label="Calendar" icon={<Calendar />} />
              <NavItem id="search" label="Search" icon={<Search />} />
            </NavSection>
            <NavDivider />
            <NavSection>
              <NavItem id="settings" label="Settings" icon={<Settings />} />
            </NavSection>
          </NavrailContent>
        </Navrail>
        <main className="flex-1 p-6 bg-muted/20">
          <h1 className="text-xl font-semibold">Mini Navigation</h1>
          <p className="text-muted-foreground mt-2">
            Minimal width navigation with icons and labels appearing on hover.
          </p>
        </main>
      </div>
    </NavigationProvider>
  ),
};

export const Inset: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="projects">
      <div className="flex h-[500px] p-4 bg-muted/30">
        <Navrail variant="inset">
          <NavrailHeader>
            <Folder className="size-6 text-primary" />
            <span className="font-semibold">Projects</span>
          </NavrailHeader>
          <NavrailContent>
            <NavSection>
              {sideNavItems.map((item) => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </NavSection>
          </NavrailContent>
        </Navrail>
        <main className="flex-1 p-6 bg-background rounded-lg ml-4">
          <h1 className="text-xl font-semibold">Inset Navigation</h1>
          <p className="text-muted-foreground mt-2">
            Navigation rail inset from the container edges for custom layouts.
          </p>
        </main>
      </div>
    </NavigationProvider>
  ),
};

export const Collapsible: Story = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <NavigationProvider
        defaultActiveItem="dashboard"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        <div className="flex h-[500px] border rounded-lg overflow-hidden">
          <Navrail variant="standard" collapsible>
            <NavrailHeader>
              <Layers className="size-6 text-primary shrink-0" />
              {!collapsed && <span className="font-semibold">Workspace</span>}
              <NavrailCollapseButton />
            </NavrailHeader>
            <NavrailContent>
              <NavSection title={collapsed ? undefined : "Main"}>
                {sideNavItems.map((item) => (
                  <NavItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                  />
                ))}
              </NavSection>
            </NavrailContent>
            <NavrailFooter>
              <Avatar size="sm">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <span className="text-sm font-medium truncate flex-1">John Doe</span>
              )}
            </NavrailFooter>
          </Navrail>
          <main className="flex-1 p-6 bg-muted/20">
            <h1 className="text-xl font-semibold">Collapsible Navigation</h1>
            <p className="text-muted-foreground mt-2">
              Click the collapse button in the header to toggle between expanded and collapsed states.
            </p>
            <p className="mt-4">
              <strong>Current state:</strong> {collapsed ? "Collapsed" : "Expanded"}
            </p>
          </main>
        </div>
      </NavigationProvider>
    );
  },
};
