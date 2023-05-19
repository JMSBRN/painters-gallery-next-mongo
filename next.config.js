/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    JWT_ACCES_SECRET: process.env.JWT_ACCES_SECRET,
  }
};

module.exports = nextConfig;
