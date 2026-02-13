import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Khangtsen",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
