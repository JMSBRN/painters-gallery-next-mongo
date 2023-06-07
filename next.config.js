/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    JWT_ACCES_SECRET: process.env.JWT_ACCES_SECRET,
    LOCAL_SECRET: process.env.LOCAL_SECRET,
    CALL_SECRET: process.env.CALL_SECRET,
    IMGBB_KEY: process.env.IMGBB_KEY
  }
};

module.exports = nextConfig;
