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
} from "@agentix/ui";

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
- Pair `DropdownMenuItem` with the library `Button` and `lucide-react` icons for consistent visuals.
- `DropdownMenuShortcut` is a visual affordance only; keyboard handlers still need to be implemented by the consumer.
