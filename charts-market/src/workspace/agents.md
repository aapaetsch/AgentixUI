# TechnicalWorkspace and MultiChartLayout

- **Props:** One-to-eight chart presets, active chart control, independent synchronization flags and replaceable watchlist/details/lower-panel slots.
- **Dependencies:** React, `cn()`, core workspace state types.
- **Styling Decisions:** Thin dividers and plain layout regions keep the chart workspace dense without turning each panel into a card.
- **Maintenance Notes:** Consumers coordinate synchronized values and own persistence. Migrations must preserve unknown extension payloads.
