import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const artifactPath = resolve(
  process.argv[2] ?? "agentix-ui-0.2.0-beta.1.tgz"
);
const outputPath = resolve(
  process.argv[3] ?? "docs/evidence/package-file-inventory.json"
);
const bytes = readFileSync(artifactPath);
const files = execFileSync("tar", ["-tf", artifactPath], {
  encoding: "utf8",
})
  .split(/\r?\n/)
  .filter(Boolean)
  .sort();

const evidence = {
  generatedAt: new Date().toISOString(),
  artifact: {
    name: "aapaetsch-ui-kit-0.2.0-beta.1.tgz",
    package: "aapaetsch-ui-kit",
    version: "0.2.0-beta.1",
    byteLength: bytes.length,
    fileCount: files.length,
    sha1: createHash("sha1").update(bytes).digest("hex"),
    sha256: createHash("sha256").update(bytes).digest("hex"),
    integrity: `sha512-${createHash("sha512")
      .update(bytes)
      .digest("base64")}`,
  },
  files,
  assertions: {
    containsCompiledCss: files.includes("package/dist/globals.css"),
    containsLicense: files.includes("package/LICENSE"),
    containsNotice: files.includes("package/NOTICE"),
    containsThirdPartyNotices: files.includes("package/THIRD_PARTY_NOTICES"),
    containsSourceTree: files.some((file) => file.startsWith("package/src/")),
  },
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence.artifact, null, 2));
