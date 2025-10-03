/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-cdn-hostname.cloudflare.com', // TODO: Replace with your actual Cloudflare CDN hostname
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-s3-bucket-name.s3.amazonaws.com', // For development/direct access if needed
        port: '',
        pathname: '/**',
      },
      // Add a placeholder for local development or testing if needed
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;