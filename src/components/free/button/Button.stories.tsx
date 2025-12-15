import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Plus,
  Upload,
  ArrowRight,
  Heart,
  HeartOff,
  Star,
  Bookmark,
  BookmarkCheck,
  Grid,
  List,
  Bold,
  Italic,
  Underline,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Button } from "./index";
import { IconButton } from "./icon-button";
import { ToggleButton } from "./toggle-button";
import { ToggleIconButton } from "./toggle-icon-button";
import { SplitButton } from "./split-button";
import { ButtonGroup } from "./button-group";
import { ConnectedButtonGroup } from "./connected-button-group";

/**
 * A customizable button component following Material Design 3 patterns.
 *
 * ## Features
 * - 8 color styles: `filled`, `tonal`, `elevated`, `outlined`, `text`, `destructive`, `ghost`, `link`
 * - 5 sizes: `xs`, `sm`, `md`, `lg`, `xl`
 * - 3 shapes: `round` (pill), `rect` (standard), `square` (less rounded)
 * - Icon-only mode with `iconOnly` prop
 * - M3 motion: scale and shape morph on press
 */
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    colorStyle: {
      control: "select",
      options: ["filled", "tonal", "elevated", "outlined", "text", "destructive", "ghost", "link"],
      description: "Visual style following M3 color system",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size variant",
    },
    shape: {
      control: "select",
      options: ["round", "rect", "square"],
      description: "Shape variant",
    },
    iconOnly: {
      control: "boolean",
      description: "Icon-only mode (makes button square)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    asChild: {
      control: "boolean",
      description: "Render as child element (for links)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Button Stories
// ============================================================================

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const AllColorStyles: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button colorStyle="filled">Filled</Button>
      <Button colorStyle="tonal">Tonal</Button>
      <Button colorStyle="elevated">Elevated</Button>
      <Button colorStyle="outlined">Outlined</Button>
      <Button colorStyle="text">Text</Button>
      <Button colorStyle="destructive">Destructive</Button>
      <Button colorStyle="ghost">Ghost</Button>
      <Button colorStyle="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button shape="rect">Rect</Button>
      <Button shape="round">Round (Pill)</Button>
      <Button shape="square">Square</Button>
    </div>
  ),
};

export const IconOnlyButtons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button iconOnly size="xs" colorStyle="outlined" aria-label="Add"><Plus /></Button>
      <Button iconOnly size="sm" colorStyle="outlined" aria-label="Add"><Plus /></Button>
      <Button iconOnly size="md" colorStyle="outlined" aria-label="Add"><Plus /></Button>
      <Button iconOnly size="lg" colorStyle="outlined" aria-label="Add"><Plus /></Button>
      <Button iconOnly size="xl" colorStyle="outlined" aria-label="Add"><Plus /></Button>
    </div>
  ),
};

export const IconOnlyShapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button iconOnly shape="rect" aria-label="Settings"><Settings /></Button>
      <Button iconOnly shape="round" aria-label="Settings"><Settings /></Button>
      <Button iconOnly shape="square" aria-label="Settings"><Settings /></Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">
        <Upload />
        Upload
      </Button>
      <Button>
        Continue
        <ArrowRight />
      </Button>
      <Button colorStyle="tonal" size="lg">
        <Heart />
        Like
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Disabled Filled</Button>
      <Button colorStyle="outlined" disabled>Disabled Outlined</Button>
      <Button colorStyle="tonal" disabled>Disabled Tonal</Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button loading>Saving</Button>
      <Button colorStyle="tonal" loading>Loading</Button>
      <Button colorStyle="outlined" loading>Please wait</Button>
    </div>
  ),
};

export const LoadingWithText: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button loading loadingText="Saving...">Save</Button>
      <Button colorStyle="tonal" loading loadingText="Processing...">Submit</Button>
    </div>
  ),
};

export const LoadingSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs" loading>XS</Button>
      <Button size="sm" loading>Small</Button>
      <Button size="md" loading>Medium</Button>
      <Button size="lg" loading>Large</Button>
      <Button size="xl" loading>XL</Button>
    </div>
  ),
};

export const LoadingIconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button iconOnly size="sm" loading aria-label="Loading"><Plus /></Button>
      <Button iconOnly size="md" loading aria-label="Loading"><Plus /></Button>
      <Button iconOnly size="lg" loading aria-label="Loading"><Plus /></Button>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Button asChild>
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        Link Button
      </a>
    </Button>
  ),
};

// ============================================================================
// IconButton Stories
// ============================================================================

export const IconButtonDefault: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton aria-label="Add"><Plus /></IconButton>
      <IconButton colorStyle="filled" aria-label="Add"><Plus /></IconButton>
      <IconButton colorStyle="tonal" aria-label="Add"><Plus /></IconButton>
      <IconButton colorStyle="outlined" aria-label="Add"><Plus /></IconButton>
    </div>
  ),
};

export const IconButtonSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton size="xs" aria-label="Add"><Plus /></IconButton>
      <IconButton size="sm" aria-label="Add"><Plus /></IconButton>
      <IconButton size="md" aria-label="Add"><Plus /></IconButton>
      <IconButton size="lg" aria-label="Add"><Plus /></IconButton>
      <IconButton size="xl" aria-label="Add"><Plus /></IconButton>
    </div>
  ),
};

export const IconButtonWidths: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton width="narrow" colorStyle="outlined" aria-label="Narrow"><Plus /></IconButton>
      <IconButton width="default" colorStyle="outlined" aria-label="Default"><Plus /></IconButton>
      <IconButton width="wide" colorStyle="outlined" aria-label="Wide"><Plus /></IconButton>
    </div>
  ),
};

export const IconButtonShapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton shape="round" colorStyle="filled" aria-label="Round"><Plus /></IconButton>
      <IconButton shape="rect" colorStyle="filled" aria-label="Rect"><Plus /></IconButton>
      <IconButton shape="square" colorStyle="filled" aria-label="Square"><Plus /></IconButton>
    </div>
  ),
};

export const IconButtonLoading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton loading aria-label="Loading"><Plus /></IconButton>
      <IconButton colorStyle="filled" loading aria-label="Loading"><Plus /></IconButton>
      <IconButton colorStyle="tonal" loading aria-label="Loading"><Plus /></IconButton>
      <IconButton colorStyle="outlined" loading aria-label="Loading"><Plus /></IconButton>
    </div>
  ),
};

export const IconButtonLoadingSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton size="xs" loading aria-label="Loading"><Plus /></IconButton>
      <IconButton size="sm" loading aria-label="Loading"><Plus /></IconButton>
      <IconButton size="md" loading aria-label="Loading"><Plus /></IconButton>
      <IconButton size="lg" loading aria-label="Loading"><Plus /></IconButton>
      <IconButton size="xl" loading aria-label="Loading"><Plus /></IconButton>
    </div>
  ),
};

// ============================================================================
// ToggleButton Stories
// ============================================================================

export const ToggleButtonDefault: Story = {
  render: () => {
    const [pressed, setPressed] = React.useState(false);
    return (
      <ToggleButton pressed={pressed} onPressedChange={setPressed}>
        {pressed ? "On" : "Off"}
      </ToggleButton>
    );
  },
};

export const ToggleButtonColorStyles: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ToggleButton colorStyle="filled">Filled</ToggleButton>
      <ToggleButton colorStyle="tonal">Tonal</ToggleButton>
      <ToggleButton colorStyle="outlined">Outlined</ToggleButton>
    </div>
  ),
};

export const ToggleButtonShapeMorph: Story = {
  render: () => {
    const [pressed1, setPressed1] = React.useState(false);
    const [pressed2, setPressed2] = React.useState(false);
    return (
      <div className="flex flex-wrap items-center gap-4">
        <ToggleButton shape="round" pressed={pressed1} onPressedChange={setPressed1}>
          Round → Rect
        </ToggleButton>
        <ToggleButton shape="rect" pressed={pressed2} onPressedChange={setPressed2}>
          Rect → Round
        </ToggleButton>
      </div>
    );
  },
};

// ============================================================================
// ToggleIconButton Stories
// ============================================================================

export const ToggleIconButtonDefault: Story = {
  render: () => {
    const [liked, setLiked] = React.useState(false);
    return (
      <ToggleIconButton
        icon={<HeartOff />}
        pressedIcon={<Heart />}
        pressed={liked}
        onPressedChange={setLiked}
        aria-label="Like"
      />
    );
  },
};

export const ToggleIconButtonVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ToggleIconButton
        colorStyle="standard"
        icon={<Star />}
        aria-label="Star"
      />
      <ToggleIconButton
        colorStyle="filled"
        icon={<Star />}
        aria-label="Star"
      />
      <ToggleIconButton
        colorStyle="tonal"
        icon={<Bookmark />}
        pressedIcon={<BookmarkCheck />}
        aria-label="Bookmark"
      />
      <ToggleIconButton
        colorStyle="outlined"
        icon={<Heart />}
        aria-label="Like"
      />
    </div>
  ),
};

// ============================================================================
// SplitButton Stories
// ============================================================================

export const SplitButtonDefault: Story = {
  render: () => (
    <SplitButton
      onAction={() => console.log("Primary action")}
      onDropdownClick={() => console.log("Dropdown clicked")}
    >
      Save
    </SplitButton>
  ),
};

export const SplitButtonColorStyles: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <SplitButton colorStyle="elevated">Elevated</SplitButton>
      <SplitButton colorStyle="filled">Filled</SplitButton>
      <SplitButton colorStyle="tonal">Tonal</SplitButton>
      <SplitButton colorStyle="outlined">Outlined</SplitButton>
    </div>
  ),
};

export const SplitButtonSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SplitButton size="xs">XS</SplitButton>
      <SplitButton size="sm">Small</SplitButton>
      <SplitButton size="md">Medium</SplitButton>
      <SplitButton size="lg">Large</SplitButton>
      <SplitButton size="xl">XL</SplitButton>
    </div>
  ),
};

export const SplitButtonInteractive: Story = {
  name: "SplitButton Interactive (M3 States)",
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm text-muted-foreground">
          Click the trailing button to see M3 state changes:
          chevron rotation + shape morph (trailing becomes inner-rounded)
        </p>
        <div className="flex items-center gap-6">
          <SplitButton
            colorStyle="filled"
            dropdownOpen={open}
            onDropdownClick={() => setOpen(!open)}
            onAction={() => console.log("Action")}
          >
            Edit
          </SplitButton>
          <SplitButton
            colorStyle="tonal"
            dropdownOpen={open}
            onDropdownClick={() => setOpen(!open)}
            onAction={() => console.log("Action")}
          >
            Edit
          </SplitButton>
          <SplitButton
            colorStyle="outlined"
            dropdownOpen={open}
            onDropdownClick={() => setOpen(!open)}
            onAction={() => console.log("Action")}
          >
            Edit
          </SplitButton>
        </div>
        <p className="text-xs text-muted-foreground">
          Menu state: <strong>{open ? "Open" : "Closed"}</strong>
        </p>
      </div>
    );
  },
};

export const SplitButtonM3Anatomy: Story = {
  name: "SplitButton M3 Anatomy",
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <p className="text-sm text-muted-foreground max-w-md text-center">
        M3 Split Button: 2dp gap between leading &amp; trailing buttons.
        Outer corners are pill-shaped, inner corners are small rectangles
        that expand on hover/focus/press.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground w-20">Closed:</span>
          <SplitButton colorStyle="filled" dropdownOpen={false}>Edit</SplitButton>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground w-20">Open:</span>
          <SplitButton colorStyle="filled" dropdownOpen={true}>Edit</SplitButton>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Note: Trailing button is a full circle when closed, inner-rounded when open
      </p>
    </div>
  ),
};

export const SplitButtonWithAnimatedChevron: Story = {
  name: "SplitButton with AnimatedChevron",
  render: () => {
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);

    return (
      <div className="flex flex-col items-center gap-8">
        <p className="text-sm text-muted-foreground max-w-md text-center">
          SplitButton can use the AnimatedChevron component for a morphing
          animation instead of simple rotation.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground w-24">Smooth:</span>
            <SplitButton
              colorStyle="filled"
              useAnimatedChevron
              animationPreset="smooth"
              dropdownOpen={open1}
              onDropdownClick={() => setOpen1(!open1)}
              onAction={() => console.log("Action")}
            >
              Save
            </SplitButton>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground w-24">Bounce:</span>
            <SplitButton
              colorStyle="tonal"
              useAnimatedChevron
              animationPreset="bounce"
              dropdownOpen={open2}
              onDropdownClick={() => setOpen2(!open2)}
              onAction={() => console.log("Action")}
            >
              Export
            </SplitButton>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground w-24">Sharp:</span>
            <SplitButton
              colorStyle="outlined"
              useAnimatedChevron
              animationPreset="sharp"
              dropdownOpen={open3}
              onDropdownClick={() => setOpen3(!open3)}
              onAction={() => console.log("Action")}
            >
              Share
            </SplitButton>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          The chevron morphs its shape instead of rotating
        </p>
      </div>
    );
  },
};

// ============================================================================
// ButtonGroup Stories
// ============================================================================

export const ButtonGroupDefault: Story = {
  render: () => (
    <ButtonGroup>
      <Button colorStyle="outlined">Left</Button>
      <Button colorStyle="outlined">Middle</Button>
      <Button colorStyle="outlined">Right</Button>
    </ButtonGroup>
  ),
};

export const ButtonGroupGaps: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup gap="none">
        <Button colorStyle="outlined">None</Button>
        <Button colorStyle="outlined">Gap</Button>
      </ButtonGroup>
      <ButtonGroup gap="xs">
        <Button colorStyle="outlined">XS</Button>
        <Button colorStyle="outlined">Gap</Button>
      </ButtonGroup>
      <ButtonGroup gap="sm">
        <Button colorStyle="outlined">SM</Button>
        <Button colorStyle="outlined">Gap</Button>
      </ButtonGroup>
      <ButtonGroup gap="md">
        <Button colorStyle="outlined">MD</Button>
        <Button colorStyle="outlined">Gap</Button>
      </ButtonGroup>
      <ButtonGroup gap="lg">
        <Button colorStyle="outlined">LG</Button>
        <Button colorStyle="outlined">Gap</Button>
      </ButtonGroup>
    </div>
  ),
};

export const ButtonGroupVertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button colorStyle="outlined">Top</Button>
      <Button colorStyle="outlined">Middle</Button>
      <Button colorStyle="outlined">Bottom</Button>
    </ButtonGroup>
  ),
};

// ============================================================================
// ConnectedButtonGroup Stories
// ============================================================================

export const ConnectedButtonGroupSingleSelect: Story = {
  render: () => {
    const [view, setView] = React.useState("grid");
    return (
      <ConnectedButtonGroup value={view} onValueChange={(v) => setView(v as string)}>
        <ConnectedButtonGroupItem value="grid">
          <Grid />
          Grid
        </ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="list">
          <List />
          List
        </ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
    );
  },
};

export const ConnectedButtonGroupMultiSelect: Story = {
  render: () => {
    const [formats, setFormats] = React.useState<string[]>(["bold"]);
    return (
      <ConnectedButtonGroup
        selectionMode="multiple"
        value={formats}
        onValueChange={(v) => setFormats(v as string[])}
      >
        <ConnectedButtonGroupItem value="bold">
          <Bold />
        </ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="italic">
          <Italic />
        </ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="underline">
          <Underline />
        </ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
    );
  },
};

export const ConnectedButtonGroupColorStyles: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ConnectedButtonGroup colorStyle="outlined" defaultValue="a">
        <ConnectedButtonGroupItem value="a">A</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">B</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="c">C</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup colorStyle="filled" defaultValue="a">
        <ConnectedButtonGroupItem value="a">A</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">B</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="c">C</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup colorStyle="tonal" defaultValue="a">
        <ConnectedButtonGroupItem value="a">A</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">B</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="c">C</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
    </div>
  ),
};

export const ConnectedButtonGroupSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ConnectedButtonGroup size="xs" defaultValue="a">
        <ConnectedButtonGroupItem value="a">XS</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup size="sm" defaultValue="a">
        <ConnectedButtonGroupItem value="a">SM</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup size="md" defaultValue="a">
        <ConnectedButtonGroupItem value="a">MD</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup size="lg" defaultValue="a">
        <ConnectedButtonGroupItem value="a">LG</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup size="xl" defaultValue="a">
        <ConnectedButtonGroupItem value="a">XL</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
    </div>
  ),
};

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveDemo: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <p className="text-sm text-muted-foreground">
        Click/tap buttons to see M3 scale and shape morphing animations
      </p>
      <div className="flex items-center gap-4">
        <Button size="lg" shape="round">Round Pill</Button>
        <Button size="lg" shape="rect">Rectangle</Button>
        <Button size="lg" shape="square">Square</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button colorStyle="elevated" size="lg">Elevated</Button>
        <Button colorStyle="tonal" size="lg">Tonal</Button>
        <Button colorStyle="destructive" size="lg">Destructive</Button>
      </div>
    </div>
  ),
};
