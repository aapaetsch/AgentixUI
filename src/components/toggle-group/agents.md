# ToggleGroup — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview

`ToggleGroup` is a segmented control supporting single and multi selection. It wraps
`@radix-ui/react-toggle-group` and is the semantically correct replacement for ad-hoc
`ConnectedButtonGroup` workarounds used as toggle surfaces.

## Props Summary

### ToggleGroup
- `type`: `"single" | "multiple"` (required)
- `value`, `defaultValue`, `onValueChange` — controlled/uncontrolled selection
- `disabled`, `loop`
- `variant`: `"default" | "outline"`
- `size`: `"xs" | "sm" | "md" | "lg"`
- `lines`: `1 | 2` — enable per-item text wrapping for up to two stacked rows (default `1`)
- `className`, `children`

### ToggleGroupItem
- `value: string`
- `disabled?: boolean`
- `variant`, `size` (inherit from parent when omitted)
- Pass-through button attributes

## Dependencies

- `@radix-ui/react-toggle-group`
- `class-variance-authority`
- `clsx` + `tailwind-merge` via `cn()`

## Styling Decisions

- Container: `rounded-md border bg-background`, connected items share borders via
  `border-r last:border-r-0`.
- Active item (`default` variant): `bg-primary text-primary-foreground`.
- Active item (`outline` variant): `border-primary bg-accent/30 text-foreground`.
- Inactive items: `bg-transparent text-muted-foreground hover:bg-accent`.
- Sizes align with existing Button/Toolbar sizes (xs/sm/md/lg) so they compose cleanly inside a
  `Toolbar`. Toggle height is content-driven: the container has no `min-h-*`, and items set
  their own height via `py-*` vertical padding. `items-stretch` keeps all items equal height,
  and the group grows naturally when an item wraps to two lines.
- Multi-line text: set `lines={2}` on the `ToggleGroup` to switch items to `whitespace-pre-line`
  (via `group-data-[lines=2]/toggle`). Explicit newlines (e.g. `"iron\ncondor"`) and natural
  word wraps both render correctly, and the group height grows to fit the tallest item. With
  `lines={1}` (default) items use `whitespace-nowrap`.

## Maintenance Notes

- `onValueChange` from Radix emits `string | undefined` for `single` and `string[]` for
  `multiple`. The public prop widens the type to `string | string[] | undefined` for ergonomics;
  the cast at the binding site keeps the Radix call site correctly typed.
- When adding a new variant, update both `toggleGroupVariants` and `toggleGroupItemVariants` so
  the container and item variants stay in sync.
- The `ToolbarToggleGroup` (Phase 3) composes this component rather than re-implementing a
  second selection model — preserve that contract when evolving the API.