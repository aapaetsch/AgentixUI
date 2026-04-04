import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Edit, Heart, Share2, Download, Folder, File, Settings, X } from "lucide-react";
import { FAB } from "./index";
import { ExtendedFAB } from "./extended-fab";
import { FABMenu, type FABMenuItem } from "./fab-menu";

/**
 * A prominent button for the primary action on a screen.
 * Follows Material Design 3 specifications with shape morphing animations.
 *
 * ## Features
 * - 3 sizes: `sm` (40px), `md` (56px), `lg` (96px)
 * - 3 shapes: `round`, `pill`, `rect`
 * - 5 color styles: `filled`, `tonal`, `elevated`, `outlined`, `tertiary`
 * - Optional fixed positioning: `bottom-right`, `bottom-left`, `top-right`, `top-left`
 * - M3 motion: shape morph on press
 */
const meta: Meta<typeof FAB> = {
  title: "Buttons/FAB",
  component: FAB,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    colorStyle: {
      control: "select",
      options: ["filled", "tonal", "elevated", "outlined", "tertiary"],
      description: "Visual style following M3 color system",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    shape: {
      control: "select",
      options: ["round", "pill", "rect"],
      description: "Shape variant",
    },
    position: {
      control: "select",
      options: ["none", "bottom-right", "bottom-left", "top-right", "top-left"],
      description: "Fixed positioning",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FAB>;

// ============================================================================
// FAB Stories
// ============================================================================

export const Default: Story = {
  args: {
    icon: <Plus />,
    label: "Add item",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <FAB icon={<Plus />} size="sm" label="Small FAB" />
      <FAB icon={<Plus />} size="md" label="Medium FAB" />
      <FAB icon={<Plus />} size="lg" label="Large FAB" />
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <FAB icon={<Plus />} shape="round" label="Round FAB" />
      <FAB icon={<Plus />} shape="pill" label="Pill FAB" />
      <FAB icon={<Plus />} shape="rect" label="Rect FAB" />
    </div>
  ),
};

export const AllColorStyles: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <FAB icon={<Plus />} colorStyle="filled" label="Filled" />
      <FAB icon={<Plus />} colorStyle="tonal" label="Tonal" />
      <FAB icon={<Plus />} colorStyle="elevated" label="Elevated" />
      <FAB icon={<Plus />} colorStyle="outlined" label="Outlined" />
      <FAB icon={<Plus />} colorStyle="tertiary" label="Tertiary" />
    </div>
  ),
};

export const RectShapeSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <FAB icon={<Edit />} shape="rect" size="sm" label="Small rect" />
      <FAB icon={<Edit />} shape="rect" size="md" label="Medium rect" />
      <FAB icon={<Edit />} shape="rect" size="lg" label="Large rect" />
    </div>
  ),
};

export const WithDifferentIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <FAB icon={<Plus />} label="Add" />
      <FAB icon={<Edit />} colorStyle="tonal" label="Edit" />
      <FAB icon={<Heart />} colorStyle="tertiary" label="Like" />
      <FAB icon={<Share2 />} colorStyle="elevated" label="Share" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    icon: <Plus />,
    label: "Disabled FAB",
    disabled: true,
  },
};

// ============================================================================
// Extended FAB Stories
// ============================================================================

export const ExtendedFABDefault: Story = {
  render: () => <ExtendedFAB icon={<Plus />} label="Create new" />,
};

export const ExtendedFABSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ExtendedFAB icon={<Plus />} label="Small" size="sm" />
      <ExtendedFAB icon={<Plus />} label="Medium" size="md" />
      <ExtendedFAB icon={<Plus />} label="Large" size="lg" />
    </div>
  ),
};

export const ExtendedFABShapes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ExtendedFAB icon={<Plus />} label="Round shape" shape="round" />
      <ExtendedFAB icon={<Plus />} label="Pill shape" shape="pill" />
      <ExtendedFAB icon={<Plus />} label="Rect shape" shape="rect" />
    </div>
  ),
};

export const ExtendedFABColorStyles: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ExtendedFAB icon={<Plus />} label="Filled" colorStyle="filled" />
      <ExtendedFAB icon={<Plus />} label="Tonal" colorStyle="tonal" />
      <ExtendedFAB icon={<Plus />} label="Elevated" colorStyle="elevated" />
      <ExtendedFAB icon={<Plus />} label="Outlined" colorStyle="outlined" />
      <ExtendedFAB icon={<Plus />} label="Tertiary" colorStyle="tertiary" />
    </div>
  ),
};

export const ExtendedFABCollapseOnMobile: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <p className="text-sm text-muted-foreground">
        Resize the viewport to see the label collapse on mobile
      </p>
      <ExtendedFAB
        icon={<Plus />}
        label="Create new document"
        collapseOnMobile
      />
    </div>
  ),
};

// ============================================================================
// FAB Menu Stories
// ============================================================================

const menuItems: FABMenuItem[] = [
  { id: "1", icon: <File />, label: "New file", onClick: () => console.log("New file") },
  { id: "2", icon: <Folder />, label: "New folder", onClick: () => console.log("New folder") },
  { id: "3", icon: <Download />, label: "Download", onClick: () => console.log("Download") },
];

export const FABMenuDefault: Story = {
  render: () => (
    <div className="h-64 flex items-end justify-center">
      <FABMenu
        icon={<Plus />}
        label="Actions"
        items={menuItems}
        direction="up"
      />
    </div>
  ),
};

export const FABMenuDirections: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16 p-16">
      <div className="flex items-start justify-center">
        <FABMenu icon={<Plus />} label="Up" items={menuItems} direction="down" />
      </div>
      <div className="flex items-end justify-center">
        <FABMenu icon={<Plus />} label="Down" items={menuItems} direction="up" />
      </div>
      <div className="flex items-center justify-start">
        <FABMenu icon={<Plus />} label="Right" items={menuItems} direction="right" />
      </div>
      <div className="flex items-center justify-end">
        <FABMenu icon={<Plus />} label="Left" items={menuItems} direction="left" />
      </div>
    </div>
  ),
};

export const FABMenuColorStyles: Story = {
  render: () => (
    <div className="h-64 flex items-end gap-8">
      <FABMenu
        icon={<Plus />}
        label="Filled"
        colorStyle="filled"
        items={menuItems}
        direction="up"
      />
      <FABMenu
        icon={<Plus />}
        label="Tonal"
        colorStyle="tonal"
        items={menuItems}
        direction="up"
      />
      <FABMenu
        icon={<Plus />}
        label="Tertiary"
        colorStyle="tertiary"
        items={menuItems}
        direction="up"
      />
    </div>
  ),
};

export const FABMenuWithCustomOpenIcon: Story = {
  render: () => (
    <div className="h-64 flex items-end justify-center">
      <FABMenu
        icon={<Plus />}
        openIcon={<X />}
        label="Actions with custom close icon"
        items={menuItems}
        direction="up"
      />
    </div>
  ),
};

// ============================================================================
// Positioning Demo
// ============================================================================

export const PositionedFABs: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="relative h-96 w-full bg-muted/30 border rounded-lg overflow-hidden">
      <p className="p-4 text-sm text-muted-foreground">
        FABs with fixed positioning (contained within this box for demo purposes)
      </p>
      <div className="absolute inset-0">
        <div className="absolute bottom-4 right-4">
          <FAB icon={<Plus />} colorStyle="filled" label="Bottom right" />
        </div>
        <div className="absolute bottom-4 left-4">
          <FAB icon={<Edit />} colorStyle="tonal" label="Bottom left" />
        </div>
        <div className="absolute top-4 right-4">
          <FAB icon={<Settings />} colorStyle="elevated" size="sm" label="Top right" />
        </div>
        <div className="absolute top-4 left-4">
          <FAB icon={<Heart />} colorStyle="tertiary" size="sm" label="Top left" />
        </div>
      </div>
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
        Click/tap the FABs to see M3 shape morphing animations
      </p>
      <div className="flex items-center gap-4">
        <FAB
          icon={<Plus />}
          size="lg"
          shape="round"
          colorStyle="filled"
          label="Round to square on press"
        />
        <FAB
          icon={<Edit />}
          size="lg"
          shape="rect"
          colorStyle="tertiary"
          label="Rect FAB"
        />
      </div>
      <ExtendedFAB
        icon={<Plus />}
        label="Extended FAB with animation"
        size="lg"
      />
    </div>
  ),
};
