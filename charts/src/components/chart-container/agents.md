# Chart Foundation

- **Props:** `ChartContainer` accepts a `ChartConfig`, Recharts child, DOM props, and `className`; chrome components accept standard tooltip/legend/card data.
- **Dependencies:** `react`, `recharts`, and `aapaetsch-ui-kit` Card/cn exports.
- **Styling Decisions:** Shared CSS variables scope series colors to each chart. Tailwind selectors lightly theme Recharts internals while preserving composition.
- **Maintenance Notes:** Keep Recharts as an external dependency. A chart container must have a measurable height. Tooltip and legend content require the container context.
