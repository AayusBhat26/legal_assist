/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js']
  },
  images: {
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Webpack configuration for handling certain packages
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }
    
    // Handle canvas for PDF processing
    config.externals = config.externals || []
    config.externals.push('canvas')
    
    return config
  },
  // Enable API routes to handle larger file uploads
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default nextConfig;
