import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Home,
  Layout,
  Bell,
  Search,
  Package,
  ShoppingCart,
  Users,
  HelpCircle,
} from "lucide-react";

import { PremiumNavGroup, PremiumNavItem } from "./index";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
} from "./index";
import { Button } from "../button";
import { Avatar, AvatarFallback } from "../avatar";

// ============================================================================
// Story Args Types
// ============================================================================

interface NavbarStoryArgs {
  indicatorAnimation: "slide" | "spring" | "morph" | "snap" | "fade";
  indicatorType: "bar" | "pill" | "line" | "underline" | "topline" | "highlight" | "dot";
  itemVariant: "default" | "subtle" | "filled" | "bordered" | "ghost";
  itemShape: "rectangular" | "pill";
}

// ============================================================================
// Sample Data
// ============================================================================

const navbarItems = [
  { id: "home", label: "Home", icon: <Home className="size-4" /> },
  { id: "products", label: "Products", icon: <Package className="size-4" /> },
  { id: "pricing", label: "Pricing", icon: <ShoppingCart className="size-4" /> },
  { id: "about", label: "About", icon: <Users className="size-4" /> },
  { id: "contact", label: "Contact", icon: <HelpCircle className="size-4" /> },
];

// ============================================================================
// Meta
// ============================================================================

const meta: Meta<NavbarStoryArgs> = {
  title: "Navigation/Navbar Advanced",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Premium Navbar with animated sliding indicators.

## Features
- Animated indicator that slides between items
- Multiple indicator types: underline, topline, pill, dot
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
      table: { defaultValue: { summary: "slide" } },
    },
    indicatorType: {
      control: "select",
      options: ["bar", "pill", "line", "underline", "topline", "highlight", "dot"],
      description: "Visual style of the indicator",
      table: { defaultValue: { summary: "underline" } },
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
    indicatorAnimation: "slide",
    indicatorType: "underline",
    itemVariant: "ghost",
    itemShape: "rectangular",
  },
};

export default meta;
type Story = StoryObj<NavbarStoryArgs>;

// ============================================================================
// Stories
// ============================================================================

/**
 * Navbar with animated sliding indicator.
 */
export const Default: Story = {
  render: (args) => {
    const [activeItem, setActiveItem] = React.useState("home");

    return (
      <div className="min-h-[400px] bg-muted/30">
        <Navbar bordered sticky className="bg-background">
          <NavbarBrand>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Layout className="size-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:inline">Acme Inc</span>
            </div>
          </NavbarBrand>
          
          <NavbarContent position="center" className="hidden md:flex">
            <PremiumNavGroup
              orientation="horizontal"
              activeItem={activeItem}
              onActiveItemChange={setActiveItem}
              indicatorAnimation={args.indicatorAnimation}
              indicatorType={args.indicatorType}
            >
              {navbarItems.map((item) => (
                <PremiumNavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  variant={args.itemVariant}
                  shape={args.itemShape}
                />
              ))}
            </PremiumNavGroup>
          </NavbarContent>

          <NavbarActions>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="size-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
            </Button>
            <Avatar className="size-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </NavbarActions>
        </Navbar>

        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
              Welcome to {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
            </h1>
            <p className="text-muted-foreground">
              Click the nav items to see the smooth indicator transition.
            </p>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Compare different indicator types in a navbar.
 */
export const IndicatorComparison: Story = {
  args: {
    indicatorAnimation: "spring",
    itemVariant: "ghost",
    itemShape: "rectangular",
  },
  render: (args) => {
    const [activeItems, setActiveItems] = React.useState({
      underline: "home",
      topline: "home",
      pill: "home",
      dot: "home",
    });

    const indicators = [
      { type: "underline" as const, label: "Underline" },
      { type: "topline" as const, label: "Topline" },
      { type: "pill" as const, label: "Pill" },
      { type: "dot" as const, label: "Dot" },
    ];

    return (
      <div className="space-y-6 p-8">
        {indicators.map(({ type, label }) => (
          <div key={type} className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">{label}</div>
            <Navbar bordered className="bg-background rounded-lg">
              <NavbarBrand>
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <Layout className="size-4 text-primary-foreground" />
                </div>
              </NavbarBrand>
              
              <NavbarContent position="center">
                <PremiumNavGroup
                  orientation="horizontal"
                  activeItem={activeItems[type]}
                  onActiveItemChange={(id) => setActiveItems(prev => ({ ...prev, [type]: id }))}
                  indicatorAnimation={args.indicatorAnimation}
                  indicatorType={type}
                >
                  {navbarItems.slice(0, 4).map((item) => (
                    <PremiumNavItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      variant={args.itemVariant}
                      shape={args.itemShape}
                    />
                  ))}
                </PremiumNavGroup>
              </NavbarContent>

              <NavbarActions>
                <Avatar className="size-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </NavbarActions>
            </Navbar>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Compare animation styles.
 */
export const AnimationComparison: Story = {
  args: {
    indicatorType: "underline",
    itemVariant: "ghost",
    itemShape: "rectangular",
  },
  render: (args) => {
    const [activeItems, setActiveItems] = React.useState({
      slide: "home",
      spring: "home",
      morph: "home",
      snap: "home",
    });

    const animations = [
      { type: "slide" as const, label: "Slide", description: "Smooth linear transition" },
      { type: "spring" as const, label: "Spring", description: "Elastic overshoot effect" },
      { type: "morph" as const, label: "Morph", description: "Gentle eased transition" },
      { type: "snap" as const, label: "Snap", description: "Fast, snappy movement" },
    ];

    return (
      <div className="space-y-6 p-8">
        {animations.map(({ type, label, description }) => (
          <div key={type} className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </div>
            <div className="border rounded-lg p-3 bg-background">
              <PremiumNavGroup
                orientation="horizontal"
                activeItem={activeItems[type]}
                onActiveItemChange={(id) => setActiveItems(prev => ({ ...prev, [type]: id }))}
                indicatorAnimation={type}
                indicatorType={args.indicatorType}
              >
                {navbarItems.map((item) => (
                  <PremiumNavItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    variant={args.itemVariant}
                    shape={args.itemShape}
                  />
                ))}
              </PremiumNavGroup>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
