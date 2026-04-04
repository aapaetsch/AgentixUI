import type { Meta, StoryObj } from "@storybook/react";
import {
  Home,
  Inbox,
  Calendar,
  Search,
} from "lucide-react";

import {
  NavigationProvider,
  NavItem,
} from "./index";

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Navigation/Accessibility",
  component: NavItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Accessibility features and keyboard navigation support.

## Features
- Full keyboard navigation with Tab
- Enter/Space to activate items
- Arrow keys for navigation within sections
- Focus visible indicators
- ARIA labels and roles
- Screen reader support
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavItem>;

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

export const KeyboardNavigation: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="home">
      <div className="p-8 space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Use <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> to navigate between items,
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">Enter</kbd> or
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">Space</kbd> to activate.
        </p>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Navigation Items</h3>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </NavigationProvider>
  ),
};
