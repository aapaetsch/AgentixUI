# Reviewed supplied-results market chart release

This release promotes the exact previously reviewed tarball, rather than rebuilding uncommitted sources during publication. GitHub Actions provenance identifies the promotion job and its commit containing the immutable artifact and source snapshot. It does not claim a clean source build of this artifact.

- Package: `aapaetsch-charts-market@0.1.0-beta.1-supplied.20261015.1`
- Tag: `beta`; public access; provenance enabled.
- `package.tgz` SHA256: `bf213e605fe719e5afc11d141f7d05909157bd6c163c7c3437b2317099f31b48`
- `source.tgz` SHA256: `a08c82bb3241ae0aa6da8684ff8263a67da43a252f4cfc226d35fb6bcc71dcb2`
- Package integrity: `sha512-LhygQBJl4wqctNuafl/fr3tsMHOrY363taLBWYmEnY36JAW+urphsG3p5fBqMkMNVvbtsS54S3RBRORI0sCMww==`

The source snapshot preserves the reviewed chart implementation without including unrelated local changes. The package includes MIT LICENSE, NOTICE, its public API guide, and an opt-in guarded peer-boundary repair helper. Native CommonJS with the affected `lucide-react@0.474.0` artifact requires that documented explicit repair; no install hook is present.

Verification before promotion: TypeScript checks, 110 market tests plus five peer-boundary tests, ESM/CJS/DTS/DCTS/CSS builds, production Storybook, 15 supplied-result browser stories, native ESM/CommonJS parity for 151 root exports and all public JavaScript subpaths, SSR and typed consumers.
