# ScreenerFilterBuilder

Controlled field/operator/value rows for a host-owned screen.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
"use client";
import { useState } from "react";
import { ScreenerFilterBuilder, type ScreenerFilter } from "aapaetsch-ui-kit/finance";

export function Example() {
  const [filters, setFilters] = useState<ScreenerFilter[]>([]);
  return (
    <ScreenerFilterBuilder
      definitions={[{ id: "price", label: "Price", type: "number", operators: ["greaterThan", "lessThan"] }]}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `definitions` | `ScreenerFieldDefinition[]` | Required id/label/type; optional operators |
| `filters` | `ScreenerFilter[]` | Required id/field/operator/value rows |
| `onFiltersChange` | `(filters: ScreenerFilter[]) => void` | Required; receives the full new array |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

Field type is number or text. Operators default to greaterThan, lessThan, equal; adding a row uses the first field and its first operator (or greaterThan). With no definitions, Add filter does nothing. Changing fields does not reset an incompatible operator/value. Validate combinations upstream; numeric input converts empty text to zero. The host performs filtering and persistence.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
