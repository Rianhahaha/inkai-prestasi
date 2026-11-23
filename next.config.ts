import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Static export configuration
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    localPatterns: [
      {
        pathname: '/images/**',
      },
    ],
  },
  // Disable server-side features for static export
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // Trailing slash for static hosting compatibility
  trailingSlash: true,
  // Skip type checking during build (optional, for faster builds)
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
}

export default nextConfig