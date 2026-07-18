# Templates

## Investment-Ops Template Set — ✅ Complete

Folder: `src/templates/investment-ops/` (secondary entrypoint `@agentix/ui/templates/investment-ops`)

| Block | Status | Description |
|------|--------|-------------|
| **StatTile** | ✅ Complete | KPI tile (`Card` + `Badge` + `AnimatedNumber` + sparkline render slot) |
| **AccountSummary** | ✅ Complete | Grid of `StatTile`s + optional warning `Alert` |
| **Watchlist** | ✅ Complete | `DataTable` + colorized `NumericText` + sparkline render slot |
| **HoldingsTable** | ✅ Complete | `DataTable` + colorized P&L columns + row-action dropdown |
| **OrderTicket** | ✅ Complete | Right-docked `Sheet` form, simple equity flow only; multi-leg options deferred |
| **AllocationBreakdown** | ✅ Complete | `Card` + `Tabs` (Sector/Asset Class/Holding) + chart render slot + breakdown `DataTable` |
| **NewsFeed** | ✅ Complete | Filterable feed (`MultiSelect` + `ToggleGroup`) + `ScrollArea`, `Avatar`, `Badge`, `Chip` |
| **InvestmentOpsDashboard** | ✅ Complete | Composed dashboard shell: `Navbar` + `NavItem` rail + `Tabs` + `Resizable` + `OrderBook` + `TimeAndSales` + `OrderTicket` via `ExtendedFAB` |

Note: The generic `Data Dashboard` placeholder is superseded by this concrete investment-ops set.

## Generic Templates (Planned)

| Template/Component | Priority | Description |
|--------------------|----------|-------------|
| **Admin Dashboard Layout** | 🔴 High | Sidebar + header + content layout |
| **Auth Pages** | 🔴 High | Login, register, forgot password |
| **Settings Page** | 🟡 Medium | Multi-section settings layout |
| **E-commerce Product Grid** | 🟡 Medium | Product listing with filters |
| **Chat Interface** | 🟡 Medium | AI/messaging chat UI |
| **Kanban Board** | 🟢 Low | Drag & drop task board |
| **Calendar View** | 🟢 Low | Month/week/day calendar |
| **Email Client Layout** | 🟢 Low | Three-panel email interface |
| **Documentation Layout** | 🟢 Low | Docs site with sidebar nav |
