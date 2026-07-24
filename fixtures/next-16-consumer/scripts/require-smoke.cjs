const root = require("aapaetsch-ui-kit");
const finance = require("aapaetsch-ui-kit/finance");
const templates = require("aapaetsch-ui-kit/templates/investment-ops");

for (const [label, module, expected] of [
  ["root", root, "Typography"],
  ["finance", finance, "computePayoffAtExpiry"],
  ["templates", templates, "AccountSummary"],
]) {
  if (!(expected in module)) {
    throw new Error(`${label} CommonJS entry is missing ${expected}`);
  }
}
