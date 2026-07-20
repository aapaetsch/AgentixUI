import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "lucide-react";

import { EmptyState } from "./index";
import { Button } from "../button";
import { Card, CardContent } from "../card";

/**
 * # EmptyState
 *
 * A composite display primitive for representing the absence of data in a
 * list, grid, or table. Renders a centered stack of optional icon, title,
 * optional description, and optional CTA action — all in muted styling.
 *
 * ## Features
 * - Flat, composite props API (no context provider / sub-components)
 * - Optional default `Inbox` icon (pass `icon={null}` to hide)
 * - Three size presets: `sm`, `md`, `lg`
 * - Forwards ref and spreads DOM attributes onto the root `<div>`
 *
 * ## Usage
 * ```tsx
 * <EmptyState
 *   title="No results"
 *   description="Try adjusting your filters."
 *   action={<Button>Add new</Button>}
 * />
 * ```
 */
const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Controls icon size and title typography scale",
    },
    icon: {
      control: false,
      description:
        "Icon slot. Pass `null`/`false` to hide. Defaults to the lucide `Inbox` icon.",
    },
    title: {
      control: "text",
      description: "Title rendered under the icon. Defaults to 'Nothing here'.",
    },
    description: {
      control: "text",
      description: "Secondary copy rendered under the title.",
    },
    action: {
      control: false,
      description: "Optional CTA rendered below the description.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: "Try adjusting your filters to see more results.",
  },
};

export const WithAction: Story = {
  args: {
    description: "No items have been added yet.",
    action: <Button>Add new</Button>,
  },
};

// ============================================================================
// Icon variations
// ============================================================================

export const WithoutIcon: Story = {
  args: {
    icon: null,
    description: "An empty state without any icon.",
  },
};

/**
 * `icon={false}` mirrors the documented `icon={null}` behavior — both hide
 * the icon slot. Story guards against regression of the falsy branch.
 */
export const WithoutIconFalse: Story = {
  args: {
    icon: false,
    title: "No notifications",
    description: "You're all caught up.",
  },
};

export const CustomIcon: Story = {
  args: {
    icon: <Search className="h-10 w-10 text-muted-foreground" />,
    title: "No results found",
    description: "Try different keywords or remove a filter.",
  },
};

// ============================================================================
// Sizes
// ============================================================================

export const SizeSm: Story = {
  args: {
    size: "sm",
    description: "A compact empty state for tight spaces.",
  },
};

export const SizeMd: Story = {
  args: {
    size: "md",
    description: "The default empty state size.",
  },
};

export const SizeLg: Story = {
  args: {
    size: "lg",
    description: "A roomy empty state for hero / full-page moments.",
  },
};

// ============================================================================
// In context
// ============================================================================

export const InsideCard: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardContent className="py-12">{/* CardContent pads as needed */}
        <EmptyState
          description="This table has no rows yet."
          action={<Button variant="outline">Load data</Button>}
        />
      </CardContent>
    </Card>
  ),
};