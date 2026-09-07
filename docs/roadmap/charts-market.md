# Market Charts Package

`aapaetsch-charts-market` is the ESM-only technical-analysis package. It uses a
first-party Canvas 2D + SVG engine with no runtime chart-engine dependency and exposes
stable root, `core`, `indicators`, `drawings`, `overlays`, `controls`, and
`workspace` entrypoints.

## Architecture — ✅ Complete

| Layer | Status | Delivered contract |
|---|---|---|
| `core` | ✅ Complete | React/browser-independent market types, validation, streaming buffer, engine port and extension contracts |
| `engine` | ✅ Complete | Indexed OHLC storage, logical time and price scales, synchronized panes, DPR-aware Canvas rendering, input control, events, resize and cleanup |
| `indicators` | ✅ Complete | Pure SMA, EMA, VWAP, Bollinger Bands, RSI, MACD and ATR calculations plus rendered overlay/pane series |
| `drawings` | ✅ Complete | 37-tool practical pack covering documented lines, four channels, measurements/positions, Fibonacci, VWAP, shapes/freehand and annotations; data-aware renderers, full lifecycle support, object management, controlled preferences and v3 persistence |
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

## Drawing Interaction v2 — ✅ Complete

- Renderer-neutral primitives, handles, hit results and renderer definitions route all eight built-ins through one extensible registry.
- Transient multi-selection is separated from persisted documents, with deprecated `DrawingState.selected` compatibility when new selection props are absent.
- Canonical 100-entry bounded history coalesces gestures/style sessions, excludes selection/hover, emits typed change metadata and rebases external controlled documents.
- Deterministic topmost hit testing, minimum-width invisible hit areas, body/handle dragging, multi-move, locked/hidden behavior and final pointer-up recomputation.
- Pointer, touch and keyboard creation/editing; weak/strong/off OHLC snapping with Alt bypass; contextual color/width/dash/fill previews; focus, hover, cursor, snap-marker and live-region feedback.
- Light/dark, narrow, touch, state-matrix and 500-drawing Storybook scenarios verified through static and real-browser smoke builds.

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

Specialist Gann, pitchfork, Elliott-wave, harmonic-pattern, volume-profile, sticker,
emoji and large icon packs remain outside the practical drawing contract. Automatic
pattern recognition remains experimental-plugin backlog.

## TradingView-style analysis expansion — 🔄 In Progress

The coordinated implementation plan for additional chart types, indicators, drawing
tools, and chart-analysis workflows is documented in
[`implementation-plans/market-chart-analysis-expansion-plan.md`](../../implementation-plans/market-chart-analysis-expansion-plan.md).

The practical drawing-tools milestone is complete: lifecycle/primitives, all documented
line variants, four channels, measurements/positions, Fibonacci analysis, anchored and
fixed-range VWAP, annotations/freehand, object management, clipboard/preferences,
alerts, synchronization modes, and workspace v3 migration. Chart-type, indicator,
comparison-series, and richer data-window expansion remains in progress.

## Changelog

- 2026-08-26 — Completed the practical 37-tool drawing pack with fixed/multi-click/variable/freehand lifecycles, persistent OHLC anchors, data-aware regression/measurement/VWAP calculations, four channels, complete line variants, positions, Fibonacci, annotations, deterministic freehand simplification, floating actions, context-managed object tree, controlled preferences/templates, versioned clipboard, alert intents, drawing synchronization modes and workspace v3 migration.
- 2026-08-26 — Completed Drawing Interaction v2 with renderer-neutral registry contracts, transient multi-selection, deterministic geometry/hits, multi-drawing movement, three snapping modes, keyboard/touch editing, style-session previews, typed commit metadata, canonical bounded history, accessibility feedback and 500-drawing stress coverage.
- 2026-08-26 — Rebuilt drawing around local press-drag-release drafts and pointer capture, eliminating hover-driven controlled updates; added angled trend-line gestures, rays, extended lines, ellipses, Fibonacci retracements, styling controls, Escape cancellation and an Alt snapping bypass.
- 2026-08-21 — Closed the first-party acceptance audit by adding renderer-neutral OHLC snapping for new and edited SVG drawing points, with configurable opt-out and distance controls.
- 2026-08-20 — Replaced the external market renderer with the first-party Canvas 2D + SVG engine; added indexed storage, logical time/price scales, pane persistence, incremental indicators, richer crosshair state, controlled indicator UI and stable custom render layers.
