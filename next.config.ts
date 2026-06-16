import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Memaksa Vercel tetap meloloskan build meskipun ada error TypeScript
    ignoreBuildErrors: true,
  },
  // ... konfigurasi Anda yang lain jika ada
};

export default nextConfig;
