import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Plus,
  Settings,
  Heart,
  Share2,
  Download,
  Trash2,
  Edit,
  Copy,
  Info,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "./index";
import { Button } from "../button";
import { IconButton } from "../button/icon-button";

/**
 * A popup that displays information related to an element when the element
 * receives keyboard focus or the mouse hovers over it.
 *
 * ## Features
 * - 4 sizes: `xs`, `sm`, `md`, `lg`
 * - Configurable positioning (top, right, bottom, left)
 * - Optional arrow indicator
 * - Smooth CSS animations with direction-aware slides
 * - Built on Radix UI for full accessibility
 *
 * ## Accessibility
 * - Shows on hover and keyboard focus
 * - Dismissible with Escape key
 * - Proper ARIA attributes
 */
const meta: Meta<typeof Tooltip> = {
  title: "Overlay/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button colorStyle="outlined">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button colorStyle="outlined">With Arrow</Button>
      </TooltipTrigger>
      <TooltipContent showArrow>
        <p>This tooltip has an arrow</p>
      </TooltipContent>
    </Tooltip>
  ),
};

// ============================================================================
// Size Variants
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined" size="xs">
            XS
          </Button>
        </TooltipTrigger>
        <TooltipContent size="xs" showArrow>
          <p>Extra small tooltip</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined" size="sm">
            SM
          </Button>
        </TooltipTrigger>
        <TooltipContent size="sm" showArrow>
          <p>Small tooltip</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined" size="md">
            MD
          </Button>
        </TooltipTrigger>
        <TooltipContent size="md" showArrow>
          <p>Medium tooltip (default)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined" size="lg">
            LG
          </Button>
        </TooltipTrigger>
        <TooltipContent size="lg" showArrow>
          <p>Large tooltip with more content</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// ============================================================================
// Positioning
// ============================================================================

export const Positioning: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-8">
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined" className="w-full">
            Top
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" showArrow>
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
      <div />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined" className="w-full">
            Left
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" showArrow>
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
      <div className="flex items-center justify-center text-muted-foreground text-sm">
        Positioning
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined" className="w-full">
            Right
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" showArrow>
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined" className="w-full">
            Bottom
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" showArrow>
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
      <div />
    </div>
  ),
};

// ============================================================================
// Alignment
// ============================================================================

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button colorStyle="outlined" className="w-32">
              Start
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start" showArrow>
            <p>Aligned to start</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button colorStyle="outlined" className="w-32">
              Center
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" showArrow>
            <p>Aligned to center</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button colorStyle="outlined" className="w-32">
              End
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" showArrow>
            <p>Aligned to end</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

// ============================================================================
// With Icon Buttons
// ============================================================================

export const WithIconButtons: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Add item" colorStyle="standard">
            <Plus />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add item</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Edit" colorStyle="standard">
            <Edit />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Copy" colorStyle="standard">
            <Copy />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy to clipboard</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Share" colorStyle="standard">
            <Share2 />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Download" colorStyle="standard">
            <Download />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Delete" colorStyle="standard">
            <Trash2 />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// ============================================================================
// Toolbar Example
// ============================================================================

export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-1 p-2 border rounded-lg bg-background">
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Like" colorStyle="standard" size="sm">
            <Heart />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent size="sm">
          <p>Like</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Share" colorStyle="standard" size="sm">
            <Share2 />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent size="sm">
          <p>Share</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Download" colorStyle="standard" size="sm">
            <Download />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent size="sm">
          <p>Download</p>
        </TooltipContent>
      </Tooltip>

      <div className="w-px h-6 bg-border mx-1" />

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Settings" colorStyle="standard" size="sm">
            <Settings />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent size="sm">
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// ============================================================================
// Rich Content
// ============================================================================

export const RichContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button colorStyle="outlined">
          <Info className="mr-2 h-4 w-4" />
          More Info
        </Button>
      </TooltipTrigger>
      <TooltipContent size="lg" className="max-w-xs" showArrow>
        <div className="space-y-1">
          <p className="font-medium">Pro Tip</p>
          <p className="text-background/80">
            You can use keyboard shortcuts to quickly navigate. Press{" "}
            <kbd className="px-1 py-0.5 bg-background/20 rounded text-xs">
              Ctrl+K
            </kbd>{" "}
            to open the command palette.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

// ============================================================================
// Custom Delay
// ============================================================================

export const CustomDelay: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined">Instant (0ms)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Shows immediately</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined">Slow (500ms)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Shows after 500ms</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button colorStyle="outlined">Very Slow (1s)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Shows after 1 second</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// ============================================================================
// Inline Text
// ============================================================================

export const InlineText: Story = {
  render: () => (
    <p className="text-sm text-muted-foreground max-w-md">
      This is some text with an{" "}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted cursor-help text-foreground">
            inline tooltip
          </span>
        </TooltipTrigger>
        <TooltipContent size="sm">
          <p>Helpful context about this term</p>
        </TooltipContent>
      </Tooltip>{" "}
      that provides additional context. You can also add tooltips to{" "}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted cursor-help text-foreground">
            technical terms
          </span>
        </TooltipTrigger>
        <TooltipContent size="sm">
          <p>A word or phrase with a specialized meaning</p>
        </TooltipContent>
      </Tooltip>{" "}
      to help users understand better.
    </p>
  ),
};

// ============================================================================
// Help Icon Pattern
// ============================================================================

export const HelpIcon: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">API Key</label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent size="sm" className="max-w-[200px]">
          <p>
            Your API key can be found in your account settings under
            &quot;Developer&quot;.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// ============================================================================
// Standalone Arrow
// ============================================================================

export const StandaloneArrow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button colorStyle="outlined">Custom Arrow</Button>
      </TooltipTrigger>
      <TooltipContent size="md">
        <p>Using standalone TooltipArrow</p>
        <TooltipArrow size="lg" />
      </TooltipContent>
    </Tooltip>
  ),
};
