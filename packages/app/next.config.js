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
  transpilePackages: [
    "antd",
    "@ant-design/cssinjs",
    "@ant-design/pro-components",
    "@ant-design/pro-descriptions",
    "@ant-design/pro-skeleton"
  ],
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};

module.exports = nextConfig;
