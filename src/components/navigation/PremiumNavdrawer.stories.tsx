import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Home,
  Settings,
  BarChart3,
  FileText,
  Inbox,
  Layout,
  Layers,
  Bell,
  Menu,
  LogOut,
} from "lucide-react";

import { PremiumNavGroup, PremiumNavItem } from "./index";
import {
  Navbar,
  NavbarBrand,
  NavbarActions,
  Navdrawer,
  NavdrawerTrigger,
  NavdrawerContent,
  NavdrawerHeader,
  NavdrawerTitle,
  NavBadge,
} from "./index";
import { Button } from "../button";
import { Avatar, AvatarFallback } from "../avatar";

// ============================================================================
// Story Args Types
// ============================================================================

interface NavdrawerStoryArgs {
  indicatorAnimation: "slide" | "spring" | "morph" | "snap" | "fade";
  indicatorType: "bar" | "pill" | "line" | "underline" | "topline" | "highlight" | "dot";
  itemVariant: "default" | "subtle" | "filled" | "bordered" | "ghost";
  itemShape: "rectangular" | "pill";
}

// ============================================================================
// Sample Data
// ============================================================================

const sidebarItems = [
  { id: "home", label: "Home", icon: <Home className="size-5" /> },
  { id: "inbox", label: "Inbox", icon: <Inbox className="size-5" />, badge: "12" },
  { id: "documents", label: "Documents", icon: <FileText className="size-5" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="size-5" /> },
  { id: "projects", label: "Projects", icon: <Layers className="size-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="size-5" /> },
];

// ============================================================================
// Meta
// ============================================================================

const meta: Meta<NavdrawerStoryArgs> = {
  title: "Navigation/Navdrawer Advanced",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Premium Navdrawer with animated sliding indicators.

## Features
- Animated indicator that slides between items
- Multiple indicator types: bar, pill, line, highlight
- Multiple animation styles: slide, spring, morph, snap, fade
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    indicatorAnimation: {
      control: "select",
      options: ["slide", "spring", "morph", "snap", "fade"],
      description: "Animation style for indicator movement",
      table: { defaultValue: { summary: "spring" } },
    },
    indicatorType: {
      control: "select",
      options: ["bar", "pill", "line", "underline", "topline", "highlight", "dot"],
      description: "Visual style of the indicator",
      table: { defaultValue: { summary: "bar" } },
    },
    itemVariant: {
      control: "select",
      options: ["default", "subtle", "filled", "bordered", "ghost"],
      description: "Visual style variant for nav items",
      table: { defaultValue: { summary: "ghost" } },
    },
    itemShape: {
      control: "radio",
      options: ["rectangular", "pill"],
      description: "Shape of nav items",
      table: { defaultValue: { summary: "rectangular" } },
    },
  },
  args: {
    indicatorAnimation: "spring",
    indicatorType: "bar",
    itemVariant: "ghost",
    itemShape: "rectangular",
  },
};

export default meta;
type Story = StoryObj<NavdrawerStoryArgs>;

// ============================================================================
// Stories
// ============================================================================

/**
 * Navdrawer with animated sliding indicator.
 */
export const Default: Story = {
  render: (args) => {
    const [activeItem, setActiveItem] = React.useState("home");
    const [open, setOpen] = React.useState(false);

    return (
      <div className="min-h-[500px] bg-muted/30">
        <Navbar bordered className="bg-background">
          <Navdrawer open={open} onOpenChange={setOpen}>
            <NavdrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            </NavdrawerTrigger>
            <NavdrawerContent>
              <NavdrawerHeader>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
                    <Layout className="size-5 text-primary-foreground" />
                  </div>
                  <NavdrawerTitle>Acme Inc</NavdrawerTitle>
                </div>
              </NavdrawerHeader>
              
              <div className="flex-1 overflow-y-auto py-4 px-3">
                <PremiumNavGroup
                  activeItem={activeItem}
                  onActiveItemChange={(id) => {
                    setActiveItem(id);
                    setOpen(false);
                  }}
                  indicatorAnimation={args.indicatorAnimation}
                  indicatorType={args.indicatorType}
                  indicatorPosition="left"
                >
                  {sidebarItems.map((item) => (
                    <PremiumNavItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      icon={item.icon}
                      badge={item.badge ? <NavBadge variant="primary">{item.badge}</NavBadge> : undefined}
                      variant={args.itemVariant}
                      shape={args.itemShape}
                    />
                  ))}
                </PremiumNavGroup>
              </div>

              <div className="px-3 py-4 border-t">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="size-10">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">John Doe</div>
                    <div className="text-xs text-muted-foreground truncate">john@example.com</div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <LogOut className="size-4" />
                  </Button>
                </div>
              </div>
            </NavdrawerContent>
          </Navdrawer>

          <NavbarBrand>
            <span className="font-bold text-lg">Acme Inc</span>
          </NavbarBrand>

          <NavbarActions>
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
            </Button>
          </NavbarActions>
        </Navbar>

        <div className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Navdrawer Demo</h1>
            <p className="text-muted-foreground mb-6">
              Click the menu icon to open the drawer and see animated navigation indicators.
            </p>
            <div className="p-4 bg-background rounded-lg border">
              <div className="text-sm text-muted-foreground">Current page:</div>
              <div className="text-lg font-semibold">{activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Compare different indicator types in a Navdrawer.
 */
export const IndicatorComparison: Story = {
  args: {
    indicatorAnimation: "slide",
    itemVariant: "ghost",
    itemShape: "rectangular",
  },
  render: (args) => {
    const [activeItems, setActiveItems] = React.useState({
      bar: "home",
      pill: "home",
      line: "home",
      highlight: "home",
    });

    const indicators = [
      { type: "bar" as const, label: "Bar" },
      { type: "pill" as const, label: "Pill" },
      { type: "line" as const, label: "Line" },
      { type: "highlight" as const, label: "Highlight" },
    ];

    return (
      <div className="grid grid-cols-4 gap-4 p-6">
        {indicators.map(({ type, label }) => (
          <div key={type} className="space-y-2">
            <div className="text-sm font-medium text-center text-muted-foreground">{label}</div>
            <div className="border rounded-lg overflow-hidden bg-background">
              <div className="px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded bg-primary flex items-center justify-center">
                    <Layout className="size-3 text-primary-foreground" />
                  </div>
                  <span className="font-medium text-sm">App</span>
                </div>
              </div>
              <div className="p-2">
                <PremiumNavGroup
                  activeItem={activeItems[type]}
                  onActiveItemChange={(id) => setActiveItems(prev => ({ ...prev, [type]: id }))}
                  indicatorAnimation={args.indicatorAnimation}
                  indicatorType={type}
                  indicatorPosition="left"
                >
                  {sidebarItems.slice(0, 4).map((item) => (
                    <PremiumNavItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      icon={React.cloneElement(item.icon as React.ReactElement, { className: "size-4" })}
                      variant={args.itemVariant}
                      shape={args.itemShape}
                    />
                  ))}
                </PremiumNavGroup>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
