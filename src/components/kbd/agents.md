# Kbd — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview
`Kbd` renders an inline `<kbd>` element with the standard shadcn keyboard styling. It surfaces
keyboard shortcuts inside tooltips, menu hints, and command palette rows.

## Props
```ts
interface KbdProps extends React.HTMLAttributes<HTMLElement> {}
```
All standard `HTMLElement` attributes (`className`, `children`, `aria-*`, event handlers, …)
are forwarded to the underlying `<kbd>`.

## Dependencies
- `../../lib/utils` — `cn()` for class merging

No Radix or CVA dependency — the primitive is intentionally single-style.

## Styling Decisions
Single static style matches shadcn's kbd pattern:
`inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5
font-mono text-xs font-medium text-muted-foreground`.

`className` is merged last via `cn()`, so consumers can override spacing, color, or border
style per use case without editing the primitive.

## Maintenance Notes
- Only `Kbd` (PascalCase) is exported, per the workspace naming convention. There is no
  lowercase alias.
- The element is rendered as `<kbd>` always; do not attempt to polymorph it — screen readers
  rely on the tag to announce the content as a key.
- For multi-key combos, prefer rendering one `<Kbd>` per key (visually separates the keys).
  Passing a string like `Shift + Tab` is also valid when a single chip is preferred.