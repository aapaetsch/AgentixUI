# Coordinated exact-archive staging

Human selection: coordinated icon/UI/chart release. The four selected archives are the original Linux CI39088908976 outputs from source commit `4fa6f4407bb8577cfd4ce56055a3e9bacd4e63ec`; they are copied byte-for-byte and never rebuilt or repacked here.

| Package | Version | SHA256 |
| --- | --- | --- |
| aapaetsch-icons |0.1.0-beta.0|4ecace9459b4b7143905a9bddcbc5d11db19eb7c96c47930f233c2115cb9eea3|
| aapaetsch-ui-kit |0.2.0-beta.3|e5115dafc3a0e20a652bba377745790ba58ed3a6c56668cc4716b134c79d14d7|
| aapaetsch-charts |0.1.0-beta.0|10f9d1152bbe401f1c708a6428c289740776257fe36da50fef9f1010cb7812c8|
| aapaetsch-charts-market |0.1.0-beta.2|51bce4897d443b2e57796a528b3bba919d203a1ca0526c458b9e717bc4637bf5|

Source snapshot: SHA256 `c0e2424aec76ecd91e8242a1fb95d63c0d54631084545ffed12cdc2516b0e6a7`, created with `git archive` from that exact commit. Its1609tracked files passed sensitive-filename screening; committed npm configuration has no literal authentication assignment. The unchanged source archive contains Windows CRLF text: raw archived lock SHA256 is `5cfeac083625c8baf023dc0495699c6f0a4a199fa0a097edc041581bbd898e51`. Explicit UTF-8 CRLF-to-LF-normalized lock SHA256 is `60fa3ba428ca90e679a9cd32692f921722ff61a630812f9411bf76ac02589e97`, matching original CI metadata. Local untracked authentication screenshots, credentials, dirty files and validation artifacts are excluded. The Git commit blob engine hash (before archive checkout line-ending conversion) is the reviewed volume-axis correction `4251440fac5fe9ea193295da43065785abeaf2c5f72c74a785ec2cb90b8af152`.

All1901packaged files were extracted and hashed against the four CI file lists; archive SHA256, SHA512 integrity, sizes and package identities were verified. Each package has MIT LICENSE and NOTICE and beta/public/provenance policy. No install, prepare, prepublish or pack lifecycle hooks exist. UI and market depend on exact icons0.1.0-beta.0; both chart packages peer on UI>=0.2.0-beta.3. React compatibility remains18–19. This coordinated set replaces Lucide dependencies and its old CommonJS peer workaround; it does not reuse the unselected17.2 package/source.

Existing release-readiness evidence at4fa reports all265tests/44files, typechecks, lint, icon/migration checks, all-package builds, Storybook, packed consumers and Linux import-case audit passed. Original CI metadata records publication failed at npm403 after archive freezing. This preparation relies on those already completed checks and does not claim a new source build or fresh remote CI verification. The original evidence and package/source inventories are included as distinct payloads.

The dedicated promotion branch is based on exact4fa, adding only a new stage-only workflow and this release directory. The workflow integrity-pins isolated npm12.2.0 on Node22.22.2, verifies every input, stages icons/UI/charts/market in that order with beta/public/provenance/ignore-scripts, authenticates stage view/download, and compares each downloaded archive's SHA256/SHA512/size/manifest immediately. Each verified partial receipt is saved before the next package; an aggregate final check requires all four. No automatic approval or direct publish command exists. Publishing requires the human's npm approval step. If a later package fails after partial staging, inspect the saved partial receipts before retrying; do not blindly create another set of stages.

Parent owns credentials, GitHub mutations, real stage/public provenance verification and final release/consumer notification. Dev Runner performs only local preparation, syntax and tamper fixtures. Stage-only credentials must cover all four names, including first publication of icons; previous market-only scope may return403. No credential values are stored in this bundle. Existing CI workflows/tags, source checkout and older17.2 artifacts remain unchanged.

