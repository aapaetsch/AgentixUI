# Reviewed volume-axis candidate17.2

Candidate `aapaetsch-charts-market@0.1.0-beta.1-refinement.20261017.2` fixes the demonstrated dedicated-volume axis defect in published17.1. Explicit volume panes previously drew supplied counts while their public axis stayed0–1; histogram heights also used independent relative normalization. Dedicated volume-only panes now share a normal, zero-based supplied-count scale with their bars. Custom pane IDs and the legacy automatic panel work; price/study volume overlays retain their prior relative geometry. Missing/nonpositive volumes draw no bar and empty dedicated panes retain a neutral0–1 fallback. Financial observations and formulas are unchanged.

## Exact immutable artifacts

- Package: `candidate/sha256-2674aad0c81f9571316c4c1abe7e002b8553353dd2b9d725ae71fd943f65cef0.tgz`,467919bytes.
- Source: `candidate/source-sha256-b9c6a601ccb2023e3afa9ea1c807d27d43c0d43b73da5f1f4116b45240120e84.tgz`.
- Full71-file package inventory and119-input source inventory: `candidate/manifest.json`.

Source reconstruction starts with the exact published17.1 source archive `e05d5ed196cd27251ea1acd32cd8f4e341142af87a192141cbb95d1583637a11`. Only four paths differ: version-only `charts-market/package.json`, reviewed engine SHA256 `4251440fac5fe9ea193295da43065785abeaf2c5f72c74a785ec2cb90b8af152`, the new five-test volume-axis regression file, and three new volume-axis stories. All117 original inputs were checked before replacement; all other source bytes remain unchanged. The119-input archive excludes build outputs, dependencies, support configs, evidence, authentication screenshots and publication files.

The isolated build retains the original Lucide imports and peer contracts; it includes none of the concurrent icon migration. Validation reuses byte copies of already installed approved UI-kit beta.2 and Lucide0.474.0, plus installed tooling. Parent TypeScript/Tailwind support snapshots are recorded in `preparation.json` and excluded from the source archive. The published17.1 package/source and live workspace manifests/dist were not replaced.

## Executed validation

- Strict isolated source typecheck,155 market tests across25files, five peer-boundary tests and check-only peer verification passed.
- ESM/CJS, declarations and CSS build passed; isolated Storybook built59stories, including the three volume stories. Automatic prop docgen is disabled only in the validation config.
- Exact packed candidate passed five public-engine regressions for standard/custom/legacy volume panes, supplied-data replacement/empty panes, and mixed-study compatibility.
- All seven JavaScript entry points passed native ESM/CJS export parity against17.1; the root retains158exports. Strict bidirectional public props/handle/engine/snapshot type compatibility passed. Server-rendered shell remains identical. No public API or saved version1 serializer change is introduced; private engine declaration members naturally reflect the implementation.
- Packaged CSS is identical to17.1: SHA256 `78fb2be5ab652d3dfa33741104dc0379beb7506ad8a8ceddc4b2a8e12e0878b6`.
- Browser checks passed dark/light/320px volume counts and actual Canvas bar/axis-coordinate alignment, with zero axe violations and page errors. Three old OHLC layout cases also passed. The320px candidate screenshot was inspected visually.

`results.json`, `artifact-review.json`, `browser/results.json` and `logs/` contain the evidence. Local Storybook6022 serves this isolated candidate source build. Native packed consumer tests separately verify the exact frozen distribution.

## Publication and compatibility conditions

Peer dependencies, export mappings, publish policy, MIT LICENSE and NOTICE are retained exactly; package manifest change is version only. Publication policy remains beta/public/provenance. No install, prepare or packing hooks are present. The opt-in peer-boundary helper is unchanged: Lucide0.474.0 native CommonJS still needs the previously approved additive `dist/cjs/package.json` boundary. Validation used an existing approved boundary and did not run an installation or automatic repair.

This review authorizes no remote action by Dev Runner. Publication belongs to the parent release workflow and must promote these exact reviewed bytes without rebuilding or repacking. Product dependency adoption and real provider/account/physical-touch acceptance remain separate. Existing synthetic browser evidence does not claim physical Safari/iPad, native browser-UI zoom, or sustained source streaming acceptance.
