# SymbolSearch

Controlled symbol query with supplied results and selection intents.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
"use client";
import { useState } from "react";
import { SymbolSearch } from "aapaetsch-ui-kit/finance";

export function Example() {
  const [query, setQuery] = useState("");
  return (
    <SymbolSearch
      query={query}
      onQueryChange={setQuery}
      results={[{ symbol: "DEMO", name: "Demo Company", exchange: "NASDAQ" }]}
      onSelect={result => { setQuery(result.symbol); console.log("Selected", result.symbol); }}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `query` | `string` | Required input text |
| `onQueryChange` | `(query: string) => void` | Required; receives uppercase query |
| `results` | `SymbolSearchResult[]` | Required symbol/name; optional exchange/assetType |
| `loading` | `boolean` | false; shows loading text |
| `onSelect` | `(result: SymbolSearchResult) => void` | Optional selection intent |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

The host owns debounce, search requests, stale-result handling, clearing results, and focus after selection. Results render whenever nonempty, including while loading. Buttons work with click and normal Tab/Enter/Space; this component does not implement arrow-key combobox navigation. The listbox ID is currently fixed, so use only one mounted instance per document to avoid duplicate IDs.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
