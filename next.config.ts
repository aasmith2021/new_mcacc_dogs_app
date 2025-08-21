import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cataas.com",
        port: "",
        pathname: "/cat**",
      },
    ],
  },
};

export default nextConfig;
