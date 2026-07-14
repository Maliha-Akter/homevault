import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows any HTTPS domain
      },
      {
        protocol: "http",
        hostname: "**", // Allows any HTTP domain (optional)
      },
    ],
  },
};

export default nextConfig;