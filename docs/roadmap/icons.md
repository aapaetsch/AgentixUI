# Original icons — aapaetsch-icons

Status: ✅ Complete. Independent package version 0.1.0-beta.0.

- [x] Original rounded-outline design specification and editable SVG sources.
- [x] 158 canonical icons, including the 20-icon portfolio pilot.
- [x] Legacy import mappings retained in catalog.json.
- [x] Typed React API, raw SVGs, named and individual imports.
- [x] Deterministic component/story/README/agent generation.
- [x] Maintained source and story migration across the UI and chart packages.
- [x] Independent Dev Runner verification (265 tests; four package builds; Storybook).
- [x] Browser, packed React 18/19, Next.js server/client, and integrity evidence.

The UI-kit candidate is 0.2.0-beta.3; the market-chart candidate is 0.1.0-beta.2. Chart workspaces use the local UI-kit as a development dependency and require the migrated version as their public peer. No old registry peer or transitive Lucide package remains in the root lockfile. See docs/evidence/icons-implementation.md and docs/evidence/icons-artifacts.json for validation and archive identities.

Icon counts are tracked separately from UI-component counts. Package documentation lives in icons/README.md and icons/DESIGN.md. This work does not redesign portfolio navigation or install packages into PortfolioTrackAndScreen.

