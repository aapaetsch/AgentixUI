# Workspace

`MultiChartLayout` provides 1, 2, 3, 4, 6 and 8-chart arrangements with controlled active-chart state and independent synchronization flags. `TechnicalWorkspace` composes replaceable watchlist, chart, details/news and lower-panel regions.

`serializeWorkspaceState`, `parseWorkspaceState` and `migrateWorkspaceState` implement versioned persistence without owning storage. Opaque extension state is retained through migrations.
