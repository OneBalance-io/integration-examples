import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/tiny-secp256k1/**/*",
      "./node_modules/.pnpm/tiny-secp256k1@*/**",
    ],
  },
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
