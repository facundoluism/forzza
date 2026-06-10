import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@forzza/ui",
    "@forzza/core",
    "@forzza/config",
  ],
};

export default nextConfig;
