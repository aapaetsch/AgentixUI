import type { Meta, StoryObj } from "@storybook/react";
import { CalendarDays, Info, MapPin, User } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  HoverCardArrow,
} from "./index";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import { Badge } from "../badge";

const meta: Meta<typeof HoverCard> = {
  title: "Overlay/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A popup that displays rich content when hovering over a trigger element.
Supports both hover and click trigger modes, with automatic touch device detection.

## Features

- **Hover Mode**: Opens on hover with configurable delays (default: 700ms open, 300ms close)
- **Click Mode**: Opens on click with close button, useful for touch devices
- **Touch Detection**: Automatically switches to click mode on touch devices
- **Size Variants**: Aligned with Card component sizing (xs, sm, md, lg, xl)
- **Arrow Support**: Optional arrow pointing to trigger
- **Scrollable Content**: Support for max-height with internal scrolling
- **Accessible**: Full keyboard navigation and ARIA support
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    triggerMode: {
      control: "radio",
      options: ["hover", "click"],
      description: "Trigger interaction mode",
      table: {
        defaultValue: { summary: "hover" },
      },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size variant aligned with Card component",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    openDelay: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description: "Delay in ms before opening (hover mode only)",
      table: {
        defaultValue: { summary: 700 },
      },
    },
    closeDelay: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description: "Delay in ms before closing (hover mode only)",
      table: {
        defaultValue: { summary: 300 },
      },
    },
    showCloseButton: {
      control: "boolean",
      description: "Show close button in content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button colorStyle="link" className="px-0">
          @nextjs
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button colorStyle="outlined">Hover with arrow</Button>
      </HoverCardTrigger>
      <HoverCardContent showArrow>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Arrow Example</h4>
          <p className="text-sm text-muted-foreground">
            This hover card has an arrow pointing to the trigger element.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// ============================================================================
// Trigger Modes
// ============================================================================

export const ClickMode: Story = {
  render: () => (
    <HoverCard triggerMode="click">
      <HoverCardTrigger asChild>
        <Button>Click to open</Button>
      </HoverCardTrigger>
      <HoverCardContent showArrow>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Click Mode</h4>
          <p className="text-sm text-muted-foreground">
            This card opens on click instead of hover. Click outside or use the
            close button to dismiss.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Click mode opens the card on click and shows a close button. Useful for touch devices or when hover behavior is not desired.",
      },
    },
  },
};

export const TriggerModeComparison: Story = {
  render: () => (
    <div className="flex gap-8">
      <HoverCard triggerMode="hover">
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Hover Mode</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="text-sm">This opens on hover with delays.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard triggerMode="click">
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Click Mode</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="text-sm">This opens on click with close button.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// ============================================================================
// Size Variants
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <HoverCard key={size} size={size}>
          <HoverCardTrigger asChild>
            <Button colorStyle="outlined" size="sm">
              Size: {size}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent showArrow>
            <div className="space-y-2">
              <h4 className="font-semibold">Size: {size.toUpperCase()}</h4>
              <p className="text-muted-foreground">
                This hover card uses the {size} size variant, which affects
                padding and width.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Size variants are aligned with the Card component: xs, sm, md, lg, xl. Each size affects padding and default width.",
      },
    },
  },
};

// ============================================================================
// Positioning
// ============================================================================

export const Positioning: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-8">
      <div />
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Top</Button>
        </HoverCardTrigger>
        <HoverCardContent side="top" showArrow>
          <p className="text-sm">Positioned on top</p>
        </HoverCardContent>
      </HoverCard>
      <div />

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Left</Button>
        </HoverCardTrigger>
        <HoverCardContent side="left" showArrow>
          <p className="text-sm">Positioned on left</p>
        </HoverCardContent>
      </HoverCard>
      <div />
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Right</Button>
        </HoverCardTrigger>
        <HoverCardContent side="right" showArrow>
          <p className="text-sm">Positioned on right</p>
        </HoverCardContent>
      </HoverCard>

      <div />
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Bottom</Button>
        </HoverCardTrigger>
        <HoverCardContent side="bottom" showArrow>
          <p className="text-sm">Positioned on bottom</p>
        </HoverCardContent>
      </HoverCard>
      <div />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use the `side` prop to position the hover card relative to the trigger.",
      },
    },
  },
};

export const Alignment: Story = {
  render: () => (
    <div className="flex gap-8">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Align Start</Button>
        </HoverCardTrigger>
        <HoverCardContent align="start" showArrow>
          <p className="text-sm">Aligned to start</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Align Center</Button>
        </HoverCardTrigger>
        <HoverCardContent align="center" showArrow>
          <p className="text-sm">Aligned to center (default)</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button colorStyle="outlined">Align End</Button>
        </HoverCardTrigger>
        <HoverCardContent align="end" showArrow>
          <p className="text-sm">Aligned to end</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// ============================================================================
// Scrolling Content
// ============================================================================

export const ScrollableContent: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button colorStyle="outlined">View Long Content</Button>
      </HoverCardTrigger>
      <HoverCardContent maxHeight="200px">
        <div className="space-y-3">
          <h4 className="font-semibold">Scrollable Content</h4>
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              This is paragraph {i + 1} of scrollable content. The content will
              scroll when it exceeds the max height.
            </p>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the `maxHeight` prop to enable scrolling for long content. Accepts "none", "auto" (60vh), or custom values like "200px".',
      },
    },
  },
};

export const MaxHeightAuto: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button colorStyle="outlined">Auto Max Height</Button>
      </HoverCardTrigger>
      <HoverCardContent maxHeight="auto">
        <div className="space-y-3">
          <h4 className="font-semibold">Auto Max Height (60vh)</h4>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-sm text-muted-foreground">
              Content item {i + 1}
            </p>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// ============================================================================
// Rich Content Examples
// ============================================================================

export const UserProfile: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button colorStyle="link" className="px-0 h-auto">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">shadcn</h4>
            <p className="text-sm text-muted-foreground">
              Building @shadcn/ui. Developer, designer, and open source
              enthusiast.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                1.2k followers
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                Remote
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  parameters: {
    docs: {
      description: {
        story: "A common use case: showing user profile information on hover.",
      },
    },
  },
};

export const ProductPreview: Story = {
  render: () => (
    <HoverCard size="lg">
      <HoverCardTrigger asChild>
        <Button colorStyle="link" className="text-base font-medium">
          MacBook Pro 14"
        </Button>
      </HoverCardTrigger>
      <HoverCardContent showArrow>
        <div className="space-y-3">
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
            <span className="text-4xl">💻</span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">MacBook Pro 14"</h4>
              <Badge variant="secondary">In Stock</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Apple M3 Pro chip, 18GB RAM, 512GB SSD
            </p>
            <p className="text-lg font-bold mt-2">$1,999</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const InformationTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="text-sm">Total Revenue</span>
      <HoverCard size="sm" openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-full p-1 hover:bg-muted">
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="text-sm">
            Total revenue includes all completed transactions minus refunds and
            chargebacks.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Hover cards can be used for contextual information, similar to rich tooltips.",
      },
    },
  },
};

// ============================================================================
// Custom Triggers
// ============================================================================

export const TextTrigger: Story = {
  render: () => (
    <p className="text-sm max-w-md">
      The{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="underline decoration-dotted cursor-help text-primary">
            React Framework
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-2">
            <h4 className="font-semibold">Next.js</h4>
            <p className="text-sm text-muted-foreground">
              Next.js is a React framework for building full-stack web
              applications. You use React Components to build user interfaces,
              and Next.js for additional features and optimizations.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      enables you to create high-quality web applications with the power of
      React components.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Hover cards can be triggered from inline text elements for contextual definitions.",
      },
    },
  },
};

export const IconTrigger: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted transition-colors">
          <CalendarDays className="h-5 w-5" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="font-semibold">Calendar</h4>
          <p className="text-sm text-muted-foreground">
            Click to view your schedule and upcoming events.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// ============================================================================
// Delay Configuration
// ============================================================================

export const FastOpen: Story = {
  render: () => (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button colorStyle="outlined">Fast Response (200ms)</Button>
      </HoverCardTrigger>
      <HoverCardContent showArrow>
        <p className="text-sm">This card opens quickly with a 200ms delay.</p>
      </HoverCardContent>
    </HoverCard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Configure `openDelay` and `closeDelay` props to control timing. Lower values provide faster response.",
      },
    },
  },
};

export const SlowOpen: Story = {
  render: () => (
    <HoverCard openDelay={1000} closeDelay={500}>
      <HoverCardTrigger asChild>
        <Button colorStyle="outlined">Slow Response (1s)</Button>
      </HoverCardTrigger>
      <HoverCardContent showArrow>
        <p className="text-sm">
          This card opens slowly with a 1 second delay.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};

// ============================================================================
// Edge Cases
// ============================================================================

export const MultipleHoverCards: Story = {
  render: () => (
    <div className="flex gap-2">
      {["Alice", "Bob", "Charlie", "Diana"].map((name) => (
        <HoverCard key={name}>
          <HoverCardTrigger asChild>
            <Button colorStyle="outlined" size="sm">
              {name}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{name}</h4>
                <p className="text-sm text-muted-foreground">
                  Team member since 2023
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple hover cards on a page work independently.",
      },
    },
  },
};

export const ControlledState: Story = {
  render: function ControlledExample() {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open</Button>
          <Button colorStyle="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
        <HoverCard open={open} onOpenChange={setOpen}>
          <HoverCardTrigger asChild>
            <Button colorStyle="link">Controlled Card</Button>
          </HoverCardTrigger>
          <HoverCardContent showArrow>
            <p className="text-sm">
              This card's state is controlled externally. Current state:{" "}
              <strong>{open ? "Open" : "Closed"}</strong>
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `open` and `onOpenChange` props to control the hover card state externally.",
      },
    },
  },
};

// ============================================================================
// Interactive Playground
// ============================================================================

export const Playground: Story = {
  args: {
    triggerMode: "hover",
    size: "md",
    openDelay: 700,
    closeDelay: 300,
    showCloseButton: false,
  },
  render: (args) => (
    <HoverCard
      triggerMode={args.triggerMode}
      size={args.size}
      openDelay={args.openDelay}
      closeDelay={args.closeDelay}
      showCloseButton={args.showCloseButton}
    >
      <HoverCardTrigger asChild>
        <Button colorStyle="outlined">Playground Trigger</Button>
      </HoverCardTrigger>
      <HoverCardContent showArrow>
        <div className="space-y-2">
          <h4 className="font-semibold">Interactive Playground</h4>
          <p className="text-sm text-muted-foreground">
            Use the controls panel to adjust the hover card properties and see
            the changes in real-time.
          </p>
          <dl className="text-xs space-y-1">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Trigger Mode:</dt>
              <dd className="font-mono">{args.triggerMode}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Size:</dt>
              <dd className="font-mono">{args.size}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Open Delay:</dt>
              <dd className="font-mono">{args.openDelay}ms</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Close Delay:</dt>
              <dd className="font-mono">{args.closeDelay}ms</dd>
            </div>
          </dl>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
