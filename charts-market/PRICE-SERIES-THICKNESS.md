# Price series thickness

`MarketChartPresentation.line?: {width?: number}` controls built-in closing-price
line strokes. Use `MarketChart presentation={{line: {width: 1}}}` or
`TechnicalChartView appearance={{line: {width: 3}}}`. The type is exported from
the package root and peer-free `/core`; `TechnicalChartAppearance` inherits it.
No API adjustment or new selector is required.

Width is finite CSS pixels, inclusive 0.5–5; omitted `line` or `width` retains
2px. Constructor and runtime `setPresentation` reject invalid widths using the
existing `Invalid chart presentation line width` error convention. CSS pixels
are intentionally appropriate for Canvas strokes; the engine applies its
existing device-pixel transform exactly once.

The shared built-in line, area and baseline price strokes honor this option.
An isolated observation is a centered square with side length `2 * width`,
retaining the historical 4×4px default. The baseline reference remains 2px.
Study strokes, drawing styles, crosshair inspection markers, volume and candles
have their existing independent controls. Custom series renderers receive the
option through the existing context and choose whether to implement it.

For MyCharts' six combinations, set `state.chartType` to `line`, `candlestick`
or `bar`; use line widths 1/3 for Thin/Thick. Candle/bar Thin/Thick can continue
using `candles: {widthMode: 'adaptive', gap: 6/1, wickWidth: 1/3}`. Dense slots
still constrain candle/bar geometry. Appearance is runtime-only, outside the
version-1 serializer and financial request keys. Hosts own per-chart storage.

Width does not alter supplied timestamps/prices, session/gap segmentation,
autoscaling, viewport control, data tables, keyboard interaction or calculation
admission. No acquisition, financial calculation or persistence is added.

Storybook: **Market Charts / Price series thickness** compares all six choices
in light/dark/midnight, desktop/390px, dense/sparse, single-point and supplied-gap
fixtures. All observations are synthetic host-owned inputs.
