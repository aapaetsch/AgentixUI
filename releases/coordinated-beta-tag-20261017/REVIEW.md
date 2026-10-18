# Selected market beta-tag correction

The human selected the coordinated four-package release. All selected versions are already public. A separate manual publication moved market beta to the unselected refinement17.2 version. This action changes only `aapaetsch-charts-market`'s `beta` tag to selected `0.1.0-beta.2`; it publishes no new version, changes no security settings, installs/builds/repacks nothing, and does not touch `latest`.

Before mutation the workflow downloads selected beta.2 and checks exact SHA256 `51bce4897d443b2e57796a528b3bba919d203a1ca0526c458b9e717bc4637bf5`, SHA512 integrity and579682-byte size. Current beta must be unselected refinement17.2 or selected beta.2. It records before tags, runs only the explicit npm dist-tag command when needed, and verifies public beta/latest afterward. If already correct, mutation is skipped.

Promotion adds only this workflow, three technical Node helpers and this review beneath a dedicated release path, based on coordinated provenance commit `e5b014500d70b4f982990d7301747034152b0848`. Contents permission is read only; npm token is exposed only to the tag command. Original frozen inventories, scripts and archives remain unchanged. Parent owns credential use and remote execution.

