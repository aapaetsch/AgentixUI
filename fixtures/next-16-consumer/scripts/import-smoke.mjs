const root = await import("@agentix/ui");
const finance = await import("@agentix/ui/finance");
const templates = await import("@agentix/ui/templates/investment-ops");

for (const [label, module, expected] of [
  ["root", root, "Typography"],
  ["finance", finance, "computePayoffAtExpiry"],
  ["templates", templates, "AccountSummary"],
]) {
  if (!(expected in module)) {
    throw new Error(`${label} ESM entry is missing ${expected}`);
  }
}
