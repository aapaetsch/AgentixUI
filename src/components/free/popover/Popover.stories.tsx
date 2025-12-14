import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Input } from "../input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
  PopoverAnchor,
} from ".";

/**
 * A popover is a non-modal dialog that floats around a trigger element.
 * It's commonly used for displaying additional information or actions
 * related to a UI element.
 *
 * ## Features
 * - Click-triggered floating content
 * - Multiple size variants
 * - Optional arrow pointing to trigger
 * - Flexible positioning (top, right, bottom, left)
 * - Accessible by default
 *
 * ## Usage
 *
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>Open</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <p>Popover content</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
const meta: Meta<typeof Popover> = {
  title: "Free/Overlay/Popover",
  component: Popover,
  subcomponents: {
    PopoverTrigger: PopoverTrigger as React.ComponentType<unknown>,
    PopoverContent: PopoverContent as React.ComponentType<unknown>,
    PopoverClose: PopoverClose as React.ComponentType<unknown>,
    PopoverAnchor: PopoverAnchor as React.ComponentType<unknown>,
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-muted-foreground text-sm">
            Set the dimensions for the layer.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithArrow: Story = {
  parameters: {
    docs: {
      description: {
        story: "Add an arrow pointing to the trigger element using the `showArrow` prop.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Popover with arrow</Button>
      </PopoverTrigger>
      <PopoverContent showArrow>
        <p>This popover has an arrow pointing to the trigger element.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  parameters: {
    docs: {
      description: {
        story: "Popovers can contain interactive form elements.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="width" className="text-sm">Width</label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="maxWidth" className="text-sm">Max. width</label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="height" className="text-sm">Height</label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="maxHeight" className="text-sm">Max. height</label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// ============================================================================
// Size Variants
// ============================================================================

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "Popovers come in multiple sizes to accommodate different content needs.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Extra Small</Button>
        </PopoverTrigger>
        <PopoverContent size="xs" showArrow>
          <p className="text-xs">Extra small popover.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Small</Button>
        </PopoverTrigger>
        <PopoverContent size="sm" showArrow>
          <p className="text-sm">Small popover content.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Medium</Button>
        </PopoverTrigger>
        <PopoverContent size="md" showArrow>
          <p>Medium popover content (default size).</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Large</Button>
        </PopoverTrigger>
        <PopoverContent size="lg" showArrow>
          <p>Large popover content with more room.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Extra Large</Button>
        </PopoverTrigger>
        <PopoverContent size="xl" showArrow>
          <p>Extra large popover for extensive content and detailed information.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Auto Width</Button>
        </PopoverTrigger>
        <PopoverContent size="auto" showArrow>
          <p>Auto width adjusts to content.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

// ============================================================================
// Positioning
// ============================================================================

export const Positioning: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control where the popover appears relative to the trigger using the `side` prop.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-center gap-8 py-16">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top" showArrow>
          <p>This popover appears above the trigger.</p>
        </PopoverContent>
      </Popover>

      <div className="flex justify-between w-80">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Left</Button>
          </PopoverTrigger>
          <PopoverContent side="left" showArrow>
            <p>This popover appears to the left.</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Right</Button>
          </PopoverTrigger>
          <PopoverContent side="right" showArrow>
            <p>This popover appears to the right.</p>
          </PopoverContent>
        </Popover>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" showArrow>
          <p>This popover appears below the trigger.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control the alignment of the popover using the `align` prop.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Align Start</Button>
          </PopoverTrigger>
          <PopoverContent align="start" showArrow>
            <p>Aligned to the start of the trigger.</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Align Center</Button>
          </PopoverTrigger>
          <PopoverContent align="center" showArrow>
            <p>Aligned to the center of the trigger.</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Align End</Button>
          </PopoverTrigger>
          <PopoverContent align="end" showArrow>
            <p>Aligned to the end of the trigger.</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};

// ============================================================================
// Interactive Examples
// ============================================================================

export const WithCloseButton: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `PopoverClose` to add a close button inside the popover.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Confirmation</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <h4 className="font-medium leading-none">Are you sure?</h4>
          <p className="text-muted-foreground text-sm">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button size="sm">Confirm</Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control the popover state programmatically using `open` and `onOpenChange`.",
      },
    },
  },
  render: function ControlledPopover() {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Open"} Externally
        </Button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="secondary">Toggle Popover</Button>
          </PopoverTrigger>
          <PopoverContent showArrow>
            <p>This popover can be controlled externally.</p>
            <p className="text-muted-foreground text-sm mt-2">
              Open state: {open ? "true" : "false"}
            </p>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
};

export const WithAnchor: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `PopoverAnchor` to position the popover relative to a different element than the trigger.",
      },
    },
  },
  render: () => (
    <Popover>
      <div className="flex items-center gap-4">
        <PopoverAnchor asChild>
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Anchor</span>
          </div>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <Button variant="outline">Open (anchored to box)</Button>
        </PopoverTrigger>
      </div>
      <PopoverContent side="right" showArrow>
        <p>This popover is anchored to the gray box, not the button.</p>
      </PopoverContent>
    </Popover>
  ),
};

// ============================================================================
// Complex Examples
// ============================================================================

export const UserProfile: Story = {
  parameters: {
    docs: {
      description: {
        story: "Example of a user profile popover with rich content.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            JD
          </div>
          <span>John Doe</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent size="lg" align="end">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-medium">
              JD
            </div>
            <div>
              <h4 className="font-semibold">John Doe</h4>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
          </div>
          <hr className="border-border" />
          <div className="flex flex-col gap-1">
            <button className="text-left px-2 py-1.5 text-sm rounded hover:bg-muted">
              Your Profile
            </button>
            <button className="text-left px-2 py-1.5 text-sm rounded hover:bg-muted">
              Settings
            </button>
            <button className="text-left px-2 py-1.5 text-sm rounded hover:bg-muted">
              Help & Support
            </button>
          </div>
          <hr className="border-border" />
          <button className="text-left px-2 py-1.5 text-sm rounded hover:bg-muted text-destructive">
            Sign Out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const ColorPicker: Story = {
  parameters: {
    docs: {
      description: {
        story: "Example of a color picker popover.",
      },
    },
  },
  render: function ColorPickerExample() {
    const [color, setColor] = React.useState("#3b82f6");
    const colors = [
      "#ef4444", "#f97316", "#eab308", "#22c55e",
      "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
    ];

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-10 h-10 rounded-lg border border-border shadow-sm"
            style={{ backgroundColor: color }}
            aria-label="Pick a color"
          />
        </PopoverTrigger>
        <PopoverContent size="auto" showArrow>
          <div className="space-y-3">
            <p className="text-sm font-medium">Pick a color</p>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 text-sm"
              placeholder="#000000"
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};

export const Notification: Story = {
  parameters: {
    docs: {
      description: {
        story: "Example of a notifications popover.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          Notifications
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent size="lg" align="end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            <button className="text-sm text-muted-foreground hover:text-foreground">
              Mark all as read
            </button>
          </div>
          <hr className="border-border" />
          <div className="flex flex-col gap-1 max-h-64 overflow-auto">
            {[
              { title: "New message", desc: "You have a new message from Sarah", time: "2m ago" },
              { title: "Order shipped", desc: "Your order #12345 has been shipped", time: "1h ago" },
              { title: "Welcome!", desc: "Thanks for signing up to our platform", time: "2d ago" },
            ].map((n, i) => (
              <button
                key={i}
                className="text-left p-2 rounded hover:bg-muted flex flex-col gap-0.5"
              >
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.desc}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </button>
            ))}
          </div>
          <hr className="border-border" />
          <button className="text-sm text-center text-primary hover:underline">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
