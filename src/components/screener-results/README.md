# ScreenerResults

Compact supplied screener rows with optional row activation.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
import { ScreenerResults } from "aapaetsch-ui-kit/finance";

export function Example() {
  return (
    <ScreenerResults
      results={[{ symbol: "DEMO", name: "Demo Company", price: 102, changePercent: 2.5, marketCap: 1000000000 }]}
      onRowClick={result => console.log(result.symbol)}
      locale="en-US"
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `results` | `ScreenerResult[]` | Required symbol/price/changePercent; optional name/marketCap |
| `onRowClick` | `(result: ScreenerResult) => void` | Optional; enables focusable rows and Enter/Space activation |
| `locale` | `string` | Optional Intl number locale |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

changePercent uses percentage units: 2.5 renders 2.50%. Price/market cap use locale number formatting without currency symbols. Missing name/market cap displays an em dash. Sort, filter, and page upstream; the table renders every row. Use unique symbols. A hidden caption names the table.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
