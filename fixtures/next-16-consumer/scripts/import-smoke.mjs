const root = await import("aapaetsch-ui-kit");
const finance = await import("aapaetsch-ui-kit/finance");
const templates = await import("aapaetsch-ui-kit/templates/investment-ops");

for (const [label, module, expected] of [
  ["root", root, "Typography"],
  ["finance", finance, "computePayoffAtExpiry"],
  ["templates", templates, "AccountSummary"],
]) {
  if (!(expected in module)) {
    throw new Error(`${label} ESM entry is missing ${expected}`);
  }
}
