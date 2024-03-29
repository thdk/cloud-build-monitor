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
  modularizeImports: {
    '@ant-design/icons': {
      transform: '@ant-design/icons/{{member}}',
    },
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig);

