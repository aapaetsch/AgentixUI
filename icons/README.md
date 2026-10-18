# aapaetsch-icons

Original rounded-outline SVG icons for AgentixUI. Independently usable in React 18/19, web, Electron, and non-React SVG workflows.

## Usage

    import { SearchIcon, type IconProps, type IconComponent } from "aapaetsch-icons";
    import { CloseIcon } from "aapaetsch-icons/close";

    <SearchIcon className="size-4 text-muted-foreground" />
    <SearchIcon size="1.25rem" strokeWidth={2} />
    <button aria-label="Close"><CloseIcon /></button>
    <SearchIcon aria-label="Search" />

Raw assets are exported as aapaetsch-icons/svg/search.svg. The same canonical components/types are re-exported by aapaetsch-ui-kit, including its server-safe entrypoint.

## API

Every icon accepts IconProps and forwards its SVGSVGElement ref. Standard SVG attributes, events, aria-* and data-* attributes are supported. size defaults to 1.5rem; strokeWidth defaults to 2. Explicit width and height override the corresponding size default. CSS classes override presentation dimensions, so the existing UI-kit size selectors remain authoritative.

className is merged with the local cn helper using clsx and tailwind-merge. Colors inherit through currentColor. No CSS import, UI-kit dependency, icon font, network request, or client-only wrapper is required.

Icons are decorative and nonfocusable by default. An aria-label or aria-labelledby exposes a named image unless explicitly hidden. Name icon-only buttons on the button; keep financial terminology, error messages and status labels in text. Icons do not provide their own tooltips or button behavior.

Named imports and per-icon entrypoints support tree shaking. The production entrypoint exports components only; catalog-wide iteration is confined to Storybook. React is an external peer, never bundled.

## Catalog and design

158 original icons are organized into categories in catalog.json. That file includes searchable keywords, the 20-icon portfolio pilot, original-artwork provenance, and 559 exact pre-migration artwork import mappings. migration-types.json records the three type-only replacements. Semantically equivalent legacy variants share one canonical design; legacy component names are not public exports.

The Storybook Icons/Overview section includes searchable browsing, the pilot, light/dark kit controls, and all four review sizes. Each icon also has generated Default and Sizes stories.

See DESIGN.md for geometry, semantics, and design review rules. The library includes existing story illustration subjects as well as control icons. It does not replace company logos, currency flags, charts, or other data visualizations.

## Development

In a clean checkout, build the icon dependency before running UI/chart source checks or Storybook. The CI workflows do this explicitly; the aggregate npm run build also builds icons first.

    npm run generate --workspace aapaetsch-icons
    npm run check --workspace aapaetsch-icons
    npm run build:icons
    npm run typecheck --workspace aapaetsch-icons
    npm test --workspace aapaetsch-icons
    npm run verify:icons

Edit SVG files and catalog.json, then generate. Do not hand-edit generated component folders. Generation produces each component, story, README, agent context, public barrel, and export map. The check command rejects unsafe SVGs, uncatalogued sources, duplicate names, and stale output. CI also verifies the repository migration.

SVGO 4.1.0 and SVGR 8.1.0 are pinned development tools. Optimized JSX is generated from the editable SVGs; shared declarations are bundled once to keep multi-entry builds within ordinary memory limits.

## Distribution

Version: 0.1.0-beta.0. License: MIT. ESM, CommonJS, declarations for both module systems, and raw SVGs are included.

Independent releases use icons-vVERSION tags. Coordinated releases publish icons before the UI and chart packages that depend on them. Publication and portfolio-app installation are separate actions; local archives do not imply either action occurred.

