# DropdownMenu

A reusable action menu primitive built on Radix Dropdown Menu. It follows the same overlay styling as the rest of the library and is intended to pair with the existing `Button`, `Checkbox`, and icon components.

## Features

- Action items, checkbox items, and radio items
- Nested submenus
- Destructive item variant
- Right-aligned shortcut text
- Keyboard navigation and focus management from Radix

## Basic Usage

```tsx
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "aapaetsch-ui-kit";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button colorStyle="outlined" size="sm">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Open</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Common Patterns

### Visibility toggles

```tsx
<DropdownMenuContent align="end">
  <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
  <DropdownMenuCheckboxItem checked>Email</DropdownMenuCheckboxItem>
  <DropdownMenuCheckboxItem>Location</DropdownMenuCheckboxItem>
</DropdownMenuContent>
```

### Nested actions

```tsx
<DropdownMenuSub>
  <DropdownMenuSubTrigger>More tools</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Archive</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```

## Notes

- Use `DropdownMenuTrigger asChild` whenever the trigger should inherit the sizing and focus behavior of another component.
- Pair `DropdownMenuItem` with the library `Button` and `aapaetsch-icons` icons for consistent visuals.
- `DropdownMenuShortcut` is a visual affordance only; keyboard handlers still need to be implemented by the consumer.

## Fullscreen portal destination

DropdownMenuContent accepts optional `portalContainer` (the underlying Radix Portal container type). Omit it for the existing body portal. A fullscreen host supplies its fullscreen element so the content remains in that browser subtree; the prop is consumed by the Portal and never forwarded to DOM. Existing focus, dismiss, keyboard, variants and default behavior remain unchanged. This additive API needs the corresponding UI-kit release before a consumer relies on it.
