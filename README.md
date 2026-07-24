# aapaetsch-ui-kit

A shared React UI library built with **TypeScript**, **React**, **Tailwind CSS**, and **shadcn/ui** patterns. Designed for consumption in Web and Electron applications.

## Features

- **52+ Components** - Core UI primitives and advanced components for any application
- **TypeScript First** - Full type safety with comprehensive prop interfaces
- **Tailwind CSS** - Utility-first styling with CSS variables for theming
- **CVA Variants** - Consistent variant system using `class-variance-authority`
- **Radix UI Primitives** - Accessible, unstyled UI primitives for complex components
- **Storybook Documentation** - Interactive component examples and documentation

## Installation

```bash
npm install aapaetsch-ui-kit
```

## Peer Dependencies

Make sure you have the following installed in your project:

```bash
npm install react react-dom
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
        <Button variant="primary">Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

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

**Why:** Real charting brings heavy dependencies (D3 modules, `visx`, `lightweight-charts`, possibly Canvas/WebGL) and a faster release cadence than the UI kit. Bundling them would force every consumer — settings pages, auth flows, marketing forms — to ship megabytes they may never use. See `docs/chart-library-strategy.md` for the full decision record and the boundary contract.

**Boundary contract:**

```
@agentix/charts  ->  aapaetsch-ui-kit   (charts consumes ui primitives, tokens, cn())
aapaetsch-ui-kit ✗   @agentix/charts  (ui MUST NOT depend on charts)
```

`@agentix/charts` (planned, separate package in this monorepo) will ship the charting surface: `LineChart`, `AreaChart`, `BarChart`, `Histogram`, `ScatterPlot`, `BoxPlot`, `Treemap`, full `Heatmap`/`DonutChart` with axes/legends, `CandlestickChart`, `DepthChart`, plus the quant domain widgets (`EquityCurve`, `DrawdownCurve`, `CorrelationMatrix`, `SignalHeatmap`, `ICBars`, `QuantileSpreadChart`, etc.). Composed dashboards (`BacktestTearsheet`, `RiskDashboard`, `SymbolDetailPage`) will likely live in a third `@agentix/templates` package and consume both.

`globals.css` remains the **single source of truth** for theming across both packages — `@agentix/charts` reads UI kit tokens and defines no visual identity of its own.

## Roadmap — Financial & Quant Components

A consolidated, ranked gap analysis of financial dashboard and quant‑workspace components is captured in `docs/finance-quant-component-roadmap.md`. It covers 145 components across six sections:

1. **Foundational charting & data‑viz primitives**
2. **Form & text primitives**
3. **Layout & shell (finance‑flavored)**
4. **Financial dashboard components** (microstructure, portfolio, news/research)
5. **Quant dashboard components** (charts, signal research, risk, backtest management, infra UI)
6. **Composed templates** (BacktestTearsheet, AlphaTearsheet, RiskDashboard, SymbolDetailPage …)

Each row is ranked P0–P4, tagged with effort (XS–XL), and assigned a destination 🟦 `aapaetsch-ui-kit` / 🟧 `@agentix/charts` / ⬜ templates. A 10‑phase build order (A–J) explicitly schedules UI‑in‑scope work first and chart work after the `@agentix/charts` package is scaffolded.

## Theming

The library uses CSS variables for theming. Customize by overriding the following variables:

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
+-- components/
�   +-- [component]/    # Unified component folders
�   �   +-- index.tsx
�   �   +-- [component].stories.tsx
�   �   +-- agents.md
�   �   +-- README.md



+-- lib/              # Utilities and helpers
�   +-- utils.ts      # cn() and other utilities
�   +-- date-utils.ts # Date formatting and parsing
+-- styles/           # Additional styles
+-- globals.css       # CSS variables and base styles
+-- index.ts          # Main exports
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT � Aidan

## Links

- [Documentation](./docs/ROADMAP.md)
- [Roadmap](./docs/roadmap/overview.md)
- [Changelog](./docs/roadmap/changelog.md)
- [Chart Library Strategy](./docs/chart-library-strategy.md)
- [Financial & Quant Component Roadmap](./docs/finance-quant-component-roadmap.md)

