# LineChart

- **Props:** Cartesian data, x key, series metadata, required accessible label, sizing and chrome toggles, plus `showDots`.
- **Dependencies:** Shared `CartesianChart`, Recharts line primitives.
- **Styling Decisions:** Two-rem axis gutters, two-pixel monotone strokes, shared chart palette, and optional dots reduce visual noise in dashboards.
- **Maintenance Notes:** Data values for series keys must be numeric or null. Animation is disabled for deterministic rendering and reduced-motion safety.
