/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Configurações para Socket.io
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('socket.io');
    }
    return config;
  },
};

export default nextConfig;
