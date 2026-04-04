import type { Meta, StoryObj } from "@storybook/react";
import { Grid, GridItem } from "./index";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible CSS Grid layout container with preset column counts (1-12), gap, and padding options. Supports responsive layouts via className prop.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    cols: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "none"],
      description: "Number of columns (1-12 or none)",
    },
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      description: "Gap between grid items",
    },
    gapX: {
      control: "select",
      options: [undefined, "none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      description: "Horizontal gap (overrides gap)",
    },
    gapY: {
      control: "select",
      options: [undefined, "none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      description: "Vertical gap (overrides gap)",
    },
    padding: {
      control: "select",
      options: [undefined, "none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      description: "Padding around the grid",
    },
    flow: {
      control: "select",
      options: [undefined, "row", "col", "dense", "row-dense", "col-dense"],
      description: "Grid auto flow direction",
    },
    alignItems: {
      control: "select",
      options: [undefined, "start", "center", "end", "stretch", "baseline"],
      description: "Vertical alignment of items",
    },
    justifyItems: {
      control: "select",
      options: [undefined, "start", "center", "end", "stretch"],
      description: "Horizontal alignment of items",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

// Helper component for demo items
const DemoItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-primary/10 border border-primary/20 rounded-md p-4 text-center font-medium ${className}`}
  >
    {children}
  </div>
);

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    cols: 3,
    gap: "md",
  },
  render: (args) => (
    <Grid {...args}>
      <DemoItem>Item 1</DemoItem>
      <DemoItem>Item 2</DemoItem>
      <DemoItem>Item 3</DemoItem>
      <DemoItem>Item 4</DemoItem>
      <DemoItem>Item 5</DemoItem>
      <DemoItem>Item 6</DemoItem>
    </Grid>
  ),
};

export const TwoColumns: Story = {
  args: {
    cols: 2,
    gap: "lg",
  },
  render: (args) => (
    <Grid {...args}>
      <DemoItem>Left</DemoItem>
      <DemoItem>Right</DemoItem>
      <DemoItem>Left</DemoItem>
      <DemoItem>Right</DemoItem>
    </Grid>
  ),
};

export const FourColumns: Story = {
  args: {
    cols: 4,
    gap: "md",
  },
  render: (args) => (
    <Grid {...args}>
      <DemoItem>1</DemoItem>
      <DemoItem>2</DemoItem>
      <DemoItem>3</DemoItem>
      <DemoItem>4</DemoItem>
      <DemoItem>5</DemoItem>
      <DemoItem>6</DemoItem>
      <DemoItem>7</DemoItem>
      <DemoItem>8</DemoItem>
    </Grid>
  ),
};

export const SixColumns: Story = {
  args: {
    cols: 6,
    gap: "sm",
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 12 }, (_, i) => (
        <DemoItem key={i}>{i + 1}</DemoItem>
      ))}
    </Grid>
  ),
};

export const TwelveColumns: Story = {
  args: {
    cols: 12,
    gap: "xs",
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 24 }, (_, i) => (
        <DemoItem key={i} className="p-2 text-sm">
          {i + 1}
        </DemoItem>
      ))}
    </Grid>
  ),
};

// ============================================================================
// Gap Variations
// ============================================================================

export const GapVariations: Story = {
  render: () => (
    <div className="space-y-8">
      {(["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const).map(
        (gap) => (
          <div key={gap}>
            <p className="text-sm font-medium mb-2">gap=&quot;{gap}&quot;</p>
            <Grid cols={4} gap={gap}>
              <DemoItem>1</DemoItem>
              <DemoItem>2</DemoItem>
              <DemoItem>3</DemoItem>
              <DemoItem>4</DemoItem>
            </Grid>
          </div>
        )
      )}
    </div>
  ),
};

export const IndependentGapXY: Story = {
  args: {
    cols: 3,
    gapX: "xl",
    gapY: "sm",
  },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        gapX=&quot;xl&quot; (horizontal) and gapY=&quot;sm&quot; (vertical)
      </p>
      <Grid {...args}>
        {Array.from({ length: 9 }, (_, i) => (
          <DemoItem key={i}>{i + 1}</DemoItem>
        ))}
      </Grid>
    </div>
  ),
};

// ============================================================================
// Padding Variations
// ============================================================================

export const WithPadding: Story = {
  args: {
    cols: 3,
    gap: "md",
    padding: "lg",
  },
  render: (args) => (
    <div className="border border-dashed border-muted-foreground/30 rounded-lg">
      <Grid {...args} className="bg-muted/30">
        <DemoItem>1</DemoItem>
        <DemoItem>2</DemoItem>
        <DemoItem>3</DemoItem>
        <DemoItem>4</DemoItem>
        <DemoItem>5</DemoItem>
        <DemoItem>6</DemoItem>
      </Grid>
    </div>
  ),
};

export const PaddingXY: Story = {
  args: {
    cols: 3,
    gap: "md",
    paddingX: "xl",
    paddingY: "sm",
  },
  render: (args) => (
    <div className="border border-dashed border-muted-foreground/30 rounded-lg">
      <Grid {...args} className="bg-muted/30">
        <DemoItem>1</DemoItem>
        <DemoItem>2</DemoItem>
        <DemoItem>3</DemoItem>
        <DemoItem>4</DemoItem>
        <DemoItem>5</DemoItem>
        <DemoItem>6</DemoItem>
      </Grid>
    </div>
  ),
};

// ============================================================================
// Responsive Grid
// ============================================================================

export const ResponsiveGrid: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Resize the viewport to see the grid adapt: 1 column on mobile, 2 on sm,
        3 on md, 4 on lg
      </p>
      <Grid cols={1} gap="md" className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <DemoItem key={i}>Item {i + 1}</DemoItem>
        ))}
      </Grid>
    </div>
  ),
};

export const ResponsiveWithBreakpoints: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Mobile: 1 col | Tablet: 2 cols | Desktop: 3 cols | Large: 6 cols
      </p>
      <Grid
        cols={1}
        gap="lg"
        className="sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <DemoItem key={i}>Item {i + 1}</DemoItem>
        ))}
      </Grid>
    </div>
  ),
};

// ============================================================================
// Arbitrary Column Count
// ============================================================================

export const ArbitraryColumns: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Using Tailwind arbitrary value syntax for 13 columns
      </p>
      <Grid gap="xs" className="grid-cols-[repeat(13,minmax(0,1fr))]">
        {Array.from({ length: 26 }, (_, i) => (
          <DemoItem key={i} className="p-2 text-xs">
            {i + 1}
          </DemoItem>
        ))}
      </Grid>
    </div>
  ),
};

// ============================================================================
// GridItem Examples
// ============================================================================

export const WithGridItem: Story = {
  render: () => (
    <Grid cols={4} gap="md">
      <GridItem colSpan={2}>
        <DemoItem className="h-full">Spans 2 columns</DemoItem>
      </GridItem>
      <DemoItem>Normal</DemoItem>
      <DemoItem>Normal</DemoItem>
      <DemoItem>Normal</DemoItem>
      <GridItem colSpan={3}>
        <DemoItem className="h-full">Spans 3 columns</DemoItem>
      </GridItem>
    </Grid>
  ),
};

export const GridItemFullWidth: Story = {
  render: () => (
    <Grid cols={4} gap="md">
      <GridItem colSpan="full">
        <DemoItem className="bg-primary/20">Full-width header</DemoItem>
      </GridItem>
      <DemoItem>1</DemoItem>
      <DemoItem>2</DemoItem>
      <DemoItem>3</DemoItem>
      <DemoItem>4</DemoItem>
      <GridItem colSpan="full">
        <DemoItem className="bg-primary/20">Full-width footer</DemoItem>
      </GridItem>
    </Grid>
  ),
};

export const GridItemWithPosition: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Items positioned using colStart and colEnd
      </p>
      <Grid cols={6} gap="md">
        <GridItem colStart={1} colSpan={2}>
          <DemoItem className="h-full">Start 1, Span 2</DemoItem>
        </GridItem>
        <GridItem colStart={4} colSpan={3}>
          <DemoItem className="h-full">Start 4, Span 3</DemoItem>
        </GridItem>
        <GridItem colStart={2} colEnd={6}>
          <DemoItem className="h-full">Start 2, End 6</DemoItem>
        </GridItem>
      </Grid>
    </div>
  ),
};

export const GridItemRowSpan: Story = {
  render: () => (
    <Grid cols={3} gap="md">
      <GridItem rowSpan={2}>
        <DemoItem className="h-full min-h-[120px]">Spans 2 rows</DemoItem>
      </GridItem>
      <DemoItem>Item 2</DemoItem>
      <DemoItem>Item 3</DemoItem>
      <DemoItem>Item 4</DemoItem>
      <DemoItem>Item 5</DemoItem>
    </Grid>
  ),
};

export const GridItemWithPadding: Story = {
  render: () => (
    <Grid cols={3} gap="md">
      <GridItem padding="lg">
        <DemoItem>padding=&quot;lg&quot;</DemoItem>
      </GridItem>
      <GridItem padding="md">
        <DemoItem>padding=&quot;md&quot;</DemoItem>
      </GridItem>
      <GridItem padding="sm">
        <DemoItem>padding=&quot;sm&quot;</DemoItem>
      </GridItem>
      <GridItem paddingX="xl" paddingY="xs">
        <DemoItem>paddingX=&quot;xl&quot; paddingY=&quot;xs&quot;</DemoItem>
      </GridItem>
      <GridItem padding="none">
        <DemoItem>padding=&quot;none&quot;</DemoItem>
      </GridItem>
      <GridItem padding="xl">
        <DemoItem>padding=&quot;xl&quot;</DemoItem>
      </GridItem>
    </Grid>
  ),
};

export const GridItemAlignment: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Individual item alignment with alignSelf and justifySelf
      </p>
      <Grid cols={3} gap="md" className="h-48">
        <GridItem alignSelf="start">
          <DemoItem>alignSelf=&quot;start&quot;</DemoItem>
        </GridItem>
        <GridItem alignSelf="center">
          <DemoItem>alignSelf=&quot;center&quot;</DemoItem>
        </GridItem>
        <GridItem alignSelf="end">
          <DemoItem>alignSelf=&quot;end&quot;</DemoItem>
        </GridItem>
      </Grid>
    </div>
  ),
};

export const GridItemOrder: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Reordering items with the order prop
      </p>
      <Grid cols={4} gap="md">
        <GridItem order={3}>
          <DemoItem>Order 3 (1st in DOM)</DemoItem>
        </GridItem>
        <GridItem order={1}>
          <DemoItem>Order 1 (2nd in DOM)</DemoItem>
        </GridItem>
        <GridItem order={4}>
          <DemoItem>Order 4 (3rd in DOM)</DemoItem>
        </GridItem>
        <GridItem order={2}>
          <DemoItem>Order 2 (4th in DOM)</DemoItem>
        </GridItem>
      </Grid>
    </div>
  ),
};

// ============================================================================
// Alignment
// ============================================================================

export const AlignItems: Story = {
  render: () => (
    <div className="space-y-8">
      {(["start", "center", "end", "stretch"] as const).map((align) => (
        <div key={align}>
          <p className="text-sm font-medium mb-2">
            alignItems=&quot;{align}&quot;
          </p>
          <Grid cols={3} gap="md" alignItems={align} className="h-32 bg-muted/30 rounded-lg">
            <DemoItem>Short</DemoItem>
            <DemoItem className="py-8">Tall item with more content</DemoItem>
            <DemoItem>Short</DemoItem>
          </Grid>
        </div>
      ))}
    </div>
  ),
};

export const JustifyItems: Story = {
  render: () => (
    <div className="space-y-8">
      {(["start", "center", "end", "stretch"] as const).map((justify) => (
        <div key={justify}>
          <p className="text-sm font-medium mb-2">
            justifyItems=&quot;{justify}&quot;
          </p>
          <Grid cols={3} gap="md" justifyItems={justify} className="bg-muted/30 rounded-lg p-4">
            <DemoItem className="w-20">Narrow</DemoItem>
            <DemoItem className="w-32">Medium width</DemoItem>
            <DemoItem className="w-20">Narrow</DemoItem>
          </Grid>
        </div>
      ))}
    </div>
  ),
};

// ============================================================================
// Grid Flow
// ============================================================================

export const GridFlow: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium mb-2">flow=&quot;row&quot; (default)</p>
        <Grid cols={3} gap="md" flow="row">
          <DemoItem>1</DemoItem>
          <DemoItem>2</DemoItem>
          <DemoItem>3</DemoItem>
          <DemoItem>4</DemoItem>
          <DemoItem>5</DemoItem>
        </Grid>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">flow=&quot;col&quot;</p>
        <Grid cols={3} gap="md" flow="col" className="h-48">
          <DemoItem>1</DemoItem>
          <DemoItem>2</DemoItem>
          <DemoItem>3</DemoItem>
          <DemoItem>4</DemoItem>
          <DemoItem>5</DemoItem>
        </Grid>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">
          flow=&quot;dense&quot; (fills holes)
        </p>
        <Grid cols={3} gap="md" flow="dense">
          <DemoItem>1</DemoItem>
          <GridItem colSpan={2}>
            <DemoItem className="h-full">Span 2</DemoItem>
          </GridItem>
          <DemoItem>3</DemoItem>
          <DemoItem>4</DemoItem>
          <DemoItem>5</DemoItem>
        </Grid>
      </div>
    </div>
  ),
};

// ============================================================================
// Real-World Examples
// ============================================================================

export const DashboardLayout: Story = {
  render: () => (
    <Grid cols={12} gap="md">
      {/* Full-width header */}
      <GridItem colSpan="full">
        <div className="bg-primary text-primary-foreground rounded-lg p-4">
          Dashboard Header
        </div>
      </GridItem>

      {/* Sidebar */}
      <GridItem colSpan={3} rowSpan={2}>
        <div className="bg-muted rounded-lg p-4 h-full min-h-[200px]">
          Sidebar Navigation
        </div>
      </GridItem>

      {/* Main content area */}
      <GridItem colSpan={9}>
        <div className="bg-muted rounded-lg p-4 h-32">Main Content</div>
      </GridItem>

      {/* Stats cards in main area */}
      <GridItem colSpan={9}>
        <Grid cols={3} gap="md">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4">
            Stats Card 1
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4">
            Stats Card 2
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4">
            Stats Card 3
          </div>
        </Grid>
      </GridItem>
    </Grid>
  ),
};

export const ProductGrid: Story = {
  render: () => (
    <Grid
      cols={1}
      gap="lg"
      className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <div className="aspect-square bg-muted" />
          <div className="p-4">
            <h3 className="font-medium">Product {i + 1}</h3>
            <p className="text-sm text-muted-foreground">
              Product description goes here
            </p>
            <p className="mt-2 font-bold">$99.99</p>
          </div>
        </div>
      ))}
    </Grid>
  ),
};

export const ImageGallery: Story = {
  render: () => (
    <Grid cols={2} gap="sm" className="md:grid-cols-3 lg:grid-cols-4">
      {/* Featured image spanning 2x2 */}
      <GridItem colSpan={2} rowSpan={2} className="md:col-span-2 md:row-span-2">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-full min-h-[200px] flex items-center justify-center text-white font-bold">
          Featured
        </div>
      </GridItem>
      {/* Regular gallery items */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="aspect-square bg-muted rounded-lg flex items-center justify-center"
        >
          {i + 1}
        </div>
      ))}
    </Grid>
  ),
};

export const FormLayout: Story = {
  render: () => (
    <Grid cols={1} gap="md" className="max-w-xl sm:grid-cols-2">
      <GridItem colSpan="full">
        <div className="space-y-1">
          <label className="text-sm font-medium">Full Name</label>
          <div className="h-10 bg-muted rounded-md border" />
        </div>
      </GridItem>
      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <div className="h-10 bg-muted rounded-md border" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Phone</label>
        <div className="h-10 bg-muted rounded-md border" />
      </div>
      <GridItem colSpan="full">
        <div className="space-y-1">
          <label className="text-sm font-medium">Address</label>
          <div className="h-10 bg-muted rounded-md border" />
        </div>
      </GridItem>
      <div className="space-y-1">
        <label className="text-sm font-medium">City</label>
        <div className="h-10 bg-muted rounded-md border" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Zip Code</label>
        <div className="h-10 bg-muted rounded-md border" />
      </div>
      <GridItem colSpan="full" className="pt-4">
        <div className="h-10 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-medium">
          Submit
        </div>
      </GridItem>
    </Grid>
  ),
};
