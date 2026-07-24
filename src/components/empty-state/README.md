# EmptyState

A composite display primitive for representing the absence of data in a
list, grid, or table. Renders a centered vertical stack of an optional
icon, a title, an optional description, and an optional CTA action — all
in muted styling with ample whitespace.

## When to use

Use `EmptyState` to fill otherwise-empty regions with intentional,
unobtrusive copy instead of leaving blank space:

- A table or data grid with zero rows.
- A search experience with no matching results.
- A list with no items yet (with a CTA to create one).
- A "no notifications" / "no activity" panel.

## Installation

`EmptyState` is exported from `aapaetsch-ui-kit`:

```ts
import { EmptyState } from "aapaetsch-ui-kit";
```

## Usage

```tsx
import { EmptyState, Button } from "aapaetsch-ui-kit";
import { Search } from "lucide-react";

export function NoResults() {
  return (
    <EmptyState
      icon={<Search className="h-10 w-10 text-muted-foreground" />}
      title="No results"
      description="Try adjusting your filters."
      action={<Button>Add new</Button>}
    />
  );
}
```

### Inside a Card / above a DataTable

```tsx
<Card>
  <CardContent className="py-12">
    <EmptyState
      description="This table has no rows yet."
      action={<Button variant="outline">Load data</Button>}
    />
  </CardContent>
</Card>
```

## Props

| Prop          | Type                       | Default          | Description                                                |
| ------------- | -------------------------- | ---------------- | ---------------------------------------------------------- |
| `icon`        | `React.ReactNode`          | lucide `Inbox`   | Icon slot. Pass `null`/`false` to hide.                    |
| `title`       | `React.ReactNode`          | `"Nothing here"` | Title under the icon.                                      |
| `description` | `React.ReactNode`          | —                | Secondary copy under the title. Omitted when not provided. |
| `action`      | `React.ReactNode`          | —                | CTA rendered below the description (typically a `Button`). |
| `size`        | `"sm" \| "md" \| "lg"`     | `"md"`           | Controls icon size and title typography scale.             |
| `className`   | `string`                   | —                | Merged last via `cn()`.                                    |

Any other `React.HTMLAttributes<HTMLDivElement>` are forwarded to the
root element.

## Sizes

| `size` | Icon     | Title                       |
| ------ | -------- | --------------------------- |
| `sm`   | `h-7 w-7`  | `text-base font-medium`   |
| `md`   | `h-10 w-10` | `text-lg font-medium`   |
| `lg`   | `h-12 w-12` | `text-xl font-medium`   |

## Accessibility

- The root is a plain `<div>`; consumers can pass `role`/`aria-label` via
  the extra DOM attributes forwarded by the component.
- The title is rendered as an `<h3>` for semantic heading structure inside
  cards / regions. Adjust the heading level in your app if a different
  level is appropriate for the host region.

## Notes

- The title is always rendered (defaults to `"Nothing here"`); pass
  `title={null}` to remove it. The description is conditionally rendered
  only when provided.
- See `agents.md` for design/variant rationale.