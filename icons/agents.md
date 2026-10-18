# Original AgentixUI icons

Artwork sources live in svg/; catalog.json owns names, categories, provenance and migration mappings.
Run npm run generate after changing either, then npm run check. Never hand-edit generated component folders.
Every component folder includes index.tsx, its kebab-case story, README.md and agents.md.
Preserve React 18/19 support, CSS-independent rendering, SVG refs, local class merging, and accessibility defaults.
This workspace must never import aapaetsch-ui-kit. Catalog-wide imports belong only in Storybook.

