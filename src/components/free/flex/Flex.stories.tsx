import type { Meta, StoryObj } from "@storybook/react";
import { Flex, FlexItem, FlexRow, FlexCol } from "./index";

/**
 * Flexible container and item components for building layouts with flexbox.
 *
 * ## Components
 * - `Flex` - Base flex container with full direction control
 * - `FlexRow` - Convenience component for horizontal layouts
 * - `FlexCol` - Convenience component for vertical layouts
 * - `FlexItem` - Flex item with grow, shrink, basis, and order control
 *
 * ## Features
 * - Comprehensive flex container properties as props
 * - Full control over flex item properties
 * - Consistent with Tailwind's spacing system
 * - Accessible by default
 *
 * ## Usage
 *
 * ```tsx
 * // Using FlexRow for horizontal layout
 * <FlexRow gap={4}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </FlexRow>
 *
 * // Using FlexCol for vertical layout
 * <FlexCol gap={4}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </FlexCol>
 *
 * // Using base Flex with direction control
 * <Flex direction="row" gap={4}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * ```
 */
const meta = {
  title: "Free/Layout/Flex",
  component: Flex,
  subcomponents: { FlexItem, FlexRow, FlexCol },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Flex Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <Flex className="w-64 h-32 p-4 border rounded">
      <div className="w-16 h-16 bg-primary rounded" />
      <div className="w-16 h-16 bg-secondary rounded" />
      <div className="w-16 h-16 bg-muted rounded" />
    </Flex>
  ),
};

export const JustifyContent: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control how flex items are aligned along the main axis.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-medium mb-2">Justify Start (Default)</p>
        <Flex justify="start" gap={2} className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Justify Center</p>
        <Flex justify="center" gap={2} className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Justify Between</p>
        <Flex justify="between" className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Justify Around</p>
        <Flex justify="around" gap={2} className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
        </Flex>
      </div>
    </div>
  ),
};

export const AlignItems: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control how flex items are aligned along the cross axis.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-medium mb-2">Align Start</p>
        <Flex align="start" gap={2} className="w-full h-24 p-2 border rounded">
          <div className="w-12 h-8 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
          <div className="w-12 h-16 bg-muted rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Align Center</p>
        <Flex align="center" gap={2} className="w-full h-24 p-2 border rounded">
          <div className="w-12 h-8 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
          <div className="w-12 h-16 bg-muted rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Align End</p>
        <Flex align="end" gap={2} className="w-full h-24 p-2 border rounded">
          <div className="w-12 h-8 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
          <div className="w-12 h-16 bg-muted rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Align Stretch</p>
        <Flex align="stretch" gap={2} className="w-full h-24 p-2 border rounded">
          <div className="w-12 bg-primary rounded" />
          <div className="w-12 bg-secondary rounded" />
          <div className="w-12 bg-muted rounded" />
        </Flex>
      </div>
    </div>
  ),
};

export const Direction: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control the direction of flex items.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-medium mb-2">Row (Default)</p>
        <Flex direction="row" gap={2} className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
          <div className="w-12 h-12 bg-muted rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Column</p>
        <Flex direction="col" gap={2} className="w-full h-32 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
          <div className="w-12 h-12 bg-muted rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Row Reverse</p>
        <Flex direction="row-reverse" gap={2} className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
          <div className="w-12 h-12 bg-muted rounded" />
        </Flex>
      </div>
    </div>
  ),
};

export const Wrap: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control how flex items wrap within the container.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-medium mb-2">No Wrap (Default)</p>
        <Flex wrap="nowrap" gap={2} className="w-48 h-16 p-2 border rounded overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-primary rounded shrink-0" />
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Wrap</p>
        <Flex wrap="wrap" gap={2} className="w-48 p-2 border rounded">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-primary rounded" />
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Wrap Reverse</p>
        <Flex wrap="wrap-reverse" gap={2} className="w-48 p-2 border rounded">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">{i + 1}</div>
          ))}
        </Flex>
      </div>
    </div>
  ),
};

export const WrapWithAlignContent: Story = {
  name: "Wrap: Align Content",
  parameters: {
    docs: {
      description: {
        story: "Use `alignContent` to control how wrapped lines are distributed along the cross axis.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <div>
        <p className="text-sm font-medium mb-2">alignContent: start</p>
        <Flex wrap="wrap" gap={2} alignContent="start" className="w-48 h-40 p-2 border rounded">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-primary rounded" />
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">alignContent: center</p>
        <Flex wrap="wrap" gap={2} alignContent="center" className="w-48 h-40 p-2 border rounded">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-secondary rounded" />
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">alignContent: end</p>
        <Flex wrap="wrap" gap={2} alignContent="end" className="w-48 h-40 p-2 border rounded">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-muted rounded" />
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">alignContent: between</p>
        <Flex wrap="wrap" gap={2} alignContent="between" className="w-48 h-40 p-2 border rounded">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-primary/70 rounded" />
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">alignContent: around</p>
        <Flex wrap="wrap" gap={2} alignContent="around" className="w-48 h-40 p-2 border rounded">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-secondary/70 rounded" />
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">alignContent: stretch</p>
        <Flex wrap="wrap" gap={2} alignContent="stretch" className="w-48 h-40 p-2 border rounded">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-12 bg-muted/70 rounded" />
          ))}
        </Flex>
      </div>
    </div>
  ),
};

export const WrapWithGapXY: Story = {
  name: "Wrap: Gap X/Y",
  parameters: {
    docs: {
      description: {
        story: "Use `gapX` and `gapY` for different horizontal and vertical spacing in wrapped layouts.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div>
        <p className="text-sm font-medium mb-2">Uniform Gap (gap={4})</p>
        <Flex wrap="wrap" gap={4} className="w-64 p-2 border rounded">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-16 h-16 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm">{i + 1}</div>
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Different X/Y Gap (gapX={8}, gapY={2})</p>
        <Flex wrap="wrap" gapX={8} gapY={2} className="w-64 p-2 border rounded">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-16 h-16 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-sm">{i + 1}</div>
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Tight Horizontal, Loose Vertical (gapX={1}, gapY={6})</p>
        <Flex wrap="wrap" gapX={1} gapY={6} className="w-64 p-2 border rounded">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">{i + 1}</div>
          ))}
        </Flex>
      </div>
    </div>
  ),
};

export const WrapTagCloud: Story = {
  name: "Wrap: Tag Cloud Example",
  parameters: {
    docs: {
      description: {
        story: "A practical example using flex wrap to create a tag cloud or pill list.",
      },
    },
  },
  render: () => {
    const tags = [
      "React", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL",
      "Next.js", "Prisma", "PostgreSQL", "Docker", "AWS", "Vercel",
      "Git", "VS Code", "Storybook", "Testing Library"
    ];
    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <p className="text-sm font-medium">Tag Cloud</p>
        <Flex wrap="wrap" gap={2} className="p-4 border rounded">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </Flex>
      </div>
    );
  },
};

export const WrapImageGallery: Story = {
  name: "Wrap: Image Gallery Example",
  parameters: {
    docs: {
      description: {
        story: "A practical example using flex wrap with gapX/gapY for an image gallery layout.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <p className="text-sm font-medium">Image Gallery</p>
      <Flex wrap="wrap" gapX={3} gapY={3} className="p-2 border rounded">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center"
          >
            <span className="text-muted-foreground text-sm">Image {i + 1}</span>
          </div>
        ))}
      </Flex>
    </div>
  ),
};

export const Gap: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control the spacing between flex items using the gap scale.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-medium mb-2">Gap 0</p>
        <Flex gap={0} className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Gap 4</p>
        <Flex gap={4} className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
        </Flex>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Gap 8</p>
        <Flex gap={8} className="w-full h-16 p-2 border rounded">
          <div className="w-12 h-12 bg-primary rounded" />
          <div className="w-12 h-12 bg-secondary rounded" />
        </Flex>
      </div>
    </div>
  ),
};

export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story: "Render as inline-flex instead of flex.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <p>
        This is a paragraph with an <Flex inline align="center" gap={1} className="bg-muted px-2 py-1 rounded"><span>inline</span><span>flex</span></Flex> element in the middle.
      </p>
    </div>
  ),
};

// ============================================================================
// FlexItem Stories
// ============================================================================

export const FlexItemGrow: Story = {
  name: "FlexItem: Grow",
  parameters: {
    docs: {
      description: {
        story: "Control how flex items grow relative to others.",
      },
    },
  },
  render: () => (
    <Flex gap={2} className="w-full h-16 p-2 border rounded">
      <FlexItem grow={0} className="w-12 h-12 bg-primary rounded" />
      <FlexItem grow={1} className="h-12 bg-secondary rounded" />
      <FlexItem grow={0} className="w-12 h-12 bg-muted rounded" />
    </Flex>
  ),
};

export const FlexItemBasis: Story = {
  name: "FlexItem: Basis",
  parameters: {
    docs: {
      description: {
        story: "Control the initial size of flex items.",
      },
    },
  },
  render: () => (
    <Flex gap={2} className="w-full h-16 p-2 border rounded">
      <FlexItem basis="1/4" className="h-12 bg-primary rounded" />
      <FlexItem basis="1/2" className="h-12 bg-secondary rounded" />
      <FlexItem basis="auto" className="h-12 bg-muted rounded px-2">
        <span>Auto</span>
      </FlexItem>
    </Flex>
  ),
};

export const FlexItemAlignSelf: Story = {
  name: "FlexItem: Align Self",
  parameters: {
    docs: {
      description: {
        story: "Control the alignment of individual flex items.",
      },
    },
  },
  render: () => (
    <Flex align="center" gap={2} className="w-full h-24 p-2 border rounded">
      <FlexItem alignSelf="start" className="w-12 h-8 bg-primary rounded" />
      <FlexItem className="w-12 h-12 bg-secondary rounded" />
      <FlexItem alignSelf="end" className="w-12 h-16 bg-muted rounded" />
      <FlexItem alignSelf="stretch" className="w-12 bg-primary/20 rounded" />
    </Flex>
  ),
};

export const FlexItemOrder: Story = {
  name: "FlexItem: Order",
  parameters: {
    docs: {
      description: {
        story: "Control the order of flex items.",
      },
    },
  },
  render: () => (
    <Flex gap={2} className="w-full h-16 p-2 border rounded">
      <FlexItem order={3} className="w-12 h-12 bg-primary rounded">
        <span className="text-xs">3rd</span>
      </FlexItem>
      <FlexItem order={1} className="w-12 h-12 bg-secondary rounded">
        <span className="text-xs">1st</span>
      </FlexItem>
      <FlexItem order={2} className="w-12 h-12 bg-muted rounded">
        <span className="text-xs">2nd</span>
      </FlexItem>
    </Flex>
  ),
};

export const ComplexLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: "A complex layout demonstrating multiple flex properties together.",
      },
    },
  },
  render: () => (
    <Flex direction="col" gap={4} className="w-full max-w-md p-4 border rounded">
      <Flex justify="between" align="center">
        <div className="font-semibold">Header</div>
        <Flex gap={2}>
          <button className="px-3 py-1 bg-muted rounded text-sm">Menu</button>
          <button className="px-3 py-1 bg-muted rounded text-sm">Settings</button>
        </Flex>
      </Flex>
      
      <Flex gap={4} className="h-48">
        <FlexItem basis="1/3" className="bg-muted rounded p-4">
          <h3 className="font-medium mb-2">Sidebar</h3>
          <ul className="text-sm space-y-1">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </FlexItem>
        
        <FlexItem grow={1} className="bg-muted/50 rounded p-4">
          <h3 className="font-medium mb-2">Main Content</h3>
          <p className="text-sm">
            This is the main content area that grows to fill available space.
          </p>
        </FlexItem>
      </Flex>
      
      <Flex justify="center" gap={4} className="py-2 border-t">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm">
          Action 1
        </button>
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded text-sm">
          Action 2
        </button>
      </Flex>
    </Flex>
  ),
};

// ============================================================================
// FlexRow Stories
// ============================================================================

export const FlexRowDefault: Story = {
  name: "FlexRow: Default",
  parameters: {
    docs: {
      description: {
        story: "FlexRow provides a convenient way to create horizontal flex layouts.",
      },
    },
  },
  render: () => (
    <FlexRow gap={4} className="w-full p-4 border rounded">
      <div className="w-16 h-16 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm">1</div>
      <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-sm">2</div>
      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">3</div>
    </FlexRow>
  ),
};

export const FlexRowReversed: Story = {
  name: "FlexRow: Reversed",
  parameters: {
    docs: {
      description: {
        story: "Use the `reverse` prop to reverse the row direction.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <p className="text-sm font-medium mb-2">Normal Row</p>
        <FlexRow gap={4} className="w-full p-4 border rounded">
          <div className="w-12 h-12 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">1</div>
          <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-xs">2</div>
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">3</div>
        </FlexRow>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Reversed Row</p>
        <FlexRow reverse gap={4} className="w-full p-4 border rounded">
          <div className="w-12 h-12 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">1</div>
          <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-xs">2</div>
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">3</div>
        </FlexRow>
      </div>
    </div>
  ),
};

export const FlexRowWithAlignment: Story = {
  name: "FlexRow: With Alignment",
  parameters: {
    docs: {
      description: {
        story: "FlexRow supports all alignment props from the base Flex component.",
      },
    },
  },
  render: () => (
    <FlexRow justify="between" align="center" gap={4} className="w-full max-w-md p-4 border rounded">
      <div className="font-semibold">Logo</div>
      <FlexRow gap={2}>
        <button className="px-3 py-1 bg-muted rounded text-sm">Home</button>
        <button className="px-3 py-1 bg-muted rounded text-sm">About</button>
        <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Contact</button>
      </FlexRow>
    </FlexRow>
  ),
};

// ============================================================================
// FlexCol Stories
// ============================================================================

export const FlexColDefault: Story = {
  name: "FlexCol: Default",
  parameters: {
    docs: {
      description: {
        story: "FlexCol provides a convenient way to create vertical flex layouts.",
      },
    },
  },
  render: () => (
    <FlexCol gap={4} className="w-48 p-4 border rounded">
      <div className="w-full h-12 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm">1</div>
      <div className="w-full h-12 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-sm">2</div>
      <div className="w-full h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">3</div>
    </FlexCol>
  ),
};

export const FlexColReversed: Story = {
  name: "FlexCol: Reversed",
  parameters: {
    docs: {
      description: {
        story: "Use the `reverse` prop to reverse the column direction.",
      },
    },
  },
  render: () => (
    <div className="flex flex-row gap-8 w-full max-w-md">
      <div>
        <p className="text-sm font-medium mb-2">Normal Column</p>
        <FlexCol gap={2} className="w-32 p-4 border rounded">
          <div className="w-full h-10 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">1</div>
          <div className="w-full h-10 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-xs">2</div>
          <div className="w-full h-10 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">3</div>
        </FlexCol>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Reversed Column</p>
        <FlexCol reverse gap={2} className="w-32 p-4 border rounded">
          <div className="w-full h-10 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">1</div>
          <div className="w-full h-10 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-xs">2</div>
          <div className="w-full h-10 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">3</div>
        </FlexCol>
      </div>
    </div>
  ),
};

export const FlexColCardLayout: Story = {
  name: "FlexCol: Card Layout",
  parameters: {
    docs: {
      description: {
        story: "A practical example of using FlexCol to create a card layout.",
      },
    },
  },
  render: () => (
    <FlexCol gap={4} className="w-64 p-4 border rounded shadow-sm">
      <div className="w-full h-32 bg-muted rounded" />
      <FlexCol gap={2}>
        <h3 className="font-semibold">Card Title</h3>
        <p className="text-sm text-muted-foreground">
          This is a description of the card content using FlexCol for vertical layout.
        </p>
      </FlexCol>
      <FlexRow gap={2} className="mt-auto">
        <button className="flex-1 px-3 py-2 bg-muted rounded text-sm">Cancel</button>
        <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-sm">Save</button>
      </FlexRow>
    </FlexCol>
  ),
};

// ============================================================================
// Combined Examples
// ============================================================================

export const NestedFlexContainers: Story = {
  name: "Combined: Nested Containers",
  parameters: {
    docs: {
      description: {
        story: "FlexRow and FlexCol can nest inside each other using flex item props (grow, shrink, basis, alignSelf, order) directly on the component.",
      },
    },
  },
  render: () => (
    <FlexRow gap={4} className="w-full max-w-2xl p-4 border rounded">
      {/* Sidebar using FlexCol with basis */}
      <FlexCol basis="1/4" gap={2} className="p-3 bg-muted/50 rounded">
        <h3 className="font-medium text-sm">Sidebar</h3>
        <FlexCol gap={1}>
          <div className="px-2 py-1 bg-primary/20 rounded text-xs">Dashboard</div>
          <div className="px-2 py-1 hover:bg-muted rounded text-xs">Settings</div>
          <div className="px-2 py-1 hover:bg-muted rounded text-xs">Profile</div>
        </FlexCol>
      </FlexCol>
      
      {/* Main content using FlexCol with grow */}
      <FlexCol grow={1} gap={4} className="p-3 bg-muted/30 rounded">
        <FlexRow justify="between" align="center">
          <h2 className="font-bold">Main Content</h2>
          <button className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">Add New</button>
        </FlexRow>
        
        {/* Nested FlexRow for cards */}
        <FlexRow gap={3} wrap="wrap">
          <FlexCol basis="1/2" shrink={0} gap={2} className="p-3 bg-background rounded border">
            <span className="text-xs text-muted-foreground">Metric 1</span>
            <span className="text-xl font-bold">1,234</span>
          </FlexCol>
          <FlexCol basis="1/2" shrink={0} gap={2} className="p-3 bg-background rounded border">
            <span className="text-xs text-muted-foreground">Metric 2</span>
            <span className="text-xl font-bold">5,678</span>
          </FlexCol>
        </FlexRow>
        
        <FlexCol gap={2} className="p-3 bg-background rounded border">
          <h3 className="font-medium text-sm">Activity Feed</h3>
          <FlexCol gap={1}>
            <FlexRow justify="between" className="text-xs py-1 border-b">
              <span>Event 1</span>
              <span className="text-muted-foreground">2m</span>
            </FlexRow>
            <FlexRow justify="between" className="text-xs py-1">
              <span>Event 2</span>
              <span className="text-muted-foreground">5m</span>
            </FlexRow>
          </FlexCol>
        </FlexCol>
      </FlexCol>
    </FlexRow>
  ),
};

export const HolyGrailLayout: Story = {
  name: "Combined: Holy Grail Layout",
  parameters: {
    docs: {
      description: {
        story: "Classic holy grail layout using nested FlexRow and FlexCol components with flex item props.",
      },
    },
  },
  render: () => (
    <FlexCol className="w-full max-w-2xl h-96 border rounded overflow-hidden">
      {/* Header */}
      <FlexRow 
        justify="between" 
        align="center" 
        shrink={0}
        className="px-4 py-3 bg-primary text-primary-foreground"
      >
        <span className="font-bold">Header</span>
        <FlexRow gap={2}>
          <span className="text-xs">Nav 1</span>
          <span className="text-xs">Nav 2</span>
        </FlexRow>
      </FlexRow>
      
      {/* Main content area */}
      <FlexRow grow={1} className="overflow-hidden">
        {/* Left sidebar */}
        <FlexCol 
          basis="1/5" 
          shrink={0}
          gap={2} 
          className="p-3 bg-muted/50 border-r overflow-auto"
        >
          <span className="text-xs font-medium">Left Sidebar</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-2 py-1 bg-muted rounded text-xs">Item {i}</div>
          ))}
        </FlexCol>
        
        {/* Center content */}
        <FlexCol grow={1} gap={3} className="p-4 overflow-auto">
          <h2 className="font-bold">Main Content</h2>
          <p className="text-sm text-muted-foreground">
            This is the main content area that grows to fill available space.
            The layout uses nested FlexRow and FlexCol with flex item props.
          </p>
          <FlexRow gap={2} wrap="wrap">
            {[1, 2, 3].map((i) => (
              <FlexCol key={i} basis="1/3" gap={1} className="p-2 bg-muted/30 rounded">
                <span className="text-xs font-medium">Card {i}</span>
                <span className="text-xs text-muted-foreground">Content</span>
              </FlexCol>
            ))}
          </FlexRow>
        </FlexCol>
        
        {/* Right sidebar */}
        <FlexCol 
          basis="1/5" 
          shrink={0}
          gap={2} 
          className="p-3 bg-muted/50 border-l overflow-auto"
        >
          <span className="text-xs font-medium">Right Sidebar</span>
          <div className="p-2 bg-muted rounded text-xs">Widget 1</div>
          <div className="p-2 bg-muted rounded text-xs">Widget 2</div>
        </FlexCol>
      </FlexRow>
      
      {/* Footer */}
      <FlexRow 
        justify="center" 
        align="center"
        shrink={0}
        className="px-4 py-2 bg-muted border-t"
      >
        <span className="text-xs text-muted-foreground">Footer © 2024</span>
      </FlexRow>
    </FlexCol>
  ),
};

export const ResponsiveLayout: Story = {
  name: "Combined: Responsive Layout",
  parameters: {
    docs: {
      description: {
        story: "Using FlexRow and FlexCol together for responsive layouts. On smaller screens, use className overrides for responsive behavior.",
      },
    },
  },
  render: () => (
    <FlexCol gap={4} className="w-full max-w-lg p-4 border rounded">
      <FlexRow justify="between" align="center">
        <h2 className="font-bold">Dashboard</h2>
        <FlexRow gap={2}>
          <button className="px-2 py-1 bg-muted rounded text-xs">Settings</button>
          <button className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">New</button>
        </FlexRow>
      </FlexRow>
      
      <FlexRow gap={4} wrap="wrap">
        <FlexItem basis="full" className="sm:basis-[calc(50%-0.5rem)]">
          <FlexCol gap={2} className="p-4 bg-muted/50 rounded">
            <span className="text-xs text-muted-foreground">Total Users</span>
            <span className="text-2xl font-bold">1,234</span>
          </FlexCol>
        </FlexItem>
        <FlexItem basis="full" className="sm:basis-[calc(50%-0.5rem)]">
          <FlexCol gap={2} className="p-4 bg-muted/50 rounded">
            <span className="text-xs text-muted-foreground">Revenue</span>
            <span className="text-2xl font-bold">$5,678</span>
          </FlexCol>
        </FlexItem>
      </FlexRow>
      
      <FlexCol gap={2} className="p-4 bg-muted/30 rounded">
        <h3 className="font-medium">Recent Activity</h3>
        <FlexCol gap={1}>
          <FlexRow justify="between" className="text-sm py-1 border-b">
            <span>User signed up</span>
            <span className="text-muted-foreground">2m ago</span>
          </FlexRow>
          <FlexRow justify="between" className="text-sm py-1 border-b">
            <span>Order completed</span>
            <span className="text-muted-foreground">5m ago</span>
          </FlexRow>
          <FlexRow justify="between" className="text-sm py-1">
            <span>Payment received</span>
            <span className="text-muted-foreground">10m ago</span>
          </FlexRow>
        </FlexCol>
      </FlexCol>
    </FlexCol>
  ),
};