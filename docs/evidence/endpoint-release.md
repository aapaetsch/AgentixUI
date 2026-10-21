# Market chart endpoint release

Published on October 20, 2026 (America/Edmonton), following approval to publish, commit and push.

- npm: [`aapaetsch-charts-market@0.1.0-beta.3-endpoints.1`](https://www.npmjs.com/package/aapaetsch-charts-market/v/0.1.0-beta.3-endpoints.1)
- [GitHub prerelease and seven verified release assets](https://github.com/aapaetsch/AgentixUI/releases/tag/market-endpoints-v0.1.0-beta.3-endpoints.1)
- Reviewed source commit: `dc166fc6337c255a9fe5a238d44e3ecc672ad603` on `feature-finance-workflows-charts`.
- Provenance release commit: `36680abe314404ce70e3f1ada0477d9251f6c38b` on `release/market-endpoints-20261020`.
- [Successful staging workflow, attempt 1](https://github.com/aapaetsch/AgentixUI/actions/runs/39525405047/attempts/1).

The opt-in `appearance.badges.endpointValues: 'all-visible'` displays value-only outlined price and study endpoint boxes with matching colors. Full indicator identities remain accessible in labels, titles and legends. Default behavior is unchanged.

The exact frozen archive passed local review before publication. CI staged those bytes with provenance, without rebuilding or repacking. The downloaded public npm tarball matches all approved hashes and its size. Sigstore verification passed with the GitHub Actions issuer and exact workflow identity; SLSA subject, source commit and workflow invocation were checked. npm's `beta` tag selects this version; `latest` remains `0.0.0-stage`.

```text
Archive: aapaetsch-charts-market-0.1.0-beta.3-endpoints.1.tgz
Size: 528671 bytes
SHA256: 2f9f7b2d66beb7f09a27777783c9a9983add5f6644f3bbd413f0a134d91ff90f
Integrity: sha512-GwsOY8KByoLAt0Mzz/tiLh5RvddiqIaIjuUgrYeGN5fM7twxZ4XtnRB2xxpvv41AffF4DbsmtfCMnhsRre4eFw==
Source archive SHA256: 37e32ae14065a7def21f1c023e5278d59a5f0b17f8d1c3e2e0fc203849c5c6cb
Source binding SHA256: 0b8fe7ce9baf23b2531d7e4bd6d9ba15db5060370b01ce26f6a9070849b94580
```

Validation included 214 tests across 36 files, strict package/public-example checks, 66 focused Storybook type checks, ESM/CJS/declarations/CSS builds, 139 Storybook stories, public export and SSR checks, and 16 synthetic browser cases plus 16 interaction records. Earlier broad-story type errors remain documented in the candidate review. No new automated axe, Safari, physical mobile or React-peer matrix acceptance is claimed.

The workspace version and lockfile remain unchanged because publication promoted an isolated, reviewed version override. Consumer dependency and complete-lock adoption are separate work. This publication made no Portfolio source edits or new cross-chat dispatches.

Detailed local receipts are under `.chart-readability-validation/endpoint-alignment/publication/`; portable package/source archives and public verification receipts are attached to the GitHub release.
