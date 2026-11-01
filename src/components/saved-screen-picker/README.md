# SavedScreenPicker

Choose a saved screen and request management actions.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
"use client";
import { useState } from "react";
import { SavedScreenPicker } from "aapaetsch-ui-kit/finance";

export function Example() {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <SavedScreenPicker
      screens={[{ id: "growth", name: "Growth stocks" }]}
      value={selected}
      onValueChange={setSelected}
      onCreate={() => console.log("Create")}
      onRename={screen => console.log("Rename", screen.id)}
      onDuplicate={screen => console.log("Duplicate", screen.id)}
      onDelete={screen => console.log("Delete", screen.id)}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `screens` | `SavedScreen[]` | Required id/name options |
| `value` | `string` | Optional selected ID; omission shows placeholder |
| `onValueChange` | `(id: string) => void` | Optional selection intent |
| `onCreate` | `() => void` | Optional create intent |
| `onRename, onDuplicate, onDelete` | `(screen: SavedScreen) => void` | Optional selected-screen actions |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

Create is always visible; rename/duplicate/delete appear only when value matches an option. Missing callbacks leave visible actions inert. The host owns dialogs, persistence, and confirmation policy. Changing selection does not load filters automatically. The native select is labeled Saved screen.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
