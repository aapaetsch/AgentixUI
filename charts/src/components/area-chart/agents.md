# AreaChart

- **Props:** Shared Cartesian props plus `stacked`.
- **Dependencies:** Shared `CartesianChart`, Recharts area primitives.
- **Styling Decisions:** Low-opacity fills preserve grid and series readability; stacked areas receive stronger opacity.
- **Maintenance Notes:** Only stack values with compatible units. Null values are connected for time-series continuity.
