/** @type {import('next').NextConfig} */
const nextConfig = {
  // face-api.js includes some Node.js-only code paths (for server-side use)
  // that reference modules like "fs" and "encoding". We only ever use
  // face-api.js in the browser, so we tell webpack to skip bundling
  // those Node-only pieces instead of failing the build on them.
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      encoding: false,
    };
    return config;
  },
};

module.exports = nextConfig;
