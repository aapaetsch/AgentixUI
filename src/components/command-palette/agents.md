# CommandPalette — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview

`CommandPalette` is the ⌘K/Ctrl+K search-and-action launcher for power-user investment-ops flows.
It wraps `cmdk` inside the kit's `Dialog` and `ScrollArea` for consistent styling and a11y.

## Props Summary

### CommandPalette
- `open`, `onOpenChange`, `defaultOpen` — controlled/uncontrolled
- `shortcut`: `"cmd+k" | false | <custom>` (default `"cmd+k"`)
- `placeholder`, `emptyMessage`, `loop`
- `filter`: boolean | custom filter fn
- `className`, `children`

### CommandItem
- `value` (search match), `label`, `icon`, `shortcut`, `metadata`, `disabled`, `onSelect`

### Other sub-components
- `CommandGroup` (heading + items)
- `CommandSeparator`, `CommandEmpty`, `CommandLoading`
- `CommandList` (uses `ScrollArea`), `CommandInput`
- `CommandPaletteTrigger`, `useCommandPalette()`

## Dependencies

- `cmdk` (headless)
- `@radix-ui/react-dialog` (via `Dialog`)
- `ScrollArea`, `Spinner`, `Badge` (from the kit)
- `lucide-react` (Search icon)
- `cn()`, `class-variance-authority`

## Styling Decisions

- Overlay: `bg-black/50 backdrop-blur-sm`.
- Content: `max-w-xl w-[90vw]` top-anchored ~18% from top with `shadow-lg`.
- Selected: `bg-accent text-accent-foreground`.
- Group label: `text-xs font-medium text-muted-foreground`.
- Item metadata + shortcut sit on the right (`ml-auto`).

## Maintenance Notes

- The shortcut parser is case-insensitive and recognizes `cmd`/`ctrl`/`shift`/`alt` plus a final
  key. When adding new modifier aliases, update `matchesShortcut`.
- Nested sub-actions are deferred per v1 plan scope — do not add state for nested menus here.
- `filter={false}` disables client filtering for async search; consumer must render matching
  items conditionally.
- `CommandList` wraps `ScrollArea`; the list scrolls inside the palette when results exceed
  `max-h-80`.
- `useCommandPalette()` throws if used outside a `CommandPalette` provider.