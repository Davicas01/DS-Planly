/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = withPWAConfig({
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configurações para evitar problemas com Firebase no SSR
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Evitar que Firebase seja bundled no servidor
      config.externals = config.externals || []
      config.externals.push({
        'firebase/app': 'commonjs firebase/app',
        'firebase/auth': 'commonjs firebase/auth',
        'firebase/firestore': 'commonjs firebase/firestore',
        'firebase/storage': 'commonjs firebase/storage',
        'firebase/analytics': 'commonjs firebase/analytics',
      })
    }
    return config
  },
  // Forçar renderização client-side para páginas específicas
  async rewrites() {
    return []
  },
})

export default nextConfig
