# TechnicalChartView implementation checklist

- [x] Read handoff, local contracts and component guidance.
- [x] Versioned controlled state, pane compatibility, right-offset geometry and tests.
- [x] Pure profile calculations, provenance, range filtering, Canvas rendering and inspection.
- [x] Grouped panes, persistent legends, badges and axis interactions.
- [x] Composed responsive chrome, drawing rail, settings and controlled intents.
- [x] Deterministic stories, accessibility, interaction and performance verification.
- [x] Documentation, roadmap and independent Dev Runner build/Storybook verification.

Visual thesis: a calm, token-driven terminal with a dominant continuous chart surface.
Content plan: compact symbol/commands, synchronized pane stack, drawing tools, range/status.
Interaction thesis: direct manipulation of scales/panes, restrained menu reveals, contained maximize; reduced motion disables animation.

Tool substitutions: no TODO tool, shadcn MCP server or agent/runSubagent is exposed; use this checklist, official shadcn documentation and collaboration.spawn_agent for Dev Runner.

Completed 2026-09-10. See technical-chart-view-completion.md for measured verification and artifact locations.

## Usability refinement — 2026-09-10

- [x] Add supplied earnings dates with chart markers, inspection and fixture coverage.
- [x] Improve visible-range profile color splits, value-area emphasis and POC presentation.
- [x] Fill axis value badges with study colors and readable foreground text.
- [x] Tighten price scale margins and improve meaningful oscillator ticks/bands.
- [x] Restore persistent OHLC readout for the hovered/keyboard-inspected bar.
- [x] Verify screenshots, interactions, accessibility, tests and independent Dev Runner builds; update docs/baselines.

## VPVR row-density refinement — 2026-09-10

- [x] Inspect the derived and supplied volume-profile row sizing.
- [x] Reduce the default derived VPVR row count so each price range and bar is larger.
- [x] Add regression coverage and update component/roadmap documentation.
- [x] Run package tests, typecheck, build and independent Dev Runner Storybook verification.
