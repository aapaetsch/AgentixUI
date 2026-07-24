import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { ScrollArea, ScrollBar } from "./index";
import { Separator } from "../separator";

/**
 * # ScrollArea
 *
 * A custom scrollbar container component with Material Design 3 styling,
 * optional infinite scroll functionality, and RTL support.
 *
 * ## Features
 * - **Custom scrollbars**: Cross-browser consistent styled scrollbars
 * - **Multiple orientations**: Vertical and horizontal scrolling
 * - **Visibility modes**: auto, always, scroll, hover
 * - **Size variants**: sm (4px), md (6px), lg (8px)
 * - **Infinite scroll**: Auto-trigger and manual "Load more" modes
 * - **RTL support**: Right-to-left layout support via prop
 * - **Accessible**: Built on Radix UI primitives with full keyboard navigation
 *
 * ## Usage
 * ```tsx
 * import { ScrollArea, ScrollBar } from "aapaetsch-ui-kit";
 *
 * <ScrollArea className="h-72 w-48 rounded-md border">
 *   <div className="p-4">
 *     {items.map((item) => (
 *       <div key={item}>{item}</div>
 *     ))}
 *   </div>
 *   <ScrollBar />
 * </ScrollArea>
 * ```
 */
const meta: Meta<typeof ScrollArea> = {
  title: "Utils/ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A custom scrollbar container with Material Design 3 styling, infinite scroll support, and RTL layout capability.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant (affects documentation, scrollbar size is on ScrollBar)",
    },
    scrollbarSize: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Scrollbar thickness: sm (4px), md (6px), lg (8px)",
    },
    rtl: {
      control: "boolean",
      description: "Enable right-to-left direction",
    },
    infiniteScrollMode: {
      control: "select",
      options: [undefined, "auto", "manual"],
      description: "Infinite scroll mode: auto triggers on scroll, manual shows button",
    },
    isLoading: {
      control: "boolean",
      description: "Whether content is currently loading",
    },
    hasMore: {
      control: "boolean",
      description: "Whether there are more items to load",
    },
    distanceFromBottom: {
      control: "number",
      description: "Distance from bottom (px) to trigger load in auto mode",
    },
    loadMoreText: {
      control: "text",
      description: "Text for the load more button in manual mode",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

// ============================================================================
// Sample Data
// ============================================================================

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const longContent = Array.from({ length: 100 }).map(
  (_, i) => `Item ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
);

const artworks = [
  { artist: "Ornella Binni", color: "bg-rose-500" },
  { artist: "Tom Byrom", color: "bg-blue-500" },
  { artist: "Vladimir Malyavko", color: "bg-green-500" },
  { artist: "Helena Zhang", color: "bg-purple-500" },
  { artist: "Marcus Johnson", color: "bg-amber-500" },
  { artist: "Sophia Chen", color: "bg-cyan-500" },
  { artist: "James Wilson", color: "bg-pink-500" },
  { artist: "Emma Davis", color: "bg-indigo-500" },
];

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default vertical scrolling with auto-hide scrollbar.
 */
export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
      <ScrollBar />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic vertical scroll area with a list of version tags.",
      },
    },
  },
};

/**
 * Horizontal scrolling for gallery-style content.
 */
export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {artworks.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <div
                className={`aspect-[3/4] h-40 w-30 ${artwork.color} flex items-center justify-center`}
              >
                <span className="text-white text-xs font-medium">
                  {artwork.artist.split(" ")[0]}
                </span>
              </div>
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo by{" "}
              <span className="font-semibold text-foreground">
                {artwork.artist}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Horizontal scroll area for gallery or carousel-style content.",
      },
    },
  },
};

/**
 * Both vertical and horizontal scrollbars for 2D content navigation.
 */
export const BothOrientations: Story = {
  render: () => (
    <ScrollArea className="h-72 w-72 rounded-md border">
      <div className="p-4" style={{ width: "500px", height: "500px" }}>
        <h4 className="mb-4 text-sm font-medium leading-none">2D Scrollable Content</h4>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="flex h-20 w-20 items-center justify-center rounded-md bg-muted text-sm"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Scroll area with both vertical and horizontal scrollbars for 2D content.",
      },
    },
  },
};

// ============================================================================
// Scrollbar Visibility Stories
// ============================================================================

/**
 * Always visible scrollbar - doesn't hide when not scrolling.
 */
export const AlwaysVisible: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Always Visible</h4>
        {tags.slice(0, 20).map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
      <ScrollBar visibility="always" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Scrollbar is always visible, useful when scroll indication is important.",
      },
    },
  },
};

/**
 * Scrollbar only visible while actively scrolling.
 */
export const VisibleOnScroll: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Visible on Scroll</h4>
        {tags.slice(0, 20).map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
      <ScrollBar visibility="scroll" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Scrollbar appears only while scrolling, then fades out.",
      },
    },
  },
};

/**
 * Scrollbar visible only on hover.
 */
export const VisibleOnHover: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Visible on Hover</h4>
        {tags.slice(0, 20).map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
      <ScrollBar visibility="hover" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Scrollbar appears only when hovering over the scroll area.",
      },
    },
  },
};

// ============================================================================
// Size Variants
// ============================================================================

/**
 * Small scrollbar (4px width).
 */
export const SmallScrollbar: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border" scrollbarSize="sm">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Small Scrollbar</h4>
        {tags.slice(0, 20).map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
      <ScrollBar visibility="always" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Small (4px) scrollbar for compact UI.",
      },
    },
  },
};

/**
 * Large scrollbar (8px width).
 */
export const LargeScrollbar: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border" scrollbarSize="lg">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Large Scrollbar</h4>
        {tags.slice(0, 20).map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
      <ScrollBar visibility="always" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Large (8px) scrollbar for better touch targets or visibility.",
      },
    },
  },
};

// ============================================================================
// Infinite Scroll Stories
// ============================================================================

/**
 * Infinite scroll with auto-trigger mode.
 * Items load automatically when scrolling near the bottom.
 */
export const InfiniteScrollAuto: Story = {
  render: function InfiniteScrollAutoStory() {
    const [items, setItems] = React.useState(() =>
      Array.from({ length: 20 }).map((_, i) => `Item ${i + 1}`)
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);

    const loadMore = React.useCallback(async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const currentLength = items.length;
      if (currentLength >= 100) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const newItems = Array.from({ length: 20 }).map(
        (_, i) => `Item ${currentLength + i + 1}`
      );
      setItems((prev) => [...prev, ...newItems]);
      setIsLoading(false);
    }, [items.length]);

    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Scroll to the bottom to load more items automatically.
        </p>
        <ScrollArea
          className="h-72 w-64 rounded-md border"
          infiniteScrollMode="auto"
          onLoadMore={loadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          distanceFromBottom={100}
        >
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Auto Infinite Scroll ({items.length} items)
            </h4>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <div className="text-sm py-1">{item}</div>
                <Separator className="my-1" />
              </React.Fragment>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Infinite scroll with auto mode - items load automatically when scrolling near the bottom.",
      },
    },
  },
};

/**
 * Infinite scroll with manual "Load more" button.
 * User must click to load more items.
 */
export const InfiniteScrollManual: Story = {
  render: function InfiniteScrollManualStory() {
    const [items, setItems] = React.useState(() =>
      Array.from({ length: 10 }).map((_, i) => `Item ${i + 1}`)
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);

    const loadMore = React.useCallback(async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const currentLength = items.length;
      if (currentLength >= 50) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const newItems = Array.from({ length: 10 }).map(
        (_, i) => `Item ${currentLength + i + 1}`
      );
      setItems((prev) => [...prev, ...newItems]);
      setIsLoading(false);
    }, [items.length]);

    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Click "Load more" to fetch additional items.
        </p>
        <ScrollArea
          className="h-72 w-64 rounded-md border"
          infiniteScrollMode="manual"
          onLoadMore={loadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMoreText="Load more items"
        >
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Manual Infinite Scroll ({items.length} items)
            </h4>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <div className="text-sm py-1">{item}</div>
                <Separator className="my-1" />
              </React.Fragment>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Infinite scroll with manual mode - requires clicking a button to load more items.",
      },
    },
  },
};

/**
 * Infinite scroll with custom loading indicator.
 */
export const CustomLoadingIndicator: Story = {
  render: function CustomLoadingStory() {
    const [items, setItems] = React.useState(() =>
      Array.from({ length: 15 }).map((_, i) => `Item ${i + 1}`)
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);

    const loadMore = React.useCallback(async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const currentLength = items.length;
      if (currentLength >= 60) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const newItems = Array.from({ length: 15 }).map(
        (_, i) => `Item ${currentLength + i + 1}`
      );
      setItems((prev) => [...prev, ...newItems]);
      setIsLoading(false);
    }, [items.length]);

    const customLoader = () => (
      <div className="flex flex-col items-center justify-center py-6 text-primary">
        <div className="animate-bounce mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <span className="text-sm font-medium">Fetching more awesome content...</span>
      </div>
    );

    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Custom loading indicator via renderLoading prop.
        </p>
        <ScrollArea
          className="h-72 w-64 rounded-md border"
          infiniteScrollMode="auto"
          onLoadMore={loadMore}
          isLoading={isLoading}
          hasMore={hasMore}
          renderLoading={customLoader}
        >
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Custom Loader ({items.length} items)
            </h4>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <div className="text-sm py-1">{item}</div>
                <Separator className="my-1" />
              </React.Fragment>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Use the renderLoading prop to provide a custom loading indicator.",
      },
    },
  },
};

// ============================================================================
// RTL Support
// ============================================================================

/**
 * Right-to-left layout support.
 */
export const RTLSupport: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        RTL (Right-to-Left) layout for languages like Arabic, Hebrew, etc.
      </p>
      <div className="flex gap-4">
        <div>
          <p className="text-xs mb-2 text-muted-foreground">LTR (default)</p>
          <ScrollArea className="h-48 w-48 rounded-md border">
            <div className="p-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="text-sm py-1">
                  Left to Right Item {i + 1}
                </div>
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
        <div>
          <p className="text-xs mb-2 text-muted-foreground">RTL enabled</p>
          <ScrollArea className="h-48 w-48 rounded-md border" rtl>
            <div className="p-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="text-sm py-1">
                  عنصر من اليمين إلى اليسار {i + 1}
                </div>
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Enable RTL layout with the rtl prop for right-to-left languages.",
      },
    },
  },
};

/**
 * RTL with horizontal scrolling.
 */
export const RTLHorizontal: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Horizontal scroll with RTL direction.
      </p>
      <ScrollArea className="w-96 whitespace-nowrap rounded-md border" rtl>
        <div className="flex w-max space-x-4 p-4">
          {artworks.map((artwork, i) => (
            <figure key={artwork.artist} className="shrink-0">
              <div className="overflow-hidden rounded-md">
                <div
                  className={`aspect-[3/4] h-32 w-24 ${artwork.color} flex items-center justify-center`}
                >
                  <span className="text-white text-xs">{i + 1}</span>
                </div>
              </div>
              <figcaption className="pt-2 text-xs text-muted-foreground text-right">
                {artwork.artist}
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Horizontal scrolling with RTL direction.",
      },
    },
  },
};

// ============================================================================
// Advanced Use Cases
// ============================================================================

/**
 * Nested scroll areas.
 */
export const NestedScrollAreas: Story = {
  render: () => (
    <ScrollArea className="h-72 w-80 rounded-md border">
      <div className="p-4 space-y-4">
        <h4 className="text-sm font-medium leading-none">Outer Scroll Area</h4>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-md p-2">
            <h5 className="text-xs font-medium mb-2">Inner Area {i + 1}</h5>
            <ScrollArea className="h-24 rounded border bg-muted/20">
              <div className="p-2">
                {Array.from({ length: 10 }).map((_, j) => (
                  <div key={j} className="text-xs py-0.5">
                    Nested item {j + 1}
                  </div>
                ))}
              </div>
              <ScrollBar size="sm" />
            </ScrollArea>
          </div>
        ))}
        <div className="h-40 flex items-center justify-center border rounded-md bg-muted/20">
          <span className="text-sm text-muted-foreground">More content below</span>
        </div>
      </div>
      <ScrollBar />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple nested scroll areas with independent scrolling.",
      },
    },
  },
};

/**
 * Long content scenario with 100+ items.
 */
export const LongContent: Story = {
  render: () => (
    <ScrollArea className="h-96 w-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none sticky top-0 bg-background py-2">
          Long Content (100 items)
        </h4>
        {longContent.map((item, index) => (
          <div key={index} className="text-sm py-2 border-b border-border/50">
            {item}
          </div>
        ))}
      </div>
      <ScrollBar visibility="always" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Long content with 100+ items demonstrating scroll performance.",
      },
    },
  },
};

/**
 * Code block with horizontal overflow.
 */
export const CodeBlock: Story = {
  render: () => (
    <ScrollArea className="w-96 rounded-md border bg-zinc-950">
      <pre className="p-4 text-sm text-zinc-100">
        <code>{`function scrollAreaExample() {
  const items = generateLongListOfItems(1000);
  
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        {items.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}`}</code>
      </pre>
      <ScrollBar orientation="horizontal" className="bg-zinc-800" />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Horizontal scroll for code blocks with long lines.",
      },
    },
  },
};

/**
 * Card list with scroll shadows (visual enhancement).
 */
export const CardList: Story = {
  render: () => (
    <ScrollArea className="h-80 w-72 rounded-lg border shadow-sm">
      <div className="p-4 space-y-3">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
          >
            <h4 className="font-medium text-sm">Card {i + 1}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              This is a card item with some descriptive content.
            </p>
          </div>
        ))}
      </div>
      <ScrollBar />
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story: "Scrollable card list with hover effects.",
      },
    },
  },
};
