# React 19 / Immutable Prebuilt Package Readiness Handoff

Status: implemented locally; release verification blocked
Requested: 2026-07-22, extended 2026-07-23
Candidate prerelease: `@agentix/ui@0.2.0-beta.1`

## Decision and source lineage

The detailed 2026-07-22 report previously remained blocked while
`docs/codex-library-handoff.md` later claimed the same work passed. Both records
were incomplete: the detailed report omitted commands and hashes, while the
completion note described a local tarball that was neither published nor
attached to an immutable release.

This candidate starts from branch
`react19-package-readiness-beta-0.2.0` at
`5a129a8c5275c0a3f96f38d5717f894bb5d57ead`. Its primary React 19 source
commit is `91a9c11394c12018b291eb41bcc4283cfa941e69`. The reviewed beta.1 candidate
implementation commit is
`ec45f6e29e84d0558668e7b6bce4546f1803da00`. This candidate commit is not yet
the immutable release/tag commit; that final identity remains unestablished
until tagging and publication.

The canonical local beta.0 tarball was independently found at
`C:\Users\aapae\Documents\Projects\Aidans-React-UI\agentix-ui-0.2.0-beta.0.tgz`.
Its SHA-256 is
`ebcc57f717fe7152fbe8127ee1ffe125ef29047ff8e4cc88a5d67461f4c4cc05`,
exactly matching the earlier claim. This proves the bytes existed locally; it
does not prove registry publication, release attachment, provenance, or
immutability. Those bytes were not changed or reused.

## Blocker reconciliation

- React 19 peers, exact dependency versions, lockfile v3, client boundaries,
  tests, and server-safe entrypoints came from `91a9c11`.
- The stale SSR blocker is resolved for the beta.1 candidate: the exact packed
  tarball passes a Next.js 16.2.11 App Router production build through static
  page generation while importing root, finance, and investment-ops barrels
  from a server component.
- Source-scanning CSS is no longer required. `npm run build` runs tsup and then
  Tailwind 3.4.18 to emit a 129.6 kB compiled `dist/globals.css`. The packed
  artifact verifier rejects remaining `@tailwind`, `@apply`, or `@config`
  directives, and the Next production output is checked for AgentixUI tokens
  and component utilities.
- The first native CommonJS smoke exposed an upstream packaging defect in
  `lucide-react@0.474.0`: its `require` target is a `.js` file inside a
  `type=module` package. Beta.1 bundles only the selected lucide icon modules
  into the built entrypoints so CommonJS remains executable. React and React
  DOM stay external. `@radix-ui/react-collapsible@1.1.12`, which is imported
  by the stepper, is now an exact direct runtime dependency and is explicitly
  externalized. The complete lucide ISC text is included in
  `THIRD_PARTY_NOTICES`; lucide remains the only bundled third-party code.
- The `react-server` condition precedes fallback `types`, `import`, and
  `require` conditions for every conditional public export.
- The package has no `preinstall`, `install`, `postinstall`, or `prepare`
  script. Dependency and fixture installs used `--ignore-scripts`; packing
  used `npm pack --ignore-scripts`.

## Toolchain and candidate artifact

- Node.js: `22.17.0`
- npm: `10.9.2`
- Upstream lockfile: version 3
- Upstream raw lock SHA-256:
  `ebee737fe608afaaedbb992d9fdb15d48809ba9ca1cdff6c8569f17922c829a9`
- Fixture raw lock SHA-256:
  `ffae01e1b10b907eb744197716f44d199b1d441302da001420269a064e7b8dde`
- Tarball: `agentix-ui-0.2.0-beta.1.tgz`
- Tarball bytes: `2,223,605`
- Package files: `53`
- Tarball SHA-1:
  `e89df8c3a8f02955914f5d2647ef7239fc88df2e`
- Tarball SHA-256:
  `574f9cc752af8df19846743d9a6b079a598ee69e817f2672dacfe8e8464f71e8`
- Registry-style integrity:
  `sha512-5Vf/ePlx5xOfPol+OeYKua689r+ET10cy+iheHtZ3p+n/55ke+vx6cP5BivLL4PadSNtWoMP8MfP+CEJpae6DQ==`
- Full file inventory:
  `docs/evidence/package-file-inventory.json`

The changed hash is expected: beta.1 has new metadata, nested
`react-server` ESM/CommonJS/type conditions, self-contained compiled CSS,
notices, CommonJS lucide compatibility, and no consumer lifecycle scripts. It
must never be published as beta.0.

## Export and style contract

The packed artifact contains and verifies:

- ESM and CommonJS root entrypoints;
- ESM and CommonJS finance entrypoints;
- ESM and CommonJS investment-operations template entrypoints;
- declarations for each public JavaScript entry;
- nested `react-server` import, require, and type targets;
- `./globals.css`, `./tailwind.config`, and `./package.json` exports;
- MIT `LICENSE`, package `NOTICE`, and `THIRD_PARTY_NOTICES`;
- no standalone `package/src/*` source tree and no consumer build step.

Source maps are intentionally shipped and contain their normal `sources`
references and embedded source content. The source-tree statement means the
archive contains no separately addressable source files, not that maps have
been stripped.

The exact-artifact script runs normal and `react-server` conditional imports
under both ESM and CommonJS, verifies every declared target exists with exact
case and correct condition ordering, rejects lifecycle scripts and uncompiled
CSS, and verifies React and React DOM resolve to 19.2.8. The Next build proves
server evaluation does not touch browser globals and that the client-only
Button/Card boundary remains valid.

React is not bundled: generated code retains external
`react`/`react/jsx-runtime` imports, and no React implementation source appears
in `dist`. The consumer fixture resolves one `react@19.2.8` and one
`react-dom@19.2.8`.

The Linux/case-sensitive gate is cleared. On Ubuntu WSL ext4 at
`/home/aidan/agentixui-beta1-validation-574f`, the official Node.js v22.17.0
archive was verified against the official `SHASUMS256` and used with
npm 10.9.2. Artifact SHA-256
`574f9cc752af8df19846743d9a6b079a598ee69e817f2672dacfe8e8464f71e8`
and fixture lock SHA-256
`ffae01e1b10b907eb744197716f44d199b1d441302da001420269a064e7b8dde`
were confirmed. `npm ci --ignore-scripts` added 176 packages, audited 177, and
reported the known three high baseline vulnerabilities. Artifact verification,
normal and `react-server` typechecks, the Next production build, and style
verification all exited 0; Next compiled and generated 3/3 static pages.
No update or audit fix was attempted.

## Dependency, licensing, and runtime evidence

`docs/evidence/dependency-inventory.json` records all 1,040 lock package nodes
(958 unique name/version pairs), including exact lockfile resolved URLs,
integrity values, OS/CPU constraints, and dev/optional/peer flags. Installed
manifest-derived fields are explicitly scoped: 991 nodes had installed
manifests, while 49 absent optional/platform-specific manifests are listed by
path and their lifecycle, bin, native, and installed-license fields are
recorded as unknown rather than inferred.

- All 1,040 resolved sources use `https://registry.npmjs.org`.
- Across the 991 installed manifests, 70 declare a lifecycle-related script,
  49 expose command-line bins, and none declares `gypfile` or a `binary`
  descriptor. Installation executed no lifecycle scripts because `.npmrc` and
  both clean installs used `--ignore-scripts`.
- Installed-manifest license counts are numeric in the evidence summary:
  MIT 911, Apache-2.0 36, ISC 48, MIT-0 1, BSD-3-Clause 17,
  BlueOak-1.0.0 7, Python-2.0 1, UNKNOWN 1, CC-BY-4.0 1,
  BSD-2-Clause 14, 0BSD 1, BSD 1, and `(MIT OR CC0-1.0)` 1.
- `browser-assert@1.2.1` omits the license field from its package manifest, so
  the generated inventory correctly preserves its installed-license metadata
  as unknown. Manual inspection of the packaged `LICENSE` file confirms the
  full MIT license text and copyright `(c) 2015 Social Ally`; its license is
  file-confirmed and is no longer a release blocker.
- Static source review finds no `fetch`, `XMLHttpRequest`, `WebSocket`,
  `EventSource`, or `sendBeacon` implementation. URLs outside comments/XML
  namespaces occur in Storybook fixture data. The runtime package has no
  telemetry or automatic network behavior; Storybook/Chromatic developer
  tooling may communicate externally when explicitly invoked.
- The only bundled third-party code is selected `lucide-react@0.474.0` code;
  its ISC notice is shipped. Other runtime dependencies remain external.

`npm audit --json` reports five moderate upstream-tree findings:
`@hono/node-server`, `@modelcontextprotocol/sdk`,
`@storybook/addon-actions`, `@storybook/addon-essentials`, and `uuid`.
They are development tooling paths and were not changed or auto-fixed.

The exact requested Next.js 16.2.11 fixture reports three high findings:
`next`, `postcss`, and `sharp`. These are residual risks of the fixed consumer
baseline, not AgentixUI-owned versions. No update or audit-fix was attempted.

## Exact validation commands and results

All commands used the pinned Node/npm binaries.

- `npm ci --ignore-scripts` - pass; 991 packages installed, no lifecycle
  scripts, five moderate audit findings.
- `npm run lint` - pass with zero errors and five pre-existing
  `react-hooks/exhaustive-deps` warnings.
- `npm run typecheck` - pass.
- `npm run test` - pass, 9 files and 45 tests.
- `npm run build` - pass; ESM, CommonJS, declarations, source maps, and
  compiled CSS emitted. Tailwind reported pre-existing ambiguous arbitrary
  duration/easing warnings.
- `npm run pack:artifact` - pass; packing forced `--ignore-scripts`.
- `node scripts/artifact-evidence.mjs` - pass; hashes and all 53 paths recorded.
- `npm run evidence:dependencies` - pass; lock/dependency inventory recorded.
- Fixture `npm install --package-lock-only --ignore-scripts` - pass.
- Fixture `npm ci --ignore-scripts` - pass.
- Fixture `npm run verify:artifact` - pass.
- Fixture `npm run typecheck` - pass.
- Fixture `npm run typecheck:react-server` - pass with TypeScript
  `customConditions: ["react-server"]`. As a negative proof, the same test
  against the preceding incorrectly ordered artifact failed with three
  `TS2578` unused `@ts-expect-error` diagnostics; the corrected artifact
  rejects client-only root, finance, and template imports as intended.
- Fixture `npm run build` - pass through static page generation.
- Fixture `npm run verify:styles` - pass.

The upstream-required independent Dev Runner used Node 22.17.0/npm 10.9.2,
performed no install or repository mutation, and independently passed all
requested commands against the final candidate: library build, Storybook
build, lint, typecheck, tests, artifact verification, normal consumer
typecheck, `react-server` conditional typecheck, Next.js 16.2.11 production
build, and style verification. It confirmed the final tarball SHA-256 above
and 3/3 statically generated pages. Non-fatal observations were unused bundle
imports, outdated `caniuse-lite`, ambiguous Tailwind classes, Storybook
sourcemap/runtime `eval` warnings, chunks above 500 kB, and the anonymous
telemetry notice. Initial sandboxed esbuild attempts hit environment-only
`EPERM`; unrestricted reruns passed. No product or release blocker was found.

## Publication blocker and owner

Browser runtime smoke passed against the final artifact. The Next production
server started at `http://127.0.0.1:3107`; browser automation observed the
initial accessible tree, clicked the stateful native button, and observed
`Client clicks: 0` change to `Client clicks: 1`, proving hydration and event
handling. The browser console contained zero warnings or errors.

Bounded accessibility checks passed: `html` has `lang="en"`, the document has
a title, exactly one `main` exists, the one native `BUTTON` has an accessible
name and `tabIndex` 0, there are no unnamed buttons, no images lack `alt`, and
there is no horizontal overflow. Computed button foreground
`rgb(248, 250, 252)` on background `rgb(15, 23, 42)` has an approximately
17.06:1 contrast ratio.

Automated axe/Lighthouse coverage remains pending. Browser automation could
focus the native button, but its Enter/Space simulation did not increment the
counter; keyboard activation is therefore unproven and remains a
tool-specific follow-up rather than a passed gate. Full automated accessibility
coverage and keyboard activation remain release follow-ups.

Status remains release-blocked. The AgentixUI maintainer must:

1. publish `@agentix/ui@0.2.0-beta.1` to the approved npm registry with the
   `beta` dist-tag and provenance, or attach this exact tarball to an immutable
   GitHub prerelease;
2. create a never-moved tag at the full release commit; and
3. record the registry URL, registry integrity, provenance, full release
   commit, and tag here.

Until those actions complete, there is no registry URL, immutable release URL,
final immutable release/tag commit, or tag to report. The reviewed candidate
implementation commit above exists, but PortfolioTrackAndScreen must separately
review and approve the resulting immutable source and lock bytes.
