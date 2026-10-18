# Roadmap — Overview

> **Roadmap Model:** Single-tier component library with shared components, advanced component families, and planned templates.

## Roadmap Categories

| Category | Scope | Focus |
|----------|-------|-------|
| **Components** | Broadly reusable primitives | Base controls, layout, feedback, navigation |
| **Advanced Components** | Richer APIs and interaction models | Complex patterns, gesture-heavy UI, data-rich flows |
| **Templates** | Full application shells and page layouts | Real-world composition patterns |

---

This overview contains the high-level roadmap context and summary metrics. For details on specific areas, open the referenced files in the `docs/roadmap/` folder.

## Summary

Original icons are tracked independently: 158 complete icons in `aapaetsch-icons`, including a 20-icon portfolio pilot. Icon totals do not change the UI-component counts below. See `icons.md` for package status and evidence.

| Category | Implemented | Planned | Total |
|----------|-------------|---------|-------|
| **Components** | 38 | 1 (Typography) | 39 |
| **Advanced Components** | 14 | 11 | 25 |
| **Templates** | 0 | 4 | 4 |

---

<!-- LLM-REF: docs/roadmap/components.md -->
<!-- LLM-REF: docs/roadmap/advanced-components.md -->
<!-- LLM-REF: docs/roadmap/templates.md -->
<!-- LLM-REF: docs/roadmap/phases.md -->
<!-- LLM-REF: docs/roadmap/guidelines.md -->
<!-- LLM-REF: docs/roadmap/changelog.md -->
<!-- LLM-REF: docs/roadmap/toast-research.md -->
<!-- LLM-REF: docs/roadmap/existing-components.md -->

## Market chart composition

Two primary chart surfaces are complete in `aapaetsch-charts-market`: the low-level `MarketChart` and the composed `TechnicalChartView` (added 2026-09-10). The composed view has 12 deterministic stories; the package has 8 built-in indicator definitions. These package surfaces are tracked separately from the UI-primitives summary above.
