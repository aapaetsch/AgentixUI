# Histogram
- **Props:** Numeric observations, bin count, accessible label, color and height.
- **Dependencies:** Recharts BarChart and shared chart chrome.
- **Styling Decisions:** One-pixel bin gaps preserve the continuous distribution shape.
- **Maintenance Notes:** Equal values use a stable unit-width domain; non-finite values should be filtered upstream.
