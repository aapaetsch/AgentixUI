import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AnimatedChevron } from "./index";

/**
 * # AnimatedChevron
 *
 * A standalone animated chevron indicator with morphing SVG animation.
 *
 * ## Features
 * - Morphing animation where chevron shape transforms (not just rotation)
 * - Three animation presets: smooth (default), bounce, sharp
 * - Size variants matching button icon sizes (xs-xl)
 * - Direction support: down, up, left, right
 * - Controlled via `open` prop
 *
 * ## Usage
 * Use this component independently in dropdowns, accordions, expandable sections,
 * navigation menus, and any UI element that needs a visual open/close indicator.
 *
 * For rotating icons (like Plus becoming X), use a regular icon with CSS rotation.
 * The AnimatedChevron is specifically designed for smooth chevron morphing.
 */
const meta: Meta<typeof AnimatedChevron> = {
  title: "Components/AnimatedChevron",
  component: AnimatedChevron,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the chevron is in the open state",
    },
    animation: {
      control: "select",
      options: ["smooth", "bounce", "sharp"],
      description: "Animation preset for the morphing transition",
    },
    direction: {
      control: "select",
      options: ["down", "up", "left", "right"],
      description: "Direction the chevron points when closed",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the chevron icon",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedChevron>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  args: {
    open: false,
  },
};

export const Open: Story = {
  args: {
    open: true,
  },
};

// ============================================================================
// Interactive Demo
// ============================================================================

export const Interactive: Story = {
  name: "Interactive Demo",
  render: function InteractiveDemo() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm text-muted-foreground max-w-md text-center">
          The AnimatedChevron morphs its shape when toggling between open and
          closed states. Click the button to see the animation.
        </p>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent transition-colors"
        >
          <span>Toggle Chevron</span>
          <AnimatedChevron open={isOpen} />
        </button>

        <p className="text-xs text-muted-foreground">
          State: {isOpen ? "Open" : "Closed"}
        </p>
      </div>
    );
  },
};

// ============================================================================
// Size Variants
// ============================================================================

export const Sizes: Story = {
  name: "Size Variants",
  render: function SizesDemo() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm text-muted-foreground max-w-md text-center">
          Size variants match button icon sizes for consistent UI scaling.
        </p>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Toggle All ({isOpen ? "Open" : "Closed"})
        </button>

        <div className="flex items-end gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} size="xs" />
            </div>
            <span className="text-xs text-muted-foreground">xs</span>
            <span className="text-xs text-muted-foreground">14px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} size="sm" />
            </div>
            <span className="text-xs text-muted-foreground">sm</span>
            <span className="text-xs text-muted-foreground">16px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} size="md" />
            </div>
            <span className="text-xs text-muted-foreground">md</span>
            <span className="text-xs text-muted-foreground">16px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} size="lg" />
            </div>
            <span className="text-xs text-muted-foreground">lg</span>
            <span className="text-xs text-muted-foreground">20px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} size="xl" />
            </div>
            <span className="text-xs text-muted-foreground">xl</span>
            <span className="text-xs text-muted-foreground">24px</span>
          </div>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Animation Presets
// ============================================================================

export const AnimationPresets: Story = {
  name: "Animation Presets",
  render: function AnimationPresetsDemo() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm text-muted-foreground max-w-md text-center">
          Three animation presets provide different feels. Click to compare
          the easing functions.
        </p>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Toggle All ({isOpen ? "Open" : "Closed"})
        </button>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} animation="smooth" size="lg" />
            </div>
            <span className="text-sm font-medium">Smooth</span>
            <span className="text-xs text-muted-foreground text-center max-w-24">
              MD3 standard deceleration (200ms)
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} animation="bounce" size="lg" />
            </div>
            <span className="text-sm font-medium">Bounce</span>
            <span className="text-xs text-muted-foreground text-center max-w-24">
              Playful overshoot (300ms)
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} animation="sharp" size="lg" />
            </div>
            <span className="text-sm font-medium">Sharp</span>
            <span className="text-xs text-muted-foreground text-center max-w-24">
              Quick and snappy (150ms)
            </span>
          </div>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Direction Variants
// ============================================================================

export const Directions: Story = {
  name: "Direction Variants",
  render: function DirectionsDemo() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm text-muted-foreground max-w-md text-center">
          The chevron can point in different directions for various contexts
          like side navigation, horizontal accordions, or tree views.
        </p>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Toggle ({isOpen ? "Open" : "Closed"})
        </button>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} direction="down" size="lg" />
            </div>
            <span className="text-sm">Down</span>
            <span className="text-xs text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} direction="up" size="lg" />
            </div>
            <span className="text-sm">Up</span>
            <span className="text-xs text-muted-foreground">Inverted</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} direction="right" size="lg" />
            </div>
            <span className="text-sm">Right</span>
            <span className="text-xs text-muted-foreground">Side nav</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-lg border">
              <AnimatedChevron open={isOpen} direction="left" size="lg" />
            </div>
            <span className="text-sm">Left</span>
            <span className="text-xs text-muted-foreground">RTL</span>
          </div>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Use Case Examples
// ============================================================================

export const DropdownButton: Story = {
  name: "Dropdown Button Example",
  render: function DropdownButtonExample() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Common use case: Dropdown trigger button
        </p>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Options
          <AnimatedChevron open={isOpen} size="sm" />
        </button>
      </div>
    );
  },
};

export const TreeNode: Story = {
  name: "Tree Node Example",
  render: function TreeNodeExample() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
      folder1: false,
      folder2: true,
    });

    const toggle = (key: string) => {
      setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="flex flex-col gap-4 w-[280px]">
        <p className="text-sm text-muted-foreground text-center">
          Tree view with expandable nodes
        </p>

        <div className="rounded-lg border p-2">
          <button
            onClick={() => toggle("folder1")}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
          >
            <AnimatedChevron
              open={expanded.folder1}
              direction="right"
              size="sm"
            />
            <span>📁 Documents</span>
          </button>
          {expanded.folder1 && (
            <div className="ml-6 border-l pl-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <span className="size-4" />
                <span>📄 Report.pdf</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <span className="size-4" />
                <span>📄 Notes.txt</span>
              </div>
            </div>
          )}

          <button
            onClick={() => toggle("folder2")}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
          >
            <AnimatedChevron
              open={expanded.folder2}
              direction="right"
              size="sm"
            />
            <span>📁 Projects</span>
          </button>
          {expanded.folder2 && (
            <div className="ml-6 border-l pl-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <span className="size-4" />
                <span>📁 Website</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <span className="size-4" />
                <span>📁 Mobile App</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
};

export const CollapsibleSection: Story = {
  name: "Collapsible Section Example",
  render: function CollapsibleSectionExample() {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="w-[400px]">
        <p className="text-sm text-muted-foreground text-center mb-4">
          Collapsible section header
        </p>

        <div className="rounded-lg border">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50"
          >
            <div>
              <h3 className="font-medium">Advanced Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure advanced options
              </p>
            </div>
            <AnimatedChevron open={isOpen} animation="smooth" />
          </button>

          {isOpen && (
            <div className="border-t p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable debug mode</span>
                <div className="size-4 rounded border" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show developer tools</span>
                <div className="size-4 rounded border" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Log API requests</span>
                <div className="size-4 rounded border" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
};

// ============================================================================
// Customization
// ============================================================================

export const CustomColors: Story = {
  name: "Custom Colors",
  render: function CustomColorsDemo() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm text-muted-foreground max-w-md text-center">
          The chevron inherits text color, so it can be customized with
          Tailwind text color classes.
        </p>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Toggle ({isOpen ? "Open" : "Closed"})
        </button>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <AnimatedChevron open={isOpen} size="lg" />
            <span className="text-xs text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AnimatedChevron
              open={isOpen}
              size="lg"
              className="text-primary"
            />
            <span className="text-xs text-muted-foreground">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AnimatedChevron
              open={isOpen}
              size="lg"
              className="text-destructive"
            />
            <span className="text-xs text-muted-foreground">Destructive</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AnimatedChevron
              open={isOpen}
              size="lg"
              className="text-green-600"
            />
            <span className="text-xs text-muted-foreground">Success</span>
          </div>
        </div>
      </div>
    );
  },
};
