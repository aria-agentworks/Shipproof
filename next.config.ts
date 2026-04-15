import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove "standalone" — Netlify plugin handles output
  images: {
    unoptimized: true, // Netlify doesn't need image optimization
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
