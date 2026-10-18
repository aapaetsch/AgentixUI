# Original icon implementation evidence — October 17, 2026

## Delivered

- aapaetsch-icons 0.1.0-beta.0: 158 original SVGs and React components, including the 20-icon portfolio pilot.
- UI-kit candidate 0.2.0-beta.3 and market-chart candidate 0.1.0-beta.2. Existing published candidates and previous validation artifacts were preserved.
- All 157 distinct former artwork names map to canonical Icon-suffixed components. catalog.json records 559 artwork usages; migration-types.json records three type-only replacements.
- No third-party icon imports or type dependencies remain in maintained source. The root installed dependency tree and lockfile contain no Lucide package after local chart/UI peer links were corrected.
- Original SVGs, typed ESM/CommonJS root and individual imports, raw SVG paths, server-safe kit reexports, catalog, design rules, and per-icon stories/docs/agent notes.
- Independent icons release tags and icons-first coordinated publication tooling. No registry publication, external application edits, or portfolio installation occurred.

## Validation

Independent Dev Runner ran generation/migration checks, lint, all four typechecks, all 260 tests across 43 files, four package builds, and Storybook. Ten existing hook dependency warnings remain; package builds also report existing Tailwind utility/Browserslist and Storybook chunk-size warnings.

The icon tests cover decorative and meaningful image semantics, explicit hiding, SVG refs/attributes, dimensions, class merging, caller-supplied component compatibility, multi-instance SSR/hydration, and rejection of unsupported/executable SVG content.

Packed React 18.3.1 and React 19.2.8 consumers both passed native ESM/CommonJS imports, all 158 SVG SSR renders, per-icon entrypoint identity, NodeNext ESM/CommonJS declaration checks, raw SVG resolution, and tree shaking. The one-icon minified bundle is 21,118 bytes excluding React; its retained non-artwork code includes the required class-merging utilities. Unrelated artwork and catalog data are excluded. React 19's react-server import passed; React 18 stable does not provide a supported RSC entrypoint.

Next.js 16.2.11 with React 19.2.8 built a production consumer using icons directly and through the kit's server-safe export. Browser verification confirmed named server SVGs, successful hydration, and a working client counter button.

Production Storybook browser checks covered:

- Every SVG's geometry stays within its viewBox; all 158 catalog entries render.
- Search/category filtering and the four review sizes, measured at 14/16/20/24px with normal root font.
- The 20-icon pilot and its 80 size samples, visually inspected alongside kit controls.
- Icon-only button focus, toggle state, draft menus, and interval selection.
- Light/dark surfaces, compact 390px layout, 200% root font, reduced motion, and forced colors.
- Chart settings and original toolbar icons in light/dark chart-local themes, including portaled dialogs.
- No page errors, no horizontal overflow in audited compact/enlarged layouts, and zero axe WCAG A/AA findings in the catalog, control, and light/dark stories.

Initial demo contrast findings came from existing semantic colors on small text. The new examples now keep labels in normal foreground and use semantic icon cues. Global theme tokens and production control behavior were preserved.

## Reproduction and artifacts

- npm run icons:check
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run build-storybook
- npm run verify:icons
- npm run verify:icons-next
- npm run verify:chart-consumer
- npm run evidence:icons

Local detailed logs, baseline patch/status, retired peer-tool copies and consumer installations are under .icon-validation/. Browser screenshots are under output/playwright/icons/. Exact archives, SHA-256/SHA-512 integrity and lockfile identity are recorded in icons-artifacts.json alongside this report.

The final four archive hashes match the clean chart/UI consumer results. The final icon hash also matches both isolated React consumer results, and the final icon/UI hashes match the Next.js production consumer. Lockfile identity was checked after validation. Archives include the preserved chart/dashboard work already present in the saved working-tree baseline.

The browser runner used the repository's existing Playwright/axe tooling and installed Chrome. Browser checks do not claim physical-device or exhaustive assistive-technology testing. Toolchain validation ran on the host Node 22; generator paths are compatible with the advertised Node 18 API surface. The separate Next.js 16 verification requires its supported modern Node runtime.

Historical changelog entries, archived handoffs, immutable previous archives and retained attribution still describe earlier icon dependencies; they are historical evidence rather than active dependencies.

