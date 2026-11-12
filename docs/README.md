# Library documentation

Component READMEs describe public APIs, Storybook supplies interactive examples, and roadmaps/evidence track implementation and releases.

## Libraries

| Library | Start here |
| --- | --- |
| UI kit | [Installation and quick start](ui-kit.md), [component folders](../src/components) |
| Dashboard and quant charts | [Install, API, and component directory](../charts/README.md) |
| Technical market charts | [Install and first workspace](../charts-market/README.md) |
| Icons | [Install and API](../icons/README.md), [design system](../icons/DESIGN.md) |

UI guides live at `src/components/<kebab-case-name>/README.md`. Common starting points: [Button](../src/components/button/README.md), [DataTable](../src/components/data-table/README.md), [Dialog](../src/components/dialog/README.md), and [DashboardGrid](../src/components/dashboard-grid/README.md). Finance workflows use `aapaetsch-ui-kit/finance`; see its [export list](../src/finance.ts) and each component guide.

## Frameworks and styling

All four libraries support React 18/19, ESM, and CommonJS. Icons also export raw SVGs and need no stylesheet. UI and chart packages include compiled CSS: consumers do not need to scan their sources with Tailwind.

Import `aapaetsch-ui-kit/globals.css` once, plus `aapaetsch-charts/styles.css` and/or `aapaetsch-charts-market/styles.css` when used. Place application overrides after package styles. Color variables contain HSL channels. Put `.dark` and theme overrides on the document root so portaled menus/dialogs inherit them.

In Next.js App Router, import styles in the root layout and put interactive UI/chart imports behind a client boundary:

```tsx
"use client";
import { useState } from "react";
import { Button } from "aapaetsch-ui-kit";

export function Counter() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>;
}
```

The UI kit's automatic `react-server` condition exposes a restricted server-safe surface. The root includes typography, tables, icons, and pure utilities; the finance server entry exposes payoff helpers and finance types. Interactive finance widgets must be imported in a client component.

Electron renderer apps use the same React/CSS setup. Charts still require DOM layout and measurable dimensions. The host owns broker access, storage, network requests, and trading actions.

## Storybook and contributor checks

Run from the repository root:

```bash
npm ci
npm run build
npm run storybook
```

The build compiles icons before their dependants. Storybook runs on port 6006 and loads all four workspaces. Verification commands:

```bash
npm run typecheck
npm test
npm run build-storybook
```

Each component folder contains implementation, stories, a human README, and agent context. Follow the [repository instructions](../agents.md). Icon folders are generated: edit SVG/catalog sources and regenerate per the icon guide.

## Source and release status

Guides describe this checkout unless they name a particular release. Local completion and successful builds do not establish npm availability. Package manifests/lockfile describe local dependencies; [release evidence](evidence) records reviewed or published artifacts. Check those records before assuming a candidate feature exists in an installed package.

- [Main roadmap and status](ROADMAP.md)
- [Market feature release records and local evidence policy](evidence/market-feature-releases.md)
- [Roadmap overview](roadmap/overview.md)
- [Changelog](roadmap/changelog.md)
- [Chart architecture and package boundaries](chart-library-strategy.md)
- [Finance and quant roadmap](finance-quant-component-roadmap.md)

## Maintaining documentation

Update component guides, package navigation, stories, and roadmap when APIs change. Examples should include imports and valid data. Document required props, defaults, controlled callbacks, units, missing-data behavior, and limits. Keep historical validation receipts separate from getting started.
