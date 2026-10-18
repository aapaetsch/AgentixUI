# DashboardGrid

Controlled, content-agnostic dashboard layout with pointer, keyboard and tap editing. The host supplies cards, data, settings, drafts and persistence. Read mode adds no frame or layout pointer listeners.

```tsx
"use client";
import {useCallback, useRef, useState} from "react";
import {DashboardGrid, type DashboardGridHandle, type DashboardGridItem} from "aapaetsch-ui-kit";
import "aapaetsch-ui-kit/globals.css";

export function Workspace() {
  const [items, setItems] = useState<DashboardGridItem[]>([
    {id: "activity", width: 2, height: 320},
    {id: "notes", width: 2, height: 320},
  ]);
  const grid = useRef<DashboardGridHandle>(null);
  const renderItem = useCallback((item: DashboardGridItem) => <section>{item.id}</section>, []);
  return <DashboardGrid ref={grid} items={items} editing={true}
    onItemsChange={setItems} renderItem={renderItem} getItemLabel={item => item.id}
    aria-label="Workspace" />;
}
```

Use the normal package entrypoint inside a client component. The server-safe conditional entrypoint deliberately does not export this interactive component. Conventional React SSR renders it at one column until the client measures its container. Load `globals.css` once; no additional grid stylesheet is required. Theme tokens and existing Button/Popover primitives style the edit controls. Host cards own their borders, titles and scroll areas; allow space for the edit controls at the upper right.

## Contract

`DashboardGridItem` is `{id: string; width: 1 | 2 | 3 | 4; height: number}`. IDs must be nonempty and unique. At most 24 items are accepted. Height must be an integer from 240 through 720 CSS pixels in steps of 40. Invalid controlled values and commands throw explicitly. No persisted input is silently coerced.

Required props: `items`, `editing`, `onItemsChange`, `renderItem`, `getItemLabel`. Optional: `disabled` (false), `onAnnouncement`, `className`, `style`, `id`, `dir`, `title`, `tabIndex`, `aria-label`, `aria-labelledby`, `aria-describedby` and `data-*`. Class names merge last. Layout geometry controls the inline grid columns/gap. Other arbitrary DOM handlers are not forwarded.

`onItemsChange` emits a fresh canonical array containing only ID, width and height, once per changed commit. No-op commands emit nothing. Merge opaque settings by stable ID in the host; there is no serializer, storage, network, Save/Cancel, Add/Remove/Duplicate or content configuration in the engine. Measurement and rotation never emit a change. A failed host save can retain the current controlled draft.

Keep `renderItem` stable while its data/settings are unchanged. Change its identity when captured content must update. Preview frames do not invoke it. Stable keyed item siblings preserve mounted child state across reorder and resize; a real size commit may invoke `renderItem` for the resized item. Content independently controls subscriptions and data effects.

## Layout and controls

Four logical columns have 12 CSS-pixel gutters. Sequential packing follows canonical order; the tallest item defines each row height. It never backfills gaps. Container content width at least 1100 uses four columns; 640–1099 uses two, mapping widths 1/2 to one visible column and 3/4 to two; below 640 uses one. Projection never rewrites canonical widths.

In enabled edit mode, dedicated 44×44 CSS-pixel move and resize handles use pointer capture and an 8-pixel activation threshold. Only these handles set `touch-action: none`; body interactions and native scroll/zoom remain host/browser behavior. Move previews use a lightweight label and insertion marker. Resize previews snap to valid geometry without committing it. Near an edge, the nearest scrollable ancestor or viewport scrolls until completion or cancellation.

Tablet pointer resizing chooses canonical width 2 or 4 only when a horizontal column step changes; vertical-only resizing retains the original width. One-column pointer resizing changes height only. Tap options expose every canonical width and height at every breakpoint.

Move keyboard: Space/Enter starts and commits, arrows choose the canonical insertion position, Escape cancels. Resize arrows change one canonical width or 40 pixels of height per key press. Layout options provide labelled relative-card selection, Move before/after, width and height choices. Focus follows the stable handle ID after commit; tab order follows the canonical item order. A polite live region and optional `onAnnouncement` report label, position/size and cancellation.

Escape, pointer cancellation, capture loss, orientation/container-width change, external controlled geometry, edit exit, disabling and unmount discard transient work without a gesture commit. Capture, global gesture listeners and animation frames are cleaned up. Disabled mode preserves visible edit controls but prevents editing.

## Host commands and helpers

`ref.execute(command)` uses the same constraints, controlled callback and announcement path; it is ignored outside enabled edit mode. `ref.cancel()` discards a transient gesture. Commands are `{type: "move", id, toIndex}` (final zero-based canonical index) or `{type: "resize", id, width, height}`. Host menus can invoke these without precision gestures.

Pure exports: `validateDashboardGridItems`, `dashboardGridColumns`, `projectDashboardGridWidth`, `packDashboardGrid`, `applyDashboardGridCommand`, `snapDashboardGridHeight`, `findDashboardGridInsertion`, `dashboardGridConstraints`. Types: `DashboardGridProps`, `DashboardGridHandle`, `DashboardGridItem`, `DashboardGridWidth`, `DashboardGridColumns`, `DashboardGridPlacement`, `DashboardGridCommand`, `DashboardGridHitRect`, `DashboardGridInsertion`.

See `docs/dashboard-grid.md` and the separate immutable local publication review for validation, limitations and candidate identity. Publication and consumer exact dependency/lock approval are separate gates.
