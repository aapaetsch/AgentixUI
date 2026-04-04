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
  Search,
} from "lucide-react";

import { PremiumNavGroup, PremiumNavItem } from "./index";
import {
  NavigationProvider,
  Navrail,
  NavrailHeader,
  NavrailContent,
  NavrailFooter,
  NavrailCollapseButton,
  NavBadge,
} from "./index";
import { Button } from "../button";
import { Avatar, AvatarFallback } from "../avatar";

// ============================================================================
// Story Args Types
// ============================================================================

interface NavrailStoryArgs {
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

const meta: Meta<NavrailStoryArgs> = {
  title: "Navigation/Navrail Advanced",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Premium Navrail with animated sliding indicators.

## Features
- Animated indicator that slides between items
- Multiple indicator types: bar, pill, highlight
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
      table: { defaultValue: { summary: "pill" } },
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
    indicatorType: "pill",
    itemVariant: "ghost",
    itemShape: "rectangular",
  },
};

export default meta;
type Story = StoryObj<NavrailStoryArgs>;

// ============================================================================
// Stories
// ============================================================================

/**
 * Navrail with animated sliding indicator.
 */
export const Default: Story = {
  render: (args) => {
    const [activeItem, setActiveItem] = React.useState("home");

    return (
      <NavigationProvider defaultActiveItem="home">
        <div className="flex h-[600px] border rounded-lg overflow-hidden bg-muted/30">
          <Navrail variant="standard" collapsible>
            <NavrailHeader>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <Layout className="size-4 text-primary-foreground" />
                </div>
                <span className="font-bold truncate [[data-collapsed=true]_&]:hidden">
                  Dashboard
                </span>
              </div>
              <NavrailCollapseButton />
            </NavrailHeader>

            <NavrailContent className="px-2">
              <PremiumNavGroup
                activeItem={activeItem}
                onActiveItemChange={setActiveItem}
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
            </NavrailContent>

            <NavrailFooter>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 [[data-collapsed=true]_&]:hidden">
                  <div className="font-medium text-sm truncate">John Doe</div>
                  <div className="text-xs text-muted-foreground truncate">Admin</div>
                </div>
              </div>
            </NavrailFooter>
          </Navrail>

          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b bg-background px-6 flex items-center justify-between">
              <h1 className="font-semibold">{activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Search className="size-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="size-4" />
                </Button>
              </div>
            </header>
            <main className="flex-1 p-6 bg-background">
              <div className="h-full rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
                {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)} Content Area
              </div>
            </main>
          </div>
        </div>
      </NavigationProvider>
    );
  },
};

/**
 * Compare different indicator types in a Navrail.
 */
export const IndicatorComparison: Story = {
  args: {
    indicatorAnimation: "spring",
    itemVariant: "ghost",
    itemShape: "rectangular",
  },
  render: (args) => {
    const [activeItems, setActiveItems] = React.useState({
      bar: "home",
      pill: "home",
      highlight: "home",
    });

    const indicators = [
      { type: "bar" as const, label: "Bar" },
      { type: "pill" as const, label: "Pill" },
      { type: "highlight" as const, label: "Highlight" },
    ];

    return (
      <div className="grid grid-cols-3 gap-6 p-6">
        {indicators.map(({ type, label }) => (
          <div key={type} className="space-y-2">
            <div className="text-sm font-medium text-center text-muted-foreground">{label}</div>
            <div className="border rounded-lg overflow-hidden bg-background h-[400px] flex flex-col">
              <div className="px-4 py-3 border-b flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
                  <Layout className="size-3.5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">App</span>
              </div>
              <div className="flex-1 p-2 overflow-y-auto">
                <PremiumNavGroup
                  activeItem={activeItems[type]}
                  onActiveItemChange={(id) => setActiveItems(prev => ({ ...prev, [type]: id }))}
                  indicatorAnimation={args.indicatorAnimation}
                  indicatorType={type}
                  indicatorPosition="left"
                >
                  {sidebarItems.map((item) => (
                    <PremiumNavItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      icon={item.icon}
                      variant={args.itemVariant}
                      shape={args.itemShape}
                    />
                  ))}
                </PremiumNavGroup>
              </div>
              <div className="px-4 py-3 border-t">
                <div className="flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">John</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
