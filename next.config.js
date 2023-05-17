/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  }
};

module.exports = nextConfig;
