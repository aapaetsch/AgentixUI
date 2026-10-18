import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { basename, dirname, join, resolve, sep } from "node:path";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmCache = resolve(repositoryRoot, ".npm-cache");
const consumerRoot = mkdtempSync(join(tmpdir(), "agentix-chart-consumer-"));
const packedCandidates = [];
if (!resolve(consumerRoot).startsWith(resolve(tmpdir()) + sep) || !basename(consumerRoot).startsWith("agentix-chart-consumer-")) {
  throw new Error("Refusing a chart-consumer directory outside the isolated temp root");
}

function runNpm(arguments_, cwd) {
  return execFileSync(npmCommand, arguments_, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, npm_config_cache: npmCache },
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "inherit"],
  });
}

function pack(directory) {
  const output = runNpm(
    ["pack", "--ignore-scripts", "--json", "--pack-destination", consumerRoot],
    resolve(repositoryRoot, directory),
  );
  const [metadata] = JSON.parse(output);
  const file = resolve(consumerRoot, metadata.filename);
  packedCandidates.push({ name: metadata.name, version: metadata.version, integrity: metadata.integrity, sha256: createHash("sha256").update(readFileSync(file)).digest("hex") });
  return file;
}

try {
  const artifacts = [pack("icons"), pack("."), pack("charts"), pack("charts-market")];
  writeFileSync(
    resolve(consumerRoot, "package.json"),
    `${JSON.stringify({ name: "agentix-chart-consumer-check", private: true, type: "module" }, null, 2)}\n`,
  );

  runNpm(
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--package-lock=false",
      ...artifacts,
      "react@18.3.1",
      "react-dom@18.3.1",
    ],
    consumerRoot,
  );

  const expectedFiles = [
    "node_modules/aapaetsch-ui-kit/dist/globals.css",
    "node_modules/aapaetsch-ui-kit/LICENSE",
    "node_modules/aapaetsch-charts/dist/styles.css",
    "node_modules/aapaetsch-charts/LICENSE",
    "node_modules/aapaetsch-charts/NOTICE",
    "node_modules/aapaetsch-charts-market/dist/styles.css",
    "node_modules/aapaetsch-charts-market/LICENSE",
    "node_modules/aapaetsch-charts-market/NOTICE",
  ];
  for (const relativePath of expectedFiles) {
    if (!existsSync(resolve(consumerRoot, relativePath))) {
      throw new Error(`Packed consumer is missing ${relativePath}`);
    }
  }

  const uiManifest = JSON.parse(
    readFileSync(resolve(consumerRoot, "node_modules/aapaetsch-ui-kit/package.json"), "utf8"),
  );
  if (uiManifest.peerDependencies.react !== ">=18.0.0 <20.0.0") {
    throw new Error("The packed UI kit does not advertise the verified React 18/19 range");
  }
  for (const packageName of ["aapaetsch-charts", "aapaetsch-charts-market"]) {
    const manifest = JSON.parse(
      readFileSync(resolve(consumerRoot, `node_modules/${packageName}/package.json`), "utf8"),
    );
    if (manifest.exports?.["./styles.css"] !== "./dist/styles.css") {
      throw new Error(`${packageName} does not export its compiled stylesheet`);
    }
    if (!manifest.sideEffects?.includes("**/*.css")) {
      throw new Error(`${packageName} does not preserve CSS imports during tree shaking`);
    }
  }

  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      [
        "await Promise.all([",
        "import('aapaetsch-ui-kit'),",
        "import('aapaetsch-ui-kit/finance'),",
        "import('aapaetsch-charts'),",
        "import('aapaetsch-charts/quant'),",
        "import('aapaetsch-charts-market'),",
        "import('aapaetsch-charts-market/core'),",
        "import('aapaetsch-charts-market/indicators'),",
        "import('aapaetsch-charts-market/drawings'),",
        "import('aapaetsch-charts-market/overlays'),",
        "import('aapaetsch-charts-market/controls'),",
        "import('aapaetsch-charts-market/workspace')",
        "]);",
      ].join(""),
    ],
    { cwd: consumerRoot, stdio: "inherit" },
  );

  execFileSync(
    process.execPath,
    [
      "--eval",
      "require('aapaetsch-icons'); require('aapaetsch-ui-kit'); require('aapaetsch-ui-kit/finance'); require('aapaetsch-charts'); require('aapaetsch-charts/quant'); require('aapaetsch-charts-market'); require('aapaetsch-charts-market/drawings'); require('aapaetsch-charts-market/controls'); require('aapaetsch-charts-market/workspace');",
    ],
    { cwd: consumerRoot, stdio: "inherit" },
  );

  console.log("Clean React 18 consumer verified all package entrypoints and release files.");
  mkdirSync(resolve(repositoryRoot, ".icon-validation"), { recursive: true });
  writeFileSync(resolve(repositoryRoot, ".icon-validation/chart-consumer-results.json"), JSON.stringify({ react: "18.3.1", passed: true, packages: packedCandidates }, null, 2) + "\n");
} finally {
  rmSync(consumerRoot, { recursive: true, force: true });
}
