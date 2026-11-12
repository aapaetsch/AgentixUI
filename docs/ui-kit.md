# aapaetsch-ui-kit guide

A shared React UI library built with **TypeScript**, **React**, **Tailwind CSS**, and **shadcn/ui** patterns. Designed for consumption in Web and Electron applications.

## Features

- **91 UI component folders** - Core UI primitives, composed controls, and finance workflows, plus separate chart and icon libraries
- **TypeScript First** - Full type safety with comprehensive prop interfaces
- **Tailwind CSS** - Utility-first styling with CSS variables for theming
- **CVA Variants** - Consistent variant system using `class-variance-authority`
- **Radix UI Primitives** - Accessible, unstyled UI primitives for complex components
- **Storybook Documentation** - Interactive component examples and documentation

## Installation

```bash
npm install aapaetsch-ui-kit@beta react@19 react-dom@19
```

## Peer Dependencies

Make sure you have the following installed in your project:

```bash
npm install react@19 react-dom@19
```

## Quick Start

1. Import the global styles in your app entry point:

```tsx
import 'aapaetsch-ui-kit/globals.css';
```

2. Import and use components:

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from 'aapaetsch-ui-kit';

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button colorStyle="filled">Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

The package supports React 18 and 19 and includes compiled CSS. Consumers do not need Tailwind to render the bundled components. If your application uses additional Tailwind classes, compile those in your application as usual. Import the global stylesheet once, before application overrides.

## Library documentation

| Library | Purpose | Start here |
| --- | --- | --- |
| `aapaetsch-ui-kit` | UI primitives, layouts, forms, and finance workflows | [Documentation index](../docs/README.md) and [component guides](../docs/roadmap/components.md) |
| `aapaetsch-charts` | Dashboard charts and quantitative report compositions | [Installation, API, and component directory](../charts/README.md) |
| `aapaetsch-charts-market` | OHLCV charts, indicators, drawings, and technical workspaces | [Installation and first chart](../charts-market/README.md) |
| `aapaetsch-icons` | Standalone React icons and raw SVG assets | [Installation and icon API](../icons/README.md) |

These guides describe this checkout. Features described as local candidates may require a source build; select a published version using the release evidence rather than assuming every source feature is available under the npm beta tag.

## Public imports and framework integration

| Import | Purpose |
| --- | --- |
| `aapaetsch-ui-kit` | General UI components, icons, and utilities |
| `aapaetsch-ui-kit/finance` | Finance workflows, domain types, and payoff helpers |
| `aapaetsch-ui-kit/templates/investment-ops` | Investment operations template |
| `aapaetsch-ui-kit/globals.css` | Compiled styles and theme variables |
| `aapaetsch-ui-kit/tailwind.config` | Optional CommonJS Tailwind preset for host utilities |

JavaScript entrypoints support ESM and CommonJS. Use documented package exports rather than importing files from `src` or `dist`.

In Next.js App Router, put interactive components behind a `"use client"` boundary and import the stylesheet from the root layout. The `react-server` export condition selects a smaller server-safe surface automatically: the root exposes typography, tables, icons, and pure utilities; the finance server entry exposes payoff helpers and finance types. Interactive finance widgets belong in client components. See the [integration guide](../docs/README.md#frameworks-and-styling) for an example.

## Components

### Base Components
| Component | Description |
|-----------|-------------|
| `Button` | Full button system with IconButton, ToggleButton, SplitButton, ButtonGroup, ConnectedButtonGroup |
| `Input` | Text input with icons, validation states, outlined variant |
| `InputIncrementor` | Numeric input with +/- buttons |
| `Select` | Full Radix-based select with groups, labels, separators |
| `Switch` | Toggle switch with size variants |
| `Checkbox` | Single checkbox with indeterminate support |
| `Textarea` | Multi-line text input with auto-resize |
| `Radio` | Radio group with variants |
| `Badge` | Notification badges with anchor and animated variants |
| `Chip` | Removable tags, filters, and status chips |
| `Avatar` | User representation with group and badge support |
| `Alert` | Inline non-modal notifications (5 variants) |
| `AlertDialog` | Modal confirmation dialogs |
| `Spinner` | Loading indicator with multiple sizes |

#### Layout Components
| Component | Description |
|-----------|-------------|
| `Card` | Content container with media, actions, swipeable/expandable variants |
| `Container` | Page wrapper with maxWidth, padding, center variants |
| `Grid` | 12-column layout utility with GridItem |
| `Flex` | Flex layout utility with direction, wrap, gap, alignment |

#### Utility Components
| Component | Description |
|-----------|-------------|
| `Dialog` | Modal with sizes, close button, overlay, multi-page support |
| `Popover` | Click-triggered floating content |
| `Context Menu` | Right-click action menu with submenus, checkboxes, radios |
| `Dropdown Menu` | Action menu with submenus, shortcuts |
| `Tooltip` | Hover/focus information popover |
| `HoverCard` | Rich content preview on hover |
| `Tabs` | Tab navigation with variants |
| `Accordion` | Content disclosure with animated chevrons |
| `Table` | Presentational table primitive |
| `Sheet` | Slide-out panel with position variants |
| `Breadcrumb` | Path navigation with responsive collapsing |
| `Pagination` | Page navigation with smart ellipsis, responsive support |
| `Stepper` | Step-by-step progress indicator |
| `Navigation` | Full navigation system (Navbar, Navrail, Navdrawer) |
| `Skeleton` | Loading placeholders with pulse/shimmer animations |
| `Progress` | Linear and circular progress indicators |
| `Separator` | Visual divider with orientation and color variants |
| `Slider` | Basic slider with sizes and range support |

### Advanced Components

Richer APIs and interaction models for complex use cases.

| Component | Description |
|-----------|-------------|
| `FAB` | Material Design floating action buttons with menu support |
| `ComboBox` | Searchable select with virtualization, async loading |
| `Slider` | Advanced slider with circular handles, value indicators, MD3 animations |
| `Sheet` | Sheet with swipe-to-dismiss, snap points, spring animations |
| `Toast` | Promise-based toasts with undo functionality |
| `Stepper` | Vertical orientation, non-linear navigation, async validation |
| `Navigation` | Navigation submenus with accordion expansion |
| `Carousel` | Multiple transition effects, autoplay support |
| `DatePicker` | Single/range/multiple date selection with presets |
| `TimePicker` | 12h/24h format with scrollable selectors |
| `DateTimePicker` | Combined date+time selection |
| `MultiSelect` | Virtualized multi-select with search and groups |
| `DataTable` | Sortable, filterable, paginated table with virtualization |
| `ScrollArea` | Custom scrollbar with infinite scroll support |

## Component Library Architecture

`aapaetsch-ui-kit` is intentionally **UI‑only**. It contains primitives, layout, form, navigation, disclosure, overlays, and small inline‑SVG data‑viz primitives (`Sparkline`‑class components, `NumericText`, `TrendIndicator`, `Gauge`, `SegmentedProgress`). It deliberately **does not** ship general‑purpose chart components (line, bar, candlestick, heatmap with axes/legends, etc.).

**Why:** Real charting brings specialized rendering, interaction, accessibility, and release concerns. Bundling it would force every consumer—settings pages, auth flows, and marketing forms—to ship code they never use. See `docs/chart-library-strategy.md` for the full decision record and boundary contract.

**Boundary contract:**

```
aapaetsch-charts         -> aapaetsch-ui-kit
aapaetsch-charts-market  -> aapaetsch-ui-kit
aapaetsch-ui-kit         ✗ chart packages
```

`aapaetsch-charts` lives in the `charts/` npm workspace and ships shared chart chrome, ten foundational Recharts charts, and financial/quantitative compositions including depth, volume profile, equity, drawdown, returns, correlation, signals, risk, and tearsheets.

`aapaetsch-charts-market` lives in `charts-market/`. It supports ESM and CommonJS and uses a first-party Canvas 2D + SVG engine, five market-series modes, resizable panes, streaming updates, indicators, controlled drawings, chart overlays, synchronized multi-chart workspaces, and versioned persistence contracts.

`globals.css` remains the **single source of truth** for theme variables across both packages. Each chart package ships a small compiled `styles.css` utility layer so its releases can evolve independently without requiring consumers to scan package source with Tailwind.

## Roadmap — Financial & Quant Components

A consolidated, ranked gap analysis of financial dashboard and quant‑workspace components is captured in `docs/finance-quant-component-roadmap.md`. It covers 145 components across six sections:

1. **Foundational charting & data‑viz primitives**
2. **Form & text primitives**
3. **Layout & shell (finance‑flavored)**
4. **Financial dashboard components** (microstructure, portfolio, news/research)
5. **Quant dashboard components** (charts, signal research, risk, backtest management, infra UI)
6. **Composed templates** (BacktestTearsheet, AlphaTearsheet, RiskDashboard, SymbolDetailPage …)

Each row is ranked P0–P4, tagged with effort (XS–XL), and assigned a destination 🟦 `aapaetsch-ui-kit` / 🟧 `aapaetsch-charts` / ⬜ templates. A 10‑phase build order (A–J) explicitly schedules UI‑in‑scope work first and chart work after the `aapaetsch-charts` package is scaffolded.

## Theming

The library uses CSS variables for theming. Customize by overriding the following variables:

Put `.dark` on the application root for the bundled dark palette. Apply theme variables at the document root so portaled menus, dialogs, and tooltips inherit the same colors. Color variables contain HSL channels; use `hsl(var(--primary))` when assigning a CSS color.

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Start Storybook
npm run storybook

# Build Storybook static
npm run build-storybook
```

## Project Structure

```
src/
|-- components/[component]/
|   |-- index.tsx
|   |-- [component].stories.tsx
|   |-- agents.md
|   `-- README.md
|-- lib/                 # Shared helpers and domain types
|-- globals.css          # CSS variables and style source
|-- index.ts             # General UI exports
`-- finance.ts           # Finance exports
charts/                  # Dashboard and quantitative charts
charts-market/           # Technical market charts
icons/                   # Original React icons and raw SVGs
docs/                    # Documentation index, roadmap, and evidence
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT — Aidan

## Links

- [Documentation](../docs/README.md)
- [Roadmap](../docs/roadmap/overview.md)
- [Changelog](../docs/roadmap/changelog.md)
- [Chart Library Strategy](../docs/chart-library-strategy.md)
- [Financial & Quant Component Roadmap](../docs/finance-quant-component-roadmap.md)

## Original icon library

The kit includes the independent `aapaetsch-icons` workspace: 158 original rounded-outline icons with typed React components and raw SVGs. See [icon usage and authoring](../icons/README.md) and [the icon design system](../icons/DESIGN.md). Icons inherit the kit's colors and control sizes and are also exported by the UI kit.
