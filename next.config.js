/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // Domínio do UploadThing
        port: '',
        pathname: '/f/**',
      },
    ],
  },
};

module.exports = nextConfig;