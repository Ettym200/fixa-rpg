/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Configurações para Socket.io (usar Turbopack no Next.js 16)
  turbopack: {
    // Socket.io já funciona sem configuração extra
  },
  // Mantém webpack apenas para compatibilidade (não será usado em dev)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('socket.io');
      }
    }
    return config;
  },
};

export default nextConfig;
