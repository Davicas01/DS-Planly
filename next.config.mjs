/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
import path from 'path';

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    }
  ]
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
  // Configurações experimentais otimizadas para cache
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    forceSwcTransforms: true,
    // Desabilita cache em desenvolvimento para evitar problemas
    webpackBuildWorker: process.env.NODE_ENV === 'production',
  },
  // Configurações do compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // Configurações de SWC otimizadas
    styledComponents: true,
    emotion: false,
  },
  // Configurações de saída otimizadas
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Configurações de cache inteligente
  cacheHandler: process.env.NODE_ENV === 'production' ? undefined : undefined,
  // Configurações de produção
  poweredByHeader: false,
  compress: true,
  // Headers de cache otimizados
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate'
        }
      ]
    },
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        }
      ]
    }
  ],
  // Configuração do webpack otimizada para resolver problemas de cache
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Configurações específicas para desenvolvimento
    if (dev) {
      // Desabilita cache completamente em desenvolvimento
      config.cache = false;
      
      // Configurações de watch otimizadas com debounce
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/build/**',
          '**/out/**',
          '**/.git/**',
          '**/coverage/**',
          '**/.vscode/**',
          '**/temp/**',
          '**/tmp/**',
          '**/*.log',
          '**/*.lock',
          '**/*.cache'
        ],
      };
      
      // Configurações avançadas de snapshot
      config.snapshot = {
        managedPaths: [
          /^(.+?[\\/]node_modules[\\/](?!(\.pnpm|\.cache|\.temp))).*$/
        ],
        immutablePaths: [
          /^(.+?[\\/]node_modules[\\/](?!(\.pnpm|\.cache|\.temp))).*$/
        ],
        buildDependencies: {
          hash: true,
          timestamp: true,
        },
        module: {
          timestamp: true,
        },
        resolve: {
          timestamp: true,
        },
        resolveBuildDependencies: {
          hash: true,
          timestamp: true,
        },
      };
      
      // Configurações de filesystem cache em dev
      config.infrastructureLogging = {
        level: 'error',
        debug: /PackFileCache/,
      };
      
      // Configurações de memory management
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named',
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        // Desabilita minimização em dev
        minimize: false,
      };
    } else {
      // Configurações de produção para cache otimizado
      config.cache = {
        type: 'filesystem',
        version: buildId,
        cacheDirectory: path.resolve('.next/cache'),
        store: 'pack',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
    // Configurações específicas para o servidor
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'firebase/app': 'commonjs firebase/app',
        'firebase/auth': 'commonjs firebase/auth',
        'firebase/firestore': 'commonjs firebase/firestore',
        'firebase/storage': 'commonjs firebase/storage',
        'firebase/analytics': 'commonjs firebase/analytics',
      })
    }
    
    // Configuração para resolver problemas com módulos ES
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      path: false,
      os: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      util: false,
      assert: false,
      buffer: false,
      child_process: false,
      cluster: false,
      console: false,
      constants: false,
      dgram: false,
      dns: false,
      domain: false,
      events: false,
      http2: false,
      https: false,
      module: false,
      perf_hooks: false,
      process: false,
      punycode: false,
      querystring: false,
      readline: false,
      repl: false,
      stream: false,
      string_decoder: false,
      sys: false,
      timers: false,
      tty: false,
      url: false,
      v8: false,
      vm: false,
      worker_threads: false,
    }
    
    // Configuração para resolver problemas de factory function e aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd()),
      '~': path.resolve(process.cwd()),
    }
    
    // Configurações de resolver para evitar problemas
    config.resolve.extensions = [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.mjs',
      '.cjs',
      '.css',
      '.scss',
      '.sass',
    ];
    
    // Configurações de resolver symlinks
    config.resolve.symlinks = false;
    
    // Plugin para detectar módulos problemáticos
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(dev),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      })
    )
    
    // Plugin para limpar cache antigo
    if (dev) {
      config.plugins.push(
        new webpack.WatchIgnorePlugin({
          paths: [
            /\.next/,
            /node_modules/,
            /\.git/,
            /\.cache/,
            /\.temp/,
            /\.log$/,
            /\.lock$/
          ],
        })
      );
    }
    
    // Configurações de Module Federation para evitar conflitos
    if (!dev) {
      config.plugins.push(
        new webpack.container.ModuleFederationPlugin({
          name: 'planly',
          shared: {
            react: {
              singleton: true,
              eager: true,
              requiredVersion: false,
            },
            'react-dom': {
              singleton: true,
              eager: true,
              requiredVersion: false,
            },
          },
        })
      );
    }
    
    // Otimização para produção
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            enforce: true,
          },
          firebase: {
            test: /[\\/]node_modules[\\/]firebase[\\/]/,
            name: 'firebase',
            priority: 20,
            chunks: 'all',
            enforce: true,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            priority: 15,
            chunks: 'all',
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 25,
            chunks: 'all',
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            enforce: true,
          },
        },
      }
      
      // Configurações adicionais de otimização
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        mangleExports: 'deterministic',
        usedExports: true,
        sideEffects: false,
        providedExports: true,
        concatenateModules: true,
        flagIncludedChunks: true,
        occurrenceOrder: true,
        innerGraph: true,
        realContentHash: true,
      };
    }
    
    // Configurações de performance
    config.performance = {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }
    
    // Configurações de stats para debug
    config.stats = dev ? 'errors-warnings' : 'normal';
    
    // Configurações de devtool
    config.devtool = dev ? 'cheap-module-source-map' : false;
    
    return config
  },
})

export default nextConfig
