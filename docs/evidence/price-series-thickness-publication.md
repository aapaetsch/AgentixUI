# Price-series thickness publication

Owner authorized commit and publication on November 19, 2026.

- Source commit: `024b772db0e9e6a295001bd1afeb72145e66357b`, pushed to
  `feature-finance-workflows-charts`.
- Candidate: `aapaetsch-charts-market@0.1.0-beta.3-price-thickness.20261119.1`.
- Exact UI peer: `aapaetsch-ui-kit@0.2.0-beta.3-drawing-portals.1`, an existing
  published release with the required fullscreen portal support. No new UI
  publication is needed. Icon dependency remains `0.1.0-beta.0`.
- Archive: 764,093 bytes; SHA256
  `e11c54f63b49cc5c0eb616de6d6077e4a9be70df39be824e6b55954ca64e1469`.
- Integrity:
  `sha512-yrlpFkNhyawoXWA8loITH0lsumRDLrzlxbDqyYuYqpPIPBnjETxiTm3M4ld5uQTTMPbTYfq17DRVSk0kXUR94w==`.

The isolated candidate changes only version and the UI peer versus the reviewed
workspace manifest. Original workspace versions and lockfile remain unchanged.
The release includes the existing cumulative chart source; consumer adoption is
not authorized by this publication request.

Dev Runner repeated the 584-test/70-file market suite, package typecheck,
aggregate build and production Storybook build (1,950 stories/270 docs). All
passed. The packed candidate passes ESM/CJS core validation and root SSR, public
type examples, license/notice/docs inventory and exact published UI/icon peer
checks. Other transitives and React19 came from installed dependencies; this is
not a clean-room installation or a new physical-device audit.

Independent review verified all six release paths, archive/input hashes, the two
manifest overrides and the stage-only workflow. The workflow does not rebuild,
repack, install product dependencies, or approve the owner's security challenge.

## Current state

The [staging workflow](https://github.com/aapaetsch/AgentixUI/actions/runs/44637453730)
passed at release commit `bb5503138e53e8bf246b9f1ce511f541af84b2ff` on
`release/price-thickness-20261119`. npm-staged download size/SHA256/SHA512 matched
the exact frozen archive. Stage ID: `2fe107d5-38b4-44a0-bbb3-18d52447995c`.

**Published and verified on November 19, 2026**, after owner sign-in and security-key
authentication. [Exact npm version](https://www.npmjs.com/package/aapaetsch-charts-market/v/0.1.0-beta.3-price-thickness.20261119.1).

The public npm archive matches the frozen size, SHA256 and SHA512 integrity above.
Sigstore verification passed with the GitHub Actions issuer and exact workflow
identity; SLSA subject, release source commit and workflow invocation were checked.
`beta` selects this new version. `latest` remains `0.0.0-stage`; no stable tag was
added or changed. The [portable receipt](price-series-thickness-publication.json)
records the exact artifact and provenance identity.

Local detailed evidence and scripts:
`.chart-thickness-validation/publication-20261119/`. The source, license and
frozen candidate receipts are also on the isolated release branch. No credentials
were created or changed, and the unrelated security report was preserved.
