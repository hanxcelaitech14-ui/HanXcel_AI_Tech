import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.12",
    "http://192.168.1.12:3000",
    "*.local",
  ],
};

export default nextConfig;