import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  BarChart3,
  FileText,
  Mail,
  Bell,
  HelpCircle,
  LogOut,
  Package,
  ShoppingCart,
  CreditCard,
  User,
  Layers,
  Folder,
} from "lucide-react";

import {
  NavigationProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  Navrail,
  NavrailContent,
  NavrailFooter,
  NavrailCollapseButton,
  Navdrawer,
  NavdrawerContent,
  NavdrawerHeader,
  NavdrawerTitle,
  NavdrawerFooter,
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
  title: "Navigation/Full Layouts",
  component: NavigationProvider,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Complete application layouts demonstrating how to combine Navbar, Navrail, and Navdrawer components.

These examples show real-world usage patterns for different types of applications:
- **Application Layout**: Full dashboard with responsive navigation
- **E-commerce Layout**: Shopping site with centered navbar
- **Admin Dashboard**: Management interface with floating sidebar
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories
// ============================================================================

export const ApplicationLayout: Story = {
  render: () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(false);

    return (
      <NavigationProvider
        defaultActiveItem="dashboard"
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
          {/* Navbar */}
          <Navbar bordered>
            <NavbarBrand>
              <Layers className="size-6 text-primary" />
              <span className="font-semibold hidden sm:inline">Acme Dashboard</span>
            </NavbarBrand>
            <NavbarContent className="hidden lg:flex">
              <NavItem id="overview" label="Overview" />
              <NavItem id="reports" label="Reports" />
              <NavItem id="integrations" label="Integrations" />
            </NavbarContent>
            <NavbarActions>
              <Button colorStyle="ghost" iconOnly size="sm" className="hidden sm:flex">
                <Search className="size-5" />
              </Button>
              <Button colorStyle="ghost" iconOnly size="sm" className="hidden sm:flex">
                <Bell className="size-5" />
              </Button>
              <Avatar size="sm">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </NavbarActions>
          </Navbar>

          <div className="flex flex-1 overflow-hidden">
            {/* Navrail (desktop) */}
            <Navrail variant="standard" collapsible>
              <NavrailContent>
                <NavSection>
                  <NavItem id="dashboard" label="Dashboard" icon={<BarChart3 />} />
                  <NavItem id="projects" label="Projects" icon={<Folder />} />
                  <NavItem
                    id="inbox"
                    label="Inbox"
                    icon={<Inbox />}
                    badge={<NavBadge variant="primary">5</NavBadge>}
                  />
                  <NavItem id="documents" label="Documents" icon={<FileText />} />
                </NavSection>
                <NavDivider />
                <NavSection title={collapsed ? undefined : "Team"}>
                  <NavItem id="team" label="Members" icon={<Users />} />
                  <NavItem id="messages" label="Messages" icon={<Mail />} />
                </NavSection>
              </NavrailContent>
              <NavrailFooter>
                <NavItem id="settings" label="Settings" icon={<Settings />} />
                <NavrailCollapseButton />
              </NavrailFooter>
            </Navrail>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto bg-muted/10">
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
              <p className="text-muted-foreground mb-6">
                Welcome to your dashboard. This layout demonstrates the full navigation system.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-4 bg-card border rounded-lg">
                    <h3 className="font-medium mb-2">Card {i}</h3>
                    <p className="text-sm text-muted-foreground">
                      Example content for card {i}.
                    </p>
                  </div>
                ))}
              </div>
            </main>
          </div>

          {/* Navdrawer (mobile) */}
          <Navdrawer>
            <NavdrawerContent>
              <NavdrawerHeader>
                <Layers className="size-6 text-primary" />
                <NavdrawerTitle>Menu</NavdrawerTitle>
              </NavdrawerHeader>
              <div className="flex-1 overflow-y-auto py-2">
                <NavSection>
                  <NavItem id="dashboard" label="Dashboard" icon={<BarChart3 />} />
                  <NavItem id="projects" label="Projects" icon={<Folder />} />
                  <NavItem
                    id="inbox"
                    label="Inbox"
                    icon={<Inbox />}
                    badge={<NavBadge variant="primary">5</NavBadge>}
                  />
                  <NavItem id="documents" label="Documents" icon={<FileText />} />
                </NavSection>
                <NavDivider />
                <NavSection title="Team">
                  <NavItem id="team" label="Members" icon={<Users />} />
                  <NavItem id="messages" label="Messages" icon={<Mail />} />
                </NavSection>
                <NavDivider />
                <NavSection>
                  <NavItem id="settings" label="Settings" icon={<Settings />} />
                  <NavItem id="help" label="Help & Support" icon={<HelpCircle />} />
                </NavSection>
              </div>
              <NavdrawerFooter>
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
              </NavdrawerFooter>
            </NavdrawerContent>
          </Navdrawer>
        </div>
      </NavigationProvider>
    );
  },
};

export const EcommerceLayout: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="products">
      <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
        <Navbar variant="centered" elevated>
          <NavbarBrand>
            <ShoppingCart className="size-6 text-primary" />
            <span className="font-bold text-lg">ShopUI</span>
          </NavbarBrand>
          <NavbarContent position="center" className="hidden lg:flex gap-6">
            <NavItem id="products" label="Products" />
            <NavItem id="categories" label="Categories" />
            <NavItem
              id="deals"
              label="Deals"
              badge={<NavBadge variant="destructive">New</NavBadge>}
            />
            <NavItem id="contact" label="Contact" />
          </NavbarContent>
          <NavbarActions>
            <Button colorStyle="ghost" iconOnly>
              <Search className="size-5" />
            </Button>
            <Button colorStyle="ghost" iconOnly>
              <User className="size-5" />
            </Button>
            <Button colorStyle="ghost" iconOnly className="relative">
              <ShoppingCart className="size-5" />
              <span className="absolute -top-1 -right-1 size-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </NavbarActions>
        </Navbar>

        <main className="flex-1 p-8 bg-muted/10">
          <h1 className="text-3xl font-bold mb-2">Featured Products</h1>
          <p className="text-muted-foreground mb-8">
            Discover our latest collection of premium items.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted" />
                <div className="p-4">
                  <h3 className="font-medium">Product {i}</h3>
                  <p className="text-sm text-muted-foreground">$99.00</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </NavigationProvider>
  ),
};

export const AdminDashboard: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="users">
      <div className="flex h-[600px] border rounded-lg overflow-hidden">
        <Navrail variant="floating">
          <NavrailContent>
            <NavSection>
              <NavItem id="users" label="Users" icon={<Users />} />
              <NavItem id="content" label="Content" icon={<FileText />} />
              <NavItem id="analytics" label="Analytics" icon={<BarChart3 />} />
              <NavItem id="billing" label="Billing" icon={<CreditCard />} />
            </NavSection>
            <NavDivider />
            <NavSection title="System">
              <NavItem id="logs" label="Logs" icon={<FileText />} />
              <NavItem id="settings" label="Settings" icon={<Settings />} />
            </NavSection>
          </NavrailContent>
        </Navrail>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <Button colorStyle="filled">Add User</Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b">
              <p className="font-medium">Users</p>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
                <Avatar size="sm">
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">User {i}</p>
                  <p className="text-sm text-muted-foreground">user{i}@example.com</p>
                </div>
                <Button colorStyle="ghost" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </NavigationProvider>
  ),
};
