import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogstatic.beautytocare.com",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/page/:page/", destination: "/?page=:page" },
      { source: "/tag/:slug/page/:page/", destination: "/tag/:slug/?page=:page" },
      { source: "/author/:slug/page/:page/", destination: "/author/:slug/?page=:page" },
    ];
  },
};

export default nextConfig;
