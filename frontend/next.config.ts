import type { NextConfig } from "next";

// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_DOMAIN,
        port: '',
        pathname: '/media/**',
      },
    ],
    unoptimized: true,
  },
  
    // Ignorer les erreurs de certificat en développement
experimental: {
  serverActions: {
    allowedOrigins: [process.env.NEXT_PUBLIC_DOMAIN],
  },
},
};

module.exports = nextConfig;