import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
