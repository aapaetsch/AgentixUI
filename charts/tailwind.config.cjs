const baseConfig = require("../tailwind.config.js");

module.exports = {
  ...baseConfig,
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: {
    ...(baseConfig.corePlugins ?? {}),
    preflight: false,
  },
};
