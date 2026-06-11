import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  transpilePackages: [
    "@forzza/ui",
    "@forzza/core",
    "@forzza/config",
  ],
};

module.exports = withPWA(nextConfig);
