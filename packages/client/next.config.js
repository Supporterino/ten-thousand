// Need to transpile typescript from shared workspace
const withTM = require('next-transpile-modules')(['@the-ten-thousand/shared']);
const withPWA = require('next-pwa')({
  dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(withTM(nextConfig));
