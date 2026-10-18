# TechnicalChartView completion — 2026-09-10

Implemented the composed `TechnicalChartView` while preserving `MarketChart` and legacy engine adapters. The daily-analysis preset supplies the four-pane RSI / price with four moving averages / MACD+volume / stochastic arrangement, integrated volume profile, drawing rail, persistent pane legends/value badges and range/status controls from one controlled state object.

## Delivered

- Versioned state/reducer/serialization, opaque extension retention and legacy pane adapter.
- Explicit pane grouping, ordering, visibility, collapse, minimum sizes, scale side and precision.
- Shared logical viewport with reserved right offset, bounded offsets and lossless gesture round-trips.
- Manual price scale and Shift-drag price pan, time-axis zoom, axis reset, keyboard inspection/navigation and persistent inspection.
- Pure profile binning and contiguous value-area calculations, supplied-level and clearly labeled approximate sources, fixed/session/visible ranges, settings, Canvas clipping and row inspection.
- Generic series renderer registry; existing five chart types retained; stochastic added to the built-in indicator/runtime catalog.
- UI-kit command surfaces, symbol/interval search, favorites/recent intervals, study configuration/movement, drawing tool menus, controlled maximize and host intents.
- Bounded accessible data table, deliberate keyboard announcements, keyboard pane separators, reduced-motion and forced-color treatment.
- Twelve deterministic stories, four reviewed visual baselines, component docs/agent guidance, package docs and roadmap updates.

## Verification

| Check | Result |
| --- | --- |
| Root typecheck | Passed for UI, charts and charts-market |
| Market tests | 89 tests in 15 files; original 71 retained |
| Root package build | Passed; current market JS and declarations rebuilt after final changes |
| Static Storybook | Passed on current source |
| Independent Dev Runner | Passed builds, declarations, tests and Storybook |
| Final built-package crosshair check | Passed: same-bar pane changes notify; same-pane pixel moves do not |
| Browser accessibility | Zero automated WCAG 2/2.1 A/AA violations across 11 state/theme stories and narrow settings |
| Visual layout | No horizontal overflow; complete/dark, light, narrow and contained-maximize screenshots reviewed |
| Browser interactions | Pointer pan/draw, keyboard inspect/zoom, price-axis manual/reset, pane resize, percentage scale, bounded data table, mobile rail, 200% zoom, touch pan/pinch passed |
| Forced colors | Screenshot inspected; system colors and hollow rising candles retained readability |
| Production performance | 60.04 fps; mean 16.66 ms, p95 18.30 ms over 169 measured frames |

Performance setup: Windows, AMD Ryzen 7 7800X3D, 16 logical CPUs, 64 GiB RAM, headless Chromium 136.0.7103.25, 1440×1000 viewport. The stress story contains 100,000 bars, four panes, 100 drawings and a 100-row profile. Pointer inspection and repeated wheel zoom ran with a Chrome performance trace active. These are measured smoke results, not a guarantee for every machine or workload. The development build with tracing measured about 57 fps; the production artifact met the 60 fps target.

Nonblocking build diagnostics remain: existing Tailwind duration/easing ambiguity warnings, sourcemap location diagnostics, Storybook runtime eval/chunk-size warnings and outdated Browserslist data. No build errors remain.

## Artifacts

- Component/API guide: `charts-market/src/components/technical-chart-view/README.md`.
- Baselines: `charts-market/visual-baselines/` with browser metadata and checksums.
- Repeatable browser runner: `scripts/technical-chart-browser-smoke.cjs`.
- Final build/test logs and Dev Runner checklist: `output/technical-chart-verification/final-*`.
- Browser/accessibility/hardware/frame evidence: `output/technical-chart-verification/browser-smoke.json`.
- Browser trace: `output/technical-chart-verification/browser-trace.zip`.
- Chrome performance trace: `output/technical-chart-verification/performance-trace.json`.
- Additional state/forced-color screenshots: `output/playwright/technical-chart-*.png`.

Consumers supply correctly ordered OHLCV, indicator definitions for custom studies and range-specific supplied profile levels. Bar-derived profiles are approximations, never bid/ask data. Host fullscreen/export/financial/timezone actions, clocks, persistence and market-data acquisition remain consumer responsibilities, as specified in the handoff. Apply application themes at the document root so portaled UI-kit surfaces inherit them.

The TODO, shadcn MCP and named agent/runSubagent tools were unavailable. The implementation used the checked-in TODO, official shadcn component references and the available delegated Dev Runner tool instead.

## Usability refinement — 2026-09-10

Delivered all six requested refinements: supplied earnings events with historical chart pins, accessible date/session/EPS details and an upcoming-event list; blue/amber VPVR with value-area emphasis and full-plot POC; filled latest-value axis badges; 2.5% price padding and round ticks; persistent hovered/keyboard O/H/L/C; taller, shaded, distinctly colored RSI and stochastic panes.

Production verification: 94 tests in 16 files; all workspace typechecks, full package build and Storybook build independently passed through Dev Runner. Eleven stories plus earnings and narrow settings dialogs passed automated WCAG A/AA checks with zero violations. Hover values changed without moving the canvas; pointer, keyboard, touch, drawing, manual scale/reset, pane resizing and 200% zoom smoke passed. Stress: 60.06 fps, 16.65 ms mean / 18.40 ms p95 with 100,000 bars, 100 drawings and 100 profile rows. Four production screenshots reviewed and baseline hashes refreshed.

Earnings are supplied by the consumer. Dates beyond available bars stay in the earnings list; the UI does not infer a future exchange calendar. Bar-derived volume remains explicitly approximate. Existing non-blocking build warnings are unchanged. Logs: output/technical-chart-verification/refinement-*.log; browser results: browser-smoke.json and browser-trace.zip in the same directory.
