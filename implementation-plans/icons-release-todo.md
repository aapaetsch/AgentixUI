# Icon release TODO

- [x] Reconcile the verified release with the remote branch (local history is two commits ahead; no divergence).
- [x] Commit and push the library and required existing chart/dashboard sources (`4fa6f44`, feature-finance-workflows-charts).
- [ ] Publish the four beta packages through the provenance-enabled release workflow (all Linux gates passed; npm publication requires replacement CI credentials after E403).
- [ ] Verify registry versions and integrity.
- [ ] Coordinate the PortfolioTrackAndScreen installation and verify it under its dependency policy.
- [x] Record the current release outcome, immutable CI archive identities, and installation blocker in docs/evidence/icons-release.md and icons-release-artifacts.json; update after authentication is restored.
