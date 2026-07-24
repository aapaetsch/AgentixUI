# Resizable

## Overview

`Resizable` provides draggable, collapsible multi-pane layouts. It is the backbone of the
investment-ops dashboard shell where `Flex`/`Grid` cannot express draggable splitters.

## Installation

```tsx
import { Resizable, ResizablePanel, ResizableHandle } from "aapaetsch-ui-kit";
```

## Usage

```tsx
<Resizable direction="horizontal" autoSaveId="main-layout">
  <ResizablePanel id="left" defaultSize="25%" minSize="10">
    <LeftRail />
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel id="center">
    <Center />
  </ResizablePanel>
</Resizable>
```

## Components

### Resizable (alias: ResizablePanelGroup)

Root container. Sets the resize direction and optionally persists the layout via `autoSaveId`.

**Props**

```ts
interface ResizableProps {
  direction: "horizontal" | "vertical";
  autoSaveId?: string;          // enables layout persistence
  storage?: LayoutStorage;      // pluggable storage backend (defaults to localStorage)
  className?: string;
  children?: React.ReactNode;
}
```

### ResizablePanel

A single pane. Numeric `defaultSize`/`minSize`/`maxSize` are treated as pixels; string values
without units are treated as percentages (e.g. `"25"` = 25%).

**Props**

```ts
interface ResizablePanelProps {
  id?: string;
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  collapsible?: boolean;
  collapsedSize?: number | string;
  className?: string;
  children?: React.ReactNode;
}
```

### ResizableHandle

The draggable splitter between two panels. Exposes `role="separator"` and `aria-orientation`
through the underlying primitive. Keyboard: ArrowKeys resize 1%, Shift+Arrow 10%, Enter toggles
collapse (when `collapsible`).

**Props**

```ts
interface ResizableHandleProps {
  variant?: "line" | "bar" | "grip";    // default "line"
  direction: "horizontal" | "vertical";
  disabled?: boolean;
  onDragging?: (isDragging: boolean) => void;
  className?: string;
}
```

## Dependencies

- `react-resizable-panels` — core layout primitive
- `lucide-react` — `GripVertical` / chevron icons for handle affordances
- `class-variance-authority` — variant management
- `clsx` + `tailwind-merge` via `cn()`

## Variants

`resizableHandleVariants` exposes `variant` (`line` | `bar` | `grip`) and `direction` (`horizontal`
| `vertical`). Dragging applies a `data-active` attribute that grows the handle slightly.

## Accessibility

- Handles expose `role="separator"` and `aria-orientation` via the underlying library.
- Keyboard resizing is provided by `react-resizable-panels` (ArrowKeys 1%, Shift+Arrow 10%).
- Disabled handles keep their visual divider but are non-interactive.

## Maintenance Notes

- This component wraps the installed `react-resizable-panels` API (`Group`/`Panel`/`Separator`).
  The older `PanelGroup`/`PanelResizeHandle` API names are aliased for backwards compatibility.
- Layout persistence is optional and SSR-guarded. When `autoSaveId` is omitted, no storage is
  touched, making the component safe for Electron main-process and SSR.
- The `useDefaultLayout` hook from the library handles storage; a custom `storage` backend can be
  supplied for test/Electron use cases.
- No imperative `useResizablePanel` hook is exposed — add one only when a real consumer needs it.