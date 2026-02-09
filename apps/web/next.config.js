/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@gym/shared-kernel", "@gym/ui", "@gym/api", "@gym/db"],
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
