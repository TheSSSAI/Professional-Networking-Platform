/** @type {import('next').NextConfig} */
const nextConfig = {
    // React's Strict Mode is a development-only feature that helps identify potential problems in an application.
    // It activates additional checks and warnings for its descendants.
    reactStrictMode: true,

    // The Next.js compiler, written in Rust using SWC, allows Next.js to transform and minify your JavaScript code for production.
    // This is enabled by default.
    // swcMinify: true,

    // Configure the Next.js build output to be a standalone directory,
    // which is optimal for Docker deployments as it dramatically reduces image size.
    output: 'standalone',

    // Add any other Next.js specific configurations here.
    // For example, redirects, rewrites, or image optimization domains.
    // images: {
    //   remotePatterns: [
    //     {
    //       protocol: 'https',
    //       hostname: 'assets.example.com',
    //     },
    //   ],
    // },
};

export default nextConfig;