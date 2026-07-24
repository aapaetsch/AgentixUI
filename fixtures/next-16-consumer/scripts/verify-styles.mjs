import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function collectCss(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectCss(path));
    } else if (entry.name.endsWith(".css")) {
      files.push(path);
    }
  }
  return files;
}

const cssFiles = collectCss(".next/static");
if (cssFiles.length === 0) {
  throw new Error("Next production build emitted no CSS");
}

const css = cssFiles.map((file) => readFileSync(file, "utf8")).join("\n");
for (const expected of [
  "--primary:",
  ".bg-primary",
  ".bg-card",
  ".inline-flex",
  ".rounded-",
]) {
  if (!css.includes(expected)) {
    throw new Error(`production CSS is missing expected AgentixUI style: ${expected}`);
  }
}
