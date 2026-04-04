import type { Meta, StoryObj } from "@storybook/react";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  Users,
  BarChart3,
  Bell,
  LogOut,
  ShoppingCart,
  Layers,
} from "lucide-react";

import {
  NavigationProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  NavItem,
  NavBadge,
} from "./index";
import { Button } from "../button";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Horizontal top navigation bar with branding, navigation items, and actions.

## Variants
- **default**: Standard height with comfortable spacing
- **prominent**: Larger height for emphasis, supports subtitle in brand
- **dense**: Compact height for space efficiency
- **centered**: Centers the navigation content
- **split**: Places content at the edges
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Sample Data
// ============================================================================

const mainNavItems = [
  { id: "home", label: "Home", icon: <Home />, href: "#" },
  { id: "inbox", label: "Inbox", icon: <Inbox />, badge: "12" },
  { id: "calendar", label: "Calendar", icon: <Calendar /> },
  { id: "search", label: "Search", icon: <Search /> },
];

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="home">
      <Navbar>
        <NavbarBrand>
          <Layers className="size-6 text-primary" />
          <span className="font-semibold text-lg">Acme Inc</span>
        </NavbarBrand>
        <NavbarContent className="hidden md:flex">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              href={item.href}
            />
          ))}
        </NavbarContent>
        <NavbarActions>
          <Button colorStyle="ghost" iconOnly size="sm">
            <Bell className="size-5" />
          </Button>
          <Avatar size="sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </NavbarActions>
      </Navbar>
    </NavigationProvider>
  ),
};

export const Prominent: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="home">
      <Navbar variant="prominent" elevated>
        <NavbarBrand>
          <Layers className="size-8 text-primary" />
          <div>
            <h1 className="font-bold text-xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your workspace</p>
          </div>
        </NavbarBrand>
        <NavbarActions>
          <Button colorStyle="outlined" size="sm">
            Upgrade Plan
          </Button>
          <Avatar size="md">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </NavbarActions>
      </Navbar>
    </NavigationProvider>
  ),
};

export const Dense: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="dashboard">
      <Navbar variant="dense" bordered>
        <NavbarBrand>
          <span className="font-medium">Admin Panel</span>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex">
          <NavItem id="dashboard" label="Dashboard" icon={<BarChart3 className="size-4" />} />
          <NavItem id="users" label="Users" icon={<Users className="size-4" />} />
          <NavItem id="settings" label="Settings" icon={<Settings className="size-4" />} />
        </NavbarContent>
        <NavbarActions>
          <Button colorStyle="text" size="xs">
            <LogOut className="size-4 mr-1" />
            Logout
          </Button>
        </NavbarActions>
      </Navbar>
    </NavigationProvider>
  ),
};

export const Centered: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="products">
      <Navbar variant="centered" elevated>
        <NavbarBrand>
          <ShoppingCart className="size-6 text-primary" />
          <span className="font-bold text-lg">Shop</span>
        </NavbarBrand>
        <NavbarContent position="center" className="hidden lg:flex">
          <NavItem id="products" label="Products" />
          <NavItem id="categories" label="Categories" />
          <NavItem id="deals" label="Deals" badge={<NavBadge variant="destructive">Hot</NavBadge>} />
          <NavItem id="about" label="About" />
        </NavbarContent>
        <NavbarActions>
          <Button colorStyle="ghost" iconOnly>
            <Search className="size-5" />
          </Button>
          <Button colorStyle="ghost" iconOnly>
            <ShoppingCart className="size-5" />
          </Button>
          <Button colorStyle="filled" size="sm">
            Sign In
          </Button>
        </NavbarActions>
      </Navbar>
    </NavigationProvider>
  ),
};

export const Split: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="dashboard">
      <Navbar variant="split" bordered>
        <NavbarBrand>
          <Layers className="size-6 text-primary" />
          <span className="font-semibold">Dashboard</span>
        </NavbarBrand>
        <NavbarContent position="start" className="hidden md:flex">
          <NavItem id="dashboard" label="Dashboard" icon={<BarChart3 />} />
          <NavItem id="analytics" label="Analytics" icon={<BarChart3 />} />
        </NavbarContent>
        <NavbarContent position="end" className="hidden md:flex">
          <NavItem id="settings" label="Settings" icon={<Settings />} />
          <NavItem id="help" label="Help" icon={<Search />} />
        </NavbarContent>
        <NavbarActions>
          <Avatar size="sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </NavbarActions>
      </Navbar>
    </NavigationProvider>
  ),
};

export const Sticky: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="home">
      <div className="h-[200vh]">
        <Navbar sticky elevated>
          <NavbarBrand>
            <Layers className="size-6 text-primary" />
            <span className="font-semibold">Sticky Nav</span>
          </NavbarBrand>
          <NavbarContent className="hidden md:flex">
            {mainNavItems.map((item) => (
              <NavItem key={item.id} id={item.id} label={item.label} />
            ))}
          </NavbarContent>
          <NavbarActions>
            <Button colorStyle="filled" size="sm">Get Started</Button>
          </NavbarActions>
        </Navbar>
        <main className="p-8">
          <h1 className="text-2xl font-bold mb-4">Scroll down to see sticky behavior</h1>
          <p className="text-muted-foreground">
            The navbar will stick to the top of the viewport as you scroll.
          </p>
        </main>
      </div>
    </NavigationProvider>
  ),
};
