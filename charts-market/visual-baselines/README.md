# Technical chart visual baselines

Reviewed production Storybook screenshots for the complete/dark, light, 20rem narrow and contained-maximize stories. Fixtures are deterministic and use no network data. Browser/OS details and SHA-256 checksums are in manifest.json.

Run scripts/technical-chart-browser-smoke.cjs against a running production Storybook server to produce candidates under output/playwright. Review candidates alongside these baselines before replacing them; font rendering can differ across browsers and operating systems. The runner also checks accessibility, overflow, interactions and performance.
