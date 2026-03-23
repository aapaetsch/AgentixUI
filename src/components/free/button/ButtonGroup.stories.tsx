import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Grid,
  List,
  Bold,
  Italic,
  Underline,
  Plus,
  Settings,
  ArrowRight,
  Copy,
  Clipboard,
  MoreHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heart,
  HeartOff,
  Bookmark,
  BookmarkCheck,
  Star,
} from "lucide-react";
import { Button } from "./index";
import { IconButton } from "./icon-button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./button-group";
import { ConnectedButtonGroup, ConnectedButtonGroupItem } from "./connected-button-group";

/**
 * ButtonGroup - A container for grouping related buttons.
 *
 * ## Features
 * - Two types: Standard (gap-based) and Connected (MD3 Expressive)
 * - Standard: Gap-based grouping with separator support
 * - Connected: MD3 Expressive with 2dp padding and shape morphing
 * - Size-based spacing for MD3 style (XS:18dp, S:12dp, M/L/XL:8dp)
 * - Shape morphing on selection (round→square, square→round)
 */
const meta: Meta<typeof ButtonGroup> = {
  title: "Free/Buttons/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// ButtonGroup Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button colorStyle="outlined">Left</Button>
      <Button colorStyle="outlined">Middle</Button>
      <Button colorStyle="outlined">Right</Button>
    </ButtonGroup>
  ),
};

export const Gaps: Story = {
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

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button colorStyle="outlined">Top</Button>
      <Button colorStyle="outlined">Middle</Button>
      <Button colorStyle="outlined">Bottom</Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  name: "ButtonGroup with Separator",
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <p className="text-sm text-muted-foreground max-w-md">
        Use ButtonGroupSeparator to visually divide buttons that don't have borders (e.g., secondary, ghost variants).
      </p>
      <ButtonGroup>
        <Button colorStyle="tonal">
          <Copy className="size-4" />
          Copy
        </Button>
        <ButtonGroupSeparator />
        <Button colorStyle="tonal">
          <Clipboard className="size-4" />
          Paste
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button colorStyle="ghost">Archive</Button>
        <ButtonGroupSeparator />
        <Button colorStyle="ghost">Delete</Button>
        <ButtonGroupSeparator />
        <IconButton colorStyle="tonal" size="sm" aria-label="More options">
          <MoreHorizontal />
        </IconButton>
      </ButtonGroup>
    </div>
  ),
};

export const WithText: Story = {
  name: "ButtonGroup with Text",
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <p className="text-sm text-muted-foreground max-w-md">
        Use ButtonGroupText to add labels within a button group.
      </p>
      <ButtonGroup>
        <ButtonGroupText>Actions:</ButtonGroupText>
        <Button colorStyle="outlined">Save</Button>
        <Button colorStyle="outlined">Cancel</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>Sort by:</ButtonGroupText>
        <Button colorStyle="tonal" size="sm">Name</Button>
        <Button colorStyle="tonal" size="sm">Date</Button>
        <Button colorStyle="tonal" size="sm">Size</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Nested: Story = {
  name: "ButtonGroup Nested",
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <p className="text-sm text-muted-foreground max-w-md">
        Nest ButtonGroup components to create complex layouts with proper spacing.
      </p>
      <ButtonGroup>
        <ButtonGroup gap="xs">
          <Button colorStyle="outlined" size="sm">1</Button>
          <Button colorStyle="outlined" size="sm">2</Button>
          <Button colorStyle="outlined" size="sm">3</Button>
          <Button colorStyle="outlined" size="sm">4</Button>
          <Button colorStyle="outlined" size="sm">5</Button>
        </ButtonGroup>
        <ButtonGroup gap="xs">
          <IconButton colorStyle="outlined" size="sm" aria-label="Previous">
            <ArrowRight className="rotate-180" />
          </IconButton>
          <IconButton colorStyle="outlined" size="sm" aria-label="Next">
            <ArrowRight />
          </IconButton>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  ),
};

export const StyleVariants: Story = {
  name: "ButtonGroup Style Variants",
  render: () => (
    <div className="flex flex-col items-start gap-8">
      <div>
        <p className="text-sm font-medium mb-2">Default Style</p>
        <p className="text-xs text-muted-foreground mb-3">
          Gap-based grouping with separator support
        </p>
        <ButtonGroup>
          <Button colorStyle="outlined">Archive</Button>
          <Button colorStyle="outlined">Report</Button>
          <Button colorStyle="outlined">Snooze</Button>
        </ButtonGroup>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">MD3 Style with Size-Based Spacing</p>
        <p className="text-xs text-muted-foreground mb-3">
          Material Design 3 Expressive with spacing per size: XS (18dp), S (12dp), M/L/XL (8dp)
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs w-20">XS (18dp):</span>
            <ButtonGroup styleVariant="md3" size="xs">
              <Button colorStyle="filled" size="xs">Primary</Button>
              <Button colorStyle="tonal" size="xs">Secondary</Button>
            </ButtonGroup>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs w-20">SM (12dp):</span>
            <ButtonGroup styleVariant="md3" size="sm">
              <Button colorStyle="filled" size="sm">Primary</Button>
              <Button colorStyle="tonal" size="sm">Secondary</Button>
            </ButtonGroup>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs w-20">MD (8dp):</span>
            <ButtonGroup styleVariant="md3" size="md">
              <Button colorStyle="filled" size="md">Primary</Button>
              <Button colorStyle="tonal" size="md">Secondary</Button>
            </ButtonGroup>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs w-20">LG (8dp):</span>
            <ButtonGroup styleVariant="md3" size="lg">
              <Button colorStyle="filled" size="lg">Primary</Button>
              <Button colorStyle="tonal" size="lg">Secondary</Button>
            </ButtonGroup>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs w-20">XL (8dp):</span>
            <ButtonGroup styleVariant="md3" size="xl">
              <Button colorStyle="filled" size="xl">Primary</Button>
              <Button colorStyle="tonal" size="xl">Secondary</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ============================================================================
// ConnectedButtonGroup Stories
// ============================================================================

export const ConnectedButtonGroupSingleSelect: Story = {
  name: "ConnectedButtonGroup Single Select",
  render: () => {
    const [view, setView] = React.useState("grid");
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm text-muted-foreground max-w-md">
          MD3 single-select segmented button. The check icon appears when items have both icon and label.
        </p>
        <ConnectedButtonGroup value={view} onValueChange={(v) => setView(v as string)}>
          <ConnectedButtonGroupItem value="grid" icon={<Grid />}>
            Grid
          </ConnectedButtonGroupItem>
          <ConnectedButtonGroupItem value="list" icon={<List />}>
            List
          </ConnectedButtonGroupItem>
        </ConnectedButtonGroup>
        <p className="text-xs text-muted-foreground">
          Selected: <strong>{view}</strong>
        </p>
      </div>
    );
  },
};

export const ConnectedButtonGroupMultiSelect: Story = {
  name: "ConnectedButtonGroup Multi Select",
  render: () => {
    const [formats, setFormats] = React.useState<string[]>(["bold"]);
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm text-muted-foreground max-w-md">
          MD3 multi-select for text formatting. Icon-only items don't show check icons.
        </p>
        <ConnectedButtonGroup
          selectionMode="multiple"
          value={formats}
          onValueChange={(v) => setFormats(v as string[])}
        >
          <ConnectedButtonGroupItem value="bold" icon={<Bold />} />
          <ConnectedButtonGroupItem value="italic" icon={<Italic />} />
          <ConnectedButtonGroupItem value="underline" icon={<Underline />} />
        </ConnectedButtonGroup>
        <p className="text-xs text-muted-foreground">
          Selected: <strong>{formats.join(", ") || "none"}</strong>
        </p>
      </div>
    );
  },
};

export const ConnectedButtonGroupColorStyles: Story = {
  name: "ConnectedButtonGroup Color Styles",
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div>
        <p className="text-xs font-medium mb-2">Filled (default)</p>
        <ConnectedButtonGroup colorStyle="filled" defaultValue="a">
          <ConnectedButtonGroupItem value="a">Option A</ConnectedButtonGroupItem>
          <ConnectedButtonGroupItem value="b">Option B</ConnectedButtonGroupItem>
          <ConnectedButtonGroupItem value="c">Option C</ConnectedButtonGroupItem>
        </ConnectedButtonGroup>
      </div>
      <div>
        <p className="text-xs font-medium mb-2">Tonal</p>
        <ConnectedButtonGroup colorStyle="tonal" defaultValue="a">
          <ConnectedButtonGroupItem value="a">Option A</ConnectedButtonGroupItem>
          <ConnectedButtonGroupItem value="b">Option B</ConnectedButtonGroupItem>
          <ConnectedButtonGroupItem value="c">Option C</ConnectedButtonGroupItem>
        </ConnectedButtonGroup>
      </div>
    </div>
  ),
};

export const ConnectedButtonGroupSizes: Story = {
  name: "ConnectedButtonGroup Sizes",
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <p className="text-sm text-muted-foreground max-w-md mb-2">
        MD3 Expressive button group sizes with proper heights (XS: 32dp, S: 36dp, M: 40dp, L: 48dp, XL: 56dp).
      </p>
      <ConnectedButtonGroup size="xs" defaultValue="a">
        <ConnectedButtonGroupItem value="a">XS (32dp)</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup size="sm" defaultValue="a">
        <ConnectedButtonGroupItem value="a">SM (36dp)</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup size="md" defaultValue="a">
        <ConnectedButtonGroupItem value="a">MD (40dp)</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup size="lg" defaultValue="a">
        <ConnectedButtonGroupItem value="a">LG (48dp)</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup size="xl" defaultValue="a">
        <ConnectedButtonGroupItem value="a">XL (56dp)</ConnectedButtonGroupItem>
        <ConnectedButtonGroupItem value="b">Size</ConnectedButtonGroupItem>
      </ConnectedButtonGroup>
    </div>
  ),
};

export const ConnectedButtonGroupShapeMorphing: Story = {
  name: "ConnectedButtonGroup Shape Morphing",
  render: () => {
    const [roundValue, setRoundValue] = React.useState("a");
    const [squareValue, setSquareValue] = React.useState("a");
    
    return (
      <div className="flex flex-col items-start gap-6">
        <p className="text-sm text-muted-foreground max-w-md">
          MD3 Expressive shape morphing: items change shape on selection. 
          Round shape morphs selected items to square, square shape morphs to round.
        </p>
        
        <div>
          <p className="text-xs font-medium mb-2">Round Shape (default) → Square on Select</p>
          <p className="text-xs text-muted-foreground mb-3">
            Container has pill-shaped outer corners. Selected items morph to square inner corners.
          </p>
          <ConnectedButtonGroup 
            defaultShape="round" 
            value={roundValue} 
            onValueChange={(v) => setRoundValue(v as string)}
          >
            <ConnectedButtonGroupItem value="a">Option A</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="b">Option B</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="c">Option C</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
        </div>
        
        <div>
          <p className="text-xs font-medium mb-2">Square Shape → Round on Select</p>
          <p className="text-xs text-muted-foreground mb-3">
            Container has square corners. Selected items morph to round (pill) shape.
          </p>
          <ConnectedButtonGroup 
            defaultShape="square" 
            value={squareValue} 
            onValueChange={(v) => setSquareValue(v as string)}
          >
            <ConnectedButtonGroupItem value="a">Option A</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="b">Option B</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="c">Option C</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
        </div>
      </div>
    );
  },
};

export const ConnectedButtonGroupShapeMorphingSizes: Story = {
  name: "ConnectedButtonGroup Shape Morphing by Size",
  render: () => {
    return (
      <div className="flex flex-col items-start gap-6">
        <p className="text-sm text-muted-foreground max-w-md">
          MD3 Expressive inner corner radii vary by size when using round shape:
          XS: 4dp, S: 8dp, M: 8dp, L: 16dp, XL: 20dp
        </p>
        
        <div className="flex flex-col gap-3">
          <ConnectedButtonGroup size="xs" defaultShape="round" defaultValue="a">
            <ConnectedButtonGroupItem value="a">XS (4dp inner)</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="b">Option</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
          <ConnectedButtonGroup size="sm" defaultShape="round" defaultValue="a">
            <ConnectedButtonGroupItem value="a">SM (8dp inner)</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="b">Option</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
          <ConnectedButtonGroup size="md" defaultShape="round" defaultValue="a">
            <ConnectedButtonGroupItem value="a">MD (8dp inner)</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="b">Option</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
          <ConnectedButtonGroup size="lg" defaultShape="round" defaultValue="a">
            <ConnectedButtonGroupItem value="a">LG (16dp inner)</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="b">Option</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
          <ConnectedButtonGroup size="xl" defaultShape="round" defaultValue="a">
            <ConnectedButtonGroupItem value="a">XL (20dp inner)</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="b">Option</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
        </div>
      </div>
    );
  },
};

export const ConnectedButtonGroupWithCheckIcon: Story = {
  name: "ConnectedButtonGroup Check Icon Behavior",
  render: () => {
    const [drink, setDrink] = React.useState("coffee");
    const [textFormat, setTextFormat] = React.useState<string[]>(["bold"]);
    
    return (
      <div className="flex flex-col items-start gap-8">
        <p className="text-sm text-muted-foreground max-w-md">
          MD3 behavior: Check icon appears only when items have both icon AND text label.
        </p>
        
        <div>
          <p className="text-xs font-medium mb-2">Icon + Label (check icon on select)</p>
          <ConnectedButtonGroup value={drink} onValueChange={(v) => setDrink(v as string)}>
            <ConnectedButtonGroupItem value="coffee" icon={<Star />}>Coffee</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="tea" icon={<Heart />}>Tea</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="water" icon={<Bookmark />}>Water</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
        </div>
        
        <div>
          <p className="text-xs font-medium mb-2">Icon only (no check icon)</p>
          <ConnectedButtonGroup 
            selectionMode="multiple"
            value={textFormat} 
            onValueChange={(v) => setTextFormat(v as string[])}
          >
            <ConnectedButtonGroupItem value="bold" icon={<Bold />} />
            <ConnectedButtonGroupItem value="italic" icon={<Italic />} />
            <ConnectedButtonGroupItem value="underline" icon={<Underline />} />
          </ConnectedButtonGroup>
        </div>
        
        <div>
          <p className="text-xs font-medium mb-2">Text only (no check icon)</p>
          <ConnectedButtonGroup defaultValue="s">
            <ConnectedButtonGroupItem value="s">S</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="m">M</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="l">L</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
        </div>
      </div>
    );
  },
};

export const ConnectedButtonGroupMD3Example: Story = {
  name: "ConnectedButtonGroup MD3 Example",
  render: () => {
    const [size, setSize] = React.useState("m");
    const [price, setPrice] = React.useState<string[]>(["$$"]);
    
    return (
      <div className="flex flex-col items-start gap-8">
        <p className="text-sm text-muted-foreground max-w-md">
          Real-world examples following MD3 guidelines: beverage size selector and price filter.
        </p>
        
        <div>
          <p className="text-xs font-medium mb-2">Beverage Size Selector (single-select)</p>
          <ConnectedButtonGroup value={size} onValueChange={(v) => setSize(v as string)}>
            <ConnectedButtonGroupItem value="s">Small</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="m">Medium</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="l">Large</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
        </div>
        
        <div>
          <p className="text-xs font-medium mb-2">Price Range Filter (multi-select)</p>
          <ConnectedButtonGroup 
            selectionMode="multiple"
            value={price} 
            onValueChange={(v) => setPrice(v as string[])}
          >
            <ConnectedButtonGroupItem value="$">$</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="$$">$$</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="$$$">$$$</ConnectedButtonGroupItem>
            <ConnectedButtonGroupItem value="$$$$">$$$$</ConnectedButtonGroupItem>
          </ConnectedButtonGroup>
        </div>
      </div>
    );
  },
};

export const ConnectedButtonGroupAlignment: Story = {
  name: "ConnectedButtonGroup Text Alignment",
  render: () => {
    const [alignment, setAlignment] = React.useState("left");
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm text-muted-foreground max-w-md">
          Text alignment toolbar using MD3 segmented buttons with icons.
        </p>
        <ConnectedButtonGroup value={alignment} onValueChange={(v) => setAlignment(v as string)}>
          <ConnectedButtonGroupItem value="left" icon={<AlignLeft />} />
          <ConnectedButtonGroupItem value="center" icon={<AlignCenter />} />
          <ConnectedButtonGroupItem value="right" icon={<AlignRight />} />
          <ConnectedButtonGroupItem value="justify" icon={<AlignJustify />} />
        </ConnectedButtonGroup>
        <p className="text-xs text-muted-foreground">
          Alignment: <strong>{alignment}</strong>
        </p>
      </div>
    );
  },
};