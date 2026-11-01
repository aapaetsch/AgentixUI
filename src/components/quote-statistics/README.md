# QuoteStatistics

Responsive definition list of preformatted quote values.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
import { QuoteStatistics } from "aapaetsch-ui-kit/finance";

export function Example() {
  return (
    <QuoteStatistics
      columns={3}
      statistics={[{ id: "open", label: "Open", value: "$100.00" }, { id: "volume", label: "Volume", value: "12,000" }, { id: "change", label: "Change", value: "+2.5%", emphasis: "positive" }]}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `statistics` | `QuoteStatistic[]` | Required id/label/value; optional emphasis: default, positive, negative |
| `columns` | `2 or 3 or 4` | 2; responsive column count |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

Values are strings or numbers rendered as supplied. Preformat currencies, units, locale, and missing values upstream. Use unique statistic IDs. The semantic dl/dt/dd structure pairs labels and values. Attributes are forwarded to the definition-list root.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
