# ScrollArea

A custom scrollbar container component with Material Design 3 styling, optional infinite scroll functionality, and RTL (right-to-left) layout support. Built on Radix UI primitives for consistent, accessible scrolling across browsers.

## Features

- **Custom Scrollbars**: Cross-browser consistent styled scrollbars with configurable sizes
- **Multiple Orientations**: Vertical and horizontal scrolling with explicit ScrollBar components
- **Visibility Modes**: auto, always, scroll, hover for different UX needs
- **Size Variants**: sm (4px), md (6px), lg (8px) scrollbar thickness
- **Infinite Scroll**: Auto-trigger and manual "Load more" modes with async loading support
- **Custom Loading**: Built-in spinner with optional custom loading indicator via callback
- **RTL Support**: Right-to-left layout for international applications
- **Accessible**: Full keyboard navigation and ARIA support via Radix UI

## Installation

```tsx
import { ScrollArea, ScrollBar } from "@agentix/ui";
```

## Usage

### Basic Vertical Scroll

```tsx
<ScrollArea className="h-72 w-48 rounded-md border">
  <div className="p-4">
    {items.map((item) => (
      <div key={item.id}>{item.content}</div>
    ))}
  </div>
  <ScrollBar />
</ScrollArea>
```

### Horizontal Scroll

```tsx
<ScrollArea className="w-96 whitespace-nowrap rounded-md border">
  <div className="flex w-max space-x-4 p-4">
    {images.map((image) => (
      <img key={image.id} src={image.src} className="shrink-0" />
    ))}
  </div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

### Both Orientations

```tsx
<ScrollArea className="h-72 w-72 rounded-md border">
  <div className="p-4" style={{ width: "500px", height: "500px" }}>
    {/* Large 2D content */}
  </div>
  <ScrollBar orientation="vertical" />
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

### Infinite Scroll (Auto Mode)

```tsx
const [items, setItems] = useState(initialItems);
const [isLoading, setIsLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  setIsLoading(true);
  const newItems = await fetchMoreItems();
  setItems((prev) => [...prev, ...newItems]);
  setHasMore(newItems.length > 0);
  setIsLoading(false);
};

<ScrollArea
  className="h-96 w-64 rounded-md border"
  infiniteScrollMode="auto"
  onLoadMore={loadMore}
  isLoading={isLoading}
  hasMore={hasMore}
  distanceFromBottom={100}
>
  <div className="p-4">
    {items.map((item) => (
      <div key={item.id}>{item.content}</div>
    ))}
  </div>
  <ScrollBar />
</ScrollArea>
```

### Infinite Scroll (Manual Mode)

```tsx
<ScrollArea
  className="h-96 w-64 rounded-md border"
  infiniteScrollMode="manual"
  onLoadMore={loadMore}
  isLoading={isLoading}
  hasMore={hasMore}
  loadMoreText="Load more items"
>
  <div className="p-4">
    {items.map((item) => (
      <div key={item.id}>{item.content}</div>
    ))}
  </div>
  <ScrollBar />
</ScrollArea>
```

### Custom Loading Indicator

```tsx
<ScrollArea
  infiniteScrollMode="auto"
  onLoadMore={loadMore}
  isLoading={isLoading}
  hasMore={hasMore}
  renderLoading={() => (
    <div className="flex items-center justify-center py-4">
      <MyCustomSpinner />
      <span>Fetching more...</span>
    </div>
  )}
>
  {content}
  <ScrollBar />
</ScrollArea>
```

### RTL Support

```tsx
<ScrollArea className="h-72 w-48 rounded-md border" rtl>
  <div className="p-4">
    {arabicItems.map((item) => (
      <div key={item.id}>{item.content}</div>
    ))}
  </div>
  <ScrollBar />
</ScrollArea>
```

### Scrollbar Visibility

```tsx
// Always visible
<ScrollBar visibility="always" />

// Only while scrolling
<ScrollBar visibility="scroll" />

// Only on hover
<ScrollBar visibility="hover" />

// Auto (default) - shows on scroll, hides after delay
<ScrollBar visibility="auto" />
```

### Scrollbar Sizes

```tsx
// Small (4px)
<ScrollArea scrollbarSize="sm">
  {content}
  <ScrollBar />
</ScrollArea>

// Medium (6px) - default
<ScrollArea scrollbarSize="md">
  {content}
  <ScrollBar />
</ScrollArea>

// Large (8px)
<ScrollArea scrollbarSize="lg">
  {content}
  <ScrollBar />
</ScrollArea>

// Or override per ScrollBar
<ScrollBar size="lg" />
```

## API Reference

### ScrollArea Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant (documentation) |
| `scrollbarSize` | `"sm" \| "md" \| "lg"` | `"md"` | Scrollbar thickness |
| `rtl` | `boolean` | `false` | Enable RTL direction |
| `infiniteScrollMode` | `"auto" \| "manual"` | - | Infinite scroll mode |
| `onLoadMore` | `() => void \| Promise<void>` | - | Load more callback |
| `isLoading` | `boolean` | `false` | Loading state |
| `hasMore` | `boolean` | `false` | More items available |
| `distanceFromBottom` | `number` | `100` | Pixels before bottom to trigger auto mode |
| `renderLoading` | `() => ReactNode` | - | Custom loading indicator |
| `loadMoreText` | `string` | `"Load more"` | Manual mode button text |
| `className` | `string` | - | Additional CSS classes |

### ScrollBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Scroll direction |
| `visibility` | `"auto" \| "always" \| "scroll" \| "hover"` | `"auto"` | Visibility behavior |
| `size` | `"sm" \| "md" \| "lg"` | from context | Scrollbar thickness |
| `className` | `string` | - | Additional CSS classes |

## Accessibility

- **Keyboard Navigation**: Arrow keys for scrolling, Home/End for jump to top/bottom
- **ARIA Attributes**: role="scrollbar", aria-valuenow/min/max automatically managed
- **Focus Management**: Preserved during infinite scroll loading
- **RTL Support**: Respects native browser direction handling
- **Screen Readers**: Proper announcements for loading states

## Examples

See the [Storybook stories](./ScrollArea.stories.tsx) for interactive examples including:

- Default vertical scroll
- Horizontal gallery scroll
- Both orientations combined
- All visibility modes (auto, always, scroll, hover)
- All size variants (sm, md, lg)
- Infinite scroll auto mode
- Infinite scroll manual mode
- Custom loading indicator
- RTL layout examples
- Nested scroll areas
- Long content (100+ items)
- Code block with horizontal overflow
