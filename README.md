# AgentixUI libraries

A collection of TypeScript and React libraries for web and Electron applications: UI components, dashboard charts, technical market charts, and original icons. The four npm packages share a design language and have separate public APIs and release versions.

## Choose a package

| Package | Use it for | Source | Guide |
| --- | --- | --- | --- |
| `aapaetsch-ui-kit` | Accessible controls, forms, layouts, navigation, and finance workflows | [`src/`](src/) (root npm package) | [UI kit installation and API](docs/ui-kit.md) |
| `aapaetsch-charts` | Dashboard visualizations and quantitative reports, built on Recharts | [`charts/`](charts/) | [Installation and first chart](charts/README.md) |
| `aapaetsch-charts-market` | OHLCV charts, technical indicators, drawings, and controlled analysis workspaces using Canvas 2D + SVG | [`charts-market/`](charts-market/) | [Installation and first market chart](charts-market/README.md) |
| `aapaetsch-icons` | Original rounded-outline React icons and raw SVG assets | [`icons/`](icons/) | [Installation and icon API](icons/README.md) |

Use the packages your application needs. The UI kit does not import either chart package. Both chart packages use the UI kit for shared controls and theme tokens; icons can be used independently.

All four packages support React 18/19, TypeScript declarations, ESM, and CommonJS. Icons also support non-React SVG use.

## Installation and styling

For UI components:

```bash
npm install aapaetsch-ui-kit@beta react@19 react-dom@19
```

For dashboard charts or technical market charts, add the corresponding package:

```bash
npm install aapaetsch-charts@beta
# Or, for technical market charts:
npm install aapaetsch-charts-market@beta
```

For standalone icons:

```bash
npm install aapaetsch-icons@beta react@19
```

Import compiled styles once in your application entry point, including only chart stylesheets you use:

```tsx
import "aapaetsch-ui-kit/globals.css";
// Dashboard charts:
import "aapaetsch-charts/styles.css";
// Technical market charts:
import "aapaetsch-charts-market/styles.css";
```

Standalone icons need no stylesheet. Consumers do not need Tailwind to render bundled styles. Put application overrides after package styles. Set theme variables and `.dark` on the document root so portaled controls inherit them. In Next.js App Router, import styles in the root layout and put interactive components behind a client boundary.

These guides describe this source checkout. A successful source build does not establish npm availability. Check the selected release's peer requirements and [release records](docs/evidence/market-feature-releases.md), especially for the coordinated UI/chart fullscreen portal API. Package versions and npm tags can differ; workspace manifests do not record every isolated release.

## Package boundaries

- **UI kit:** general components, finance UI through `aapaetsch-ui-kit/finance`, and a template through `aapaetsch-ui-kit/templates/investment-ops`.
- **Dashboard charts:** general chart rendering, chart chrome, and financial/quantitative report compositions.
- **Market charts:** chart rendering, interactions, drawings, and controlled state. The consuming app supplies data acquisition, persistence, account context, alert evaluation, and trading actions.
- **Icons:** typed SVG components and raw assets, also re-exported by the UI kit.

Shared CSS variables originate in the UI kit. Each chart package adds its own compiled utility stylesheet. See the [architecture decision](docs/chart-library-strategy.md) and [integration documentation](docs/README.md).

## Development

This is an npm-workspaces repository. Run from the repository root:

```bash
npm ci
npm run build
npm run storybook
```

The aggregate build compiles icons, UI, dashboard charts, and market charts in order. Storybook serves examples from all four packages on port 6006.

```bash
npm run typecheck
npm test
npm run lint
npm run build-storybook
```

Package-specific builds are available as `build:icons`, `build:ui`, `build:charts`, and `build:charts-market`. Generated validation directories are local artifacts; retain portable release summaries and receipts under `docs/evidence/` instead of committing copied dependencies, build trees, or caches.

## Repository structure

```text
package.json          Root UI-kit package and workspace scripts
src/                  UI components, finance entrypoint, templates, theme source
icons/                Standalone icon npm workspace
charts/               Dashboard/quant chart npm workspace
charts-market/        Technical market-chart npm workspace
.storybook/           Shared Storybook configuration
docs/                 Package guides, architecture, roadmaps, release evidence
```

## Documentation

- [Documentation index and framework integration](docs/README.md)
- [UI kit guide and component catalog](docs/ui-kit.md)
- [Implementation status](docs/ROADMAP.md)
- [Roadmap overview](docs/roadmap/overview.md) and [changelog](docs/roadmap/changelog.md)
- [Finance and quant roadmap](docs/finance-quant-component-roadmap.md)

## License

MIT — Aidan
