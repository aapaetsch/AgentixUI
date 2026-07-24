# Toolbar — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview

`Toolbar` is a dense action strip for desktop data-heavy surfaces. Wraps
`@radix-ui/react-toolbar` and composes the Phase 1 `ToggleGroup` for toggle-group selections.

## Props Summary

### Toolbar
- `orientation?: "horizontal" | "vertical"` (default `"horizontal"`)
- `loop?: boolean`
- `className`, `children`

### ToolbarButton
- `active?: boolean` (toggle/active visual state)
- `tooltip?: string`, `tooltipSide?: "top"|"bottom"|"left"|"right"` (default `"bottom"`)
- `size?: "sm"|"md"|"lg"` (default `"md"`)
- Pass-through button attributes

### ToolbarToggle
- `active?: boolean`, `size?`, pass-through button attributes

### ToolbarToggleGroup
- Composes `ToggleGroup` — pass `ToggleGroupItem`s as children. Single state model.
- Do not re-implement a second selection model.

### ToolbarSeparator / ToolbarLabel
- Separator: direction-aware (`data-orientation` selectors handle styling).
- Label: `px-1.5 text-xs font-medium text-muted-foreground`.

## Dependencies

- `@radix-ui/react-toolbar`
- `class-variance-authority`, `cn()`
- `Tooltip` and `ToggleGroup` from the kit

## Styling Decisions

- Container: `flex gap-0.5 p-1 rounded-md border bg-background`.
- Items: `size-8 rounded`; hover `bg-accent`; active `bg-primary text-primary-foreground`.
- Vertical orientation stacks via `flex-col`; separator direction swaps accordingly.
- Button sizes: `sm`=28px, `md`=32px (default), `lg`=36px.

## Maintenance Notes

- `ToolbarToggleGroup` composes `ToggleGroup` (Phase 1). When `ToggleGroup` API changes, update
  the re-export in this file at the same time.
- Separator orientation is derived from the parent toolbar; the `[data-orientation=…] &` selector
  pattern keeps the CSS tight without prop plumbing.
- Overflow wrapping is sufficient for v1 (plan scope cut). Advanced collapsing logic is deferred.
- The `import` of `ToggleGroup` mid-file is intentional so `ToolbarToggleGroup` can compose it
  without forcing a separate file; keep the import ordering tidy.