import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://api.dicebear.com/10.x/micah/svg**")],
  },
};

export default nextConfig;
