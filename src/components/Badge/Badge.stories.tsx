import type { Meta, StoryObj } from "@storybook/react";
import { Badge, BadgeAnchor, AnimatedBadge } from "./index";
import {
  Bell,
  Mail,
  ShoppingCart,
  Heart,
  MessageCircle,
  Check,
  AlertTriangle,
  X,
  Star,
  Inbox,
} from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "success",
        "warning",
      ],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    maxChars: {
      control: "number",
    },
    tabularNums: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ============================================================================
// Basic Badge Stories
// ============================================================================

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
    size: "medium",
  },
  render: (args) => <Badge {...args} />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    variant: "outline",
    size: "large"
  },

  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Badge size="small" />
        <span className="text-xs text-muted-foreground">Small (dot)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Badge size="medium">12</Badge>
        <span className="text-xs text-muted-foreground">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Badge size="large">12</Badge>
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
    </div>
  )
};

// ============================================================================
// Numeric Badge Stories
// ============================================================================

export const NumericBadges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge>{1}</Badge>
      <Badge>{10}</Badge>
      <Badge>{99}</Badge>
      <Badge>{999}</Badge>
      <Badge>{1234}</Badge>
      <Badge variant="destructive">{9999}</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Numeric badges automatically use tabular numerals and truncate values over 999 to show '999+' following MD3 guidelines.",
      },
    },
  },
};

export const CustomMaxChars: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">maxChars=2:</span>
        <Badge maxChars={2}>{5}</Badge>
        <Badge maxChars={2}>{10}</Badge>
        <Badge maxChars={2}>{99}</Badge>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">maxChars=3:</span>
        <Badge maxChars={3}>{50}</Badge>
        <Badge maxChars={3}>{100}</Badge>
        <Badge maxChars={3}>{999}</Badge>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">maxChars=4:</span>
        <Badge maxChars={4}>{500}</Badge>
        <Badge maxChars={4}>{1000}</Badge>
        <Badge maxChars={4}>{9999}</Badge>
      </div>
    </div>
  ),
};

// ============================================================================
// With Icons Stories
// ============================================================================

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge>
        <Check className="size-3" />
        Verified
      </Badge>
      <Badge variant="destructive">
        <AlertTriangle className="size-3" />
        Error
      </Badge>
      <Badge variant="success">
        <Check className="size-3" />
        Approved
      </Badge>
      <Badge variant="warning">
        <AlertTriangle className="size-3" />
        Pending
      </Badge>
      <Badge variant="secondary">
        <Star className="size-3" />
        Featured
      </Badge>
    </div>
  ),
};

// ============================================================================
// Badge Anchor Stories
// ============================================================================

export const BadgeOnIcon: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <BadgeAnchor badge={<Badge>{3}</Badge>}>
        <Bell className="size-6" />
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge variant="destructive">{12}</Badge>}>
        <Mail className="size-6" />
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge>{99}</Badge>}>
        <ShoppingCart className="size-6" />
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge>{1234}</Badge>}>
        <MessageCircle className="size-6" />
      </BadgeAnchor>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "BadgeAnchor positions badges on icons with proper MD3 placement and RTL support.",
      },
    },
  },
};

export const SmallBadgeIndicator: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <BadgeAnchor badge={<Badge size="small" />}>
        <Bell className="size-6" />
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge size="small" variant="destructive" />}>
        <Mail className="size-6" />
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge size="small" variant="success" />}>
        <Inbox className="size-6" />
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge size="small" variant="warning" />}>
        <Heart className="size-6" />
      </BadgeAnchor>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Small badges are simple dot indicators used to show unread notifications without count information.",
      },
    },
  },
};

export const BadgePositions: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <div className="flex flex-col items-center gap-2">
        <BadgeAnchor badge={<Badge>{1}</Badge>} position="top-right">
          <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
            <Bell className="size-6" />
          </div>
        </BadgeAnchor>
        <span className="text-xs text-muted-foreground">top-right</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BadgeAnchor badge={<Badge>{2}</Badge>} position="top-left">
          <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
            <Bell className="size-6" />
          </div>
        </BadgeAnchor>
        <span className="text-xs text-muted-foreground">top-left</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BadgeAnchor badge={<Badge>{3}</Badge>} position="bottom-right">
          <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
            <Bell className="size-6" />
          </div>
        </BadgeAnchor>
        <span className="text-xs text-muted-foreground">bottom-right</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BadgeAnchor badge={<Badge>{4}</Badge>} position="bottom-left">
          <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
            <Bell className="size-6" />
          </div>
        </BadgeAnchor>
        <span className="text-xs text-muted-foreground">bottom-left</span>
      </div>
    </div>
  ),
};

// ============================================================================
// Animation Stories
// ============================================================================

export const AnimatedBadgeDemo: Story = {
  render: function AnimatedBadgeStory() {
    const [visible, setVisible] = useState(true);

    return (
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => setVisible(!visible)}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Toggle Badge ({visible ? "visible" : "hidden"})
        </button>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <AnimatedBadge visible={visible} animation="scale">
              {5}
            </AnimatedBadge>
            <span className="text-xs text-muted-foreground">scale</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AnimatedBadge visible={visible} animation="fade">
              {5}
            </AnimatedBadge>
            <span className="text-xs text-muted-foreground">fade</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AnimatedBadge visible={visible} animation="slide">
              {5}
            </AnimatedBadge>
            <span className="text-xs text-muted-foreground">slide</span>
          </div>
        </div>
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "AnimatedBadge provides built-in entrance/exit animations following MD3 motion guidelines.",
      },
    },
  },
};

export const BadgeAnchorAnimation: Story = {
  args: {
    size: "large"
  },

  render: function BadgeAnchorAnimationStory() {
    const [count, setCount] = useState(3);

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2">
          <button
            onClick={() => setCount(Math.max(0, count - 1))}
            className="rounded-md bg-secondary px-3 py-1.5 text-sm"
          >
            -
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="rounded-md bg-secondary px-3 py-1.5 text-sm"
          >
            +
          </button>
          <button
            onClick={() => setCount(0)}
            className="rounded-md bg-destructive px-3 py-1.5 text-sm text-white"
          >
            Clear
          </button>
        </div>
        <BadgeAnchor
          badge={<Badge variant="destructive">{count}</Badge>}
          showBadge={count > 0}
          animate
        >
          <div className="flex size-14 items-center justify-center rounded-xl border-2 bg-muted">
            <Bell className="size-7" />
          </div>
        </BadgeAnchor>
        <span className="text-sm text-muted-foreground">
          Count: {count} (badge {count > 0 ? "visible" : "hidden"})
        </span>
      </div>
    );
  },

  parameters: {
    docs: {
      description: {
        story:
          "BadgeAnchor supports animated entrance/exit when showBadge prop changes.",
      },
    },
  }
};

// ============================================================================
// Use Case Stories
// ============================================================================

export const NavigationExample: Story = {
  render: () => (
    <div className="flex items-center gap-6 rounded-xl border bg-background p-4">
      <BadgeAnchor badge={<Badge size="small" />}>
        <div className="flex flex-col items-center gap-1">
          <Bell className="size-6" />
          <span className="text-xs">Alerts</span>
        </div>
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge size="medium">{5}</Badge>}>
        <div className="flex flex-col items-center gap-1">
          <Mail className="size-6" />
          <span className="text-xs">Inbox</span>
        </div>
      </BadgeAnchor>
      <BadgeAnchor badge={<Badge size="medium" variant="destructive">{2}</Badge>}>
        <div className="flex flex-col items-center gap-1">
          <ShoppingCart className="size-6" />
          <span className="text-xs">Cart</span>
        </div>
      </BadgeAnchor>
      <div className="flex flex-col items-center gap-1">
        <Heart className="size-6" />
        <span className="text-xs">Saved</span>
      </div>
    </div>
  ),

  parameters: {
    docs: {
      description: {
        story: "Example of badges in a navigation bar context following MD3 guidelines.",
      },
    },
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Badge variant="success">Active</Badge>
        <span className="text-sm">Production deployment</span>
      </div>
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Badge variant="warning">Pending</Badge>
        <span className="text-sm">Review required</span>
      </div>
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Badge variant="destructive">Failed</Badge>
        <span className="text-sm">Build error</span>
      </div>
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Badge variant="secondary">Draft</Badge>
        <span className="text-sm">Unpublished changes</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Badges can be used to indicate status in lists and data displays.",
      },
    },
  },
};

export const RTLSupport: Story = {
  render: () => (
    <div className="flex gap-12">
      <div className="flex flex-col items-center gap-4">
        <span className="text-sm font-medium">LTR</span>
        <div dir="ltr">
          <BadgeAnchor badge={<Badge>{3}</Badge>} position="top-right">
            <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
              <Bell className="size-6" />
            </div>
          </BadgeAnchor>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <span className="text-sm font-medium">RTL</span>
        <div dir="rtl">
          <BadgeAnchor badge={<Badge>{3}</Badge>} position="top-right">
            <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
              <Bell className="size-6" />
            </div>
          </BadgeAnchor>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "BadgeAnchor automatically adjusts badge position for RTL layouts following MD3 guidelines.",
      },
    },
  },
};
