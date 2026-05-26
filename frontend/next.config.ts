import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  reactStrictMode: true,
};

export default nextConfig;
