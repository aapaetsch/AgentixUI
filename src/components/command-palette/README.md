# CommandPalette

## Overview

`CommandPalette` is a keyboard-first search and action launcher (⌘K / Ctrl+K) for power-user
investment-ops flows: symbol lookup, switch watchlist, place quick order, jump to account, load
chart layout, toggle indicator.

## Installation

```tsx
import {
  CommandPalette,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandLoading,
  CommandPaletteTrigger,
  useCommandPalette,
} from "@agentix/ui";
```

## Usage

```tsx
<CommandPalette shortcut="cmd+k">
  <CommandGroup heading="Symbols">
    <CommandItem value="AAPL" label="Apple Inc." onSelect={(v) => addToWatchlist(v)} />
  </CommandGroup>
  <CommandSeparator />
  <CommandGroup heading="Actions">
    <CommandItem value="place-order" label="Place order" shortcut="⌘P" />
  </CommandGroup>
</CommandPalette>
```

## Components

### CommandPalette

Root dialog. Auto-registers the keyboard shortcut (default `cmd+k`). Controlled or uncontrolled.
Provides a context for programmatic open/close via `useCommandPalette`.

**Props**

```ts
interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  shortcut?: string | false;     // default "cmd+k"
  placeholder?: string;            // default "Search…"
  emptyMessage?: string;          // default "No results found."
  filter?: boolean | ((value: string, search: string) => number);
  loop?: boolean;                  // default true
  className?: string;
  children?: React.ReactNode;
}
```

### CommandItem

Selectable row. The `value` controls search matching and may differ from `label`.

```ts
interface CommandItemProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  metadata?: React.ReactNode;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}
```

### Other sub-components

- `CommandGroup` — labeled section. Pass `heading` prop.
- `CommandSeparator` — divider between groups.
- `CommandEmpty` — empty-state fallback.
- `CommandLoading` — async progress indicator with spinner.
- `CommandList` — scrollable results container (uses `ScrollArea`).
- `CommandInput` — search field.
- `CommandPaletteTrigger` — button that opens the palette.
- `useCommandPalette()` — hook for programmatic open/close.

## Dependencies

- `cmdk` — headless command menu primitive
- `@radix-ui/react-dialog` (via existing `Dialog`)
- Existing `ScrollArea`, `Spinner`, `Badge` from the kit
- `lucide-react` for the search icon
- `class-variance-authority` and `cn()`

## Styling Decisions

- Overlay: `bg-black/50 backdrop-blur-sm`; content `max-w-xl w-[90vw]` top-anchored ~18% from top,
  `rounded-md border bg-popover shadow-lg`.
- Selected item: `bg-accent text-accent-foreground`.
- Group label: `text-xs font-medium text-muted-foreground`.
- Item: `px-2 py-1.5 rounded-md gap-2`; icon `size-4 text-muted-foreground`;
  shortcut `ml-auto text-xs text-muted-foreground`.
- Open: fade + `translateY(-4px → 0)` handled by `Dialog` animations.

## Accessibility

- `role="dialog"` and `role="listbox"` come from `cmdk` / `Dialog`.
- Full keyboard nav: ArrowUp/Down move selection, Enter selects, ESC closes.
- Focus trap active while open.
- Consumer-configurable shortcut; no Electron-specific key handling is hardwired.

## Maintenance Notes

- The shortcut string is parsed case-insensitively; `cmd`, `ctrl`, `shift`, `alt` modifiers are
  recognized and combined with the final key token.
- Nested sub-actions (e.g., "Load Layout" expanding inline) are deferred per the v1 plan scope.
- `filter={false}` disables client-side filtering so the consumer can do async search; in that
  mode the consumer must conditionally render matching items.
- `CommandList` wraps `ScrollArea`; if the list height exceeds `max-h-80`, it scrolls inside the
  palette rather than the viewport.