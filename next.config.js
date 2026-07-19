/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Reduce build workers to conserve memory
  experimental: {
    workerThreads: false,
  },
  webpack: (config) => {
    // Disable filesystem cache to save disk space in constrained environments
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
