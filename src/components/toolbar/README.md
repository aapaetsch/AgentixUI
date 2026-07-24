# Toolbar

## Overview

`Toolbar` is a dense horizontal (or vertical) action strip for desktop and data-heavy surfaces:
chart toolbars, table action bars, filter bars. Semantically richer than `ButtonGroup`; handles
roving tabindex and keyboard navigation between actions.

## Installation

```tsx
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarLabel, ToolbarToggleGroup } from "aapaetsch-ui-kit";
```

## Usage

```tsx
<Toolbar>
  <ToolbarButton tooltip="Refresh"><RotateCw /></ToolbarButton>
  <ToolbarSeparator />
  <ToolbarToggleGroup type="single" defaultValue="candle">
    <ToggleGroupItem value="candle">Candle</ToggleGroupItem>
    <ToggleGroupItem value="line">Line</ToggleGroupItem>
  </ToolbarToggleGroup>
</Toolbar>
```

## Components

### Toolbar

Root container. `orientation` (`horizontal` | `vertical`) controls layout direction.

### ToolbarButton

Action button with optional `tooltip` + `tooltipSide` and an `active` visual state.

### ToolbarToggle

A toggleable button with an explicit on/off active visual.

### ToolbarToggleGroup

Single/multi toggle group. Composes the Phase 1 `ToggleGroup` — do not pass a second selection
model. Render `ToggleGroupItem`s as children.

### ToolbarSeparator

Direction-aware divider (`w-px h-6` in a horizontal toolbar; `h-px w-full` in a vertical toolbar).

### ToolbarLabel

Small section title text within a toolbar.

## Props

```ts
interface ToolbarProps {
  orientation?: "horizontal" | "vertical";
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tooltip?: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";  // default "bottom"
  size?: "sm" | "md" | "lg";                          // default "md"
}
```

## Dependencies

- `@radix-ui/react-toolbar`
- `class-variance-authority`, `cn()`
- Existing `Tooltip` and Phase 1 `ToggleGroup` from the kit
- `lucide-react` icons in stories

## Variants

- `toolbarVariants` exposes `orientation`.
- `toolbarButtonVariants` exposes `active` and `size` (`sm`/`md`/`lg`).

## Accessibility

- Roving tabindex is provided by Radix (Arrow keys move between items; Home/End to ends).
- `ToolbarButton` wraps the button in the kit `Tooltip` when `tooltip` is provided.
- `ToolbarToggleGroup` inherits `ToggleGroup` keyboard behavior (arrow keys between items).

## Maintenance Notes

- `ToolbarToggleGroup` composes `ToggleGroup` rather than re-implementing selection — preserve
  that contract when evolving the API.
- Overflow wrapping is sufficient for v1; advanced collapsing logic (overflow menu,
  priority+overflow pattern) is deferred per the plan.
- The separator orientation is inferred from the parent toolbar via `data-orientation` selectors;
  do not hardcode orientations on the separator unless overriding.