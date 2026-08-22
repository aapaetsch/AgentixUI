# MarketChartControls

- **Props:** Controlled symbol, interval, chart type, scale mode and action callbacks.
- **Dependencies:** React and the UI kit's `Button` and `cn()` exports.
- **Styling Decisions:** A flat toolbar, compact native selects and a single trailing action group keep chart chrome dense and readable.
- **Maintenance Notes:** Controls only emit intent. Consumers remain responsible for fetching symbols and interval data.
