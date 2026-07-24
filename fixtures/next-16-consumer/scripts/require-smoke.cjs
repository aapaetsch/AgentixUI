const root = require("@agentix/ui");
const finance = require("@agentix/ui/finance");
const templates = require("@agentix/ui/templates/investment-ops");

for (const [label, module, expected] of [
  ["root", root, "Typography"],
  ["finance", finance, "computePayoffAtExpiry"],
  ["templates", templates, "AccountSummary"],
]) {
  if (!(expected in module)) {
    throw new Error(`${label} CommonJS entry is missing ${expected}`);
  }
}
