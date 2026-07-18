# Resizable — Agent Notes

## Important Notes
- Follow **shadcn/ui** design patterns and conventions closely.
- Always create and maintain a **TODO LIST** while working on tasks.
- After code changes, verify with the build and Storybook before marking complete.
- Update `docs/ROADMAP.md` as components are implemented.

## Overview

`Resizable` is the draggable, collapsible multi-pane layout primitive. It wraps
`react-resizable-panels` with library styling and typed props. It is the backbone of the
investment-ops dashboard shell.

## Props Summary

### Resizable
- `direction`: `"horizontal" | "vertical"` (required)
- `autoSaveId?: string` — enables layout persistence (localStorage by default)
- `storage?: LayoutStorage` — pluggable storage backend
- `className`, `children`
- Aliased as `ResizablePanelGroup` for backwards-compat naming.

### ResizablePanel
- `id?: string`, `defaultSize?`, `minSize?`, `maxSize?` (number|string)
- `collapsible?: boolean`, `collapsedSize?`
- `className`, `children`

### ResizableHandle
- `variant?: "line" | "bar" | "grip"` (default `"line"`)
- `direction: "horizontal" | "vertical"` (required)
- `disabled?: boolean`, `onDragging?`, `className`

## Dependencies

- `react-resizable-panels` (installed v3 API: `Group`/`Panel`/`Separator`)
- `lucide-react` for grip and chevron affordances
- `class-variance-authority`
- `clsx` + `tailwind-merge` via `cn()`

## Styling Decisions

- Handle idle: `bg-border`; hover: `bg-primary/40`; active/dragging: `bg-primary/60` and the handle
  grows slightly (`w-px → w-0.5`).
- `bar` variant: `w-1.5` rounded-full, grows to `w-2` on drag.
- `grip` variant: `GripVertical` icon revealed on hover.
- Collapsed/disabled handles show a chevron affordance for expand.
- Focus ring uses `focus-visible:ring-ring ring-offset-1` matching kit conventions.

## Maintenance Notes

- The installed `react-resizable-panels` version uses `Group`/`Panel`/`Separator`, NOT the older
  `PanelGroup`/`PanelResizeHandle` names referenced in the original plan. `Resizable` aliases
  `ResizablePanelGroup` back to `Resizable` for naming familiarity.
- `useDefaultLayout` is used for persistence; pass `onlySaveAfterUserInteractions: true` so
  programmatic layout changes don't thrash storage. Storage access is guarded for SSR/Electron.
- Keyboard resize (1% / 10%) and Enter-to-collapse are handled by the primitive — do not
  reimplement them.
- Do NOT add an imperative `useResizablePanel` hook until a real consumer needs it.
- If the library upgrades and the `Group`/`Separator` API is replaced by `PanelGroup`/
  `PanelResizeHandle`, the aliases and the prop plumbing in this file must be updated together.