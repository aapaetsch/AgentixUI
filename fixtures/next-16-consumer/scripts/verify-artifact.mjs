import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const packagePath = require.resolve("aapaetsch-ui-kit/package.json");
const packageRoot = resolve(packagePath, "..");
const manifest = JSON.parse(readFileSync(packagePath, "utf8"));

if (manifest.version !== "0.2.0-beta.1") {
  throw new Error(`unexpected aapaetsch-ui-kit version: ${manifest.version}`);
}

for (const scriptName of [
  "preinstall",
  "install",
  "postinstall",
  "prepare",
]) {
  if (manifest.scripts?.[scriptName]) {
    throw new Error(`consumer lifecycle script is forbidden: ${scriptName}`);
  }
}

const requiredExports = [
  ".",
  "./finance",
  "./templates/investment-ops",
  "./globals.css",
];

for (const exportName of requiredExports) {
  if (!manifest.exports?.[exportName]) {
    throw new Error(`missing export: ${exportName}`);
  }
}

for (const exportName of [
  ".",
  "./finance",
  "./templates/investment-ops",
]) {
  const entry = manifest.exports[exportName];
  const targets = [
    entry.types,
    entry.import,
    entry.require,
    entry["react-server"]?.types,
    entry["react-server"]?.import,
    entry["react-server"]?.require,
  ];
  for (const target of targets) {
    if (!target || !statSync(resolve(packageRoot, target)).isFile()) {
      throw new Error(`missing file for ${exportName}: ${target}`);
    }
  }
}

const cssPath = resolve(packageRoot, manifest.exports["./globals.css"]);
const css = readFileSync(cssPath, "utf8");
if (/@tailwind|@apply|@config/.test(css)) {
  throw new Error("published CSS still contains consumer-side Tailwind directives");
}
if (!css.includes("--primary:") || !css.includes(".bg-primary")) {
  throw new Error("published CSS is missing AgentixUI tokens or utilities");
}

for (const [script, conditions] of [
  ["scripts/import-smoke.mjs", []],
  ["scripts/require-smoke.cjs", []],
  ["scripts/import-smoke.mjs", ["--conditions=react-server"]],
  ["scripts/require-smoke.cjs", ["--conditions=react-server"]],
]) {
  execFileSync(process.execPath, [...conditions, script], {
    cwd: resolve(packageRoot, "..", "..", ".."),
    stdio: "inherit",
  });
}

for (const dependency of ["react", "react-dom"]) {
  const dependencyManifest = JSON.parse(
    readFileSync(require.resolve(`${dependency}/package.json`), "utf8")
  );
  if (dependencyManifest.version !== "19.2.8") {
    throw new Error(
      `fixture resolves ${dependency}@${dependencyManifest.version}, expected 19.2.8`
    );
  }
}
