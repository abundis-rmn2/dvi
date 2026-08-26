/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    'graphology',
    'graphology-library',
    'sigma',
    '@react-sigma/core',
    '@react-sigma/layout-forceatlas2',
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    config.externals.push({
      canvas: 'commonjs canvas',
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/listing',
        destination: '/hashtags',
        permanent: true,
      },
      {
        source: '/es',
        destination: '/',
        permanent: false,
      },
      {
        source: '/es/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
