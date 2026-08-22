# Market Charts Package

`@agentix/charts-market` is the ESM-only technical-analysis package. It uses a
first-party Canvas 2D + SVG engine with no runtime chart-engine dependency and exposes
stable root, `core`, `indicators`, `drawings`, `overlays`, `controls`, and
`workspace` entrypoints.

## Architecture — ✅ Complete

| Layer | Status | Delivered contract |
|---|---|---|
| `core` | ✅ Complete | React/browser-independent market types, validation, streaming buffer, engine port and extension contracts |
| `engine` | ✅ Complete | Indexed OHLC storage, logical time and price scales, synchronized panes, DPR-aware Canvas rendering, input control, events, resize and cleanup |
| `indicators` | ✅ Complete | Pure SMA, EMA, VWAP, Bollinger Bands, RSI, MACD and ATR calculations plus rendered overlay/pane series |
| `drawings` | ✅ Complete | Serializable definitions, controlled SVG primitives, OHLC snapping, point editing, selection, hide/lock/delete and undo/redo |
| `overlays` | ✅ Complete | Price/indicator alerts, order/bracket/position lines, execution/replay/session markers |
| `controls` | ✅ Complete | Controlled symbol, interval, series, scale, fit-content and realtime actions |
| `workspace` | ✅ Complete | 1/2/3/4/6/8 layouts, independent synchronization, composable panels, layout management and versioned persistence |

Dependencies flow downward. `core` imports neither React nor Lightweight
Charts, and no vendor type is present in a stable API.

## MarketChart — ✅ Complete

- Candlestick, OHLC bar, line, area and baseline modes.
- Volume and indicator panes with pane resizing.
- Native pan/zoom and crosshair, visible-range callbacks and synchronized range/crosshair commands.
- Linear, logarithmic, percentage and indexed-to-100 price scales.
- Extended-session shading, series markers and chart-bound overlays.
- `appendOrUpdate()` for O(1) streaming updates.
- Loading, empty, error and SSR-safe placeholder states.
- Accessible live current-bar summary and optional data-table alternative.
- Stable consumer render layers, read-only snapshots, rich crosshair values and no third-party branding.
- Configurable locale/timezone formatting.

## Persistence — ✅ Complete

`TechnicalWorkspaceState` is versioned. Serialization, parsing and sequential
migration preserve opaque extension state so unknown plugins survive older
clients. Consumers own storage.

## Release gates

| Gate | Status |
|---|---|
| Indicator math, validation, drawing commands and migrations | ✅ Passing |
| Engine creation/update/event/cleanup and custom-layer contracts | ✅ Passing |
| Controlled component and keyboard-intent tests | ✅ Passing |
| 100,000 historical bars plus 600 streaming updates without loss | ✅ Passing |
| Light/dark, extension, state and workspace Storybook coverage | ✅ Complete |
| ESM/declaration build and first-party engine boundary | ✅ Passing |
| Browser/Storybook smoke and static Storybook build | ✅ Complete |

## Explicit advanced backlog

Fibonacci retracements, channels, anchored VWAP, freehand tools and pattern
recognition remain experimental-plugin backlog. They are not part of the stable
initial drawing contract.

## Changelog

- 2026-08-21 — Closed the first-party acceptance audit by adding renderer-neutral OHLC snapping for new and edited SVG drawing points, with configurable opt-out and distance controls.
- 2026-08-20 — Replaced the external market renderer with the first-party Canvas 2D + SVG engine; added indexed storage, logical time/price scales, pane persistence, incremental indicators, richer crosshair state, controlled indicator UI and stable custom render layers.
