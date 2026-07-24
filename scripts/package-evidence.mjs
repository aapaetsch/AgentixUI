import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const lockPath = resolve("package-lock.json");
const outputPath = resolve(
  process.argv[2] ?? "docs/evidence/dependency-inventory.json"
);
const lockBytes = readFileSync(lockPath);
const lock = JSON.parse(lockBytes);
const lifecycleNames = ["preinstall", "install", "postinstall", "prepare"];

function packageName(path, metadata) {
  if (metadata.name) return metadata.name;
  return path.split("node_modules/").at(-1);
}

const packages = Object.entries(lock.packages)
  .filter(([path]) => path.includes("node_modules/"))
  .map(([path, metadata]) => {
    let installed = null;
    try {
      installed = JSON.parse(
        readFileSync(resolve(path, "package.json"), "utf8")
      );
    } catch {
      // Optional packages for other platforms are intentionally absent.
    }
    const lifecycleScripts = installed
      ? Object.fromEntries(
          lifecycleNames
            .filter((name) => installed.scripts?.[name])
            .map((name) => [name, installed.scripts[name]])
        )
      : null;
    return {
      path,
      name: packageName(path, metadata),
      version: metadata.version,
      resolved: metadata.resolved ?? null,
      integrity: metadata.integrity ?? null,
      license: installed?.license ?? metadata.license ?? null,
      dev: Boolean(metadata.dev),
      optional: Boolean(metadata.optional),
      peer: Boolean(metadata.peer),
      installedManifest: Boolean(installed),
      lifecycleScripts,
      bin: installed?.bin ?? null,
      gypfile: installed ? Boolean(installed.gypfile) : null,
      binary: installed?.binary ?? null,
      os: installed?.os ?? metadata.os ?? null,
      cpu: installed?.cpu ?? metadata.cpu ?? null,
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const sourceCounts = {};
const licenseCounts = {};
for (const item of packages) {
  const source = item.resolved
    ? new URL(item.resolved).origin
    : "lockfile-without-resolved";
  sourceCounts[source] = (sourceCounts[source] ?? 0) + 1;
  const license = item.license ?? "UNKNOWN";
  licenseCounts[license] = (licenseCounts[license] ?? 0) + 1;
}

const installedPackages = packages.filter((item) => item.installedManifest);
const missingManifestPaths = packages
  .filter((item) => !item.installedManifest)
  .map((item) => item.path);

const evidence = {
  generatedAt: new Date().toISOString(),
  toolchain: {
    node: process.version,
    npm: "run `npm --version` alongside this evidence command",
  },
  lockfile: {
    version: lock.lockfileVersion,
    sha256: createHash("sha256").update(lockBytes).digest("hex"),
  },
  summary: {
    lockPackageNodes: packages.length,
    uniqueNameVersions: new Set(
      packages.map((item) => `${item.name}@${item.version}`)
    ).size,
    installedManifestPackageNodes: installedPackages.length,
    missingManifestCount: missingManifestPaths.length,
    missingManifestPaths,
    licenseCounts,
    sourceCounts,
    installedLifecycleScriptPackages: installedPackages.filter(
      (item) => Object.keys(item.lifecycleScripts).length > 0
    ).length,
    installedPackagesWithBins: installedPackages.filter((item) => item.bin)
      .length,
    installedNativeMetadataPackages: installedPackages.filter(
      (item) => item.gypfile || item.binary
    ).length,
  },
  coverageNote:
    "Resolved URLs, integrity, and lock metadata cover every lock node. " +
    "Lifecycle, bin, and native fields come only from installed manifests; " +
    "missing optional-platform manifests are listed and are not inferred.",
  packages,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence.summary, null, 2));
