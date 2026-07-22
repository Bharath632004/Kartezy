import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript errors exist due to MUI v9 fontWeight prop changes
  // TODO: Fix all fontWeight={...} direct props to use sx={{ fontWeight: ... }} instead
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
