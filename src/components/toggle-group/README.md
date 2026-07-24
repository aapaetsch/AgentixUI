# ToggleGroup

## Overview

`ToggleGroup` is a segmented control for single or multi selection. Replaces ad-hoc
`ConnectedButtonGroup` workarounds wherever a real toggle surface is needed: timeframe pickers,
order side (buy/sell), chart type, indicator toggles.

## Installation

```tsx
import { ToggleGroup, ToggleGroupItem } from "@agentix/ui";
```

## Usage

```tsx
<ToggleGroup type="single" defaultValue="1D" size="sm">
  <ToggleGroupItem value="1D">1D</ToggleGroupItem>
  <ToggleGroupItem value="1W">1W</ToggleGroupItem>
  <ToggleGroupItem value="1M">1M</ToggleGroupItem>
  <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
</ToggleGroup>
```

## Components

### ToggleGroup

Container for a set of `ToggleGroupItem`s. Handles the selection model (`single` or `multiple`),
keyboard navigation (arrow keys move between items; Radix handles roving tabindex), and disabled
state.

**Props**

```ts
interface ToggleGroupProps {
  type: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

### ToggleGroupItem

A single toggleable item inside a `ToggleGroup`.

**Props**

```ts
interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}
```

## Dependencies

- `@radix-ui/react-toggle-group` — core toggle group primitive
- `class-variance-authority` — variant management
- `clsx` + `tailwind-merge` via `cn()`

## Variants

- `toggleGroupVariants` exposes `variant` and `size` for the container.
- `toggleGroupItemVariants` exposes `variant` and `size` for each item.
- Active items in the `default` variant use `bg-primary text-primary-foreground`; in the
  `outline` variant they use a bordered accent background.

## Accessibility

- Keyboard navigation between items is provided by Radix (arrow keys, roving tabindex).
- Focus rings use `focus-visible:ring-ring` matching the rest of the kit.
- Disabled items are non-interactive and dimmed.

## Maintenance Notes

- Sizes align with existing Button/Toolbar sizes (xs=24px, sm=28px, md=32px, lg=36px) so the
  group composes cleanly inside a `Toolbar`.
- The container uses shared borders (`border-r last:border-r-0` on items); when extending variants,
  keep the border scheme consistent so the connected look is preserved.