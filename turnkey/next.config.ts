import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  webpack: (config, options) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;
