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
| `drawings` | ✅ Complete | Renderer-registry-driven horizontal/vertical/trend lines, rays, extended lines, rectangles, ellipses and Fibonacci retracements; deterministic hit testing, pointer/touch/keyboard editing, transient multi-selection, snapping, styling and bounded history |
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

Channels, anchored VWAP, freehand tools and pattern
recognition remain experimental-plugin backlog. They are not part of the stable
initial drawing contract.

## TradingView-style analysis expansion — 📋 Planned

The coordinated implementation plan for additional chart types, indicators, drawing
tools, and chart-analysis workflows is documented in
[`implementation-plans/market-chart-analysis-expansion-plan.md`](../../implementation-plans/market-chart-analysis-expansion-plan.md).

The first milestone adds extensible renderer/transform/drawing contracts, Heikin Ashi,
high-value trend and momentum indicators, Fibonacci/channel/measurement drawings,
multi-symbol comparison, and a richer data window. Advanced price-based and
microstructure charts remain later phases because they require derived or enriched
market-data contracts.

## Changelog

- 2026-08-26 — Completed Drawing Interaction v2 with renderer-neutral registry contracts, transient multi-selection, deterministic geometry/hits, multi-drawing movement, three snapping modes, keyboard/touch editing, style-session previews, typed commit metadata, canonical bounded history, accessibility feedback and 500-drawing stress coverage.
- 2026-08-26 — Rebuilt drawing around local press-drag-release drafts and pointer capture, eliminating hover-driven controlled updates; added angled trend-line gestures, rays, extended lines, ellipses, Fibonacci retracements, styling controls, Escape cancellation and an Alt snapping bypass.
- 2026-08-21 — Closed the first-party acceptance audit by adding renderer-neutral OHLC snapping for new and edited SVG drawing points, with configurable opt-out and distance controls.
- 2026-08-20 — Replaced the external market renderer with the first-party Canvas 2D + SVG engine; added indexed storage, logical time/price scales, pane persistence, incremental indicators, richer crosshair state, controlled indicator UI and stable custom render layers.
