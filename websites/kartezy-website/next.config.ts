import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript errors exist due to MUI v9 fontWeight prop changes
  // See: https://mui.com/material-ui/migration/upgrade-to-v9/
  // fontWeight fixes applied via scripts/fix-fontweight-precise.mjs
};

export default nextConfig;
