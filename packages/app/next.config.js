/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
    ],
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};

module.exports = nextConfig;
